import React from "react";
import { Card } from "./ui/card";
import ProfileImage from "./ProfileImage";
import { cn } from "@/lib/utils";

interface IUserInfoProps {
  fullName: string;
  img?: string | null;
  email: string;
  totalAppointments: number;
  className?: string;
}

function UserInfo({
  fullName,
  img,
  email,
  totalAppointments,
  className,
}: IUserInfoProps) {
  return (
    <Card className={cn("w-full bg-white! shadow-md border border-slate-100 flex flex-col justify-center items-center gap-2",className)}>
      <ProfileImage imageUrl={img} name={fullName} />
      <p className="text-black font-bold text-2xl">{fullName}</p>
      <p className="text-slate-400">{email}</p>
      <div className="text-center">
        <p className="text-black font-bold">{totalAppointments}</p>
        <p className="text-slate-400">Appointments</p>
      </div>
    </Card>
  );
}

export default UserInfo;
