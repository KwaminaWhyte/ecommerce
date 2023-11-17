import { type MetaFunction } from "@remix-run/node";
import Container from "~/components/Container";
import AdminLayout from "~/components/layouts/AdminLayout";

export default function Reviews() {
  return (
    <AdminLayout user={{ _id: "", username: "", email: "" }}>
      <div className="flex">
        <h1 className="text-3xl font-bold">Reviews</h1>
      </div>

      <div>{/* <p>tabs</p> */}</div>

      <div className="relative overflow-x-auto shadow-sm sm:rounded-lg">
        <p>asfasfas</p>
      </div>
    </AdminLayout>
  );
}

export const meta: MetaFunction = () => {
  return [
    { title: "ComClo - Reviews" },
    {
      description: "the best shopping site",
    },
  ];
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
