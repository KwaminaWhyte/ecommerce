import type { ActionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import UserController from "~/modules/user/UserController.server";

export const action = async ({ request }) => {
  const userController = await new UserController(request);
  return await userController.logout();
};

export const loader = async () => redirect("/");
