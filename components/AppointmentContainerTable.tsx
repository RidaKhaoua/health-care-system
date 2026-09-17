import { v4 as uuidv4 } from "uuid";
import { format } from "date-fns";
import { User, Ellipsis, Briefcase } from "lucide-react";

import Table from "@/components/tables/Table";
import ProfileImage from "@/components/ProfileImage";
import StatusBadge from "@/components/ui/StatusBadge";
import AppoitmentDetails from "@/components/AppoitmentDetails";
import AppointmentActionDialog from "@/components/AppointmentActionDialog";
import PaginationBtn from "@/components/Pagination";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { APPOINTMENTS_STATUS, COLUMNS_APPOINETMENTS } from "@/constants";
import { DATA_LIMIT } from "@/utils/seetings";
import { getPatientAppointments } from "@/utils/services/appointment";
import { IPatientAppointments } from "@/types/data-type";

import CardAppointment from "./CardAppointment";

interface Props {
  page: string;
  searchQuery: string;
  queryId?: string;
  userRole: string;
  userId: string | null;
}

async function AppointmentContainerTable({
  page,
  searchQuery,
  queryId,
  userRole,
  userId,
}: Props) {
  // L'appel async est effectué DANS le composant sous Suspense
  const { currentPage, totalPages, totalRecord, data, message } =
    await getPatientAppointments({
      page,
      search: searchQuery,
      ...(queryId && { id: queryId }),
    });

  const renderData = (item: IPatientAppointments) => (
    <tr key={uuidv4()} className="text-black even:bg-slate-100 mb-4">
      <td>
        <div className="flex items-center gap-3">
          <ProfileImage
            name={`${item.patient.first_name} ${item.patient.last_name}`}
          />
          <div className="px-2">
            <p>
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
          <div>
            <p>{item.doctor.name}</p>
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
            <AppoitmentDetails id={item.id} isTextShowed={true} />
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
                item.status !== "PENDING" && item.status !== "SCHEDULED"
              }
              type="cancel"
            />
          </PopoverContent>
        </Popover>
      </td>
    </tr>
  );

  return (
    <>
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
    </>
  );
}

export default AppointmentContainerTable;
