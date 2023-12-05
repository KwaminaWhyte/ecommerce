import { type MetaFunction, type LoaderFunction } from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";
import { ClientOnly } from "remix-utils/client-only";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  BarElement,
} from "chart.js/auto";
import { Bar, Line } from "react-chartjs-2";

import Container from "~/components/Container";
import AdminController from "~/server/admin/AdminController.server";
import ReportController from "~/server/report/ReportController.server";

import { DatePickerWithRange } from "~/components/date-range";
import { Button } from "~/components/ui/button";
import moment from "moment";
import type { PaymentInterface } from "~/server/types";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  BarElement
);

export default function FinancialReport() {
  const { financialData, salesOptions, transactionHistory, soldData } =
    useLoaderData<{
      transactionHistory: PaymentInterface[];
    }>();
  console.log(transactionHistory);
  console.log(soldData);

  return (
    <div>
      <section className="mb-3 flex items-center gap-3">
        <h1 className="text-3xl font-bold">Financial Reports </h1>
        <Form
          method="GET"
          className="flex gap-3 items-center bg-white shadow-md p-2 rounded-lg ml-auto"
        >
          <DatePickerWithRange />
          <Button>Filter</Button>
        </Form>
      </section>

      <section className="flex gap-3 ">
        <Container
          contentClassName="flex-col flex gap-3 "
          heading="Total revenue"
          className="w-full"
          // subHeading="Display sales trends over time, such as daily, weekly, and monthly comparisons."
        >
          <p>
            Total Amount of Items Sold (Cost Price) :{soldData?.totalCostPrice}
          </p>
          <p>
            Total Amount of Items Sold (Seld Price) :
            {soldData?.totalSellingPrice}
          </p>
        </Container>

        <Container
          heading="Profit"
          className="w-full"
          // subHeading="Display sales trends over time, such as daily, weekly, and monthly comparisons."
        >
          <p>Profit :{soldData?.totalProfit}</p>
        </Container>
      </section>

      <Container heading="Sales update" className="flex-1">
        <ClientOnly fallback={<div>Generating Chart</div>}>
          {() => <Line options={salesOptions} data={financialData} />}
        </ClientOnly>
      </Container>

      <Container
        heading="Expenses"
        subHeading="Display sales trends over time, such as daily, weekly, and monthly comparisons."
      >
        <p>asfasf</p>
      </Container>

      <div className="relative shadow-sm bg-white dark:bg-slate-700 rounded-xl pb-2 mt-5">
        <table className="w-full text-left text-slate-500 dark:text-slate-400">
          <thead className=" uppercase text-slate-700 dark:text-slate-400 ">
            <tr>
              <th scope="col" className="px-3 py-3">
                Customer
              </th>
              <th scope="col" className="px-3 py-3">
                Order ID
              </th>
              <th scope="col" className="px-3 py-3">
                Amount
              </th>
              <th scope="col" className="px-3 py-3">
                Timestamp
              </th>
            </tr>
          </thead>
          <tbody>
            {transactionHistory.map((transaction) => (
              <tr
                key={transaction?._id}
                className="cursor-pointer rounded-xl hover:bg-slate-50 hover:shadow-md dark:border-slate-400 dark:bg-slate-800 dark:hover:bg-slate-600"
              >
                <th
                  scope="row"
                  className=" px-3 py-3 font-medium text-slate-900 dark:text-white"
                >
                  <p>{transaction?.order?.customerName}</p>
                </th>

                <td className="px-3 py-3">{transaction?.order?.orderId}</td>
                <td className="px-3 py-3">GH₵ {transaction?.amount}</td>
                <td className="px-3 py-3">
                  {moment(transaction?.createdAt).format(
                    "dddd, MMM DD, YYYY h:m A"
                  )}
                </td>
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
  const from = url.searchParams.get("from") as string;
  const to = url.searchParams.get("to") as string;

  const adminController = await new AdminController(request);
  await adminController.requireAdminId();

  const salesOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: false,
        text: "Chart.js Line Chart",
      },
    },
  };

  const reportController = await new ReportController(request);
  const { financialData, transactionHistory, soldData } =
    await reportController.getFinancialReport({
      to,
      from,
    });
  return { financialData, transactionHistory, salesOptions, soldData };
};

export const meta: MetaFunction = () => {
  return [
    { title: "ComClo - Financial Report" },
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
