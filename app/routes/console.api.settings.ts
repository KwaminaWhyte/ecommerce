import type { LoaderArgs, ActionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";

import SettingsController from "~/server/settings/SettingsController.server";

export const action = async ({ request }) => {
  if (request.method !== "POST") {
    return json({ message: "Method not allowed" }, 405);
  }

  const payload = await request.json();
  const settingsController = await new SettingsController(request);

  const settings = await settingsController.updateNotification({
    item1: "afsas",
    item2: "asfasf",
  });

  return "settings saved..";

  //   switch (request.method) {
  //     case "POST": {
  //       /* handle "POST" */

  //     }
  //     case "PUT": {
  //       /* handle "PUT" */
  //     }
  //     case "PATCH": {
  //       /* handle "PATCH" */
  //     }
  //     case "DELETE": {
  //       /* handle "DELETE" */
  //     }
  //   }
};

export const loader = async ({ request }: LoaderArgs) => {
  // handle "GET" request

  return json({ success: true }, 200);
};
