import {
  json,
  type ActionFunction,
  type MetaFunction,
  type LoaderFunction,
} from "@remix-run/node";
import { Form } from "@remix-run/react";

import Input from "~/components/Input";
import Spacer from "~/components/Spacer";
import { Button } from "~/components/ui/button";
import ClientSetupController from "~/modules/onboarding/ClientSetupController";

export default function SetupProfile() {
  return (
    <section className="w-1/2 mx-auto mt-11">
      <p className="font-bold text-2xl mb-3">User Profile</p>

      <Form method="POST">
        <Input name="username" placeholder="Your name" label="Your Name" />
        <Spacer />
        <Input name="email" type="email" placeholder="Email" label="Email" />
        <Spacer />
        <Input name="phone" placeholder="Phone Number" label="Phone Number" />
        <Spacer />
        <Input
          type="password"
          name="password"
          placeholder="Password"
          label="Password"
        />
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

  let username = formData.get("username") as string;
  let email = formData.get("email") as string;
  let phone = formData.get("phone") as string;
  let password = formData.get("password") as string;

  if (typeof email !== "string" || typeof password !== "string") {
    return json(
      { message: "Invalid email or password", type: "error" },
      { status: 400 }
    );
  }

  const setupController = await new ClientSetupController(request);
  return await setupController.createProfile({
    username,
    email,
    phone,
    password,
  });
};

export const loader: LoaderFunction = async ({ request }) => {
  return true;
};

export const meta: MetaFunction = () => {
  return [
    { title: "ComClo - Setup Account" },
    {
      description: "the best shopping site",
    },
  ];
};
