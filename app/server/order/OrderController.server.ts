import { redirect, json } from "@remix-run/node";
import SettingsController from "../settings/SettingsController.server";
import moment from "moment";
import PaymentController from "../payment/PaymentController";
import SenderController from "../notification/SenderController";
import { commitSession, getSession } from "~/session";
import LogController from "../logs/LogController.server";
import EmployeeAuthController from "../employee/EmployeeAuthController";
import { Order } from "./Order";
import { Product, StockHistory } from "../product/Product";
import { Cart } from "../cart/Cart";

export default class OrderController {
  private request: Request;

  /**
   * Initialize a OrderController instance
   * @param request This Fetch API interface represents a resource request.
   * @returns this
   */
  constructor(request: Request) {
    this.request = request;
  }

  private generateOrderId(prefix: string) {
    const length = 12 - prefix.length;
    const randomString = Math.random()
      .toString(36)
      .substring(2, 2 + length);
    return `${prefix}-${randomString}`;
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

    const orders = await Order.find({ onCredit: false, ...searchFilter })
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
          model: "images",
        },
      })
      .populate("user")
      .sort({ createdAt: "desc" })
      .exec();

    const totalOrdersCount = await Order.countDocuments(searchFilter).exec();
    const totalPages = Math.ceil(totalOrdersCount / limit);

    return { orders, totalPages };
  }

  public async getOrdersOnCredit({
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

    const orders = await Order.find({ onCredit: true, ...searchFilter })
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
          model: "images",
        },
      })
      .populate("user")
      .sort({ createdAt: "desc" })
      .exec();

    const totalOrdersCount = await Order.countDocuments(searchFilter).exec();
    const totalPages = Math.ceil(totalOrdersCount / limit);

    return { orders, totalPages };
  }

  /**
   * A function to get details of an Order
   * @param orderId The current order ID
   * @returns Order object
   */
  public async getOrder({ orderId }: { orderId: string }) {
    try {
      const order = await Order.findById(orderId)
        .populate({
          path: "orderItems.product",
          populate: {
            path: "images",
            model: "images",
          },
        })
        .populate({
          path: "user",
          select: "_id firstName lastName email phone address",
        })
        .populate({
          path: "shippingAddress",
        })
        .populate({
          path: "orderItems.stock",
          model: "stock_histories",
        })
        .exec();

      return order;
    } catch (error) {
      console.error("Error retrieving order:", error);
    }
  }

  allUserOrders = async ({ user }: { user: string }) => {
    // const limit = 10; // Number of orders per page
    // const skipCount = (page - 1) * limit; // Calculate the number of documents to skip
    //
    // const totalOrdersCount = await Order.countDocuments({}).exec();
    // const totalPages = Math.ceil(totalOrdersCount / limit);

    try {
      const orders = await Order.find({ user })
        // .skip(skipCount)
        // .limit(limit)
        .populate({
          path: "orderItems.product",
          populate: {
            path: "images",
            model: "images",
          },
        })
        .populate("user")
        .exec();

      return orders;
    } catch (error) {
      console.error("Error retrieving orders:", error);
    }
  };

  /**
   * first step in checkout
   * @param param0 user: userId
   * @returns null
   */
  public checkout = async ({
    user,
    customerName,
    customerPhone,
    sales_person,
    amountPaid,
    onCredit = "false",
  }: {
    user: string;
    customerName: string;
    customerPhone: string;
    sales_person: string;
    onCredit: string;
    amountPaid: string;
  }) => {
    const session = await getSession(this.request.headers.get("Cookie"));
    const employeeAuth = await new EmployeeAuthController(this.request);
    const attendant = await employeeAuth.getEmployeeId();

    const settingsController = await new SettingsController(this.request);
    const settings = await settingsController.getGeneralSettings();

    try {
      const cartItems = await Cart.find({ user })
        .populate("product")
        .populate({
          path: "stock",
          model: "stock_histories",
        })
        .exec();

      if (cartItems.length === 0) {
        session.flash("message", {
          title: "Cart is empty",
          status: "error",
        });
        return redirect(`/pos/products`, {
          headers: {
            "Set-Cookie": await commitSession(session),
          },
        });
      }

      let totalPrice = 0;
      if (settings?.separateStocks) {
        cartItems?.forEach((cartItem) => {
          const productPrice = cartItem?.stock?.price;
          const quantity = cartItem.quantity;
          totalPrice += productPrice * quantity;
        });
      } else {
        cartItems?.forEach((cartItem) => {
          const productPrice = cartItem?.product?.price;
          const quantity = cartItem.quantity;
          totalPrice += productPrice * quantity;
        });
      }

      let newCartItems: any = [];
      cartItems?.forEach((cartItem) => {
        const quantity = cartItem.quantity;
        const costPrice = cartItem?.product?.price;
        const sellingPrice = cartItem?.product?.price;
        const product = cartItem?.product?._id;
        const stock = cartItem?.stock?._id;
        newCartItems.push({
          product,
          costPrice,
          sellingPrice,
          stock,
          quantity,
        });
      });

      const orderId = this.generateOrderId(settings?.orderIdPrefix);
      const order = await Order.create({
        orderId,
        user,
        totalPrice,
        orderItems: newCartItems,
        deliveryStatus: "delivered",
        paymentStatus: onCredit == "true" ? "pending" : "paid",
        sales_person,
        attendant,
        onCredit: onCredit == "true" ? true : false,
        status: "completed",
        amountPaid: amountPaid ? parseInt(amountPaid) : 0,
      });

      await Cart.deleteMany({ user }).exec();

      for (const item of cartItems) {
        const product = await Product.findById(item.product?._id);
        const stock = await StockHistory.findById(item.stock?._id);

        if (product) {
          product.quantitySold += item.quantity;
          product.quantity -= item.quantity;
          await product.save();
        }

        if (stock) {
          stock.quantity -= item.quantity;
          await stock.save();
        }
      }

      const logController = await new LogController();
      await logController.create({
        user,
        action: "Place and order",
        order: order?._id,
      });

      return await Order.findById(order?._id)
        .populate({
          path: "orderItems.product",
          populate: {
            path: "images",
            model: "images",
          },
        })
        .populate({
          path: "user",
          select: "_id firstName lastName email phone address",
        })
        // .populate({
        //   path: "shippingAddress",
        // })
        .exec();
    } catch (error) {
      console.log(error);

      session.flash("message", {
        title: "Checkout Failed",
        status: "error",
      });
      return redirect(`/pos/products`, {
        headers: {
          "Set-Cookie": await commitSession(session),
        },
      });
    }
  };

  public completeCheckout = async ({
    orderId,
    shippingAddress,
  }: {
    shippingAddress: string;
    orderId: string;
  }) => {
    const paymentController = await new PaymentController(this.request);
    const senderController = await new SenderController(this.request);
    let order = await Order.findOne({ _id: orderId }).populate("user").exec();

    if (!order) {
      return json(
        {
          errors: { name: "Order doesnt exists" },
        },
        { status: 400 }
      );
    }

    let hubtelResponse = await paymentController.requestHubtelPayment({
      totalAmount: order?.totalPrice,
      customerName: order?.user?.username,
      orderId: order?.orderId,
    });

    if (hubtelResponse?.status == "Success") {
      await Order.findOneAndUpdate(
        { _id: orderId },
        {
          shippingAddress,
        }
      );
      senderController.createEmail({
        subject: "Order Successful",
        body: `some email body!`,
      });

      return redirect(`${hubtelResponse?.data?.checkoutUrl}`);
    }

    return redirect(`/proceed_order/${orderId}`);
  };

  public orderStatus = async ({
    status,
    _id,
  }: {
    status: string;
    _id: string;
  }) => {
    try {
      await Order.findOneAndUpdate(
        { _id },
        {
          deliveryStatus: status,
        }
      ).exec();

      return true;
    } catch (error) {
      console.error("Error chanign order status:", error);
      return json(
        {
          error: "Error creating cart",
          fields: {},
        },
        { status: 400 }
      );
    }
  };

  public orderPaymentStatus = async ({
    status,
    orderId,
    paymentReff,
  }: {
    status: string;
    orderId: string;
    paymentReff: string;
  }) => {
    try {
      await Order.findOneAndUpdate(
        { orderId },
        {
          paymentStatus: status,
          paymentReff,
        }
      ).exec();

      return true;
    } catch (error) {
      console.error("Error chanign order status:", error);
      return json(
        {
          error: "Error creating cart",
          fields: {},
        },
        { status: 400 }
      );
    }
  };

  public getOrderStats = async () => {
    const currentDate = new Date();
    const startOfLast7Months = moment(currentDate)
      .subtract(7, "months")
      .startOf("month")
      .toDate();

    let orderStats;

    // Create an aggregation pipeline to calculate revenue and expenses
    const result = await Order.aggregate([
      {
        $match: {
          deliveryDate: { $gte: startOfLast7Months },
          paymentStatus: "paid",
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m", date: "$deliveryDate" },
          },
          revenue: { $sum: "$totalPrice" },
          expenses: { $sum: 0 },
        },
      },
      {
        $sort: { _id: 1 }, // Sort by date in ascending order
      },
      {
        $project: {
          _id: 0, // Exclude _id field from the result
          month: "$_id", // Rename _id to 'month'
          revenue: 1,
          expenses: 1,
        },
      },
    ]);

    // Process 'result' to create your chart data
    const labels = result.map((entry: any) => entry.month);
    const revenueData = result.map((entry: any) => entry.revenue);
    const expensesData = result.map((entry: any) => entry.expenses);

    return {
      labels,
      datasets: [
        {
          label: "Revenue",
          data: revenueData,
          borderColor: "rgb(53, 162, 235)",
          backgroundColor: "rgba(53, 162, 235, 0.5)",
          tension: 0.2,
        },
        {
          label: "Expenses",
          data: expensesData,
          borderColor: "rgb(255, 99, 132)",
          backgroundColor: "rgba(255, 99, 132, 0.5)",
          tension: 0.2,
        },
      ],
    };
  };

  public getTotals = async () => {
    // Calculate Total Revenue
    const revenueResult = await Order.aggregate([
      {
        $match: { paymentStatus: "paid" },
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$totalPrice" },
        },
      },
    ]);

    const totalRevenue =
      revenueResult.length > 0 ? revenueResult[0].totalRevenue : 0;

    // Calculate Orders Completed
    const completedCount = await Order.countDocuments({
      deliveryStatus: { $in: ["shipped", "delivered"] },
    });

    // Calculate Pending Orders
    const pendingCount = await Order.countDocuments({
      paymentStatus: { $in: ["pending", "paid"] },
    });
    const bestsellingProducts = await Product.find()
      .populate("images")
      .sort({ quantitySold: -1 })
      .limit(5)
      .exec();

    const today = new Date();
    today.setHours(0, 0, 0);
    const tomorrow = new Date();
    tomorrow.setHours(23, 59, 59);

    const ordersCountPipeline = [
      {
        $match: {
          paymentStatus: "paid",
          createdAt: {
            $gte: today,
            $lt: tomorrow,
          },
        },
      },
      {
        $count: "totalOrdersToday",
      },
    ];

    // Pipeline to calculate total revenue
    const ordersRevenuePipeline = [
      {
        $match: {
          paymentStatus: "paid",
          createdAt: {
            $gte: today,
            $lt: tomorrow,
          },
        },
      },
      {
        $group: {
          _id: null,
          totalTodayRevenue: { $sum: "$totalPrice" },
        },
      },
    ];

    // Execute both pipelines and combine results
    const ordersCountResult = await Order.aggregate(ordersCountPipeline);
    const ordersRevenueResult = await Order.aggregate(ordersRevenuePipeline);

    // const combinedResult = {
    //   totalOrdersToday: ordersCountResult[0].totalOrdersToday,
    //   totalTodayRevenue: ordersRevenueResult[0].totalTodayRevenue,
    // };

    return {
      totalRevenue,
      completedCount,
      pendingCount,
      bestsellingProducts,
      totalOrdersToday: ordersCountResult[0]?.totalOrdersToday,
      totalTodayRevenue: ordersRevenueResult[0]?.totalTodayRevenue,
    };
  };
}
