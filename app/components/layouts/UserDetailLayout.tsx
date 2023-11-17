import { useNavigate } from "@remix-run/react";
import React from "react";

export default function UserDetailLayout({
  children,
  title,
  className = "",
}: {
  children: React.ReactNode;
  title: string;
  className?: string;
}) {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen w-full flex-col bg-slate-100/90 pb-3 dark:bg-slate-900 dark:text-white">
      <div className=" fixed left-0 right-0 top-0 flex justify-between bg-white px-3 py-4 dark:bg-slate-900">
        <p onClick={() => navigate(-1)} className="absolute flex">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="h-6 w-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19.5 12h-15m0 0l6.75 6.75M4.5 12l6.75-6.75"
            />
          </svg>
        </p>

        <p className="mx-auto text-center text-base font-semibold">{title}</p>
      </div>
      <div className="my-8"></div>

      <section className="mb-11 flex w-full flex-col gap-2 px-3">
        {children}
      </section>
    </div>
  );
}
