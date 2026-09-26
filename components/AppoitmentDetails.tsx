import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import {
  Briefcase,
  Calendar,
  Eye,
  Home,
  Mail,
  Phone,
  User,
} from "lucide-react";
import { Button } from "./ui/button";
import { getAppointmentById } from "@/utils/services/appointment";
import { format } from "date-fns";
import ProfileImage from "./ProfileImage";
import StatusBadge from "./ui/StatusBadge";
import { APPOINTMENTS_STATUS } from "@/constants";
import { auth } from "@clerk/nextjs/server";
import { getRoles } from "@/utils/roles";
import AppointementAction from "./AppointementAction";

interface IAppointmentDetailsProps {
  id:number;
  showTextDetails?:boolean
}

async function AppoitmentDetails({ id, showTextDetails=false }: IAppointmentDetailsProps) {
  const { data } = await getAppointmentById(id);
  if (!data) return null;
  const { userId } = await auth();

  return (
    <Dialog>
      <DialogTrigger
        render={
          <Button className="hover:bg-slate-100 flex items-center justify-start bg-transparent">
            <Eye className="size-4" />
            {showTextDetails ? <span>View Details</span> : null}
            
          </Button>
        }
      />
      <DialogContent className="bg-white md:max-w-2xl text-black">
        <>
          <DialogHeader>
            <DialogTitle className="text-black font-bold text-2xl">
              Patient Appointment
            </DialogTitle>
            <DialogDescription>
              This appointements was booked on the{" "}
              {format(data.appointment_date, "PPPPpp")}
            </DialogDescription>
          </DialogHeader>
          {data.status === "CANCELLED" ? (
            <div className="bg-orange-100 p-3 rounded-md mt-4 text-black">
              <span className="font-bold text-sm">
                This appointment has ben cancelled
              </span>
              <p className="text-sm">
                <strong>Reason</strong>: {data.reason}
              </p>
            </div>
          ) : null}
          {/* Personal information */}
          <div className="mb-3">
            <h3 className="flex items-center gap-2 font-bold mb-3 bg-blue-400 p-2 rounded-md text-white">
              <User className="size-6" />
              Personal information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-6 border rounded-md border-slate-200 p-2">
                <ProfileImage
                  imageUrl={data?.patient?.img}
                  name={data.patient.first_name + " " + data.patient.last_name}
                />
                <div className="space-y-0.5 text-sm">
                  <p className="font-bold">
                    {data.patient.first_name} {data.patient.last_name}
                  </p>
                  <div className="flex items-center gap-2  text-gray-600">
                    <Calendar className="size-4" />
                    <p>{format(data.patient.date_of_birth, "MM/dd/yyyy")}</p>
                  </div>
                  <div className="flex items-center gap-2  text-gray-600">
                    <Phone className="size-4" />
                    <p>{data.patient.phone}</p>
                  </div>
                </div>
              </div>
              <div className="border rounded-md border-slate-200 p-2">
                <h4 className="text-slate-400 flex items-center gap-1 ">
                  <Home className="size-4" />
                  Adresse
                </h4>
                <p>{data.patient.address}</p>
              </div>
            </div>
          </div>
          {data.note ? (
            <div className="mb-3">
              <span className="text-sm text-slate-500">Note from Patient</span>
              <p className="text-sm text-slate-500">{data.note}</p>
            </div>
          ) : null}
          {/* Appointement information */}
          <div className="mb-3 p-2 rounded-md">
            <h3 className="font-semibold mb-3">Appointment information</h3>
            <div className="flex items-center justify-around gap-4 max-md:flex-wrap">
              <div className="flex flex-col gap-2">
                <span className="text-sm text-slate-500">Date</span>
                <p className="text-sm text-black font-bold">
                  {format(data.appointment_date, "MMM dd,yyyy")}
                </p>
              </div>
              <div className="flex flex-col gap-2">
                <span className="text-sm text-slate-500">Time</span>
                <p className="text-sm text-black font-bold">{data.time}</p>
              </div>
              <div className="flex flex-col gap-2">
                <span className="text-sm text-slate-500">Status</span>
                <div>
                  <StatusBadge
                    variants={APPOINTMENTS_STATUS[data.status]}
                    text={data.status.toLowerCase()}
                  />
                </div>
              </div>
            </div>
          </div>
          {/* Physicien Information */}
          <div className="mb-3">
            <h3 className="flex items-center gap-2 font-bold mb-3 bg-blue-400 p-2 text-white rounded-md">
              <Briefcase className="size-6" />
              Doctor information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2">
              <div className="flex items-center gap-6">
                <ProfileImage
                  imageUrl={data?.doctor?.img}
                  name={data.doctor.name}
                />
                <div className="space-y-2">
                  <p>
                    <span className="text-slate-400">Doctor: </span>
                    <span className="text-black font-bold">
                      {data.doctor.name}
                    </span>
                  </p>
                  <div className="flex items-center gap-2  text-gray-600">
                    <Briefcase className="size-4" />
                    <p>{data.doctor.specialization}</p>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2  text-gray-600">
                  <Phone className="size-4" />
                  <p>{data.doctor.phone}</p>
                </div>
                <div className="flex items-center gap-2  text-gray-600">
                  <Mail className="size-4" />
                  <p>{data.doctor.email}</p>
                </div>
              </div>
            </div>
          </div>
         
          {/* Appoitment action */}
          {(await getRoles()) === "admin" || data.doctor_id === userId ? (
            <div className="">
              <h3 className="font-bold">Perform Action</h3>
              {/* Appoitment action */}
              <AppointementAction id={data.id} status={data.status} />
            </div>
          ) : null}
        </>
      </DialogContent>
    </Dialog>
  );
}

export default AppoitmentDetails;
