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
}
