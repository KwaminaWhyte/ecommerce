import { redirect } from "@remix-run/node";
import AdminController from "../admin/AdminController.server";
import EmployeeAuthController from "../employee/EmployeeAuthController";
import type { ProductInterface } from "../types";
import { commitSession, getSession } from "~/session";
import { Category, Product, ProductImage } from "./Product";
import SettingsController from "../settings/SettingsController.server";
import { StockHistory } from "./Stock";
import { RestockHistory } from "./RestockHistory";

export default class ProductController {
  private request: Request;

  constructor(request: Request) {
    this.request = request;
  }

  /**
   * Retrieve all Product
   * @param param0 pag
   * @returns {products: ProductInterface, page: number}
   */
  public async getProducts({
    page,
    search_term,
  }: {
    page: number;
    search_term?: string;
  }): Promise<{ products: ProductInterface[]; totalPages: number }> {
    const limit = 10; // Number of orders per page
    const skipCount = (page - 1) * limit; // Calculate the number of documents to skip

    const searchFilter = search_term
      ? {
          $or: [
            { name: { $regex: search_term, $options: "i" } }, // Case-insensitive search for email
            { description: { $regex: search_term, $options: "i" } }, // Case-insensitive search for username
          ],
        }
      : {};

    try {
      const products = await Product.find(searchFilter)
        .skip(skipCount)
        .limit(limit)
        .populate("images")
        .populate("category")
        .populate("stockHistory")
        .sort({ name: "asc" })
        .exec();

      const totalProductsCount = await Product.countDocuments(
        searchFilter
      ).exec();
      const totalPages = Math.ceil(totalProductsCount / limit);

      return { products, totalPages };
    } catch (error) {
      console.log(error);

      throw new Error("Error retrieving products");
    }
  }

  public async getProduct({ id }: { id: string }) {
    try {
      const product = await Product.findById(id).populate("images");
      // const reviews = await this.Reviews.find({ product: id }).populate("user");

      // product.reviews = reviews;
      return product;
    } catch (error) {
      console.error("Error retrieving product:", error);
    }
  }

  public createProduct = async ({
    name,
    price,
    description,
    category,
    quantity,
    costPrice,
  }: {
    name: string;
    price: string;
    description: string;
    category: string;
    quantity: string;
    costPrice: string;
  }) => {
    const session = await getSession(this.request.headers.get("Cookie"));
    const adminController = await new AdminController(this.request);
    const adminId = await adminController.getAdminId();
    const existingProduct = await Product.findOne({ name });
    const settingsController = await new SettingsController(this.request);
    const generalSettings = await settingsController.getGeneralSettings();

    if (existingProduct) {
      session.flash("message", {
        title: "Product already exists",
        status: "error",
      });
      return redirect(`/console/products`, {
        headers: {
          "Set-Cookie": await commitSession(session),
        },
      });
    }

    let productData = {
      name,
      description,
      category: category != "" ? category : null,
      availability: "available",
      quantity: parseInt(quantity),
      costPrice: parseFloat(costPrice),
    };

    if (!generalSettings?.separateStocks) {
      productData["price"] = parseFloat(price);
    }
    const product = await Product.create(productData);

    if (!product) {
      session.flash("message", {
        title: "Error Adding Product",
        status: "error",
      });
      return redirect(`/console/products`, {
        headers: {
          "Set-Cookie": await commitSession(session),
        },
      });
    }

    if (generalSettings?.separateStocks) {
      const newProduct = await Product.findById(product?._id);
      let stock = await StockHistory.create({
        user: adminId,
        product: product?._id,
        quantity: parseInt(quantity),
        price: parseFloat(price),
        costPrice: parseFloat(costPrice),
      });
      newProduct.stockHistory.push(stock);
      await newProduct.save();
    }

    session.flash("message", {
      title: "Product Added Successful",
      status: "success",
    });
    return redirect(`/console/products`, {
      headers: {
        "Set-Cookie": await commitSession(session),
      },
    });
  };

  /**
   * Import products from csv
   * @param data Array of products
   * @returns null
   */
  public importBatch = async (data) => {
    const session = await getSession(this.request.headers.get("Cookie"));

    const products = await Product.create(data);
    if (!products) {
      session.flash("message", {
        title: "Error Importing Products",
        status: "error",
      });
      return redirect(`/console/products`, {
        headers: {
          "Set-Cookie": await commitSession(session),
        },
      });
    }

    session.flash("message", {
      title: "Products Imported Successful",
      status: "success",
    });
    return redirect(`/console/products`, {
      headers: {
        "Set-Cookie": await commitSession(session),
      },
    });
  };

  /**
   * Update product
   * @param param0 _id, name, price, description, category, quantity, costPrice
   * @returns null
   */
  public updateProduct = async ({
    _id,
    name,
    price,
    description,
    category,
    quantity,
    costPrice,
  }: {
    _id: string;
    name: string;
    price: string;
    description: string;
    category: string;
    quantity: string;
    costPrice: string;
  }) => {
    const session = await getSession(this.request.headers.get("Cookie"));

    try {
      await Product.findByIdAndUpdate(_id, {
        name,
        price,
        description,
        category: category != "" ? category : null,
        quantity,
        costPrice,
      });

      session.flash("message", {
        title: "Product Updated Successful",
        status: "success",
      });
      return redirect(`/console/products`, {
        headers: {
          "Set-Cookie": await commitSession(session),
        },
      });
    } catch (error) {
      console.log(error);

      session.flash("message", {
        title: "Error Updating Product",
        status: "error",
      });
      return redirect(`/console/products`, {
        headers: {
          "Set-Cookie": await commitSession(session),
        },
      });
    }
  };

  public stockProduct = async ({
    _id,
    quantity,
    operation,
    price,
    costPrice,
    note,
  }: {
    _id: string;
    quantity: string;
    operation: string;
    price: string;
    costPrice: string;
    note: string;
  }) => {
    const session = await getSession(this.request.headers.get("Cookie"));
    const product = await Product.findById(_id);
    const generalSettings = await new SettingsController(
      this.request
    ).getGeneralSettings();

    const adminController = await new AdminController(this.request);
    const adminId = await adminController.getAdminId();

    if (generalSettings?.separateStocks) {
      let stock = await StockHistory.create({
        user: adminId,
        product: _id,
        quantity,
        price: parseFloat(price),
        costPrice: parseFloat(costPrice),
      });
      product.quantity += parseInt(quantity);
      product.stockHistory.push(stock);
      await product.save();
    } else {
      product.price = parseFloat(price);
      product.quantity += parseInt(quantity);
      await product.save();
    }

    await RestockHistory.create({
      user: adminId,
      product: _id,
      quantity,
      price: parseFloat(price),
      costPrice: parseFloat(costPrice),
      note,
    });

    session.flash("message", {
      title: "Product Stocked Successful",
      status: "success",
    });
    return redirect(`/console/products/${_id}`, {
      headers: {
        "Set-Cookie": await commitSession(session),
      },
    });
  };

  public getStockHistory = async ({ id }: { id: string }) => {
    const session = await getSession(this.request.headers.get("Cookie"));

    try {
      const stockHistory = await RestockHistory.find({ product: id })
        .populate("user")
        .sort({ createdAt: -1 })
        .exec();

      return stockHistory;
    } catch (error) {
      console.log(error);

      session.flash("message", {
        title: "Error Getting Stock History",
        status: "error",
      });
      return redirect(`/console/products/${id}`, {
        headers: {
          "Set-Cookie": await commitSession(session),
        },
      });
    }
  };

  public deleteProduct = async (id: string) => {
    const session = await getSession(this.request.headers.get("Cookie"));

    try {
      await Product.findByIdAndDelete(id);

      session.flash("message", {
        title: "Product Deleted Successful",
        status: "success",
      });
      return redirect(`/console/products`, {
        headers: {
          "Set-Cookie": await commitSession(session),
        },
      });
    } catch (err) {
      console.log(err);

      session.flash("message", {
        title: "Error Deleting Product",
        status: "error",
      });
      return redirect(`/console/products`, {
        headers: {
          "Set-Cookie": await commitSession(session),
        },
      });
    }
  };

  public async getAllCategories() {
    try {
      const categories = await Category.find();

      return categories;
    } catch (error) {
      console.error("Error retrieving categories:", error);
    }
  }

  public async getCategories({
    page,
    search_term,
  }: {
    page: number;
    search_term: string;
  }) {
    const limit = 10; // Number of orders per page
    const skipCount = (page - 1) * limit; // Calculate the number of documents to skip

    const searchFilter = search_term
      ? {
          $or: [
            { name: { $regex: search_term, $options: "i" } }, // Case-insensitive search for email
            { description: { $regex: search_term, $options: "i" } }, // Case-insensitive search for username
          ],
        }
      : {};

    try {
      const categories = await Category.find(searchFilter)
        .skip(skipCount)
        .limit(limit)
        .exec();

      const totalProductsCount = await Category.countDocuments(
        searchFilter
      ).exec();
      const totalPages = Math.ceil(totalProductsCount / limit);

      return { categories, totalPages };
    } catch (error) {
      console.error("Error retrieving categories:", error);
    }
  }

  public async getFeaturedCategories() {
    try {
      const categories = await Category.find({
        featured: true,
      }).exec();

      return categories;
    } catch (error) {
      console.error("Error retrieving categories:", error);
    }
  }

  public async getActiveCategories() {
    try {
      const categories = await Category.find({
        status: "active",
      }).exec();

      return categories;
    } catch (error) {
      console.error("Error retrieving categories:", error);
    }
  }

  public async createCategory({
    name,
    description,
    status,
    featured,
  }: {
    name: string;
    description: string;
    status: string;
    featured: string;
  }) {
    const session = await getSession(this.request.headers.get("Cookie"));

    const existingCategory = await Category.findOne({ name });

    if (existingCategory) {
      session.flash("message", {
        title: "Category already exists",
        status: "error",
      });
      return redirect(`/console/categories`, {
        headers: {
          "Set-Cookie": await commitSession(session),
        },
      });
    }

    const category = await Category.create({
      name,
      status,
      description,
      featured: featured == "true" ? 1 : 0,
    });

    if (!category) {
      session.flash("message", {
        title: "Error Adding Category",
        status: "error",
      });
      return redirect(`/console/categories`, {
        headers: {
          "Set-Cookie": await commitSession(session),
        },
      });
    }

    session.flash("message", {
      title: "Category Added Successful",
      status: "success",
    });
    return redirect(`/console/categories`, {
      headers: {
        "Set-Cookie": await commitSession(session),
      },
    });
  }

  public async updateCategory({
    _id,
    name,
    description,
    status,
    featured,
  }: {
    _id: string;
    name: string;
    description: string;
    status: string;
    featured: string;
  }) {
    const session = await getSession(this.request.headers.get("Cookie"));

    try {
      await Category.findByIdAndUpdate(_id, {
        name,
        status,
        description,
        featured: featured == "true" ? true : false,
      });
      session.flash("message", {
        title: "Category Updated Successful",
        status: "success",
      });
      return redirect(`/console/categories`, {
        headers: {
          "Set-Cookie": await commitSession(session),
        },
      });
    } catch (error) {
      console.log();

      session.flash("message", {
        title: "Error Updating Category",
        status: "error",
      });
      return redirect(`/console/categories`, {
        headers: {
          "Set-Cookie": await commitSession(session),
        },
      });
    }
  }

  public deleteCategory = async (id: string) => {
    const session = await getSession(this.request.headers.get("Cookie"));

    try {
      await Category.findByIdAndDelete(id);

      session.flash("message", {
        title: "Category Deleted Successful",
        status: "success",
      });
      return redirect(`/console/categories`, {
        headers: {
          "Set-Cookie": await commitSession(session),
        },
      });
    } catch (err) {
      console.log(err);
      session.flash("message", {
        title: "Error Deleting Category",
        status: "error",
      });
      return redirect(`/console/categories`, {
        headers: {
          "Set-Cookie": await commitSession(session),
        },
      });
    }
  };

  public addProductImage = async ({
    productId,
    images,
  }: {
    productId: string;
    images: any;
  }) => {
    const session = await getSession(this.request.headers.get("Cookie"));

    const imagePromises = images.map(async (image) => {
      try {
        // Assuming ProductImage.create returns a promise
        const imageRes = await ProductImage.create({
          url: image,
          product: productId,
        });
        return imageRes;
      } catch (error) {
        console.error(`Error creating product image: ${error}`);
        // Handle the error as needed
        return null;
      }
    });

    // Wait for all promises to resolve
    const results = await Promise.all(imagePromises);
    const successfulResults = results.filter((result) => result !== null);
    console.log(successfulResults);

    try {
      const product = await Product.findById(productId);

      const successfulIds = successfulResults.map((result) => result?._id);
      product.images.push(...successfulIds);
      await product.save();

      session.flash("message", {
        title: "Image Added Successful",
        status: "success",
      });
      return redirect(`/console/products/${productId}`, {
        headers: {
          "Set-Cookie": await commitSession(session),
        },
      });
    } catch (err) {
      console.log(err);
      session.flash("message", {
        title: "Error Adding Image",
        status: "error",
      });
      return redirect(`/console/products/${productId}`, {
        headers: {
          "Set-Cookie": await commitSession(session),
        },
      });
    }
  };
}
