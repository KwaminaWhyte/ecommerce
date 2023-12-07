import {
  type MetaFunction,
  type LoaderFunction,
  type ActionFunction,
  redirect,
} from "@remix-run/node";
import { Form, useLoaderData, useSubmit } from "@remix-run/react";

import Container from "~/components/Container";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import SettingsController from "~/server/settings/SettingsController.server";

export default function GeneralSettings() {
  const { generalSettings } = useLoaderData<{ generalSettings: any }>();
  const submit = useSubmit();
  console.log(generalSettings);

  return (
    <Container
      heading="General Settings"
      // subHeading="(work in progress)"
      contentClassName=""
    >
      <Form
        method="POST"
        className="flex-col grid grid-cols-2 gap-4 w-full"
        onChange={(event) => submit(event.currentTarget, { replace: true })}
      >
        <div className="grid w-full items-center gap-1.5">
          <Label htmlFor="businessName">Business Name</Label>
          <Input
            id="businessName"
            name="businessName"
            type="text"
            defaultValue={generalSettings?.businessName}
            required
          />
        </div>

        <div className="grid w-full items-center gap-1.5">
          <Label htmlFor="slogan">Slogan</Label>
          <Input
            id="slogan"
            name="slogan"
            type="text"
            defaultValue={generalSettings?.slogan}
            required
          />
        </div>

        <div className="grid w-full items-center gap-1.5">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="text"
            defaultValue={generalSettings?.email}
            required
          />
        </div>

        <div className="grid w-full items-center gap-1.5">
          <Label htmlFor="phone">Phone</Label>
          <Input
            id="phone"
            name="phone"
            type="text"
            defaultValue={generalSettings?.phone}
            required
          />
        </div>

        <div className="grid w-full items-center gap-1.5">
          <Label htmlFor="orderIdPrefix">Order Id Prefix</Label>
          <Input
            id="orderIdPrefix"
            name="orderIdPrefix"
            type="text"
            defaultValue={generalSettings?.orderIdPrefix}
            required
          />
        </div>

        <div className="grid w-full items-center gap-1.5">
          <Label htmlFor="allow_inscription">
            Allow Inscription on Item (will be moved to order settings)
          </Label>
          <Select
            name="allow_inscription"
            defaultValue={generalSettings?.allowInscription ? "true" : "false"}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Select</SelectLabel>
                <SelectItem value="true">Yes</SelectItem>
                <SelectItem value="false">No</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <div className="grid w-full items-center gap-1.5">
          <Label htmlFor="separate_stocks">
            Allow seperate stocks recordAllow seperate stocks record
          </Label>
          <Select
            name="separate_stocks"
            defaultValue={generalSettings?.allowInscription ? "true" : "false"}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select " />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Select</SelectLabel>
                <SelectItem value="true">Yes</SelectItem>
                <SelectItem value="false">No</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </Form>
    </Container>
  );
}

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();

  let businessName = formData.get("businessName") as string;
  let slogan = formData.get("slogan") as string;
  let email = formData.get("email") as string;
  let phone = formData.get("phone") as string;
  let orderIdPrefix = formData.get("orderIdPrefix") as string;
  let allow_inscription = formData.get("allow_inscription") as string;
  let separate_stocks = formData.get("separate_stocks") as string;

  const settingsController = await new SettingsController(request);
  await settingsController.updateGeneralSettings({
    businessName,
    slogan,
    email,
    phone,
    orderIdPrefix,
    allow_inscription,
    separate_stocks,
  });

  return redirect(`/console/settings`);
};

export const loader: LoaderFunction = async ({ request }) => {
  const settingsController = await new SettingsController(request);
  const generalSettings = await settingsController.getGeneralSettings();

  return { generalSettings };
};

export const meta: MetaFunction = () => {
  return [
    { title: "ComClo - Settings | General" },
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

export function ErrorBoundary({ error }) {
  console.error(error);
  return (
    <Container
      heading="Error"
      contentClassName="flex flex-col grid grid-cols-2 gap-3"
    >
      <p>Something went wrong!</p>
      <p>Contact Developer </p>
    </Container>
  );
}
