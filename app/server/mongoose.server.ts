import mongoose from "mongoose";
import { UserSchema } from "./user/User";
import {
  CategorySchema,
  ProductImagesSchema,
  ProductsSchema,
  StockHistorySchema,
} from "./product/Product";
import { OrderSchema, ShippingTimelineSchema } from "./order/Order";
import { CartSchema } from "./cart/Cart";
import { AdminSchema } from "./admin/Admin";
import { EmployeeSchema } from "./employee/Employee";
import { NotificationSchema } from "./settings/Notification";
import { SMSSchema } from "./settings/SMS";
import { WishListSchema } from "./wishlist/WishList";
import { AddressSchema } from "./user/Address";
import { GeneralSettingsSchema } from "./settings/GeneralSettings";
import { ClientDetailSchema } from "./onboarding/ClientDetail";
import { VisitSchema } from "./user/Visit";
import { SMSHistorySchema } from "./notification/SMSHistory";
import { EmailHistorySchema } from "./notification/EmailHistory";
import { PaymentApiSchema } from "./settings/PaymentApi";
import { LogSchema } from "./logs/Log";

// Establish the default connection to the central database
mongoose.connect(process.env.DATABASE_URL as string);
const centralDb = mongoose.connection;

// Handle connection events for the central database
centralDb.on(
  "error",
  console.error.bind(console, "Database connection error:")
);
centralDb.once("open", () => {
  console.log("Connected to Database");
});

/** Establish connection to the appropriate database based on the domain
 */
const modelsConnector = async () => {
  let Admin,
    Cart,
    User,
    Order,
    Product,
    Address,
    WishList,
    Employee,
    SMSHistory,
    EmailHistory,
    SMSSettings,
    ProductImages,
    ProductCategory,
    GeneralSettings,
    ShippingTimeline,
    NotificationSettings,
    PaymentApi,
    UserVisit,
    StockHistory,
    GuestCart,
    Log,
    ClientDetail;

  try {
    Admin = centralDb.model("admins");
    Employee = centralDb.model("employees");
    User = centralDb.model("users");
    Product = centralDb.model("products");
    ProductCategory = centralDb.model("categories");
    ProductImages = centralDb.model("product_images");
    Order = centralDb.model("orders");
    Cart = centralDb.model("carts");
    NotificationSettings = centralDb.model("notification_settings");
    SMSSettings = centralDb.model("sms_settings");
    SMSHistory = centralDb.model("sms_history");
    EmailHistory = centralDb.model("email_history");
    ShippingTimeline = centralDb.model("shipping_timelines");
    WishList = centralDb.model("wishlistss");
    Address = centralDb.model("addresses");
    GeneralSettings = centralDb.model("general_settings");
    ClientDetail = centralDb.model("client_details");
    UserVisit = centralDb.model("user_visits");
    PaymentApi = centralDb.model("payment_apis");
    StockHistory = centralDb.model("stock_histories");
    Log = centralDb.model("logs");
  } catch (error) {
    Admin = centralDb.model("admins", AdminSchema);
    Employee = centralDb.model("employees", EmployeeSchema);
    User = centralDb.model("users", UserSchema);
    Product = centralDb.model("products", ProductsSchema);
    ProductCategory = centralDb.model("categories", CategorySchema);
    ProductImages = centralDb.model("product_images", ProductImagesSchema);
    Order = centralDb.model("orders", OrderSchema);
    Cart = centralDb.model("carts", CartSchema);
    ShippingTimeline = centralDb.model(
      "shipping_timelines",
      ShippingTimelineSchema
    );
    NotificationSettings = centralDb.model(
      "notification_settings",
      NotificationSchema
    );
    SMSSettings = centralDb.model("sms_settings", SMSSchema);
    SMSHistory = centralDb.model("sms_history", SMSHistorySchema);
    EmailHistory = centralDb.model("email_history", EmailHistorySchema);
    WishList = centralDb.model("wishlistss", WishListSchema);
    Address = centralDb.model("addresses", AddressSchema);
    GeneralSettings = centralDb.model(
      "general_settings",
      GeneralSettingsSchema
    );
    ClientDetail = centralDb.model("client_details", ClientDetailSchema);
    UserVisit = centralDb.model("user_visits", VisitSchema);
    PaymentApi = centralDb.model("payment_apis", PaymentApiSchema);
    StockHistory = centralDb.model("stock_histories", StockHistorySchema);
    Log = centralDb.model("logs", LogSchema);
  }

  return {
    Cart,
    User,
    Admin,
    Order,
    Product,
    Address,
    WishList,
    Employee,
    SMSHistory,
    EmailHistory,
    SMSSettings,
    ProductImages,
    GeneralSettings,
    ProductCategory,
    ShippingTimeline,
    NotificationSettings,
    ClientDetail,
    UserVisit,
    PaymentApi,
    StockHistory,
    Log,
  };
};

export { centralDb, modelsConnector, mongoose };

// import mongoose from "mongoose";

// // Connect to your MongoDB instance
// mongoose.connect(process.env.DATABASE_URL as string);

// const db = mongoose.connection;

// db.on("error", console.error.bind(console, "MongoDB connection error:"));
// db.once("open", () => {
//   console.log("Connected to MongoDB");
// });

// export { mongoose, db };
