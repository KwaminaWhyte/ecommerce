import {
  type MetaFunction,
  type LoaderFunction,
  type ActionFunction,
} from "@remix-run/node";
import { Form, Link, useLoaderData, useSubmit } from "@remix-run/react";
import { Pagination, PaginationItem } from "@mui/material";

import AdminLayout from "~/components/layouts/AdminLayout";
import OrderCard from "~/components/OrderCard";
import type { AdminInterface, OrderInterface } from "~/server/types";
import AdminController from "~/server/admin/AdminController.server";
import OrderController from "~/server/order/OrderController.server";
import { Button } from "~/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Input } from "~/components/ui/input";

export default function Orders() {
  const submit = useSubmit();

  const { user, orders, page, totalPages } = useLoaderData<{
    orders: OrderInterface[];
    user: AdminInterface;
    totalPages: number;
    page: number;
  }>();

  return (
    <AdminLayout user={user}>
      <section className="mb-3 flex items-center gap-3">
        <h1 className="text-3xl font-bold">Orders on Credit </h1>

        <Form
          method="GET"
          className=" ml-auto flex items-center gap-3 rounded-lg bg-slate-50 p-2 dark:bg-slate-900"
        >
          <Input
            type="search"
            placeholder="Search anything..."
            name="search_term"
            className="w-60"
          />

          {/* <Select name="status">
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="apple">Apple</SelectItem>
              <SelectItem value="banana">Banana</SelectItem>
              <SelectItem value="blueberry">Blueberry</SelectItem>
              <SelectItem value="grapes">Grapes</SelectItem>
              <SelectItem value="pineapple">Pineapple</SelectItem>
            </SelectContent>
          </Select> */}

          <Button type="submit">Filter</Button>
        </Form>
      </section>

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
              {/*
              <th scope="col" className="px-3 py-3">
                Delivery Status
              </th> */}

              <th scope="col" className="px-3 py-3">
                Amount Paid
              </th>
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
  const status = url.searchParams.get("order_status") as string;

  const adminController = await new AdminController(request);
  await adminController.requireAdminId();
  const user = await adminController.getAdmin();

  const orderController = await new OrderController(request);
  const { orders, totalPages } = await orderController.getOrdersOnCredit({
    page,
    status,
    search_term,
  });

  return { user, orders, page, totalPages };
};

export const meta: MetaFunction = () => {
  return [
    { title: "ComClo - Orders on Credit" },
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

/**
 * TODO:
 *
 * order the items by delivery date, delivery_status
 * the search can include either of the filters
 */
