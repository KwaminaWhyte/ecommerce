import type { LoaderFunction, MetaFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import Container from "~/components/Container";
import PosLayout from "~/components/layouts/PosLayout";
import CartController from "~/server/cart/CartController.server";
import EmployeeAuthController from "~/server/employee/EmployeeAuthController";
import SettingsController from "~/server/settings/SettingsController.server";

export default function Shop() {
  let { user, cart_items, generalSettings } = useLoaderData();

  return (
    <PosLayout user={user} cart_items={cart_items} settings={generalSettings}>
      <section className="">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div className="flex flex-col md:flex-row md:items-center">
            <h1 className="text-3xl font-bold">
              Welcome back, {user?.username}
            </h1>
            {/* <p className="ml-2 text-slate-500"></p> */}
          </div>
        </div>
      </section>

      <section>
        <p>
          replicate admin dashboard, but allow adminn to choose what they see or
          what employees see on the dashboard
        </p>
      </section>
    </PosLayout>
  );
}

export const meta: MetaFunction = () => {
  return [
    { title: "ComClo - POS Dashboard" },
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
  const authControlle = await new EmployeeAuthController(request);
  await authControlle.requireEmployeeId();
  const user = await authControlle.getEmployee();

  const settingsController = await new SettingsController(request);
  const generalSettings = await settingsController.getGeneralSettings();

  const cartController = await new CartController(request);
  const cart_items = await cartController.getUserCart({
    user: user._id as string,
  });

  return { user, cart_items, generalSettings };
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
