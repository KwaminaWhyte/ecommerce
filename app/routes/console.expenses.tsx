import { Popover } from "@headlessui/react";
import {
  type ActionFunction,
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
import { useEffect, useState } from "react";

import TextArea from "~/components/TextArea";
import AdminLayout from "~/components/layouts/AdminLayout";
import AdminController from "~/server/admin/AdminController.server";
import DeleteModal from "~/components/modals/DeleteModal";
import Container from "~/components/Container";
import type { ExpenseInterface, UserInterface } from "~/server/types";
import { Pagination, PaginationItem } from "@mui/material";
import { Button } from "~/components/ui/button";
import ExpenseController from "~/server/expense/ExpenseController.server";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import expense_categories from "~/components/inc/expense-category";
import IdGenerator from "~/lib/IdGenerator";
import { Label } from "~/components/ui/label";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import moment from "moment";

export default function Products() {
  const { user, expenses, page, totalPages } = useLoaderData<{
    user: UserInterface;
    expenses: ExpenseInterface[];
    page: number;
    totalPages: number;
  }>();
  const actionData = useActionData();
  const navigation = useNavigation();

  const [activeCategory, setActiveCategory] = useState({});
  const [isUpdating, setIsUpdating] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [isOpenDelete, setIsOpenDelete] = useState(false);

  function closeModal() {
    setActiveCategory({});
    setIsUpdating(false);
  }

  useEffect(() => {
    setIsOpenDelete(false);
    setActiveCategory({});
  }, [expenses]);

  return (
    <AdminLayout user={user}>
      <div className="flex">
        <h1 className="text-3xl font-bold">Expenses</h1>

        <section className="ml-auto flex">
          <Dialog>
            <DialogTrigger asChild>
              <Button>+ New Expense</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>New Expense</DialogTitle>
              </DialogHeader>

              <Form
                method="POST"
                encType="multipart/form-data"
                className="grid gap-4 py-4"
              >
                {isUpdating ? (
                  <input type="hidden" name="_id" value={activeCategory._id} />
                ) : null}

                <div className="grid w-full max-w-sm items-center gap-1.5">
                  <Label htmlFor="amount">Amount</Label>
                  <Input
                    id="amount"
                    type="number"
                    step={0.01}
                    min={1}
                    name="amount"
                  />
                </div>

                <div className="grid w-full max-w-sm items-center gap-1.5">
                  <Label>Category</Label>
                  <Select name="category">
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {expense_categories.map((cateory) => (
                        <SelectItem key={IdGenerator(15)} value={cateory.name}>
                          {cateory.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <TextArea
                  name="note"
                  placeholder="note"
                  label="Note"
                  defaultValue={
                    actionData?.fields
                      ? actionData?.fields?.note
                      : activeCategory.note
                  }
                  error={actionData?.errors?.note}
                />

                <div className="flex items-center ">
                  <DialogClose asChild>
                    <Button type="button" variant="secondary">
                      Close
                    </Button>
                  </DialogClose>

                  <Button
                    type="submit"
                    disabled={navigation.state === "submitting" ? true : false}
                  >
                    {navigation.state === "submitting"
                      ? "Submitting..."
                      : isUpdating
                      ? "Update"
                      : "Add"}
                  </Button>
                </div>
              </Form>
            </DialogContent>
          </Dialog>
        </section>
      </div>

      <Form
        method="GET"
        className="my-3 flex items-center gap-3 rounded-lg bg-slate-50 p-2 dark:bg-slate-900"
      >
        <Input
          type="search"
          placeholder="Search anything..."
          name="search_term"
        />

        <Button type="submit">Search</Button>
      </Form>

      {/* <SimpleSelect name="status" variant="ghost">
          <option value="">Select Status</option>
          <option value="pending">Pending</option>
          <option value="completed">Completed</option>
          <option value="rejected">Rejected</option>
          <option value="shipping">Shipping</option>
        </SimpleSelect> */}

      <div className="relative shadow-sm bg-white dark:bg-slate-700 rounded-xl pb-2">
        <table className="w-full text-left text-slate-500 dark:text-slate-400">
          <thead className=" uppercase text-slate-700 dark:text-slate-400 ">
            <tr>
              <th scope="col" className="px-3 py-3">
                Amount
              </th>
              <th scope="col" className="px-3 py-3">
                Category
              </th>
              <th scope="col" className="px-3 py-3">
                Note
              </th>
              <th scope="col" className="px-3 py-3">
                Timestamp
              </th>
              <th scope="col" className="px-3 py-3">
                <span className="sr-only">Action</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {expenses.map((expense) => (
              <tr
                key={expense?._id}
                className="cursor-pointer rounded-xl hover:bg-slate-50 hover:shadow-md dark:border-slate-400 dark:bg-slate-800 dark:hover:bg-slate-600"
              >
                <th
                  scope="row"
                  className=" px-3 py-3 font-medium text-slate-900 dark:text-white"
                >
                  <p>{expense?.amount}</p>
                </th>

                <td className="px-3 py-3">{expense?.category}</td>
                <td className="px-3 py-3">{expense?.note}</td>
                <td className="px-3 py-3">
                  {moment(expense?.createdAt).format("MMM Do YYYY, h:mm a")}
                </td>
                {/* <td className="px-3 py-3">
                  <p
                    className={` w-fit  rounded-xl px-2 py-1 font-medium capitalize ${
                      category?.status == "inactive"
                        ? "bg-red-500/40 text-red-800 dark:bg-red-400/80 dark:text-white"
                        : "bg-green-500/40 text-green-800 dark:bg-green-600/80 dark:text-white"
                    }`}
                  >
                    {category?.status}
                  </p>
                </td> */}

                <td className="gap-1 px-3 py-3">
                  <Popover className="relative">
                    <Popover.Button className="font-sm tansition-all rounded-lg bg-blue-600 px-2 py-1 text-white shadow-sm duration-300 hover:bg-blue-700 focus:outline-none">
                      Actions
                    </Popover.Button>

                    <Popover.Panel className="absolute right-6 z-10">
                      <div className="flex flex-col gap-2 rounded-lg bg-white p-3 dark:bg-slate-900">
                        <Button
                          onClick={() => {
                            setIsUpdating(true);
                            setActiveCategory(expense);
                          }}
                        >
                          Update
                        </Button>
                        <Button
                          variant="destructive"
                          type="button"
                          onClick={() => {
                            setDeleteId(expense?._id);
                            setIsOpenDelete(true);
                          }}
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
          variant="outlined"
          shape="rounded"
          page={page}
          count={totalPages}
          color="primary"
          renderItem={(item) => (
            <PaginationItem
              component={Link}
              to={`/console/expenses${
                item.page === 1 ? "" : `?page=${item.page}`
              }`}
              {...item}
            />
          )}
        />
      </div>

      <DeleteModal
        id={deleteId}
        isOpen={isOpenDelete}
        title="Delete Category"
        description="Are you sure you want to delete this category?"
        closeModal={() => setIsOpenDelete(false)}
      />
    </AdminLayout>
  );
}

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const expenseController = await new ExpenseController(request);

  const _id = formData.get("_id") as string;
  const amount = formData.get("amount") as string;
  const category = formData.get("category") as string;
  const note = formData.get("note") as string;

  // if (typeof name !== "string") {
  //   return json({ error: "Invalid name " }, { status: 400 });
  // }

  // const errors = {
  //   name: validateName(name),
  // };

  // if (Object.values(errors).some(Boolean)) {
  //   return json({ errors, fields: { name } }, { status: 400 });
  // }

  if (formData.get("deleteId") != null) {
    await expenseController.deleteExpense(formData.get("deleteId") as string);
    return true;
  } else if (formData.get("_id") != null) {
    return await expenseController.updateExpense({
      _id,
      amount,
      category,
      note,
    });
  } else {
    return await expenseController.createExpense({
      amount,
      category,
      note,
    });
  }
};

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  const page = parseInt(url.searchParams.get("page") as string) || 1;
  const search_term = url.searchParams.get("search_term") as string;

  const adminController = await new AdminController(request);
  await adminController.requireAdminId();
  const user = await adminController.getAdmin();

  const expenseController = await new ExpenseController(request);
  const { expenses, totalPages } = await expenseController.getExpenses({
    page,
    search_term,
  });

  return { user, expenses, page, totalPages };
};

export const meta: MetaFunction = () => {
  return [
    { title: "ComClo - Expenses" },
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
