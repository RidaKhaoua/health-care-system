import { createRouteMatcher } from "@clerk/nextjs/server";
import { Role } from "./generated/prisma/enums";

type RouteAccessProps = {
  [key: string]: string[];
};

export const routeAccess: RouteAccessProps = {
  "/admin(.*)": [Role.ADMIN],
  "/patient(.*)": [Role.PATIENT],
  "/doctor(.*)": [Role.DOCTOR],
  "/staf(.*)": [Role.NURSE, Role.LAB_TECHNICIAN, Role.CASHIER],
  "/records/users": [Role.ADMIN],
  "/records/doctors": [Role.ADMIN, Role.DOCTOR],
  "/records/stafs": [Role.ADMIN, Role.DOCTOR],
  "/records/patients": [Role.ADMIN, Role.DOCTOR, Role.NURSE],
  "/patient/regisrations": [Role.PATIENT],
};

// export const routeMatchers = {
//   admin: createRouteMatcher([
//     "/admin(.*)",
//     "/patient(.*)",
//     "/record/users",
//     "/record/doctors(.*)",
//     "/record/patients",
//     "/record/doctors",
//     "/record/staffs",
//   ]),
//   patient: createRouteMatcher(["/patient(.*)", "/patient/registrations"]),

//   doctor: createRouteMatcher([
//     "/doctor(.*)",
//     "/record/doctors(.*)",
//     "/record/patients",
//     "/patient(.*)",
//     "/record/staffs",
//   ]),
// };
