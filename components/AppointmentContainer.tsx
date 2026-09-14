import { getDoctors } from "@/utils/services/doctor";
import { getPatientById } from "@/utils/services/patient";
import React, { useMemo } from "react";
import BookAppointment from "./forms/BookAppointment";

async function AppointmentContainer({ id }: { id: string }) {
  // getData patient
  const patientData = await getPatientById(id);
  // Get Doctors
  const doctorsData = await getDoctors();

  if (!patientData.data || !doctorsData.data) {
    return null;
  }

  return (
    <BookAppointment
      patient={{
        first_name: patientData.data?.first_name,
        last_name: patientData.data?.last_name,
        img: patientData.data.img,
        gender:patientData.data.gender
      }}
      doctor={doctorsData.data}
    />
  );
}

export default AppointmentContainer;
