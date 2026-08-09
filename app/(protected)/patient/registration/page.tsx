import { clerkClient, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import React from "react";
import usePatientRegistration from "../_hooks/patient-registeration";
import PatientForm from "@/components/PatientForm";

import { Patient } from "@/lib/generated/prisma/client";
import { getPatientData } from "@/utils/services/patient";

async function RegistrationPage() {
  const user = await currentUser();
  let data: {
    success: boolean;
    error: boolean;
    message?: string | undefined;
    data?: Patient | null;
    status?:number | undefined
  } | null = null;

  if (user && user.id) {
    const response = await getPatientData(user?.id);
    data = { ...response };
  }

  return (
    <div className="flex  justify-center py-5 px-4  lg:px-0">
      <PatientForm data={data?.data} type={data ? "update" : "create"} />
    </div>
  );
}

export default RegistrationPage;
