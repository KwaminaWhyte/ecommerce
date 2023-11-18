import { mongoose } from "../mongoose.server";

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
  },

  {
    timestamps: true,
  }
);

const ShippingTimelineSchema = new mongoose.Schema(
  {
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "orders",
    },
    location: String,
    message: String,
    status: {
      type: String,
      enum: [
        "pending",
        "paid",
        "shipped",
        "delivered",
        "cancelled",
        "refunded",
        "failed",
        "disputed",
      ],
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);

export { OrderSchema, ShippingTimelineSchema };
