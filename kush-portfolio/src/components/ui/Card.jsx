import React from "react";
import clsx from "clsx";

export function Card({ className = "", children }) {
  return <div className={clsx("bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg", className)}>{children}</div>;
}

export function CardContent({ className = "", children }) {
  return <div className={clsx("p-6", className)}>{children}</div>;
}
