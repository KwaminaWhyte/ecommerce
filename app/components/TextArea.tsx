import type { FC, TextareaHTMLAttributes } from "react";
import clsx from "clsx";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  helperText?: string;
  error?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const TextArea: FC<TextareaProps> = ({
  label,
  helperText,
  error = false,
  size = "md",
  className,
  ...rest
}) => {
  const baseStyle =
    "block w-full px-4 py-2 border rounded-xl dark:text-white dark:bg-slate-800 focus:outline-none focus:shadow-outline-blue focus:ring-ring focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50";
  const sizeStyle = {
    sm: "text-xs",
    md: "text-base",
    lg: "text-lg",
  }[size];

  const classes = clsx(
    baseStyle,
    sizeStyle,
    error ? "border-red-500" : "border-slate-200",
    className
  );

  return (
    <div className="">
      {label && (
        <label className="mb-2 block font-semibold text-slate-700 dark:text-white">
          {label}
        </label>
      )}
      <textarea className={classes} {...rest}></textarea>
      {helperText && <p className=" text-slate-600">{helperText}</p>}
      {error && <p className=" text-red-500">Error</p>}
    </div>
  );
};

export default TextArea;
