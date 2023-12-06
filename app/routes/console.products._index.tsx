import { Fragment, useEffect, useState } from "react";
import { Transition, Popover } from "@headlessui/react";
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
  useSubmit,
} from "@remix-run/react";
import { Pagination, PaginationItem } from "@mui/material";
import * as XLSX from "xlsx";

import Input from "~/components/Input";
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
import { Button } from "~/components/ui/button";
import IdGenerator from "~/lib/IdGenerator";
import ExcelMapper from "~/components/ExcelMapper";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { Label } from "~/components/ui/label";

const arrayToKeyValuePairs = async (dataArray) => {
  // Assuming the first array in the input represents the keys
  const keys = dataArray[0];

  // Remove the first array (keys) from the data array
  const dataArrayWithoutKeys = dataArray.slice(1);

  // Map each data array to an object of key-value pairs
  const result = dataArrayWithoutKeys.map((dataArray) => {
    return keys.reduce((obj, key, index) => {
      obj[key] = dataArray[index];
      return obj;
    }, {});
  });

  return result;
};

const mapExcelDataArray = async (excelDataArray, mappedColumns) => {
  return excelDataArray.map((excelData) => {
    const mappedData = {};

    Object.keys(mappedColumns).forEach((excelColumn) => {
      const mongooseField = mappedColumns[excelColumn];
      const excelValue = excelData[excelColumn];

      // If the mapped column exists in the excel data, add it to the mapped data
      if (excelValue !== undefined) {
        mappedData[mongooseField] = excelValue;
      }
    });

    return mappedData;
  });
};

export default function Products() {
  const submit = useSubmit();
  const actionData = useActionData();
  const navigation = useNavigation();
  const { user, products, categories, page, totalPages } = useLoaderData<{
    products: ProductInterface[];
    categories: CategoryInterface[];
    user: AdminInterface;
    totalPages: number;
    page: number;
  }>();

  const [excelFile, setExcelFile] = useState(null);
  const [excelData, setExcelData] = useState([]);
  const [completeData, setCompleteData] = useState([]);

  const handleFileChange = (event) => {
    setExcelFile(event.target.files[0]);
  };

  const handleReadFile = async () => {
    const reader = new FileReader();
    reader.onload = async (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });
      console.log({ jsonData });

      const keyValuePairs = await arrayToKeyValuePairs(jsonData);
      console.log(keyValuePairs);
      setExcelData(keyValuePairs);
    };

    reader.readAsArrayBuffer(excelFile);
    // setIsFileOpen(false);
  };

  const handleMapColumns = async (mappedColumns) => {
    console.log({ mappedColumns });

    let mappedDataArray = await mapExcelDataArray(excelData, mappedColumns);
    console.log({ mappedDataArray });
    setCompleteData(mappedDataArray);
  };

  const handleImportData = () => {
    console.log("import the data");

    return submit(
      {
        actionType: "batch_import",
        completeData: JSON.stringify(completeData),
      },
      {
        method: "post",
      }
    );

    // Use the mappedColumns to map Excel data to Mongoose model fields
    // Send the mapped data to the server for storage
    // Example: axios.post('/api/saveData', { data: mappedData });
    // Reset mapped columns for the next import
    // setMappedColumns({});
  };

  const [activeProduct, setActiveProduct] = useState({});
  const [isUpdating, setIsUpdating] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [isOpenDelete, setIsOpenDelete] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [fileOpen, setIsFileOpen] = useState(false);
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

        <section className="ml-auto flex gap-3">
          {/* <Button variant="outline">Export</Button> */}

          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">Import</Button>
            </DialogTrigger>
            <DialogContent className="max-w-screen-2xl h-[93vh] overflow-y-scroll">
              <DialogHeader>
                <DialogTitle> Import Product from Excel File</DialogTitle>
                <DialogDescription>
                  Upload your file to import products.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="flex gap-3">
                  <Input
                    type="file"
                    accept=".xlsx, .xls, .csv"
                    onChange={handleFileChange}
                  />

                  <Button onClick={() => handleReadFile()}>Process Data</Button>
                </div>

                <div>
                  {excelData.length > 0 && (
                    <ExcelMapper
                      columns={excelData[0]}
                      onMapColumns={handleMapColumns}
                    />
                  )}
                </div>

                {completeData.length > 0 && (
                  <section className="mt-11">
                    <table className="w-full text-left text-slate-500 dark:text-slate-400">
                      <thead className=" uppercase text-slate-700 dark:text-slate-400 ">
                        <tr>
                          {Object.keys(completeData[0]).map((key, index) => (
                            <th scope="col" className="px-3 py-3" key={index}>
                              {key}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {completeData.slice(1, 6).map((item, index) => (
                          <tr
                            key={index}
                            className="cursor-pointer rounded-xl hover:bg-slate-50 hover:shadow-md dark:border-slate-400 dark:bg-slate-800 dark:hover:bg-slate-600"
                          >
                            {Object.keys(completeData[0]).map((key, index) => (
                              <td
                                key={index}
                                className="px-3 py-3 font-semibold"
                              >
                                {item[key]}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>

                    <Button className="w-full" onClick={handleImportData}>
                      Complete Export
                    </Button>
                  </section>
                )}
              </div>
              {/* <DialogFooter>
                <Button type="submit">Save changes</Button>
              </DialogFooter> */}
            </DialogContent>
          </Dialog>

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

        <Button type="submit">Search</Button>
      </Form>

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
      {/* 
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
                      {categories.map((category) => (
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
      </Transition> */}

      {/* <Transition appear show={isStockOpen} as={Fragment}>
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
      </Transition> */}

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
  console.log("action called...");

  const imgSrc = formData.get("image") as string;
  const actionType = formData.get("actionType") as string;
  const completeData = formData.get("completeData") as string;

  const name = formData.get("name");
  const cost_price = formData.get("cost_price") as string;
  const price = formData.get("price") as string;
  const quantity = formData.get("quantity") as string;
  const description = formData.get("description") as string;
  const category = formData.get("category") as string;
  console.log({ actionType });

  if (actionType == "batch_import") {
    console.log("import to db");
    let data = JSON.parse(completeData);
    return productController.importBatch(data);
  } else if (formData.get("deleteId") != null) {
    productController.deleteProduct(formData.get("deleteId") as string);
    return true;
  } else if (formData.get("stockId") != null) {
    await productController.stockProduct({
      _id: formData.get("stockId") as string,
      quantity,
      price,
      costPrice: cost_price,
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
      costPrice: cost_price,
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
