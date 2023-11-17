import type { FC, InputHTMLAttributes } from "react";
import clsx from "clsx";

interface InputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "size"> {
  label?: string;
  error?: string;
  className?: string;
  size?: "sm" | "md" | "lg";
}

const Input: FC<InputProps> = ({
  label,
  error,
  className,
  size = "md",
  ...rest
}) => {
  const baseStyle =
    "block w-full px-4 py-2 border rounded-xl dark:text-white dark:bg-slate-800 focus:outline-none focus:shadow-outline-blue focus:ring-ring focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50";
  const sizeStyle = {
    sm: "text-xs",
    md: "text-base",
    lg: "text-lg",
  }[size];

  const classes = clsx(baseStyle, sizeStyle, className);

  return (
    <div className="w-full">
      {label && (
        <label className="mb-2 block font-semibold text-slate-700 dark:text-white">
          {label}
        </label>
      )}
      <input
        className={classes}
        {...rest}
        size={size as any}
        autoComplete="off"
        aria-autocomplete="none"
      />
      {error && <p className="mt-2 text-red-600">{error}</p>}
    </div>
  );
};

export default Input;
