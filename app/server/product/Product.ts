import type { Schema } from "mongoose";
import { mongoose } from "../mongoose.server";

const ProductImagesSchema: Schema = new mongoose.Schema(
  {
    name: String,
    url: String,
    size: Number,
    type: String,
    imageId: String,
  },
  { timestamps: true }
);

const ProductCategorySchema: Schema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    status: {
      type: String,
    },
    featured: {
      type: Boolean,
      default: false,
    },
    products: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "products",
      },
    ],
  },
  { timestamps: true }
);

const ProductsSchema: Schema = new mongoose.Schema(
  {
    name: String,
    description: String,
    price: {
      type: Number,
      required: true,
    },
    quantity: {
      type: Number,
      default: 1,
    },
    availability: String,
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "product_categories",
      required: false,
    },
    images: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "product_images",
      },
    ],
    quantitySold: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

const StockHistorySchema: Schema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "products",
      required: true,
    },
    quantity: Number,
    operation: String,
  },
  { timestamps: true }
);

export {
  ProductImagesSchema,
  ProductCategorySchema,
  ProductsSchema,
  StockHistorySchema,
};
