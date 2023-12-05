import { json, redirect } from "@remix-run/node";
import AdminController from "../admin/AdminController.server";
import type { ExpenseInterface } from "../types";
import { commitSession, getSession } from "~/session";
import SettingsController from "../settings/SettingsController.server";
import { Expense } from "./Expense";

export default class ExpenseController {
  private request: Request;

  constructor(request: Request) {
    this.request = request;
  }

  /**
   * Retrieve all Expenses
   * @param param0 pag
   * @returns {expenses: ExpenseInterface, page: number}
   */
  public async getExpenses({
    page,
    search_term,
    type,
  }: {
    page: number;
    search_term?: string;
    type?: string;
  }): Promise<{ expenses: ExpenseInterface[]; totalPages: number }> {
    const limit = 10;
    const skipCount = (page - 1) * limit;

    const searchFilter = search_term
      ? {
          $or: [{ note: { $regex: search_term, $options: "i" } }],
        }
      : {};

    if (type) {
      searchFilter["type"] = type;
    }

    try {
      const expenses = await Expense.find(searchFilter)
        .skip(skipCount)
        .limit(limit)
        .exec();

      const totalExpensesCount = await Expense.countDocuments(
        searchFilter
      ).exec();
      const totalPages = Math.ceil(totalExpensesCount / limit);

      return { expenses, totalPages };
    } catch (error) {
      throw new Error("Error retrieving products");
    }
  }

  public async getExpense({ id }: { id: string }) {
    try {
      const product = await Product.findById(id).populate("images");
      // const reviews = await this.Reviews.find({ product: id }).populate("user");

      // product.reviews = reviews;
      return product;
    } catch (error) {
      console.error("Error retrieving product:", error);
      throw error;
    }
  }

  public createExpense = async ({
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

  public updateExpense = async ({
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
      await Product.findOneAndUpdate(
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

  public deleteExpense = async (id: string) => {
    try {
      await Product.findByIdAndDelete(id);
      return json({ message: "Product deleted successfully" }, { status: 200 });
    } catch (err) {
      throw err;
    }
  };
}
