import type { MetaFunction, LoaderFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import UserDetailLayout from "~/components/layouts/UserDetailLayout";
import PaymentDetailsController from "~/modules/payment/PaymentDetailsController.server";
import UserController from "~/modules/user/UserController.server";

export default function UserOrders() {
  let {} = useLoaderData<{}>();

  return (
    <UserDetailLayout title="Payment Details" className="">
      <p>Hello there</p>
    </UserDetailLayout>
  );
}

export const meta: MetaFunction = () => {
  return [
    { title: "ComClo - Payment Details" },
    {
      description: "the best shopping site",
    },
  ];
};

export const loader: LoaderFunction = async ({ request }) => {
  const userController = await new UserController(request);
  const paymentDetailsController = await new PaymentDetailsController(request);

  await userController.requireUserId();
  const user = await userController.getUser();
  const details = await paymentDetailsController.getUserPaymentDetails({
    user: user?._id,
  });

  return { user };
};
