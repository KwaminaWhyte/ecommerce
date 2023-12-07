import { Fragment, useEffect, useState } from "react";
import { Transition, Dialog, Popover } from "@headlessui/react";
import {
  type ActionFunction,
  json,
  type LoaderFunction,
  type MetaFunction,
} from "@remix-run/node";
import {
  Form,
  Link,
  useActionData,
  useLoaderData,
  useNavigation,
} from "@remix-run/react";

import Input from "~/components/Input";
import SimpleSelect from "~/components/SimpleSelect";
import Spacer from "~/components/Spacer";
import AdminLayout from "~/components/layouts/AdminLayout";
import DeleteModal from "~/components/modals/DeleteModal";
import AdminController from "~/server/admin/AdminController.server";
import EmployeeController from "~/server/employee/EmployeeController.server";
import {
  validateEmail,
  validatePassword,
  validateUsername,
} from "~/server/validators.server";
import Container from "~/components/Container";
import type { EmployeeInterface } from "~/server/types";
import { Pagination, PaginationItem } from "@mui/material";
import { Button } from "~/components/ui/button";

export default function Employees() {
  let { user, employees, totalPages, page } = useLoaderData();
  let actionData = useActionData();
  let navigation = useNavigation();

  const [deleteId, setDeleteId] = useState(null);
  const [selectedEmmployee, setSelectedEmmployee] = useState(null);

  let [isOpen, setIsOpen] = useState(false);
  let [isOpenDelete, setIsOpenDelete] = useState(false);

  function closeModal() {
    setIsOpen(false);
    setSelectedEmmployee(null);
  }

  function closeDeleteModal() {
    setIsOpenDelete(false);
    setSelectedEmmployee(null);
  }
  function openModal() {
    setIsOpen(true);
  }

  function openDeleteModal() {
    setIsOpenDelete(true);
  }

  let handleDelete = (id) => {
    setDeleteId(id);
    openDeleteModal();
  };

  useEffect(() => {
    setIsOpen(false);
    setIsOpenDelete(false);
  }, [employees]);

  return (
    <AdminLayout user={user}>
      <div className="flex">
        <h1 className="text-3xl font-bold">Employees </h1>

        <section className="ml-auto flex">
          {/* <Button variant="outline">Export</Button> */}
          <Spacer />
          {/* <Button variant="outline">Print</Button> */}
          <Spacer />
          <Button onClick={() => openModal()}> + New Employee</Button>
        </section>
      </div>

      <div className="my-3 flex rounded-lg bg-slate-50 p-2 dark:bg-slate-900">
        <Input type="search" placeholder="Search anything..." name="term" />
        <Spacer />

        <SimpleSelect name="status" variant="ghost">
          <option value="">Select Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </SimpleSelect>
      </div>

      <div className="relative shadow-sm bg-white dark:bg-slate-700 rounded-xl pb-2">
        <table className="w-full text-left text-slate-500 dark:text-slate-400">
          <thead className=" uppercase text-slate-700 dark:text-slate-400 ">
            <tr>
              <th scope="col" className="px-3 py-3">
                Username
              </th>
              <th scope="col" className="px-3 py-3">
                Name
              </th>
              <th scope="col" className="px-3 py-3">
                Email
              </th>
              {/* <th scope="col" className="px-3 py-3">
                Gender
              </th> */}
              <th scope="col" className="px-3 py-3">
                Role
              </th>
              <th scope="col" className="px-3 py-3">
                Status
              </th>
              <th scope="col" className="px-3 py-3">
                <span className="sr-only">Action</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {employees.map((employee: EmployeeInterface) => (
              <tr
                key={employee?._id}
                className="cursor-pointer hover:bg-slate-50 hover:shadow-md dark:border-slate-400 dark:bg-slate-800 dark:hover:bg-slate-600"
              >
                <th
                  scope="row"
                  className=" px-3 py-3 font-medium text-slate-900 dark:text-white"
                >
                  {employee.username}
                </th>

                <td className="px-3 py-3">
                  {employee.firstName} {employee.lastName}
                </td>
                <td className="px-3 py-3 ">{employee?.email}</td>
                {/* <td className="px-3 py-3 ">{employee?.gender}</td> */}
                <td className="px-3 py-3 capitalize">{employee?.role}</td>
                <td className="px-3 py-3">
                  <p
                    className={` w-fit  rounded-xl px-2 py-1 capitalize ${
                      employee.status == "inactive"
                        ? "bg-red-500/40 text-red-800 dark:bg-red-400 dark:text-white"
                        : employee.status == "active"
                        ? "bg-green-500/40 text-green-800 dark:bg-green-600 dark:text-white"
                        : employee.status == "To Ship"
                    }`}
                  >
                    {employee?.status}
                  </p>
                </td>

                <td className="gap-1 px-3 py-3">
                  <Popover className="relative">
                    <Popover.Button className="font-sm tansition-all rounded-lg bg-purple-600 px-2 py-1  text-white shadow-sm duration-300 hover:bg-purple-700 focus:outline-none">
                      Actions
                    </Popover.Button>

                    <Popover.Panel className="absolute right-6 z-10">
                      <div className="flex flex-col gap-2 rounded-lg bg-white p-3 dark:bg-slate-900">
                        <Link
                          to={`/console/employees/${employee._id}`}
                          className="font-sm tansition-all w-32 rounded-lg bg-purple-600 px-2 py-2 text-center  text-white shadow-sm duration-300 hover:bg-purple-700 focus:outline-none"
                        >
                          View
                        </Link>
                        <Button
                          variant="outline"
                          type="button"
                          color="primary"
                          onClick={() => {
                            openModal();
                            setSelectedEmmployee(employee);
                          }}
                        >
                          Update
                        </Button>
                        <Button
                          variant="destructive"
                          type="button"
                          color="error"
                          onClick={() => handleDelete(employee._id)}
                        >
                          Delete
                        </Button>
                      </div>
                    </Popover.Panel>
                  </Popover>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-11 flex w-full items-center justify-center">
        <Pagination
          color="primary"
          variant="outlined"
          shape="rounded"
          page={page}
          count={totalPages}
          renderItem={(item) => (
            <PaginationItem
              component={Link}
              to={`/console/orders${
                item.page === 1 ? "" : `?page=${item.page}`
              }`}
              {...item}
            />
          )}
        />
      </div>

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
                    {selectedEmmployee ? "Update Employee" : "New Employee"}
                  </Dialog.Title>
                  <div className="h-4"></div>

                  <Form method="POST" encType="multipart/form-data">
                    {selectedEmmployee ? (
                      <input
                        type="hidden"
                        name="_id"
                        value={selectedEmmployee._id}
                      />
                    ) : null}

                    <Input
                      name="firstName"
                      placeholder="First Name"
                      label="First Name"
                      type="text"
                      required
                      defaultValue={
                        actionData?.fields
                          ? actionData?.fields?.firstName
                          : selectedEmmployee?.firstName
                      }
                      error={actionData?.errors?.firstName}
                    />
                    <Spacer />

                    <Input
                      name="lastName"
                      placeholder="Last Name"
                      label="Last Name"
                      type="text"
                      required
                      defaultValue={
                        actionData?.fields
                          ? actionData?.fields?.lastName
                          : selectedEmmployee?.lastName
                      }
                      error={actionData?.errors?.lastName}
                    />
                    <Spacer />
                    <Input
                      name="username"
                      placeholder="Username "
                      label="Username"
                      required
                      type="text"
                      defaultValue={
                        actionData?.fields
                          ? actionData?.fields?.username
                          : selectedEmmployee?.username
                      }
                      error={actionData?.errors?.username}
                    />
                    <Spacer />
                    <Input
                      name="email"
                      placeholder="Email"
                      label="Email"
                      type="text"
                      required
                      defaultValue={
                        actionData?.fields
                          ? actionData?.fields?.email
                          : selectedEmmployee?.email
                      }
                      error={actionData?.errors?.email}
                    />
                    <Spacer />

                    {selectedEmmployee ? null : (
                      <>
                        <Input
                          name="password"
                          placeholder="Password"
                          label="Password"
                          required
                          type="password"
                          defaultValue={actionData?.fields?.password}
                        />
                        <Spacer />
                      </>
                    )}

                    <SimpleSelect
                      label="Role"
                      name="role"
                      defaultValue={
                        actionData?.fields
                          ? actionData?.fields?.role
                          : selectedEmmployee?.role
                      }
                      color="secondary"
                      variant="ghost"
                    >
                      <option value="">Select Role</option>
                      <option value="cashier">Cashier</option>
                      <option value="attendant">Attendant</option>
                      <option value="sales_person">Sales Person</option>
                    </SimpleSelect>

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
                        {selectedEmmployee ? "Update" : "Add"}
                      </Button>
                    </div>
                  </Form>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>

      <DeleteModal
        id={deleteId}
        title="Delete Employee"
        description="Are you sure you want to delete this employee?"
        isOpen={isOpenDelete}
        closeModal={closeDeleteModal}
      />
    </AdminLayout>
  );
}

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const employeesController = await new EmployeeController(request);

  if (formData.get("deleteId") != null) {
    await employeesController.deleteEmployee(
      formData.get("deleteId") as string
    );
    return true;
  }

  const username = formData.get("username") as string;
  const firstName = formData.get("firstName") as string;
  const lastName = formData.get("lastName") as string;
  const middleName = formData.get("middleName") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const role = formData.get("role") as string;
  const gender = formData.get("gender") as string;

  if (typeof username !== "string" || typeof email !== "string") {
    return json({ error: "Invalid username or email" }, { status: 400 });
  }

  if (formData.get("_id") != null) {
    return await employeesController.updateEmployee({
      firstName,
      middleName,
      lastName,
      email,
      username,
      role,
      gender,
      _id: formData.get("_id") as string,
    });
  }

  const errors = {
    username: validateUsername(username),
    email: validateEmail(email),
    password: validatePassword(password),
  };

  if (Object.values(errors).some(Boolean)) {
    return json(
      {
        errors,
        fields: {
          username,
          email,
          firstName,
          middleName,
          lastName,
          gender,
          role,
        },
      },
      { status: 400 }
    );
  }

  return await employeesController.createEmployee({
    firstName,
    middleName,
    lastName,
    email,
    username,
    password,
    role,
    gender,
  });
};

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  const page = parseInt(url.searchParams.get("page") as string) || 1;

  const adminController = await new AdminController(request);
  await adminController.requireAdminId();
  const user = await adminController.getAdmin();

  const employeesController = await new EmployeeController(request);
  const { employees, totalPages } = await employeesController.getEmployees({
    page,
  });

  return { user, employees, totalPages, page };
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

export const meta: MetaFunction = () => {
  return [
    { title: "ComClo - Employees" },
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
