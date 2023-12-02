import {
  type MetaFunction,
  type LoaderFunction,
  type ActionFunction,
} from "@remix-run/node";
import { Form, useLoaderData, useSubmit } from "@remix-run/react";
import { useState } from "react";
import Container from "~/components/Container";
import Input from "~/components/Input";
import TextArea from "~/components/TextArea";
import Toggle from "~/components/Toggle";
import SettingsController from "~/server/settings/SettingsController.server";

export default function AdminSettings() {
  let { notification_settings, sms_gateway } = useLoaderData();
  const submit = useSubmit();
  const [notification, setNotification] = useState({});
  // Function to handle toggle changes
  const handleToggleChange = (toggleName) => {
    setNotification((prevSettings) => ({
      ...prevSettings,
      [toggleName]: !prevSettings[toggleName],
    }));
  };

  return (
    <Container
      heading="Notification Settings"
      subHeading="We may still send you important notifications about your account outside of your notification settings (Work In Progress)"
      contentClassName="flex-col  gap-4"
    >
      <h3 className="text-lg font-semibold">SMS Gateway</h3>
      <Form
        className="flex-col grid grid-cols-2 gap-3 w-full"
        method="POST"
        onChange={(event) => submit(event.currentTarget, { replace: true })}
      >
        <Input
          name="api_token"
          defaultValue={sms_gateway?.api_token}
          placeholder="API Token"
          label="API Token"
        />

        <Input
          name="api_endpoint"
          defaultValue={sms_gateway?.api_endpoint}
          placeholder="API Endpoint"
          label="API Endpoint"
        />

        <TextArea
          name="api_key"
          defaultValue={sms_gateway?.api_key}
          placeholder="API Key"
          label="API Key"
          rows={6}
        />
      </Form>

      <h3 className="text-lg font-semibold mt-5">Email Gateway</h3>
      <Form
        className="flex-col grid grid-cols-2 gap-3 w-full"
        method="POST"
        onChange={(event) => submit(event.currentTarget, { replace: true })}
      >
        <Input
          name="api_token"
          defaultValue={sms_gateway?.api_token}
          placeholder="API Token"
          label="Email Transport Method" // smtp / sendmail / phpmail
        />

        <Input
          name="api_endpoint"
          defaultValue={sms_gateway?.api_endpoint}
          placeholder="API Endpoint"
          label="SMTP Server Hostname"
        />

        <Input
          name="api_endpoint"
          defaultValue={sms_gateway?.api_endpoint}
          placeholder="API Endpoint"
          label="SMTP Server Port Number"
        />

        <Input
          name="api_endpoint"
          defaultValue={sms_gateway?.api_endpoint}
          placeholder="API Endpoint"
          label="SMTP Server Port Authentication"
        />

        <Input
          name="api_endpoint"
          defaultValue={sms_gateway?.api_endpoint}
          placeholder="API Endpoint"
          label="SMTP Server Port Password"
        />

        <Input
          name="api_endpoint"
          defaultValue={sms_gateway?.api_endpoint}
          placeholder="API Endpoint"
          label="SMTP Security Protocol" // ssl / lts
        />
      </Form>

      <h3 className="text-lg font-semibold">Notification</h3>
      <Form
        method="POST"
        className="flex-col grid grid-cols-2 gap-3 w-full"
        onChange={(event) => submit(event.currentTarget, { replace: true })}
      >
        <p className="font-semibold">Orders</p>
        <p className="">These are notification for orders</p>

        <div className="mb-1 flex items-center justify-between">
          <p className="">Push</p>
          <Toggle
            onToggleChange={() => handleToggleChange("orders_push")}
            enabled={notification?.orders_push}
          />
        </div>

        <div className="mb-1 flex items-center justify-between">
          <p className="">Email</p>
          <Toggle
            onToggleChange={() => handleToggleChange("orders_email")}
            enabled={notification?.orders_email}
          />
        </div>

        <div className="flex items-center justify-between">
          <p className="">SMS</p>
          <Toggle
            onToggleChange={() => handleToggleChange("orders_sms")}
            enabled={notification?.orders_sms}
          />
        </div>
      </Form>

      <section>
        <p>Reviews</p>
      </section>

      <section>
        <p>Users</p>
      </section>

      <section>
        <p>Reminders</p>
      </section>
    </Container>
  );
}

export const meta: MetaFunction = () => {
  return [
    { title: "ComClo - Settings | Notification" },
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

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const settingsController = await new SettingsController(request);

  await settingsController.updateSmsGateway({
    api_key: formData.get("api_key") as string,
    api_token: formData.get("api_token") as string,
    api_endpoint: formData.get("api_endpoint") as string,
  });
  return "settings saved..";
};

export const loader: LoaderFunction = async ({ request }) => {
  const settingsController = await new SettingsController(request);
  const notification_settings =
    await settingsController.getNotificationSettings();
  const sms_gateway = await settingsController.getSmsGateway();

  return { notification_settings, sms_gateway };
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

// Hello Tony,
// Please find attached the API document as requested.

// Here is your API Key & Endpoint

// eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiIxMjgiLCJvaWQiOjEyOCwidWlkIjoiMGUwZDJmOGMtOGNjYy00YTc5LWE3OWUtOTNkZjZiZGE1N2YzIiwiYXBpZCI6MjAsImlhdCI6MTYyNzM4NzcyNywiZXhwIjoxOTY3Mzg3NzI3fQ.xH2gpaEw4UEO4uwZaLXdaZGWZapLKo64F3sNZ9QLQyNDwvj_4fIhPWlL4HxKP3osvrcRXfKdQ6SlE6EH9tyffA

// Endpoint : http://206.225.81.36:8989/api/messaging/sendsms
