import { prisma } from "@/lib/prisma";
import { processAppointments } from "..";

export async function getDoctors() {
  try {
    const doctorsData = await prisma.doctor.findMany();
    if (!doctorsData) {
      return {
        success: false,
        error: true,
        data: null,
        message: "No Doctors Data Found",
        status: 404,
      };
    }
    return {
      success: true,
      error: false,
      data: doctorsData,
      message: null,
      status: 200,
    };
  } catch (error) {
    return {
      success: false,
      error: true,
      message: "Internel Server error",
      status: 500,
    };
  }
}

export async function getDoctorDashboard(id: string) {
  try {
    const doctorData = await prisma.doctor.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        img: true,
      },
    });
    if (!doctorData) {
      return {
        success: true,
        error: false,
        status: 404,
        message: "Data not Found",
      };
    }

    const [appointments, totalApointments, numberOfPatientToday, patientsOfToday] =
      await Promise.all([
        prisma.appointment.findMany({
          where: {
            doctor_id: id,
          },
          include: {
            patient: {
              select: {
                id: true,
                first_name: true,
                last_name: true,
                img: true,
                gender: true,
                email: true,
              },
            },
            doctor: {
              select: {
                id: true,
                name: true,
                img: true,
                specialization: true,
                email: true,
              },
            },
          },
          orderBy: {
            appointment_date: "desc",
          },
        }),
        prisma.appointment.count({ where: { doctor_id: id } }),
        prisma.appointment.count({
          where: {
            doctor_id: id,
            appointment_date: {
              gte: startOfDay,
              lte:endOfDay
            },
          },
        }),
        prisma.appointment.findMany({
          where:{doctor_id:id, appointment_date:{
            gte:startOfDay,
            lte:endOfDay
          }},
          include:{
            patient:{
              select:{
                id:true,
                first_name:true,
                last_name:true,
                img:true,
                gender:true,

              }
            }
          }
        })
      ]);

    const { appointmentStatusCounts, monthlyData } =
      await processAppointments(appointments);
    const lastFiveRecords = appointments.slice(0, 5);

    return {
      success: true,
      error: false,
      data: {
        doctorData,
        appointments,
        totalApointments,
        lastFiveRecords,
        completedAppointment:appointmentStatusCounts.COMPLETED,
        appointmentStatusCounts,
        monthlyData,
        numberOfPatientToday,
        patientsOfToday
      },
      status: 200,
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

const startOfDay = new Date();
startOfDay.setHours(8, 0, 0, 0);

const endOfDay = new Date();
endOfDay.setHours(15, 0, 0, 0);