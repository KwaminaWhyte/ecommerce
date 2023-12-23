import type { Schema } from "mongoose";
import mongoose from "../mongoose.server";
import type { RestockHistoryInterface } from "../types";

const RestockHistorySchema: Schema = new mongoose.Schema(
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
    note: String,
  },
  { timestamps: true }
);

let RestockHistory: mongoose.Model<RestockHistoryInterface>;
try {
  RestockHistory = mongoose.model<RestockHistoryInterface>("restocks");
} catch (error) {
  RestockHistory = mongoose.model<RestockHistoryInterface>(
    "restocks",
    RestockHistorySchema
  );
}

export { RestockHistory };
