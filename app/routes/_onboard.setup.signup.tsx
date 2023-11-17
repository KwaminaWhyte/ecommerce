import {
  type ActionFunction,
  json,
  type LoaderFunction,
  type MetaFunction,
} from "@remix-run/node";
import { Form, Link, useActionData, useNavigation } from "@remix-run/react";

import Input from "~/components/Input";
import Spacer from "~/components/Spacer";
import { Button } from "~/components/ui/button";

export default function Signup() {
  let data = useActionData();
  let navigation = useNavigation();

  return (
    <div className="flex min-h-screen w-full flex-col bg-slate-100/90 dark:bg-slate-900 dark:text-white">
      <main className="flex h-full w-full flex-1 flex-col p-3 ">
        <div className="m-auto w-2/5 rounded-md bg-white p-4 shadow-sm dark:bg-slate-800">
          <h2 className="my-5 text-xl font-bold">
            Sign up to join our platform
          </h2>

          <Form method="POST">
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
            <div className="flex items-center justify-between">
              <p>
                Already have an Account?{" "}
                <Link className="text-blue-600" to="/console/login">
                  Login
                </Link>
              </p>

              <Button
                type="submit"
                disabled={navigation.state === "submitting" ? true : false}
              >
                {navigation.state === "submitting"
                  ? "Submitting..."
                  : "Sign Up"}
              </Button>
            </div>
          </Form>
        </div>
      </main>
    </div>
  );
}

export const meta: MetaFunction = () => {
  return [
    { title: "ComClo - Console Sign Up" },
    {
      description: "the best shopping site",
    },
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

  return await signup(username, email, password, request);
};

export const loader: LoaderFunction = async ({ request }) => {
  // return (await getAdmin(request)) ? redirect("/") : null;
  return true;
};
