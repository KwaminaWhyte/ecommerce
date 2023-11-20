import moment from "moment";
import React from "react";
import logo from "~/components/inc/logo.png";
import { type OredrInterface } from "~/server/types";

export const OrderReceipt = React.forwardRef<HTMLDivElement>((props, ref) => {
  const { order, generalSettings } = props;

  return (
    <div
      className="container mx-auto mt-10 p-5 border rounded-lg shadow-lg hidden print:block"
      ref={ref}
    >
      <div className="text-center">
        <img src={logo} alt="Shop Logo" className="mx-auto h-28 w-28" />
        <h1 className="text-2xl font-semibold mt-2">
          {generalSettings?.businessName}
        </h1>
        <p className="text-slate-600">123 Main Street, City, Zip Code</p>
      </div>

      <div className="mt-6">
        <h2 className="text-lg font-semibold">Order Receipt</h2>
        <div className="flex justify-between mt-3">
          <p>
            Order ID: <span className="font-semibold">{order?.orderId}</span>
          </p>
          <p>
            Transaction ID: <span className="font-semibold">7890ABC</span>
          </p>
        </div>
        <p className="mt-3">
          Date:{" "}
          <span className="font-semibold">
            {moment(order?.createdAt).format("MMM Do YYYY, h:mm a")}
          </span>
        </p>
      </div>

      <div className="mt-6">
        <h3 className="text-md font-semibold">Items:</h3>
        <ul className="mt-2">
          {order?.orderItems?.map((item) => (
            <li className="flex justify-between" key={item?._id}>
              <span>{item?.product?.name}</span>
              <span className="font-semibold">Quantity: {item?.quantity}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-6">
        <h3 className="text-md font-semibold">Total Amount:</h3>
        <p className="mt-2 text-xl font-semibold">${order?.totalPrice}</p>
      </div>

      <div className="mx-auto mt-5"></div>
    </div>
  );
});

OrderReceipt.displayName = "OrderReceipt";
