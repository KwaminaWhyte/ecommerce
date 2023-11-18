import type { PageInterface } from "~/server/types";
import PosSideNavigation from "../PosSideNavigation";
import { useState } from "react";
import SideCart from "../SideCart";

export default function PosLayout({
  children,
  user,
  cart_items = [],
  settings,
}: PageInterface) {
  const [showCart, setShowCart] = useState(false);

  return (
    <div className="flex min-h-screen w-full flex-col bg-slate-100/90">
      <nav className="fixed z-20 flex h-16 w-full items-center border-b dark:text-white border-b-slate-400 bg-white px-5 dark:border-b-slate-700 dark:bg-black/90">
        {/* <p>Pos Dashboard</p> */}

        <button
          className=" ml-auto mr-10 bg-blue-600  rounded-full "
          onClick={() => setShowCart(!showCart)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-7 h-7 m-2 text-white"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"
            />
          </svg>
        </button>
      </nav>

      <section className="flex">
        <PosSideNavigation user={user} />

        <main className="flex min-h-full w-full flex-1 flex-col px-5 py-20  dark:bg-black/95 dark:text-white ">
          {children}
        </main>

        <SideCart
          showCart={showCart}
          setShowCart={setShowCart}
          cart_items={cart_items}
          settings={settings}
        />
      </section>
    </div>
  );
}
