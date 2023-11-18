import { Transition, Dialog, Popover } from "@headlessui/react";
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
import { Fragment, useEffect, useState } from "react";

import Input from "~/components/Input";
import SimpleSelect from "~/components/SimpleSelect";
import Spacer from "~/components/Spacer";
import TextArea from "~/components/TextArea";
import AdminLayout from "~/components/layouts/AdminLayout";
import AdminController from "~/server/admin/AdminController.server";
import ProductController from "~/server/product/ProductController.server";
import { validateName } from "~/server/validators.server";
import DeleteModal from "~/components/modals/DeleteModal";
import Container from "~/components/Container";
import type { ProductCategoryInterface } from "~/server/types";
import { Pagination, PaginationItem } from "@mui/material";
import { Button } from "~/components/ui/button";

export default function Products() {
  const { user, categories, page, totalPages } = useLoaderData();
  const actionData = useActionData();
  const navigation = useNavigation();

  const [isOpen, setIsOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState({});
  const [isUpdating, setIsUpdating] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [isOpenDelete, setIsOpenDelete] = useState(false);

  function closeModal() {
    setIsOpen(false);
  }

  function openModal() {
    setIsOpen(true);
  }

  useEffect(() => {
    setIsOpen(false);
    setIsOpenDelete(false);
    setActiveCategory({});
  }, [categories]);

  return (
    <AdminLayout user={user}>
      <div className="flex">
        <h1 className="text-3xl font-bold">Product Categories</h1>

        <section className="ml-auto flex">
          {/* <Button variant="outline">Export</Button> */}
          <Spacer />
          {/* <Button variant="outline">Print</Button> */}
          <Spacer />
          <Button onClick={() => openModal()}> + New Category</Button>
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

      {/* <SimpleSelect name="status" variant="ghost">
          <option value="">Select Status</option>
          <option value="pending">Pending</option>
          <option value="completed">Completed</option>
          <option value="rejected">Rejected</option>
          <option value="shipping">Shipping</option>
        </SimpleSelect> */}

      <div>{/* <p>tabs</p> */}</div>

      <div className="relative shadow-sm bg-white dark:bg-slate-700 rounded-xl pb-2">
        <table className="w-full text-left text-slate-500 dark:text-slate-400">
          <thead className=" uppercase text-slate-700 dark:text-slate-400 ">
            <tr>
              <th scope="col" className="px-3 py-3">
                Name
              </th>
              <th scope="col" className="px-3 py-3">
                Description
              </th>
              <th scope="col" className="px-3 py-3">
                Featured
              </th>
              <th scope="col" className="px-3 py-3">
                Status
              </th>
              <th scope="col" className="px-3 py-3">
                <span className="sr-only">Action</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {categories.map((category: ProductCategoryInterface) => (
              <tr
                key={category?._id}
                className="cursor-pointer rounded-xl hover:bg-slate-50 hover:shadow-md dark:border-slate-400 dark:bg-slate-800 dark:hover:bg-slate-600"
              >
                <th
                  scope="row"
                  className=" px-3 py-3 font-medium text-slate-900 dark:text-white"
                >
                  <p>{category?.name}</p>
                </th>

                <td className="px-3 py-3">{category?.description}</td>
                <td className="px-3 py-3">
                  {category?.featured ? "True" : "False"}
                </td>
                <td className="px-3 py-3">
                  <p
                    className={` w-fit  rounded-xl px-2 py-1 font-medium capitalize ${
                      category?.status == "inactive"
                        ? "bg-red-500/40 text-red-800 dark:bg-red-400/80 dark:text-white"
                        : "bg-green-500/40 text-green-800 dark:bg-green-600/80 dark:text-white"
                    }`}
                  >
                    {category?.status}
                  </p>
                </td>

                <td className="gap-1 px-3 py-3">
                  <Popover className="relative">
                    <Popover.Button className="font-sm tansition-all rounded-lg bg-blue-600 px-2 py-1 text-white shadow-sm duration-300 hover:bg-blue-700 focus:outline-none">
                      Actions
                    </Popover.Button>

                    <Popover.Panel className="absolute right-6 z-10">
                      <div className="flex flex-col gap-2 rounded-lg bg-white p-3 dark:bg-slate-900">
                        <Button
                          onClick={() => {
                            openModal();
                            setIsUpdating(true);
                            setActiveCategory(category);
                          }}
                        >
                          Update
                        </Button>
                        <Button
                          size="md"
                          variant="solid"
                          type="button"
                          color="error"
                          onClick={() => {
                            setDeleteId(category?._id);
                            setIsOpenDelete(true);
                          }}
                        >
                          Delete
                        </Button>
                      </div>
                    </Popover.Panel>
                  </Popover>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-11 flex w-full items-center justify-center">
        <Pagination
          variant="outlined"
          shape="rounded"
          page={page}
          count={totalPages}
          color="primary"
          renderItem={(item) => (
            <PaginationItem
              component={Link}
              to={`/console/product_categories${
                item.page === 1 ? "" : `?page=${item.page}`
              }`}
              {...item}
            />
          )}
        />
      </div>

      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50 " onClose={closeModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto ">
            <div className="flex min-h-full items-center justify-center p-4 text-center ">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all dark:bg-slate-900">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-bold leading-6 text-slate-900"
                  >
                    {isUpdating ? "Update Category" : "New Category"}
                  </Dialog.Title>
                  <div className="h-4"></div>

                  <Form method="POST" encType="multipart/form-data">
                    {isUpdating ? (
                      <input
                        type="hidden"
                        name="_id"
                        value={activeCategory._id}
                      />
                    ) : null}
                    <Input
                      name="name"
                      placeholder="Name"
                      label="Name"
                      type="text"
                      defaultValue={
                        actionData?.fields
                          ? actionData?.fields?.name
                          : activeCategory.name
                      }
                      error={actionData?.errors?.name}
                    />
                    <Spacer />
                    <TextArea
                      name="description"
                      placeholder="Description"
                      label="Description"
                      defaultValue={
                        actionData?.fields
                          ? actionData?.fields?.description
                          : activeCategory.description
                      }
                      error={actionData?.errors?.description}
                    />
                    <Spacer />

                    <SimpleSelect
                      name="featured"
                      label="Featured"
                      variant="ghost"
                      defaultValue={
                        actionData?.fields
                          ? actionData?.fields?.featured
                          : activeCategory?.featured
                      }
                    >
                      <option value="true">True</option>
                      <option value="false">False</option>
                    </SimpleSelect>
                    <Spacer />

                    <SimpleSelect
                      name="status"
                      label="Status"
                      variant="ghost"
                      defaultValue={
                        actionData?.fields
                          ? actionData?.fields?.status
                          : activeCategory?.status
                      }
                    >
                      <option value="">Select Status</option>
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </SimpleSelect>
                    <Spacer />

                    <div className="flex items-center ">
                      <Button
                        color="error"
                        type="button"
                        className="ml-auto mr-3"
                        onClick={closeModal}
                        variant="destructive"
                      >
                        Close
                      </Button>

                      <Button
                        type="submit"
                        disabled={
                          navigation.state === "submitting" ? true : false
                        }
                      >
                        {navigation.state === "submitting"
                          ? "Submitting..."
                          : isUpdating
                          ? "Update"
                          : "Add"}
                      </Button>
                    </div>
                  </Form>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>

      <DeleteModal
        id={deleteId}
        isOpen={isOpenDelete}
        title="Delete Category"
        description="Are you sure you want to delete this category?"
        closeModal={() => setIsOpenDelete(false)}
      />
    </AdminLayout>
  );
}

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const productController = await new ProductController(request);

  if (formData.get("deleteId") != null) {
    productController.deleteCategory(formData.get("deleteId") as string);
    return true;
  }

  const name = formData.get("name");
  const status = formData.get("status") as string;
  const featured = formData.get("featured") as string;
  const description = formData.get("description") as string;

  if (typeof name !== "string") {
    return json({ error: "Invalid name " }, { status: 400 });
  }

  const errors = {
    name: validateName(name),
  };

  if (Object.values(errors).some(Boolean)) {
    return json({ errors, fields: { name } }, { status: 400 });
  }

  if (formData.get("_id") != null) {
    return await productController.updateCategory({
      _id: formData.get("_id") as string,
      name,
      description,
      status,
      featured,
    });
  } else {
    return await productController.createCategory({
      name,
      description,
      status,
      featured,
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

  const productController = await new ProductController(request);
  const { categories, totalPages } = await productController.getCategories({
    page,
    search_term,
  });

  return { user, categories, page, totalPages };
};

export const meta: MetaFunction = () => {
  return [
    { title: "ComClo - Product Categories" },
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
