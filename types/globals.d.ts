import { Role } from "@/lib/generated/prisma/enums";

export {};

declare global {
  interface CustomJwtSessionClaims {
    metadata: {
      role?: Role // match your Role enum values exactly
    };
  }
}