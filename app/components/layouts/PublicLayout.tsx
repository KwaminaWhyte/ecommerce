import { Link, NavLink } from "@remix-run/react";
import React from "react";
import logo from "../inc/logo.png";
import { Toaster } from "../ui/toaster";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen w-full flex-col bg-slate-100/90 dark:bg-slate-900 dark:text-white">
      <nav className="flex h-20 w-full fixed bg-white/40 dark:bg-slate-800/50 z-40 bg-opacity-70 backdrop-blur-lg shadow-lg">
        <div className="items-center flex w-5/6 mx-auto">
          <div className="flex-1 flex items-center">
            <img src={logo} alt="" className="w-24" />
            <Link to="/" className="text-base font-semibold">
              ComClo
            </Link>
            <p className="text-[10px] rounded-xl px-2 py-0 ml-5 bg-slate-200 text-blue-600 font-medium mr-auto">
              Beta
            </p>
          </div>

          <div className="flex-1 flex items-center justify-center gap-3">
            {[
              { id: 1, label: "Home", path: "/" },
              { id: 2, label: "Features", path: "/features" },
              // { id: 3, label: "Reviews", path: "/reviews" },
              { id: 4, label: "Pricing", path: "/pricing" },
            ].map((item) => (
              <NavLink
                key={item.id}
                to={item.path}
                className={({ isActive }) =>
                  isActive
                    ? "text-purple-700 font-medium transition-all duration-150"
                    : "font-medium transition-all duration-150"
                }
              >
                {item.label}
              </NavLink>
            ))}
          </div>

          <div className="flex-1 items-center flex justify-end">
            <Link
              to="/setup/welcome"
              className="inline-block px-4 py-2 text-white font-semibold rounded-xl shadow-md hover:shadow-sm hover:shadow-black/70 hover:bg-blue-700 bg-gradient-to-tr from-purple-700 to-orange-600 transition-all duration-300"
            >
              Setup my Account
            </Link>
          </div>
        </div>
      </nav>

      <main className="flex flex-col w-full">{children}</main>

      <footer className="flex flex-col h-44 mt-40 w-full border-t p-3 items-center justify-center border-slate-300 z-40 bg-opacity-70 backdrop-blur-lg">
        <h3 className="text-3xl gradient-text font-bold">
          The future of seamless commerce
        </h3>
        <p className="mt-4">ComClo - Made with ❤️ by @KwaminaWhyte</p>
      </footer>

      <Toaster />
    </div>
  );
}
