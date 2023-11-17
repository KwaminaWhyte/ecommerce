import type { FC, HTMLAttributes, ReactNode } from "react";
import clsx from "clsx";
import { Link } from "@remix-run/react";

interface ButtonProps extends HTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  className?: string;
  fullWidth?: boolean;
  color?: "primary" | "secondary" | "warning" | "error" | "success";
  size?: "sm" | "md" | "lg";
  variant?: "solid" | "outline" | "ghost";
  to: string;
}

const LinkButton: FC<ButtonProps> = ({
  to = "",
  children,
  className,
  fullWidth = false,
  color = "primary",
  size = "md",
  variant = "solid",
}) => {
  const baseStyle =
    "rounded-lg shadow-sm font-sm focus:outline-none tansition-all duration-300";

  const sizeStyle = {
    sm: "px-2 py-1 text-xs",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-lg",
  }[size];

  const colorStyle = {
    primary: "bg-blue-600 hover:bg-blue-700 text-white",
    secondary: "bg-slate-500 hover:bg-slate-600 text-white",
    warning: "bg-yellow-500 hover:bg-yellow-600 text-white",
    error: "bg-red-500 hover:bg-red-600 text-white",
    success: "bg-green-500 hover:bg-green-600 text-white",
  }[color];

  const variantStyle = {
    solid: `shadow-sm ${colorStyle}`,
    outline: `border border-${color}-500 text-${color}-500 hover:bg-${color}-500 `,
    ghost: "hover:bg-slate-100",
  }[variant];

  const classes = clsx(
    baseStyle,
    sizeStyle,
    variantStyle,
    fullWidth ? "w-full" : "",
    className
  );

  return (
    <Link to={to} className={classes}>
      {children}
    </Link>
  );
};

export default LinkButton;
