import type { FC, SelectHTMLAttributes } from "react";
import clsx from "clsx";

interface SelectProps
  extends Omit<SelectHTMLAttributes<HTMLSelectElement>, "size"> {
  label?: string;
  error?: string;
  className?: string;
  fullWidth?: boolean;
  size?: "sm" | "md" | "lg";
  color?: "primary" | "secondary" | "warning" | "error" | "success";
  variant?: "solid" | "outline" | "ghost";
}

const SimpleSelect: FC<SelectProps> = ({
  label,
  error,
  className,
  fullWidth = false,
  size = "md",
  color = "primary",
  variant = "solid",
  children,
  ...rest
}) => {
  const baseStyle =
    "block w-full px-4 dark:text-white py-2 border rounded-xl w-40 shadow-sm dark:bg-slate-800 focus:border-blue-300 focus:outline-none focus:shadow-outline-blue";
  const sizeStyle = {
    sm: "text-xs",
    md: "text-base",
    lg: "text-lg",
  }[size];
  const colorStyle = {
    primary: "bg-blue-500 hover:bg-blue-600 text-white",
    secondary: "bg-slate-500 hover:bg-slate-600 text-white",
    warning: "bg-yellow-500 hover:bg-yellow-600 text-white",
    error: "bg-red-500 hover:bg-red-600 text-white",
    success: "bg-green-500 hover:bg-green-600 text-white",
  }[color];
  const variantStyle = {
    solid: `shadow-sm ${colorStyle}`,
    outline: `border border-${color}-500 text-${color}-500 hover:bg-${color}-500 hover:text-white`,
    ghost: "hover:bg-slate-100 dark:hover:bg-slate-900",
  }[variant];

  const classes = clsx(
    baseStyle,
    sizeStyle,
    variantStyle,
    fullWidth ? "w-full" : "",
    className
  );

  return (
    <div className="">
      {label && (
        <label className="mb-2 block font-semibold text-slate-700 dark:text-white ">
          {label}
        </label>
      )}
      <select className={classes} {...rest}>
        {children}
      </select>
      {error && <p className="mt-2  text-red-600">{error}</p>}
    </div>
  );
};

export default SimpleSelect;
