import { type LoaderFunction } from "@remix-run/node";
import React from "react";
import UserLayout from "~/components/layouts/UserLayout";
import UserController from "~/modules/user/UserController.server";

export default function UserSearch() {
  return (
    <UserLayout title="Search">
      <p>Search Page</p>
    </UserLayout>
  );
}
export const loader: LoaderFunction = async ({ request }) => {
  // await requireUserId(request);
  const userController = await new UserController(request);
  let user = await userController.getUser();

  return { products: [], user };
};
