"use server";
import { prisma } from "@/lib/prisma";
import { getPagintationParams, getTotalPage, processAppointments } from "..";
import { DAYS_OF_WEEK } from "@/constants";
import { getDay } from "date-fns";
import {
  DoctorWhereInput,
  PatientWhereInput,
} from "@/lib/generated/prisma/models";
import { Prisma } from "@/lib/generated/prisma/client";
import { handleDatabaseError } from "@/lib/errors/error-handler";

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
        include: {
          doctor: true,
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

interface IGetAllPatientsProps {
  page?: string;
  limit?: string;
  search?: string;
}

export async function getAllPatients(params: IGetAllPatientsProps) {
  const { page, limit, skip } = getPagintationParams(params.page, params.limit);
  try {
    const [data, totalRecord] = await Promise.all([
      prisma.patient.findMany({
        where: buildQuery(params.search),
        take: limit,
        skip,
        orderBy: {
          created_at: "desc",
        },
      }),
      prisma.patient.count(),
    ]);

    if (data.length === 0) {
      return {
        success: true,
        error: false,
        status: 200,
        data: null,
        message: "Patients data not found",
      };
    }

    const totalPages = getTotalPage(totalRecord, limit);
    return {
      success: true,
      error: false,
      data,
      totalRecord,
      totalPages,
      currentPage: page,
      limit,
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

export async function getAllDoctorss(params: IGetAllPatientsProps) {
  const { page, limit, skip } = getPagintationParams(params.page, params.limit);
  try {
    const [data, totalRecord] = await Promise.all([
      prisma.doctor.findMany({
        where: buildQueryDoctor(params.search),
        take: limit,
        skip,
        orderBy: {
          created_at: "desc",
        },
      }),
      prisma.doctor.count(),
    ]);

    if (data.length === 0) {
      return {
        success: true,
        error: false,
        status: 200,
        data: null,
        message: "Patients data not found",
      };
    }

    const totalPages = getTotalPage(totalRecord, limit);
    return {
      success: true,
      error: false,
      data,
      totalRecord,
      totalPages,
      currentPage: page,
      limit,
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

export async function deleteDoctor(id: string, isArchived: boolean) {
  try {
    if (!id) {
      return {
        success: false,
        error: true,
        message: "No Data Available",
        status: 404,
      };
    }

    await prisma.doctor.update({
      where: { id },
      data: {
        isArchived: !isArchived,
      },
    });
    return {
      success: true,
      message: `User ${!isArchived ? "Deleted" : "Restord"} successfuly`,
      status: 200,
    };
  } catch (error) {
    return handleDatabaseError(error);
  }
}

export async function deletePatient(id: string, isArchived: boolean) {
  try {
    if (!id) {
      return {
        success: false,
        error: true,
        message: "No Data Available",
        status: 404,
      };
    }

    await prisma.patient.update({
      where: { id },
      data: {
        isArchived: !isArchived,
      },
    });
    return {
      success: true,
      message: `User ${!isArchived ? "Deleted" : "Restord"} successfuly`,

      status: 200,
    };
  } catch (error) {
    return handleDatabaseError(error);
  }
}

function buildQuery(search?: string) {
  const searchConditon: PatientWhereInput = search
    ? {
        OR: [
          {
            first_name: {
              contains: search,
              mode: "insensitive",
            },
          },
          {
            last_name: {
              contains: search,
              mode: "insensitive",
            },
          },
        ],
      }
    : {};

  const combineQuery: PatientWhereInput = search
    ? {
        AND: [
          ...(Object.keys(searchConditon).length > 0 ? [searchConditon] : []),
        ],
      }
    : {};
  return combineQuery;
}

function buildQueryDoctor(search?: string) {
  const searchConditon: DoctorWhereInput = search
    ? {
        OR: [
          {
            name: {
              contains: search,
              mode: "insensitive",
            },
          },
        ],
      }
    : {};

  const combineQuery: DoctorWhereInput = search
    ? {
        AND: [
          ...(Object.keys(searchConditon).length > 0 ? [searchConditon] : []),
        ],
      }
    : {};
  return combineQuery;
}
