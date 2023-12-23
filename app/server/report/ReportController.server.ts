import { Employee } from "../employee/Employee";
import { Expense } from "../expense/Expense";
import { Order } from "../order/Order";
import { Payment } from "../payment/PaymentDetails";
import { Product } from "../product/Product";

export default class ReportController {
  private request: Request;
  private Employee: any;
  private Order: any;

  constructor(request: Request) {
    this.request = request;
  }

  public getEmployee = async (id: string) => {
    try {
      const employee = await Employee.findById(id);
      return employee;
    } catch (err) {
      console.log(err);
    }
  };

  public getToday = async ({ from, to }: { from?: string; to?: string }) => {
    const fromDate = from ? new Date(from) : new Date();
    fromDate.setHours(0, 0, 0, 0);
    const toDate = to ? new Date(to) : new Date();
    toDate.setHours(23, 59, 59, 999);

    const todayProducts = [];

    const orders = await Order.find({
      createdAt: {
        $gte: fromDate,
        $lte: toDate,
      },
    })
      .populate({
        path: "orderItems.product",
        populate: {
          path: "images",
          model: "images",
        },
      })
      .populate({
        path: "orderItems.stock",
        model: "stocks",
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

    const result = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: fromDate, $lte: toDate },
          // status: "paid",
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m", date: "$createdAt" },
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

  public getFinancialReport = async ({
    from,
    to,
  }: {
    from?: string;
    to?: string;
  }) => {
    const fromDate = from ? new Date(from) : new Date();
    fromDate.setHours(0, 0, 0, 0);
    const toDate = to ? new Date(to) : new Date();
    toDate.setHours(23, 59, 59, 999);

    // Aggregation for orders
    const orderResult = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: fromDate, $lte: toDate },
          paymentStatus: "paid",
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m", date: "$createdAt" },
          },
          revenue: { $sum: "$totalPrice" },
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

    // Aggregation for expenses
    const expenseResult = await Expense.aggregate([
      {
        $match: {
          createdAt: { $gte: fromDate, $lte: toDate },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m", date: "$createdAt" },
          },
          expenses: { $sum: "$amount" },
        },
      },
    ]);

    // Combine results based on month labels
    const combinedResult = orderResult.map((orderEntry) => {
      const correspondingExpenseEntry = expenseResult.find(
        (expenseEntry) => expenseEntry._id === orderEntry.month
      );
      return {
        month: orderEntry.month,
        revenue: orderEntry.revenue,
        expenses: correspondingExpenseEntry
          ? correspondingExpenseEntry.expenses
          : 0,
      };
    });
    // Transform the combined result for the desired format
    const labels = combinedResult.map((entry) => entry.month);
    const revenueData = combinedResult.map((entry) => entry.revenue);
    const expensesData = combinedResult.map((entry) => entry.expenses);

    let financialData = {
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

    // transaction history here
    const transactionHistory = await Payment.find({
      createdAt: { $gte: fromDate, $lte: toDate },
    })
      .populate("order")
      // .populate({
      //   path: "order",
      //   populate: {
      //     path: "orderItems.product",
      //     populate: {
      //       path: "images",
      //       model: "images",
      //     },
      //   },
      // })
      .exec();

    // expense history here
    const expenseHistory = await Expense.find({
      createdAt: { $gte: fromDate, $lte: toDate },
    }).exec();

    // calculate total revenue
    let totalRevenue = 0;
    transactionHistory.forEach((transaction: any) => {
      totalRevenue += transaction.amount;
    });

    // calculate total cost price
    const orderss = await Order.find({
      deliveryDate: {
        $gte: fromDate,
        $lte: toDate,
      },
    })
      .populate("orderItems.product") // Assuming you want to populate the product details
      .exec();
    // Calculate total cost price, total selling price, and profit for all orders
    let totalCostPrice = 0;
    let totalSellingPrice = 0;
    let totalProfit = 0;
    orderss.forEach((orderItems) => {
      orderItems.orderItems.forEach((item) => {
        totalCostPrice += item.costPrice * item.quantity;
        totalSellingPrice += item.sellingPrice * item.quantity;
      });
    });

    return {
      financialData,
      transactionHistory,
      expenseHistory,
      soldData: {
        totalCostPrice,
        totalSellingPrice,
        totalProfit: totalSellingPrice - totalCostPrice,
      },
    };
  };

  public inventoryReport = async ({
    from,
    to,
  }: {
    from?: string;
    to?: string;
  }) => {
    const fromDate = from ? new Date(from) : new Date();
    fromDate.setHours(0, 0, 0, 0);
    const toDate = to ? new Date(to) : new Date();
    toDate.setHours(23, 59, 59, 999);

    const topSellingProducts = await Product.find()
      .populate("category")
      .sort({ quantitySold: -1 })
      .limit(10);

    const notSellingProducts = await Product.find()
      .populate("category")
      .sort({ quantitySold: 1 })
      .limit(10);

    const lowStockProducts = await Product.find({
      quantity: { $lt: 10 },
    }).populate("category");

    return {
      topSellingProducts,
      notSellingProducts,
      lowStockProducts,
    };
  };
}
