import { type MetaFunction, type LoaderFunction } from "@remix-run/node";
import { Form, useLoaderData, useSubmit } from "@remix-run/react";
import { useState } from "react";
import Container from "~/components/Container";
import Toggle from "~/components/Toggle";

export default function AdminSettings() {
  const submit = useSubmit();

  const [settings, setSettings] = useState({
    multiple_branches: false,
    product_separation: false,
  });

  const handleToggleChange = (toggleName) => {
    setSettings((prevSettings) => ({
      ...prevSettings,
      [toggleName]: !prevSettings[toggleName],
    }));
  };

  return (
    <Container
      heading="Shop Branches"
      contentClassName="flex-col grid grid-cols-2 gap-4"
      subHeading="Shop Branches Settings (work in progress)"
    >
      <section className="">
        <p className="font-semibold">Enable multiple branches</p>

        <div className="mb-1 flex items-center justify-between">
          <p className="">
            If you have more than one branch, toggle to ebable it
          </p>
          <Toggle
            onToggleChange={() => handleToggleChange("multiple_branches")}
            enabled={settings.multiple_branches}
          />
        </div>
      </section>

      <section>
        <p className="font-semibold">Products Separation</p>

        <div className="mb-1 flex items-center justify-between">
          <p className="">
            Enable this if some products are sold in one shop and no the other
          </p>
          <Toggle
            onToggleChange={() => handleToggleChange("product_separation")}
            enabled={settings.product_separation}
          />
        </div>
      </section>

      <section>
        <p className="font-semibold">Employee Separation</p>

        <div className="mb-1 flex items-center justify-between">
          <p className="">
            Enable this if employees are assigned to specific branch
          </p>
          <Toggle
            onToggleChange={() => handleToggleChange("product_separation")}
            enabled={settings.product_separation}
          />
        </div>
      </section>

      <section>
        {/* <p>Reviews</p>
        <p></p>
        <p>you then get the options to toggle when creating an Employee</p>
        <p>customers to select branch when placing an order</p> */}

        <p className="font-semibold">Employee Separation</p>

        <p>assign employees to branches</p>
      </section>

      <Form
        method="POST"
        className="flex-col grid grid-cols-2 gap-3 w-full"
        onChange={(event) => submit(event.currentTarget, { replace: true })}
      ></Form>
    </Container>
  );
}

export const meta: MetaFunction = () => {
  return [
    { title: "ComClo - Settings | Shop Branches" },
    {
      description: "the best shopping site",
    },
  ];
};

export const loader: LoaderFunction = async ({ request }) => {
  return {};
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
