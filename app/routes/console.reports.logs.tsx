import {
  type ActionFunction,
  type LoaderFunction,
  type MetaFunction,
} from "@remix-run/node";
import { Form, Link, useLoaderData } from "@remix-run/react";
import AdminController from "~/server/admin/AdminController.server";
import Container from "~/components/Container";
import type {
  EmployeeInterface,
  LogInterface,
  UserInterface,
} from "~/server/types";
import { Pagination, PaginationItem } from "@mui/material";
import { Button } from "~/components/ui/button";
import LogController from "~/server/logs/LogController.server";
import { DatePickerWithRange } from "~/components/date-range";
import IdGenerator from "~/lib/IdGenerator";
import moment from "moment";
import EmployeeController from "~/server/employee/EmployeeController.server";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";

export default function SystemLogs() {
  const { employees, logs, page, totalPages } = useLoaderData<{
    logs: LogInterface[];
    user: UserInterface;
    page: number;
    totalPages: number;
    employees: EmployeeInterface[];
  }>();

  return (
    <div>
      <section className="mb-3 flex items-center gap-3">
        <h1 className="text-3xl font-bold">System Logs</h1>
        <Form
          method="GET"
          className="flex gap-3 items-center bg-white shadow-md p-2 rounded-lg ml-auto"
        >
          <Select name="employee">
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Select an Employee" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Employee</SelectLabel>
                {employees.map((employee) => (
                  <SelectItem key={IdGenerator(11)} value={employee?._id}>
                    {employee?.firstName} {employee?.lastName}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>

          <DatePickerWithRange />
          <Button>Filter</Button>
        </Form>
      </section>

      {/* <Form
        method="GET"
        className="my-3 flex items-center gap-3 rounded-lg bg-slate-50 p-2 dark:bg-slate-900"
      >
        <Input
          type="search"
          placeholder="Search anything..."
          name="search_term"
        />

        <Button type="submit">Search</Button>
      </Form> */}

      <div className="relative shadow-sm bg-white dark:bg-slate-700 rounded-xl pb-2">
        <table className="w-full text-left text-slate-500 dark:text-slate-400">
          <thead className=" uppercase text-slate-700 dark:text-slate-400 ">
            <tr>
              <th scope="col" className="px-3 py-3">
                Employee
              </th>
              <th scope="col" className="px-3 py-3">
                Action
              </th>
              <th scope="col" className="px-3 py-3">
                Timestamp
              </th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log) => (
              <tr
                key={IdGenerator()}
                className="cursor-pointer rounded-xl hover:bg-slate-50 hover:shadow-md dark:border-slate-400 dark:bg-slate-800 dark:hover:bg-slate-600"
              >
                <th
                  scope="row"
                  className=" px-3 py-3 font-medium text-slate-900 dark:text-white"
                >
                  {log?.employee?.firstName} {log?.employee?.lastName}
                </th>
                <td className="px-3 py-3">
                  <p
                    className={` w-fit  rounded-xl px-2 py-1 font-medium capitalize ${
                      log?.action == "login"
                        ? "bg-yellow-500/40 text-black dark:bg-yellow-400/80 dark:text-black"
                        : log?.action == "logout"
                        ? "bg-red-500/40 text-red-800 dark:bg-red-600/80 dark:text-white"
                        : "bg-purple-500/40 text-purple-800 dark:bg-purple-600/80 dark:text-white"
                    }`}
                  >
                    {log?.action}
                  </p>
                </td>
                <td className="px-3 py-3">
                  {moment(log?.createdAt).format(
                    "dddd, DD MMMM YYYY - hh:mm A"
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-11 flex w-full items-center justify-center">
        <Pagination
          variant="outlined"
          shape="rounded"
          page={page}
          count={totalPages}
          color="primary"
          renderItem={(item) => (
            <PaginationItem
              component={Link}
              to={`/console/logs${item.page === 1 ? "" : `?page=${item.page}`}`}
              {...item}
            />
          )}
        />
      </div>
    </div>
  );
}

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
};

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  const page = parseInt(url.searchParams.get("page") as string) || 1;
  const employee = url.searchParams.get("employee") as string;
  const from = url.searchParams.get("from") as string;
  const to = url.searchParams.get("to") as string;

  const adminController = await new AdminController(request);
  await adminController.requireAdminId();
  const user = await adminController.getAdmin();

  const logController = await new LogController();
  const { logs, totalPages } = await logController.getLogs({
    page,
    employee,
    to,
    from,
  });

  const employeeController = await new EmployeeController(request);
  const { employees } = await employeeController.getEmployees({ page: 1 });
  return { user, logs, totalPages, page, employees };
};

export const meta: MetaFunction = () => {
  return [
    { title: "ComClo - System Logs" },
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
