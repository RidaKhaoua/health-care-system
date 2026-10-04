import { getRatingDoctorById } from "@/utils/services/doctor";
import RatingChart from "./charts/RatingChart";
import PatientRating from "./PatientRating";

async function DoctorRatingContainer({ id }: { id: string }) {
  const response = await getRatingDoctorById(id);

  const patientRatingAdapter = response.data?.patientRatings ? response.data.patientRatings.map(item =>({
    id:item.id,
    staff_id:item.staff_id,
    rating: item.rating,
    comment:item.comment,
    created_at:item.created_at,
    patient:item.patient
  }) ) : []

  return (
    <div className="space-y-4">
      <RatingChart
        totalRatings={response.data?.totalRating || 0}
        averageRating={response.data?.averageRating || 0}
      />
      
      <PatientRating data={patientRatingAdapter}/>
    </div>
  );
}

export default DoctorRatingContainer;
