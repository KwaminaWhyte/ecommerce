import { Fragment, useEffect, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import {
  json,
  type LoaderFunction,
  type MetaFunction,
  type ActionFunction,
} from "@remix-run/node";
import {
  Form,
  useActionData,
  useLoaderData,
  useNavigation,
} from "@remix-run/react";
import imgPlaceholder from "~/components/inc/placeholder-image.jpg";

import Container from "~/components/Container";
import Input from "~/components/Input";
import Spacer from "~/components/Spacer";
import ProductController from "~/server/product/ProductController.server";
import { validateName } from "~/server/validators.server";
import PosLayout from "~/components/layouts/PosLayout";
import CartController from "~/server/cart/CartController.server";
import type { ProductInterface, UserInterface } from "~/server/types";
import EmployeeAuthController from "~/server/employee/EmployeeAuthController";
import { Button } from "~/components/ui/button";
import IdGenerator from "~/lib/IdGenerator";

export default function AdminProductDetails() {
  let { user, product, cart_items } = useLoaderData<{
    user: UserInterface;
    product: ProductInterface;
    cart_items: any[];
  }>();
  const [activeImage, setActiveImage] = useState({});
  let actionData = useActionData();
  let navigation = useNavigation();

  let [isOpen, setIsOpen] = useState(false);
  function openModal() {
    setIsOpen(true);
  }
  function closeModal() {
    setIsOpen(false);
  }
  useEffect(() => {
    setActiveImage(product.images[0]);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [product]);

  return (
    <PosLayout user={user} cart_items={[]}>
      <div className="mb-3 flex">
        <h1 className="text-3xl font-bold">Product Details </h1>

        <section className="ml-auto flex">
          {/* {product.images.length < 5 ? (
            <Button onClick={() => openModal()}> + Add Image</Button>
          ) : null} */}
        </section>
      </div>

      <div className="flex gap-4 overflow-x-auto">
        <section className="w-1/2">
          <img
            style={{ height: "35vw" }}
            src={activeImage.url}
            className="w-full rounded-lg object-cover"
            alt=""
          />

          <div className="mt-3 flex flex-wrap gap-3 p-1">
            {product.images.map((image) => (
              <img
                key={IdGenerator(10)}
                onClick={() => setActiveImage(image)}
                src={image.url ? image.url : imgPlaceholder}
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

      {/* <Container heading="Reviews">
        <p>Reviews</p>
      </Container> */}

      <Container heading="Stocking History">
        <p>Inventory</p>
      </Container>

      {/* <Container heading="Statistics">
        <p>product specific stats</p>
      </Container> */}

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
                    New Product
                  </Dialog.Title>
                  <div className="h-4"></div>

                  <Form method="POST" encType="multipart/form-data">
                    <Input
                      name="productId"
                      type="hidden"
                      defaultValue={product._id}
                    />

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
                          ? "Uploading..."
                          : "Upload"}
                      </Button>
                    </div>
                  </Form>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </PosLayout>
  );
}

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();

  const imgSrc = formData.get("image") as string;
  if (!imgSrc) {
    return json({ error: "something wrong" });
  }

  if (typeof imgSrc !== "string") {
    return json({ error: "Invalid image" }, { status: 400 });
  }
  const productId = formData.get("productId") as string;

  const errors = {
    name: validateName(imgSrc),
  };

  if (Object.values(errors).some(Boolean)) {
    return json({ errors, fields: { imgSrc } }, { status: 400 });
  }

  const productController = await new ProductController(request);

  return await productController.addProductImage({
    productId,
    imageUrl: imgSrc,
  });
};

export const loader: LoaderFunction = async ({ request, params }) => {
  let { productId } = params;

  const authControlle = await new EmployeeAuthController(request);
  await authControlle.requireEmployeeId();
  const user = await authControlle.getEmployee();

  const productController = await new ProductController(request);
  const product = await productController.getProduct({
    id: productId as string,
  });

  const cartController = await new CartController(request);
  const cart_items = await cartController.getUserCart({
    user: user._id as string,
  });

  return { user, product, cart_items };
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
