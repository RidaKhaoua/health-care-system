import { prisma } from "@/lib/prisma";

export async function getPatientData(id: string) {
  try {
    const userData = await prisma.patient.findUnique({ where: { id } });
    if (!userData) {
      return {
        success: false,
        error: true,
        message: "Patient Not Found",
        data: null,
        status: 404
      };
    }

    return { success: true, error: true, data: userData, status:200 };
  } catch (error) {
    return { success: false, error: false, message: "Internel Server error", status:500};

  }
}