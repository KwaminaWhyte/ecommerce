import { type MetaFunction, type LoaderFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import moment from "moment";
import Container from "~/components/Container";
import LinkButton from "~/components/LinkButton";
import UserDetailLayout from "~/components/layouts/UserDetailLayout";
import OrderController from "~/server/order/OrderController.server";
import type { OrderInterface } from "~/server/types";
import UserController from "~/server/user/UserController.server";

export default function UserProfile() {
  let { order } = useLoaderData<{
    order: OrderInterface;
  }>();

  return (
    <UserDetailLayout title="Order Details">
      <section>
        <p className="text-lg">
          Order ID: <span className="font-medium">{order.orderId}</span>
        </p>
        <p>{moment(order?.createdAt).format("MMM Do YYYY, h:mm a")}</p>
      </section>

      <section>
        <p className="my-3 bg-slate-700 rounded-lg p-2">Order Items</p>
        {order.orderItems?.map(({ product, quantity }) => (
          <div
            key={product._id}
            className="flex rounded-lg bg-white p-2 shadow-lg dark:bg-slate-800"
          >
            <img
              src={product?.images[0].url}
              className="mr-3 h-20 w-20 rounded-lg"
              alt=""
            />

            <div>
              <p className="font-medium text-slate-900 dark:text-white">
                {product?.name}
              </p>
              <p>
                GH₵ {product.price} x {quantity}
              </p>
            </div>
          </div>
        ))}
      </section>

      <section>
        <p className="my-3 bg-slate-700 rounded-lg p-2">Order Tracking</p>
      </section>

      <section>
        {order?.status != "paid" ? (
          <div className="fixed bottom-0 left-1 right-1 mx-auto my-2 flex w-[96vw] items-center justify-between rounded-2xl border border-slate-400 bg-white p-1 px-3 shadow-md dark:bg-black/80 dark:text-white">
            <input type="hidden" name="type" value="checkout" />
            <input type="hidden" name="totalPrice" value={order.totalPrice} />
            <p>Total Price: ${order.totalPrice}</p>
            <LinkButton to={`/proceed_order/${order?._id}`} className="py-3">
              Proceed
            </LinkButton>
          </div>
        ) : null}
      </section>
    </UserDetailLayout>
  );
}

export const loader: LoaderFunction = async ({ request, params }) => {
  const { orderId } = params;
  const userController = await new UserController(request);
  userController.requireUserId();

  const orderController = await new OrderController(request);
  const order = await orderController.getOrder({ orderId: orderId as string });

  return { order };
};

export const meta: MetaFunction = ({ data }) => {
  return [
    { title: `ComClo - Order | ${data.order.orderId}` },
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
