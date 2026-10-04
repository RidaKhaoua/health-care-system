import Navbar from "@/components/Navbar";
import SideBar from "@/components/SideBar";
import { SIDEBAR_LINKS } from "@/constants";
import { Role } from "@/lib/generated/prisma/enums";
import { getRoles } from "@/utils/roles";
import React, { ReactNode, useCallback } from "react";

async function layout({ children }: { children: ReactNode }) {
  const role = await getRoles();
  return (
    <div className="flex  bg-slate-100 min-h-screen">
      <div className=" w-[14%]  md:w-[13%] lg:w-[16%]  ">
        <SideBar role={role?.toUpperCase() as Role} />
      </div>
      <div className="w-[84%] md:w-[92%] lg:w-[86%] bg-[#F7F8FA]">
        {/* Navbar */}
        <Navbar />
        <div className=" p-2">{children}</div>
      </div>
    </div>
  );
}

export default layout;
