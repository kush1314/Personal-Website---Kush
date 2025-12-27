import React from "react";
import clsx from "clsx";

export function Badge({ className = "", children }) {
  return <span className={clsx("inline-block rounded-full px-3 py-1 text-sm bg-orange-100 text-orange-700", className)}>{children}</span>;
}
