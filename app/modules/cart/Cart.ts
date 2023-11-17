import { mongoose } from "../mongoose.server";

const CartSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
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
    inscription: String,
  },
  {
    timestamps: true,
  }
);

const GuestCartsSchema = new mongoose.Schema(
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
    inscription: String,
  },
  {
    timestamps: true,
  }
);

// let Carts: mongoose.Model<CartInterface>;
// try {
//   Carts = mongoose.model<CartInterface>("carts");
// } catch (error) {
//   Carts = mongoose.model<CartInterface>("carts", CartSchema);
// }
export { CartSchema, GuestCartsSchema };
