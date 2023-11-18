import { type MetaFunction, type LoaderFunction } from "@remix-run/node";
import { Form, useLoaderData, useSubmit } from "@remix-run/react";
import { useState } from "react";
import Container from "~/components/Container";
import Toggle from "~/components/Toggle";
import SettingsController from "~/server/settings/SettingsController.server";
import logo from "~/components/inc/logo.png";
export default function AdminSettings() {
  const { payment_apis } = useLoaderData();
  const submit = useSubmit();
  const [notification, setNotification] = useState({});

  const handleToggleChange = (toggleName) => {
    setNotification((prevSettings) => ({
      ...prevSettings,
      [toggleName]: !prevSettings[toggleName],
    }));
  };

  return (
    <Container
      heading="Payment API"
      contentClassName="flex flex-col"
      subHeading="Configure all your payment methods (Work in progress)"
    >
      <Form
        method="POST"
        className="flex-col grid grid-cols-2 gap-3 w-full"
        onChange={(event) => submit(event.currentTarget, { replace: true })}
      ></Form>

      <section className="gap-2 flex flex-col">
        {payment_apis.map((api) => (
          <div key={api?._id} className="flex items-center">
            <img src={logo} alt="" className="h-16 w-16 rounded-full" />
            <div className="ml-3">
              <p className="font-bold">{api?.provider}</p>
              <p>
                {api?.description} asfhas fguiasi fguiag isfguasf
                iasgfjiasuifgias fiuga usf a
              </p>
            </div>

            <div className="ml-auto">
              <Toggle
                onToggleChange={() => handleToggleChange("orders_email")}
                enabled={notification?.orders_email}
              />
            </div>
          </div>
        ))}
      </section>
    </Container>
  );
}

export const meta: MetaFunction = () => {
  return [
    { title: "ComClo - Settings | Payment API" },
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
  const settingsController = await new SettingsController(request);
  const payment_apis = await settingsController.getAllPaymentApis();
  return { payment_apis };
};

// Key activation was successful
// API ID(username): mY6B9XE

// API Key(password): 7300ebb7743142e785caf1c33b38777e

// Web Checkout Base URL: https://payproxyapi.hubtel.com/items/initiate

// Account Numbers: https://bo.hubtel.com/money

// Please copy and use these confidentially. You may copy and share this information with your software engineer or developer.

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

/*

 TODO: 
  - 
 */
