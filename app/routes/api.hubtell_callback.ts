import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import PaymentController from "~/modules/payment/PaymentController";

export const action: ActionFunction = async ({ request }) => {
  if (request.method !== "POST") {
    return json({ message: "Method not allowed" }, 405);
  }

  const payload = await request.json();
  const paymentController = await new PaymentController(request);
  await paymentController.hubtelCallback({
    orderId: "asfasf",
    paymentReff: "asfasf",
  });

  return "settings saved..";
};

export const loader: LoaderFunction = async ({ request }) => {
  return json({ success: true }, 200);
};
