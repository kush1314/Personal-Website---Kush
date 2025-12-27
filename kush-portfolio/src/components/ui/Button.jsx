import React from "react";
import clsx from "clsx";

export function Button({ className = "", variant = "solid", size = "md", children, ...props }) {
  const sizes = {
    sm: "px-3 py-2 text-sm",
    md: "px-4 py-2",
    lg: "px-6 py-3 text-lg",
  };
  const variants = {
    solid: "bg-orange-600 text-white hover:bg-orange-700 shadow-sm",
    outline: "border-2 border-orange-600 text-orange-600 hover:bg-orange-50 bg-transparent",
    ghost: "text-orange-700 hover:bg-orange-50 bg-transparent",
  };
  return (
    <button
      className={clsx(
        "rounded-xl font-semibold transition-colors disabled:opacity-60 disabled:cursor-not-allowed focus:outline-none focus:ring-4 focus:ring-orange-200",
        sizes[size],
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
