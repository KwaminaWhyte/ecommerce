import { type MetaFunction } from "@remix-run/node";
import React from "react";
import PublicLayout from "~/components/layouts/PublicLayout";
import paymentImage from "~/components/inc/credit-card.webp";
import analyticsImage from "~/components/inc/analytics.webp";
import marketingImage from "~/components/inc/marketing.png";
import domainImage from "~/components/inc/domain.png";
import responsiveImage from "~/components/inc/responsive.png";
import inventoryImage from "~/components/inc/Inventory.png";
import friendlyImage from "~/components/inc/friendly.webp";
import connectionImage from "~/components/inc/multi_conn.webp";

let features = [
  {
    title: "Multiple Payment Gateways",
    image: paymentImage,
    description:
      "Offer a variety of payment gateways, including credit cards, PayPal, and more, allowing customers to choose their preferred payment method.",
  },
  {
    title: "Inventory Management",
    image: inventoryImage,
    description:
      "Keep track of your product stock levels in real-time, minimizing the risk of overselling or running out of stock.",
  },
  {
    title: "Analytics and Reporting",
    image: analyticsImage,
    description:
      "Access comprehensive data analytics and reporting tools to gain insights into sales trends, customer behavior, and website performance.",
  },
  {
    title: "Custom Domain",
    image: domainImage,
    description:
      "Allow each client to use their custom domain name, reinforcing their brand identity and creating a professional online presence.",
  },
  {
    title: "Responsive Design",
    image: responsiveImage,
    description:
      "Ensure your platform is responsive, offering a seamless shopping experience on various devices, including smartphones and tablets.",
  },
  {
    title: "Marketing and Promotions",
    image: marketingImage,
    description:
      "Create and launch targeted marketing campaigns, such as discounts, coupons, and special promotions, to attract and retain customers.",
  },
  {
    title: "User-Friendly Content Management System",
    image: friendlyImage,
    description:
      "Effortless Content Updates: Provide an intuitive CSM that allows clients to easily manage and update their products listings, descriptions, images, and website content",
  },
  {
    title: "Multi-Channel Selling Integration",
    image: connectionImage,
    description:
      "Expanded Sales Channels: Enable clients to reach a broader audience by integratig with popular online marketplaces like Amazon, eBay, and Etsy.",
  },
];

export default function Features() {
  return (
    <PublicLayout>
      <h3 className="mx-auto mt-44 text-4xl font-bold ">
        Other Awesome <span className="italic text-purple-600">Features</span>
      </h3>
      <p className="w-5/6 mt-4 mx-auto text-base font-medium text-center ">
        Itoch Dashboard is a powerhouse when it comes to the feature list. This
        ensures you have every functionality
      </p>
      <p className="mb-14 w-5/6 mx-auto text-base font-medium text-center">
        you need to build, run and expand your marketplace
      </p>

      <section className="w-5/6 grid grid-cols-4 gap-5 mx-auto">
        {features.map((feature, i) => (
          <div
            key={i}
            className="bg-white dark:bg-black/50 shadow-xl rounded-xl p-5 hover:shadow-2xl transition-all duration-150 cursor-pointer"
          >
            <img src={feature.image} alt="" className="h-52 mx-auto flex-1" />

            <section className="flex-1 mt-3">
              <h4 className="font-bold text-xl text-center mb-2">
                {feature.title}
              </h4>
              <p className="text-center">{feature.description}</p>
            </section>
          </div>
        ))}
      </section>
    </PublicLayout>
  );
}

export const meta: MetaFunction = () => {
  return [
    { title: "ComClo - Features" },
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
