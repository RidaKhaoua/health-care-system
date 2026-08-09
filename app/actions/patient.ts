"use server";

import { Patient } from "@/lib/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import { PatientFormShema } from "@/lib/schema";
import { getErrorMessage } from "@/utils/error";
import { clerkClient } from "@clerk/nextjs/server";
import { success } from "zod";

export async function createNewPatient(
  data: Omit<Patient, "id" | "colorCode" | "created_at" | "updated_at">,
  id: string | null,
) {
  try {
    const dataIsValid = PatientFormShema.safeParse(data);
    if (!dataIsValid.success) {
      return {
        success: dataIsValid.success,
        error: dataIsValid.error,
        message: "Provide all required fields",
      };
    }

    const client = await clerkClient();
    let patientId = null;
    if (!id) {
      const createUser = await client.users.createUser({
        emailAddress: [dataIsValid.data.email],
        password: dataIsValid.data.phone,
        phoneNumber: [dataIsValid.data.phone],
        firstName: dataIsValid.data.first_name,
        lastName: dataIsValid.data.last_name,
        publicMetadata: { role: "patient" },
      });

      patientId = createUser.id;
    } else {
      await client.users.updateUser(id, {
        password: dataIsValid.data.phone,
        firstName: dataIsValid.data.first_name,
        lastName: dataIsValid.data.last_name,
        publicMetadata: { role: "patient" },
      });
    }

    await prisma.patient.create({
      data: {
        ...dataIsValid.data,
        id: patientId! || id!,
      },
    });
    return {
      success: true,
      error: false,
      message: "The patient created by success!",
    };
  } catch (error) {
    return { success: false, error: false, message: getErrorMessage(error) };
  }
}

export async function updatePatient(
  data: Partial<Patient>,
  id: string,
) {
  try {
    const dataIsValid = PatientFormShema.safeParse(data);
    if (!dataIsValid.success) {
      return {
        success: dataIsValid.success,
        error: dataIsValid.error,
        message: "Provide all required fields",
      };
    }

    const client = await clerkClient();

    await client.users.updateUser(id, {
      firstName: dataIsValid.data.first_name,
      lastName: dataIsValid.data.last_name,
    });

    await prisma.patient.update({
      where: { id },
      data: {
        ...dataIsValid.data,
      },
    });
    return {
      success: true,
      error: false,
      message: "The patient updated by success!",
    };
  } catch (error) {
    return { success: false, error: false, message: getErrorMessage(error) };
  }
}

/**
 * 1- patient kidir register kidakhel(firstName, lastName, email, password).
 * 2- kandiro lih redirect into patient/registration bash ikml infos dialo
 * 3- kanshofo wash User deja m9ayed f clerk ola la
 * - ila kan m9ayed kandiro juste update ma3lomat li deja kinin f clerk
 * - ila kan nurse huwa lighadi 9aydo kandiro lih create.
 * - mn ba3ed mat9ayed khas mli iji registration il9a data kamla by defaults
 */
