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
  useNavigation,
} from "@remix-run/react";

import Container from "~/components/Container";
import Input from "~/components/Input";
import SimpleSelect from "~/components/SimpleSelect";
import Spacer from "~/components/Spacer";
import AdminLayout from "~/components/layouts/AdminLayout";
import AdminController from "~/server/admin/AdminController.server";
import EmployeeController from "~/server/employee/EmployeeController.server";
import { Button } from "~/components/ui/button";

export default function ProductDetails() {
  let { user, employee } = useLoaderData();
  let actionData = useActionData();
  let navigation = useNavigation();

  let [isOpen, setIsOpen] = useState(false);
  function openModal() {
    setIsOpen(true);
  }
  function closeModal() {
    setIsOpen(false);
  }

  return (
    <AdminLayout user={user}>
      <div className="mb-3 flex">
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
        <Form method="POST" encType="multipart/form-data" className="w-full">
          <div className="flex w-full">
            <Input
              name="firstName"
              placeholder="First Name"
              label="First Name"
              type="text"
              value={employee?.firstName}
              defaultValue={actionData?.fields?.firstName}
              error={actionData?.errors?.firstName}
            />
            <Spacer />
            <Input
              name="middleName"
              placeholder="Middle Name"
              label="Middle Name"
              type="text"
              value={employee?.middleName}
              defaultValue={actionData?.fields?.middleName}
              error={actionData?.errors?.middleName}
            />
          </div>
          <Spacer />

          <div className="flex w-full">
            <Input
              name="lastName"
              placeholder="Last Name"
              label="Last Name"
              type="text"
              value={employee?.lastName}
              defaultValue={actionData?.fields?.lastName}
              error={actionData?.errors?.lastName}
            />
            <Spacer />
            <Input
              name="username"
              placeholder="Username "
              label="Username"
              type="text"
              value={employee?.username}
              defaultValue={actionData?.fields?.username}
              error={actionData?.errors?.username}
            />
          </div>
          <Spacer />

          <div className="flex w-full">
            <Input
              name="email"
              placeholder="Email"
              label="Email"
              type="text"
              value={employee?.email}
              defaultValue={actionData?.fields?.email}
              error={actionData?.errors?.email}
            />
            <Spacer />
            <Input
              name="role"
              placeholder="Role"
              label="Role"
              type="text"
              defaultValue={actionData?.fields?.role}
              error={actionData?.errors?.role}
            />
          </div>
          <Spacer />

          <div className="flex w-full">
            <Spacer />
            <SimpleSelect label="Gender" variant="ghost">
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </SimpleSelect>
          </div>
          <Spacer />

          <div className="flex items-center ">
            <Button
              type="submit"
              className="ml-auto"
              disabled={navigation.state === "submitting" ? true : false}
            >
              {navigation.state === "submitting" ? "Submitting..." : "Update"}
            </Button>
          </div>
        </Form>
      </Container>

      <Container heading="Password">
        <Form method="POST" encType="multipart/form-data" className="w-full">
          <div className="flex w-full">
            <Input
              name="password"
              placeholder="Password"
              label="Password"
              type="password"
              defaultValue={actionData?.fields?.password}
              error={actionData?.errors?.password}
            />
            <Spacer />
            <Input
              name="confirm_password"
              placeholder="Confirm Password"
              label="Confirm Password"
              type="password"
              defaultValue={actionData?.fields?.password}
              error={actionData?.errors?.password}
            />
          </div>
        </Form>
      </Container>

      <Container heading="Statistics">
        <p>employee specific stats</p>
      </Container>

      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50 " onClose={closeModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto ">
            <div className="flex min-h-full items-center justify-center p-4 text-center ">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all dark:bg-slate-900">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-bold leading-6 text-slate-900"
                  >
                    New Product
                  </Dialog.Title>
                  <div className="h-4"></div>

                  <Form method="POST" encType="multipart/form-data">
                    <Input
                      name="productId"
                      type="hidden"
                      defaultValue={employee._id}
                    />

                    <Input
                      name="image"
                      placeholder="Images"
                      accept="image/*"
                      label="Images"
                      type="file"
                      // multiple
                      defaultValue={actionData?.fields?.images}
                      error={actionData?.errors?.images}
                    />
                    <Spacer />

                    <div className="flex items-center ">
                      <Button
                        color="error"
                        type="button"
                        className="ml-auto mr-3"
                        onClick={closeModal}
                        variant="destructive"
                      >
                        Close
                      </Button>

                      <Button
                        type="submit"
                        disabled={
                          navigation.state === "submitting" ? true : false
                        }
                      >
                        {navigation.state === "submitting"
                          ? "Uploading..."
                          : "Upload"}
                      </Button>
                    </div>
                  </Form>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
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
      className="bg-red-300 dark:bg-red-500"
      contentClassName="flex-col grid grid-cols-2 gap-3"
    >
      <p>Something went wrong!</p>
    </Container>
  );
}
