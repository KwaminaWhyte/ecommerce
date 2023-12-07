import type { CartInterface, EmployeeInterface } from "~/server/types";
import PosSideNavigation from "../PosSideNavigation";
import { type ChangeEvent, useEffect, useState } from "react";
import { Toaster } from "../ui/toaster";
import {
  Sheet,
  SheetContent,
  SheetDescription,
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

export default function PosLayout({
  children,
  user,
  cart_items = [],
  settings,
  sales_persons,
}: {
  children: React.ReactNode;
  user?: EmployeeInterface;
  title?: string;
  settings?: any;
  cart_items?: CartInterface[];
  sales_persons?: any;
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

    if (settings?.separateStocks) {
      cart_items?.forEach((cartItem) => {
        const productPrice = cartItem?.stock?.price;
        const quantity = cartItem.quantity;
        totalPricez += productPrice * quantity;
      });

      setTotalPrice(totalPricez);
    } else {
      cart_items?.forEach((cartItem) => {
        const productPrice = cartItem?.product?.price;
        const quantity = cartItem.quantity;
        totalPricez += productPrice * quantity;
      });

      setTotalPrice(totalPricez);
    }
  }, [cart_items]);

  return (
    <div className="flex min-h-screen w-full flex-col bg-slate-100/90">
      <nav className="fixed z-20 flex h-16 w-full items-center border-b dark:text-white border-b-slate-400 bg-white px-5 dark:border-b-slate-700 dark:bg-black/90">
        {/* <p>Pos Dashboard</p> */}

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
              <SheetDescription>
                {/* Make changes to your profile here. Click save when you're done. */}
              </SheetDescription>
            </SheetHeader>

            <div className="w-full flex flex-col">
              <section className="flex flex-col overflow-y-scroll gap-2 mt-4 h-[60%] pb-4 pt-2">
                {cart_items?.map((item) => (
                  <div key={IdGenerator()} className="flex justify-center">
                    <img
                      className="w-28 h-28 rounded-md object-cover"
                      src={item?.product?.images[0]?.url}
                      alt=""
                    />

                    <div className="px-2 flex-1">
                      <p className="text-lg font-bold">{item?.product?.name}</p>

                      <div className="flex flex-col gap-2 rounded-lg w-60">
                        {item?.product?.stockHistory.map((stock) => (
                          <p
                            onClick={() => {
                              submit(
                                {
                                  type: "set_stock",
                                  product_id: item?.product?._id,
                                  stock_id: stock?._id,
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

                      <div className="flex justify-between">
                        {item?.product?.price ? (
                          <p className="font-medium">
                            GH₵ {item?.product?.price}
                          </p>
                        ) : (
                          <p className="font-medium">
                            GH₵ {item?.stock?.price}
                          </p>
                        )}

                        <div className="flex">
                          {item.quantity <= 1 ? null : (
                            <Form method="POST">
                              <input
                                type="hidden"
                                name="type"
                                value="decrease"
                              />
                              <input
                                type="hidden"
                                name="product_id"
                                value={item.product._id}
                              />
                              <button className="w-fit mr-3 border-none bg-none outline-none">
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
                            <button className="ml-3 mr-3 w-fit border-none bg-none outline-none">
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

              <section className="flex flex-col mt-auto">
                <div className="flex justify-between items-center">
                  <p className="font-bold text-lg">Total</p>
                  <p className="font-bold text-lg">${totalPrice}</p>
                </div>
              </section>

              <section className="border-t border-slate-700 py-2">
                <Form method="POST" className="gap-2 flex flex-col">
                  <input type="hidden" name="type" value="complete" />
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

                  <Button className="w-full mt-auto" type="submit">
                    Continue to Payment
                  </Button>
                </Form>
              </section>
            </div>
          </SheetContent>
        </Sheet>
      </nav>

      <section className="flex">
        <PosSideNavigation user={user} />

        <main className="flex min-h-full w-full flex-1 flex-col px-5 py-20  dark:bg-black/95 dark:text-white ">
          {children}
        </main>
      </section>

      <Toaster />
    </div>
  );
}
