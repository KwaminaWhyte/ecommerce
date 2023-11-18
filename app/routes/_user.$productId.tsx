import { useEffect, useState } from "react";
import {
  type ActionFunction,
  type LoaderFunction,
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
import Spacer from "~/components/Spacer";
import UserDetailLayout from "~/components/layouts/UserDetailLayout";
import UserController from "~/server/user/UserController.server";
import ProductController from "~/server/product/ProductController.server";
import CartController from "~/server/cart/CartController.server";
import type { ProductInterface } from "~/server/types";
import WishlistController from "~/server/wishlist/WishListController.server";
import { Button } from "~/components/ui/button";
import GuestCartController from "~/server/cart/GuestCartController.server";

export default function ProductDetails() {
  const { userId, product, guestId } = useLoaderData<{
    userId: string;
    guestId: string;
    product: ProductInterface;
  }>();
  const [activeImage, setActiveImage] = useState({});
  const actionData = useActionData();
  const navigation = useNavigation();
  const navigate = useNavigate();

  useEffect(() => {
    setActiveImage(product.images[0]);
  }, []);

  return (
    <UserDetailLayout
      title="Product Details"
      className="flex flex-col gap-4 overflow-x-auto shadow-sm md:flex-row"
    >
      <section className="md:w-1/2">
        <img
          src={activeImage.url}
          className="h-80 w-full rounded-lg object-cover  md:h-[35vw]"
          alt=""
        />

        <div className="mt-3 flex flex-wrap justify-between p-1">
          {product?.images.map((image) => (
            <img
              key={image._id}
              onClick={() => setActiveImage(image)}
              src={image.url}
              className={`h-16 w-16 rounded-md object-cover md:h-20 md:w-20 ${
                image._id == activeImage?._id
                  ? "ring-1 ring-blue-500 ring-offset-2"
                  : ""
              } `}
              alt=""
            />
          ))}
        </div>
      </section>

      <section className="md:w-1/2">
        <h2 className="text-2xl font-bold">{product?.name}</h2>
        <p className="mb-2">{product?.description}</p>
        <p className="mb-2">{product?.quantity}</p>
      </section>

      <Container
        heading="Reviews"
        contentClassName="flex flex-col p-0"
        className="mb-16 rounded-xl p-0"
      >
        {[
          {
            _id: 1,
            user: {
              username: "Ann Bond",
              avatar:
                "https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=464&q=80",
            },
            createdAt: "12/12/2021",
            comment:
              "lorem ipsum dolor sit amet consectetur adipisicing elit. ",
          },
          {
            _id: 2,
            user: {
              username: "Jenifer Smith",
              avatar:
                "https://images.unsplash.com/photo-1554151228-14d9def656e4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=386&q=80",
            },
            createdAt: "12/12/2021",
            comment:
              "lorem ipsum dolor sit amet consectetur adipisicing elit. ",
          },
          {
            _id: 3,
            user: {
              username: "John Doe",
              avatar:
                "https://images.unsplash.com/photo-1552058544-f2b08422138a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=399&q=80",
            },
            createdAt: "12/12/2021",
            comment:
              "lorem ipsum dolor sit amet consectetur adipisicing elit. ",
          },
          {
            _id: 4,
            user: {
              username: "Michael Wood",
              avatar:
                "https://images.unsplash.com/photo-1555952517-2e8e729e0b44?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=464&q=80",
            },
            createdAt: "12/12/2021",
            comment:
              "lorem ipsum dolor sit amet consectetur adipisicing elit. ",
          },
        ].map((review) => (
          <div
            key={review._id}
            className="mb-2 flex flex-col gap-2 rounded-lg bg-slate-100 px-2 py-1 dark:bg-black/30"
          >
            <div className="flex items-center gap-2">
              <img
                src={review.user.avatar}
                className="h-10 w-10 rounded-full object-cover"
                alt=""
              />
              <div className="flex flex-col">
                <h1 className="font-semibold">{review.user.username}</h1>
                <p className="text-sm">{review.createdAt}</p>
              </div>
            </div>
            <p className="ml-5 text-slate-700 dark:text-slate-400">
              {review.comment}
            </p>
          </div>
        ))}
      </Container>

      <div className="fixed bottom-0 left-1 right-1 mx-auto my-2 flex w-[96vw] items-center justify-evenly rounded-2xl border border-slate-400 bg-white px-2 py-3 shadow-md dark:bg-black/80 dark:text-white">
        <h1 className="text-xl font-semibold">${product?.price} </h1>

        <section className="ml-auto flex">
          {/* <Button variant="outline">Export</Button> */}
          <Spacer />
          {/* <Button variant="outline">Print</Button> */}

          <Form method="post">
            <input type="hidden" name="wishlist" value="true" />
            <input type="hidden" name="productId" defaultValue={product?._id} />
            <input type="hidden" name="userId" defaultValue={userId} />

            <Button type="submit">Add to Wishlist</Button>
          </Form>
          <Spacer />

          <Form method="post">
            <input type="hidden" name="productId" defaultValue={product?._id} />
            {userId ? (
              <input type="hidden" name="userId" defaultValue={userId} />
            ) : (
              <input type="hidden" name="guestId" defaultValue={guestId} />
            )}

            <Button type="submit">Add to Cart</Button>
          </Form>
        </section>
      </div>
    </UserDetailLayout>
  );
}

export const meta: MetaFunction = ({ data }) => {
  let { product } = data;

  return [
    { title: `ComClo - Product | ${product.name} ` },
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
  const formData = await request.formData();

  const product = formData.get("productId") as string;
  const user = formData.get("userId") as string;
  const guestId = formData.get("guestId") as string;

  if (formData.get("wishlist")) {
    const wishlistController = await new WishlistController(request);
    return await wishlistController.addToWishlist({ user, product });
  } else {
    if (user) {
      const cartController = await new CartController(request);
      return await cartController.addToCart({ user, product });
    } else {
      const guestCartController = await new GuestCartController(request);
      return await guestCartController.addToCart({ guestId, product });
    }
  }
};

export const loader: LoaderFunction = async ({ request, params }) => {
  const { productId } = params;
  const userController = await new UserController(request);
  const userId = await userController.getUserId();
  const guestId = await userController.getGuestId();

  // if (!userId && !guestId) {
  //   await userController.createGuestSession(Date.now().toString(), "/");
  // }

  const productController = await new ProductController(request);
  const product = await productController.getProduct({
    id: productId as string,
  });

  return { userId, guestId, product };
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
