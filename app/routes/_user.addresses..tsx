import type { MetaFunction, LoaderFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import LinkButton from "~/components/LinkButton";
import UserDetailLayout from "~/components/layouts/UserDetailLayout";
import UserController from "~/server/user/UserController.server";

export default function UserOrders() {
  let { addresses } = useLoaderData<{
    addresses: {
      _id: string;
      location: string;
      city: string;
      street: string;
      address: string;
      title: string;
    }[];
  }>();

  return (
    <UserDetailLayout title="Addresses" className="">
      <LinkButton to="/new_address" variant="outline" className="text-center">
        New Address
      </LinkButton>
      {addresses.map((address) => (
        <div
          key={address?._id}
          className="border border-slate-300 dark:border-slate-400 rounded-xl p-3 bg-white dark:bg-black"
        >
          <div className="flex items-center">
            <p className="h-6 w-6 bg-red-500 rounded-full mr-2"></p>
            <p className="font-bold text-base">{address?.title}</p>
          </div>
          <div className="ml-8">
            <p>{address?.address}</p>
            <p>+233 248048753</p>
          </div>
        </div>
      ))}
    </UserDetailLayout>
  );
}

export const meta: MetaFunction = () => {
  return [
    { title: "ComClo - Delivery Addresses" },
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

export const loader: LoaderFunction = async ({ request }) => {
  const userController = await new UserController(request);
  const user = await userController.getUser();
  const addresses = await userController.getUserAddresses();
  // const paymentDetailsController = await new PaymentDetailsController(request);

  // await userController.requireUserId();
  // const details = await paymentDetailsController.getUserPaymentDetails({
  //   user: user?._id,
  // });
  return { user, addresses };
};
