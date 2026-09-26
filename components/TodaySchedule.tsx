import { Card, CardContent, CardHeader } from "./ui/card";
import {  Timer, User } from "lucide-react";
import ProfileImage from "./ProfileImage";
import Link from "next/link";

interface ITodayScheduleProps {
  data: {
    id: string;
    fullName: string;
    gender: string;
    date: string;
    img: string | null;
  }[];
}

function TodaySchedule({ data }: ITodayScheduleProps) {
  return (
    <Card className="rounded-md bg-white!  shadow-md border border-slate-200">
      <CardHeader>
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-xl text-black">Today Schedule</h3>
          <Link href={"/records/schedule"} className="text-slate-400 hover:underline">
            View All
          </Link>
        </div>
      </CardHeader>
      <CardContent>
        {data.length > 0 ? (
          data.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between mb-5 even:bg-slate-100 p-2 rounded-md"
            >
              <div className="flex items-center gap-3">
                <ProfileImage
                  imageUrl={item.img}
                  name={item.fullName}
                />
                <div className="space-y-0.5">
                  <p className="text-sm text-black font-semibold">
                    {item.fullName}
                  </p>
                  <p className="text-xs text-slate-500">
                    {item.gender}
                  </p>
                </div>
              </div>
              <div className="space-y-0.5">
                <p className="text-slate-400">Available</p>
                <p className="text-black">
                  {item.date} 
                </p>
              </div>
            </div>
          ))
        ) : (
          <div className="h-40 flex flex-col gap-4 items-center justify-center text-slate-500">
            <Timer className="size-10" />
            <p className="text-md">No Schedule avaialable Today!</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default TodaySchedule;
