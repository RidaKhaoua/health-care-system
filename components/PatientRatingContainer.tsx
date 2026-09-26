import { getRatingPatient } from "@/utils/services/rating";
import { auth } from "@clerk/nextjs/server";
import React from "react";
import PatientRating from "./PatientRating";

async function PatientRatingContainer() {
  const { userId } = await auth();
  const { data } = await getRatingPatient(userId!);

  const patientRatingAdapter =
    data && data.length > 0
      ? data.map((item) => ({
          rating: item.rating,
          id: item.id,
          staff_id: item.staff_id,
          comment: item.comment,
          created_at: item.created_at,
          patient: {
            id: item.patient.id,
            first_name: item.patient.first_name,
            last_name: item.patient.last_name,
          },
        }))
      : null;

  return (
    <div>
      <PatientRating data={patientRatingAdapter} />
    </div>
  );
}

export default PatientRatingContainer;
