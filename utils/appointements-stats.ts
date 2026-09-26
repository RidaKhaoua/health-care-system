import { Briefcase, BriefcaseMedical, Check, RotateCwFadingClock, ShieldX, User, Users2 } from "lucide-react";

interface IAppointementStats {
  pending: number;
  scheduled:number;
  cancelled: number;
  completed: number;
  total: number;
}
export const appointementStats = ({
  pending,
  cancelled,
  completed,
  scheduled,
  total,
}: IAppointementStats) => {
  return [
    {
      title: "Appointments",
      note: total,
      icon: Briefcase,
      subtitle: "Total appointments",
      iconClassName: "bg-blue-300 text-blue-500",
    },
    {
      title: "Cancelled",
      note: cancelled,
      icon: ShieldX,
      subtitle: "Total Cancelled",
      iconClassName: "bg-red-300 text-red-500",
    },
    {
      title: "Pending",
      note: pending + scheduled,
      icon: RotateCwFadingClock,
      subtitle: "Total Pending",
      iconClassName: "bg-orange-300 text-orange-500",
    },
    {
      title: "Completed",
      note: completed,
      icon: Check,
      subtitle: "Total Completed",
      iconClassName: "bg-green-300 text-green-500",
    },
  ];
};

interface IDoctorStats {
  patient:number,
  nurses: number,
  appointements: number,
  consultation: number
}

export const doctorStats = ({
  patient,
  nurses,
  appointements,
  consultation
}: IDoctorStats) => {
  return [
    {
      title: "Patients",
      note: patient,
      icon: Users2,
      subtitle: "Total patients",
      iconClassName: "bg-blue-300 text-blue-500",
    },
    {
      title: "Nurses",
      note: nurses,
      icon: User,
      subtitle: "Total nurses",
      iconClassName: "bg-red-300 text-red-500",
    },
    {
      title: "Appointements",
      note: appointements,
      icon: Briefcase,
      subtitle: "Total appointements",
      iconClassName: "bg-orange-300 text-orange-500",
    },
    {
      title: "Consultation",
      note: BriefcaseMedical,
      icon: Check,
      subtitle: "Total Consultation",
      iconClassName: "bg-green-300 text-green-500",
    },
  ];
};
