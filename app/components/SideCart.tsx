import React, { type ChangeEvent, useEffect, useState } from "react";
import type { CartInterface } from "~/server/types";
import { Form, useNavigation } from "@remix-run/react";
import axios from "axios";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

export default function SideCart({
  showCart,
  setShowCart,
  cart_items,
  settings,
}: {
  showCart: boolean;
  setShowCart: any;
  cart_items: CartInterface[];
  settings: any;
}) {
  const navigation = useNavigation();
  const [totalPrice, setTotalPrice] = useState(0);

  const handleItemInscription = ({
    e,
    itemId,
  }: {
    e: ChangeEvent<HTMLInputElement>;
    itemId: string;
  }) => {
    axios
      .post("/pos/api/item_writing", { inscription: e.target.value, itemId })
      .then(({ data }) => console.log(data))
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    let totalPricez = 0;
    cart_items?.forEach((cartItem) => {
      const productPrice = cartItem.product.price;
      const quantity = cartItem.quantity;
      totalPricez += productPrice * quantity;
    });

    setTotalPrice(totalPricez);
  }, [cart_items]);

  return (
    <aside
      className={`fixed top-0 p-4 right-0 h-screen w-2/5 bg-white/95 transition-transform border-l dark:border-slate-400 border-slate-400  dark:bg-black/90 z-50 duration-300 transform dark:text-white ${
        showCart ? "translate-x-0" : "translate-x-full"
      }`}
    >
      <section className="flex">
        <button
          className=" rotate-180 top-4 right-4 text-slate-500 hover:text-slate-700 mr-3"
          onClick={() => setShowCart(!showCart)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className=" w-6 h-6 "
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75"
            />
          </svg>
        </button>

        <p className="text-2xl font-bold">Current Cart</p>
        {/* <p className="">Cart ID: ODR-455-5434</p> */}
      </section>

      <section className="flex flex-col overflow-y-scroll gap-2 mt-4 h-[60%] pb-4 pt-2 overflow-y-scroll">
        {cart_items?.map((item) => (
          <div key={item?._id} className="flex justify-center">
            <img
              className="w-28 h-28 rounded-md"
              src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2960&q=80"
              alt=""
            />

            <div className="px-2 flex-1">
              <p className="text-lg font-bold">{item?.product?.name}</p>
              <p className="text-slate-500">{item?.product?.description} </p>

              <div className="flex justify-between">
                <p className="font-medium">$ {item?.product?.price} </p>

                <div className="flex">
                  {item.quantity <= 1 ? null : (
                    <Form method="POST">
                      <input type="hidden" name="type" value="decrease" />
                      <input
                        type="hidden"
                        name="product_id"
                        value={item.product._id}
                      />
                      <button
                        className="w-fit mr-3 border-none bg-none outline-none"
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

                  <p>{item?.quantity}</p>

                  <Form method="POST">
                    <input type="hidden" name="type" value="increase" />
                    <input
                      type="hidden"
                      name="product_id"
                      value={item.product._id}
                    />
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
              {settings?.allowInscription && (
                <Input
                  name="writing"
                  placeholder="Item writing..."
                  defaultValue={item?.inscription}
                  onChange={(e) =>
                    handleItemInscription({ e, itemId: item?._id })
                  }
                />
              )}
            </div>
          </div>
        ))}
      </section>

      <section className="border-t border-slate-700 py-2">
        <Form className="gap-2 flex flex-col">
          <Input name="customer_name" label="Customer Name" />
          <Input name="customer_phone" label="Customer Phone Number" />
        </Form>
      </section>

      <section className="flex flex-col mt-2">
        <div className="flex justify-between items-center">
          <p className="font-bold text-lg">Total</p>
          <p className="font-bold text-lg">${totalPrice}</p>
        </div>

        <Button className="w-full mt-auto">Continue to Payment</Button>
      </section>
    </aside>
  );
}
