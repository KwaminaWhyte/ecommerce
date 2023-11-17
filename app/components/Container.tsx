import React from "react";

export default function Container({
  children,
  heading,
  className,
  contentClassName,
  subHeading,
}: {
  children: React.ReactNode;
  heading?: string;
  subHeading?: string;
  className?: string;
  contentClassName?: string;
}) {
  return (
    <section
      className={`mt-5 rounded-xl bg-white p-3 shadow-sm dark:bg-black/95 backdrop-blur-lg bg-opacity-60 ${className}`}
    >
      {heading && (
        <h3 className="text-2xl font-semibold text-slate-800 dark:text-white">
          {heading}
        </h3>
      )}
      {subHeading && (
        <h4 className="text-slate-800 dark:text-white">{subHeading}</h4>
      )}

      <div className={`mt-3 flex ${contentClassName}`}>{children}</div>
    </section>
  );
}
