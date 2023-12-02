import { redirect, json } from "@remix-run/node";
import { modelsConnector } from "../mongoose.server";
import SettingsController from "../settings/SettingsController.server";
import moment from "moment";
import PaymentController from "../payment/PaymentController";
import SenderController from "../notification/SenderController";
import { commitSession, getSession } from "~/session";

export default class LogController {
  private Order: any;
  private Product: any;
  private Cart: any;
  private User: any;
  private Log: any;

  /**
   * Initialize a LogController instance
   * @returns this
   */
  constructor() {
    return (async (): Promise<LogController> => {
      const { User, Product, Order, Log } = await modelsConnector();

      this.User = User;
      this.Product = Product;
      this.Order = Order;
      this.Log = Log;

      return this;
    })() as unknown as LogController;
  }

  public async create({
    user,
    action,
    order,
  }: {
    user: string;
    action: string;
    order?: string;
  }) {
    await this.Log.create({
      user,
      action,
      order: order ? order : "",
    });

    return true;
  }

  public async getOrders({
    page,
    search_term,
    status = "pending",
  }: {
    page: number;
    search_term?: string;
    status?: string;
  }) {
    const limit = 10; // Number of orders per page
    const skipCount = (page - 1) * limit; // Calculate the number of documents to skip

    const searchFilter = search_term
      ? {
          $or: [
            { orderId: { $regex: search_term, $options: "i" } },
            { deliveryStatus: { $regex: status, $options: "i" } },
          ],
        }
      : {};

    const orders = await this.Order.find(searchFilter)
      .skip(skipCount)
      .limit(limit)
      .populate({
        path: "orderItems.stock",
        // model: "stock_histories",
      })
      .populate({
        path: "orderItems.product",
        populate: {
          path: "images",
          model: "product_images",
        },
      })
      .populate("user")
      .sort({ createdAt: "desc" })
      .exec();

    const totalOrdersCount = await this.Order.countDocuments(
      searchFilter
    ).exec();
    const totalPages = Math.ceil(totalOrdersCount / limit);

    return { orders, totalPages };
  }

  allUserOrders = async ({ user }: { user: string }) => {
    // const limit = 10; // Number of orders per page
    // const skipCount = (page - 1) * limit; // Calculate the number of documents to skip
    //
    // const totalOrdersCount = await Order.countDocuments({}).exec();
    // const totalPages = Math.ceil(totalOrdersCount / limit);

    try {
      const orders = await this.Order.find({ user })
        // .skip(skipCount)
        // .limit(limit)
        .populate({
          path: "orderItems.product",
          populate: {
            path: "images",
            model: "product_images",
          },
        })
        .populate("user")
        .exec();

      return orders;
    } catch (error) {
      console.error("Error retrieving orders:", error);
    }
  };
}
