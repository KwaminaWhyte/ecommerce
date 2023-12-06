import { json, redirect } from "@remix-run/node";
import AdminController from "../admin/AdminController.server";
import EmployeeAuthController from "../employee/EmployeeAuthController";
import type { ProductInterface } from "../types";
import { commitSession, getSession } from "~/session";
import { Category, Product, StockHistory } from "./Product";
import SettingsController from "../settings/SettingsController.server";
import excelToJson from "convert-excel-to-json";
import XLSX from "xlsx";
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
        .exec();

      const totalProductsCount = await Product.countDocuments(
        searchFilter
      ).exec();
      const totalPages = Math.ceil(totalProductsCount / limit);

      return { products, totalPages };
    } catch (error) {
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
    imgSrc,
    category,
    quantity,
    costPrice,
  }: {
    name: string;
    price: string;
    description: string;
    imgSrc: string;
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
      return json(
        {
          errors: { name: "Product already exists" },
          fields: { name, price, description, category },
        },
        { status: 400 }
      );
    }

    // const myString = imgSrc;
    // const myArray = myString.split("|");
    // let image = await this.ProductImages.create({
    //   url: myArray[0],
    //   imageId: myArray[1],
    // });

    let productData = {
      name,
      description,
      category,
      availability: "available",
      quantity: parseInt(quantity),
      costPrice: parseFloat(costPrice),
    };

    if (!generalSettings.separateStocks) {
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

    if (generalSettings.separateStocks) {
      const productt = await Product.findById(product?._id);
      let stockk = await StockHistory.create({
        user: adminId,
        product: productt?._id,
        quantity,
        price: parseFloat(price),
        costPrice: parseFloat(cost_price),
      });

      productt.stockHistory.push(stockk);
      await productt.save();
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
      await Product.findOneAndUpdate(
        { _id },
        {
          name,
          price,
          description,
          category,
          quantity,
          costPrice,
        }
      );

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
      return json(
        {
          errors: {
            name: "Error occured while updating product",
            error: error,
          },
          fields: { name, price, description },
        },
        { status: 400 }
      );
    }
  };

  public stockProduct = async ({
    _id,
    quantity,
    operation,
    price,
    costPrice,
  }: {
    _id: string;
    quantity: string;
    operation: string;
    price: string;
    costPrice: string;
  }) => {
    const session = await getSession(this.request.headers.get("Cookie"));
    const product = await Product.findById(_id);

    const adminController = await new AdminController(this.request);
    const adminId = await adminController.getAdminId();
    if (adminId) {
      let stockk = await StockHistory.create({
        user: adminId,
        product: _id,
        quantity,
        operation,
        price: parseFloat(price),
        costPrice: parseFloat(costPrice),
      });

      product.quantity += parseInt(quantity);
      product.stockHistory.push(stockk);
      await product.save();

      session.flash("message", {
        title: "Product Stocked Successful",
        status: "success",
      });
      return redirect(`/console/products/${_id}`, {
        headers: {
          "Set-Cookie": await commitSession(session),
        },
      });
    }

    const employeeAuthController = await new EmployeeAuthController(
      this.request
    );
    const userId = await employeeAuthController.getEmployeeId();

    if (userId) {
      let stockk = await StockHistory.create({
        user: userId,
        product: _id,
        quantity,
        operation,
        price: parseFloat(price),
        costPrice: parseFloat(cost_price),
      });

      product.quantity += parseInt(quantity);
      product.stockHistory.push(stockk);
      await product.save();

      session.flash("message", {
        title: "Product Stocked Successful",
        status: "success",
      });
      return redirect(`/console/products/${_id}`, {
        headers: {
          "Set-Cookie": await commitSession(session),
        },
      });
    }
  };

  public deleteProduct = async (id: string) => {
    try {
      await Product.findByIdAndDelete(id);
      return json({ message: "Product deleted successfully" }, { status: 200 });
    } catch (err) {
      console.log(err);
    }
  };

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
    const existingCategory = await Category.findOne({ name });

    if (existingCategory) {
      return json(
        {
          errors: { name: "Category already exists" },
          fields: { name, status, description },
        },
        { status: 400 }
      );
    }

    // create new admin
    const category = await Category.create({
      name,
      status,
      description,
      featured: featured == "true" ? 1 : 0,
    });

    if (!category) {
      return json(
        {
          error: "Error creating category",
          fields: { name, status, description },
        },
        { status: 400 }
      );
    }
    return redirect("/console/categories", 200);
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
    try {
      await Category.findOneAndUpdate(
        { _id },
        {
          name,
          status,
          description,
          featured: featured == "true" ? true : false,
        }
      );
      return redirect(`/console/categories`, 200);
    } catch (error) {
      return json(
        {
          errors: {
            name: "Error occured while updating product category",
            error: error,
          },
          fields: { name, status, description },
        },
        { status: 400 }
      );
    }
  }

  public deleteCategory = async (id: string) => {
    try {
      await Category.findByIdAndDelete(id);
      return json(
        { message: "Product Category deleted successfully" },
        { status: 200 }
      );
    } catch (err) {
      console.log(err);
    }
  };

  public addProductImage = async ({
    productId,
    image,
  }: {
    productId: string;
    image: string;
  }) => {
    try {
      const product = await Product.findById(productId);

      let imageRes = await this.ProductImages.create({
        url: image.url,
        imageId: image.externalId,
        product: product._id,
      });

      product.images.push(imageRes);
      await product.save();

      return redirect(`/console/products/${product._id}`);
    } catch (err) {
      console.log(err);
    }
  };
}
