import {
  type MetaFunction,
  type LoaderFunction,
  type ActionFunction,
} from "@remix-run/node";
import { Form, Link, useLoaderData, useSubmit } from "@remix-run/react";
import { Pagination, PaginationItem } from "@mui/material";

import Input from "~/components/Input";
import SimpleSelect from "~/components/SimpleSelect";
import Spacer from "~/components/Spacer";
import AdminLayout from "~/components/layouts/AdminLayout";
import OrderCard from "~/components/OrderCard";
import type { AdminInterface, OredrInterface } from "~/modules/types";
import AdminController from "~/modules/admin/AdminController.server";
import OrderController from "~/modules/order/OrderController.server";
import Container from "~/components/Container";
import { Button } from "~/components/ui/button";

export default function OrdersShipped() {
  const submit = useSubmit();

  const { user, orders, page, totalPages } = useLoaderData<{
    orders: OredrInterface[];
    user: AdminInterface;
    totalPages: number;
    page: number;
  }>();

  return (
    <AdminLayout user={user}>
      <div className="flex">
        <h1 className="text-3xl font-bold">Orders </h1>

        <section className="ml-auto flex">
          <Button variant="outline">Export</Button>
          <Spacer />
          <Button variant="outline">Print</Button>
          {/* <Spacer /> */}
          {/* <Button> + New Order</Button> */}
        </section>
      </div>

      <Form
        method="GET"
        className="my-3 flex items-center gap-3 rounded-lg bg-slate-50 p-2 dark:bg-slate-900"
      >
        <Input
          type="search"
          placeholder="Search anything..."
          name="search_term"
        />
        <Spacer />

        <SimpleSelect color="secondary" name="order_status" variant="ghost">
          <option value="">Select Status</option>
          <option value="pending">Pending</option>
          <option value="completed">Completed</option>
          <option value="rejected">Rejected</option>
        </SimpleSelect>
        <Spacer />

        <Button type="submit">Filter</Button>
      </Form>
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
              <th scope="col" className="px-3 py-3">
                Customer
              </th>
              <th scope="col" className="px-3 py-3">
                Status
              </th>
              <th scope="col" className="px-3 py-3">
                Delivery Status
              </th>
              <th scope="col" className="px-3 py-3">
                Order Date
              </th>
              <th scope="col" className="px-3 py-3">
                Delivery Date
              </th>
              <th scope="col" className="px-3 py-3">
                Price
              </th>
              <th scope="col" className="px-3 py-3">
                <span className="sr-only">Action</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <OrderCard
                key={order._id}
                order={order}
                submit={submit}
                root_path="console"
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
              to={`/console/orders${
                item.page === 1 ? "" : `?page=${item.page}`
              }`}
              {...item}
            />
          )}
        />
      </div>
    </AdminLayout>
  );
}

export const action: ActionFunction = async ({ request }) => {
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
  const search_term = url.searchParams.get("search_term") as string;
  const order_status = url.searchParams.get("order_status") as string;

  const adminController = await new AdminController(request);
  await adminController.requireAdminId();
  const user = await adminController.getAdmin();

  const orderController = await new OrderController(request);
  const { orders, totalPages } = await orderController.getOrders({
    page,
    status: "shipped",
    search_term,
  });

  return { user, orders, page, totalPages };
};

export const meta: MetaFunction = () => {
  return [
    { title: "ComClo - Orders" },
    {
      description: "the best shopping site",
    },
  ];
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

/**
 * TODO:
 *
 * order the items by delivery date, delivery_status
 * the search can include either of the filters
 */
