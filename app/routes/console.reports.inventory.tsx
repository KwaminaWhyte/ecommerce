import { type MetaFunction, type LoaderFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import Container from "~/components/Container";
import AdminController from "~/server/admin/AdminController.server";
import ReportController from "~/server/report/ReportController.server";
import { ProductInterface } from "~/server/types";

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
      <h1 className="text-3xl font-bold">Inventory Reports </h1>

      <Container
        heading="Products Sold"
        subHeading="Display sales trends over time, such as daily, weekly, and monthly comparisons."
      >
        <p>asfasf</p>
      </Container>

      <Container
        heading="Products Running Low"
        subHeading="Display sales trends over time, such as daily, weekly, and monthly comparisons."
      >
        <p>asfasf</p>
      </Container>

      <Container
        heading="Products Not Selling"
        subHeading="Display sales trends over time, such as daily, weekly, and monthly comparisons."
      >
        <p>asfasf</p>
      </Container>

      <Container
        heading="Top Products Selling"
        subHeading="Display sales trends over time, such as daily, weekly, and monthly comparisons."
      >
        <p>asfasf</p>
      </Container>
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
