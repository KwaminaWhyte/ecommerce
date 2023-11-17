import { type MetaFunction, type LoaderFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import Container from "~/components/Container";
import AdminController from "~/modules/admin/AdminController.server";

export default function AdminProfile() {
  let { user } = useLoaderData();

  return (
    <div>
      <h1 className="text-3xl font-bold">General Report</h1>
      <Container>
        <p>include all available reports</p>
      </Container>
    </div>
  );
}

export const meta: MetaFunction = () => {
  return [
    { title: "ComClo - General Report" },
    {
      description: "the best shopping site",
    },
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
