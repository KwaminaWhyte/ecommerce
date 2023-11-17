import { type LoaderFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import Container from "~/components/Container";
import AdminLayout from "~/components/layouts/AdminLayout";

export default function Categories() {
  let { user } = useLoaderData();

  return (
    <AdminLayout user={user}>
      <p>Product Categories</p>
    </AdminLayout>
  );
}

export const loader: LoaderFunction = async ({ request }) => {
  await requireAdminId(request);
  let admin = await getAdmin(request);

  return { user: admin };
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
