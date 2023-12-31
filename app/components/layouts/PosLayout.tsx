import type { CartInterface, EmployeeInterface } from "~/server/types";
import PosSideNavigation from "../PosSideNavigation";
import { type ChangeEvent, useEffect, useState } from "react";
import { Toaster } from "../ui/toaster";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import axios from "axios";
import { Form, useSubmit } from "@remix-run/react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Label } from "../ui/label";
import { Switch } from "../ui/switch";
import IdGenerator from "~/lib/IdGenerator";
import imgPlaceholder from "../inc/placeholder-image.jpg";

export default function PosLayout({
  children,
  user,
  cart_items = [],
  settings,
  sales_persons,
  className,
}: {
  children: React.ReactNode;
  user?: EmployeeInterface;
  title?: string;
  settings?: any;
  cart_items?: CartInterface[];
  sales_persons?: any;
  className?: string;
}) {
  const submit = useSubmit();
  const [totalPrice, setTotalPrice] = useState(0);
  const [onCredit, setOnCredit] = useState(false);

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
      const productPrice = cartItem?.stock
        ? cartItem?.stock?.price
        : cartItem?.product?.price;
      const quantity = cartItem.quantity;
      totalPricez += productPrice * quantity;
    });

    setTotalPrice(totalPricez);
  }, [cart_items]);

  return (
    <div className="flex min-h-screen w-full flex-col bg-slate-100/90">
      <nav className="fixed z-20 flex h-16 w-full items-center border-b dark:text-white border-b-slate-400 bg-white px-5 dark:border-b-slate-700 dark:bg-black/90">
        <Sheet>
          <SheetTrigger asChild className="ml-auto">
            <Button variant="outline" className="relative">
              <span className="absolute -left-2 -top-1 bg-purple-600 text-white px-2 py-0.5 rounded-xl">
                {cart_items?.length}
              </span>{" "}
              Cart
            </Button>
          </SheetTrigger>
          <SheetContent className="min-w-[700px] ">
            <SheetHeader>
              <SheetTitle>Cart</SheetTitle>
            </SheetHeader>

            <div className="w-full flex flex-col">
              <section className="flex flex-col overflow-y-scroll gap-2 mt-4 pb-4 pt-2 max-h-[50vh]">
                {cart_items?.map((item) => (
                  <div key={IdGenerator()} className="flex justify-center">
                    <img
                      className="w-28 h-28 rounded-md object-cover"
                      src={
                        item?.product?.images[0]?.url
                          ? item?.product?.images[0]?.url
                          : imgPlaceholder
                      }
                      alt=""
                    />

                    <div className="px-2 flex-1 flex flex-col gap-1">
                      <p className="text-lg font-bold">{item?.product?.name}</p>

                      <div className="flex flex-col gap-2 rounded-lg w-60">
                        {item?.product?.stockHistory.map((stock) => (
                          <p
                            onClick={() => {
                              submit(
                                {
                                  actionType: "set_stock",
                                  product_id: item?.product?._id,
                                  stock: stock?._id,
                                },
                                {
                                  method: "post",
                                }
                              );
                            }}
                            key={IdGenerator()}
                            className={`bg-gray-200 px-2 text-xs cursor-pointer py-1 rounded-sm font-semibold ${
                              item?.stock?._id === stock?._id &&
                              "bg-slate-700 text-white"
                            }`}
                          >
                            {stock?.quantity} items @ GH₵ {stock?.price} each
                          </p>
                        ))}
                      </div>

                      <div className="flex justify-between items-center">
                        {item?.product?.price ? (
                          <p className="font-medium">
                            GH₵ {item?.product?.price}
                          </p>
                        ) : (
                          <p className="font-medium">
                            GH₵ {item?.stock?.price}
                          </p>
                        )}

                        <div className="flex items-center gap-3">
                          {item.quantity <= 1 ? null : (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth={1.5}
                              stroke="currentColor"
                              className="h-6 w-6 cursor-pointer hover:text-purple-600"
                              onClick={() => {
                                submit(
                                  {
                                    actionType: "decrease",
                                    product_id: item?.product?._id,
                                  },
                                  {
                                    method: "post",
                                  }
                                );
                              }}
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
                              />
                            </svg>
                          )}

                          <p>{item?.quantity}</p>

                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="h-6 w-6 cursor-pointer hover:text-purple-600"
                            onClick={() => {
                              submit(
                                {
                                  actionType: "increase",
                                  product_id: item?.product?._id,
                                },
                                {
                                  method: "post",
                                }
                              );
                            }}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                        </div>
                      </div>

                      <svg
                        onClick={() => {
                          submit(
                            {
                              actionType: "remove_from_cart",
                              product_id: item?.product?._id,
                            },
                            {
                              method: "post",
                            }
                          );
                        }}
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="h-6 w-6 cursor-pointer hover:text-purple-600 ml-auto"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                        />
                      </svg>

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

              <section className="flex flex-col mt-auto">
                <div className="flex justify-between items-center">
                  <p className="font-bold text-lg">Total</p>
                  <p className="font-bold text-lg">${totalPrice}</p>
                </div>
              </section>

              <Form
                method="POST"
                className="gap-2 flex flex-col border-t border-slate-700 py-2"
              >
                <input type="hidden" name="actionType" value="complete" />
                <input
                  type="hidden"
                  name="on_credit"
                  value={onCredit.toString()}
                />
                <div className="flex items-center mt-2 space-x-2">
                  <Switch
                    id="on_credit"
                    onCheckedChange={(value) => setOnCredit(value)}
                  />
                  <Label htmlFor="on_credit">On Credit</Label>
                </div>

                <div className="mt-2 ">
                  <Label>Customer Name</Label>
                  <Input name="customer_name" placeholder="Customer Name" />
                </div>

                <div className="mt-2 ">
                  <Label>Customer Phone</Label>
                  <Input
                    name="customer_phone"
                    placeholder="Customer Phone Number"
                  />
                </div>

                <div className="mt-2 ">
                  <Label>Amount Paid</Label>
                  <Input name="amount_paid" type="number" />
                </div>

                <div className="mt-2 ">
                  <Label>Balance</Label>
                  <Input name="balance" type="number" />
                </div>

                {settings?.includeSalesPerson && (
                  <div className="mt-2 ">
                    <Label>Sales Person</Label>
                    <Select name="sales_person">
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a sales person" />
                      </SelectTrigger>
                      <SelectContent>
                        {sales_persons?.map((person) => (
                          <SelectItem key={IdGenerator()} value={person?._id}>
                            {person?.firstName} {person?.lastName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                <Button className="w-full mt-auto" type="submit">
                  Continue to Payment
                </Button>
              </Form>
            </div>
          </SheetContent>
        </Sheet>
      </nav>

      <section className="flex">
        <PosSideNavigation user={user} />

        <main
          className={`flex min-h-full w-full flex-1 flex-col px-5 py-20  dark:bg-black/95 dark:text-white ${className}`}
        >
          {children}
        </main>
      </section>

      <Toaster />
    </div>
  );
}
