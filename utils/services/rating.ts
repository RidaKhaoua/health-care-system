import { prisma } from "@/lib/prisma";

export async function getRatingPatient(id: string) {
  try {
    if (!id) {
      return {
        success: false,
        error: true,
        message: "Data Not Found",
        data: null,
      };
    }

    const data = await prisma.rating.findMany({
      where: {
        patient_id: id,
      },
      include: {
        patient: {
          select: {
            id:true,
            last_name: true,
            first_name: true,
          },
        },
      },
      orderBy: {
        created_at: "desc",
      },
    });

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
      message: "Internal Server Error",
      status: 500,
    };
  }
}
