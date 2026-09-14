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
import { Briefcase, Ellipsis, User, UserRoundPen } from "lucide-react";
import { Button } from "@/components/ui/button";
import SearchInput from "@/components/SearchInput";
import CardAppointment from "@/components/CardAppointment";
import PaginationBtn from "@/components/Pagination";
import { DATA_LIMIT } from "@/utils/seetings";
import { unstable_cache } from "next/cache";
import AppointmentContainer from "@/components/AppointmentContainer";
import { Suspense } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import AppointmentActionDialog from "@/components/AppointmentActionDialog";

const getPatientAppointmentList = unstable_cache(
  getPatientAppointments, // ta fonction, sans la modifier
  ["appointment-list"], // une clé pour identifier ce cache
  { revalidate: 60, tags: ["users"] },
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
          <Popover>
            <PopoverTrigger
              render={
                <Button variant="link" className="cursor-pointer">
                  <Ellipsis className="size-5 text-black" />
                </Button>
              }
            />
            <PopoverContent className="bg-white! text-black flex flex-col items-stretch">
              <AppoitmentDetails id={item.id} />
              {item.status !== "SCHEDULED" && (
                <AppointmentActionDialog
                  id={item.id}
                  disabled={false}
                  type="approve"
                />
              )}
              <AppointmentActionDialog
                id={item.id}
                disabled={
                  item.status === "PENDING" || item.status === "SCHEDULED"
                    ? false
                    : true
                }
                type="cancel"
              />
            </PopoverContent>
          </Popover>
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
          {userRole === "PATIENT".toLocaleLowerCase() &&
          data &&
          data.length > 0 ? (
            <AppointmentContainer id={userId!} />
          ) : null}
        </div>
      </div>
      {/* Table */}
      <Suspense
        fallback={
          <div className="text-black min-h-screen flex items-center justify-center">
            loading...
          </div>
        }
      >
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
      </Suspense>
      {data && data.length > 0 ? (
        <PaginationBtn
          totalPages={totalPages}
          totalRecords={totalRecord}
          currentPage={currentPage ? Number(currentPage) : 0}
          limit={DATA_LIMIT}
        />
      ) : null}
      {/* Cards */}
      <Suspense
        fallback={
          <div className="min-h-screen flex items-center justify-center">
            loading...
          </div>
        }
      >
        <div className="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-4 mt-4 lg:hidden">
          {data &&
            data.map((item) => (
              <CardAppointment
                fullName={
                  item.patient.first_name + " " + item.patient.last_name
                }
                dateAppointment={item.appointment_date}
                doctorName={item.doctor.name}
                status={item.status}
                img={item.patient.img}
                key={uuidv4()}
              />
            ))}
        </div>
      </Suspense>
    </div>
  );
}

export default Appointments;
