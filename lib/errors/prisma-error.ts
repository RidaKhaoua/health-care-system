import { Prisma } from "../generated/prisma/client";


export const PRISMA_ERROR_CODES = {
  NOT_FOUND: "P2025",
  UNIQUE_CONSTRAINT: "P2002",
  FOREIGN_KEY_CONSTRAINT: "P2003",
  RELATION_VIOLATION: "P2014",
} as const;

export function isPrismaError(
  error: unknown,
  code: string
): boolean {
  return (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    error.code === code
  );
}