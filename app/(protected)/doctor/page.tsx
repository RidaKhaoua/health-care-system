import StatsAppointements from "@/components/charts/StatsAppointements";
import StatsSummary from "@/components/charts/StatsSummary";
import RecentAppointment from "@/components/RecentAppointment";
import UserGreeting from "@/components/shared/UserGreeting";
import StatsCard from "@/components/StatsCard";
import TodaySchedule from "@/components/TodaySchedule";
import { IRecentAppointment } from "@/types/data-type";
import { requireUser } from "@/utils/get-current-user";
import { getDoctorDashboard } from "@/utils/services/doctor";
import { format } from "date-fns";
import { Briefcase, CheckCheck, Database, Users, X } from "lucide-react";

async function DoctorPage() {
  const user = await requireUser();

  const response = await getDoctorDashboard(user?.id);
  //TODO: if user doesn't register redirect into register page
  if (!response.data) {
    return (
      <div className="min-h-screen flex items-center justify-center text-slate-400">
        <div className="space-y-4">
          <Database className="siize-10" />
          <p>{response.message}</p>
        </div>
      </div>
    );
  }

  const recentAppointment: IRecentAppointment[] | undefined =
    response.data?.lastFiveRecords.map((item) => ({
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

  const TodayScheduleAdapter = response.data.patientsOfToday.map((item) => ({
    id: item.patient_id,
    fullName: item.patient.first_name + " " + item.patient.last_name,
    gender: item.patient.gender,
    img: item.patient.img,
    date: format(item.appointment_date, "yyyy-MM-dd"),
  }));

  return (
    <div className="flex flex-col xl:flex-row p-2 xl:p-4 gap-6 xl:gap-4">
      {/* LEFT */}
      <div className="w-full xl:w-[69%] space-y-10">
        <UserGreeting fullName={response.data?.doctorData?.name} />
        <div className="flex items-center gap-3 flex-wrap">
          <StatsCard
            key={"completed"}
            title="Completed"
            subtitle="Total completed"
            Icon={CheckCheck}
            note={response.data.completedAppointment}
            iconClassName="bg-green-500"
          />
          <StatsCard
            key={"patient"}
            title="Number of Patients"
            subtitle="Total Patient Of Today"
            Icon={Users}
            note={response.data.numberOfPatientToday ?? 0}
            iconClassName="bg-blue-500"
          />
          <StatsCard
            key={"appointment"}
            title="Appointments"
            subtitle="Total Appointment"
            Icon={Briefcase}
            note={response.data.totalApointments ?? 0}
            iconClassName="bg-pink-500"
          />
          <StatsCard
            key={"cancelled"}
            title="Cancelled"
            subtitle="Total Canclled"
            Icon={X}
            note={response.data.appointmentStatusCounts.CANCELLED ?? 0}
            iconClassName="bg-red-500"
          />
        </div>
        <div className="h-120">
          <StatsAppointements data={response.data?.monthlyData ?? []} />
        </div>
        <div className="bg-white rounded-xl p-2 md:p-4 mt-8">
          <RecentAppointment
            data={recentAppointment ?? []}
            isShowedProfileDoctor={false}
          />
        </div>
      </div>

      {/* RIGHT */}
      <div className="w-full xl:w-[30%]">
        <div className="w-full h-112.5 mb-8">
          <StatsSummary
            data={{
              pendding: response.data?.appointmentStatusCounts.PENDING ?? 0,
              completed: response.data?.appointmentStatusCounts.COMPLETED ?? 0,
              sheduled: response.data.appointmentStatusCounts.SCHEDULED,
            }}
            total={response.data?.totalApointments ?? 0}
          />
        </div>
        <TodaySchedule data={TodayScheduleAdapter} />
      </div>
    </div>
  );
}

export default DoctorPage;
