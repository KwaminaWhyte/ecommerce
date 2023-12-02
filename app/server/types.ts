import type { Document } from "mongodb";
// import type { Types } from "mongoose";

export interface StockHistoryInterface extends Document {
  _id: string; //Types.ObjectId
  user: AdminInterface;
  product: ProductInterface;
  price: number;
  quantity: number;
  oeperation: string;
}

export interface ProductInterface extends Document {
  _id: string; //Types.ObjectId
  name: string;
  description: string;
  quantity: number;
  quantitySold: number;
  price: number;
  images: ImageInterface[];
  availability: string;
  createdAt: Date;
  updatedAt: Date;
  stockHistory: StockHistoryInterface[];
}

export interface ImageInterface extends Document {
  _id: string;
  name: string;
  url: string;
  size: number;
  type: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CategoryInterface extends Document {
  _id: string;
  name: string;
  description: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface AdminInterface extends Document {
  _id: string;
  username: string;
  email: string;
  role?: string;
  permissions?: [{ name: string; action: string }];
  createdAt: Date;
  updatedAt: Date;
}

export interface UserInterface extends Document {
  _id: string;
  username: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CustomerInterface extends Document {
  _id: string;
  username: string;
  firstName: string;
  middleName: string;
  lastName: string;
  phone: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface EmployeeInterface extends Document {
  _id: string;
  firstName: string;
  middleName: string;
  lastName: string;
  username: string;
  email: string;
  role?: string;
  password: string;
  permissions?: [{ name: string; action: string }];
  createdAt: Date;
  updatedAt: Date;
}

export interface CartInterface extends Document {
  _id: string;
  user: string;
  product: ProductInterface;
  stock: StockHistoryInterface;
  quantity: number;
  color: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface OredrInterface extends Document {
  _id: string;
  orderId: string;
  orderItems: CartInterface[];
  totalPrice: number;
  deliveryStatus: string;
  status: string;
  user: UserInterface;
  shippingAddress: AddressInterface;
  paymentInfo: PaymentInterface;
  deliveryDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface AddressInterface extends Document {
  _id: string;
  user: UserInterface;
  title: String;
  address: String;
  street: String;
  city: String;
  state: String;
  zip: String;
  default: Boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface PaymentInterface extends Document {
  _id: string;
  orderId: string;
  paymentMethod: string;
  phoneNumber: string;
  cardNumber: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface EmailHistoryInterface extends Document {
  _id: string;
  from: string;
  to: string;
  subject: string;
  body: string;
  storeName: string;
}
