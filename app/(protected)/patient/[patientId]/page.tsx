import MedicalHistoryContainer from "@/components/MedicalHistoryContainer";
import PatientRatingContainer from "@/components/PatientRatingContainer";
import ProfileImage from "@/components/ProfileImage";
import SmallCard from "@/components/SmallCard";
import { Card } from "@/components/ui/card";
import { getPatientFullDataById } from "@/utils/services/patient";
import { auth } from "@clerk/nextjs/server";
import { format } from "date-fns";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";

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
    <div className="flex flex-col gap-4 lg:flex-row p-2">
      {/* Left */}
      <div className=" w-full lg:w-3/3 space-y-4">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Info User */}
          <Card className="w-full lg:w-90 bg-white! shadow-md border border-slate-100 flex flex-col justify-center items-center gap-2">
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
          <Card className="flex flex-col lg:flex-row justify-between  bg-white! shadow-md border border-slate-100 w-full p-6">
            {/* Top */}
            <div className=" space-y-4">
              <SmallCard label="Gender" value={data.gender} />
              <SmallCard
                label="Date of Birth"
                value={format(data.date_of_birth, "yyyy-MM-dd")}
              />
              <SmallCard label="Phone Number" value={data.phone} />
            </div>
            {/* Midlle */}
            <div className="space-y-4">
              <SmallCard label="Marital Status" value={data.marital_status} />
              <SmallCard label="Blood Group" value={data.blood_group!} />
              <SmallCard label="Adress" value={data.address} />
            </div>
            {/* Bottom */}
            <div className="space-y-4">
              <SmallCard
                label="Contact Person"
                value={data.emergency_contact_name}
              />
              <SmallCard
                label="Emergency Contact"
                value={data.emergency_contact_number}
              />
              <SmallCard
                label="Last Visit"
                value={data.lastVisit ? format(data.lastVisit, "yyyy-MM-dd") : "No last visit"}
              />
            </div>
          </Card>
        </div>
        {/* Medical History  */}
        <MedicalHistoryContainer patientId={data.id} />
      </div>
      {/* Right */}
      <div className="w-full lg:w-4/8 h-20 space-y-4">
      {/* Quick Links */}
        <Card className="bg-white! text-black shadow-md border border-slate-100 p-4">
          <h1 className="mb-4 font-bold text-xl">Quick Links</h1>
          <div className="flex flex-wrap gap-4">
            <Link
              className="p-3 rounded-md bg-yellow-50 text-sm shadow-md text-black hover:underline"
              href={`/records/appointments?id=${id}`}
            >
              Patients&apos; Appointments
            </Link>

            <Link
              className="p-3 rounded-md bg-purple-50 text-sm shadow-md text-black hover:underline"
              href={`?cat=medical-history`}
            >
              Medical Records
            </Link>

            <Link
              className="p-3 rounded-md bg-violet-100 text-sm shadow-md text-black hover:underline"
              href={`?cat=payements`}
            >
              Medical Bills
            </Link>

            <Link
              className="p-3 rounded-md bg-pink-50 text-sm shadow-md text-black hover:underline"
              href="/"
            >
              Dashboard
            </Link>

            <Link
              className="p-3 rounded-md bg-blue-50 text-sm shadow-md text-black hover:underline"
              href={`#`}
            >
              Lab Test & Result
            </Link>
            {patientId === "self" ? (
              <Link
                className="p-3 rounded-md bg-black/50 text-sm shadow-md text-black hover:underline"
                href={`/patient/registration`}
              >
                Edit Information
              </Link>
            ) : null}
          </div>
        </Card>
        <PatientRatingContainer/>
      </div>
    </div>
  );
}

export default PatientProfile;
