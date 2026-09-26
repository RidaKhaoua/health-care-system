import { v4 as uuidv4 } from "uuid";
import { IMedicalRecords } from "@/types/data-type";
import Table from "./tables/Table";
import { COLUMNS_MEDICALRECORDS } from "@/constants";
import { format } from "date-fns";
import { Briefcase, FlaskConical } from "lucide-react";
import { isArray } from "util";

interface IMedicalHistoryProps {
  data: IMedicalRecords[] | null;
  message?: string;
}
function MedicalHistory({ data, message }: IMedicalHistoryProps) {
  const renderData = (item: IMedicalRecords) => (
    <tr key={uuidv4()} className="text-black even:bg-slate-100 mb-4">
      <td>{format(new Date(item.date_time), "MM/dd/yyyy")}</td>
      <td>{item.doctor}</td>
      <td>{item.diagnosis}</td>
      <td>{item.labTest}</td>
    </tr>
  );
  return (
    <div>
      {/* Table */}
      <div className="bg-white border border-slate-200 rounded-md p-5 shadow-md hidden lg:block">
        <h1 className="text-black font-bold mb-2">Medical History(All)</h1>
        <div className="flex items-center gap-2 text-slate-400">
          <Briefcase className="size-6"/>
          <p><span className="text-black font-bold">{0}</span> total records</p>
        </div>
        <Table<IMedicalRecords>
          columns={COLUMNS_MEDICALRECORDS}
          data={data}
          renderRow={renderData}
        />

        {data === null || data && Object.keys(data).length === 0 ? (
          <div className="flex flex-col gap-3 items-center justify-center h-80 text-slate-400">
            <FlaskConical className="size-12" />
            <p className=" text-xl">{message || "Medial Records not found"}</p>
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default MedicalHistory;
