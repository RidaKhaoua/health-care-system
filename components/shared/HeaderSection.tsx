import { Briefcase } from "lucide-react";
import  { ReactNode } from "react";
import SearchInput from "../SearchInput";
import { Role } from "@/lib/generated/prisma/enums";
import AppointmentContainer from "../AppointmentContainer";

interface IHeaderSectionProps {
    totalRecord:number;
    userRole: Role;
    title:string;
    children:ReactNode;
}

function HeaderSection({totalRecord, userRole, title,children}:IHeaderSectionProps) {
  return (
    <div className="flex items-center flex-wrap gap-1.5 lg:gap-0 justify-between mb-4 bg-white rounded-md border border-slate-200 p-4">
      <h1 className="font-bold text-sm  lg:text-xl flex  items-center gap-2 text-black">
        <Briefcase className="size-5" />
        {totalRecord || 0}
        <span>{title}</span>
      </h1>
      <div className="flex items-center gap-2 flex-wrap md:flex-nowrap">
        <SearchInput />
        {userRole === "PATIENT".toLocaleLowerCase() ? (
            children
        ) : null}
      </div>
    </div>
  );
}

export default HeaderSection;
