import {
  type MetaFunction,
  type LoaderFunction,
  type ActionFunction,
} from "@remix-run/node";
import {
  Form,
  useActionData,
  useLoaderData,
  useNavigation,
} from "@remix-run/react";
import UserDetailLayout from "~/components/layouts/UserDetailLayout";
import UserController from "~/server/user/UserController.server";
import OrderController from "~/server/order/OrderController.server";
import Container from "~/components/Container";

import type { AddressInterface, OredrInterface } from "~/server/types";
import SimpleSelect from "~/components/SimpleSelect";
import { Button } from "~/components/ui/button";
// import Loader from "~/components/Loader";

export default function UserCart() {
  const navigation = useNavigation();
  const actionData = useActionData();
  let { order, addresses } = useLoaderData<{
    order: OredrInterface;
    addresses: AddressInterface[];
  }>();

  return (
    <UserDetailLayout title="Proceed with order">
      {/* allow user to select payment method and proceed */}
      {/* <Loader /> */}

      <section>
        {order?.orderItems?.map(({ product, quantity, _id }) => (
          <div key={_id} className="flex">
            <img
              src={product?.images[0].url}
              alt=""
              className="mr-3 h-20 w-20 rounded-lg"
            />
            <div>
              <p>{product?.name}</p>
              <p>{product?.price}</p>
              <p>Qty: {quantity} </p>
            </div>
          </div>
        ))}
      </section>
      <Form
        method="POST"
        className="fixed flex-col bottom-0 left-1 right-1 mx-auto my-2 flex w-[96vw] rounded-2xl border border-slate-400 bg-white p-3 shadow-md dark:bg-black/80 dark:text-white"
      >
        <SimpleSelect name="shippingAddress" className="w-full" variant="ghost">
          <option value="">Select Address</option>
          {addresses?.map((address) => (
            <option key={address?._id} value={address?._id}>
              {address?.title}
            </option>
          ))}
        </SimpleSelect>

        <div className="flex justify-between items-center mt-3">
          <p className="text-lg">Total Price: ${order?.totalPrice}</p>
          <Button type="submit" className="py-3">
            Checkout
          </Button>
        </div>
      </Form>
    </UserDetailLayout>
  );
}

export const meta: MetaFunction = () => {
  return [
    { title: "ComClo - Order" },
    {
      name: "description",
      content: "The best e-Commerce platform for your business.",
    },
    { name: "og:title", content: "ComClo" },
    { property: "og:type", content: "websites" },
    {
      name: "og:description",
      content: "The best e-Commerce platform for your business.",
    },
    {
      name: "og:image",
      content:
        "https://res.cloudinary.com/app-deity/image/upload/v1700242905/l843bauo5zpierh3noug.png",
    },
    { name: "og:url", content: "https://single-ecommerce.vercel.app" },
  ];
};

export const action: ActionFunction = async ({ request, params }) => {
  let { orderId } = params;
  const formData = await request.formData();

  const orderController = await new OrderController(request);
  let shippingAddress = formData.get("shippingAddress") as string;

  return await orderController.completeCheckout({
    orderId,
    shippingAddress,
  });
};

export const loader: LoaderFunction = async ({ request, params }) => {
  let { orderId } = params;

  const userController = await new UserController(request);
  const addresses = await userController.getUserAddresses();

  const orderController = await new OrderController(request);
  const order = await orderController.getOrder({
    orderId: orderId as string,
  });

  return { order, addresses };
};

export function ErrorBoundary({ error }) {
  console.error(error);
  return (
    <Container
      heading="Error"
      className="bg-red-300 dark:bg-red-500"
      contentClassName="flex-col grid grid-cols-2 gap-3"
    >
      <p>Something went wrong!</p>
    </Container>
  );
}
