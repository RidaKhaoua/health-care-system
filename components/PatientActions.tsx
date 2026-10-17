"use client";

import { Ellipsis, Eye } from "lucide-react";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import SmallCard from "@/components/SmallCard";

import { IPatient } from "@/types/patient-type";
import DeleteRecord from "./shared/DeleteRecord";
import { deletePatient } from "@/utils/services/admin";

interface PatientActionsProps {
  patient: IPatient;
  status?: boolean | null;
}

export default function PatientActions({
  patient,
  status,
}: PatientActionsProps) {
  return (
    <Popover>
      <PopoverTrigger
        render={
          <Button variant="link">
            <Ellipsis className="size-5 text-black" />
          </Button>
        }
      />

      <PopoverContent className="bg-white! text-black flex-col items-stretch">
        <Dialog>
          <DialogTrigger
            render={
              <Button className="flex items-center justify-start bg-transparent hover:bg-slate-100">
                <Eye className="size-4" />
                <span>View Details</span>
              </Button>
            }
          />

          <DialogContent className="bg-white text-black md:max-w-2xl">
            <DialogHeader>
              <DialogTitle className="mb-8 text-2xl font-bold">
                Patient more details
              </DialogTitle>

              <div className="flex gap-10 ">
                <div className="space-y-2">
                  <SmallCard label="Adress" value={patient.address} />
                  <SmallCard
                    label="Emergency contact name"
                    value={patient.emergency_contact_name! ?? "Not Available"}
                  />
                  <SmallCard
                    label="Emergency contact number"
                    value={patient.emergency_contact_number! ?? "Not Available"}
                  />
                  <SmallCard
                    label="Blood group"
                    value={patient.blood_group! ?? "Not Available"}
                  />
                </div>
                <div className="space-y-2">
                  <SmallCard
                    label="Allergies"
                    value={patient.allergies ?? "Not Available"}
                  />
                  <SmallCard
                    label="Medical history"
                    value={patient.medical_history ?? "Not Available"}
                  />
                  <SmallCard
                    label="Insurance provider"
                    value={patient.insurance_provider! || "Not Available"}
                  />
                  <SmallCard
                    label="Insurance number"
                    value={
                      patient.insurance_number
                        ? String(patient.insurance_number!)
                        : "Not Available"
                    }
                  />
                </div>
                <div className="space-y-2">
                  <SmallCard
                    label="Privacy consent"
                    value={patient.privacy_consent ? "Yes" : "No"}
                  />
                  <SmallCard
                    label="Service consent"
                    value={patient.service_consent ? "Yes" : "No"}
                  />
                  <SmallCard
                    label="Medical consent"
                    value={patient.medical_consent ? "Yes" : "No"}
                  />
                </div>
              </div>
            </DialogHeader>
          </DialogContent>
        </Dialog>

        <DeleteRecord
          id={patient.id}
          handleDeleteRecord={deletePatient}
          status={status}
        />
      </PopoverContent>
    </Popover>
  );
}
