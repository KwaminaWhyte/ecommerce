import {
  type ActionFunction,
  redirect,
  json,
  type LoaderFunction,
  type MetaFunction,
} from "@remix-run/node";
import { Form, useActionData, useNavigation } from "@remix-run/react";

import Input from "~/components/Input";
import Spacer from "~/components/Spacer";
import { validateEmail, validatePassword } from "~/modules/validators.server";
import EmployeeAuthController from "~/modules/employee/EmployeeAuthController";
import AdminPublicLayout from "~/components/layouts/AdminPublicLayout";
import { Button } from "~/components/ui/button";

export default function AdminLogin() {
  let data = useActionData();
  const navigation = useNavigation();

  return (
    <AdminPublicLayout message={data}>
      <div className="m-auto w-2/5 rounded-md bg-white p-4 shadow-sm dark:bg-slate-800">
        <h2 className="my-5 text-3xl font-bold">Log into your Dashboard</h2>

        <Form method="POST">
          <Input
            name="email"
            placeholder="Email"
            label="Email"
            type="email"
            defaultValue={data?.fields?.email}
            error={data?.errors?.email}
          />
          <Spacer />
          <Input
            name="password"
            placeholder="Password"
            label="Password"
            type="password"
            defaultValue={data?.fields?.password}
            error={data?.errors?.password}
          />
          <Spacer />

          <div className="flex items-center justify-between">
            {/* <p>
              Don't have an Account?{" "}
              <Link className="text-blue-600" to="/console/signup">
                Signup
              </Link>
            </p> */}
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
  const authController = await new EmployeeAuthController(request);
  return await authController.loginEmployee({ email, password });
};

export const loader: LoaderFunction = async ({ request }) => {
  const authController = await new EmployeeAuthController(request);
  return (await authController.getEmployee()) ? redirect("/console") : null;
};
