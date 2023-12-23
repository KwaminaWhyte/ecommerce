import type { Schema } from "mongoose";
import mongoose from "../mongoose.server";
import type { StockHistoryInterface } from "../types";

const StockHistorySchema: Schema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "admins",
      required: true,
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "products",
      required: true,
    },
    costPrice: {
      type: Number,
    },
    price: {
      type: Number,
      required: true,
    },
    quantity: Number,
    operation: String,
  },
  { timestamps: true }
);

let StockHistory: mongoose.Model<StockHistoryInterface>;
try {
  StockHistory = mongoose.model<StockHistoryInterface>("stocks");
} catch (error) {
  StockHistory = mongoose.model<StockHistoryInterface>(
    "stocks",
    StockHistorySchema
  );
}

export { StockHistory };
