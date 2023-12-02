import mongoose from "../mongoose.server";
import type { OredrInterface } from "../types";

const OrderSchema = new mongoose.Schema(
  {
    orderId: {
      type: String,
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    shippingAddress: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "addresses",
    },
    orderItems: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "products",
          required: true,
        },
        stock: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "stock_histories",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
        },
        color: String,
      },
    ],
    totalPrice: {
      type: Number,
      required: true,
    },
    deliveryDate: {
      type: Date,
      default: Date.now,
    },
    paymentInfo: {
      paymentMethod: String,
      cardNumber: String,
    },
    status: {
      type: String,
      enum: [
        "unpaid",
        "paid",
        "shipped",
        "delivered",
        "cancelled",
        "refunded",
        "failed",
        "disputed",
      ],
      default: "unpaid",
    },
    shipping_timelines: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "shipping_timelines",
      },
    ],
    deliveryStatus: {
      type: String,
      enum: ["pending", "shipped", "delivered"],
      default: "pending",
    },
    paymentReff: String,
    sales_person: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "employees",
      required: true,
    },
    attendant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "employees",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

let Order: mongoose.Model<OredrInterface>;
try {
  Order = mongoose.model<OredrInterface>("orders");
} catch (error) {
  Order = mongoose.model<OredrInterface>("orders", OrderSchema);
}

export { Order };

// const ShippingTimelineSchema = new mongoose.Schema(
//   {
//     order: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "orders",
//     },
//     location: String,
//     message: String,
//     status: {
//       type: String,
//       enum: [
//         "pending",
//         "paid",
//         "shipped",
//         "delivered",
//         "cancelled",
//         "refunded",
//         "failed",
//         "disputed",
//       ],
//       default: "pending",
//     },
//   },
//   {
//     timestamps: true,
//   }
// );
