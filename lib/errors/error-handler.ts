import { Prisma } from "../generated/prisma/client"
import { PRISMA_ERROR_CODES } from "./prisma-error";

export function handleDatabaseError(error: unknown) {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    switch (error.code) {
      case PRISMA_ERROR_CODES.NOT_FOUND:
        return {
          success: false,
          status: 404,
          message: "Resource not found",
        };

      case PRISMA_ERROR_CODES.UNIQUE_CONSTRAINT:
        return {
          success: false,
          status: 409,
          message: "This resource already exists",
        };

      case PRISMA_ERROR_CODES.FOREIGN_KEY_CONSTRAINT:
        return {
          success: false,
          status: 400,
          message: "Invalid relation",
        };

      case PRISMA_ERROR_CODES.RELATION_VIOLATION:
        return {
          success: false,
          status: 400,
          message: "This resource cannot be modified because it is related to other data",
        };

      default:
        return {
          success: false,
          status: 500,
          message: "Database error",
        };
    }
  }

  return {
    success: false,
    status: 500,
    message: "Something went wrong",
  };
}