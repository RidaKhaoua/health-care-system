import { Gender } from "@/lib/generated/prisma/enums";

export interface IPatient {
  id: string;
  first_name: string;
  last_name: string;
  img?: string | null;
  date_of_birth: Date;
  email: string;
  gender: Gender;
  phone: string;
  marital_status: string;
  address: string;
  emergency_contact_name?: string;
  emergency_contact_number?: string;
  blood_group?: string | null;
  allergies?: string | null;
  medical_conditions?: string | null;
  medical_history?: string | null;
  insurance_provider?: string | null;
  insurance_number?: String | null;
  privacy_consent: boolean;
  service_consent: boolean;
  medical_consent: boolean;
  colorCode?: string | null;
  isArchived?: boolean | null;
  created_at?: Date;
}
