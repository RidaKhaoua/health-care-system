// "use client";
import { cn } from "@/lib/utils";
import { IRecentAppointment } from "@/types/data-type";
import React, { ReactNode } from "react";

interface ITable<T> {
  columns: { header: string; key: string; className?: string }[];
  renderRow: (item: T) => ReactNode;
  data: T[] | null | undefined;
  className?: string;
  isShowedProfileDoctor?:boolean
}

function Table<T>({ columns, renderRow, data, className, isShowedProfileDoctor }: ITable<T>) {
  return (
    <div>
      <table className={cn("w-full mt-4 [&_td]:py-4", className)}>
        <thead>
          <tr className="text-left text-slate-500 text-sm lg:uppercase">
            {columns.map((item) => item.header.toLowerCase() === "doctor" && !isShowedProfileDoctor  ? null : (
              <th key={item.key} className={item.className}>
                {item.header}
              </th>
            ))}
          </tr>
        </thead>

        {data && data.length > 0 ? (
          <tbody>{data.map((item) => renderRow(item))}</tbody>
        ) : null}
      </table>
    </div>
  );
}

export default Table;
