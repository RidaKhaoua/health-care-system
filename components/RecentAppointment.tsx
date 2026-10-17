import { v4 as uuidv4 } from "uuid";
import { Button } from "./ui/button";
import { IRecentAppointment } from "@/types/data-type";
import Table from "./tables/Table";
import { format } from "date-fns";
import StatusBadge from "./ui/StatusBadge";
import { APPOINTMENTS_STATUS, COLUMNS_APPOINETMENTS } from "@/constants";
import ProfileImage from "./ProfileImage";
import AppoitmentDetails from "./AppoitmentDetails";
import Link from "next/link";
import CardAppointment from "./CardAppointment";
interface IRecentAppointments {
  data: IRecentAppointment[];
  isShowedProfileDoctor: boolean;
}

function RecentAppointment({
  data,
  isShowedProfileDoctor,
}: IRecentAppointments) {
  // const router = useRouter();
  const renderData = (item: IRecentAppointment) => {
    return (
      <tr key={uuidv4()} className="text-black even:bg-slate-100 mb-4 ">
        
         <td>
            <div className="flex items-center gap-3">
              <ProfileImage
                name={item.patientFirstName + " " + item.patientLastName}
              />
              <div className="px-2">
                <p className="">
                  {item.patientFirstName} {item.patientLastName}
                </p>
                <p className="text-sm text-slate-400 lowercase">
                  {item.gender}
                </p>
              </div>
            </div>

            </td>
          
        

        <td>{format(new Date(item.dateAppointment), "MM/dd/yyyy")}</td>
        <td>{item.time}</td>
        {isShowedProfileDoctor ? (
            <td>
          <div className="flex items-center gap-3">
            <ProfileImage name={item.doctorName!} />
            <div className="">
              <p className="">{item.doctorName}</p>
            </div>
          </div>
        </td>
          ) : null}
        <td>
          <StatusBadge
            variants={APPOINTMENTS_STATUS[item.status]}
            text={item.status.toLowerCase()}
          />
        </td>
        <td>
          <AppoitmentDetails id={item.id} />
        </td>
      </tr>
    );
  };
  return (
    <div className="bg-white rounded-xl p-1 2xl:p-4">
      <div className="flex items-center justify-between">
        <h1 className=" text-sm lg:text-lg font-black text-black">
          Recent Appointments
        </h1>
        <Link href={"/records/appointments"}>
          <Button
            variant="outline"
            className="bg-white! border border-slate-300 text-black hover:bg-black! "
          >
            View All
          </Button>
        </Link>
      </div>
      <div className="hidden lg:block">
      <Table
        columns={COLUMNS_APPOINETMENTS}
        renderRow={renderData}
        data={data}
        isShowedProfileDoctor={isShowedProfileDoctor}
      />

      </div>
      {/* Card  AppointementPatient*/}
      <div className="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-4 mt-4 md:hidden">
        {data.map((item) => (
          <CardAppointment
            img={item.img}
            fullName={item.patientFirstName + " " + item.patientLastName}
            dateAppointment={item.dateAppointment}
            doctorName={item.doctorName!}
            status={item.status}
            key={uuidv4()}
          />
        ))}
      </div>
    </div>
  );
}

export default RecentAppointment;
