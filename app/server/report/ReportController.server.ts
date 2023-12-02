import { addDays } from "date-fns";
import { modelsConnector } from "../mongoose.server";

export default class ReportController {
  private request: Request;
  private Employee: any;
  private Order: any;

  constructor(request: Request) {
    this.request = request;

    return (async (): Promise<ReportController> => {
      await this.initializeModels();
      return this;
    })() as unknown as ReportController;
  }

  private async initializeModels() {
    const { Employee, Order } = await modelsConnector();
    this.Employee = Employee;
    this.Order = Order;
  }

  public getEmployee = async (id: string) => {
    try {
      const employee = await this.Employee.findById(id);
      return employee;
    } catch (err) {
      throw err;
    }
  };

  public getToday = async ({ from, to }: { from?: string; to?: string }) => {
    const fromDate = from ? new Date(from) : new Date();
    fromDate.setHours(0, 0, 0, 0);
    const toDate = to ? new Date(to) : new Date();
    toDate.setHours(23, 59, 59, 999);

    const todayProducts = [];

    const orders = await this.Order.find({
      createdAt: {
        $gte: fromDate,
        $lte: toDate,
      },
    })
      .populate({
        path: "orderItems.product",
        populate: {
          path: "images",
          model: "product_images",
        },
      })
      .populate({
        path: "orderItems.stock",
        model: "stock_histories",
      })
      .exec();

    orders.forEach((order) => {
      let orderItems = order.orderItems;
      orderItems.forEach((item) => {
        todayProducts.push(item);
      });
    });

    const groupedItems = todayProducts.reduce((result, item) => {
      const stockId = item?.stock?._id;

      // Check if the product ID is already in the result array
      const existingItem = result.find(
        (groupedItem) => groupedItem?.stock?._id === stockId
      );

      if (existingItem) {
        // If the product ID exists, update the quantity
        existingItem.quantity += item.quantity;
        existingItem.totalPrice += item.quantity * item?.stock?.price;
      } else {
        // If the product ID doesn't exist, add a new entry
        result.push({
          stock: item.stock,
          quantity: item.quantity,
          product: item.product,
          totalPrice: item.quantity * item?.stock?.price,
        });
      }

      return result;
    }, []);

    return groupedItems;
  };

  public salesReport = async ({ from, to }: { from?: string; to?: string }) => {
    const fromDate = from ? new Date(from) : new Date();
    fromDate.setHours(0, 0, 0, 0);
    const toDate = to ? new Date(to) : new Date();
    toDate.setHours(23, 59, 59, 999);

    const result = await this.Order.aggregate([
      {
        $match: {
          createdAt: { $gte: fromDate, $lte: toDate },
          // status: "paid",
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
        },
      },
    ]);
    const labels = result.map((entry: any) => entry.month);
    const revenueData = result.map((entry: any) => entry.revenue);
    let salesData = {
      labels,
      datasets: [
        {
          label: "Revenue",
          data: revenueData,
          borderColor: "rgb(53, 162, 235)",
          backgroundColor: "rgba(53, 162, 235, 0.5)",
          tension: 0.2,
        },
      ],
    };

    return salesData;
  };
}

// const totalPrice = await this.Order.aggregate([
//   {
//     $match: {
//       createdAt: {
//         $gte: fromDate,
//         $lte: toDate,
//       },
//     },
//   },
//   {
//     $group: {
//       _id: null,
//       total: {
//         $sum: "$totalPrice",
//       },
//     },
//   },
// ]);
