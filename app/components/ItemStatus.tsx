import React from "react";

export default function ItemStatus({ status }: { status: string }) {
  return (
    <p
      className={`w-fit rounded-xl border font-semibold hover:border-black/30 px-2 py-1 capitalize ${
        status == "rejected" || status == "cancelled" || status == "failed"
          ? "bg-red-500/40 text-red-800 dark:text-white"
          : status == "delivered" || status == "paid"
          ? "bg-green-500/40 text-green-800 dark:text-white"
          : status == "completed"
          ? "bg-blue-500/40 text-blue-800 dark:text-white"
          : status == "shipped"
          ? "bg-yellow-500/40 text-yellow-800 dark:text-white"
          : status == "pending"
          ? "bg-pink-500/40 text-pink-800 dark:text-white"
          : "bg-slate-500/40 text-slate-800 dark:text-white"
      }`}
    >
      {status}
    </p>
  );
}
