"use client";

import { Users } from "lucide-react";
import Link from "next/link";
import { useMemo } from "react";
import { ResponsiveContainer, RadialBarChart, RadialBar } from "recharts";
import { formatNumber } from "@/utils";
interface IStatsSummary {
  data: {
    pendding: number;
    sheduled: number;
    completed: number;
  };
  total: number;
}

function StatsSummary({ data, total }: IStatsSummary) {
  const dataInfo = useMemo(() => {
    return [
      {
        name: "Total",
        count: total || 0,
        fill: "white",
      },
      {
        name: "Appointments",
        count: data.pendding + data.sheduled || 0,
        fill: "#E9C46A",
      },
      {
        name: "Total",
        count: data.completed || 0,
        fill: "#249D8F",
      },
    ];
  }, [data, total]);
  const appointment = dataInfo[1].count;
  const completed = dataInfo[2].count;

  const percentageAppointment = useMemo(() => {
    const totalCount = appointment + completed;
    if (totalCount === 0) return 0;
    return Math.round((appointment / totalCount) * 100);
  }, [appointment, completed]);

  const percentageConsultation = useMemo(() => {
    const totalCount = appointment + completed;
    if (totalCount === 0) return 0;
    return Math.round((completed / totalCount) * 100);
  }, [appointment, completed]);

  return (
    <div className="bg-white w-full h-full rounded-xl p-4 border border-slate-200">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-black">Summray</h1>
        <Link href={"#"} className="text-slate-400 text-sm hover:underline">
          See details
        </Link>
      </div>
      <div className="relative w-full h-[75%]">
        <ResponsiveContainer>
          <RadialBarChart
            cx="50%"
            cy="50%"
            data={dataInfo}
            innerRadius="40%"
            outerRadius="100%"
            barSize={20}
          >
            <RadialBar background dataKey={"count"} />
          </RadialBarChart>
        </ResponsiveContainer>
        <Users
          size={30}
          className="text-slate-400 absolute top-1/2 left-1/2 -translate-1/2"
        />
      </div>
      <div className="flex items-center gap-4 justify-center">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <div className=" rounded-full w-8 h-8 bg-[#E9C46A]" />
            <h1 className="font-bold text-black">
              {formatNumber(appointment) ?? 0}
            </h1>
          </div>
          <p className="text-slate-400 text-sm">
            {dataInfo[1].name}({percentageAppointment}%)
          </p>
        </div>
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <div className="rounded-full w-8 h-8 bg-[#249D8F]" />
            <h1 className="font-bold text-black">{completed ?? 0}</h1>
          </div>
          <p className="text-slate-400 text-sm">
            {dataInfo[2].name}({percentageConsultation}%)
          </p>
        </div>
      </div>
    </div>
  );
}

export default StatsSummary;
