import { cssBundleHref } from "@remix-run/css-bundle";
import type { LinksFunction, LoaderFunction } from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
  useRouteError,
} from "@remix-run/react";
import styles from "./tailwind.css";
import ErrorPage from "./components/error-page";
import { getSession } from "./session";
import moment from "moment";
import { useEffect } from "react";
import { useToast } from "./components/ui/use-toast";
import EmployeeAuthController from "./server/employee/EmployeeAuthController";
import type {
  CartInterface,
  EmployeeInterface,
  ProductInterface,
} from "./server/types";
import AdminController from "./server/admin/AdminController.server";
import CartController from "./server/cart/CartController.server";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: styles },
  ...(cssBundleHref ? [{ rel: "stylesheet", href: cssBundleHref }] : []),
];

export default function App() {
  const { message, user, cart_items } = useLoaderData<{
    message: { title: string; description?: string; status: string };
    user: EmployeeInterface;
    cart_items: ProductInterface[];
  }>();
  const { toast } = useToast();

  useEffect(() => {
    if (message) {
      toast({
        variant: message.status == "error" ? "destructive" : "default",
        title: message.title,
        description: moment().format("dddd, MMMM D, YYYY [at] h:mm A"),
      });
    }
  }, [message]);

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="text-sm bg-gradient-to-tr from-purple-300 to-red-300 dark:bg-gradient-to-tr dark:from-yellow-700 dark:to-purple-700">
        <Outlet context={{ user, cart_items }} />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}

export const loader: LoaderFunction = async ({ request }) => {
  const session = await getSession(request.headers.get("Cookie"));
  const message = session.get("message") || null;

  const employeeAuth = await new EmployeeAuthController(request);
  const employee = await employeeAuth.getEmployee();

  const adminAuth = await new AdminController(request);
  const admin = await adminAuth.getAdmin();

  if (employee) {
    const cartController = await new CartController(request);
    const cart_items = await cartController.getUserCart({
      user: (await employeeAuth.getEmployeeId()) as string,
    });

    return { message, user: employee, cart_items };
  } else if (admin) {
    return { message, user: admin };
  } else {
    return { message };
  }
};

export function ErrorBoundary() {
  const error = useRouteError();
  console.log(error);
  return (
    <html>
      <head>
        <title>Oops!</title>
        <Meta />
        <Links />
      </head>
      <body>
        {/* <h1>
          {isRouteErrorResponse(error)
            ? `${error.status} ${error.statusText}`
            : error instanceof Error
            ? error.message
            : "Unknown Error"}
        </h1> */}
        <ErrorPage />
        <Scripts />
      </body>
    </html>
  );
}
