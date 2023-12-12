import { Link, type SubmitFunction } from "@remix-run/react";
import moment from "moment";
import type { OrderInterface } from "~/server/types";
import ItemStatus from "./ItemStatus";
import IdGenerator from "~/lib/IdGenerator";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Button } from "./ui/button";

const OrderCard = ({
  order,
  root_path,
  submit,
}: {
  order: OrderInterface;
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
          <Popover>
            <PopoverTrigger asChild>
              <p
                variant="outline"
                className="w-fit rounded-xl bg-slate-200 border px-2 py-1 hover:border-slate-400 text-slate-800 dark:bg-slate-700 dark:text-white"
              >
                {order.orderItems?.length} Items
              </p>
            </PopoverTrigger>
            <PopoverContent className="w-96">
              <div className="relative grid gap-3 dark:bg-slate-800">
                {order.orderItems?.map((item) => (
                  <div
                    key={IdGenerator(8)}
                    className="flex items-center space-x-4"
                  >
                    <img
                      className="h-14 w-14 flex-none rounded-lg bg-slate-100 object-cover"
                      src={item?.product?.images[0]?.url}
                      alt=""
                    />
                    <div className="flex-auto flex flex-col gap-1">
                      <div className="flex flex-wrap">
                        <h3 className="flex-auto font-semibold dark:text-white">
                          {item?.product?.name}
                        </h3>
                        <p className="text-slate-500 dark:text-slate-400">
                          {item?.quantity} x GH₵ {item?.stock?.price}
                        </p>
                      </div>
                      <p className="text-slate-500 dark:text-slate-400 line-clamp-1">
                        {item?.product?.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </PopoverContent>
          </Popover>
        ) : (
          <p className="text-slate-900 dark:text-white">
            {order.orderItems[0]?.product.name}
            {/* x {" "} */}
            {/* {order?.orderItems[0]?.stock.price} */}
          </p>
        )}
      </th>
      {/* <td className="px-3 py-3 text-slate-900 dark:text-white">
        {order?.user?.firstName} {order?.user?.lastName}
      </td> */}

      <td className="px-3 py-3 capitalize">
        <ItemStatus status={order?.paymentStatus} />
      </td>
      {/* <td className="px-3 py-3 capitalize">
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
      </td> */}

      <td className="px-3 py-3 ">GH₵ {order?.amountPaid}</td>
      <td className="px-3 py-3 font-medium text-slate-900 dark:text-white">
        GH₵ {order?.totalPrice}
      </td>
      <td className="px-3 py-3">
        {moment(order?.createdAt).format("MMM Do YYYY, h:mm a")}
      </td>
      <td className="px-3 py-3 text-right">
        <Link
          to={`/${root_path}/orders/${order?._id}`}
          className="tansition-all rounded-sm bg-purple-600 p-2 text-white shadow-sm duration-300 hover:bg-purple-700 focus:outline-none"
        >
          View
        </Link>
      </td>
    </tr>
  );
};
export default OrderCard;
