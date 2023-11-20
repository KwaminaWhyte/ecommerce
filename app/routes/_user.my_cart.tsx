import { useState, useEffect } from "react";
import {
  type MetaFunction,
  type LoaderFunction,
  type ActionFunction,
  redirect,
} from "@remix-run/node";
import {
  Form,
  useActionData,
  useLoaderData,
  useNavigation,
} from "@remix-run/react";

import UserDetailLayout from "~/components/layouts/UserDetailLayout";
import type { CartInterface } from "~/server/types";
import UserController from "~/server/user/UserController.server";
import CartController from "~/server/cart/CartController.server";
import OrderController from "~/server/order/OrderController.server";
import Container from "~/components/Container";
import DeleteModal from "~/components/modals/DeleteModal";
import Loader from "~/components/Loader";
import { Button } from "~/components/ui/button";

export default function UserCart() {
  const navigation = useNavigation();
  const actionData = useActionData();
  let { carts, userId } = useLoaderData<{
    carts: CartInterface[];
    userId: string;
  }>();

  const [totalPrice, setTotalPrice] = useState(0);
  const [deleteId, setDeleteId] = useState(null);
  const [isOpenDelete, setIsOpenDelete] = useState(false);

  let handleDelete = (id) => {
    setDeleteId(id);
    setIsOpenDelete(true);
  };

  useEffect(() => {
    setDeleteId(null);
    setIsOpenDelete(false);
  }, [actionData]);

  useEffect(() => {
    let totalPricez = 0;

    carts?.forEach((cartItem) => {
      const productPrice = cartItem.product.price;
      const quantity = cartItem.quantity;
      totalPricez += productPrice * quantity;
    });

    setTotalPrice(totalPricez);
  }, [carts]);

  return (
    <UserDetailLayout title="Cart">
      {/* <Loader /> */}
      {carts?.length === 0 ? <p className="text-center">No item here</p> : null}
      {carts?.map((item) => (
        <div
          key={item._id}
          className="mb-3 flex w-full rounded-lg bg-white p-1 shadow-md  dark:bg-slate-800"
        >
          <img
            className="h-20 w-20 rounded-md object-cover"
            src={item.product.images[0].url}
            alt=""
          />

          <div className="ml-3 flex-1 ">
            <p className="font-semibold">{item.product.name}</p>
            <div className="flex items-center justify-between">
              <p>Qty: {item.quantity}</p>

              <button
                className="ml-3 mr-3 w-fit border-none bg-none outline-none"
                onClick={() => handleDelete(item?._id)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                  />
                </svg>
              </button>
            </div>
            <div className="flex items-center justify-between">
              <p>${item.product.price * item.quantity}</p>

              <div className="flex">
                {item.quantity <= 1 ? null : (
                  <Form method="POST">
                    <input type="hidden" name="type" value="decrease" />
                    <input
                      type="hidden"
                      name="productId"
                      value={item.product._id}
                    />
                    <input type="hidden" name="userId" value={userId} />

                    <button
                      className="w-fit border-none bg-none outline-none"
                      disabled={navigation.state === "loading" ? true : false}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="h-6 w-6"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </button>
                  </Form>
                )}

                <Form method="POST">
                  <input type="hidden" name="type" value="increase" />
                  <input
                    type="hidden"
                    name="productId"
                    value={item.product._id}
                  />
                  <input type="hidden" name="userId" value={userId} />

                  <button
                    className="ml-3 mr-3 w-fit border-none bg-none outline-none"
                    disabled={navigation.state === "loading" ? true : false}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="h-6 w-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </button>
                </Form>
              </div>
            </div>
          </div>
        </div>
      ))}

      {carts?.length >= 1 && (
        <Form
          method="POST"
          className="fixed bottom-0 left-1 right-1 mx-auto my-2 flex w-[96vw] items-center justify-between rounded-2xl border border-slate-400 bg-white p-1 px-3 shadow-md dark:bg-black/80 dark:text-white"
        >
          <input type="hidden" name="type" value="checkout" />
          <input type="hidden" name="userId" value={userId} />
          <input type="hidden" name="totalPrice" value={totalPrice} />
          <p>Total Price: ${totalPrice}</p>
          <Button type="submit" className="py-3">
            Proceed
          </Button>
        </Form>
      )}

      <DeleteModal
        id={deleteId}
        isOpen={isOpenDelete}
        title="Remove Item"
        description="Are you sure you want to remove this product from cart?"
        closeModal={() => setIsOpenDelete(false)}
      />
    </UserDetailLayout>
  );
}

export const meta: MetaFunction = () => {
  return [
    { title: "ComClo - Cart" },
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

export const action: ActionFunction = async ({ request, params }) => {
  const formData = await request.formData();

  const productId = formData.get("productId") as string;

  const cartController = await new CartController(request);
  const orderController = await new OrderController(request);

  if (formData.get("deleteId") != null) {
    let id = formData.get("deleteId") as string;
    await cartController.deleteItem({ id });
    return redirect(`/my_cart`, 200);
  }

  if ((formData.get("type") as string) == "increase") {
    let user = formData.get("userId") as string;
    return await cartController.increaseItem({ product: productId, user });
  } else if ((formData.get("type") as string) == "decrease") {
    let user = formData.get("userId") as string;
    return await cartController.decreaseItem({ product: productId, user });
  } else if ((formData.get("type") as string) == "checkout") {
    let user = formData.get("userId") as string;
    return await orderController.checkout({ user });
  }
  return true;
};

export const loader: LoaderFunction = async ({ request }) => {
  const userController = await new UserController(request);
  const userId = await userController.requireUserId();

  const cartController = await new CartController(request);
  const carts = await cartController.getUserCart({ user: userId as string });

  return { carts, userId };
};
