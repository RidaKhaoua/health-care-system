import { TVariants } from "@/components/ui/StatusBadge";
import { AppointmentStatus } from "@/lib/generated/prisma/enums";
import {
  Bell,
  LayoutDashboard,
  List,
  ListOrdered,
  Logs,
  Pill,
  Receipt,
  Settings,
  SquareActivity,
  User,
  UserRound,
  Users,
  UsersRound,
} from "lucide-react";

const ACCESS_LEVELS_ALL = [
  "admin",
  "doctor",
  "nurse",
  "lab technician",
  "patient",
];

export const SIDEBAR_LINKS = [
  {
    label: "MENU",
    links: [
      {
        name: "Dashboard",
        href: "/",
        access: ACCESS_LEVELS_ALL,
        icon: LayoutDashboard,
      },
      {
        name: "Profile",
        href: "/patient/self",
        access: ["patient"],
        icon: User,
      },
    ],
  },
  {
    label: "Manage",
    links: [
      {
        name: "Users",
        href: "/record/users",
        access: ["admin"],
        icon: Users,
      },
      {
        name: "Doctors",
        href: "/record/doctors",
        access: ["admin"],
        icon: User,
      },
      {
        name: "Staffs",
        href: "/record/staffs",
        access: ["admin", "doctor"],
        icon: UserRound,
      },
      {
        name: "Patients",
        href: "/record/patients",
        access: ["admin", "doctor", "nurse"],
        icon: UsersRound,
      },
      {
        name: "Appointments",
        href: "/record/appointments",
        access: ["admin", "doctor", "nurse"],
        icon: ListOrdered,
      },
      {
        name: "Medical Records",
        href: "/record/medical-records",
        access: ["admin", "doctor", "nurse"],
        icon: SquareActivity,
      },
      {
        name: "Billing Overview",
        href: "/record/billing",
        access: ["admin", "doctor"],
        icon: Receipt,
      },
      {
        name: "Patient Management",
        href: "/nurse/patient-management",
        access: ["nurse"],
        icon: Users,
      },
      {
        name: "Administer Medications",
        href: "/nurse/administer-medications",
        access: ["admin", "doctor", "nurse"],
        icon: Pill,
      },
      {
        name: "Appointments",
        href: "/records/appointments",
        access: ["patient"],
        icon: ListOrdered,
      },
      {
        name: "Records",
        href: "/patient/records",
        access: ["patient"],
        icon: List,
      },
      {
        name: "Prescription",
        href: "#",
        access: ["patient"],
        icon: Pill,
      },
      {
        name: "Billing",
        href: "/patient/self?cat=payments",
        access: ["patient"],
        icon: Receipt,
      },
    ],
  },
  {
    label: "System",
    links: [
      {
        name: "Notifications",
        href: "/notifications",
        access: ACCESS_LEVELS_ALL,
        icon: Bell,
      },
      {
        name: "Audit Logs",
        href: "/admin/audit-logs",
        access: ["admin"],
        icon: Logs,
      },
      {
        name: "Settings",
        href: "/admin/system-settings",
        access: ["admin"],
        icon: Settings,
      },
    ],
  },
];

export const GenderList = [
  { label: "Male", value: "MALE" },
  { label: "Female", value: "FEMALE" },
];

export const Marital_status = [
  { label: "Married", value: "married" },
  { label: "Single", value: "single" },
  { label: "Divorced", value: "divorced" },
  { label: "Widowed", value: "widowed" },
  { label: "Separated", value: "sparated" },
];

export const Relation = [
  { label: "Mother", value: "mother" },
  { label: "Father", value: "father" },
  { label: "Husband", value: "husband" },
  { label: "Wife", value: "wife" },
  { label: "Other", value: "other" },
];

export const APPOINTMENTS_STATUS: Record<AppointmentStatus, TVariants> = {
  COMPLETED: "success",
  CANCELLED: "error",
  PENDING: "warning",
  SCHEDULED: "default",
};

export const DAYS_OF_WEEK = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

export const COLUMNS_APPOINETMENTS = [
  {
    header: "Info",
    key: "name",
  },
  {
    header: "Date",
    key: "appointment_date",
    className: "hidden md:table-cell",
  },
  {
    header: "Time",
    key: "time",
    className: "hidden md:table-cell",
  },
  {
    header: "Doctor",
    key: "doctor",
    className: "hidden md:table-cell",
  },
  {
    header: "Status",
    key: "status",
    className: "hidden md:table-cell",
  },
  {
    header: "Action",
    key: "action",
    className: "hidden md:table-cell",
  },
];