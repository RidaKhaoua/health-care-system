"use server";
import { Appointment, Prisma } from "@/lib/generated/prisma/client";
import { AppointmentStatus } from "@/lib/generated/prisma/enums";
import { prisma } from "@/lib/prisma";
import { BookAppointment } from "@/lib/schema";

import { getErrorMessage } from "@/utils/error";

export async function AppointmentUpdateStatus(
  id: number,
  status: AppointmentStatus,
  reason?: string,
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

export async function createAppointment(
  data: Omit<
    Appointment,
    "id" | "created_at" | "updated_at" | "status" | "reason"
  >,
) {
  
  try {
    const formatedData = {
      doctors: data.doctor_id,
      date: data.appointment_date,
      appointmentType: data.type,
      note: data.note,
      time: data.time,
    };
    const dataIsValid = BookAppointment.safeParse(formatedData);
    if (!dataIsValid.success) {
      return {
        success: dataIsValid.success,
        error: dataIsValid.error,
        message: "Provide all required fields",
      };
    }
    const bookAppointment = await prisma.appointment.create({
      data: {
        patient_id: data.patient_id,
        doctor_id: data.doctor_id,
        time: data.time,
        note: data.note,
        status: "PENDING",
        type: data.type,
        appointment_date: data.appointment_date,
      },
    });
    return {
      success: true,
      error: false,
      data: bookAppointment,
      status: 200,
      message: "Book appointment with success",
    };
  } catch (error) {
    return { success: false, error: true, message: getErrorMessage(error) };
  }
}


