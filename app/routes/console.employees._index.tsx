import { useEffect, useState } from "react";
import {
  type ActionFunction,
  type LoaderFunction,
  type MetaFunction,
} from "@remix-run/node";
import { Form, Link, useLoaderData, useNavigation } from "@remix-run/react";

import AdminLayout from "~/components/layouts/AdminLayout";
import DeleteModal from "~/components/modals/DeleteModal";
import AdminController from "~/server/admin/AdminController.server";
import EmployeeController from "~/server/employee/EmployeeController.server";
import Container from "~/components/Container";
import type { AdminInterface, EmployeeInterface } from "~/server/types";
import { Pagination, PaginationItem } from "@mui/material";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Label } from "~/components/ui/label";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";

export default function Employees() {
  let { user, employees, totalPages, page } = useLoaderData<{
    user: AdminInterface;
    employees: EmployeeInterface[];
    totalPages: number;
    page: number;
  }>();
  let navigation = useNavigation();

  const [deleteId, setDeleteId] = useState(null);
  const [selectedEmmployee, setSelectedEmmployee] = useState(null);
  const [showAddModel, setShowAddModel] = useState(false);
  const [showUpdateModel, setShowUpdateModel] = useState(false);

  let [isOpenDelete, setIsOpenDelete] = useState(false);

  function closeDeleteModal() {
    setIsOpenDelete(false);
    setSelectedEmmployee(null);
  }

  function openDeleteModal() {
    setIsOpenDelete(true);
  }

  let handleDelete = (id) => {
    setDeleteId(id);
    openDeleteModal();
  };

  useEffect(() => {
    setIsOpenDelete(false);
    setShowAddModel(false);
    setShowUpdateModel(false);
  }, [employees]);

  return (
    <AdminLayout user={user}>
      <section className="mb-3 flex items-center gap-3">
        <h1 className="text-3xl font-bold">Employees </h1>

        <div className=" flex items-center gap-3 ml-auto">
          <Form
            method="GET"
            className="ml-auto flex items-center gap-3 rounded-lg bg-slate-50 p-2 dark:bg-slate-900"
          >
            <Input
              type="search"
              placeholder="Search anything..."
              name="search_term"
              className="min-w-[450px]"
            />

            <Button type="submit">Filter</Button>
          </Form>

          <Dialog
            open={showAddModel}
            onOpenChange={() => setShowAddModel(!showAddModel)}
          >
            <DialogTrigger asChild>
              <Button variant="outline">+ New Employee</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>New Employee</DialogTitle>
              </DialogHeader>
              <Form
                method="POST"
                encType="multipart/form-data"
                className="flex flex-col gap-4"
              >
                {/* {selectedEmmployee ? (
                      <input
                        type="hidden"
                        name="_id"
                        value={selectedEmmployee._id}
                      />
                    ) : null} */}

                <div className="grid w-full  items-center gap-1.5">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input id="firstName" type="text" name="firstName" required />
                </div>

                <div className="grid w-full  items-center gap-1.5">
                  <Label htmlFor="lastName">Lasst Name</Label>
                  <Input id="lastName" type="text" name="lastName" required />
                </div>

                <div className="grid w-full  items-center gap-1.5">
                  <Label htmlFor="username">Username</Label>
                  <Input id="username" type="text" name="username" required />
                </div>

                <div className="grid w-full  items-center gap-1.5">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" name="email" required />
                </div>

                <div className="grid w-full  items-center gap-1.5">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    name="password"
                    required
                  />
                </div>

                <div className="grid w-full  items-center gap-1.5">
                  <Label htmlFor="role">Role</Label>
                  <Select name="role">
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select a role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Role</SelectLabel>
                        <SelectItem value="cashier">Cashier</SelectItem>
                        <SelectItem value="attendant">Attendant</SelectItem>
                        <SelectItem value="sales_person">
                          Sales Person
                        </SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-end gap-3">
                  <DialogClose asChild>
                    <Button type="button" variant="destructive">
                      Close
                    </Button>
                  </DialogClose>

                  <Button
                    type="submit"
                    disabled={navigation.state === "submitting" ? true : false}
                  >
                    Add
                  </Button>
                </div>
              </Form>
            </DialogContent>
          </Dialog>
        </div>
      </section>

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
            {employees.map((employee) => (
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
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline">Action</Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-56">
                      <div className="grid gap-4">
                        <Link
                          to={`/console/employees/${employee._id}`}
                          className="font-sm tansition-all w-full rounded-lg bg-purple-600 px-2 py-2 text-center  text-white shadow-sm duration-300 hover:bg-purple-700 focus:outline-none"
                        >
                          View
                        </Link>

                        <Dialog
                          open={showUpdateModel}
                          onOpenChange={() =>
                            setShowUpdateModel(!showUpdateModel)
                          }
                        >
                          <DialogTrigger asChild>
                            <Button variant="outline">Update</Button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                              <DialogTitle>Update Employee</DialogTitle>
                            </DialogHeader>
                            <Form
                              method="POST"
                              encType="multipart/form-data"
                              className="flex flex-col gap-4"
                            >
                              <input
                                type="hidden"
                                name="actionType"
                                value="update"
                              />
                              <input
                                type="hidden"
                                name="_id"
                                value={employee._id}
                              />

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
                                <Label htmlFor="lastName">Lasst Name</Label>
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

                              <div className="grid w-full items-center gap-1.5">
                                <Label htmlFor="role">Role</Label>
                                <Select
                                  name="role"
                                  defaultValue={employee?.role}
                                >
                                  <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select a role" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectGroup>
                                      <SelectLabel>Role</SelectLabel>
                                      <SelectItem value="cashier">
                                        Cashier
                                      </SelectItem>
                                      <SelectItem value="attendant">
                                        Attendant
                                      </SelectItem>
                                      <SelectItem value="sales_person">
                                        Sales Person
                                      </SelectItem>
                                    </SelectGroup>
                                  </SelectContent>
                                </Select>
                              </div>

                              <div className="flex items-center justify-end gap-3">
                                <DialogClose asChild>
                                  <Button type="button" variant="destructive">
                                    Close
                                  </Button>
                                </DialogClose>

                                <Button
                                  type="submit"
                                  disabled={
                                    navigation.state === "submitting"
                                      ? true
                                      : false
                                  }
                                >
                                  Update
                                </Button>
                              </div>
                            </Form>
                          </DialogContent>
                        </Dialog>
                        <Button
                          variant="destructive"
                          type="button"
                          color="error"
                          onClick={() => handleDelete(employee._id)}
                        >
                          Delete
                        </Button>
                      </div>
                    </PopoverContent>
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
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const role = formData.get("role") as string;
  const gender = formData.get("gender") as string;
  const actionType = formData.get("actionType") as string;

  if (actionType == "update") {
    return await employeesController.updateEmployee({
      firstName,
      lastName,
      email,
      username,
      role,
      gender,
      _id: formData.get("_id") as string,
    });
  } else {
    return await employeesController.createEmployee({
      firstName,
      lastName,
      email,
      username,
      password,
      role,
      gender,
    });
  }
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
