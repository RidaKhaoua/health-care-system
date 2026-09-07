
import { Card, CardContent, CardHeader } from "./ui/card";
import ProfileImage from "./ProfileImage";
import StatusBadge from "./ui/StatusBadge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import { Calendar, Clock, EllipsisIcon, User } from "lucide-react";
import AppoitmentDetails from "./AppoitmentDetails";
import { format } from "date-fns";
import { APPOINTMENTS_STATUS } from "@/constants";
import { AppointmentStatus } from "@/lib/generated/prisma/enums";

interface ICardAppointment {
  img: string | null;
  fullName: string;
  status: AppointmentStatus;
  dateAppointment: Date;
  doctorName: string;
}

function CardAppointment({
  img,
  fullName,
  dateAppointment,
  status,
  doctorName,
}: ICardAppointment) {
  return (
    <Card className="bg-white border border-slate-200 shadow-md ">
      <CardHeader>
        <div className="flex  justify-between gap-4">
          <div className="flex  gap-2">
            <ProfileImage imageUrl={img} name={fullName} />
            <div className="space-y-1">
              <p className=" text-black font-semibold">{fullName}</p>
              <p className="text-slate-400 text-sm">Patient</p>
              <StatusBadge
                variants={APPOINTMENTS_STATUS[status]}
                text={status.toLowerCase()}
                
              />
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button>
                  <EllipsisIcon className="size-4" />
                </Button>
              }
            />
            <DropdownMenuContent
              className={"bg-white border border-slate-300 space-y-1 py-2"}
            >
              <DropdownMenuItem className="text-slate-500 cursor-pointer">
                <AppoitmentDetails id={1} />
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center gap-2">
          <Calendar className="size-4 text-slate-600" />
          <p className="text-black">
            {format(new Date(dateAppointment), "MM/dd/yyyy")}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Clock className="size-4 text-slate-600" />
          <p className="text-black">{format(new Date(dateAppointment), "p")}</p>
        </div>

        <div className="flex items-center gap-2">
          <User className="size-4 text-slate-600" />
          <p className="text-black">{doctorName}</p>
        </div>
      </CardContent>
    </Card>
  );
}

export default CardAppointment;
