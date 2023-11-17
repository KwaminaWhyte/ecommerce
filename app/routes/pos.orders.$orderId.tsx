import { Popover } from "@headlessui/react";
import {
  type ActionFunction,
  json,
  type LoaderFunction,
  unstable_composeUploadHandlers as composeUploadHandlers,
  unstable_createMemoryUploadHandler as createMemoryUploadHandler,
  unstable_parseMultipartFormData as parseMultipartFormData,
  type UploadHandler,
  type MetaFunction,
} from "@remix-run/node";

import {
  Link,
  useActionData,
  useLoaderData,
  useNavigation,
} from "@remix-run/react";
import { useEffect, useState } from "react";
import Container from "~/components/Container";
import ItemStatus from "~/components/ItemStatus";
import PosLayout from "~/components/layouts/PosLayout";
import EmployeeAuthController from "~/modules/employee/EmployeeAuthController";
import OrderController from "~/modules/order/OrderController.server";
import type { OredrInterface, UserInterface } from "~/modules/types";

export default function AdminOrderDetails() {
  let { user, order } = useLoaderData<{
    order: OredrInterface;
    user: UserInterface;
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
    // setActiveImage(product?.images[0]);
  }, []);

  return (
    <PosLayout user={user}>
      <div className="mb-3 flex">
        <h1 className="text-3xl font-bold">Order Details </h1>
      </div>

      <div className="flex gap-3">
        <Container
          heading="Pacakge"
          contentClassName="flex-col"
          className="w-[60%]"
        >
          <div className="flex items-center border-b border-slate-400 py-5">
            <p className="mr-5 text-base font-semibold">{order.orderId}</p>

            <p
              className={`w-fit rounded-xl px-2 py-1 capitalize ${
                order.status == "rejected"
                  ? "bg-red-500/40 text-red-800 dark:text-white"
                  : order.status == "completed"
                  ? "bg-green-500/40 text-green-800 dark:text-white"
                  : order.status == "to ship"
                  ? "bg-blue-500/40 text-blue-800 dark:text-white"
                  : order.status == "shipping"
                  ? "bg-pink-500/40 text-pink-800 dark:text-white"
                  : order.status == "pending"
                  ? "bg-yellow-500/40 text-yellow-800 dark:text-white"
                  : "bg-slate-500/40 text-slate-800 dark:text-white"
              }`}
            >
              {order?.status}
            </p>

            <Popover className="relative ml-4">
              <Popover.Button className="focus:outline-none">
                <ItemStatus status={order?.deliveryStatus} />
              </Popover.Button>

              <Popover.Panel className="absolute z-10 ">
                <div className="flex w-28 flex-col gap-3 rounded-md bg-white p-3 shadow-sm dark:bg-slate-900 dark:text-white">
                  <Link className="px-2" to="/engagement">
                    Pending
                  </Link>
                  <Link className="px-2" to="/analytics">
                    Completed
                  </Link>
                  <Link className="px-2" to="/security">
                    Shipping
                  </Link>
                  <Link className="px-2" to="/security">
                    To Ship
                  </Link>
                  <Link className="px-2" to="/security">
                    Rejected
                  </Link>
                </div>
              </Popover.Panel>
            </Popover>
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
                    key={item?._id}
                    className="cursor-pointer rounded-xl hover:rounded-xl hover:bg-white hover:shadow-sm dark:border-slate-400 dark:bg-slate-800 dark:hover:bg-slate-600"
                  >
                    <td className="px-3 py-3">
                      <img
                        src={item.product.images[0].url}
                        className="h-20 w-20 rounded-md object-cover"
                        alt=""
                      />
                    </td>
                    <td
                      scope="row"
                      className="px-3 py-3 font-medium text-slate-900 dark:text-white"
                    >
                      {item.product?.name}
                    </td>
                    <td className="px-3 py-3">{item.quantity}</td>
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
                {order?.paymentInfo?.createdAt}
              </p>
            </div>

            <div className="mb-2">
              <p className="font-medium">Tracking #</p>
              <p className="text-slate-500 dark:text-slate-400">
                {order?.paymentInfo?.id}
              </p>
            </div>

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

            <div className="mb-2">
              <p className="font-medium">Shipping Charge</p>
              <p className="text-slate-500 dark:text-slate-400">
                $ {order?.shippingPrice}
              </p>
            </div>

            <div className="mb-2">
              <p className="font-medium">Status</p>
              <p className="text-slate-500 dark:text-slate-400">
                {order?.paymentInfo?.status}
              </p>
            </div>
          </Container>

          <Container
            heading="Shipment Timeline"
            contentClassName="flex-col gap-4"
          >
            {[0, 1, 2, 3].map((line) => (
              <div key={line} className="mt-4 flex w-full">
                <p className="mr-2 h-8 w-8 rounded-full bg-blue-600"></p>
                <div>
                  <p className="font-medium">5:23 PM, Monday, 03 June, 2023</p>
                  <p>Delivered Devilered to receipient at FedEx Facility</p>
                  <p className="text-slate-700 dark:text-slate-200">Accra</p>
                </div>
              </div>
            ))}
            <Link to="/">Show more</Link>
          </Container>
        </section>
      </div>

      {/* <div className="flex gap-4 overflow-x-auto shadow-sm">
        <section className="w-1/2">
          <img
            style={{ height: "35vw" }}
            src={activeImage.url}
            className="w-full rounded-lg object-cover"
            alt=""
          />

          <div className="mt-3 flex flex-wrap justify-between p-1">
            {product.images.map((image: ProductImageInterface) => (
              <img
                key={image._id}
                onClick={() => setActiveImage(image)}
                src={image.url}
                className={`h-20 w-20 rounded-md object-cover ${
                  image._id == activeImage?._id
                    ? "ring-1 ring-blue-500 ring-offset-2"
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
      </div> */}
    </PosLayout>
  );
}

export const meta: MetaFunction = ({ data }) => {
  let { order } = data;

  return [
    { title: `ComClo - Order Details | ${order?.orderId} ` },
    {
      description: "the best shopping site",
    },
  ];
};

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();

  // if (formData.get("deleteId") != null) {
  //   deleteProduct(formData.get("deleteId") as string);
  //   return true;
  // } else {

  if (Object.values(errors).some(Boolean)) {
    return json({ errors, fields: { imgSrc } }, { status: 400 });
  }

  // return { name, price, description, imgSrc };
  return await addProductImage(productId, imgSrc);
  // }
};

export const loader: LoaderFunction = async ({ request, params }) => {
  const { orderId } = params;

  const authControlle = await new EmployeeAuthController(request);
  await authControlle.requireEmployeeId();
  const user = await authControlle.getEmployee();

  const orderController = await new OrderController(request);
  const order = await orderController.getOrder({ orderId: orderId as string });
  return { user, order };
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
