import { cn } from "@/lib/utils";
import React from "react";

export type TVariants = "default" | "success" | "error" | "warning";

interface IStatusBage {
  variants: TVariants;
  text: string;
}

export const statusBadgeColors: Record<TVariants, string> = {
  success: "text-green-500 bg-green-300/50",
  error: "text-red-500 bg-red-300/50",
  warning: "text-orange-500 bg-orange-300/50",
  default: "text-slate-500 bg-slate-300/50",
};

function StatusBadge({ variants, text }: IStatusBage) {
  return (
    <span
      className={cn(
        "rounded-md p-1 text-center  capitalize font-medium  inline-block min-w-20 text-xs lg:text-sm ",
        statusBadgeColors[variants],
      )}
    >
      {text}
    </span>
  );
}

export default StatusBadge;
