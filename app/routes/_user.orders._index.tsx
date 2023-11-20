import type { MetaFunction, LoaderFunction } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import moment from "moment";
import Container from "~/components/Container";
import UserDetailLayout from "~/components/layouts/UserDetailLayout";
import OrderController from "~/server/order/OrderController.server";
import type { OredrInterface } from "~/server/types";
import UserController from "~/server/user/UserController.server";

export default function UserOrders() {
  let { orders } = useLoaderData<{
    orders: OredrInterface[];
  }>();

  return (
    <UserDetailLayout title="Orders">
      {orders?.map((order) => (
        <Link
          to={`/orders/${order._id}`}
          key={order._id}
          className="flex rounded-lg bg-white p-2 shadow-lg dark:bg-slate-800"
        >
          {order.orderItems?.length > 1 ? (
            <div className="mr-3 flex h-20 w-20 items-center justify-center rounded-lg bg-blue-400 text-base font-medium">
              <p>{order.orderItems?.length} Items</p>
            </div>
          ) : (
            <img
              src={order.orderItems[0].product.images[0].url}
              className="mr-3 h-20 w-20 rounded-lg"
              alt=""
            />
          )}

          <div className="flex flex-1 flex-col gap-1">
            <p className="font-medium text-slate-900 dark:text-white">
              {order.orderItems[0]?.product.name}
            </p>
            <div className="flex items-center justify-between">
              <p>${order.totalPrice}</p>
              <p
                className={`w-fit capitalize rounded-xl px-2 py-1 ${
                  order.deliveryStatus == "rejected"
                    ? "bg-red-500/40 text-red-800 dark:text-white"
                    : order.deliveryStatus == "completed"
                    ? "bg-green-500/40 text-green-800 dark:text-white"
                    : order.deliveryStatus == "to ship"
                    ? "bg-blue-500/40 text-blue-800 dark:text-white"
                    : order.deliveryStatus == "shipping"
                    ? "bg-pink-500/40 text-pink-800 dark:text-white"
                    : order.deliveryStatus == "pending"
                    ? "bg-yellow-500/40 text-yellow-800 dark:text-white"
                    : "bg-slate-500/40 text-slate-800 dark:text-white"
                }`}
              >
                {order.deliveryStatus}
              </p>
            </div>
            <div className="flex justify-between">
              <p className="text-sm">
                {moment(order?.createdAt).format("MMM Do YYYY")}
              </p>
              <p>{order?.status != "paid" ? "Not paid" : null}</p>
            </div>
          </div>
        </Link>
      ))}
    </UserDetailLayout>
  );
}

export const meta: MetaFunction = () => {
  return [
    { title: "ComClo - My Orders" },
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

export const loader: LoaderFunction = async ({ request }) => {
  const userController = await new UserController(request);
  const user = await userController.requireUserId();

  const orderController = await new OrderController(request);
  const orders = await orderController.allUserOrders({ user });

  return { orders };
};
