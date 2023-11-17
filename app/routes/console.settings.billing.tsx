import { type MetaFunction, type LoaderFunction } from "@remix-run/node";
import { Form, useLoaderData, useSubmit } from "@remix-run/react";
import Container from "~/components/Container";

export default function AdminSettings() {
  const submit = useSubmit();

  return (
    <Container heading="Billing Settings">
      <p>Billing Settings (Coming Soon)</p>

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
    { title: "ComClo - Settings | Billing" },
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
