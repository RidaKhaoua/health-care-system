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
      {
        name: "Profile",
        href: "/doctor/self",
        access: ["doctor"],
        icon: User,
      },
    ],
  },
  {
    label: "Manage",
    links: [
      {
        name: "Doctors",
        href: "/records/doctors",
        access: ["admin"],
        icon: User,
      },
      {
        name: "Staffs",
        href: "/records/staffs",
        access: ["admin", "doctor"],
        icon: UserRound,
      },
      {
        name: "Patients",
        href: "/records/patients",
        access: ["admin", "doctor", "nurse"],
        icon: UsersRound,
      },
      {
        name: "Appointments",
        href: "/records/appointments",
        access: ["admin", "doctor", "nurse"],
        icon: ListOrdered,
      },
      {
        name: "Medical Records",
        href: "/records/medical-records",
        access: ["admin", "doctor", "nurse"],
        icon: SquareActivity,
      },
      {
        name: "Billing Overview",
        href: "/records/billing",
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

export const DOCTOR_STATUS: Record<"ACTIVE" | "BLOCKED", TVariants> = {
  ACTIVE: "success",
  BLOCKED: "error",
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

export const COLUMNS_SCHEDULE = [
  {
    header: "FullName",
    key: "fullName",
  },
  {
    header: "Date",
    key: "date",
  },
  {
    header: "Status",
    key: "status",
  },
  {
    header: "Action",
    key: "action",
  },
];

export const COLUMNS_MEDICALRECORDS = [
  {
    header: "Date & TIME",
    key: "date_time",
  },
  {
    header: "DOCTOR",
    key: "doctor",
    className: "hidden md:table-cell",
  },
  {
    header: "DIAGNOSIS",
    key: "diagnosis",
    className: "hidden md:table-cell",
  },
  {
    header: "LAB TEST",
    key: "lab_test",
    className: "hidden md:table-cell",
  },
];

export const TYPES_Appointment = [
  { label: "General Consultation", value: "General Consultation" },
  { label: "General Check up", value: "General Check Up" },
  { label: "Antenatal", value: "Antenatal" },
  { label: "Maternity", value: "Maternity" },
  { label: "Lab Test", value: "Lab Test" },
  { label: "ANT", value: "ANT" },
];

export const COLUMNS_PATIENTS = [
  {
    header: "FullName",
    key: "fullname",
  },
  {
    header: "Register Date",
    key: "register_date",
  },
  {
    header: "Phone",
    key: "phone",
  },
  {
    header: "Email",
    key: "email",
  },
  {
    header: "Marital Status",
    key: "marital_status",
  },
  {
    header: "Status",
    key: "status",
  },

  {
    header: "Action",
    key: "action",
    className: "hidden md:table-cell",
  },
];

export const COLUMNS_DOCTORS = [
  {
    header: "FullName",
    key: "fullname",
  },
  {
    header: "Specialiste",
    key: "speacialiste",
  },
  {
    header: "Register Date",
    key: "register_date",
  },
  {
    header: "Phone",
    key: "phone",
  },
  {
    header: "Email",
    key: "email",
  },
  {
    header: "Status",
    key: "status",
  },

  {
    header: "Action",
    key: "action",
    className: "hidden md:table-cell",
  },
];

export const USER_STATUS_COLOR: Record<string, TVariants> = {
  true: "error",
  false: "success",
};
