import { type MetaFunction, type LoaderFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import Container from "~/components/Container";
import AdminLayout from "~/components/layouts/AdminLayout";
import AdminController from "~/modules/admin/AdminController.server";

export default function AdminProfile() {
  let { user } = useLoaderData();

  return (
    <AdminLayout user={user}>
      <h1 className="text-3xl font-bold">Profile </h1>

      <div className="flex gap-3">
        <section className="flex w-64 flex-col items-center rounded-lg p-3 shadow-sm">
          <img
            className="h-60 w-60 rounded-3xl object-cover"
            src="https://images.unsplash.com/photo-1534751516642-a1af1ef26a56?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=389&q=80"
            alt=""
          />

          <h4 className="my-2 text-xl font-bold">{user?.username}</h4>
          <p>{user?.email}</p>
        </section>

        <section className="items-center rounded-lg p-3 shadow-sm">
          <h5>Account Details</h5>
        </section>
        <section className="rounded-lg p-3 shadow-sm"></section>
      </div>
    </AdminLayout>
  );
}

export const meta: MetaFunction = () => {
  return [
    { title: "ComClo - Profile" },
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
  const user = await adminController.getAdmin();

  return { user };
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
