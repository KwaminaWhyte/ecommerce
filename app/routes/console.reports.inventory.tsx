import { type MetaFunction, type LoaderFunction } from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";
import Container from "~/components/Container";
import { DatePickerWithRange } from "~/components/date-range";
import { Button } from "~/components/ui/button";
import AdminController from "~/server/admin/AdminController.server";
import ReportController from "~/server/report/ReportController.server";
import type { ProductInterface } from "~/server/types";

export default function InventoryReport() {
  let { topSellingProducts, notSellingProducts, lowStockProducts } =
    useLoaderData<{
      topSellingProducts: ProductInterface[];
      notSellingProducts: ProductInterface[];
      lowStockProducts: ProductInterface[];
    }>();

  console.log(topSellingProducts, notSellingProducts, lowStockProducts);

  return (
    <div>
      <section className="mb-3 flex items-center gap-3">
        <h1 className="text-3xl font-bold">Inventory Report</h1>
        {/* <Form
          method="GET"
          className="flex gap-3 items-center bg-white shadow-md p-2 rounded-lg ml-auto"
        >
          <DatePickerWithRange />
          <Button>Filter</Button>
        </Form> */}
      </section>

      <div className="relative shadow-sm bg-white dark:bg-slate-700 rounded-xl pb-2 mt-5">
        <div className="flex items-center justify-between px-3 py-3 border-b dark:border-slate-400">
          <h3 className="text-2xl font-semibold text-slate-900 dark:text-white">
            Top Products Selling
          </h3>
        </div>
        <table className="w-full text-left text-slate-500 dark:text-slate-400">
          <thead className=" uppercase text-slate-700 dark:text-slate-400 ">
            <tr>
              <th scope="col" className="px-3 py-3">
                Name
              </th>
              <th scope="col" className="px-3 py-3">
                Price
              </th>
              <th scope="col" className="px-3 py-3">
                Category
              </th>
              <th scope="col" className="px-3 py-3">
                Quantity
              </th>
              <th scope="col" className="px-3 py-3">
                Description
              </th>
            </tr>
          </thead>
          <tbody>
            {topSellingProducts.map((product) => (
              <tr
                key={product?._id}
                className="cursor-pointer rounded-xl hover:bg-slate-50 hover:shadow-md dark:border-slate-400 dark:bg-slate-800 dark:hover:bg-slate-600"
              >
                <th
                  scope="row"
                  className=" px-3 py-3 font-medium text-slate-900 dark:text-white"
                >
                  <p>{product?.name}</p>
                </th>

                <td className="px-3 py-3">GH₵ {product?.price}</td>
                <td className="px-3 py-3">{product?.category?.name}</td>
                <td className="px-3 py-3">{product?.quantity}</td>
                <td className="px-3 py-3"> {product?.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="relative shadow-sm bg-white dark:bg-slate-700 rounded-xl pb-2 mt-5">
        <div className="flex items-center justify-between px-3 py-3 border-b dark:border-slate-400">
          <h3 className="text-2xl font-semibold text-slate-900 dark:text-white">
            Products Running Low
          </h3>
        </div>
        <table className="w-full text-left text-slate-500 dark:text-slate-400">
          <thead className=" uppercase text-slate-700 dark:text-slate-400 ">
            <tr>
              <th scope="col" className="px-3 py-3">
                Name
              </th>
              <th scope="col" className="px-3 py-3">
                Price
              </th>
              <th scope="col" className="px-3 py-3">
                Category
              </th>
              <th scope="col" className="px-3 py-3">
                Quantity
              </th>
              <th scope="col" className="px-3 py-3">
                Description
              </th>
            </tr>
          </thead>
          <tbody>
            {lowStockProducts.map((product) => (
              <tr
                key={product?._id}
                className="cursor-pointer rounded-xl hover:bg-slate-50 hover:shadow-md dark:border-slate-400 dark:bg-slate-800 dark:hover:bg-slate-600"
              >
                <th
                  scope="row"
                  className=" px-3 py-3 font-medium text-slate-900 dark:text-white"
                >
                  <p>{product?.name}</p>
                </th>

                <td className="px-3 py-3">GH₵ {product?.price}</td>
                <td className="px-3 py-3">{product?.category?.name}</td>
                <td className="px-3 py-3">{product?.quantity}</td>
                <td className="px-3 py-3"> {product?.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="relative shadow-sm bg-white dark:bg-slate-700 rounded-xl pb-2 mt-5">
        <div className="flex items-center justify-between px-3 py-3 border-b dark:border-slate-400">
          <h3 className="text-2xl font-semibold text-slate-900 dark:text-white">
            Products Not Selling
          </h3>
        </div>
        <table className="w-full text-left text-slate-500 dark:text-slate-400">
          <thead className=" uppercase text-slate-700 dark:text-slate-400 ">
            <tr>
              <th scope="col" className="px-3 py-3">
                Name
              </th>
              <th scope="col" className="px-3 py-3">
                Price
              </th>
              <th scope="col" className="px-3 py-3">
                Category
              </th>
              <th scope="col" className="px-3 py-3">
                Quantity
              </th>
              <th scope="col" className="px-3 py-3">
                Description
              </th>
            </tr>
          </thead>
          <tbody>
            {notSellingProducts.map((product) => (
              <tr
                key={product?._id}
                className="cursor-pointer rounded-xl hover:bg-slate-50 hover:shadow-md dark:border-slate-400 dark:bg-slate-800 dark:hover:bg-slate-600"
              >
                <th
                  scope="row"
                  className=" px-3 py-3 font-medium text-slate-900 dark:text-white"
                >
                  <p>{product?.name}</p>
                </th>

                <td className="px-3 py-3">GH₵ {product?.price}</td>
                <td className="px-3 py-3">{product?.category?.name}</td>
                <td className="px-3 py-3">{product?.quantity}</td>
                <td className="px-3 py-3"> {product?.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);

  const adminController = await new AdminController(request);
  await adminController.requireAdminId();

  // const product_name = url.searchParams.get("product_name") as string;
  const from = url.searchParams.get("from") as string;
  const to = url.searchParams.get("to") as string;

  const reportController = await new ReportController(request);
  const { topSellingProducts, notSellingProducts, lowStockProducts } =
    await reportController.inventoryReport({ from, to });

  return {
    topSellingProducts,
    notSellingProducts,
    lowStockProducts,
  };
};

export const meta: MetaFunction = () => {
  return [
    { title: "ComClo - Invenroty Report" },
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
