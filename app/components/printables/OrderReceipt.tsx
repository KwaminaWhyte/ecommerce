import moment from "moment";
import React from "react";
import logo from "~/components/inc/logo.png";
import IdGenerator from "~/lib/IdGenerator";
import type { GeneralSettingsInterface, OrderInterface } from "~/server/types";

interface OrderReceiptProps {
  order: OrderInterface;
  generalSettings: GeneralSettingsInterface;
}

export const OrderReceipt = React.forwardRef<HTMLDivElement, OrderReceiptProps>(
  (props, ref) => {
    const { order, generalSettings } = props;

    return (
      <div
        className="print-font container mx-auto mt-10 p-5 rounded-lg hidden print:block"
        ref={ref}
      >
        <section className="text-center">
          {/* <img src={logo} alt="Shop Logo" className="mx-auto h-28 w-28" /> */}
          <h1 className="text-2xl font-semibold mt-2">
            {generalSettings?.businessName}
          </h1>
          <p className="text-slate-600">{generalSettings.address}</p>
        </section>

        <section className="mt-6 flex flex-col justify-between">
          <p>
            Cashier:{" "}
            <span className="font-semibold">
              {order?.cashier?.firstName} {order?.cashier?.lastName}
            </span>
          </p>
          <p>
            Order ID: <span className="font-semibold">{order?.orderId}</span>
          </p>
          {/* <p>
            Transaction ID: <span className="font-semibold">7890ABC</span>
          </p> */}
          <p className="">
            Date:{" "}
            <span className="font-semibold">
              {moment(order?.createdAt).format("MMM Do YYYY, h:mm a")}
            </span>
          </p>
        </section>

        <section className="mt-6">
          <h3 className="text-md font-semibold">Items:</h3>
          <ul className="mt-2">
            {order?.orderItems?.map((item) => (
              <li className="flex gap-5" key={IdGenerator()}>
                <span className="font-semibold w-11">{item?.quantity}</span>
                <span>{item?.product?.name}</span>
                <span>
                  - GH₵{" "}
                  {item?.stock ? item?.stock?.price : item?.product?.price} each
                </span>
                <span className="font-semibold ml-auto">
                  GH₵{" "}
                  {item?.quantity *
                    (item?.stock ? item?.stock?.price : item?.product?.price)}
                </span>
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-3 flex items-center  justify-between">
          <h3 className="text-md font-semibold">Total Amount:</h3>
          <p className="text-md font-semibold"> GH₵ {order?.totalPrice}</p>
        </section>
      </div>
    );
  }
);

OrderReceipt.displayName = "OrderReceipt";
