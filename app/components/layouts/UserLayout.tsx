import { useEffect, useRef, useState } from "react";
import { Link } from "@remix-run/react";
import BottomNavigation from "../BottomNavigation";
import type { PageInterface } from "~/modules/types";

export default function UserLayout({
  children,
  message,
  user,
  title = "",
}: PageInterface) {
  const [open, setOpen] = useState(false);
  const eventDateRef = useRef(new Date());
  const timerRef = useRef(0);

  useEffect(() => {
    return () => clearTimeout(timerRef.current);
  }, []);

  return (
    <div className="flex min-h-screen w-full flex-col bg-slate-100/90 dark:bg-slate-900 dark:text-white">
      <nav className="flex h-16 w-full items-center border-b border-slate-400 px-5">
        <p className="text-base font-semibold">{title}</p>

        {!user && (
          <div className="flex items-center ml-auto">
            <Link className="mr-3" to="/login">
              Login
            </Link>
            <Link to="/cart" className="">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className=" h-6 w-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
                />
              </svg>
            </Link>
          </div>
        )}
      </nav>

      <main className="flex h-full w-full flex-1 flex-col p-3 ">
        {children}
      </main>

      {user && <BottomNavigation />}
    </div>
  );
}
