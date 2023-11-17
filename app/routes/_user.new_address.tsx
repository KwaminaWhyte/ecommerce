import {
  type MetaFunction,
  type LoaderFunction,
  type ActionFunction,
  json,
} from "@remix-run/node";
import { Form, useActionData, useNavigation } from "@remix-run/react";

import Input from "~/components/Input";
import Spacer from "~/components/Spacer";
import UserDetailLayout from "~/components/layouts/UserDetailLayout";
import { Button } from "~/components/ui/button";
import UserController from "~/modules/user/UserController.server";

export default function UserOrders() {
  const data = useActionData();
  const navigation = useNavigation();

  return (
    <UserDetailLayout title="New Address" className="">
      <Form method="POST">
        <Input
          name="title"
          placeholder="Title"
          label="Title"
          type="text"
          defaultValue={data?.fields?.title}
          error={data?.errors?.title}
        />
        <Spacer />

        <Input
          name="address"
          placeholder="Address"
          label="Address"
          type="text"
          defaultValue={data?.fields?.address}
          error={data?.errors?.address}
        />
        <Spacer />

        <Input
          name="city"
          placeholder="City"
          label="City"
          type="text"
          defaultValue={data?.fields?.city}
          error={data?.errors?.city}
        />
        <Spacer />

        <div className="flex flex-col items-center justify-between">
          <Button
            className="ml-auto"
            type="submit"
            variant="ghost"
            disabled={navigation.state === "submitting" ? true : false}
          >
            {navigation.state === "submitting" ? "Submitting..." : "Save"}
          </Button>
        </div>
      </Form>
    </UserDetailLayout>
  );
}

export const meta: MetaFunction = () => {
  return [
    { title: "ComClo - New Address" },
    {
      description: "the best shopping site",
    },
  ];
};

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  let address = formData.get("address");
  let city = formData.get("city");
  let title = formData.get("title");

  if (
    typeof address !== "string" ||
    typeof city !== "string" ||
    typeof title !== "string"
  ) {
    return json({ error: "Invalid address or city" }, { status: 400 });
  }

  const userController = await new UserController(request);
  return await userController.addUserAddress({ address, city, title });
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
