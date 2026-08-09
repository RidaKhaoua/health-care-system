import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";
import Link from "next/link";

interface ILink {
  href: string;
  name: string;
  Icon: LucideIcon;
  isActive?: boolean;
}

function Lien({ href, name, Icon, isActive }: ILink) {
  return (
    <Link
      href={`${href}`}
      className={
        cn("flex justify-center  lg:justify-start gap-3  duration-300 p-1 md:p-4 rounded-md items-center text-slate-500  ", isActive ? "bg-slate-200 text-blue-500" : "hover:bg-slate-200 hover:text-blue-500 ")
      }
    >
      <span>{<Icon />}</span>
      <span className="hidden lg:block">{name}</span>
    </Link>
  );
}

export default Lien;
