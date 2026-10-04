import AvailableDoctors from "@/components/AvailableDoctors";
import StatsAppointements from "@/components/charts/StatsAppointements";
import StatsSummary from "@/components/charts/StatsSummary";
import RecentAppointment from "@/components/RecentAppointment";
import EmptyData from "@/components/shared/EmptyData";
import UserGreeting from "@/components/shared/UserGreeting";
import StatsCard from "@/components/StatsCard";
import { IRecentAppointment } from "@/types/data-type";
import { dashboardAdmin } from "@/utils/services/admin";
import { Briefcase, User, Users } from "lucide-react";


async function AdminPage() {
  const response = await dashboardAdmin();
  if (response.error || !response.data) {
    return <EmptyData message={response.message!} />;
  }
  const recentAppointment: IRecentAppointment[] | undefined =
    response.data?.last5Records.map((item) => ({
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
      <div className="w-full xl:w-[69%] space-y-10">
        <div className="flex items-center gap-3 flex-wrap">
          <StatsCard
            key={"patients"}
            title="Patients"
            subtitle="Total patients"
            Icon={Users}
            note={response.data?.totalPatients}
            iconClassName="bg-blue-500"
          />
          <StatsCard
            key={"doctors"}
            title="Doctors"
            subtitle="Total doctors"
            Icon={User}
            note={response.data?.totalDoctors}
            iconClassName="bg-red-500"
          />
          <StatsCard
            key={"appointments"}
            title="Appointments"
            subtitle="Total Appointments"
            Icon={Briefcase}
            note={response.data?.totalApointments}
            iconClassName="bg-yellow-500"
          />
          <StatsCard
            key={"staffs"}
            title="Staffs"
            subtitle="Total Staffs"
            Icon={Users}
            note={response.data?.totalStaffs}
            iconClassName="bg-green-500"
          />
        </div>
        <div className="h-120">
          <StatsAppointements data={response.data?.monthlyData ?? []} />
        </div>
        <div className="bg-white rounded-xl p-2 md:p-4 mt-8">
          <RecentAppointment
            data={recentAppointment}
            isShowedProfileDoctor={true}
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
       <div className="space-y-6">
          <AvailableDoctors
            data={response.data?.availableDoctors ?? []}
          />
          
        </div>
      </div>
    </div>
  );
}

export default AdminPage;
