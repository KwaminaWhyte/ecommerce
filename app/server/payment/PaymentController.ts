import {
  createCookieSessionStorage,
  json,
  redirect,
  type SessionStorage,
} from "@remix-run/node";
import axios from "axios";
import OrderController from "../order/OrderController.server";
import { Payment } from "./PaymentDetails";
import { Order } from "../order/Order";
import AdminController from "../admin/AdminController.server";
import EmployeeAuthController from "../employee/EmployeeAuthController";

export default class PaymentController {
  private request: Request;
  private domain: string;
  private session: any;
  private Cart: any;
  private Product: any;
  private ProductImages: any;
  private storage: SessionStorage;

  /**
   * Initialize a PaymentController instance
   * @param request This Fetch API interface represents a resource request.
   * @returns this
   */
  constructor(request: Request) {
    this.request = request;
    this.domain = (this.request.headers.get("host") as string).split(":")[0];

    const secret = "asfafasfasjfhasf";
    if (!secret) {
      throw new Error("No session secret provided");
    }
    this.storage = createCookieSessionStorage({
      cookie: {
        name: "__session",
        secrets: [secret],
        sameSite: "lax",
        httpOnly: true,
        path: "/",
        maxAge: 60 * 60 * 24 * 30, // 30 days
      },
    });
  }

  public addPaymentDetails = async ({
    user,
    method,
    mobileNumber,
  }: {
    user: string;
    method: string;
    mobileNumber: string;
  }) => {
    const existingPaymentDetail = await this.PaymentDetails.findOne({
      user,
      method,
    });

    if (existingPaymentDetail) {
      this.PaymentDetails.findByIdAndUpdate(existingPaymentDetail._id, {
        $inc: { quantity: 1 },
      }).exec();
    } else {
      const cart = await this.PaymentDetails.create({
        user,
        product,
        quantity: 1,
      });

      if (!cart) {
        return json(
          {
            error: "Error creating cart",
            fields: {},
          },
          { status: 400 }
        );
      }
    }

    return redirect(`"/products/${product}"`, 200);
  };

  public getUserPaymentDetails = async ({ user }: { user: string }) => {
    try {
      const payment_details = await this.PaymentDetails.find({ user });

      return payment_details;
    } catch (error) {
      console.error("Error retrieving carts:", error);
    }
  };

  public requestHubtelPayment = async ({
    totalAmount,
    customerName,
    orderId,
  }: {
    totalAmount: number;
    customerName: string;
    orderId: string;
  }) => {
    return new Promise<{
      responseCode: string;
      status: string;
      data: {
        checkoutUrl: string;
        checkoutId: string;
        clientReference: string;
        message: string;
        checkoutDirectUrl: string;
      };
    }>(async (resolve, reject) => {
      try {
        const data = JSON.stringify({
          totalAmount,
          description: customerName,
          callbackUrl:
            "https://webhook.site/a6849fb9-e114-4a2c-afe8-f8e062547e34",
          returnUrl: "http://kwamina.com:3000/api/hubtell_callback",
          merchantAccountNumber: "2017174",
          cancellationUrl: "http://hubtel.com/",
          clientReference: orderId,
        });

        // Convert the input string to a binary string
        const binaryString = unescape(
          encodeURIComponent("pQn0DNm:a1d146a4492c41cdbe2263250adf6bf8")
        );

        // Encode the binary string using Base64
        const encodedString = btoa(binaryString);

        const config = {
          method: "post",
          maxBodyLength: Infinity,
          url: "https://payproxyapi.hubtel.com/items/initiate",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Basic ${encodedString}`,
          },
          data: data,
        };

        const response = await axios.request(config);
        resolve(response.data);
      } catch (error) {
        reject({
          responseCode: "400",
          status: "Error",
          data: {},
        });
      }
    });
  };

  public hubtelCallback = async ({
    orderId,
    paymentReff,
  }: {
    orderId: string;
    paymentReff: string;
  }) => {
    const orderController = await new OrderController(this.request);
    await orderController.orderPaymentStatus({
      status: "paid",
      orderId,
      paymentReff,
    });
    return json({ message: "Success" }, 200);
  };

  public getOrderPayments = async ({ orderId }: { orderId: string }) => {
    const payments = await Payment.find({ order: orderId }).populate("cashier");
    return payments;
  };

  public makePayment = async ({
    orderId,
    paymentMethod,
    mobileNumber,
    amount,
  }: {
    orderId: string;
    paymentMethod?: string;
    mobileNumber?: string;
    amount: string;
  }) => {
    const employeeController = await new EmployeeAuthController(this.request);
    const adminController = await new AdminController(this.request);

    const cashier = await employeeController.getEmployeeId();
    const adminId = await adminController.getAdminId();

    const payment = await Payment.create({
      amount,
      order: orderId,
      cashier: adminId ? adminId : cashier,
    });

    if (!payment) {
      console.log("somemthing went wrong...");
    }

    await Order.findByIdAndUpdate(orderId, {
      $inc: { amountPaid: parseFloat(amount) },
    }).exec();

    const order = await Order.findOne({ _id: orderId }).exec();

    if (order?.amountPaid >= order?.totalPrice) {
      await Order.findByIdAndUpdate(orderId, {
        $set: { paymentStatus: "paid" },
      }).exec();
    }

    return true;
  };
}
