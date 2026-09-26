import { prisma } from "@/lib/prisma";
import { processAppointments } from "..";
import { AppointmentWhereInput } from "@/lib/generated/prisma/models";
import { AppointmentStatus } from "@/lib/generated/prisma/enums";

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

    const [
      appointments,
      totalApointments,
      numberOfPatientToday,
      patientsOfToday,
    ] = await Promise.all([
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
            lte: endOfDay,
          },
        },
      }),
      prisma.appointment.findMany({
        where: {
          doctor_id: id,
          appointment_date: {
            gte: startOfDay,
            lte: endOfDay,
          },
        },
        include: {
          patient: {
            select: {
              id: true,
              first_name: true,
              last_name: true,
              img: true,
              gender: true,
            },
          },
        },
        take: 5,
      }),
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
        completedAppointment: appointmentStatusCounts.COMPLETED,
        appointmentStatusCounts,
        monthlyData,
        numberOfPatientToday,
        patientsOfToday,
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

export async function getDoctorProfile(id: string) {
  try {
    if (!id) {
      return {
        success: false,
        error: true,
        message: "Data not found",
        status: 404,
      };
    }
    const data = await prisma.doctor.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        name: true,
        email: true,
        specialization: true,
        license_number: true,
        phone: true,
        img: true,
        working_days: true,
        ratings: true,
        appointments: {
          select: {
            id: true,
            status: true,
            appointment_date: true,
            patient: {
              select: {
                id: true,
                first_name: true,
                last_name: true,
                img: true,
              },
            },
          },
          orderBy: {
            appointment_date: "desc",
          },
        },
      },
    });

    if (!data) {
      return {
        success: false,
        error: true,
        message: "Data not found!",
        data: null,
        status: 404,
      };
    }

    return {
      success: true,
      error: false,
      data,
      status: 200,
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

interface IGetPatientOfToday {
  page?: string;
  search?: string;
  limit?: string;
  status?: AppointmentStatus;
  id?: string;
}

export async function getPatientOfToday({
  page,
  search,
  limit,
  status,
  id,
}: IGetPatientOfToday) {
  const PAGE_NUMBBER = Number(page) < 0 ? "1" : page;
  const LIMIT = Number(limit) || 10;
  const SKIP = (Number(PAGE_NUMBBER) - 1) * LIMIT;
  try {
    if (!id) {
      return {
        success: false,
        error: true,
        message: "Data not found",
        status: 404,
      };
    }
    const [data, totalRecord] = await Promise.all([
      prisma.appointment.findMany({
        where: {
          ...buildQuery(id, search, status),
          appointment_date: {
            gte: startOfDay,
            lte: endOfDay,
          },
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
        },
        skip: SKIP,
        take: LIMIT,
        orderBy: {
          appointment_date: "desc",
        },
      }),
      prisma.appointment.count({
        where: {
          ...buildQuery(id, search, status),
          appointment_date: {
            gte: startOfDay,
            lte: endOfDay,
          },
        },
      }),
    ]);
    if (data.length === 0) {
      return {
        success: true,
        error: false,
        status: 200,
        data: null,
        message: "Schedule data not available",
      };
    }
    const totalPages = Math.ceil(totalRecord / LIMIT);
    return {
      success: true,
      error: false,
      data,
      totalRecord,
      status: 200,
    };
  } catch (error) {
    return {
      success: false,
      error: true,
      status: 500,
      message: "Internal server error",
    };
  }
}

function buildQuery(id?: string, search?: string, status?: AppointmentStatus) {
  const searchConditon: AppointmentWhereInput = search
    ? {
        OR: [
          {
            patient: {
              OR: [
                { first_name: { contains: search, mode: "insensitive" } },
                { last_name: { contains: search, mode: "insensitive" } },
              ],
            },
          },
        ],
      }
    : {};
  const appointmentStatus: AppointmentWhereInput = status
    ? {
        status,
      }
    : {};
  const idCondition: AppointmentWhereInput = id
    ? {
        doctor_id: id,
      }
    : {};
  const combineQuery: AppointmentWhereInput =
    id || search || status
      ? {
          AND: [
            ...(Object.keys(searchConditon).length > 0 ? [searchConditon] : []),
            ...(Object.keys(idCondition).length > 0 ? [idCondition] : []),
            ...(Object.keys(appointmentStatus).length > 0
              ? [appointmentStatus]
              : []),
          ],
        }
      : {};
  return combineQuery;
}

const startOfDay = new Date();
startOfDay.setHours(8, 0, 0, 0);

const endOfDay = new Date();
endOfDay.setHours(15, 0, 0, 0);
