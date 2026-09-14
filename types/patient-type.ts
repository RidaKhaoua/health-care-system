import { Gender } from "@/lib/generated/prisma/enums";

export interface IPatient {
  id: string;
  first_name: string;
  last_name: string;
  img?: string | null;
  email:string;
  gender:Gender
  // TODO: add others data
}
