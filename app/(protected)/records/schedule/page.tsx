import AppointmentActionDialog from "@/components/AppointmentActionDialog";
import AppointmentContainer from "@/components/AppointmentContainer";
import AppoitmentDetails from "@/components/AppoitmentDetails";
import ProfileImage from "@/components/ProfileImage";
import EmptyData from "@/components/shared/EmptyData";
import HeaderSection from "@/components/shared/HeaderSection";
import Table from "@/components/tables/Table";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import StatusBadge from "@/components/ui/StatusBadge";
import { toast } from "@/components/ui/toast";
import { APPOINTMENTS_STATUS, COLUMNS_SCHEDULE } from "@/constants";
import { AppointmentStatus, Role } from "@/lib/generated/prisma/enums";
import { IPatientsOfToday } from "@/types/data-type";
import { getRoles } from "@/utils/roles";
import { getPatientOfToday } from "@/utils/services/doctor";
import { auth } from "@clerk/nextjs/server";
import { format } from "date-fns";
import { Ellipsis, User } from "lucide-react";
import { v4 as uuidv4 } from "uuid";

async function page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const params = await searchParams;
  const page = params?.p ?? "1";
  const searchQuery = params.q ?? "";
  const status = (params.status as AppointmentStatus) ?? undefined;
  const user = await auth();
  const userRole = (await getRoles()) as Role;

  if (
    status &&
    !Object.values(AppointmentStatus).includes(
      status.toUpperCase() as AppointmentStatus,
    )
  ) {
    toast.add({
      title: "error",
      description: "status isn't correct!",
    });
    return;
  }
  const response = await getPatientOfToday({
    id: user.userId!,
    page,
    search: searchQuery,
    ...(status !== undefined && { status }),
  });
  if (response.error) {
    return <EmptyData message={response.message ?? "No data available Now!"} />;
  }

  const renderData = (item: IPatientsOfToday) => (
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
            <AppoitmentDetails id={item.id} showTextDetails={true} />
            {item.status === "PENDING"  && (
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
    <div className="mx-auto py-8 px-4 lg:px-10">
      <HeaderSection
        totalRecord={response.totalRecord ?? 0}
        userRole={userRole}
        title="Total Patients of Today"
      >
        <AppointmentContainer id={user.userId!} />
      </HeaderSection>
      <div className=" bg-white border border-slate-200 rounded-md p-5 shadow-md hidden lg:block">
        <Table<IPatientsOfToday>
          columns={COLUMNS_SCHEDULE}
          data={response.data}
          renderRow={renderData}
        />
        {response.data === null ? (
          <div className="flex flex-col gap-3 items-center justify-center h-80 text-slate-400">
            <User className="size-12" />
            <p className=" text-xl">{response.message}</p>
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default page;
