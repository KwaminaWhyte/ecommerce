import { Popover } from "@headlessui/react";
import {
  type ActionFunction,
  json,
  type LoaderFunction,
  type MetaFunction,
} from "@remix-run/node";

import {
  Link,
  useLoaderData,
  useNavigate,
  useOutletContext,
} from "@remix-run/react";
import { useRef } from "react";
import Container from "~/components/Container";
import ItemStatus from "~/components/ItemStatus";
import PosLayout from "~/components/layouts/PosLayout";
import { Button } from "~/components/ui/button";
import IdGenerator from "~/lib/IdGenerator";
import EmployeeAuthController from "~/server/employee/EmployeeAuthController";
import OrderController from "~/server/order/OrderController.server";
import type {
  OrderInterface,
  PaymentInterface,
  UserInterface,
} from "~/server/types";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";

import pkg from "react-to-print";
import { OrderReceipt } from "~/components/printables/OrderReceipt";
import SettingsController from "~/server/settings/SettingsController.server";
import PaymentController from "~/server/payment/PaymentController";
import moment from "moment";

const { useReactToPrint } = pkg;

export default function AdminOrderDetails() {
  const { user, cart_items } = useOutletContext<{
    user: UserInterface;
    cart_items: any[];
  }>();
  const { order, generalSettings, payments } = useLoaderData<{
    order: OrderInterface;
    generalSettings: any;
    payments: PaymentInterface[];
  }>();
  const navigate = useNavigate();

  const componentRef = useRef(null);
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  return (
    <PosLayout user={user} cart_items={cart_items} settings={generalSettings}>
      <section className="mb-3 flex items-center">
        <div
          onClick={() => navigate(-1)}
          className="mr-4 flex border border-gray-400 rounded-md"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="h-6 w-6 m-1.5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19.5 12h-15m0 0l6.75 6.75M4.5 12l6.75-6.75"
            />
          </svg>
        </div>

        <h1 className="text-3xl font-bold">Order Details </h1>
      </section>

      <div className="flex gap-3">
        <Container
          heading="Pacakge"
          contentClassName="flex-col"
          className="w-[60%]"
        >
          <div className="flex items-center border-b border-slate-400 py-5">
            <p className="mr-5 text-base font-semibold">{order.orderId}</p>

            <ItemStatus status={order?.paymentStatus} />

            <Popover className="relative ml-4">
              <Popover.Button className="focus:outline-none">
                <ItemStatus status={order?.deliveryStatus} />
              </Popover.Button>
              {/* <Popover.Panel className="absolute z-10 border border-slate-300 shadow-lg rounded-lg">
                <div className="flex w-52 flex-col rounded-md bg-white p-3 shadow-sm dark:bg-slate-900 dark:text-white">
                  {[
                    { id: 1, label: "Pending" },
                    { id: 3, label: "Shipped" },
                    { id: 5, label: "Delivered" },
                  ].map((status) => (
                    <p
                      key={status.id}
                      onClick={() => {
                        submit(
                          {
                            _id: order?._id,
                            status: status.label.toLowerCase(),
                          },
                          {
                            method: "post",
                            encType: "application/x-www-form-urlencoded",
                          }
                        );

                        // setDeliveryStatus(status.label.toLowerCase());
                      }}
                      className="p-2 hover:bg-slate-200 dark:hover:bg-black rounded-lg cursor-pointer"
                    >
                      {status.label}
                    </p>
                  ))}
                </div>
              </Popover.Panel> */}
            </Popover>

            <Button className="ml-auto" type="button" onClick={handlePrint}>
              Print Receipt
            </Button>

            {order.paymentStatus === "pending" && (
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" className="ml-5">
                    Make Payment
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Make Payment</DialogTitle>
                    <DialogDescription>
                      {/* Make changes to your profile here. Click save when you're done. */}
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="name" className="text-right">
                        Amount
                      </Label>
                      <Input
                        id="name"
                        value="Pedro Duarte"
                        className="col-span-3"
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button type="submit">Proceed</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            )}
          </div>

          <div className="mt-5 grid grid-cols-2">
            <div className="mb-2">
              <p className="font-medium">Customer</p>
              <p className="text-slate-500 dark:text-slate-400">
                {order?.user?.firstName} {order?.user?.lastName}
              </p>
            </div>

            <div className="mb-2">
              <p className="font-medium">Email</p>
              <p className="text-slate-500 dark:text-slate-400">
                {order?.user?.email}
              </p>
            </div>

            <div className="mb-2">
              <p className="font-medium">Phone</p>
              <p className="text-slate-500 dark:text-slate-400">
                {order?.user?.phone}
              </p>
            </div>

            <div className="mb-2">
              <p className="font-medium">Address</p>
              <p className="text-slate-500 dark:text-slate-400">
                {order?.address}
              </p>
            </div>
          </div>

          <div className="relative mt-5 w-full overflow-x-auto shadow-sm sm:rounded-lg">
            <table className="w-full text-left text-slate-500 dark:text-slate-400">
              <thead className="bg-slate-50 uppercase text-slate-700 dark:bg-slate-700 dark:text-slate-400">
                <tr>
                  <th scope="col" className="px-3 py-3">
                    Image
                  </th>
                  <th scope="col" className="px-3 py-3">
                    Name
                  </th>
                  <th scope="col" className="px-3 py-3">
                    Quantity
                  </th>
                </tr>
              </thead>
              <tbody>
                {order?.orderItems.map((item) => (
                  <tr
                    key={IdGenerator(10)}
                    className="cursor-pointer rounded-xl hover:rounded-xl hover:bg-white hover:shadow-sm dark:border-slate-400 dark:bg-slate-800 dark:hover:bg-slate-600"
                  >
                    <td className="px-3 py-3">
                      <img
                        src={item?.product?.images[0]?.url}
                        className="h-20 w-20 rounded-md object-cover"
                        alt=""
                      />
                    </td>
                    <td
                      scope="row"
                      className="px-3 py-3 font-medium text-slate-900 dark:text-white"
                    >
                      {item?.product?.name}
                    </td>
                    <td className="px-3 py-3">{item?.quantity}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-5">
            <p className="mb-1 font-bold">Notes</p>
            <p>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Quasi
              nisi optio at ea asperiores accusantium libero quas amet cum
              exercitationem omnis quo veritatis incidunt hic, maxime delectus
              voluptatum, repudiandae officia.
            </p>
          </div>
        </Container>

        <section className="flex flex-1 flex-col ">
          <Container
            heading="Payment"
            contentClassName="flex-wrap grid grid-cols-2"
          >
            <div className="mb-2">
              <p className="font-medium">Date</p>
              <p className="text-slate-500 dark:text-slate-400">
                {moment(order?.createdAt).format("DD MMMM YYYY")}
              </p>
            </div>

            {/* <div className="mb-2">
              <p className="font-medium">Tracking #</p>
              <p className="text-slate-500 dark:text-slate-400">
                {order?.paymentInfo?.id}
              </p>
            </div> */}

            <div className="mb-2">
              <p className="font-medium">Method</p>
              <p className="text-slate-500 dark:text-slate-400">Mobile Money</p>
            </div>

            <div className="mb-2">
              <p className="font-medium">Charge</p>
              <p className="text-slate-500 dark:text-slate-400">
                $ {order?.totalPrice}
              </p>
            </div>

            {/* <div className="mb-2">
              <p className="font-medium">Shipping Charge</p>
              <p className="text-slate-500 dark:text-slate-400">
                $ {order?.shippingPrice}
              </p>
            </div> */}

            {/* <div className="mb-2">
              <p className="font-medium">Status</p>
              <p className="text-slate-500 dark:text-slate-400">
                {order?.paymentInfo?.status}
              </p>
            </div> */}
          </Container>

          <Container
            heading="Payment History"
            contentClassName="flex-col gap-2"
          >
            {payments.map((payment) => (
              <div
                key={IdGenerator()}
                className="flex w-full flex-col bg-gray-100 rounded-xl p-3 shadow-sm"
              >
                <p>
                  {moment(payment?.createdAt).format(
                    "dddd, DD MMMM YYYY - hh:mm A"
                  )}
                </p>
                <p className="font-medium"> GH₵ {payment?.amount}</p>
              </div>
            ))}
          </Container>
        </section>
      </div>

      <OrderReceipt
        order={order}
        generalSettings={generalSettings}
        ref={componentRef}
      />
    </PosLayout>
  );
}

export const meta: MetaFunction = ({ data }) => {
  let { order } = data;

  return [
    { title: `ComClo - Order Details | ${order?.orderId} ` },
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

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
};

export const loader: LoaderFunction = async ({ request, params }) => {
  const { orderId } = params;

  const authControlle = await new EmployeeAuthController(request);
  await authControlle.requireEmployeeId();
  const user = await authControlle.getEmployee();

  const settingsController = await new SettingsController(request);
  const generalSettings = await settingsController.getGeneralSettings();

  const orderController = await new OrderController(request);
  const order = await orderController.getOrder({ orderId: orderId as string });

  const paymentController = await new PaymentController(request);
  const payments = await paymentController.getOrderPayments({
    orderId: orderId as string,
  });

  return { user, order, generalSettings, payments };
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
