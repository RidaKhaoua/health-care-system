import { v4 as uuidv4 } from "uuid";

import Table from "@/components/tables/Table";
import { APPOINTMENTS_STATUS, COLUMNS_APPOINETMENTS } from "@/constants";
import { Role } from "@/lib/generated/prisma/enums";
import { IPatientAppointments, IRecentAppointment } from "@/types/data-type";
import { getRoles } from "@/utils/roles";
import { getPatientAppointments } from "@/utils/services/appointment";
import { auth } from "@clerk/nextjs/server";
import ProfileImage from "@/components/ProfileImage";
import { format } from "date-fns";
import StatusBadge from "@/components/ui/StatusBadge";
import AppoitmentDetails from "@/components/AppoitmentDetails";
import { Briefcase, User, UserRoundPen } from "lucide-react";
import { Button } from "@/components/ui/button";
import SearchInput from "@/components/SearchInput";
import CardAppointment from "@/components/CardAppointment";
import PaginationBtn from "@/components/Pagination";
import { DATA_LIMIT } from "@/utils/seetings";
import { unstable_cache } from "next/cache";


const getPatientAppointmentList = unstable_cache(
  getPatientAppointments,              // ta fonction, sans la modifier
  ["appointment-list"],        // une clé pour identifier ce cache
  { revalidate: 60, tags: ["users"] }
);


async function Appointments({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  
  const params = await searchParams;
  const page = params?.p || "1";
  const searchQuery = params.q || "";
  const id = params?.id || undefined;
  let queryId = undefined;
  const userRole = (await getRoles()) as Role;

  const { userId } = await auth();

  if (
    userRole === "ADMIN".toLowerCase() ||
    (userRole === "DOCTOR".toLowerCase() && id) ||
    (userRole === "NURSE" && id)
  ) {
    queryId = id;
  } else if (
    userRole === "DOCTOR".toLowerCase() ||
    userRole === "PATIENT".toLowerCase()
  ) {
    queryId = userId;
    console.log(queryId);
  } else if (userRole === "NURSE".toLowerCase()) {
    queryId = undefined;
  }

  const { currentPage, totalPages, totalRecord, data, message } =
    await getPatientAppointments({
      page,
      search: searchQuery,
      ...(queryId && { id: queryId! }),
    });


  // const router = useRouter();
  const renderData = (item: IPatientAppointments) => {
    return (
      <tr key={uuidv4()} className="text-black even:bg-slate-100 mb-4 ">
        <td>
          <div className="flex items-center gap-3">
            <ProfileImage
              name={item.patient.first_name + " " + item.patient.last_name}
            />
            <div className="px-2">
              <p className="">
                {item.patient.first_name} {item.patient.last_name}
              </p>
              <p className="text-sm capitalize text-slate-400">
                {item.patient.gender.toLowerCase()}
              </p>
            </div>
          </div>
        </td>

        <td>{format(new Date(item.appointment_date), "MM/dd/yyyy")}</td>
        <td>{item.time}</td>
        <td>
          <div className="flex items-center gap-3">
            <ProfileImage name={item.doctor.name} />
            <div className="">
              <p className="">{item.doctor.name}</p>
              <p className="text-slate-400">{item.doctor.specialization}</p>
            </div>
          </div>
        </td>
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
    <div className="mx-auto py-8 px-4 lg:px-10">
      <div className="flex items-center flex-wrap gap-1.5 lg:gap-0 justify-between mb-4 bg-white rounded-md border border-slate-200 p-4">
        <h1 className="font-bold text-sm  lg:text-xl flex  items-center gap-2 text-black">
          <Briefcase className="size-5" />
          {totalRecord || 0}
          <span>total appointements</span>
        </h1>
        <div className="flex items-center gap-2 flex-wrap md:flex-nowrap">
          <SearchInput />
          {userRole === "PATIENT".toLocaleLowerCase() ? (
            <Button
              variant={"default"}
              className="py-5! w-full md:w-fit hover:opacity-80 duration-300 bg-blue-500! text-white!"
            >
              <UserRoundPen className="size-4" />
              <span className="">Book an appointement</span>
            </Button>
          ) : null}
        </div>
      </div>
      {/* Table */}
      <div className="border border-slate-200 rounded-md p-5 shadow-md hidden lg:block">
        <Table<IPatientAppointments>
          columns={COLUMNS_APPOINETMENTS}
          data={data}
          renderRow={renderData}
        />

        {data === null ? (
          <div className="flex flex-col gap-3 items-center justify-center h-80 text-slate-400">
            <User className="size-12" />
            <p className=" text-xl">{message}</p>
          </div>
        ) : null}

        
      </div>
      {data && data.length > 0 ? (
          <PaginationBtn
            totalPages={totalPages}
            totalRecords={totalRecord}
            currentPage={currentPage ? Number(currentPage) : 0}
            limit={DATA_LIMIT}
          />
        ) : null}
      {/* Cards */}
      <div className="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-4 mt-4 lg:hidden">
        {data &&
          data.map((item) => (
            <CardAppointment
              fullName={item.patient.first_name + " " + item.patient.last_name}
              dateAppointment={item.appointment_date}
              doctorName={item.doctor.name}
              status={item.status}
              img={item.patient.img}
              key={uuidv4()}
            />
          ))}
      </div>
    </div>
  );
}

export default Appointments;
