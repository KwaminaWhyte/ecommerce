import { type MetaFunction, type LoaderFunction } from "@remix-run/node";
import {
  Form,
  Link,
  useLoaderData,
  useOutletContext,
  useSubmit,
} from "@remix-run/react";
import OrderCard from "~/components/OrderCard";
import OrderController from "~/server/order/OrderController.server";
import Container from "~/components/Container";
import EmployeeAuthController from "~/server/employee/EmployeeAuthController";
import PosLayout from "~/components/layouts/PosLayout";
import type {
  EmployeeInterface,
  OrderInterface,
  UserInterface,
} from "~/server/types";
import { Pagination, PaginationItem } from "@mui/material";
import { Button } from "~/components/ui/button";
import SettingsController from "~/server/settings/SettingsController.server";
import IdGenerator from "~/lib/IdGenerator";
import { Input } from "~/components/ui/input";

export default function PosOrders() {
  const { user, cart_items } = useOutletContext<{
    user: UserInterface;
    cart_items: any[];
  }>();
  const submit = useSubmit();
  const { orders, page, totalPages, generalSettings } = useLoaderData<{
    orders: OrderInterface[];
    user: EmployeeInterface;
    totalPages: number;
    page: number;
    generalSettings: any;
  }>();

  return (
    <PosLayout user={user} cart_items={cart_items} settings={generalSettings}>
      <section className="mb-3 flex items-center gap-3">
        <h1 className="text-3xl font-bold">Orders on Credit</h1>

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
          </Select>
          <Spacer /> */}

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
              {/* <th scope="col" className="px-3 py-3">
                Status
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

  const settingsController = await new SettingsController(request);
  const generalSettings = await settingsController.getGeneralSettings();

  const orderController = await new OrderController(request);
  const { orders, totalPages } = await orderController.getOrdersOnCredit({
    page,
    status: "pending",
  });

  return { orders, page, totalPages, generalSettings };
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
