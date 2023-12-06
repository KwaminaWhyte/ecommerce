import {
  type ActionFunction,
  redirect,
  json,
  type LoaderFunction,
  type MetaFunction,
} from "@remix-run/node";
import { Link, useActionData, useNavigation } from "@remix-run/react";

import Input from "~/components/Input";
import Spacer from "~/components/Spacer";
import UserLayout from "~/components/layouts/UserLayout";
import { Button } from "~/components/ui/button";
import UserController from "~/server/user/UserController.server";
import {
  validateEmail,
  validatePassword,
  validateUsername,
} from "~/server/validators.server";

export default function Signup() {
  let data = useActionData();
  let navigation = useNavigation();

  return (
    <UserLayout title="Sign up">
      <div className="m-auto w-full rounded-md bg-white p-4 shadow-sm dark:bg-slate-800 md:w-2/5">
        {data?.error && (
          <div role="alert" className="text-red-500">
            {data.error}
          </div>
        )}
        <form action="" method="POST">
          <Input
            name="username"
            placeholder="Username"
            label="Username"
            defaultValue={data?.fields?.username}
            error={data?.errors?.username}
          />
          <Spacer />

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

          <div className="flex flex-col items-center justify-between">
            <Button
              className="ml-auto"
              type="submit"
              disabled={navigation.state === "submitting" ? true : false}
            >
              {navigation.state === "submitting" ? "Submitting..." : "Sign Up"}
            </Button>

            <p className="mr-auto">
              Already have an Account?{" "}
              <Link className="text-purple-600" to="/login">
                Login
              </Link>
            </p>
          </div>
        </form>
      </div>
    </UserLayout>
  );
}

export const meta: MetaFunction = () => {
  return [
    { title: "ComClo - Signup" },
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
  let username = formData.get("username");
  let email = formData.get("email");
  let password = formData.get("password");

  if (
    typeof email !== "string" ||
    typeof password !== "string" ||
    typeof username !== "string"
  ) {
    return json({ error: "Invalid email or password" }, { status: 400 });
  }

  const errors = {
    username: validateUsername(username),
    email: validateEmail(email),
    password: validatePassword(password),
  };

  if (Object.values(errors).some(Boolean)) {
    return json(
      { errors, fields: { email, password, username } },
      { status: 400 }
    );
  }

  const userController = await new UserController(request);
  return await userController.registerUser({ username, email, password });
};

export const loader: LoaderFunction = async ({ request }) => {
  const userController = await new UserController(request);
  return (await userController.getUser()) ? redirect("/") : null;
};
