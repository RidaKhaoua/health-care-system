"use client";
import { AppointmentStatus } from "@/lib/generated/prisma/enums";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import { APPOINTMENTS_STATUS } from "@/constants";
import { statusBadgeColors } from "./ui/StatusBadge";
import { Textarea } from "./ui/textarea";
import { AppointmentUpdateStatus } from "@/app/actions/appointment";
import { toast } from "./ui/toast";

interface IAppointmentAction {
  id: number;
  status: AppointmentStatus;
}

function AppointementAction({ id, status }: IAppointmentAction) {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedStatus, setSelectedStatus] =
    useState<AppointmentStatus | null>(null);
  const [reason, setReason] = useState("");
  const router = useRouter();

  const handleAction = async () => {
    try {
      setIsLoading(true);
      const newReason =
        reason || `Appointment has been ${selectedStatus} on ${new Date()}`;
      if (selectedStatus) {
        const response = await AppointmentUpdateStatus(
          id,
          selectedStatus,
          newReason,
        );
        if (response?.success) {
          toast.add({
            title: response.message,
          });
          router.refresh();
        } else {
          toast.add({
            title: response?.message,
          });
        }
      }
    } catch (error) {
      console.log(error);
      toast.add({
        title: "Somthing went wrong. Try again later",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="">
      <div className="flex items-center gap-2">
        <Button
          className={cn(
            "outline cursor-pointer",
            statusBadgeColors[APPOINTMENTS_STATUS.PENDING]!,
          )}
          disabled={
            status === "PENDING" || selectedStatus === "PENDING" || isLoading || status === "COMPLETED"
          }
          onClick={() => setSelectedStatus("PENDING")}
        >
          Pending
        </Button>
        <Button
          className={cn(
            "outline cursor-pointer",
            statusBadgeColors[APPOINTMENTS_STATUS.SCHEDULED]!,
          )}
          disabled={
            status === "SCHEDULED" ||
            isLoading ||
            status === "COMPLETED"
          }
          onClick={() => setSelectedStatus("SCHEDULED")}
        >
          Scheduled
        </Button>
        <Button
          className={cn(
            "outline cursor-pointer",
            statusBadgeColors[APPOINTMENTS_STATUS.COMPLETED]!,
          )}
          disabled={isLoading || status === "COMPLETED"}
          onClick={() => setSelectedStatus("COMPLETED")}
        >
          Completed
        </Button>
        <Button
          className={cn(
            "outline cursor-pointer",
            statusBadgeColors[APPOINTMENTS_STATUS.CANCELLED]!,
          )}
          disabled={
            status === "CANCELLED" ||
            isLoading ||
            status === "COMPLETED"
          }
          onClick={() => setSelectedStatus("CANCELLED")}
        >
          Cancelled
        </Button>
      </div>
      {selectedStatus === "CANCELLED" ? (
        <Textarea
          disabled={isLoading}
          className="mt-4 bg-white! border border-slate-300"
          placeholder="Enter reason..."
          onChange={(e) => setReason(e.target.value)}
        
        />
      ) : null}
      {selectedStatus ? (
        <div className="flex items-center justify-between mt-6 bg-red-100 p-4 rounded">
          <p className="">Are you sure you want to perform this action?</p>
          <Button disabled={isLoading} type="button" onClick={handleAction}>
            Yes
          </Button>
        </div>
      ) : null}
    </div>
  );
}

export default AppointementAction;
