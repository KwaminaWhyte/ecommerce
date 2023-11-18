import { type MetaFunction, type LoaderFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import Container from "~/components/Container";
import AdminController from "~/server/admin/AdminController.server";

export default function FinancialReport() {
  return (
    <div>
      <h1 className="text-3xl font-bold">Financial Reports </h1>
      <Container
        heading="Sales by Channel"
        subHeading="Multiple sales channels (e.g., online store, physical store), break down sales by channel."
      >
        <p>asfasf</p>
      </Container>

      <Container
        heading="Sales Trends: "
        subHeading="Display sales trends over time, such as daily, weekly, and monthly comparisons."
      >
        <p>asfasf</p>
      </Container>
    </div>
  );
}

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

export const loader: LoaderFunction = async ({ request }) => {
  const adminController = await new AdminController(request);
  await adminController.requireAdminId();

  return {};
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
