import { Fragment, useEffect, useState } from "react";
import type {
  ActionFunction,
  LoaderFunction,
  MetaFunction,
} from "@remix-run/node";
import { Form, Link, useLoaderData, useNavigation } from "@remix-run/react";

import Container from "~/components/Container";
import PosLayout from "~/components/layouts/PosLayout";
import CartController from "~/modules/cart/CartController.server";
import EmployeeAuthController from "~/modules/employee/EmployeeAuthController";
import { Transition, Dialog, Popover } from "@headlessui/react";

import ProductController from "~/modules/product/ProductController.server";
import type {
  ProductCategoryInterface,
  ProductInterface,
} from "~/modules/types";
import Input from "~/components/Input";
import Spacer from "~/components/Spacer";
import SimpleSelect from "~/components/SimpleSelect";
import { Button } from "~/components/ui/button";
import SettingsController from "~/modules/settings/SettingsController.server";

export default function Shop() {
  let { user, featured_categories, products, cart_items, generalSettings } =
    useLoaderData();
  const navigation = useNavigation();
  const [isStockOpen, setIsStockOpen] = useState(false);
  const [activeProduct, setActiveProduct] = useState({});

  useEffect(() => {
    setIsStockOpen(false);
  }, [products]);

  return (
    <PosLayout user={user} cart_items={cart_items} settings={generalSettings}>
      <section className="my-3 flex w-full gap-2 overflow-x-hidden">
        {featured_categories?.map((category: ProductCategoryInterface) => (
          <Link
            to={`/pos/category/${category?._id}`}
            key={category?._id}
            className="flex flex-col items-center border border-slate-400 rounded-lg bg-white/95 dark:bg-black/95"
          >
            <div className="  px-3 py-1">
              <p>{category?.name}</p>
            </div>
          </Link>
        ))}
      </section>

      <section className="grid grid-cols-4 gap-3">
        {products?.map((product: ProductInterface) => (
          <div
            key={product?._id}
            to={`/${product._id}`}
            className="w-full border border-slate-400 bg-white/95 dark:bg-black/95 dark:text-white p-1 rounded-lg"
          >
            <img
              className="w-full inset-0 h-60 rounded-md object-cover"
              src={product?.images[0]?.url}
              alt="product"
            />
            <section className="p-1">
              <p className="font-bold">{product?.name}</p>
              <p className="">{product?.description}</p>
              <p className="">Qty: {product?.quantity}</p>

              <div className="flex justify-between items-center mt-3">
                <p className="font-bold">$ {product?.price}</p>

                <Link to={`/pos/products/${product?._id}`}>View</Link>
                <Button
                  onClick={() => {
                    setIsStockOpen(true);
                    setActiveProduct(product);
                  }}
                >
                  Restock
                </Button>
                <Form method="POST">
                  <input type="hidden" name="product_id" value={product?._id} />
                  <input type="hidden" name="user_id" value={user?._id} />
                  <Button type="submit">Cart</Button>
                </Form>
              </div>
            </section>
          </div>
        ))}
      </section>

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

                    <SimpleSelect
                      name="operation"
                      className="w-full"
                      variant="ghost"
                    >
                      <option value="add">Add</option>
                      <option value="deduct">Deduct</option>
                    </SimpleSelect>
                    <Spacer />
                    <Input
                      name="quantity"
                      placeholder="Quantity"
                      label="Quantity"
                      type="number"
                      defaultValue={1}
                      // error={actionData?.errors?.quantity}
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
                          ? "Submitting..."
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
    </PosLayout>
  );
}

export const meta: MetaFunction = () => {
  return [
    { title: "ComClo - Products" },
    {
      description: "the best shopping site",
    },
  ];
};

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const productController = await new ProductController(request);

  const authControlle = await new EmployeeAuthController(request);
  const user = await authControlle.requireEmployeeId();

  const product = formData.get("product_id") as string;
  // const user = formData.get("user_id") as string;

  const cartController = await new CartController(request);

  if (formData.get("stockId") != null) {
    await productController.stockProduct({
      _id: formData.get("stockId") as string,
      quantity: formData.get("quantity") as string,
      operation: formData.get("operation") as string,
    });
    return true;
  }

  if ((formData.get("type") as string) == "increase") {
    return await cartController.increaseItem({ product, user });
  } else if ((formData.get("type") as string) == "decrease") {
    return await cartController.decreaseItem({ product, user });
  } else {
    return await cartController.addToCart({ user, product });
  }
};

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  const page = parseInt(url.searchParams.get("page") as string) || 1;
  const search_term = url.searchParams.get("search_term") as string;

  const settingsController = await new SettingsController(request);
  const generalSettings = await settingsController.getGeneralSettings();

  const authControlle = await new EmployeeAuthController(request);

  await authControlle.requireEmployeeId();
  const user = await authControlle.getEmployee();

  const productController = await new ProductController(request);
  const { products, totalPages } = await productController.getProducts({
    page,
    search_term,
  });

  const featured_categories = await productController.getFeaturedCategories();

  const cartController = await new CartController(request);
  const cart_items = await cartController.getUserCart({
    user: user._id as string,
  });

  return {
    user,
    products,
    featured_categories,
    page,
    totalPages,
    cart_items,
    generalSettings,
  };
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
