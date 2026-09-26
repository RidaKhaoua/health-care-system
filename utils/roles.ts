import { Role } from "@/lib/generated/prisma/enums";
import { auth } from "@clerk/nextjs/server";

export async function getRoles() {
  const { sessionClaims } = await auth();
  const role =sessionClaims?.metadata?.role!?.toLowerCase() || Role.PATIENT.toLowerCase();
  
  return role;
}
