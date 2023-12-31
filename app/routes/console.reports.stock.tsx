import { type MetaFunction, type LoaderFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import Container from "~/components/Container";
import AdminController from "~/server/admin/AdminController.server";

export default function InventoryReport() {
  return (
    <div>
      <h1 className="text-3xl font-bold">Stock Reports </h1>

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

export const meta: MetaFunction = () => {
  return [
    { title: "ComClo - Stock Report" },
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
      contentClassName="flex-col grid grid-cols-2 gap-3"
    >
      <p>Something went wrong!</p>
    </Container>
  );
}
