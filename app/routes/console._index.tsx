import type { LoaderFunction, MetaFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
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
import { faker } from "@faker-js/faker";
import Container from "~/components/Container";
import AdminLayout from "~/components/layouts/AdminLayout";
import AdminController from "~/modules/admin/AdminController.server";
import OrderController from "~/modules/order/OrderController.server";
import type { ProductInterface } from "~/modules/types";
import SenderController from "~/modules/notification/SenderController";
import { ClientOnly } from "~/components/ClientOnly";
import Loader from "~/components/Loader";

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

export default function Dashboard() {
  let {
    user,
    salesOprions,
    salesUpdate,
    totalRevenue,
    completedCount,
    pendingCount,
    bestsellingProducts,
    visitsOptions,
    visitUpdate,
  } = useLoaderData();

  const topTotals = [
    {
      title: "Total Revenue",
      value: `$${totalRevenue}`,
      color: "bg-red-300/70",
      textColor: "text-red-700",
    },
    {
      title: "Orders Completed",
      value: completedCount,
      color: "bg-green-300/70",
      textColor: "text-green-700",
    },
    {
      title: "Total Store Visits",
      value: "328",
      color: "bg-blue-300/70",
      textColor: "text-blue-700",
    },
    {
      title: "Pending Orders",
      value: pendingCount,
      color: "bg-yellow-300/70",
      textColor: "text-yellow-700",
    },
  ];

  return (
    <AdminLayout user={user}>
      {/* <h1 className="text-xl font-bold">Dashboard</h1> */}

      <section className="">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div className="flex flex-col md:flex-row md:items-center">
            <h1 className="text-3xl font-bold">Dashboard</h1>
            {/* <p className="ml-2 text-slate-500"></p> */}
          </div>
        </div>
      </section>

      <section className="mt-5 flex w-full justify-between gap-3 overflow-hidden overflow-x-auto py-2">
        {topTotals.map((total) => (
          <div
            key={total.title}
            className={`flex flex-1 items-center justify-between rounded-xl p-5 shadow-md  ${total?.color}`}
          >
            <div>
              <p className="text-2xl font-bold">{total.value}</p>
              <p
                className={`"whitespace-nowrap font-semibold " ${total?.textColor}`}
              >
                {total.title}
              </p>
            </div>
            <div className="rounded-full bg-slate-100 p-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 text-slate-500"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 3a7 7 0 100 14 7 7 0 000-14zM8 9a2 2 0 114 0 2 2 0 01-4 0z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </div>
        ))}
      </section>

      <div className="flex w-full gap-3">
        <Container heading="Sales update" className="flex-1">
          <ClientOnly fallback={<div>Generating Chart</div>}>
            {() => <Line options={salesOprions} data={salesUpdate} />}
          </ClientOnly>
        </Container>

        <Container heading="Recent Review" className="w-2/5">
          <p className=" "></p>
        </Container>
      </div>

      <div className="mt-5 flex w-full gap-3">
        <Container
          heading="Bestselling Products"
          className="w-1/2"
          contentClassName="flex-col gap-2"
        >
          <table className="w-full text-left text-slate-500 dark:text-slate-400">
            <thead className=" uppercase text-slate-700 dark:text-slate-400 ">
              <tr>
                <th scope="col" className="px-3 py-3"></th>
                <th scope="col" className="px-3 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {bestsellingProducts.map((product: ProductInterface) => (
                <tr
                  key={product?._id}
                  className="cursor-pointer rounded-xl hover:bg-slate-50 hover:shadow-md dark:border-slate-400 dark:bg-slate-800 dark:hover:bg-slate-600"
                >
                  <th
                    scope="row"
                    className="flex px-3 items-center py-3 font-medium text-slate-900 dark:text-white"
                  >
                    <img
                      src={product.images[0].url}
                      className="w-12 h-12 mr-3 rounded-md object-cover"
                      alt=""
                    />
                    <div>
                      <p>{product?.name}</p>
                      <p>
                        ${product?.price}/each * {product?.quantitySold}
                      </p>
                    </div>
                  </th>

                  <td className="px-3 py-3 text-blue-700">
                    ${product?.quantitySold * product?.price}{" "}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* <Link to="/console/orders" className="">
            View All
          </Link> */}
        </Container>

        <Container heading="Visitors" className="w-1/2">
          <ClientOnly fallback={<div>Generating Chart</div>}>
            {() => <Bar options={visitsOptions} data={visitUpdate} />}
          </ClientOnly>
        </Container>
      </div>

      <div className="mt-5 flex w-full gap-3">
        <Container heading="Support Inbox" className="w-[60%]">
          <p className=" "></p>
        </Container>
      </div>
    </AdminLayout>
  );
}

export const meta: MetaFunction = () => {
  return [
    { title: "ComClo - Console Dashboard" },
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
  const sender = await new SenderController(request);
  await sender.createSMS({
    subject: "asfasf",
    body: "asfsf",
  });

  const adminControlle = await new AdminController(request);
  await adminControlle.requireAdminId();
  const user = await adminControlle.getAdmin();

  const orderController = await new OrderController(request);
  const salesUpdate = await orderController.getOrderStats();
  const { totalRevenue, completedCount, pendingCount, bestsellingProducts } =
    await orderController.getTotals();

  const salesOprions = {
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

  const visitsOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: "Live Update",
      },
    },
  };
  const labels = ["February", "March", "April", "May"];
  const visitUpdate = {
    labels,
    datasets: [
      {
        // label: "Dataset 1",
        data: labels.map(() => faker.number.int({ min: 0, max: 1000 })),
        backgroundColor: "rgba(255, 99, 132, 0.5)",
      },
      // {
      //   label: "Dataset 2",
      //   data: labels.map(() => faker.datatype.number({ min: 0, max: 1000 })),
      //   backgroundColor: "rgba(53, 162, 235, 0.5)",
      // },
    ],
  };

  return {
    user,
    salesOprions,
    salesUpdate,
    totalRevenue,
    completedCount,
    pendingCount,
    bestsellingProducts,
    visitsOptions,
    visitUpdate,
  };
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

// function Fallback() {
//   return <div>Generating Chart</div> ;
// }
