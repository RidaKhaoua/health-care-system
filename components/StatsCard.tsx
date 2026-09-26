import { LucideIcon } from "lucide-react";
import Link from "next/link";
import { Card, CardContent, CardFooter, CardHeader } from "./ui/card";
import { cn } from "@/lib/utils";

interface IStatsCard {
  title: string;
  note: number;
  subtitle: string;
  Icon: LucideIcon;
  iconClassName: string;
}

function StatsCard({ title, note, Icon, subtitle, iconClassName }: IStatsCard) {
  return (
    <Card className="border border-slate-200 bg-white shadow-md w-full xl:w-62">
      <CardHeader>
        <div className="flex items-center justify-between">
          <h1 className=" font-bold text-black text-sm">{title}</h1>
          <Link href={"#"} className="hover:underline  text-sm text-slate-500">
            See details
          </Link>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-4">
          <div className="rounded-md flex justify-center items-center">
            {<Icon className={cn("size-10 p-2 rounded-full", iconClassName)} />}
          </div>
          <p className="text-3xl font-bold text-black">{note || 0}</p>
        </div>
      </CardContent>
      <CardFooter className="bg-transparent">
        <p className="text-slate-400">{subtitle}</p>
      </CardFooter>
    </Card>
  );
}

export default StatsCard;
