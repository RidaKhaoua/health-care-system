"use client";
import { createAppointment } from "@/app/actions/appointment";
import { toast } from "@/components/ui/toast";
import {
  BookAppointment,
  TBookAppointment,
  TBookAppointmentInput,
} from "@/lib/schema";
import { useUser } from "@clerk/nextjs";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

const useBookAppointment = () => {
  const { user } = useUser();
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const form = useForm<TBookAppointmentInput, any, TBookAppointment>({
    resolver: zodResolver(BookAppointment),
    mode: "all",
    defaultValues: {
      doctors: "",
      time: "",
      note: "",
      appointmentType: "",
    },
  });

  const submitForm: SubmitHandler<TBookAppointmentInput> = async (data) => {
    if (user?.id) {
      try {
        setLoading(true);
        const response = await createAppointment({
          patient_id: user.id,
          type: data.appointmentType,
          doctor_id: data.doctors,
          appointment_date: data.date,
          note: data.note ?? "",
          time: data.time,
        });
        if (response.success) {
          form.reset();
          router.refresh();
          toast.add({
            title: "success",
            description: response.message,
            type: "success",
          });
        }
      } catch (error) {
        console.log(error);
        toast.add({
          title: "error",
          description: "Something is wrong, Try Later.",
          type: "error",
        });
      } finally {
        setLoading(false);
      }
    }
  };

  return {
    form,
    submitForm,
    loading,
  };
};

export default useBookAppointment;
