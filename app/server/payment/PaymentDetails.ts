import mongoose from "../mongoose.server";
import type { PaymentInterface } from "../types";

const PaymentDetailSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
    },
    method: {
      type: String,
      required: true,
    },
    mobileNumber: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const GuestPaymentDetailsSchema = new mongoose.Schema(
  {
    guestId: {
      type: String,
      required: true,
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "products",
    },
    quantity: {
      type: Number,
      required: true,
    },
    color: String,
  },
  {
    timestamps: true,
  }
);

const PaymentSchema = new mongoose.Schema(
  {
    cashier: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "employees",
    },
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "orders",
    },
    method: {
      type: String,
      enum: ["momo", "cash"],
      default: "cash",
    },
    mobileNumber: {
      type: String,
    },
    amount: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

let Payment: mongoose.Model<PaymentInterface>;
try {
  Payment = mongoose.model<PaymentInterface>("payments");
} catch (error) {
  Payment = mongoose.model<PaymentInterface>("payments", PaymentSchema);
}

export { Payment };
