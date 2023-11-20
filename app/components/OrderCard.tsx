import { Popover } from "@headlessui/react";
import { Link, type SubmitFunction } from "@remix-run/react";
import moment from "moment";
import type { OredrInterface } from "~/server/types";
import ItemStatus from "./ItemStatus";

const OrderCard = ({
  order,
  root_path,
  submit,
}: {
  order: OredrInterface;
  root_path: string;
  submit: SubmitFunction;
}) => {
  return (
    <tr className="cursor-pointer text-sm rounded-xl hover:rounded-xl hover:bg-slate-50 hover:shadow-md dark:border-slate-400 dark:bg-slate-800 dark:hover:bg-slate-600">
      {/* <td className="px-3 py-3">
        <input type="checkbox" name="" id="" />
      </td> */}
      <td className="px-3 py-3 font-semibold text-black dark:text-white">
        {order.orderId}
      </td>
      <th
        scope="row"
        className="px-3 py-3 font-medium text-slate-900 dark:text-white"
      >
        {order.orderItems?.length > 1 ? (
          <Popover className="relative">
            <Popover.Button className="focus:outline-none">
              <p className="w-fit rounded-xl bg-slate-200 border px-2 py-1 hover:border-slate-400 text-slate-800 dark:bg-slate-700 dark:text-white">
                {order.orderItems?.length} Items
              </p>
            </Popover.Button>
            <Popover.Panel className="absolute z-10 w-96">
              <div className="overflow-hidden rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5 dark:bg-slate-800">
                <div className="relative grid gap-3 bg-white px-3 py-4 dark:bg-slate-800 sm:gap-8 sm:p-8">
                  {order.orderItems?.map((item) => (
                    <div
                      key={item?._id}
                      className="flex items-center space-x-4"
                    >
                      <img
                        className="h-16 w-16 flex-none rounded-lg bg-slate-100 object-cover"
                        src={item?.product.images[0].url}
                        alt=""
                      />
                      <div className="flex-auto">
                        <div className="flex flex-wrap">
                          <h3 className="flex-auto text-lg font-medium dark:text-white">
                            {item?.product.name}
                          </h3>
                          <p className="text-sm text-slate-500 dark:text-slate-400">
                            {item?.quantity} x {item?.product.price}
                          </p>
                        </div>
                        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400 line-clamp-1">
                          {item?.product.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Popover.Panel>
          </Popover>
        ) : (
          <p className="text-slate-900 dark:text-white">
            {order.orderItems[0]?.product.name}
          </p>
        )}
      </th>
      <td className="px-3 py-3 text-slate-900 dark:text-white">
        {order?.user?.firstName} {order?.user?.lastName}
      </td>

      <td className="px-3 py-3 capitalize">
        <ItemStatus status={order?.status} />
      </td>
      <td className="px-3 py-3 capitalize">
        <Popover className="relative">
          <Popover.Button className="focus:outline-none">
            <ItemStatus status={order?.deliveryStatus} />
          </Popover.Button>

          <Popover.Panel className="absolute z-10 border border-slate-300 shadow-lg rounded-lg">
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
                  }}
                  className="p-2 hover:bg-slate-200 dark:hover:bg-black rounded-lg cursor-pointer"
                >
                  {status.label}
                </p>
              ))}
            </div>
          </Popover.Panel>
        </Popover>
      </td>
      <td className="px-3 py-3">
        {moment(order?.createdAt).format("MMM Do YYYY, h:mm a")}
      </td>
      <td className="px-3 py-3 ">
        {moment(order?.deliveryDate).format("MMM Do YYYY, h:mm a")}
      </td>
      <td className="px-3 py-3 font-medium text-slate-900 dark:text-white">
        $ {order?.totalPrice}
      </td>
      <td className="px-3 py-3 text-right">
        <Link
          to={`/${root_path}/orders/${order?._id}`}
          className="font-sm tansition-all rounded-lg bg-blue-600 px-2 py-1 text-white shadow-sm duration-300 hover:bg-blue-700 focus:outline-none"
        >
          View
        </Link>
      </td>
    </tr>
  );
};
export default OrderCard;
