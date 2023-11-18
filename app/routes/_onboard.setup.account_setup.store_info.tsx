import { type ActionFunction, type MetaFunction } from "@remix-run/node";
import { Form } from "@remix-run/react";

import Input from "~/components/Input";
import Spacer from "~/components/Spacer";
import { Button } from "~/components/ui/button";
import ClientSetupController from "~/server/onboarding/ClientSetupController";

export default function SetupProfile() {
  return (
    <section className="w-1/2 mx-auto mt-11">
      <p className="font-bold text-2xl mb-3">Store Information </p>

      <Form method="POST">
        <Input name="name" placeholder="Store name" label="Store Name" />
        <Spacer />
        <Input name="email" type="email" placeholder="Email" label="Email" />
        <Spacer />
        <Input name="phone" placeholder="Phone Number" label="Phone Number" />
        <Spacer />

        <Button type="submit" className="mt-2">
          Proceed
        </Button>
      </Form>
    </section>
  );
}

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();

  let name = formData.get("name") as string;
  let email = formData.get("email") as string;
  let phone = formData.get("phone") as string;

  const setupController = await new ClientSetupController(request);
  return await setupController.createStore({ name, email, phone });
};

export const meta: MetaFunction = () => {
  return [
    { title: "ComClo - Setup Store" },
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
