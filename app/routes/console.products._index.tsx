import { useEffect, useState } from "react";
import {
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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import AdminLayout from "~/components/layouts/AdminLayout";
import DeleteModal from "~/components/modals/DeleteModal";
import AdminController from "~/server/admin/AdminController.server";
import ProductController from "~/server/product/ProductController.server";
import type {
  AdminInterface,
  CategoryInterface,
  ProductInterface,
} from "~/server/types";
import Container from "~/components/Container";
import { Button } from "~/components/ui/button";
import IdGenerator from "~/lib/IdGenerator";
import ExcelMapper from "~/components/ExcelMapper";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { Label } from "~/components/ui/label";
import { Input } from "~/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import imgPlaceholder from "~/components/inc/placeholder-image.jpg";
import { Textarea } from "~/components/ui/textarea";

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

  const [deleteId, setDeleteId] = useState(null);
  const [isOpenDelete, setIsOpenDelete] = useState(false);
  const [showAddModel, setShowAddModel] = useState(false);
  const [showUpdateModel, setShowUpdateModel] = useState(false);
  const [showImportModel, setShowImportModel] = useState(false);

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

      const keyValuePairs = await arrayToKeyValuePairs(jsonData);
      setExcelData(keyValuePairs);
    };
    reader.readAsArrayBuffer(excelFile);
  };
  const handleMapColumns = async (mappedColumns) => {
    let mappedDataArray = await mapExcelDataArray(excelData, mappedColumns);
    setCompleteData(mappedDataArray);
  };
  const handleImportData = () => {
    return submit(
      {
        actionType: "batch_import",
        completeData: JSON.stringify(completeData),
      },
      {
        method: "post",
      }
    );
  };

  function closeDeleteModal() {
    setIsOpenDelete(false);
    setDeleteId(null);
  }

  function openDeleteModal() {
    setIsOpenDelete(true);
  }

  let handleDelete = (id) => {
    setDeleteId(id);
    openDeleteModal();
  };

  useEffect(() => {
    setIsOpenDelete(false);
    setShowAddModel(false);
    setShowImportModel(false);
    setShowUpdateModel(false);
  }, [products, actionData]);

  return (
    <AdminLayout user={user}>
      <section className="mb-3 flex items-center gap-3">
        <h1 className="text-3xl font-bold">Products </h1>

        <div className="ml-auto flex gap-3 items-center">
          <Form
            method="GET"
            className="flex gap-3 items-center bg-white shadow-md p-2 rounded-lg ml-auto"
          >
            <Input
              type="search"
              placeholder="Search by name..."
              name="search_term"
              className="min-w-[450px]"
            />

            <Select name="category">
              <SelectTrigger className="min-w-[200pxs]">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Category</SelectLabel>
                  {categories.map((category) => (
                    <SelectItem key={IdGenerator()} value={category._id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>

            <Button type="submit">Search</Button>
          </Form>

          <Dialog
            open={showImportModel}
            onOpenChange={() => setShowImportModel(!showImportModel)}
          >
            <DialogTrigger asChild>
              <Button variant="outline">Import</Button>
            </DialogTrigger>
            <DialogContent className="max-w-screen-2xl h-[93vh] flex flex-col overflow-y-scroll">
              <DialogHeader>
                <DialogTitle> Import Product from Excel File</DialogTitle>
                <DialogDescription>
                  Upload your file to import products.
                </DialogDescription>
              </DialogHeader>
              <div className="flex flex-col mb-auto gap-3">
                <div className="flex gap-3 mb-auto items-center">
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
            </DialogContent>
          </Dialog>

          <Dialog
            open={showAddModel}
            onOpenChange={() => setShowAddModel(!showAddModel)}
          >
            <DialogTrigger asChild>
              <Button>+ New Product</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>New Product</DialogTitle>
              </DialogHeader>
              <Form
                method="POST"
                encType="multipart/form-data"
                className="flex flex-col gap-4"
              >
                <div className="grid w-full  items-center gap-1.5">
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" type="text" name="name" required />
                </div>

                <div className="grid w-full  items-center gap-1.5">
                  <Label htmlFor="cost_price">Cost Price</Label>
                  <Input
                    id="cost_price"
                    type="number"
                    step={0.01}
                    name="cost_price"
                    required
                  />
                </div>

                <div className="grid w-full  items-center gap-1.5">
                  <Label htmlFor="price">Price</Label>
                  <Input
                    id="price"
                    type="number"
                    step={0.01}
                    name="price"
                    required
                  />
                </div>

                <div className="grid w-full  items-center gap-1.5">
                  <Label htmlFor="category">Category</Label>
                  <Select name="category">
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Category</SelectLabel>
                        {categories.map((category) => (
                          <SelectItem key={IdGenerator()} value={category._id}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid w-full  items-center gap-1.5">
                  <Label htmlFor="quantity">Description</Label>
                  <Textarea name="description" placeholder="Description" />
                </div>

                <div className="grid w-full  items-center gap-1.5">
                  <Label htmlFor="quantity">Quantity</Label>
                  <Input id="quantity" type="number" name="quantity" />
                </div>

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
        </div>
      </section>

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
                    src={
                      product?.images[0]?.url
                        ? product?.images[0]?.url
                        : imgPlaceholder
                    }
                    alt=""
                  />

                  <p>{product?.name}</p>
                </th>

                <td className="px-3 py-3">{product?.category?.name}</td>
                <td className="px-3 py-3 ">{product?.quantity}</td>
                {product?.price ? (
                  <td className="px-3 py-3 ">{product?.price}</td>
                ) : (
                  <td className="">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline">
                          {product?.stockHistory?.length} Stock(s)
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-fit">
                        <div className="grid gap-4">
                          {product.stockHistory.map((stock) => (
                            <div
                              key={IdGenerator()}
                              className="flex items-center gap-2"
                            >
                              <p className="bg-gray-200 px-2 py-1 rounded-sm font-semibold">
                                {stock.quantity} items @ GH₵ {stock.price} each
                              </p>

                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button>Update</Button>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-[425px]">
                                  <DialogHeader>
                                    <DialogTitle>Update Stock</DialogTitle>
                                  </DialogHeader>
                                  <Form
                                    method="POST"
                                    encType="multipart/form-data"
                                    className="flex flex-col gap-4"
                                  >
                                    <input
                                      type="hidden"
                                      name="actionType"
                                      value="update_stock"
                                    />
                                    <input
                                      type="hidden"
                                      name="_id"
                                      value={stock?._id}
                                    />

                                    <div className="grid w-full  items-center gap-1.5">
                                      <Label htmlFor="cost_price">
                                        Cost Price
                                      </Label>
                                      <Input
                                        id="cost_price"
                                        type="number"
                                        step={0.01}
                                        name="cost_price"
                                        defaultValue={stock?.costPrice}
                                        required
                                      />
                                    </div>

                                    <div className="grid w-full  items-center gap-1.5">
                                      <Label htmlFor="price">Price</Label>
                                      <Input
                                        id="price"
                                        type="number"
                                        step={0.01}
                                        name="price"
                                        defaultValue={stock?.price}
                                        required
                                      />
                                    </div>

                                    <div className="grid w-full  items-center gap-1.5">
                                      <Label htmlFor="quantity">Quantity</Label>
                                      <Input
                                        id="quantity"
                                        type="number"
                                        name="quantity"
                                        defaultValue={stock?.quantity}
                                      />
                                    </div>

                                    <div className="flex gap-3 items-center justify-end ">
                                      <DialogClose asChild>
                                        <Button
                                          type="button"
                                          variant="destructive"
                                        >
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
                            </div>
                          ))}
                        </div>
                      </PopoverContent>
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
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline">Action</Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-56">
                      <div className="grid gap-4">
                        <Link
                          to={`/console/products/${product._id}`}
                          className="font-sm tansition-all w-full rounded-lg bg-purple-600 px-2 py-2 text-center text-white shadow-sm duration-300 hover:bg-purple-700 focus:outline-none"
                        >
                          View
                        </Link>

                        <Dialog>
                          <DialogTrigger asChild>
                            <Button>Update</Button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                              <DialogTitle>Update Product</DialogTitle>
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
                                value={product?._id}
                              />
                              <div className="grid w-full  items-center gap-1.5">
                                <Label htmlFor="name">Name</Label>
                                <Input
                                  id="name"
                                  type="text"
                                  name="name"
                                  defaultValue={product?.name}
                                  required
                                />
                              </div>

                              <div className="grid w-full  items-center gap-1.5">
                                <Label htmlFor="cost_price">Cost Price</Label>
                                <Input
                                  id="cost_price"
                                  type="number"
                                  step={0.01}
                                  name="cost_price"
                                  defaultValue={product?.costPrice}
                                  required
                                />
                              </div>

                              <div className="grid w-full  items-center gap-1.5">
                                <Label htmlFor="price">Price</Label>
                                <Input
                                  id="price"
                                  type="number"
                                  step={0.01}
                                  name="price"
                                  defaultValue={product?.price}
                                  required
                                />
                              </div>

                              <div className="grid w-full  items-center gap-1.5">
                                <Label htmlFor="category">Category</Label>
                                <Select
                                  name="category"
                                  defaultValue={product?.category?._id}
                                >
                                  <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select a category" />
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
                              </div>

                              <div className="grid w-full  items-center gap-1.5">
                                <Label htmlFor="quantity">Description</Label>
                                <Textarea
                                  name="description"
                                  placeholder="Description"
                                />
                              </div>

                              <div className="grid w-full  items-center gap-1.5">
                                <Label htmlFor="quantity">Quantity</Label>
                                <Input
                                  id="quantity"
                                  type="number"
                                  name="quantity"
                                  defaultValue={product?.quantity}
                                />
                              </div>

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
                          onClick={() => handleDelete(product._id)}
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

  const actionType = formData.get("actionType") as string;
  const completeData = formData.get("completeData") as string;

  const name = formData.get("name") as string;
  const costPrice = formData.get("cost_price") as string;
  const price = formData.get("price") as string;
  const quantity = formData.get("quantity") as string;
  const description = formData.get("description") as string;
  const category = formData.get("category") as string;

  if (formData.get("deleteId") != null) {
    return await productController.deleteProduct(
      formData.get("deleteId") as string
    );
  } else if (actionType == "batch_import") {
    let data = JSON.parse(completeData);
    return productController.importBatch(data);
  } else if (actionType == "update") {
    return await productController.updateProduct({
      _id: formData.get("_id") as string,
      name,
      price,
      costPrice,
      description,
      category,
      quantity,
    });
  } else {
    return await productController.createProduct({
      name,
      price,
      description,
      category,
      quantity,
      costPrice,
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
  const categories = await productController.getAllCategories();
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

/*
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
                    
                  
                 
                    <Input
                      name="quantity"
                      placeholder="Quantity"
                      label="Quantity"
                      type="number"
                      defaultValue={1}
                      error={actionData?.errors?.quantity}
                    />
                    

                    <Input
                      name="cost_price"
                      placeholder="cost pricce"
                      label="Cost Pricce"
                      type="number"
                      defaultValue={activeProduct.cost_price}
                      error={actionData?.errors?.cost_price}
                    />
                    

                    <Input
                      name="price"
                      placeholder="Price"
                      label="Selling Price"
                      type="number"
                      defaultValue={activeProduct.price}
                      error={actionData?.errors?.price}
                    />
                    
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
  */
