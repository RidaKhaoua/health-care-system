import { getMedicalPatientRecords } from "@/utils/services/medicalRecords";
import MedicalHistory from "./MedicalHistory";
import { IMedicalRecords } from "@/types/data-type";

interface IMedicalHistoryContainer {
  id?: string | number;
  patientId: string;
}
async function MedicalHistoryContainer({
  id,
  patientId,
}: IMedicalHistoryContainer) {
  const response = await getMedicalPatientRecords(patientId);
  

  const medicalRecordsAdapter = response?.data ? response.data.map(item => ({
    date_time: item.created_at,
    doctor: item.diagnosis,
    labTest: item.lab_test
  })) : null

  return <MedicalHistory data={null}/>;
}

export default MedicalHistoryContainer;
