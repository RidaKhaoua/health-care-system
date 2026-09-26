import Link from "next/link";
import { Card, CardContent, CardHeader } from "./ui/card";
import { Button } from "./ui/button";
import { User } from "lucide-react";
import ProfileImage from "./ProfileImage";

interface IAvailableDoctors {
  data: {
    id: number;
    day: string;
    start_time: string;
    close_time: string;
    doctor: IDoctor;
  }[];
}

function AvailableDoctors({ data }: IAvailableDoctors) {
  return (
    <Card className="rounded-md bg-white!  shadow-md border border-slate-200">
      <CardHeader>
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-xl text-black">Available Doctors</h3>
          <Link href={"/record"} className="text-slate-400 hover:underline">
           View All
          </Link>
        </div>
      </CardHeader>
      <CardContent>
      {data.length > 0 ? (
        data.map((item) => (
            <div key={item.doctor.id} className="flex items-center justify-between mb-5 even:bg-slate-100 p-2 rounded-md">
              <div className="flex items-center gap-3">
                <ProfileImage
                  imageUrl={item.doctor.img}
                  name={item.doctor.name}
                />
                <div className="space-y-0.5">
                  <p className="text-sm text-black font-semibold">{item.doctor.name}</p>
                  <p className="text-xs text-slate-500">
                    {item.doctor.specialization}
                  </p>
                  <p className="text-slate-400">{item.doctor.phone}</p>
                </div>
              </div>
              <div className="space-y-0.5">
                <p className="text-slate-400">Available</p>
                <p className="text-black">{item.start_time} - {item.close_time}</p>
              </div>
            </div>
        ))
      ) : (
        <div className="h-40 flex flex-col gap-4 items-center justify-center text-slate-500">
          <User className="size-10" />
          <p className="text-md">No Doctor avaialable now!</p>
        </div>
      )}
      </CardContent>
    </Card>
  );
}

export default AvailableDoctors;
