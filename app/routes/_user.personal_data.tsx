import {
  type MetaFunction,
  type LoaderFunction,
  type ActionFunction,
  json,
} from "@remix-run/node";
import {
  Form,
  useActionData,
  useLoaderData,
  useNavigate,
  useNavigation,
} from "@remix-run/react";

import Input from "~/components/Input";
import Spacer from "~/components/Spacer";
import UserDetailLayout from "~/components/layouts/UserDetailLayout";
import { Button } from "~/components/ui/button";
import UserController from "~/modules/user/UserController.server";
import {
  validateEmail,
  validateName,
  validateUsername,
} from "~/modules/validators.server";

export default function UserProfile() {
  const data = useActionData();
  const navigation = useNavigation();
  const navigate = useNavigate();

  let { user } = useLoaderData<{
    user: UserInterface;
  }>();

  return (
    <UserDetailLayout
      title="Personal Data"
      className="mb-11 mt-5 flex w-full flex-col"
    >
      <img
        src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=464&q=80"
        alt=""
        className="mx-auto h-36 w-36 rounded-xl object-cover"
      />

      <Form method="POST" className="mt-11">
        <input type="hidden" name="type" value="profile" />

        <Input
          name="firstName"
          placeholder="First Name"
          label="First Name"
          type="text"
          defaultValue={user?.firstName}
          error={data?.errors?.firstName}
        />
        <Spacer />
        <Input
          name="middleName"
          placeholder="Middle Name"
          label="Middle Name"
          type="text"
          defaultValue={user?.middleName}
          error={data?.errors?.middleName}
        />
        <Spacer />
        <Input
          name="lastName"
          placeholder="Last Name"
          label="Last Name"
          type="text"
          defaultValue={user?.lastName}
          error={data?.errors?.lastName}
        />
        <Spacer />
        <Input
          name="username"
          placeholder="Username"
          label="Username"
          type="text"
          defaultValue={user?.username}
          error={data?.errors?.username}
        />
        <Spacer />
        <Input
          name="email"
          placeholder="Email"
          label="Email"
          type="email"
          defaultValue={user?.email}
          error={data?.errors?.email}
        />
        <Spacer />

        <div className="flex items-center justify-between">
          <Button
            type="submit"
            disabled={navigation.state === "submitting" ? true : false}
          >
            {navigation.state === "submitting" ? "Submitting..." : "Update"}
          </Button>
        </div>
      </Form>

      <Form method="POST" className="mt-6 border-t pt-6 dark:border-slate-400">
        <input type="hidden" name="type" value="password" />
        <Input
          name="current_password"
          placeholder="Current Password"
          label="Current Password"
          type="text"
          // defaultValue={user?.currentPassword}
          error={data?.errors?.currentPassword}
        />
        <Spacer />
        <Input
          name="password"
          placeholder="New Password"
          label="New Password"
          type="password"
          // defaultValue={user?.p}
          error={data?.errors?.password}
        />
        <Spacer />
        <Input
          name="confirm_password"
          placeholder="Confirm Password"
          label="Confirm Password"
          type="password"
          // defaultValue={user?.lastName}
          error={data?.errors?.password}
        />
        <Spacer />

        <div className="flex items-center justify-between">
          <Button
            type="submit"
            disabled={navigation.state === "submitting" ? true : false}
          >
            {navigation.state === "submitting"
              ? "Submitting..."
              : "Update Password"}
          </Button>
        </div>
      </Form>
    </UserDetailLayout>
  );
}

export const meta: MetaFunction = () => {
  return [
    { title: "ComClo - Update Profile" },
    {
      description: "the best shopping site",
    },
  ];
};

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();

  const userController = await new UserController(request);
  if ((formData.get("type") as string) == "profile") {
    let firstName = formData.get("firstName") as string;
    let middleName = formData.get("middleName") as string;
    let lastName = formData.get("lastName") as string;
    let username = formData.get("username") as string;
    let email = formData.get("email") as string;

    if (typeof email !== "string" || typeof firstName !== "string") {
      return json({ error: "Invalid email or password" }, { status: 400 });
    }

    const errors = {
      email: validateEmail(email),
      username: validateUsername(username),
      firstName: validateName(firstName),
    };
    if (Object.values(errors).some(Boolean)) {
      return json(
        {
          errors,
          fields: { firstName, middleName, lastName, username, email },
        },
        { status: 400 }
      );
    }
    return await userController.update({
      firstName,
      middleName,
      lastName,
      username,
      email,
    });
  } else {
    let current_password = formData.get("current_password") as string;
    let password = formData.get("password") as string;

    return await userController.changePassword({ current_password, password });
  }
};

export const loader: LoaderFunction = async ({ request }) => {
  const userController = await new UserController(request);
  await userController.requireUserId();
  const user = await userController.getUser();

  return { user };
};
