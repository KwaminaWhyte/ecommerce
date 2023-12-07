import { Transition } from "@headlessui/react";
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

import Spacer from "~/components/Spacer";
import TextArea from "~/components/TextArea";
import AdminLayout from "~/components/layouts/AdminLayout";
import AdminController from "~/server/admin/AdminController.server";
import ProductController from "~/server/product/ProductController.server";
import { validateName } from "~/server/validators.server";
import DeleteModal from "~/components/modals/DeleteModal";
import Container from "~/components/Container";
import type { CategoryInterface, UserInterface } from "~/server/types";
import { Pagination, PaginationItem } from "@mui/material";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";

export default function Products() {
  const { user, categories, page, totalPages } = useLoaderData<{
    user: UserInterface;
    categories: CategoryInterface[];
    page: number;
    totalPages: number;
  }>();
  const navigation = useNavigation();

  const [deleteId, setDeleteId] = useState(null);
  const [isOpenDelete, setIsOpenDelete] = useState(false);
  const [showAddModel, setShowAddModel] = useState(false);
  const [showUpdateModel, setShowUpdateModel] = useState(false);

  useEffect(() => {
    setIsOpenDelete(false);
    setShowAddModel(false);
    setShowUpdateModel(false);
  }, [categories]);

  return (
    <AdminLayout user={user}>
      <section className="mb-3 flex items-center gap-3">
        <h1 className="text-3xl font-bold">Categories</h1>
        <section className="ml-auto flex gap-3 items-center">
          <Form
            method="GET"
            className="flex gap-3 items-center bg-white shadow-md p-2 rounded-lg ml-auto"
          >
            <Input
              type="search"
              placeholder="Search anything..."
              name="search_term"
              className="min-w-[450px]"
            />

            <Button type="submit">Search</Button>
          </Form>

          <Dialog
            open={showAddModel}
            onOpenChange={() => setShowAddModel(!showAddModel)}
          >
            <DialogTrigger asChild>
              <Button>+ New Category</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>New Category</DialogTitle>
              </DialogHeader>
              <Form
                method="POST"
                encType="multipart/form-data"
                className="flex flex-col gap-4"
              >
                <div className="grid w-full max-w-sm items-center gap-1.5">
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" type="text" name="name" required />
                </div>

                <TextArea
                  name="description"
                  placeholder="Description"
                  label="Description"
                />

                <div className="flex gap-3 items-center justify-end ">
                  <DialogClose asChild>
                    <Button type="button" variant="destructive">
                      Close
                    </Button>
                  </DialogClose>

                  <Button
                    type="submit"
                    disabled={navigation.state === "submitting" ? true : false}
                  >
                    Submit
                  </Button>
                </div>
              </Form>
            </DialogContent>
          </Dialog>
        </section>
      </section>

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
              {/* <th scope="col" className="px-3 py-3">
                Featured
              </th>
              <th scope="col" className="px-3 py-3">
                Status
              </th> */}
              <th scope="col" className="px-3 py-3">
                <span className="sr-only">Action</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {categories.map((category) => (
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
                {/* <td className="px-3 py-3">
                  {category?.featured ? "True" : "False"}
                </td> */}
                {/* <td className="px-3 py-3">
                  <p
                    className={` w-fit  rounded-xl px-2 py-1 font-medium capitalize ${
                      category?.status == "inactive"
                        ? "bg-red-500/40 text-red-800 dark:bg-red-400/80 dark:text-white"
                        : "bg-green-500/40 text-green-800 dark:bg-green-600/80 dark:text-white"
                    }`}
                  >
                    {category?.status}
                  </p>
                </td> */}

                <td className="gap-1 px-3 py-3">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline">Action</Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-56">
                      <div className="grid gap-4">
                        <Dialog
                          open={showUpdateModel}
                          onOpenChange={() =>
                            setShowUpdateModel(!showUpdateModel)
                          }
                        >
                          <DialogTrigger asChild>
                            <Button>Update</Button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                              <DialogTitle>Update Category</DialogTitle>
                            </DialogHeader>
                            <Form
                              method="POST"
                              encType="multipart/form-data"
                              className="flex flex-col gap-4"
                            >
                              <input
                                type="hidden"
                                name="actionType"
                                value="update"
                              />
                              <input
                                type="hidden"
                                name="_id"
                                value={category?._id}
                              />

                              <div className="grid w-full max-w-sm items-center gap-1.5">
                                <Label htmlFor="name">Name</Label>
                                <Input
                                  id="name"
                                  type="text"
                                  name="name"
                                  defaultValue={category?.name}
                                  required
                                />
                              </div>

                              {/* <div className="grid w-full max-w-sm items-center gap-1.5">
                                <Label htmlFor="category">Category</Label>
                                <Select
                                  name="category"
                                  defaultValue={category?.category?._id}
                                >
                                  <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select a fruit" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectGroup>
                                      <SelectLabel>Category</SelectLabel>
                                      {categories.map((category) => (
                                        <SelectItem
                                          key={IdGenerator()}
                                          value={category._id}
                                        >
                                          {category.name}
                                        </SelectItem>
                                      ))}
                                    </SelectGroup>
                                  </SelectContent>
                                </Select>
                              </div> */}

                              {/* <SimpleSelect
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
                    <Spacer /> */}

                              {/* <SimpleSelect
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
                    <Spacer /> */}
                              <TextArea
                                name="description"
                                placeholder="Description"
                                label="Description"
                                defaultValue={category?.description}
                              />

                              <div className="flex gap-3 items-center justify-end ">
                                <DialogClose asChild>
                                  <Button type="button" variant="destructive">
                                    Close
                                  </Button>
                                </DialogClose>

                                <Button
                                  type="submit"
                                  disabled={
                                    navigation.state === "submitting"
                                      ? true
                                      : false
                                  }
                                >
                                  Submit
                                </Button>
                              </div>
                            </Form>
                          </DialogContent>
                        </Dialog>

                        <Button
                          variant="destructive"
                          type="button"
                          onClick={() => {
                            setDeleteId(category?._id);
                            setIsOpenDelete(true);
                          }}
                        >
                          Delete
                        </Button>
                      </div>
                    </PopoverContent>
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
              to={`/console/categories${
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

  const actionType = formData.get("actionType") as string;
  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const status = formData.get("status") as string;
  const featured = formData.get("featured") as string;

  if (formData.get("deleteId") != null) {
    return await productController.deleteCategory(
      formData.get("deleteId") as string
    );
  } else if (actionType == "update") {
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
    { title: "ComClo - Categories" },
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
      contentClassName="flex-col grid grid-cols-2 gap-3"
    >
      <p>Something went wrong!</p>
    </Container>
  );
}
