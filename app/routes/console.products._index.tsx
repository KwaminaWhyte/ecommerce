import { Fragment, useEffect, useState } from "react";
import { Transition, Dialog, Popover } from "@headlessui/react";
import {
  json,
  type LoaderFunction,
  type MetaFunction,
  type ActionFunction,
} from "@remix-run/node";
import {
  Form,
  Link,
  useActionData,
  useLoaderData,
  useNavigation,
} from "@remix-run/react";
import { Pagination, PaginationItem } from "@mui/material";

import Input from "~/components/Input";
import SimpleSelect from "~/components/SimpleSelect";
import Spacer from "~/components/Spacer";
import TextArea from "~/components/TextArea";
import AdminLayout from "~/components/layouts/AdminLayout";
import DeleteModal from "~/components/modals/DeleteModal";
import AdminController from "~/server/admin/AdminController.server";
import ProductController from "~/server/product/ProductController.server";
import type {
  AdminInterface,
  CategoryInterface,
  ProductInterface,
} from "~/server/types";
import { validateName, validatePrice } from "~/server/validators.server";
import Container from "~/components/Container";
import FancySelect from "~/components/FancySelect";
import { Button } from "~/components/ui/button";
import IdGenerator from "~/lib/IdGenerator";

export default function Products() {
  const { user, products, categories, page, totalPages } = useLoaderData<{
    products: ProductInterface[];
    categories: CategoryInterface[];
    user: AdminInterface;
    totalPages: number;
    page: number;
  }>();

  // const [selectedColors, setSelectedColors] = useState([]);
  // const [selectedSizes, setSelectedSizes] = useState([]);

  // const colorOptions = [
  //   { value: "red", label: "Red" },
  //   { value: "blue", label: "Blue" },
  //   { value: "green", label: "Green" },
  // ];

  // const sizeOptions = [
  //   { value: "small", label: "Small" },
  //   { value: "medium", label: "Medium" },
  //   { value: "large", label: "Large" },
  // ];

  // const handleColorChange = (selectedOptions) => {
  //   setSelectedColors(selectedOptions);
  // };

  // const handleSizeChange = (selectedOptions) => {
  //   setSelectedSizes(selectedOptions);
  // };

  const actionData = useActionData();
  const navigation = useNavigation();

  const [activeProduct, setActiveProduct] = useState({});
  const [isUpdating, setIsUpdating] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [isOpenDelete, setIsOpenDelete] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isStockOpen, setIsStockOpen] = useState(false);

  function closeDeleteModal() {
    setIsOpenDelete(false);
    setDeleteId(null);
  }
  function openModal() {
    setIsOpen(true);
  }

  function openDeleteModal() {
    setIsOpenDelete(true);
  }

  let handleDelete = (id) => {
    setDeleteId(id);
    openDeleteModal();
  };

  useEffect(() => {
    setIsOpen(false);
    setIsOpenDelete(false);
    setIsStockOpen(false);
    setActiveProduct({});
  }, [products, actionData]);

  return (
    <AdminLayout user={user}>
      <div className="flex">
        <h1 className="text-3xl font-bold">Products </h1>

        <section className="ml-auto flex">
          {/* <Button variant="outline">Export</Button> */}
          <Spacer />
          {/* <Button variant="outline">Print</Button> */}
          <Spacer />
          <Button onClick={() => openModal()}> + New Product</Button>
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

        {/* <SimpleSelect name="status" variant="ghost">
          <option value="">Select Status</option>
          <option value="pending">Pending</option>
          <option value="completed">Completed</option>
          <option value="rejected">Rejected</option>
          <option value="shipping">Shipping</option>
        </SimpleSelect> */}
        <Spacer />

        <Button type="submit">Search</Button>
      </Form>

      <div>{/* <p>tabs</p> */}</div>

      <div className="relative shadow-sm bg-white dark:bg-slate-700 rounded-xl pb-2">
        <table className="w-full text-left text-slate-500 dark:text-slate-400">
          <thead className=" uppercase text-slate-700 dark:text-slate-400 ">
            <tr>
              <th scope="col" className="px-3 py-3">
                Product
              </th>
              <th scope="col" className="px-3 py-3">
                Category
              </th>
              <th scope="col" className="px-3 py-3">
                Quantity
              </th>
              {/* <th scope="col" className="px-3 py-3">
                Rate
              </th> */}
              <th scope="col" className="px-3 py-3">
                Price
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
            {products?.map((product) => (
              <tr
                key={IdGenerator()}
                className="cursor-pointer rounded-xl hover:bg-slate-50 hover:shadow-md dark:border-slate-400 dark:bg-slate-800 dark:hover:bg-slate-600"
              >
                <th
                  scope="row"
                  className="flex flex-nowrap items-center whitespace-nowrap px-3 py-3 font-medium text-slate-900 dark:text-white"
                >
                  <img
                    className="mr-2 h-11 w-11 rounded-md object-cover"
                    src={product?.images[0]?.url}
                    alt=""
                  />

                  <p>{product?.name}</p>
                </th>

                <td className="px-3 py-3">{product?.category?.name}</td>
                <td className="px-3 py-3 ">{product?.quantity}</td>
                {product?.price ? (
                  <td className="px-3 py-3 ">{product?.price}</td>
                ) : (
                  <td className="px-3 py-3 ">
                    <Popover className="relative">
                      <Popover.Button className="font-semibold tansition-all border border-gray-600 rounded-lg px-2 py-1 shadow-sm duration-300 focus:outline-none">
                        {product.stockHistory.length > 0 &&
                          product.stockHistory.length}{" "}
                        Stocks
                      </Popover.Button>

                      <Popover.Panel className="absolute right-6 z-10 ">
                        <div className="flex flex-col gap-2 rounded-lg bg-white p-3 shadow-lg dark:bg-slate-900 w-60">
                          {product.stockHistory.map((stock) => (
                            <p
                              key={IdGenerator()}
                              className="bg-gray-200 px-2 py-1 rounded-sm font-semibold"
                            >
                              {stock.quantity} items @ GH₵ {stock.price} each
                            </p>
                          ))}
                        </div>
                      </Popover.Panel>
                    </Popover>
                  </td>
                )}
                <td className="px-3 py-3">
                  <p
                    className={` w-fit  rounded-xl px-2 py-1 capitalize ${
                      product.availability == "unavailable"
                        ? "bg-red-500/40 text-red-800 dark:bg-red-400 dark:text-white"
                        : product.availability == "available"
                        ? "bg-green-500/40 text-green-800 dark:bg-green-600 dark:text-white"
                        : product.availability == "To Ship"
                    }`}
                  >
                    {product?.availability}
                  </p>
                </td>

                <td className="px-3 py-3">
                  <Popover className="relative">
                    <Popover.Button className="font-sm tansition-all rounded-lg bg-blue-600 px-2 py-1 text-white shadow-sm duration-300 hover:bg-blue-700 focus:outline-none">
                      Actions
                    </Popover.Button>

                    <Popover.Panel className="absolute right-6 z-10">
                      <div className="flex flex-col gap-2 rounded-lg bg-white p-3 dark:bg-slate-900">
                        <Link
                          to={`/console/products/${product._id}`}
                          className="font-sm tansition-all w-32 rounded-lg bg-blue-600 px-2 py-2 text-center text-white shadow-sm duration-300 hover:bg-blue-700 focus:outline-none"
                        >
                          View
                        </Link>
                        {/* <Link
                          to={`/console/products/${product._id}`}
                          className="font-sm tansition-all rounded-lg bg-blue-600 px-2 py-2 text-center text-white shadow-sm duration-300 hover:bg-blue-700 focus:outline-none"
                        >
                          Inventory
                        </Link> */}

                        <Button
                          onClick={() => {
                            openModal();
                            setIsUpdating(true);
                            setActiveProduct(product);
                          }}
                        >
                          Update
                        </Button>

                        <Button
                          onClick={() => {
                            setIsStockOpen(true);
                            setActiveProduct(product);
                          }}
                        >
                          Restock
                        </Button>

                        <Button
                          variant="destructive"
                          type="button"
                          onClick={() => handleDelete(product._id)}
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

      <Transition appear show={isOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-50 "
          onClose={() => {
            setIsOpen(false);
            setActiveProduct({});
            setIsUpdating(false);
          }}
        >
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
                    className="text-lg font-bold leading-6 text-slate-900 dark:text-white"
                  >
                    {isUpdating ? "Update Product" : "New Product"}
                  </Dialog.Title>
                  <div className="h-4"></div>

                  <Form method="POST" encType="multipart/form-data">
                    {isUpdating ? (
                      <input
                        type="hidden"
                        name="_id"
                        value={activeProduct._id}
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
                          : activeProduct.name
                      }
                      error={actionData?.errors?.name}
                    />
                    <Spacer />

                    <Input
                      name="cost_price"
                      placeholder="cost pricce"
                      label="Cost Pricce"
                      type="number"
                      defaultValue={
                        actionData?.fields
                          ? actionData?.fields?.cost_price
                          : activeProduct.cost_price
                      }
                      error={actionData?.errors?.cost_price}
                    />
                    <Spacer />

                    <Input
                      name="price"
                      placeholder="Selling Price"
                      label="Price"
                      type="number"
                      defaultValue={
                        actionData?.fields
                          ? actionData?.fields?.price
                          : activeProduct.price
                      }
                      error={actionData?.errors?.price}
                    />
                    <Spacer />
                    <SimpleSelect
                      name="category"
                      label="Category"
                      variant="ghost"
                      defaultValue={
                        actionData?.fields
                          ? actionData?.fields?.category
                          : activeProduct?.category?._id
                      }
                    >
                      <option value="">Select category</option>
                      {categories.map((category: CategoryInterface) => (
                        <option key={IdGenerator()} value={category._id}>
                          {category.name}
                        </option>
                      ))}
                    </SimpleSelect>
                    <Spacer />
                    <TextArea
                      name="description"
                      placeholder="Description"
                      label="Description"
                      defaultValue={
                        actionData?.fields
                          ? actionData?.fields?.description
                          : activeProduct.description
                      }
                      error={actionData?.errors?.description}
                    />
                    <Spacer />

                    <Input
                      name="quantity"
                      placeholder="Quantity"
                      label="Quantity"
                      type="number"
                      defaultValue={
                        actionData?.fields
                          ? actionData?.fields?.quantity
                          : activeProduct.quantity
                      }
                      error={actionData?.errors?.quantity}
                    />
                    <Spacer />

                    {/* <label htmlFor="colors">Select Availabel Colors</label> */}
                    {/* <FancySelect
                      isMulti
                      options={colorOptions}
                      value={selectedColors}
                      onChange={handleColorChange}
                    /> */}
                    {/* <label htmlFor="colors">Select Availabel Sizes</label> */}

                    {/* <Spacer /> */}

                    {/* {isUpdating ? null : (
                      <>
                        <Input
                          name="image"
                          placeholder="Images"
                          accept="image/*"
                          label="Images"
                          type="file"
                          // multiple
                          defaultValue={actionData?.fields?.images}
                          error={actionData?.errors?.images}
                        />
                        <Spacer />
                      </>
                    )} */}

                    <div className="flex items-center ">
                      <Button
                        type="button"
                        className="ml-auto mr-3"
                        onClick={() => setIsOpen(false)}
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

      <Transition appear show={isStockOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-50 "
          onClose={() => setIsStockOpen(false)}
        >
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
                    className="text-lg font-bold leading-6 text-slate-900 dark:text-white"
                  >
                    Stock Product
                  </Dialog.Title>
                  <div className="h-4"></div>

                  <Form method="POST" encType="multipart/form-data">
                    <Input
                      name="stockId"
                      type="hidden"
                      defaultValue={activeProduct?._id}
                    />
                    <p className="dark:text-white">
                      Enter the quantity to add or subtrack
                    </p>
                    <Spacer />
                    {/* 
                    <SimpleSelect
                      name="operation"
                      className="w-full"
                      variant="ghost"
                    >
                      <option value="add">Add</option>
                      <option value="deduct">Deduct</option>
                    </SimpleSelect> */}
                    {/* <Spacer /> */}
                    <Input
                      name="quantity"
                      placeholder="Quantity"
                      label="Quantity"
                      type="number"
                      defaultValue={1}
                      error={actionData?.errors?.quantity}
                    />
                    <Spacer />

                    <Input
                      name="cost_price"
                      placeholder="cost pricce"
                      label="Cost Pricce"
                      type="number"
                      defaultValue={activeProduct.cost_price}
                      error={actionData?.errors?.cost_price}
                    />
                    <Spacer />

                    <Input
                      name="price"
                      placeholder="Price"
                      label="Selling Price"
                      type="number"
                      defaultValue={activeProduct.price}
                      error={actionData?.errors?.price}
                    />
                    <Spacer />
                    <div className="flex items-center ">
                      <Button
                        color="error"
                        type="button"
                        className="ml-auto mr-3"
                        onClick={() => setIsStockOpen(false)}
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
                          ? "Deleting..."
                          : "Submit"}
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
        title="Delete Prodct"
        description="Are you sure you want to delete this product?"
        closeModal={closeDeleteModal}
      />
    </AdminLayout>
  );
}

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const productController = await new ProductController(request);

  const imgSrc = formData.get("image") as string;

  const name = formData.get("name");
  const cost_price = formData.get("cost_price") as string;
  const price = formData.get("price") as string;
  const quantity = formData.get("quantity") as string;
  const description = formData.get("description") as string;
  const category = formData.get("category") as string;

  if (formData.get("deleteId") != null) {
    productController.deleteProduct(formData.get("deleteId") as string);
    return true;
  } else if (formData.get("stockId") != null) {
    await productController.stockProduct({
      _id: formData.get("stockId") as string,
      quantity,
      price,
      cost_price,
      // operation: formData.get("operation") as string,
      operation: "add",
    });
    return true;
  }

  if (typeof name !== "string" || typeof price !== "string") {
    return json({ error: "Invalid name or price" }, { status: 400 });
  }

  const errors = {
    name: validateName(name),
    price: validatePrice(parseFloat(price)),
  };

  if (Object.values(errors).some(Boolean)) {
    return json({ errors, fields: { name, price } }, { status: 400 });
  }

  if (formData.get("_id") != null) {
    return await productController.updateProduct({
      _id: formData.get("_id") as string,
      name,
      price,
      description,
      category,
      quantity,
    });
  } else {
    return await productController.createProduct({
      name,
      price,
      description,
      imgSrc,
      category,
      quantity,
      cost_price,
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
  const { products, totalPages } = await productController.getProducts({
    search_term,
    page,
  });
  const { categories } = await productController.getCategories({ page });

  return { user, products, categories, page, totalPages };
};

export const meta: MetaFunction = () => {
  return [
    { title: "ComClo - Products" },
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

/*

 TODO: 
  - allow for multiple categories to be selected
  - display product rating
 */
