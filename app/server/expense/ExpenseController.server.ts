import { redirect } from "@remix-run/node";
import type { ExpenseInterface } from "../types";
import { commitSession, getSession } from "~/session";
import { Expense } from "./Expense";
import AdminController from "../admin/AdminController.server";

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
      const product = await Expense.findById(id);
      return product;
    } catch (error) {
      console.error("Error retrieving product:", error);
    }
  }

  public createExpense = async ({
    note,
    amount,
    category,
  }: {
    note: string;
    amount: string;
    category: string;
  }) => {
    const adminController = await new AdminController(this.request);
    const session = await getSession(this.request.headers.get("Cookie"));
    const admin = await adminController.getAdminId();

    const product = await Expense.create({
      amount: parseFloat(amount),
      category,
      note,
      admin,
    });

    if (!product) {
      session.flash("message", {
        title: "Error Adding Expense",
        status: "error",
      });
      return redirect(`/console/expenses`, {
        headers: {
          "Set-Cookie": await commitSession(session),
        },
      });
    }

    session.flash("message", {
      title: "Expense Added Successful",
      status: "success",
    });
    return redirect(`/console/expenses`, {
      headers: {
        "Set-Cookie": await commitSession(session),
      },
    });
  };

  public updateExpense = async ({
    _id,
    amount,
    category,
    note,
  }: {
    _id: string;
    note: string;
    amount: string;
    category: string;
  }) => {
    const session = await getSession(this.request.headers.get("Cookie"));

    try {
      await Expense.findByIdAndUpdate(_id, {
        amount,
        category,
        note,
      });

      session.flash("message", {
        title: "Expense Updated Successful",
        status: "success",
      });
      return redirect(`/console/expenses`, {
        headers: {
          "Set-Cookie": await commitSession(session),
        },
      });
    } catch (error) {
      console.log(error);
      session.flash("message", {
        title: "Error Updateding Expense",
        status: "error",
      });
      return redirect(`/console/expenses`, {
        headers: {
          "Set-Cookie": await commitSession(session),
        },
      });
    }
  };

  public deleteExpense = async (id: string) => {
    const session = await getSession(this.request.headers.get("Cookie"));

    try {
      await Expense.findByIdAndDelete(id);
      session.flash("message", {
        title: "Expense deleted Successful",
        status: "success",
      });
      return redirect(`/console/expenses`, {
        headers: {
          "Set-Cookie": await commitSession(session),
        },
      });
    } catch (err) {
      console.log(err);
      session.flash("message", {
        title: "Error deleting Expense",
        status: "error",
      });
      return redirect(`/console/expenses`, {
        headers: {
          "Set-Cookie": await commitSession(session),
        },
      });
    }
  };
}
