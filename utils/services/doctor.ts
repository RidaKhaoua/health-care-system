import { prisma } from "@/lib/prisma";

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
