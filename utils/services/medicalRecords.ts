import { Prisma } from "@/lib/generated/prisma/client";
import { prisma } from "@/lib/prisma";

export async function getMedicalPatientRecords(id: string) {
  try {
    if (!id) {
      return {
        success: false,
        error: true,
        data: null,
        message: "Data Not Found",
        status: 404,
      };
    }

    const data = await prisma.medicalRecords.findMany({
      where: { patient_id: id },
      include: {
        diagnosis: {
          include: {
            doctor: true,
          },
        },
        lab_test: true,
      },
      orderBy: { created_at: "desc" },
    });



    return {
      success: true,
      error: false,
      data,
      status: 200,
    };
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2025"
    ) {
      return {
        success: false,
        error: true,
        message: "MedicalRecords not found",
        status: 404,
      };
    }
  }
}
