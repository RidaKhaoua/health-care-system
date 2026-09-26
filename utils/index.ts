import { AppointmentStatus } from "@/lib/generated/prisma/enums";
import { endOfYear, format, getMonth, startOfYear } from "date-fns";

export function formatNumber(amount: number): string {
  return amount?.toLocaleString("en-US", {
    maximumFractionDigits: 0,
  });
}

export function generateRandomColor(): string {
  let hexColor = "";
  do {
    const randomInt = Math.floor(Math.random() * 16777216);

    hexColor = `#${randomInt.toString(16).padStart(6, "0")}`;
  } while (
    hexColor.toLowerCase() === "#ffffff" ||
    hexColor.toLowerCase() === "#000000"
  ); // Ensure it’s not white or black
  return hexColor;
}

// Generates times like "9:00", "9:30", "10:00" ... every 30 min from 8:00 to 20:00
export function generateTimes(startHour = 8, endHour = 18, stepMinutes = 30) {
  const times = [];
  for (let h = startHour; h <= endHour; h++) {
    for (let m = 0; m < 60; m += stepMinutes) {
      if (h === endHour && m > 0) break;
      const hh = h.toString();
      const mm = m.toString().padStart(2, "0");
      times.push(`${hh}:${mm}`);
    }
  }
  return times;
}

export const initializedMonthlyData = () => {
  const this_year = new Date().getFullYear(); // 2026
  const months = Array.from(
    { length: getMonth(new Date()) + 1 },
    (_, monthInIndex) => ({
      name: format(new Date(this_year, monthInIndex), "MMM"),
      appointment: 0,
      completed: 0,
    }),
  );
  return months;
};

export function isValidStatus(status: string): status is AppointmentStatus {
  return ["PENDING", "SCHEDULED", "COMPLETED", "CANCELLED"].includes(status);
}

interface IAppointment {
  status: AppointmentStatus;
  appointment_date: Date;
}

export const processAppointments = async (appointments: IAppointment[]) => {
  const monthlyData = initializedMonthlyData();
  /**
   [
  { name: "Jan", appointment: 0, completed: 0 },
  { name: "Feb", appointment: 0, completed: 0 },
  { name: "Mar", appointment: 0, completed: 0 },
  { name: "Apr", appointment: 0, completed: 0 },
  { name: "May", appointment: 0, completed: 0 },
  { name: "Jun", appointment: 0, completed: 0 },
  { name: "Jul", appointment: 0, completed: 0 },
  { name: "Aug", appointment: 0, completed: 0 },
]
   */

  const appointmentStatusCounts = appointments.reduce<
    Record<AppointmentStatus, number>
  >(
    (acc, appointment) => {
      const status = appointment.status; // PENDING OR COMPLETED OR SHEDULED OR CANCLED
      const appointment_date = appointment.appointment_date;
      const monthIndex = getMonth(appointment_date); // 0 - 7
      if (
        appointment_date >= startOfYear(new Date()) &&
        appointment_date <= endOfYear(new Date())
      ) {
        monthlyData[monthIndex].appointment += 1;
        if (status === "COMPLETED") {
          monthlyData[monthIndex].completed += 1;
        }
      }
      if (isValidStatus(status)) {
        acc[status] = (acc[status] || 0) + 1;
      }

      return acc;
    },
    {
      PENDING: 0,
      SCHEDULED: 0,
      CANCELLED: 0,
      COMPLETED: 0,
    },
  );

  return { appointmentStatusCounts, monthlyData };
};