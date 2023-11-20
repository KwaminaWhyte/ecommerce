import { useEffect, useRef } from "react";
import BottomNavigation from "../BottomNavigation";
import type { AdminInterface } from "~/server/types";

export default function AdminPublicLayout({
  children,
  user,
  title = "",
}: {
  children: React.ReactNode;
  user?: AdminInterface;
  title?: string;
}) {
  // const eventDateRef = useRef(new Date());
  const timerRef = useRef(0);

  useEffect(() => {
    return () => clearTimeout(timerRef.current);
  }, []);

  return (
    <div className="flex min-h-screen w-full flex-col bg-white/60 dark:bg-slate-900 dark:text-white">
      <main className="flex h-full w-full flex-1 flex-col p-3 ">
        {children}
      </main>

      {user && <BottomNavigation />}
    </div>
  );
}
