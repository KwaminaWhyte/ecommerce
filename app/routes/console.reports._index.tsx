import { type MetaFunction, type LoaderFunction } from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";
import Container from "~/components/Container";
import { DatePickerWithRange } from "~/components/date-range";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import AdminController from "~/server/admin/AdminController.server";
import ReportController from "~/server/report/ReportController.server";
import type { UserInterface } from "~/server/types";

export default function AdminProfile() {
  let { user, reports } = useLoaderData<{
    user: UserInterface;
    reports: any;
  }>();

  return (
    <div>
      <section className="mb-3 flex items-center gap-3">
        <h1 className="text-3xl font-bold">General Report</h1>
        <Form
          method="GET"
          className="flex gap-3 items-center bg-white shadow-md p-2 rounded-lg ml-auto"
        >
          {/* <Input placeholder="product name..." name="product_name" /> */}
          <DatePickerWithRange />
          <Button>Filter</Button>
        </Form>
      </section>

      <Container heading="All Products Sold Today">
        <div className="relative overflow-x-auto shadow-md sm:rounded-lg w-full">
          <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th scope="col" className="px-6 py-3">
                  Product name
                </th>
                <th scope="col" className="px-6 py-3">
                  Stock Price
                </th>
                {/* <th scope="col" className="px-6 py-3">
                  Category
                </th> */}
                <th scope="col" className="px-6 py-3">
                  Quantity
                </th>
                <th scope="col" className="px-6 py-3">
                  Price
                </th>
                {/* <th scope="col" className="px-6 py-3">
                  <span className="sr-only">Edit</span>
                </th> */}
              </tr>
            </thead>
            <tbody>
              {reports.map((report) => (
                <tr
                  key={report.stock}
                  className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                >
                  <th
                    scope="row"
                    className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                  >
                    {report.product.name}
                  </th>
                  <td className="px-6 py-4">GH₵ {report?.stock?.price}</td>
                  {/* <td className="px-6 py-4">Laptop</td> */}
                  <td className="px-6 py-4">{report?.quantity}</td>
                  <td className="px-6 py-4">GH₵ {report?.totalPrice}</td>
                  {/* <td className="px-6 py-4 text-right">
                    <a
                      href="asfaf"
                      className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                    >
                      Edit
                    </a>
                  </td> */}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Container>

      <Container heading="Inventory">
        <p>include all available reports</p>
      </Container>
    </div>
  );
}

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);

  const adminController = await new AdminController(request);
  await adminController.requireAdminId();
  const user = await adminController.getAdmin();

  // const product_name = url.searchParams.get("product_name") as string;
  const from = url.searchParams.get("from") as string;
  const to = url.searchParams.get("to") as string;

  const reportController = await new ReportController(request);
  const reports = await reportController.getToday({ from, to });

  return { user, reports };
};

export const meta: MetaFunction = () => {
  return [
    { title: "ComClo - General Report" },
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
