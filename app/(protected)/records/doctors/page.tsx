import DoctorActions from "@/components/DoctorActions";
import PaginationBtn from "@/components/Pagination";
import ProfileImage from "@/components/ProfileImage";
import HeaderSection from "@/components/shared/HeaderSection";
import Table from "@/components/tables/Table";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import StatusBadge from "@/components/ui/StatusBadge";
import { COLUMNS_DOCTORS, USER_STATUS_COLOR } from "@/constants";
import { DATA_LIMIT } from "@/utils/seetings";
import { getAllDoctorss } from "@/utils/services/admin";
import { format } from "date-fns";
import { Ellipsis, User, UserRoundPen } from "lucide-react";
import { v4 as uuidv4 } from "uuid";

async function page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const params = await searchParams;
  const page = params?.p ?? "1";
  const searchQuery = params?.q ?? "";
  const response = await getAllDoctorss({ page, search: searchQuery });

  const renderData = (item: IDoctor) => (
    <tr key={uuidv4()} className="text-black even:bg-slate-100 mb-4">
      <td>
        <div className="flex items-center gap-3">
          <ProfileImage name={`${item.name}`} />
          <div className="px-2">
            <p>{item.name}</p>
          </div>
        </div>
      </td>
      <td>{item.specialization}</td>
      <td>{format(item.created_at!, "yyyy/MM/dd")}</td>
      <td>{item.phone}</td>
      <td>{item.email}</td>
      <td>
        <StatusBadge
          text={item.isArchived ? "Deleted" : "Active"}
          variants={USER_STATUS_COLOR[String(item.isArchived!)]}
        />
      </td>
      <td>
        <DoctorActions id={item.id} status={item.isArchived}/>
      </td>
    </tr>
  );

  return (
    <div className="mx-auto py-8 px-4 lg:px-10">
      <HeaderSection
        title="Total Doctors"
        totalRecord={response.totalRecord ?? 0}
      >
        <Button
          variant={"default"}
          className="py-5! cursor-pointer w-full md:w-fit hover:opacity-80 duration-300 bg-blue-500! text-white!"
        >
          <UserRoundPen className="size-4" />
          <span className="">Add a Doctor</span>
        </Button>
      </HeaderSection>
      <div className="border border-slate-200 rounded-md p-5 shadow-md hidden lg:block">
        <Table<IDoctor>
          columns={COLUMNS_DOCTORS}
          data={response.data}
          renderRow={renderData}
          isShowedProfileDoctor={true}
        />

        {response.data === null ? (
          <div className="flex flex-col gap-3 items-center justify-center h-80 text-slate-400">
            <User className="size-12" />
            <p className=" text-xl">{response.message}</p>
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
      {/* TODO: Create A Card Component */}
    </div>
  );
}

export default page;
