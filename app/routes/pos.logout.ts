import type { ActionFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import EmployeeAuthController from "~/server/employee/EmployeeAuthController";

export const action: ActionFunction = async ({ request }) => {
  const adminAuthControlle = await new EmployeeAuthController(request);
  return await adminAuthControlle.logout();
};

export const loader = async () => redirect("/pos");
