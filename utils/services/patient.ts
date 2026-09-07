import { DAYS_OF_WEEK } from "@/constants";
import { AppointmentStatus } from "@/lib/generated/prisma/enums";
import { prisma } from "@/lib/prisma";
import { endOfYear, format, getDay, getMonth, startOfYear } from "date-fns";

interface IAppointment {
  status: AppointmentStatus;
  appointment_date: Date;
}

const initializedMonthlyData = () => {
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

function isValidStatus(status: string): status is AppointmentStatus {
  return ["PENDING", "SCHEDULED", "COMPLETED", "CANCELLED"].includes(status);
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

  const appointmentCounts = appointments.reduce<
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

  return { appointmentCounts, monthlyData };
};

export async function getPatientById(id: string) {
  try {
    const patientData = await prisma.patient.findUnique({ where: { id } });
    if (!patientData) {
      return {
        success: false,
        error: true,
        message: "Patient Not Found",
        data: null,
        status: 404,
      };
    }

    return { success: true, error: true, data: patientData, status: 200 };
  } catch (error) {
    return {
      success: false,
      error: false,
      message: "Internel Server error",
      status: 500,
    };
  }
}

export async function getPatientDashboard(id: string) {
  try {
    const data = await prisma.patient.findUnique({
      where: { id },
      select: {
        id: true,
        first_name: true,
        last_name: true,
        email: true,
        gender: true,
        img: true,
      },
    });

    if (!data) {
      return {
        success: false,
        error: true,
        status: 404,
        message: "Patient data not found",
      };
    }

    const appointments = await prisma.appointment.findMany({
      where: { patient_id: id },
      include: {
        doctor: {
          select: {
            id: true,
            name: true,
            img: true,
            specialization: true,
          },
        },
        patient: {
          select: {
            id: true,
            first_name: true,
            last_name: true,
            date_of_birth: true,
            img: true,
            gender: true,
          },
        },
      },
      orderBy: { appointment_date: "desc" },
    });
    const totalApointments = await prisma.appointment.count({
      where: { patient_id: id },
    });

    const { appointmentCounts, monthlyData } =
      await processAppointments(appointments);
    const lastFiveRecords = appointments.slice(0, 5);
    const indexDay = getDay(new Date());
    const today =
      indexDay > 0 ? DAYS_OF_WEEK[indexDay - 1] : DAYS_OF_WEEK[indexDay];

    const availableDoctorRelatedWithWorkingDay =
      await prisma.workingDays.findMany({
        where: {
          day: today,
        },
        take: 4,
        include: {
          doctor: {
            select: {
              id: true,
              name: true,
              specialization: true,
              img: true,
              phone: true,
              email: true,
            },
          },
        },
      });

    const patientRating = await prisma.rating.findMany({
      where: { patient_id: id },
      select: {
        id: true,
        rating: true,
        comment: true,
        staff_id: true,
        created_at: true,
        patient: {
          select: {
            id: true,
            first_name: true,
            last_name: true,
            img: true,
          },
        },
      },
      take: 4,
    });

    return {
      success: true,
      error: false,
      status: 200,
      data: {
        patient: data,
        appointments,
        totalApointments,
        appointmentCounts,
        lastFiveRecords,
        availableDoctorRelatedWithWorkingDay,
        monthlyData,
        patientRating,
      },
    };
  } catch (error) {
    return {
      success: false,
      error: true,
      status: 500,
      message: "Internal Serveur 500",
    };
  }
}
