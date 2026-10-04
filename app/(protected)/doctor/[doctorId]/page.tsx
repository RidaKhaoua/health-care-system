
import DoctorRatingContainer from "@/components/DoctorRatingContainer";
import RecentAppointment from "@/components/RecentAppointment";
import EmptyData from "@/components/shared/EmptyData";
import QuickLinks from "@/components/shared/QuickLinks";
import SmallCard from "@/components/SmallCard";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover";
import StatusBadge from "@/components/ui/StatusBadge";
import UserInfo from "@/components/UserInfo";
import { DOCTOR_STATUS } from "@/constants";
import { IRecentAppointment } from "@/types/data-type";
import { getDoctorProfile } from "@/utils/services/doctor";
import { auth } from "@clerk/nextjs/server";
import { format } from "date-fns";


async function DoctorProfile(params: {
  params: Promise<{ doctorId: string }>;
}) {
 
  const paramsUrl = await params.params;
  let id = paramsUrl.doctorId;
  if (paramsUrl.doctorId.trim().toLowerCase() === "self") {
    const user = await auth();
    id = user.userId!;
  }
  const response = await getDoctorProfile(id);
  if (response.error) {
    return <EmptyData message={response.message!} />;
  }

  const recentAppointment: IRecentAppointment[] | undefined =
    response.data?.appointments.map((item) => ({
      id: item.id,
      patient_Id: item.patient.id,
      patientFirstName: item.patient.first_name,
      patientLastName: item.patient.last_name,
      dateAppointment: item.appointment_date,
      gender: item.patient.gender,
      img: item.patient.img,
      status: item.status,
      time: item.time,
    }));

  return (
    <div className=" min-h-screen xl:flex xl:flex-row p-2 xl:p-4 gap-6 xl:gap-4 space-y-2 max-sm:overflow-y-auto  ">
      {/* Left */}

      <div className="w-full lg:w-3/3 space-y-4 lg:space-y-10">
        <div className="flex flex-col lg:flex-row gap-4">
          <UserInfo
            className="w-full lg:w-90"
            img={response.data?.img}
            fullName={response.data?.name!}
            email={response.data?.email!}
            totalAppointments={response.data?.appointments.length!}
          />
          <Card className="flex flex-col lg:flex-row  justify-between bg-white! shadow-md border border-slate-100 w-full p-6">
            {/* Top */}
            <div className=" space-y-4">
              <SmallCard
                label="Specialization"
                value={response.data?.specialization!}
              />
              <SmallCard label="Phone" value={response.data?.phone!} />
            </div>
            {/* Midlle */}
            <div className="space-y-4">
              <SmallCard
                label="Joined At"
                value={format(response.data?.created_at!, "yyyy-MM-dd")!}
              />
              <SmallCard
                label="Rating"
                value={response.data?.ratings.toString() || "0"}
              />
            </div>
            {/* Bottom */}
            <div className="space-y-4">
              <SmallCard label="Working days">
                <Popover>
                  <PopoverTrigger
                    render={
                      <Button className="hover:bg-black" variant="secondary">
                        open
                      </Button>
                    }
                  />
                  <PopoverContent align="center">
                    <PopoverHeader>
                      <PopoverTitle>Working Days</PopoverTitle>
                      <div className="mt-4">
                        {response.data?.working_days.map((item) => (
                          <div
                            key={item.id}
                            className="text-black flex space-y-4 items-center justify-between"
                          >
                            <p className="text-slate-400">{item.day}</p>
                            <p className="text-white">
                              {item.start_time} - {item.close_time}
                            </p>
                          </div>
                        ))}
                      </div>
                    </PopoverHeader>
                  </PopoverContent>
                </Popover>
                {/* <Dialog>
                  <DialogTrigger
                    render={<Button className="hover:bg-black" variant="secondary">open</Button>}
                  />
                  <DialogContent className="bg-white! shadow-md">
                    <DialogTitle className="text-black! flex items-center gap-2">
                      <Calendar className="size-4" />
                      Working Days
                    </DialogTitle>
                    <div className="mt-4">
                      {response.data?.working_days.map(item => (<div className="text-black flex space-y-4 items-center justify-between">
                        <p className="text-slate-400">{item.day}</p>
                        <p>{item.start_time} - {item.close_time}</p>
                      </div>))}
                    </div>
                  </DialogContent>
                </Dialog> */}
              </SmallCard>
              <SmallCard label="Available Status">
                <StatusBadge
                  text={response.data?.availability_status?.toLowerCase()!}
                  variants={
                    DOCTOR_STATUS[
                      response.data?.availability_status as "ACTIVE" | "BLOCKED"
                    ]
                  }
                />
              </SmallCard>
            </div>
          </Card>
        </div>
        <RecentAppointment
          data={recentAppointment ?? []}
          isShowedProfileDoctor={false}
        />
      </div>
      {/* Right */}
      <div className="w-full lg:w-4/8 h-20 space-y-4">
        {/* Quick Links */}
        <QuickLinks
          links={[
            {
              name: "Doctor's & Appointments",
              href: `/records/appointments?id=${id}`,
            },
            ...(paramsUrl.doctorId === "self"
              ? [{ name: "Edit Information", href: `/patient/registration` }]
              : []),
          ]}
        />
        {/* Doctor Rating */}
        <DoctorRatingContainer id={id} />
      </div>
    </div>
  );
}

export default DoctorProfile;
