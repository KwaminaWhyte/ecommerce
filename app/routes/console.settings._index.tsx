import {
  type MetaFunction,
  type LoaderFunction,
  type ActionFunction,
  redirect,
} from "@remix-run/node";
import {
  Form,
  useActionData,
  useLoaderData,
  useNavigation,
  useSubmit,
} from "@remix-run/react";

import Container from "~/components/Container";
import Input from "~/components/Input";
import SimpleSelect from "~/components/SimpleSelect";
import SettingsController from "~/modules/settings/SettingsController.server";

export default function GeneralSettings() {
  const data = useActionData();
  const { generalSettings } = useLoaderData();
  const navigation = useNavigation();
  const submit = useSubmit();

  return (
    <Container
      heading="General Settings"
      subHeading="(work in progress)"
      contentClassName=""
    >
      <Form
        method="POST"
        className="flex-col grid grid-cols-2 gap-3 w-full"
        onChange={(event) => submit(event.currentTarget, { replace: true })}
      >
        <Input
          name="businessName"
          placeholder="Name"
          label="Shop Name"
          type="text"
          defaultValue={generalSettings?.businessName}
          error={data?.errors?.businessName}
        />

        <Input
          name="slogan"
          placeholder="Slogan"
          label="Slogan"
          type="text"
          defaultValue={generalSettings?.slogan}
          error={data?.errors?.slogan}
        />

        <Input
          name="email"
          placeholder="Email"
          label="Email"
          type="email"
          defaultValue={generalSettings?.email}
          error={data?.errors?.email}
        />

        <Input
          name="phone"
          placeholder="Phone"
          label="Phone Number"
          type="phone"
          defaultValue={generalSettings?.phone}
          error={data?.errors?.phone}
        />

        <Input
          name="orderIdPrefix"
          placeholder="Order Id Prefix"
          label="Order Id Prefix"
          type="orderIdPrefix"
          defaultValue={generalSettings?.orderIdPrefix}
          error={data?.errors?.orderIdPrefix}
        />

        <SimpleSelect
          defaultValue={generalSettings?.allowInscription}
          name="allow_inscription"
          variant="ghost"
          label="Allow Inscription on Item (will be moved to order settings)"
        >
          <option value="">Select Status</option>
          <option value="true">Yes</option>
          <option value="false">No</option>
        </SimpleSelect>
      </Form>
    </Container>
  );
}

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

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();

  let businessName = formData.get("businessName") as string;
  let slogan = formData.get("slogan") as string;
  let email = formData.get("email") as string;
  let phone = formData.get("phone") as string;
  let orderIdPrefix = formData.get("orderIdPrefix") as string;
  let allow_inscription = formData.get("allow_inscription") as string;

  const settingsController = await new SettingsController(request);
  await settingsController.updateGeneralSettings({
    businessName,
    slogan,
    email,
    phone,
    orderIdPrefix,
    allow_inscription,
  });

  return redirect(`/console/settings`);
};

export const loader: LoaderFunction = async ({ request }) => {
  const settingsController = await new SettingsController(request);
  const generalSettings = await settingsController.getGeneralSettings();

  return { generalSettings };
};

export function ErrorBoundary({ error }) {
  console.error(error);
  return (
    <Container
      heading="Error"
      className="bg-red-300 dark:bg-red-500"
      contentClassName="flex-col grid grid-cols-2 gap-3"
    >
      <p>Something went wrong!</p>
    </Container>
  );
}
