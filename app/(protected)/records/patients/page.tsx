"use server";
import { v4 as uuidv4 } from "uuid";
import SearchInput from "@/components/SearchInput";
import EmptyData from "@/components/shared/EmptyData";
import Table from "@/components/tables/Table";
import { COLUMNS_PATIENTS, USER_STATUS_COLOR } from "@/constants";
import { IPatient } from "@/types/patient-type";
import { getAllPatients } from "@/utils/services/admin";
import { Briefcase, Ellipsis, Eye, User, UserRoundPen } from "lucide-react";
import ProfileImage from "@/components/ProfileImage";
import { format } from "date-fns";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import PaginationBtn from "@/components/Pagination";
import { DATA_LIMIT } from "@/utils/seetings";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import SmallCard from "@/components/SmallCard";
import HeaderSection from "@/components/shared/HeaderSection";
import DeleteRecord from "@/components/shared/DeleteRecord";
import PatientActions from "@/components/PatientActions";
import StatusBadge from "@/components/ui/StatusBadge";

async function page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const params = await searchParams;
  const page = params?.p ?? "1";
  const searchQuery = params?.q || "";
  const response = await getAllPatients({ page, search: searchQuery });

  const renderData = (item: IPatient) => (
    <tr key={uuidv4()} className="text-black even:bg-slate-100 mb-4">
      <td>
        <div className="flex items-center gap-3">
          <ProfileImage name={`${item.first_name} ${item.last_name}`} />
          <div className="px-2">
            <p>
              {item.first_name} {item.last_name}
            </p>
            <p className="text-sm capitalize text-slate-400">
              {item.gender.toLowerCase()}
            </p>
          </div>
        </div>
      </td>
      <td>{format(new Date(item.created_at!), "MM/dd/yyyy")}</td>
      <td>{item.phone}</td>
      <td>{item.email}</td>
      <td>{item.marital_status}</td>
      <td>
        <StatusBadge
          text={item.isArchived ? "Deleted" : "Active"}
          variants={USER_STATUS_COLOR[String(item.isArchived!)]}
        />
      </td>

      <td>
        <PatientActions patient={item} status={item.isArchived!} />
      </td>
    </tr>
  );

  return (
    <div className="mx-auto py-8 px-4 lg:px-10">
      <HeaderSection
        title="Total Patients"
        totalRecord={response.totalRecord ?? 0}
      >
        <Button
          variant={"default"}
          className="py-5! cursor-pointer w-full md:w-fit hover:opacity-80 duration-300 bg-blue-500! text-white!"
        >
          <UserRoundPen className="size-4" />
          <span className="">Add a Patient</span>
        </Button>
      </HeaderSection>
      <div className="border border-slate-200 rounded-md p-5 shadow-md hidden lg:block">
        <Table<IPatient>
          columns={COLUMNS_PATIENTS}
          data={response.data}
          renderRow={renderData}
        />

        {response.data === null ? (
          <div className="flex flex-col gap-3 items-center justify-center h-80 text-slate-400">
            <User className="size-12" />
            <p className=" text-xl">"Patients Data Not Found"</p>
          </div>
        ) : null}
      </div>
      {response.data && response.data.length > 0 ? (
        <PaginationBtn
          totalPages={response.totalPages}
          totalRecords={response.totalRecord}
          currentPage={response.currentPage ? Number(response.currentPage) : 0}
          limit={DATA_LIMIT}
        />
      ) : null}
    </div>
  );
}

export default page;
