import { type LoaderFunction } from "@remix-run/node";
import { NavLink, Outlet, useLoaderData } from "@remix-run/react";
import Container from "~/components/Container";
import AdminLayout from "~/components/layouts/AdminLayout";
import AdminController from "~/modules/admin/AdminController.server";

const settingLinks = [
  {
    id: 1,
    name: "General",
    path: "/console/reports",
  },
  {
    id: 2,
    name: "Sales",
    path: "/console/reports/sales",
  },
  {
    id: 3,
    name: "Order",
    path: "/console/reports/orders",
  },
  {
    id: 4,
    name: "Inventory",
    path: "/console/reports/inventory",
  },
  {
    id: 8,
    name: "Financial",
    path: "/console/reports/financial",
  },
  {
    id: 9,
    name: "Customer",
    path: "/console/reports/customer",
  },
  {
    id: 7,
    name: "Employee ",
    path: "/console/reports/employee",
  },
];

export default function AdminProfile() {
  let { user } = useLoaderData();

  return (
    <AdminLayout user={user}>
      <div className="mt-3 flex mb-5 justify-between gap-2 rounded-lg border border-slate-400 bg-white px-3 py-2 shadow-sm dark:bg-black/95">
        {settingLinks.map((link) => (
          <NavLink
            key={link.id}
            className={({ isActive, isPending }) =>
              isPending
                ? "rounded-lg px-2 py-1 text-blue-600 "
                : isActive
                ? "rounded-lg bg-blue-700 text-white px-2 py-1 transition-all duration-200 dark:bg-blue-700 dark:text-white"
                : "rounded-lg px-2 py-1  transition-all duration-200"
            }
            to={link.path}
            end
          >
            {link.name}
          </NavLink>
        ))}
      </div>

      <Outlet />
    </AdminLayout>
  );
}

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
