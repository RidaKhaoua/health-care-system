"use client";

import { useAuth, UserButton } from "@clerk/nextjs";
import { Bell } from "lucide-react";
import { usePathname } from "next/navigation";
import  { useCallback } from "react";

function Navbar() {
  const path = usePathname();
  const user = useAuth();

  const formatedPathName = useCallback((): string => {
    const splitPath = path.split("/");
    const lastIndex = splitPath.length - 1 > 2 ? 2 : splitPath.length - 1;
    const formatedPath = splitPath[lastIndex].replace(/-/g, " ");

    return formatedPath;
  }, [path]);

  const formatedPath = formatedPathName();

  return (
    <div className="border-b border-slate-300 py-4 h-20  px-4 flex items-center justify-between">
      <p className="text-gray-500 text-xl font-medium capitalize">
        {formatedPath || "Overview"}
      </p>
      <div className="flex items-center gap-4">
        <div className="relative cursor-pointer">
          <Bell className="size-6 text-black" />
          <span className="absolute -top-3 -right-1 rounded-full h-4 w-4 text-white text-sm bg-red-500 flex items-center justify-center">
            2
          </span>
        </div>
        {user.userId ? <UserButton /> : null}
      </div>
    </div>
  );
}

export default Navbar;
