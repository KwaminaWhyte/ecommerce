import {
  type ActionFunction,
  redirect,
  json,
  type LoaderFunction,
  type MetaFunction,
} from "@remix-run/node";
import { Form, useActionData, useNavigation } from "@remix-run/react";

import AdminController from "~/server/admin/AdminController.server";
import { validateEmail, validatePassword } from "~/server/validators.server";
import AdminPublicLayout from "~/components/layouts/AdminPublicLayout";
import { Button } from "~/components/ui/button";
import { Label } from "~/components/ui/label";
import { Input } from "~/components/ui/input";

export default function AdminLogin() {
  let data = useActionData();
  const navigation = useNavigation();

  return (
    <AdminPublicLayout message={data}>
      <div className="m-auto w-2/5 rounded-md bg-white p-4 shadow-sm dark:bg-slate-800">
        <h2 className="my-5 text-3xl font-bold">Log into your Dashboard</h2>

        <Form method="POST" className="flex flex-col gap-4">
          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="text" name="email" required />
          </div>

          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" name="password" required />
          </div>

          <div className="flex items-center justify-between">
            <Button
              type="submit"
              className="ml-auto"
              disabled={navigation.state === "submitting" ? true : false}
            >
              {navigation.state === "submitting" ? "Submitting..." : "Login"}
            </Button>
          </div>
        </Form>
      </div>
    </AdminPublicLayout>
  );
}

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  let email = formData.get("email");
  let password = formData.get("password");

  if (typeof email !== "string" || typeof password !== "string") {
    return json({ error: "Invalid email or password" }, { status: 400 });
  }

  const errors = {
    email: validateEmail(email),
    password: validatePassword(password),
  };

  if (Object.values(errors).some(Boolean)) {
    return json({ errors, fields: { email, password } }, { status: 400 });
  }
  const adminController = await new AdminController(request);

  return await adminController.loginAdmin({ email, password });
};

export const loader: LoaderFunction = async ({ request }) => {
  const adminController = await new AdminController(request);
  return (await adminController.getAdmin()) ? redirect("/console") : null;
};

export const meta: MetaFunction = () => {
  return [
    { title: "ComClo - Admin Login" },
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
