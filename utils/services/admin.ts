import { prisma } from "@/lib/prisma";
import { processAppointments } from "..";
import { DAYS_OF_WEEK } from "@/constants";
import { getDay } from "date-fns";

export async function dashboardAdmin() {
  try {
    const indexDay = getDay(new Date());
    const today =
      indexDay > 0 ? DAYS_OF_WEEK[indexDay - 1] : DAYS_OF_WEEK[indexDay];
    const [
      totalPatients,
      totalDoctors,
      totalApointments,
      totalStaffs,
      appointments,
      availableDoctors,
    ] = await Promise.all([
      prisma.patient.count(),
      prisma.doctor.count(),
      prisma.appointment.count(),
      prisma.staff.count(),
      prisma.appointment.findMany({
        include: {
          patient: {
            select: {
              id: true,
              last_name: true,
              first_name: true,
              img: true,
              colorCode: true,
              gender: true,
              date_of_birth: true,
            },
          },
          doctor: {
            select: {
              name: true,
              img: true,
              colorCode: true,
              specialization: true,
            },
          },
        },
        orderBy: {
          appointment_date: "desc",
        },
      }),
      prisma.workingDays.findMany({
        where: {
          day: {
                equals: today,
                mode: "insensitive",
              },
        },
       include:{
        doctor:true,
       },
        take: 5,
      }),
    ]);
    const { appointmentStatusCounts, monthlyData } =
      await processAppointments(appointments);
    const last5Records = appointments.slice(0, 5);
    return {
      success: true,
      error: false,
      status: 200,
      data: {
        totalStaffs,
        totalPatients,
        totalDoctors,
        totalApointments,
        availableDoctors,
        last5Records,
        appointmentStatusCounts,
        monthlyData,
      },
    };
  } catch (error) {
    return {
      success: false,
      error: true,
      message: "Internal server error",
      status: 500,
    };
  }
}
