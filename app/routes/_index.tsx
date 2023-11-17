import { Link, useLoaderData } from "@remix-run/react";
import type { MetaFunction, LoaderFunction } from "@remix-run/node";
import UserLayout from "~/components/layouts/UserLayout";
import ProductController from "~/modules/product/ProductController.server";
import UserController from "~/modules/user/UserController.server";
import PublicLayout from "~/components/layouts/PublicLayout";
import pattern from "../components/inc/pattern.png";
import dashboard_image from "../components/inc/dashboard.png";
import type {
  ProductCategoryInterface,
  ProductInterface,
  UserInterface,
} from "~/modules/types";
import SenderController from "~/modules/notification/SenderController";

const benefits = [
  {
    title: "Streamlined E-commerce Management",
    image: "",
    points: [
      "Efficient Inventory Control: Easily manage product inventory, track stock levels, and receive alerts for low stock.",
      "Order Processing: Streamline order fulfillment with automated processes, reducing errors and delays.",
      "Centralized Data: Access all e-commerce data, including sales, orders, and customer information, in one centralized location.",
      "Multi-Channel Selling: Expand your reach by selling on multiple online marketplaces from a single dashboard.",
    ],
  },
  {
    title: "Improved Customer Experience",
    image: "",
    points: [
      "User-Friendly Interface: Provide a seamless and intuitive shopping experience for customers.",
      "Quick Checkout: Simplify the checkout process to reduce cart abandonment rates.",
      "Personalization: Utilize customer data to offer personalized product recommendations and marketing campaigns.",
      "Responsive Design: Ensure your platform is accessible and responsive on various devices for a consistent user experience.",
    ],
  },
  {
    title: "Enhanced Analytics and Insights",
    image: "",
    points: [
      "Data-driven Decision Making: Access detailed analytics to make informed decisions about pricing, marketing, and inventory.",
      "Sales Forecasting: Predict future sales trends and optimize inventory accordingly.",
      "Conversion Tracking: Monitor the effectiveness of marketing campaigns and website performance.",
      "Customer Behavior Analysis: Understand how customers navigate your site and use that insight to improve.",
    ],
  },
  {
    title: "Scalability and Cost Savings",
    image: "",
    points: [
      "Scalability: Grow your e-commerce business without worrying about infrastructure limitations.",
      "Pay-as-You-Go: Benefit from a flexible pricing model, paying only for the resources you use.",
      "Automated Updates: Enjoy the latest features and security enhancements without manual updates.",
      "Reduced Maintenance: Eliminate the need for in-house server management and maintenance tasks.",
    ],
  },
];

export default function Index() {
  let { user, products, featured_categories, isCentralDomain } = useLoaderData<{
    products: ProductInterface;
    user: UserInterface;
    featured_categories: ProductCategoryInterface[];
    isCentralDomain: Boolean;
  }>();

  if (isCentralDomain) {
    return (
      <PublicLayout>
        <img src={pattern} alt="" className="w-full absolute -z-10" />
        <section className="w-5/6 mx-auto flex justify-center flex-col items-center h-[65vh] relative">
          <h1 className="text-6xl font-bold gradient-text">
            All-in-one Solution for
          </h1>
          <h2 className="text-6xl font-bold gradient-text">eCommerce</h2>

          <p className="mt-4 text-lg font-medium">
            Unlock the power of seamless online retail with our cutting-edge
            SaaS platform.
          </p>
          <p className="text-lg font-medium">
            From a sleek POS system to an intuitive admin dashboard and a
            delightful end-user experience, we've got you covered.
          </p>
        </section>

        <img
          src={dashboard_image}
          alt=""
          className="w-5/6 mx-auto rounded-2xl border border-slate-300 shadow-2xl mb-28"
        />

        <h3 className="mx-auto text-4xl font-bold underline underline-offset-4 mb-14">
          Why Us?
        </h3>

        <section className="w-5/6 mx-auto">
          {benefits.map((benefit, i) => {
            let even = i % 2;
            return (
              <div
                key={benefit.title}
                className={`w-full flex ${even == 1 ? "flex-row-reverse" : ""}`}
              >
                <section className="flex-1">
                  <h4 className="font-bold text-2xl">{benefit.title}</h4>

                  <ol className="ml-3">
                    {benefit.points.map((point, i) => (
                      <li key={i} className="mt-3">
                        {" "}
                        - {point}
                      </li>
                    ))}
                  </ol>
                </section>

                <img src="" alt="" className="h-80 flex-1" />
              </div>
            );
          })}
        </section>
      </PublicLayout>
    );
  }

  return (
    <UserLayout user={user} title="Home">
      <section className="h-44 w-full rounded-2xl bg-slate-400 p-3 md:h-96">
        <h1>Welcome to ComClo</h1>
      </section>

      <section className="my-3 flex w-full gap-2 overflow-x-hidden">
        {featured_categories?.map((category) => (
          <Link
            to={`/category/${category?._id}`}
            key={category?._id}
            className="flex flex-col items-center rounded-lg bg-white px-3 py-1"
          >
            {category?.name}
          </Link>
        ))}
      </section>

      <section className="mb-14">
        <h3 className="text-lg font-bold">Products</h3>

        <div className="mt-2 grid grid-cols-2 gap-2 flex-col md:grid md:grid-cols-4 md:flex-row md:gap-2">
          {products?.map((product: ProductInterface) => (
            <Link
              to={`/${product._id}`}
              key={product._id}
              className="my-2 gap-2 rounded-lg bg-white p-2 shadow-md dark:bg-slate-800 md:w-full"
            >
              <img
                src={product?.images[0]?.url}
                // src="https://images.unsplash.com/photo-1519996529931-28324d5a630e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=387&q=80"
                alt=""
                className="h-36 w-full rounded-lg object-cover "
              />
              <div className="flex flex-col p-1">
                <p className="font-semibold">{product?.name}</p>
                <p className="">{product?.description}</p>
                <p className="ml-auto">${product?.price}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </UserLayout>
  );
}

export const meta: MetaFunction = () => {
  return [
    { title: "ComClo - Home" },
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
  const domain = (request.headers.get("host") as string).split(":")[0];
  // const senderController = await new SenderController(request);
  // await senderController.sendBatchEmail();

  if (domain == process.env.CENTRAL_DOMAIN) {
    return { isCentralDomain: true };
  } else {
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
  }
};
