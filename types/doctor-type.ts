interface IDoctor {
  id: string;
  name: string;
  specialization: string;
  img?: string | null;
  phone: string;
  email: string;
  isArchived?:boolean | null;
  created_at?:Date;
}
