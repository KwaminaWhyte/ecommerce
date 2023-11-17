import { useState, useEffect } from "react";
import {
  type MetaFunction,
  type LoaderFunction,
  type ActionFunction,
  redirect,
} from "@remix-run/node";
import {
  Form,
  useActionData,
  useLoaderData,
  useNavigate,
  useNavigation,
} from "@remix-run/react";

import UserDetailLayout from "~/components/layouts/UserDetailLayout";
import UserController from "~/modules/user/UserController.server";
import Container from "~/components/Container";
import WishlistController from "~/modules/wishlist/WishListController.server";
import type { CartInterface } from "~/modules/types";
import DeleteModal from "~/components/modals/DeleteModal";
import { Button } from "~/components/ui/button";

export default function UserCart() {
  // const navigation = useNavigation();
  // const navigate = useNavigate();
  let { wishlist, userId } = useLoaderData<{
    wishlist: CartInterface[];
  }>();
  const [deleteId, setDeleteId] = useState(null);
  const [isOpenDelete, setIsOpenDelete] = useState(false);
  const actionData = useActionData();

  let handleDelete = (id) => {
    setDeleteId(id);
    setIsOpenDelete(true);
  };

  useEffect(() => {
    setDeleteId(null);
    setIsOpenDelete(false);
  }, [actionData]);

  return (
    <UserDetailLayout title="Wishlist" className="mb-11 w-full">
      {wishlist?.length === 0 ? (
        <p className="text-center">No item here</p>
      ) : null}
      {wishlist.map((item) => (
        <div
          key={item._id}
          className="mb-3 flex w-full rounded-lg bg-white p-1 shadow-md  dark:bg-slate-800"
        >
          <img
            className="h-20 w-20 rounded-md object-cover"
            src={item.product.images[0].url}
            alt=""
          />

          <div className="ml-3 flex-1 ">
            <p className="font-semibold">{item.product.name}</p>
            <div className="flex items-center justify-between"></div>
          </div>
          <button
            className="ml-3 mr-3 w-fit border-none bg-none outline-none"
            onClick={() => handleDelete(item?._id)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
              />
            </svg>
          </button>
          <Form method="post" className="my-auto ">
            <input type="hidden" name="type" value="add_to_cart" />
            <input type="hidden" name="productId" value={item._id} />
            <input type="hidden" name="userId" value={userId} />
            <Button type="submit"> + Cart</Button>
          </Form>
        </div>
      ))}

      <DeleteModal
        id={deleteId}
        isOpen={isOpenDelete}
        title="Remove Item"
        description="Are you sure you want to remove this product from wishlist?"
        closeModal={() => setIsOpenDelete(false)}
      />
    </UserDetailLayout>
  );
}

export const meta: MetaFunction = () => {
  return [
    { title: "ComClo - Wishlist" },
    {
      description: "the best shopping site",
    },
  ];
};

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();

  const productId = formData.get("productId") as string;
  const wishlistController = await new WishlistController(request);

  if (formData.get("deleteId") != null) {
    let id = formData.get("deleteId") as string;
    await wishlistController.deleteItem({ id });
    return redirect(`/wishlist`);
  }
};

export const loader: LoaderFunction = async ({ request }) => {
  const userController = await new UserController(request);
  const wishlistController = await new WishlistController(request);

  const userId = await userController.requireUserId();
  const wishlist = await wishlistController.getUserWishlist({
    user: userId as string,
  });

  return { wishlist, userId };
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
