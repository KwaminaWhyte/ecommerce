import { type LoaderFunction } from "@remix-run/node";
import { NavLink, Outlet, useLoaderData } from "@remix-run/react";
import AdminLayout from "~/components/layouts/AdminLayout";
import IdGenerator from "~/lib/IdGenerator";
import AdminController from "~/server/admin/AdminController.server";

const settingLinks = [
  {
    id: 1,
    name: "General",
    path: "/console/settings",
  },
  {
    id: 2,
    name: "Notifications",
    path: "/console/settings/notifications",
  },
  // {
  //   id: 3,
  //   name: "Themes",
  //   path: "/console/settings/themes",
  // },
  // {
  //   id: 4,
  //   name: "Billing",
  //   path: "/console/settings/billing",
  // },
  // {
  //   id: 8,
  //   name: "Shop Branches",
  //   path: "/console/settings/shop_branches",
  // },
  // {
  //   id: 9,
  //   name: "Customers",
  //   path: "/console/settings/customers",
  // },
  // {
  //   id: 7,
  //   name: "Payment API",
  //   path: "/console/settings/payment_api",
  // },
  // {
  //   id: 5,
  //   name: "Integrations",
  //   path: "/console/settings/integrations",
  // },
];

export default function AdminSettings() {
  let { user } = useLoaderData();

  return (
    <AdminLayout user={user}>
      <h1 className="text-3xl font-bold">Settings</h1>

      <div className="mt-3 flex justify-between gap-2 rounded-lg border border-slate-400 bg-white px-3 py-2 shadow-sm dark:bg-black/95">
        {settingLinks.map((link) => (
          <NavLink
            key={IdGenerator(10)}
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
