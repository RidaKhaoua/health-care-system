import ProfileImage from "@/components/ProfileImage";
import SmallCard from "@/components/SmallCard";
import { Card } from "@/components/ui/card";
import { getPatientFullDataById } from "@/utils/services/patient";
import { auth } from "@clerk/nextjs/server";
import { format } from "date-fns";

interface ParamsProps {
  params: Promise<{ patientId: string }>;
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}
async function PatientProfile(props: ParamsProps) {
  const searchParams = await props.searchParams;
  const params = await props.params;

  let id = params.patientId;
  let patientId = params.patientId;
  const cat = searchParams?.cat || "medical-history";

  if (patientId === "self") {
    const { userId } = await auth();
    id = userId!;
  } else {
    id = patientId;
  }

  const { data } = await getPatientFullDataById(id);

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center ">
        <p className="text-black">No Data Found</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row p-6">
      {/* Left */}
      <div className="flex flex-col lg:flex-row gap-4 w-3/5 bg-red-300">
        {/* Info User */}
        <Card className="w-90 bg-white! shadow-md border border-slate-100 flex flex-col justify-center items-center gap-2">
          <ProfileImage
            imageUrl={data?.img}
            name={data.first_name + " " + data?.last_name}
          />
          <p className="text-black font-bold text-2xl">
            {data.first_name} {data.last_name}
          </p>
          <p className="text-slate-400">{data.email}</p>
          <div className="text-center">
            <p className="text-black">{data.totalAppointments}</p>
            <p className="text-slate-400">Appointments</p>
          </div>
        </Card>
        <Card className="bg-white! shadow-md border border-slate-100 w-full p-6 space-y-3">
          {/* Top */}
          <div className="flex items-center justify-between">
            <SmallCard label="Gender" value={data.gender} />
            <SmallCard
              label="Date of Birth"
              value={format(data.date_of_birth, "yyyy-MM-dd")}
            />
            <SmallCard label="Phone Number" value={data.phone} />
          </div>
          {/* Midlle */}
          <div className="flex items-center justify-between">
            <SmallCard label="Gender" value={data.gender} />
            <SmallCard
              label="Date of Birth"
              value={format(data.date_of_birth, "yyyy-MM-dd")}
            />
            <SmallCard label="Phone Number" value={data.phone} />
          </div>
          {/* Bottom */}
          <div></div>
        </Card>
      </div>
      {/* Right */}
      <div className="w-4/10 bg-green-300 h-20">left</div>
    </div>
  );
}

export default PatientProfile;
