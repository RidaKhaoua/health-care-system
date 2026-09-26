import { z } from "zod";
import { Gender } from "./generated/prisma/enums";

const phoneNumerShema = z
  .string()
  .trim()
  .regex(
    /^(?:\+212|0)(?:6|7)[0-9]{8}$/,
    "Numéro de téléphone marocain invalide",
  );

export const PatientFormShema = z.object({
  first_name: z
    .string()
    .trim()
    .min(2, { message: "FirstName must be at least 2" })
    .max(25, { message: "FirstName muste be at most 25  " }),
  last_name: z
    .string()
    .trim()
    .min(2, { message: "LastName must be at least 2" })
    .max(25, { message: "LastName muste be at most 25  " }),
  date_of_birth: z
    .date({ message: "Date is required" })
    .transform((val) => new Date(val))
    .refine((date) => !isNaN(date.getTime()), {
      message: "Invalid date of birth",
    }),
  gender: z
    .enum(["MALE", "FEMALE"], {
      message: "Gender is required",
    })
    .nullable()
    .transform((val, ctx) => {
      if (val === null) {
        ctx.addIssue({
          code: "custom",
          message: "Gender is required",
        });
        return z.NEVER;
      }
      return val;
    }),
  phone: phoneNumerShema,
  email: z.email({ message: "email is require" }),
  address: z
    .string()
    .min(5, { message: "Adress must be at least 5" })
    .max(500, { message: "Adress must be at most 500" }),
  marital_status: z
    .enum(["married", "single", "divorced", "widowed", "separated"], {
      message: "Marital status is required",
    })
    .nullable()
    .transform((val, ctx) => {
      if (val === null) {
        ctx.addIssue({
          code: "custom",
          message: "Marital status is required",
        });
        return z.NEVER;
      }
      return val;
    }),
  emergency_contact_name: z
    .string()
    .min(2, { message: "Emergency contact name is required" })
    .max(50, { message: "Emergency contact name must be at most 50 " }),
  emergency_contact_number: phoneNumerShema,
  relation: z
    .enum(["mother", "father", "husband", "wife", "other"], {
      message: "Relations with contact person is required",
    })
    .nullable()
    .transform((val, ctx) => {
      if (val === null) {
        ctx.addIssue({
          code: "custom",
          message: "Relation is required",
        });
        return z.NEVER;
      }
      return val;
    }),
  blood_group: z.string().nullable().optional(),
  allergies: z.string().nullable().optional(),
  medical_conditions: z.string().nullable().optional(),
  medical_history: z.string().nullable().optional(),
  insurance_provider: z.string().nullable().optional(),
  insurance_number: z.string().nullable().optional(),
  privacy_consent: z
    .boolean()
    .default(false)
    .refine((val) => val == true, {
      message: "You must agree to the privacy policy",
    }),
  service_consent: z
    .boolean()
    .default(false)
    .refine((val) => val === true, {
      message: "You must agree to the terms of service",
    }),
  medical_consent: z
    .boolean()
    .default(false)
    .refine((val) => val === true, {
      message: "You must agree to the medical treatment terms.",
    }),
  img: z.string().optional(),
});

const shemaOption = z.object({
  label: z.string,
  value: z.string,
});

export const BookAppointment = z.object({
  doctors: z.string().min(1, { message: "doctors is required" }),
  date: z
    .date({ message: "Date is required" })
    .transform((date) => new Date(date))
    .refine((date) => !isNaN(date.getTime()), {
      message: "Invalid date of birth",
    }),
  time: z.string().min(1, { message: "Time is required" }),
  note: z
    .string()

    .max(500, { message: "The Adress must be at most 500" })
    .optional(),
  appointmentType: z
    .string()
    .min(1, { message: "Type Appointment is required" }),
});

export type TPatientFormInput = z.input<typeof PatientFormShema>;
export type TPatientForm = z.output<typeof PatientFormShema>;
export type TBookAppointmentInput = z.input<typeof BookAppointment>;
export type TBookAppointment = z.output<typeof BookAppointment>;
