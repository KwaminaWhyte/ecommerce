import { json, redirect } from "@remix-run/node";
import { connectToDomainDatabase } from "../mongoose.server";
import AdminController from "../admin/AdminController.server";
import EmployeeAuthController from "../employee/EmployeeAuthController";
import type { ProductInterface } from "../types";
import { commitSession, getSession } from "~/session";

export default class ProductController {
  private request: Request;
  private domain: string;
  private Product: any;
  private ProductImages: any;
  private ProductCategory: any;
  private StockHistory: any;
  private Reviews: any;

  constructor(request: Request) {
    this.request = request;
    this.domain = (this.request.headers.get("host") as string).split(":")[0];

    return (async (): Promise<ProductController> => {
      // Call async functions here
      // await sleep(500);
      await this.initializeModels();
      // Constructors return `this` implicitly, but this is an IIFE, so
      // return `this` explicitly (else we'd return an empty object).
      return this;
    })() as unknown as ProductController;
  }

  private async initializeModels() {
    const { Product, ProductImages, ProductCategory, StockHistory } =
      await connectToDomainDatabase();

    this.Product = Product;
    this.ProductImages = ProductImages;
    this.ProductCategory = ProductCategory;
    this.StockHistory = StockHistory;
  }

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
      const products = await this.Product.find(searchFilter)
        .skip(skipCount)
        .limit(limit)
        .populate("images")
        .populate("category")
        .populate("stockHistory")
        .exec();

      const totalProductsCount = await this.Product.countDocuments(
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
      const product = await this.Product.findById(id).populate("images");
      // const reviews = await this.Reviews.find({ product: id }).populate("user");

      // product.reviews = reviews;
      return product;
    } catch (error) {
      console.error("Error retrieving product:", error);
      throw error;
    }
  }

  public createProduct = async ({
    name,
    price,
    description,
    imgSrc,
    category,
    quantity,
  }: {
    name: string;
    price: string;
    description: string;
    imgSrc: string;
    category: string;
    quantity: string;
  }) => {
    const session = await getSession(this.request.headers.get("Cookie"));
    const existingProduct = await this.Product.findOne({ name });

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

    // create new admin
    const product = await this.Product.create({
      name,
      // price: parseFloat(price),
      description,
      category: category ? category : null,
      availability: "available",
      // images: [image._id],
      quantity: parseInt(quantity),
    });

    const adminController = await new AdminController(this.request);
    const adminId = await adminController.getAdminId();

    const productt = await this.Product.findById(product?._id);

    let stockk = await this.StockHistory.create({
      user: adminId,
      product: productt?._id,
      quantity,
      price: parseFloat(price),
    });

    productt.stockHistory.push(stockk);
    await productt.save();

    if (!product) {
      return json(
        {
          error: "Error creating product",
          fields: { name, price, description, category },
        },
        { status: 400 }
      );
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

  public updateProduct = async ({
    _id,
    name,
    price,
    description,
    category,
    quantity,
  }: {
    _id: string;
    name: string;
    price: string;
    description: string;
    category: string;
    quantity: string;
  }) => {
    const session = await getSession(this.request.headers.get("Cookie"));

    try {
      await this.Product.findOneAndUpdate(
        { _id },
        {
          name,
          price,
          description,
          category,
          quantity,
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
  }: {
    _id: string;
    quantity: string;
    operation: string;
    price: string;
  }) => {
    const session = await getSession(this.request.headers.get("Cookie"));
    const product = await this.Product.findById(_id);

    const adminController = await new AdminController(this.request);
    const adminId = await adminController.getAdminId();
    if (adminId) {
      let stockk = await this.StockHistory.create({
        user: adminId,
        product: _id,
        quantity,
        operation,
        price: parseFloat(price),
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
      let stockk = await this.StockHistory.create({
        user: userId,
        product: _id,
        quantity,
        operation,
        price: parseFloat(price),
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
      await this.Product.findByIdAndDelete(id);
      return json({ message: "Product deleted successfully" }, { status: 200 });
    } catch (err) {
      throw err;
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
      const categories = await this.ProductCategory.find(searchFilter)
        .skip(skipCount)
        .limit(limit)
        .exec();

      const totalProductsCount = await this.ProductCategory.countDocuments(
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
      const categories = await this.ProductCategory.find({
        featured: true,
      }).exec();

      return categories;
    } catch (error) {
      console.error("Error retrieving categories:", error);
    }
  }

  public async getActiveCategories() {
    try {
      const categories = await this.ProductCategory.find({
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
    const existingCategory = await this.ProductCategory.findOne({ name });

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
    const category = await this.ProductCategory.create({
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
    return redirect("/console/product_categories", 200);
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
      await this.ProductCategory.findOneAndUpdate(
        { _id },
        {
          name,
          status,
          description,
          featured: featured == "true" ? true : false,
        }
      );
      return redirect(`/console/product_categories`, 200);
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
      await this.ProductCategory.findByIdAndDelete(id);
      return json(
        { message: "Product Category deleted successfully" },
        { status: 200 }
      );
    } catch (err) {
      throw err;
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
      const product = await this.Product.findById(productId);

      let imageRes = await this.ProductImages.create({
        url: image.url,
        imageId: image.externalId,
        product: product._id,
      });

      product.images.push(imageRes);
      await product.save();

      return redirect(`/console/products/${product._id}`);
    } catch (err) {
      throw err;
    }
  };
}
