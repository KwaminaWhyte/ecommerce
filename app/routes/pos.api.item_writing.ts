import type { LoaderArgs, ActionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import CartController from "~/server/cart/CartController.server";

export const action = async ({ request }) => {
  if (request.method !== "POST") {
    return json({ message: "Method not allowed" }, 405);
  }

  const cartController = await new CartController(request);

  const { inscription, itemId } = await request.json();

  await cartController.addInscription({ inscription, id: itemId });
  return "settings saved..";
};

export const loader = async ({ request }: LoaderArgs) => {
  // handle "GET" request

  return json({ success: true }, 200);
};
