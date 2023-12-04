import { type MetaFunction, type LoaderFunction } from "@remix-run/node";
import { Link, useLoaderData, useSubmit } from "@remix-run/react";
import Input from "~/components/Input";
import SimpleSelect from "~/components/SimpleSelect";
import Spacer from "~/components/Spacer";
import OrderCard from "~/components/OrderCard";
import OrderController from "~/server/order/OrderController.server";
import Container from "~/components/Container";
import EmployeeAuthController from "~/server/employee/EmployeeAuthController";
import PosLayout from "~/components/layouts/PosLayout";
import type { EmployeeInterface, OrderInterface } from "~/server/types";
import CartController from "~/server/cart/CartController.server";
import { Pagination, PaginationItem } from "@mui/material";
import SettingsController from "~/server/settings/SettingsController.server";
import IdGenerator from "~/lib/IdGenerator";

export default function PosOrders() {
  const submit = useSubmit();
  const { user, orders, page, totalPages, cart_items, generalSettings } =
    useLoaderData<{
      orders: OrderInterface[];
      user: EmployeeInterface;
      totalPages: number;
      page: number;
      generalSettings: any;
    }>();

  return (
    <PosLayout user={user} cart_items={cart_items} settings={generalSettings}>
      <div className="flex">
        <h1 className="text-3xl font-bold">Orders </h1>
      </div>
      <div className="my-3 flex rounded-lg bg-slate-50 p-2 dark:bg-slate-900">
        <Input type="search" placeholder="Search anything..." name="term" />
        <Spacer />

        <SimpleSelect color="secondary" variant="ghost">
          <option value="">Select Status</option>
          <option value="pending">Pending</option>
          <option value="completed">Completed</option>
          <option value="rejected">Rejected</option>
        </SimpleSelect>
      </div>
      {/* <div>
        <p>tabs</p>
      </div> */}
      <div className="relative shadow-sm bg-white dark:bg-slate-700 rounded-xl pb-2">
        <table className="w-full text-left text-slate-500 dark:text-slate-400">
          <thead className=" uppercase text-slate-700 dark:text-slate-400 ">
            <tr>
              {/* <th scope="col" className="px-3 py-3">
                <input type="checkbox" name="all" id="all" />
              </th> */}
              <th scope="col" className="px-3 py-3">
                ID No.
              </th>
              <th scope="col" className="px-3 py-3">
                Product
              </th>
              {/* <th scope="col" className="px-3 py-3">
                Customer
              </th> */}
              <th scope="col" className="px-3 py-3">
                Payment Status
              </th>
              <th scope="col" className="px-3 py-3">
                Amount Paid
              </th>

              {/* <th scope="col" className="px-3 py-3">
                Delivery Date
              </th> */}
              <th scope="col" className="px-3 py-3">
                Total Price
              </th>
              <th scope="col" className="px-3 py-3">
                Order Date
              </th>
              <th scope="col" className="px-3 py-3">
                <span className="sr-only">Action</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <OrderCard
                key={IdGenerator(10)}
                order={order}
                root_path="pos"
                submit={submit}
              />
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-11 flex w-full items-center justify-center">
        <Pagination
          color="primary"
          variant="outlined"
          shape="rounded"
          page={page}
          count={totalPages}
          renderItem={(item) => (
            <PaginationItem
              component={Link}
              to={`/pos/orders${item.page === 1 ? "" : `?page=${item.page}`}`}
              {...item}
            />
          )}
        />
      </div>
    </PosLayout>
  );
}

export const action = async ({ request }) => {
  const formData = await request.formData();
  const status = formData.get("status") as string;
  const _id = formData.get("_id") as string;

  const orderController = await new OrderController(request);
  await orderController.orderStatus({ status, _id });
  return true;
};

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  const page = parseInt(url.searchParams.get("page") as string) || 1;

  const authController = await new EmployeeAuthController(request);
  await authController.requireEmployeeId();
  const user = await authController.getEmployee();

  const settingsController = await new SettingsController(request);
  const generalSettings = await settingsController.getGeneralSettings();

  const orderController = await new OrderController(request);
  const { orders, totalPages } = await orderController.getOrders({
    page,
    status: "pending",
  });

  const cartController = await new CartController(request);
  const cart_items = await cartController.getUserCart({
    user: user._id as string,
  });

  return { user, orders, page, totalPages, cart_items, generalSettings };
};

export const meta: MetaFunction = () => {
  return [
    { title: "ComClo - Orders" },
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

export function ErrorBoundary({ error }) {
  console.error(error);
  return (
    <Container
      heading="Error"
      contentClassName="flex-col grid grid-cols-2 gap-3"
    >
      <p>Something went wrong!</p>
    </Container>
  );
}
