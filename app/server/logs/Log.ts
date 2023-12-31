import mongoose from "../mongoose.server";
import type { LogInterface } from "../types";

const LogSchema = new mongoose.Schema(
  {
    employee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "employees",
      required: true,
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "products",
    },
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "orders",
    },
    action: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

let Log: mongoose.Model<LogInterface>;
try {
  Log = mongoose.model<LogInterface>("logs");
} catch (error) {
  Log = mongoose.model<LogInterface>("logs", LogSchema);
}

export { Log };
