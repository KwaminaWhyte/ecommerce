import { useEffect, useState } from "react";
import {
  type LoaderFunction,
  type MetaFunction,
  type ActionFunction,
} from "@remix-run/node";
import { Form, useLoaderData, useNavigate, useSubmit } from "@remix-run/react";
import axios from "axios";

import Container from "~/components/Container";
import Input from "~/components/Input";
import AdminLayout from "~/components/layouts/AdminLayout";
import AdminController from "~/server/admin/AdminController.server";
import ProductController from "~/server/product/ProductController.server";
import type { AdminInterface, ProductInterface } from "~/server/types";
import { Button } from "~/components/ui/button";
import { Label } from "~/components/ui/label";
import IdGenerator from "~/lib/IdGenerator";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";

export default function AdminProductDetails() {
  const submit = useSubmit();
  const navigate = useNavigate();
  const { user, product } = useLoaderData<{
    product: ProductInterface;
    user: AdminInterface;
  }>();
  const [activeImage, setActiveImage] = useState({});
  const [files, setFiles] = useState<{ file: any; previewUrl: string }[]>([]);

  let [isOpen, setIsOpen] = useState(false);
  function openModal() {
    setIsOpen(true);
  }
  function closeModal() {
    setIsOpen(false);
  }

  const handleFileChange = (event) => {
    const newImages = [...files];
    for (const file of event.target.files) {
      const image = {
        file: file,
        previewUrl: URL.createObjectURL(file),
      };
      newImages.push(image);
    }
    setFiles(newImages);
  };

  const handleUpload = async () => {
    const formData = new FormData();
    let index = 0;
    while (index < files.length) {
      formData.append("file", files[index].file);
      formData.append("upload_preset", "hostel");

      axios
        .post(
          "https://api.cloudinary.com/v1_1/app-deity/image/upload",
          formData
        )
        .then((response) => {
          submit(
            {
              productId: product?._id,
              image: JSON.stringify({
                url: response.data.secure_url,
                externalId: response.data.asset_id,
              }),
            },
            {
              method: "post",
            }
          );
        })
        .catch((error) => {
          console.error(error);
        });
      index += 1;
    }
  };

  useEffect(() => {
    setActiveImage(product.images[0]);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [product]);

  return (
    <AdminLayout user={user} className="gap-4">
      <div className="flex items-center">
        <div
          className="border border-gray-400 rounded-sm p-1 mr-3"
          onClick={() => navigate(-1)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-7 h-7 text-gray-500 hover:text-gray-700 cursor-pointer"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 19.5L8.25 12l7.5-7.5"
            />
          </svg>
        </div>

        <h1 className="text-3xl font-bold">Product Details </h1>

        <section className="ml-auto flex">
          {product?.images.length < 5 ? (
            <Button onClick={() => openModal()}> + Add Image</Button>
          ) : null}
        </section>
      </div>

      <div className="flex gap-4 overflow-x-auto">
        <section className="w-1/2">
          <img
            style={{ height: "35vw" }}
            src={activeImage?.url}
            className="w-full rounded-lg object-cover"
            alt=""
          />

          <div className="mt-3 flex flex-wrap gap-3 p-1">
            {product?.images.map((image) => (
              <img
                key={IdGenerator()}
                onClick={() => setActiveImage(image)}
                src={image?.url}
                className={`h-20 w-20 rounded-md object-cover ${
                  image._id == activeImage?._id
                    ? "ring-1 ring-purple-500 ring-offset-2"
                    : ""
                } `}
                alt=""
              />
            ))}
          </div>
        </section>

        <section className="w-1/2">
          <h2 className="text-xl font-bold">{product.name}</h2>
          <p>{product.description}</p>
          <p>quantity</p>
        </section>
      </div>

      <Container heading="Stocking History" contentClassName="flex flex-col">
        <Dialog>
          <DialogTrigger asChild>
            <Button>Restock</Button>
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
              <input type="hidden" name="actionType" value="update" />
              <input type="hidden" name="_id" value={product?._id} />

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
                  // disabled={navigation.state === "submitting" ? true : false}
                >
                  Submit
                </Button>
              </div>
            </Form>
          </DialogContent>
        </Dialog>

        <section>
          <p>Inventory</p>
        </section>
      </Container>

      <Container heading="Statistics">
        <p>product specific stats</p>
      </Container>

      {/* <Transition appear show={isOpen} as={Fragment}>
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
                    Upload Images
                  </Dialog.Title>
                  <div className="h-4"></div>

                  <div className=" bg-white p-4 rounded-2xl  flex-col gap-5 items-center">
                    <div className="grid flex-1 items-center gap-1.5 mb-5">
                      <Label htmlFor="image">Add Images</Label>
                      <Input
                        type="file"
                        id="image"
                        name="image"
                        accept=".png,.jpg,jpeg"
                        multiple
                        onChange={handleFileChange}
                      />
                    </div>

                    <div className="flex gap-3 ml-auto">
                      <Button
                        color="error"
                        type="button"
                        className="ml-auto mr-3"
                        onClick={closeModal}
                        variant="destructive"
                      >
                        Close
                      </Button>

                      <Button type="button" onClick={handleUpload}>
                        Upload Images
                      </Button>
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition> */}
    </AdminLayout>
  );
}

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();

  const image = formData.get("image") as string;
  const productId = formData.get("productId") as string;

  const productController = await new ProductController(request);
  return await productController.addProductImage({
    productId,
    image: JSON.parse(image),
  });
};

export const loader: LoaderFunction = async ({ request, params }) => {
  let { productId } = params;
  const adminController = await new AdminController(request);
  await adminController.requireAdminId();

  const user = await adminController.getAdmin();

  const productController = await new ProductController(request);
  const product = await productController.getProduct({
    id: productId as string,
  });

  return { user, product };
};

export const meta: MetaFunction = ({ data }) => {
  let { product } = data;

  return [
    { title: `ComClo - Product | ${product.name} ` },
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
