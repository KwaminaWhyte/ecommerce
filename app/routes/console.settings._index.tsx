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

import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { useEffect, useState } from "react";
import imgPlaceholder from "~/components/inc/placeholder-image.jpg";

export default function GeneralSettings() {
  const { generalSettings } = useLoaderData<{ generalSettings: any }>();
  const submit = useSubmit();
  const [base64String, setBase64String] = useState("");
  const [isImageOpen, setIsImageOpen] = useState(false);

  const handleUpload = async () => {
    submit(
      {
        actionType: "upload-logo",
        logo: base64String,
      },
      {
        method: "post",
      }
    );
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      const reader = new FileReader();

      reader.onloadend = () => {
        // The result attribute contains the data as a Base64 encoded string
        const base64 = reader.result;
        setBase64String(base64);
      };

      // Read the image file as a data URL
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    setIsImageOpen(false);
  }, [generalSettings]);
  return (
    <div className="flex w-full flex-col">
      <section className="flex flex-col items-center justify-center gap-3">
        <img
          src={generalSettings?.logo ? generalSettings?.logo : imgPlaceholder}
          alt=""
          className="h-32 w-32 rounded-md"
        />

        <Dialog
          open={isImageOpen}
          onOpenChange={() => setIsImageOpen(!isImageOpen)}
        >
          <DialogTrigger asChild>
            <Button className="">Upload Logo</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Upload Logo</DialogTitle>
            </DialogHeader>

            <div className=" bg-white p-4 rounded-2xl  flex-col gap-5 items-center">
              <div className="grid flex-1 items-center gap-1.5 mb-5">
                <Label htmlFor="image">Logo</Label>
                <Input
                  type="file"
                  id="image"
                  name="image"
                  accept=".png,.jpg,jpeg"
                  multiple
                  onChange={handleImageChange}
                />
              </div>

              <div className="flex gap-3 items-center justify-end ">
                <DialogClose asChild>
                  <Button type="button" variant="destructive">
                    Close
                  </Button>
                </DialogClose>

                <Button type="button" onClick={handleUpload}>
                  Submit
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </section>

      <Container
        heading="General Settings"
        // subHeading="(work in progress)"
        contentClassName=""
        className="mt-3 w-full"
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
            <Label htmlFor="address">Address</Label>
            <Input
              id="address"
              name="address"
              type="text"
              defaultValue={generalSettings?.address}
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
              defaultValue={
                generalSettings?.allowInscription ? "true" : "false"
              }
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
              defaultValue={generalSettings?.separateStocks ? "true" : "false"}
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

          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="include_sales_person">Include Sales Person</Label>
            <Select
              name="include_sales_person"
              defaultValue={
                generalSettings?.includeSalesPerson ? "true" : "false"
              }
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
        </Form>
      </Container>
    </div>
  );
}

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();

  const businessName = formData.get("businessName") as string;
  const slogan = formData.get("slogan") as string;
  const email = formData.get("email") as string;
  const phone = formData.get("phone") as string;
  const orderIdPrefix = formData.get("orderIdPrefix") as string;
  const allow_inscription = formData.get("allow_inscription") as string;
  const separate_stocks = formData.get("separate_stocks") as string;
  const address = formData.get("address") as string;
  const include_sales_person = formData.get("include_sales_person") as string;

  const actionType = formData.get("actionType") as string;
  const logo = formData.get("logo") as string;

  const settingsController = await new SettingsController(request);

  if (actionType == "upload-logo") {
    await settingsController.updateLogo(logo);
    return redirect(`/console/settings`);
  } else {
    await settingsController.updateGeneralSettings({
      businessName,
      slogan,
      email,
      phone,
      orderIdPrefix,
      allow_inscription,
      separate_stocks,
      address,
      include_sales_person,
    });

    return redirect(`/console/settings`);
  }
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
