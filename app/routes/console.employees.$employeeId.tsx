import { Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
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
  Form,
  useActionData,
  useLoaderData,
  useNavigate,
  useNavigation,
} from "@remix-run/react";

import Container from "~/components/Container";
import SimpleSelect from "~/components/SimpleSelect";
import Spacer from "~/components/Spacer";
import AdminLayout from "~/components/layouts/AdminLayout";
import AdminController from "~/server/admin/AdminController.server";
import EmployeeController from "~/server/employee/EmployeeController.server";
import { Button } from "~/components/ui/button";
import type { AdminInterface, EmployeeInterface } from "~/server/types";
import { Label } from "~/components/ui/label";
import { Input } from "~/components/ui/input";

export default function ProductDetails() {
  let { user, employee } = useLoaderData<{
    user: AdminInterface;
    employee: EmployeeInterface;
  }>();
  let actionData = useActionData();
  let navigation = useNavigation();
  const navigate = useNavigate();

  let [isOpen, setIsOpen] = useState(false);
  function openModal() {
    setIsOpen(true);
  }
  function closeModal() {
    setIsOpen(false);
  }

  return (
    <AdminLayout user={user} className="gap-4">
      <div className="mb-3 flex items-center">
        <div
          className="border border-gray-400 rounded-sm p-1 mr-3"
          onClick={() => navigate(-1)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-7 h-7 text-gray-500 hover:text-gray-700 cursor-pointer"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 19.5L8.25 12l7.5-7.5"
            />
          </svg>
        </div>
        <h1 className="text-3xl font-bold">Employee Details</h1>

        <section className="ml-auto flex">
          {/* <Button variant="outline">Export</Button> */}
          <Spacer />
          {/* <Button variant="outline">Print</Button> */}
          <Spacer />
          {/* {product.images.length < 5 ? (
            <Button onClick={() => openModal()}> + Add Image</Button>
          ) : null} */}
        </section>
      </div>

      <Container heading="Profile">
        <Form
          method="POST"
          encType="multipart/form-data"
          className="w-full grid grid-cols-2 gap-4"
        >
          <div className="grid w-full  items-center gap-1.5">
            <Label htmlFor="firstName">First Name</Label>
            <Input
              id="firstName"
              type="text"
              name="firstName"
              required
              defaultValue={employee?.firstName}
            />
          </div>

          <div className="grid w-full  items-center gap-1.5">
            <Label htmlFor="lastName">Last Name</Label>
            <Input
              id="lastName"
              type="text"
              name="lastName"
              required
              defaultValue={employee?.lastName}
            />
          </div>

          <div className="grid w-full  items-center gap-1.5">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              type="text"
              name="username"
              required
              defaultValue={employee?.username}
            />
          </div>

          <div className="grid w-full  items-center gap-1.5">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              name="email"
              required
              defaultValue={employee?.email}
            />
          </div>

          {/* <Input
            name="role"
            placeholder="Role"
            label="Role"
            type="text"
            defaultValue={actionData?.fields?.role}
            error={actionData?.errors?.role}
          /> */}
          {/* 
          <SimpleSelect label="Gender" variant="ghost">
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </SimpleSelect> */}

          <div className="flex items-center ">
            <Button
              type="submit"
              className="ml-auto"
              disabled={navigation.state === "submitting" ? true : false}
            >
              Update
            </Button>
          </div>
        </Form>
      </Container>

      <Container heading="Password">
        <Form method="POST" encType="multipart/form-data" className="w-full">
          <div className="flex w-full gap-3">
            <div className="grid w-full  items-center gap-1.5">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" name="password" required />
            </div>

            <div className="grid w-full  items-center gap-1.5">
              <Label htmlFor="confirm_password">Confirm Password</Label>
              <Input
                id="confirm_password"
                type="confirm_password"
                name="confirm_password"
                required
              />
            </div>
          </div>

          <div className="flex items-center mt-3">
            <Button
              type="submit"
              className="ml-auto"
              disabled={navigation.state === "submitting" ? true : false}
            >
              Change Password
            </Button>
          </div>
        </Form>
      </Container>
      {/* 
      <Container heading="Statistics">
        <p>employee specific stats</p>
      </Container> */}
    </AdminLayout>
  );
}

export const meta: MetaFunction = ({ data }) => {
  let { employee } = data;

  return [
    { title: `ComClo - Employee | ${employee.username} ` },
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
  // const formData = await request.formData();

  // if (formData.get("deleteId") != null) {
  //   deleteProduct(formData.get("deleteId") as string);
  //   return true;
  // } else {
  const uploadHandler: UploadHandler = composeUploadHandlers(
    async ({ name, data }) => {
      if (name !== "image") {
        return undefined;
      }

      const uploadedImage: { secure_url: string; asset_id: string } =
        (await uploadImage(data)) as { secure_url: string; asset_id: string };

      return uploadedImage?.secure_url + "|" + uploadedImage.asset_id;
    },
    createMemoryUploadHandler()
  );

  const formDataI = await parseMultipartFormData(request, uploadHandler);
  const imgSrc = formDataI.get("image") as string;
  if (!imgSrc) {
    return json({ error: "something wrong" });
  }

  if (typeof imgSrc !== "string") {
    return json({ error: "Invalid image" }, { status: 400 });
  }
  const productId = formDataI.get("productId") as string;

  const errors = {
    name: validateName(imgSrc),
  };

  if (Object.values(errors).some(Boolean)) {
    return json({ errors, fields: { imgSrc } }, { status: 400 });
  }

  // return { name, price, description, imgSrc };
  return await addProductImage(productId, imgSrc);
  // }
};

export const loader: LoaderFunction = async ({ request, params }) => {
  let { employeeId } = params;

  const adminController = await new AdminController(request);
  await adminController.requireAdminId();
  const user = await adminController.getAdmin();

  const employeesController = await new EmployeeController(request);
  const employee = await employeesController.getEmployee(employeeId as string);

  return { user, employee };
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
