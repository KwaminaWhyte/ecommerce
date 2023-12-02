import mongoose from "../mongoose.server";
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

// let PaymentDetails: mongoose.Model<PaymentDetailInterface>;
// try {
//   PaymentDetails = mongoose.model<PaymentDetailInterface>("carts");
// } catch (error) {
//   PaymentDetails = mongoose.model<PaymentDetailInterface>("carts", PaymentDetailSchema);
// }
export { PaymentDetailSchema, GuestPaymentDetailsSchema };
