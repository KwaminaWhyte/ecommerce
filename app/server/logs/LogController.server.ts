import { Log } from "./Log";

export default class LogController {
  private Order: any;

  /**
   * Initialize a LogController instance
   * @returns this
   */
  constructor() {
    console.log("Log Class");
  }

  public async create({
    user,
    action,
    order,
    product,
  }: {
    user: string;
    action: string;
    order?: string;
    product?: string;
  }) {
    await Log.create({
      user,
      action,
      order,
      product,
    });

    return true;
  }

  public async getLogs({
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

    const logs = await Log.find(searchFilter)
      .skip(skipCount)
      .limit(limit)
      .populate("employee")
      .sort({ createdAt: "desc" })
      .exec();

    const totalLogsCount = await Log.countDocuments(searchFilter).exec();
    const totalPages = Math.ceil(totalLogsCount / limit);

    return { logs, totalPages };
  }

  allEmployeeLogs = async ({ user }: { user: string }) => {
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
}
