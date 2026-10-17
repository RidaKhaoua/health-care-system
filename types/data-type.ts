import { AppointmentStatus, Gender } from "@/lib/generated/prisma/enums";
import { IPatient } from "./patient-type";

export interface IAppointementsChartProps {
  name: string;
  appointment: number;
  completed: number;
}

export interface IRecentAppointment {
  id: number;
  patient_Id: string;
  docotr_Id?: string;
  patientFirstName: string;
  patientLastName: string;
  doctorName?: string;
  time: string;
  dateAppointment: Date;
  gender: Gender;
  status: AppointmentStatus;
  img: string | null;
}

export interface IPatientAppointments {
  appointment_date: Date;
  time: string;
  doctor: {
    name: string;
    id: string;
    img: string | null;
    colorCode: string | null;
    specialization: string;
  };
  status: AppointmentStatus;
  id: number;
  patient_id: string;
  doctor_id: string;
  type: string;
  patient: {
    id: string;
    first_name: string;
    last_name: string;
    date_of_birth: Date;
    phone: string;
    img: string | null;
    gender: Gender;
  };
}

export interface IPatientsOfToday {
  patient: IPatient;
  id: number;
  patient_id: string;
  doctor_id: string;
  appointment_date: Date;
  time: string;
  status: AppointmentStatus;
}

export interface IMedicalRecords {
  date_time: string;
  doctor: string;
  labTest: string;
  diagnosis: string;
}

