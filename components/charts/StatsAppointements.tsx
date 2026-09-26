"use client";
import { IAppointementsChartProps } from "@/types/data-type";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface IStatsAppointementsProps {
  data: IAppointementsChartProps[];
}

function StatsAppointements({ data }: IStatsAppointementsProps) {
  return (
    <div className="bg-white h-full rounded-xl">
      <div>
        <h1 className="text-lg font-semibold">Appointemnts</h1>
      </div>
      <ResponsiveContainer width="100%" height="90%">
        <BarChart width={100} height={300} data={data} barSize={25}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ddd" />
          <XAxis
            dataKey="name"
            axisLine={false}
            tick={{ fill: "#9ca3aF" }}
            tickLine={false}
          />
          <YAxis axisLine={false} tick={{ fill: "#9ca3af" }} tickLine={false} />
          <Tooltip
            contentStyle={{ borderRadius: "10px", borderColor: "#fff" }}
          />
          <Legend
            position="insideTopLeft"
            wrapperStyle={{
              paddingTop: "20px",
              paddingBottom: "40px",
              textTransform: "capitalize",
            }}
          />
          <Bar
            dataKey="appointment"
            fill="#E9C46A"
            radius={[10, 10, 0, 0]}
            legendType="circle"
          />
          <Bar
            dataKey="completed"
            fill="#249D8F"
            radius={[10, 10, 0, 0]}
            legendType="circle"
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default StatsAppointements;
