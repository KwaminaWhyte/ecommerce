import { type MetaFunction, type LoaderFunction } from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";
import Container from "~/components/Container";
import { DatePickerWithRange } from "~/components/date-range";
import { Button } from "~/components/ui/button";
import AdminController from "~/server/admin/AdminController.server";
import ReportController from "~/server/report/ReportController.server";
import { Bar, Line } from "react-chartjs-2";
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
import { ClientOnly } from "~/components/ClientOnly";
import OrderController from "~/server/order/OrderController.server";

export default function AdminProfile() {
  let { user, salesData } = useLoaderData();

  return (
    <div>
      <section className="mb-3 flex items-center gap-3">
        <h1 className="text-3xl font-bold">Sales Reports </h1>
        <Form
          method="GET"
          className="flex gap-3 items-center bg-white shadow-md p-2 rounded-lg ml-auto"
        >
          {/* <Input placeholder="product name..." name="product_name" /> */}
          <DatePickerWithRange />
          <Button>Filter</Button>
        </Form>
      </section>

      <Container
        heading="Sales Trends: "
        subHeading="Display sales trends over time, such as daily, weekly, and monthly comparisons."
      >
        <p>Total Sales: 2453</p>

        <p>asfasf</p>
      </Container>

      {/* <Container heading="Sales update" className="flex-1">
        <ClientOnly fallback={<div>Generating Chart</div>}>
          {() => (
            <Line
              options={{
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
              }}
              data={salesData}
            />
          )}
        </ClientOnly>
      </Container> */}
    </div>
  );
}

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);

  const adminController = await new AdminController(request);
  await adminController.requireAdminId();
  const user = await adminController.getAdmin();

  const from = url.searchParams.get("from") as string;
  const to = url.searchParams.get("to") as string;

  const reportController = await new ReportController(request);
  const sales = await reportController.salesReport({ from, to });

  const orderController = await new OrderController(request);
  const salesData = await orderController.getOrderStats();

  return { user, salesData };
};

export const meta: MetaFunction = () => {
  return [
    { title: "ComClo - Sales Report" },
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
