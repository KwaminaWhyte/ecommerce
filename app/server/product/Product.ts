import type { Schema } from "mongoose";
import mongoose from "../mongoose.server";
import type {
  CategoryInterface,
  ImageInterface,
  ProductInterface,
  StockHistoryInterface,
} from "../types";

const ProductImageSchema: Schema = new mongoose.Schema(
  {
    name: String,
    url: String,
    size: Number,
    type: String,
    imageId: String,
  },
  { timestamps: true }
);

const CategorySchema: Schema = new mongoose.Schema(
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

const ProductSchema: Schema = new mongoose.Schema(
  {
    name: String,
    description: String,
    price: {
      type: Number,
    },
    costPrice: {
      type: Number,
    },
    quantity: {
      type: Number,
      default: 1,
    },
    availability: String,
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "categories",
      required: false,
    },
    images: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "images",
      },
    ],
    quantitySold: {
      type: Number,
      default: 0,
    },
    stockHistory: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "stock_histories",
      },
    ],
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

let Product: mongoose.Model<ProductInterface>;
let ProductImage: mongoose.Model<ImageInterface>;
let Category: mongoose.Model<CategoryInterface>;
let StockHistory: mongoose.Model<StockHistoryInterface>;
try {
  Product = mongoose.model<ProductInterface>("products");
  ProductImage = mongoose.model<ImageInterface>("images");
  Category = mongoose.model<CategoryInterface>("categories");
  StockHistory = mongoose.model<StockHistoryInterface>("categories");
} catch (error) {
  Product = mongoose.model<ProductInterface>("products", ProductSchema);
  ProductImage = mongoose.model<ImageInterface>("images", ProductImageSchema);
  Category = mongoose.model<CategoryInterface>("categories", CategorySchema);
  StockHistory = mongoose.model<StockHistoryInterface>(
    "stock_histories",
    StockHistorySchema
  );
}

export { Product, ProductImage, Category, StockHistory };
