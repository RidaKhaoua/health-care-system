import type { AppointmentWhereInput } from "@/lib/generated/prisma/models/Appointment";
import { prisma } from "@/lib/prisma";

export async function getAppointmentById(id: number) {
  if (!id) {
    return {
      success: false,
      error: true,
      message: "ID of appointment is required",
      status: 404,
      data: null,
    };
  }
  try {
    const appointmentData = await prisma.appointment.findUnique({
      where: { id },
      include: {
        patient: {
          select: {
            id: true,
            first_name: true,
            last_name: true,
            date_of_birth: true,
            address: true,
            img: true,
            phone: true,
          },
        },
        doctor: {
          select: {
            id: true,
            name: true,
            phone: true,
            img: true,
            email: true,
            specialization: true,
          },
        },
      },
    });

    return { success: true, error: false, status: 200, data: appointmentData };
  } catch (error) {
    return {
      success: false,
      error: false,
      message: "Internel Server error",
      status: 500,
    };
  }
}

interface IQueryPatientAppointment {
  page?: string;
  search?: string;
  limit?: string;
  id?: string;
}

export async function getPatientAppointments({
  page,
  search,
  limit,
  id,
}: IQueryPatientAppointment) {
  try {
    const PAGE_NUMBBER = Number(page) < 0 ? "1" : page ? page : "1";
    const LIMIT = Number(limit) || 10;
    const SKIP = (Number(PAGE_NUMBBER) - 1) * LIMIT;
    const [data, totalRecord] = await Promise.all([
      prisma.appointment.findMany({
        where: buildQuery(id, search),
        take: LIMIT,
        skip: SKIP,
        select: {
          id: true,
          patient_id: true,
          doctor_id: true,
          type: true,
          appointment_date: true,
          time: true,
          status: true,
          patient: {
            select: {
              id: true,
              first_name: true,
              last_name: true,
              date_of_birth: true,
              img: true,
              gender: true,
              phone: true,
            },
          },
          doctor: {
            select: {
              id: true,
              name: true,
              specialization: true,
              colorCode: true,
              img: true,
            },
          },
        },
        orderBy:{appointment_date:"desc"}
      }),
      prisma.appointment.count({
        where: buildQuery(id, search),
      }),
    ]);

    if (data.length === 0) {
      return {
        success: true,
        error: false,
        status: 200,
        data: null,
        message: "Appointment data not found",
      };
    }
    const totalPages = Math.ceil(totalRecord / LIMIT);
      
    return {
      success: true,
      error: false,
      status: 200,
      data,
      totalRecord,
      totalPages,
      currentPage: page,
      limit,
    };
  } catch (error) {
    return {
      success: false,
      error: false,
      message: "Internel Server error",
      status: 500,
    };
  }
}

function buildQuery(id?: string, search?: string) {
  const searchConditon: AppointmentWhereInput = search
    ? {
        OR: [
          {
            patient: {
              OR: [
                {
                  first_name: { contains: search, mode: "insensitive" },
                },
                {
                  last_name:{contains:search, mode:"insensitive"}
                }
              ],
            },
          },
          {
            doctor: {
              name: { contains: search, mode: "insensitive" },
            },
          },
        ],
      }
    : {};

  const idCondition: AppointmentWhereInput = id
    ? {
        OR: [
          {
            patient_id: id,
          },
          { doctor_id: id },
        ],
      }
    : {};

  const combineQuery: AppointmentWhereInput =
    id || search
      ? {
          AND: [
            ...(Object.keys(searchConditon).length > 0 ? [searchConditon] : []),
            ...(Object.keys(idCondition).length > 0 ? [idCondition] : []),
          ],
        }
      : {};
  return combineQuery;
}
