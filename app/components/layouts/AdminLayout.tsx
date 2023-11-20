import type { AdminInterface } from "~/server/types";
import SideNavigation from "../SideNavigation";
import { Toaster } from "../ui/toaster";

export default function AdminLayout({
  children,
  user,
}: {
  children: React.ReactNode;
  user?: AdminInterface;
  title?: string;
  message?: {
    type: "success" | "error";
    message: string;
  };
}) {
  return (
    <div className="flex min-h-screen w-full flex-col bg-opacity-70 backdrop-blur-lg bg-white">
      <nav className="fixed z-20 flex h-16 w-full items-center shadow-md border-b-slate-400 bg-white px-5 dark:border-b-slate-700 dark:bg-black/90">
        {/* <p>Admin Dashboard</p> */}
      </nav>

      <section className="flex">
        <SideNavigation user={user} />

        <main className="flex min-h-full w-full flex-1 flex-col px-5 py-20  dark:bg-black/90 dark:text-white ">
          {children}
        </main>
      </section>
      <Toaster />
    </div>
  );
}
