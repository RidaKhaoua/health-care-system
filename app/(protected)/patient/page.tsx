import AvailableDoctors from "@/components/AvailableDoctors";
import StatsAppointements from "@/components/charts/StatsAppointements";
import StatsSummary from "@/components/charts/StatsSummary";
import PatientRating from "@/components/PatientRating";
import RecentAppointment from "@/components/RecentAppointment";
import StatsCard from "@/components/StatsCard";
import { Button } from "@/components/ui/button";
import { IRecentAppointment } from "@/types/data-type";
import { appointementStats } from "@/utils/appointements-stats";
import { requireUser } from "@/utils/get-current-user";
import { getPatientDashboard } from "@/utils/services/patient";
import Link from "next/link";
import { redirect } from "next/navigation";
import { useMemo } from "react";

async function PatientPage() {
  const user = await requireUser();

  const { data } = await getPatientDashboard(user?.id);

  if (user && !data?.patient) {
    redirect("/patient/registration");
  }

  const appointementStat = appointementStats({
    pending: data?.appointmentCounts.PENDING ?? 0,
    cancelled: data?.appointmentCounts.CANCELLED ?? 0,
    completed: data?.appointmentCounts.COMPLETED ?? 0,
    scheduled: data?.appointmentCounts.SCHEDULED ?? 0,
    total: data?.totalApointments ?? 0,
  });

  const recentAppointment: IRecentAppointment[] | undefined =
    data?.lastFiveRecords.map((item) => ({
      id: item.id,
      patient_Id: item.patient_id,
      docotr_Id: item.doctor_id,
      patientFirstName: item.patient.first_name,
      patientLastName: item.patient.last_name,
      doctorName: item.doctor.name,
      dateAppointment: item.appointment_date,
      gender: item.patient.gender,
      img: item.patient.img,
      status: item.status,
      time: item.time,
    }));

  return (
    <div className="flex flex-col xl:flex-row p-2 xl:p-4 gap-6 xl:gap-4">
      {/* LEFT */}
      <div className=" w-full xl:w-[69%] space-y-10 ">
        <div className="flex justify-between items-center ">
          <h1 className="text-sm xl:text-2xl font-bold text-black flex gap-1.5 items-center">
            <span>Welcome</span>
            <span>
              {data?.patient.first_name || user.firstName}
              {data?.patient.last_name || user.lastName}
            </span>
          </h1>
          <div className="flex items-center gap-2">
            <Button variant="secondary" className="hover:bg-black/30">
              {new Date().getFullYear()}
            </Button>
            <Link href={"/patient/self"}>
              <Button
                variant="outline"
                className="text-black cursor-pointer bg-white!"
              >
                View Profile
              </Button>
            </Link>
          </div>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          {appointementStat.map((item) => (
            <StatsCard
              key={item.title}
              title={item.title}
              Icon={item.icon}
              iconClassName={item.iconClassName}
              note={item.note ?? 0}
              subtitle={item.subtitle}
            />
          ))}
        </div>
        <div className="h-120">
          <StatsAppointements data={data?.monthlyData ?? []} />
        </div>
        <div className="bg-white rounded-xl p-2 md:p-4 mt-8">
          <RecentAppointment data={recentAppointment ?? []} />
        </div>
      </div>
      {/* Right */}
      <div className="w-full xl:w-[30%]">
        <div className="w-full h-112.5 mb-8">
          <StatsSummary
            data={{
              pendding: data?.appointmentCounts.PENDING ?? 0,
              completed: data?.appointmentCounts.COMPLETED ?? 0,
              sheduled: data?.appointmentCounts.SCHEDULED ?? 0,
            }}
            total={data?.totalApointments ?? 0}
          />
        </div>
        <div className="space-y-6">
          <AvailableDoctors
            data={data?.availableDoctorRelatedWithWorkingDay ?? []}
          />
          <PatientRating data={data?.patientRating ?? []} />
        </div>
      </div>
    </div>
  );
}

export default PatientPage;
