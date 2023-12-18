import { useEffect, useRef } from "react";
import type {
  ActionFunction,
  LoaderFunction,
  MetaFunction,
} from "@remix-run/node";
import { Form, Link, useActionData, useLoaderData } from "@remix-run/react";
import { Popover } from "@headlessui/react";

import PosLayout from "~/components/layouts/PosLayout";
import CartController from "~/server/cart/CartController.server";
import EmployeeAuthController from "~/server/employee/EmployeeAuthController";
import ProductController from "~/server/product/ProductController.server";
import type {
  EmployeeInterface,
  CategoryInterface,
  ProductInterface,
  CartInterface,
} from "~/server/types";
import { Button } from "~/components/ui/button";
import SettingsController from "~/server/settings/SettingsController.server";
import OrderController from "~/server/order/OrderController.server";
import pkg from "react-to-print";
import { OrderReceipt } from "~/components/printables/OrderReceipt";
import EmployeeController from "~/server/employee/EmployeeController.server";
import IdGenerator from "~/lib/IdGenerator";

const { useReactToPrint } = pkg;

export default function Shop() {
  let {
    user,
    featured_categories,
    products,
    cart_items,
    generalSettings,
    sales_persons,
  } = useLoaderData<{
    user: EmployeeInterface;
    featured_categories: CategoryInterface[];
    products: ProductInterface[];
    generalSettings: any;
    cart_items: CartInterface[];
    sales_persons: EmployeeInterface[];
  }>();
  const actionData = useActionData();

  useEffect(() => {
    if (actionData) {
      handlePrint();
    }
  }, [actionData]);

  const componentRef = useRef(null);
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  return (
    <PosLayout
      user={user}
      cart_items={cart_items}
      settings={generalSettings}
      sales_persons={sales_persons}
    >
      <section className="my-3 flex w-full gap-2 overflow-x-hidden">
        {featured_categories?.map((category) => (
          <Link
            to={`/pos/category/${category?._id}`}
            key={IdGenerator(10)}
            className="flex flex-col items-center border border-slate-400 rounded-lg bg-white/95 dark:bg-black/95"
          >
            <div className="  px-3 py-1">
              <p>{category?.name}</p>
            </div>
          </Link>
        ))}
      </section>

      <section className="grid grid-cols-4 gap-3">
        {products?.map((product) => (
          <div
            key={IdGenerator(10)}
            className="w-full border border-slate-400 bg-white/95 dark:bg-black/95 dark:text-white p-1 rounded-lg"
          >
            <img
              className="w-full inset-0 h-60 rounded-md object-cover"
              src={product?.images[0]?.url}
              alt="product"
            />
            <section className="p-1 flex flex-col">
              <p className="font-bold text-base">{product?.name}</p>
              <p className="line-clamp-3 mb-2">{product?.description}</p>

              <div className="flex justify-between items-center mt-auto">
                <p className="">Qty: {product?.quantity} Left</p>

                {product?.price ? (
                  <p className="font-bold">GH₵ {product?.price}</p>
                ) : (
                  <Popover className="relative ">
                    <Popover.Button className="font-semibold tansition-all border border-gray-600 rounded-lg px-2 py-1 shadow-sm duration-300 focus:outline-none">
                      {product.stockHistory.length > 0 &&
                        product.stockHistory.length}{" "}
                      Stocks
                    </Popover.Button>

                    <Popover.Panel className="absolute z-10 ">
                      <div className="flex flex-col gap-2 rounded-lg bg-white p-3 shadow-lg dark:bg-slate-900 w-60">
                        {product.stockHistory.map((stock) => (
                          <p
                            key={IdGenerator(10)}
                            className="bg-gray-200 px-2 py-1 rounded-sm font-semibold"
                          >
                            {stock.quantity} items @ GH₵ {stock.price} each
                          </p>
                        ))}
                      </div>
                    </Popover.Panel>
                  </Popover>
                )}
              </div>

              <div className="flex justify-between items-center mt-3">
                {/* <Link to={`/pos/products/${product?._id}`}>View</Link> */}

                <Form method="POST" className="ml-auto">
                  <input type="hidden" name="actionType" value="add_to_cart" />
                  <input type="hidden" name="product_id" value={product?._id} />
                  <input type="hidden" name="user_id" value={user?._id} />
                  <Button type="submit">Add to Cart</Button>
                </Form>
              </div>
            </section>
          </div>
        ))}
      </section>
      {/* 
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
      </Transition> */}

      <OrderReceipt
        order={actionData}
        generalSettings={generalSettings}
        ref={componentRef}
      />
    </PosLayout>
  );
}

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();

  const cartController = await new CartController(request);
  const orderController = await new OrderController(request);
  const authControlle = await new EmployeeAuthController(request);

  const product = formData.get("product_id") as string;
  const stock = formData.get("stock") as string;
  const actionType = formData.get("actionType") as string;

  if (actionType == "complete") {
    const ress = await orderController.checkout({
      customerName: formData.get("customer_name") as string,
      customerPhone: formData.get("customer_phone") as string,
      salesPerson: formData.get("sales_person") as string,
      onCredit: formData.get("on_credit") as string,
      amountPaid: formData.get("amount_paid") as string,
    });

    return ress;
  } else if (actionType == "increase") {
    return await cartController.increaseItem({ product });
  } else if (actionType == "decrease") {
    return await cartController.decreaseItem({ product });
  } else if (actionType == "add_to_cart") {
    return await cartController.addToCart({ product });
  } else if (actionType == "remove_from_cart") {
    return await cartController.removeFromCart({ product });
  } else if (actionType == "clear_cart") {
    return await cartController.clear_cart({ product });
  } else if (actionType == "set_stock") {
    return await cartController.setStock({ stock, product });
  }
};

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  const page = parseInt(url.searchParams.get("page") as string) || 1;
  const search_term = url.searchParams.get("search_term") as string;

  const settingsController = await new SettingsController(request);
  const generalSettings = await settingsController.getGeneralSettings();

  const authControlle = await new EmployeeAuthController(request);

  const employeeController = await new EmployeeController(request);
  const sales_persons = await employeeController.getSalesPerson();

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
    user: user?._id as string,
  });

  return {
    user,
    products,
    featured_categories,
    page,
    totalPages,
    cart_items,
    generalSettings,
    sales_persons,
  };
};

export const meta: MetaFunction = () => {
  return [
    { title: "ComClo | POS - Products" },
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
