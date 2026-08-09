"use client"
import { Role } from "@/lib/generated/prisma/enums";
import { SignOutButton } from "@clerk/nextjs";
import { ActivitySquare, LogOut, LucideIcon } from "lucide-react";
import Link from "next/link";
import React, { ReactNode } from "react";
import Lien from "./Link";
import { SIDEBAR_LINKS } from "@/constants";
import { usePathname } from "next/navigation";


interface ISideBar {
  role: Role;
}

function SideBar({  role }: ISideBar) {
    const path = usePathname();
    console.log(path)
  return (
    <div className="flex flex-col justify-between h-full border-r border-slate-300 overflow-y-auto">
      <div>
        {/* Title */}
        <div className="flex items-center justify-center   md:gap-2  border-b border-slate-300 bg-white text-xl text-black   text-center h-20 max-h-20 py-4">
          <div className="bg-blue-500 text-white h-8 w-8 flex items-center justify-center rounded-md">
            <ActivitySquare className="size-4" />
          </div>
          <Link href={"/"} className="hidden lg:block">
            HealthCare
          </Link>
        </div>
        {/* Links */}
        <div className="mt-8 px-1 md:px-4">
          {SIDEBAR_LINKS.map((item) => {
            return (
              <div key={item.label} className="flex flex-col gap-2 mb-8">
                {/* Label */}
                <span className="text-slate-400 font-medium text-[11px] text-center lg:font-bold md:text-base  md:text-start">
                  {item.label}
                </span>
                {/* Link */}
                <div className="flex flex-col ">
                  {item.links.map((link, index) =>
                    link.access.includes(role.toLowerCase()) ? (
                     <Lien
                     key={index}
                          href={link.name === "Dashboard" ? link.href + role.toLowerCase() : link.href}
                          name={link.name}
                          Icon={link.icon}
                          isActive={link.href === path || link.name === "Dashboard" && link.href + role.toLowerCase() === path}
                        />
                    
                    ) : null,
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <div className="border-t border-slate-300 px-4 py-2">
        <div className="px-1 md:px-4 flex items-center justify-center lg:justify-start p-1 md:p-4 gap-2 text-slate-500 cursor-pointer ">
          <LogOut />
          <div className="hidden lg:block">
            <SignOutButton />
          </div>
        </div>
      </div>
    </div>
  );
}

export default SideBar;
