import { type Schema } from "mongoose";
import mongoose from "../mongoose.server";
import type { ExpenseInterface } from "../types";

const ExpenseSchema: Schema = new mongoose.Schema(
  {
    admin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "admins",
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    note: {
      type: String,
      required: false,
    },
  },
  { timestamps: true }
);

let Expense: mongoose.Model<ExpenseInterface>;
try {
  Expense = mongoose.model<ExpenseInterface>("expenses");
} catch (error) {
  Expense = mongoose.model<ExpenseInterface>("expenses", ExpenseSchema);
}

export { Expense };
