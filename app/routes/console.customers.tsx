import { Popover } from "@headlessui/react";
import { Pagination, PaginationItem } from "@mui/material";
import { type MetaFunction, type LoaderFunction } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";

import Container from "~/components/Container";
import Input from "~/components/Input";
import SimpleSelect from "~/components/SimpleSelect";
import Spacer from "~/components/Spacer";
import AdminLayout from "~/components/layouts/AdminLayout";
import { Button } from "~/components/ui/button";
import AdminController from "~/modules/admin/AdminController.server";
import type { CustomerInterface } from "~/modules/types";
import UserController from "~/modules/user/UserController.server";

export default function Customers() {
  let { user, customers, totalPages, page } = useLoaderData();

  return (
    <AdminLayout user={user}>
      <div className="">
        {/* <div className="flex flex-col md:flex-row md:items-center md:justify-between"> */}
        <h1 className="text-xl font-bold">Customers</h1>
        {/* </div> */}
      </div>

      <div className="my-3 flex rounded-lg bg-slate-50 p-2 dark:bg-slate-900">
        <Input type="search" placeholder="Search anything..." name="term" />
        <Spacer />

        <SimpleSelect name="status" variant="ghost">
          <option value="">Select Status</option>
          <option value="pending">Pending</option>
          <option value="completed">Completed</option>
          <option value="rejected">Rejected</option>
          <option value="shipping">Shipping</option>
        </SimpleSelect>
      </div>

      <div className="relative shadow-sm bg-white dark:bg-slate-700 rounded-xl pb-2">
        <table className="w-full text-left text-slate-500 dark:text-slate-400">
          <thead className=" uppercase text-slate-700 dark:text-slate-400 ">
            <tr>
              <th scope="col" className="px-3 py-3">
                Username
              </th>
              <th scope="col" className="px-3 py-3">
                Full Name
              </th>
              <th scope="col" className="px-3 py-3">
                Email
              </th>
              <th scope="col" className="px-3 py-3">
                Phone
              </th>
              <th scope="col" className="px-3 py-3">
                Address
              </th>
              {/* <th scope="col" className="px-3 py-3">
                <span className="sr-only">Action</span>
              </th> */}
            </tr>
          </thead>
          <tbody>
            {customers.map((customer: CustomerInterface) => (
              <tr
                key={customer?._id}
                className="cursor-pointer hover:bg-slate-50 hover:shadow-md dark:border-slate-400 dark:bg-slate-800 dark:hover:bg-slate-600"
              >
                <th
                  scope="row"
                  className=" px-3 py-3 font-medium text-slate-900 dark:text-white"
                >
                  {/* <img
                    className="mr-2 h-11 w-11 rounded-md object-cover"
                    src={customer?.images[0]?.url}
                    alt=""
                  /> */}

                  <p>{customer?.username}</p>
                </th>

                <td className="px-3 py-3">
                  {customer.firstName} {customer.lastName}
                </td>
                <td className="px-3 py-3 ">{customer?.email}</td>
                <td className="px-3 py-3 ">{customer?.phone}</td>
                <td className="px-3 py-3 ">{customer?.address}</td>

                {/* <td className="gap-1 px-3 py-3">
                  <Popover className="relative">
                    <Popover.Button className="font-sm tansition-all rounded-lg bg-blue-600 px-2 py-1 text-white shadow-sm duration-300 hover:bg-blue-700 focus:outline-none">
                      Actions
                    </Popover.Button>

                    <Popover.Panel className="absolute right-6 z-10">
                      <div className="flex flex-col gap-2 rounded-lg bg-white p-3 dark:bg-slate-900">
                        <Link
                          to={`/console/customers/${customer._id}`}
                          className="font-sm tansition-all w-32 rounded-lg bg-blue-600 px-2 py-2 text-center text-white shadow-sm duration-300 hover:bg-blue-700 focus:outline-none"
                        >
                          View
                        </Link>
                        <Button
                          size="md"
                          variant="solid"
                          type="button"
                          color="error"
                          onClick={() => handleDelete(customer._id)}
                        >
                          Delete
                        </Button>
                      </div>
                    </Popover.Panel>
                  </Popover>
                </td> */}
              </tr>
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

export const meta: MetaFunction = () => {
  return [
    { title: "ComClo - Customers" },
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
  const adminController = await new AdminController(request);
  await adminController.requireAdminId();
  const user = await adminController.getAdmin();

  const userController = await new UserController(request);
  const customers = await userController.getCustomers();

  return { user, customers, totalPages: 1, page: 1 };
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
