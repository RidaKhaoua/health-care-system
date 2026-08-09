"use client";
import { createNewPatient, updatePatient } from "@/app/actions/patient";
import { toast } from "@/components/ui/toast";
import { Patient } from "@/lib/generated/prisma/client";
import {
  PatientFormShema,
  TPatientForm,
  TPatientFormInput,
} from "@/lib/schema";
import { useUser } from "@clerk/nextjs";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";

import { useEffect, useMemo, useState } from "react";
import { SubmitErrorHandler, SubmitHandler, useForm } from "react-hook-form";

const usePatientRegistration = (data?: Patient | null) => {
  const isUpdate = !!data;
  const { user } = useUser();
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  const defaultValues = useMemo(() => {
    return {
      first_name: user?.firstName || "",
      last_name: user?.lastName || "",
      email: user?.emailAddresses[0].emailAddress || "",
      phone: user?.phoneNumbers.toString() || "",
      emergency_contact_name: "",
      emergency_contact_number: "",
      address: "",
      gender: null,
      relation: null,
      marital_status: null,
      privacy_consent: false,
      service_consenst: false,
      medical_consenst: false,
      blood_group: "",
      allergies: "",
      medical_conditions: "",
      medical_history: "",
      insurance_provider: "",
      insurance_number: "",
    };
  }, []);

  const form = useForm<TPatientFormInput, any, TPatientForm>({
    resolver: zodResolver(PatientFormShema),
    mode: "all",
    defaultValues: {
      ...defaultValues,
    },
  });

  useEffect(() => {
    if (user) {
      form.setValue("first_name", user?.firstName || "");
      form.setValue("last_name", user?.lastName || "");
      form.setValue("email", user.emailAddresses[0].emailAddress);
    }
  }, [user]);

  const handleSetLoading = (val: boolean) => {
    setLoading(val);
  };

  const onSubmit: SubmitHandler<TPatientFormInput> = async (data) => {
    if (user && user.id) {
      if (data.gender && data.relation && data.marital_status) {
        handleSetLoading(true);
        const payload = {
          ...data,
          gender: data.gender,
          relation: data.relation,
          marital_status: data.marital_status,
          privacy_consent: data.privacy_consent || false,
          service_consent: data.service_consent || false,
          medical_consent: data.medical_consent || false,
          img: data.img || "",
          medical_conditions: data.medical_conditions || "",
          medical_history: data.medical_history || "",
          insurance_provider: data.insurance_provider || "",
          insurance_number: data.insurance_number || "",
          blood_group: data.blood_group || "",
          allergies: data.allergies || "",
        };
        const response = isUpdate
          ? await updatePatient(payload, user.id!)
          : await createNewPatient(payload, user?.id);

        if (response?.success) {
          toast.add({
            title: "sucess",
            description: response.message,
            type: "success",
          });
        } else {
          alert("from else");
          toast.add({
            title: "error",
            description: response.message,
            type: "error",
          });
        }
        handleSetLoading(false);
      }
    }
  };

  const onError: SubmitErrorHandler<TPatientFormInput> = (errors) => {
    toast.add({
      title: "Warning",
      description: "You should set all required informations",
    });
    console.log(errors);
  };

  return {
    form,
    onSubmit,
    onError,
    loading,
    defaultValues,
    isUpdate,
  };
};
export default usePatientRegistration;
