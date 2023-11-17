import { Fragment, useEffect, useState } from "react";
import {
  type ActionFunction,
  json,
  type LoaderFunction,
  type MetaFunction,
} from "@remix-run/node";
import {
  Form,
  Link,
  useActionData,
  useLoaderData,
  useNavigation,
} from "@remix-run/react";
import { Pagination, PaginationItem } from "@mui/material";

import Container from "~/components/Container";
import SimpleSelect from "~/components/SimpleSelect";
import Spacer from "~/components/Spacer";
import TextArea from "~/components/TextArea";
import AdminLayout from "~/components/layouts/AdminLayout";
import DeleteModal from "~/components/modals/DeleteModal";
import AdminController from "~/modules/admin/AdminController.server";
import FeatureController from "~/modules/feature/FeatureController";
import { validateName } from "~/modules/validators.server";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { DotsHorizontalIcon, ReloadIcon } from "@radix-ui/react-icons";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";

export default function FeatureRequest() {
  const { user, feature_requests, page, totalPages } = useLoaderData();
  const actionData = useActionData();
  const navigation = useNavigation();

  const [isOpen, setIsOpen] = useState(false);
  const [activeRequest, setActiveRequest] = useState({});
  const [isUpdating, setIsUpdating] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [isOpenDelete, setIsOpenDelete] = useState(false);

  useEffect(() => {
    setIsOpen(false);
    setIsOpenDelete(false);
    setActiveRequest({});
  }, [feature_requests]);

  return (
    <AdminLayout user={user}>
      <div className="flex">
        <h1 className="text-3xl font-bold">Feature Requests</h1>

        <section className="ml-auto flex">
          <Dialog open={isOpen}>
            <DialogTrigger onClick={() => setIsOpen(true)} asChild>
              <Button variant="outline">+ New Request</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <Form method="POST" encType="multipart/form-data">
                <DialogHeader className="mb-4">
                  <DialogTitle>
                    {isUpdating ? "Update Request" : "New Request"}
                  </DialogTitle>
                </DialogHeader>

                {isUpdating ? (
                  <input type="hidden" name="_id" value={activeRequest._id} />
                ) : null}

                <div className="grid w-full max-w-sm items-center gap-1.5">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    name="title"
                    placeholder="Title"
                    type="text"
                    defaultValue={
                      actionData?.fields
                        ? actionData?.fields?.title
                        : activeRequest?.title
                    }
                  />
                </div>

                <Spacer />
                <TextArea
                  name="description"
                  placeholder="Description"
                  label="Description"
                  defaultValue={
                    actionData?.fields
                      ? actionData?.fields?.description
                      : activeRequest.description
                  }
                  error={actionData?.errors?.description}
                />
                <Spacer />
                <SimpleSelect
                  name="request_type"
                  label="Type"
                  variant="ghost"
                  defaultValue={
                    actionData?.fields
                      ? actionData?.fields?.request_type
                      : activeRequest?.request_type
                  }
                >
                  <option value="feature">Feature Request</option>
                  <option value="error">Error</option>
                  <option value="suggestion">Suggestion</option>
                </SimpleSelect>
                <Spacer />
                <DialogFooter>
                  <Button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    variant="destructive"
                  >
                    Close
                  </Button>
                  <Button
                    disabled={navigation.state === "submitting" ? true : false}
                    type="submit"
                  >
                    {navigation.state === "submitting" ? (
                      <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                    ) : null}
                    Save changes
                  </Button>
                </DialogFooter>
              </Form>
            </DialogContent>
          </Dialog>
        </section>
      </div>

      <Form
        method="GET"
        className="my-3 flex items-center gap-3 rounded-lg bg-slate-50 p-2 dark:bg-slate-900"
      >
        <Input
          type="search"
          placeholder="Search anything..."
          name="search_term"
        />

        <Button type="submit">Search</Button>
      </Form>

      <div className="flex">
        {["feature", "error", "suggestion"].map((item, index) => (
          <p
            key={index}
            className={`${
              item == "feature"
                ? "bg-blue-500"
                : item == "error"
                ? "bg-red-500"
                : "bg-yellow-500"
            } m-2 rounded-lg py-2 px-4 capitalize text-white`}
          >
            {item}
          </p>
        ))}
      </div>

      <div className="relative flex flex-col gap-3 col-span-3 overflow-x-auto shadow-sm sm:rounded-lg pb-5 mt-3">
        {feature_requests.map((request) => (
          <div
            key={request?._id}
            className={`bg-white rounded-xl shadow-lg p-3 border-r-4 flex flex-col dark:bg-black ${
              request?.request_type == "feature"
                ? "border-blue-500"
                : request?.request_type == "error"
                ? "border-red-500"
                : "border-yellow-500"
            }`}
          >
            <div className="flex items-center">
              <p className="font-bold text-base mr-10">{request?.title}</p>
              <p>Priority: {request?.priority}</p>

              <DropdownMenu>
                <DropdownMenuTrigger className="ml-auto mr-2">
                  <DotsHorizontalIcon />
                </DropdownMenuTrigger>
                <DropdownMenuContent className="mr-4 ">
                  {/* <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator /> */}
                  <DropdownMenuItem>Update</DropdownMenuItem>
                  <DropdownMenuItem>Delete</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <p className="ml-5">{request?.description}</p>

            <div className="flex mt-4 justify-between">
              <p className="">Status: {request?.status}</p>
              <div className="flex items-center">
                <p className="mr-3">{request?.upvotes?.length} votes</p>
                <Form method="POST">
                  <input type="hidden" name="featureId" value={request?._id} />
                  <button
                    type="submit"
                    className="rounded-full p-1 bg-slate-200 dark:bg-slate-800"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-4 h-4"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M4.5 10.5L12 3m0 0l7.5 7.5M12 3v18"
                      />
                    </svg>
                  </button>
                </Form>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-11 flex w-full items-center justify-center">
        <Pagination
          color="primary"
          variant="outlined"
          shape="rounded"
          page={page}
          count={totalPages}
          renderItem={(item) => (
            <PaginationItem
              component={Link}
              to={`/console/products${
                item.page === 1 ? "" : `?page=${item.page}`
              }`}
              {...item}
            />
          )}
        />
      </div>

      <DeleteModal
        id={deleteId}
        isOpen={isOpenDelete}
        title="Delete Request"
        description="Are you sure you want to delete this request?"
        closeModal={() => setIsOpenDelete(false)}
      />
    </AdminLayout>
  );
}

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const featureController = await new FeatureController(request);

  if (formData.get("deleteId") != null) {
    featureController.delete({ id: formData.get("deleteId") as string });
    return true;
  }

  if (formData.get("featureId") != null) {
    featureController.upvoteFeature({
      featureId: formData.get("featureId") as string,
    });
    return true;
  }

  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const request_type = formData.get("request_type") as string;

  if (typeof title !== "string") {
    return json({ error: "Invalid title" }, { status: 400 });
  }

  const errors = {
    title: validateName(title),
  };

  if (Object.values(errors).some(Boolean)) {
    return json({ errors, fields: { name } }, { status: 400 });
  }

  if (formData.get("_id") != null) {
    // return await featureController.update({
    //   _id: formData.get("_id") as string,
    //   description,
    //   request_type,
    //   user: 'asfsf'
    // });
  } else {
    return await featureController.create({
      title,
      description,
      request_type,
      user: "64f87ed9126072531ac20a47",
    });
  }
};

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  const page = parseInt(url.searchParams.get("page") as string) || 1;
  const search_term = url.searchParams.get("search_term") as string;

  const adminController = await new AdminController(request);
  await adminController.requireAdminId();
  const user = await adminController.getAdmin();

  const featureController = await new FeatureController(request);
  const { feature_requests, totalPages } =
    await featureController.getFeatureRequests({ search_term, page });

  return { user, feature_requests, page, totalPages };
};

export const meta: MetaFunction = () => {
  return [
    { title: "ComClo - Feature Requests" },
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
      className="bg-red-300 dark:bg-red-500"
      contentClassName="flex-col grid grid-cols-2 gap-3"
    >
      <p>Something went wrong!</p>
    </Container>
  );
}
