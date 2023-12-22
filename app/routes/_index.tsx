import { Link, useLoaderData } from "@remix-run/react";
import {
  type MetaFunction,
  type LoaderFunction,
  redirect,
} from "@remix-run/node";
import UserLayout from "~/components/layouts/UserLayout";
import ProductController from "~/server/product/ProductController.server";
import UserController from "~/server/user/UserController.server";
import type {
  CategoryInterface,
  ProductInterface,
  UserInterface,
} from "~/server/types";
import IdGenerator from "~/lib/IdGenerator";

export default function Index() {
  let { user, products, featured_categories } = useLoaderData<{
    products: ProductInterface[];
    user: UserInterface;
    featured_categories: CategoryInterface[];
    isCentralDomain: Boolean;
  }>();

  return (
    <UserLayout user={user} title="Home">
      <section className="h-44 w-full rounded-2xl bg-slate-400 p-3 md:h-96">
        <h1>Welcome to ComClo</h1>
      </section>

      <section className="my-3 flex w-full gap-2 overflow-x-hidden">
        {featured_categories?.map((category) => (
          <Link
            to={`/category/${category?._id}`}
            key={IdGenerator()}
            className="flex flex-col items-center rounded-lg bg-white px-3 py-1"
          >
            {category?.name}
          </Link>
        ))}
      </section>

      <section className="mb-14">
        <h3 className="text-lg font-bold">Products</h3>

        <div className="mt-2 grid grid-cols-2 gap-2 flex-col md:grid md:grid-cols-4 md:flex-row md:gap-2">
          {products?.map((product) => (
            <Link
              to={`/${product._id}`}
              key={IdGenerator()}
              className="my-2 gap-2 rounded-lg bg-white p-2 shadow-md dark:bg-slate-800 md:w-full"
            >
              <img
                src={product?.images[0]?.url}
                className="h-36 w-full rounded-lg object-cover "
                alt=""
              />
              <div className="flex flex-col p-1">
                <p className="font-semibold">{product?.name}</p>
                <p className="line-clamp-3">{product?.description}</p>
                <p className="ml-auto">GH₵ {product?.price}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </UserLayout>
  );
}

export const loader: LoaderFunction = async ({ request }) => {
  return redirect("/pos");
  const url = new URL(request.url);
  const page = parseInt(url.searchParams.get("page") as string) || 1;
  const productController = await new ProductController(request);
  const { products, totalPages } = await productController.getProducts({
    page,
  });
  const featured_categories = await productController.getFeaturedCategories();
  const userController = await new UserController(request);
  const user = await userController.getUser();
  let guestId = await userController.getGuestId();

  if (!user && !guestId) {
    return await userController.createGuestSession("/");
  }

  return { products, user, totalPages, featured_categories };
};

export const meta: MetaFunction = () => {
  return [
    { title: "ComClo" },
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
