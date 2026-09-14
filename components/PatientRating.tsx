import React from "react";
import { Card, CardContent, CardHeader } from "./ui/card";
import Link from "next/link";
import { NotepadText, Star } from "lucide-react";
import ProfileImage from "./ProfileImage";
import { IPatient } from "@/types/patient-type";
import { format } from "date-fns";

interface IPatientRating {
  data: {
    rating: number;
    id: number;
    staff_id: string;
    comment: string | null;
    created_at: Date;
    patient: Pick<IPatient, "id" | "first_name" | "last_name" | "img">;
  }[];
}

function PatientRating({ data }: IPatientRating) {
  return (
    <Card className="bg-white! shadow-md border border-slate-200">
      <CardHeader>
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-xl text-black">Patient Ratings</h3>
          <Link href={"/record"} className="text-slate-400 hover:underline">
            View All
          </Link>
        </div>
      </CardHeader>
      <CardContent>
        {data.length > 0 ? (
          data.map((item) => (
            <div className="mb-4 even:bg-slate-100 p-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1 mb-1">
                  <ProfileImage
                    imageUrl={item.patient.img}
                    name={
                      item.patient.first_name + " " + item.patient.last_name
                    }
                  />
                  <div>
                  <p className="text-black font-semibold">
                    {item.patient.first_name} {item.patient.last_name}
                  </p>
                    <p className="text-slate-500">

                  {format(new Date(item.created_at), "P")}
                  </p>
                  </div>
                </div>
                  
               <div className="flex items-center gap-1">
                 {Array.from({ length: item.rating }, (_, index) => (
                  <Star key={index} className="size-4 text-yellow-400" />
                  
                ))}
                <span className="text-black">{item.rating.toFixed(1)}</span>
               </div>
              </div>
              <p className="text-slate-400 ">{item.comment}</p>
            </div>
          ))
        ) : (
          <div className="h-40 flex flex-col justify-center items-center gap-2 text-slate-400">
            <NotepadText className="size-8" />
            <p>No Rating Available now</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default PatientRating;
