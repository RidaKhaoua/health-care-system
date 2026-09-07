"use server";
import { Prisma } from "@/lib/generated/prisma/client";
import { AppointmentStatus } from "@/lib/generated/prisma/enums";
import { prisma } from "@/lib/prisma";

export async function AppointmentUpdateStatus(
  id: number,
  status: AppointmentStatus,
  reason: string,
) {
  try {
    if (!id) {
      return {
        success: false,
        error: true,
        message: "Data Not Found",
        status: 404,
      };
    }

    const updateAppointment = await prisma.appointment.update({
      where: { id },
      data: {
        status,
        reason,
      },
    });

    return {
      success: true,
      error: false,
      message: `Appointment ${status.toLowerCase()} successfully`,
      data: updateAppointment,
    };
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2025" // record not found
    ) {
      return {
        success: false,
        error: true,
        message: "Appointment not found",
        status: 404,
      };
    }
  }
}
