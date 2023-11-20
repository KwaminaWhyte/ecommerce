import { Link } from "@remix-run/react";
import React from "react";

export default function ErrorPage() {
  return (
    <div className="items-center bg-gray-50 justify-center h-screen w-screen flex flex-col">
      <div className="items-start self-center flex w-full max-w-[1440px] flex-col max-md:max-w-full">
        <img
          loading="lazy"
          alt="404"
          srcSet="https://cdn.builder.io/api/v1/image/assets/TEMP/de899c0f-402d-40ab-9ef7-13eef73c7050?apiKey=8ecad3c4c69348cf9cc7d14cc5b3a7f2&width=100 100w, https://cdn.builder.io/api/v1/image/assets/TEMP/de899c0f-402d-40ab-9ef7-13eef73c7050?apiKey=8ecad3c4c69348cf9cc7d14cc5b3a7f2&width=200 200w, https://cdn.builder.io/api/v1/image/assets/TEMP/de899c0f-402d-40ab-9ef7-13eef73c7050?apiKey=8ecad3c4c69348cf9cc7d14cc5b3a7f2&width=400 400w, https://cdn.builder.io/api/v1/image/assets/TEMP/de899c0f-402d-40ab-9ef7-13eef73c7050?apiKey=8ecad3c4c69348cf9cc7d14cc5b3a7f2&width=800 800w, https://cdn.builder.io/api/v1/image/assets/TEMP/de899c0f-402d-40ab-9ef7-13eef73c7050?apiKey=8ecad3c4c69348cf9cc7d14cc5b3a7f2&width=1200 1200w, https://cdn.builder.io/api/v1/image/assets/TEMP/de899c0f-402d-40ab-9ef7-13eef73c7050?apiKey=8ecad3c4c69348cf9cc7d14cc5b3a7f2&width=1600 1600w, https://cdn.builder.io/api/v1/image/assets/TEMP/de899c0f-402d-40ab-9ef7-13eef73c7050?apiKey=8ecad3c4c69348cf9cc7d14cc5b3a7f2&width=2000 2000w, https://cdn.builder.io/api/v1/image/assets/TEMP/de899c0f-402d-40ab-9ef7-13eef73c7050?apiKey=8ecad3c4c69348cf9cc7d14cc5b3a7f2&"
          className="aspect-[1.67] object-cover object-center w-[900px] self-center max-w-full"
        />
        <div className="items-center self-stretch flex grow flex-col max-md:max-w-full">
          <div className="items-start self-stretch flex flex-col px-5 max-md:max-w-full">
            <div className="self-center text-gray-900 text-center text-5xl font-bold leading-[62.4px] w-[1440px] -ml-5 max-md:max-w-full max-md:text-4xl">
              Page not found
            </div>
            <div className="self-center text-gray-500 text-center text-base leading-6 w-[1440px] -ml-5 mt-2.5 max-md:max-w-full">
              Oops! Looks like you followed a bad link. If you think this is a
              problem with us, please tell us.
            </div>
          </div>
          <Link
            to="/"
            className="text-white  font-semibold leading-5 self-center justify-center items-center bg-emerald-600 max-w-full grow mt-6 px-4 py-2.5 rounded-xl"
          >
            Go back home
          </Link>
        </div>
      </div>
    </div>
  );
}
