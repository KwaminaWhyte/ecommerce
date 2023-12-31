import { type MetaFunction } from "@remix-run/node";
import Container from "~/components/Container";
import AdminLayout from "~/components/layouts/AdminLayout";

export default function Reviews() {
  return (
    <AdminLayout user={{ _id: "", username: "", email: "" }}>
      <div className="flex">
        <h1 className="text-3xl font-bold">Reviews</h1>
      </div>

      <div className="relative overflow-x-auto shadow-sm sm:rounded-lg">
        <p>asfasfas</p>
      </div>
    </AdminLayout>
  );
}

export const meta: MetaFunction = () => {
  return [
    { title: "ComClo - Reviews" },
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
