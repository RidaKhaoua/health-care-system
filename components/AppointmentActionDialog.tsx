"use client";

import { Ban, Check, Loader2 } from "lucide-react";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { GiConfirmed } from "react-icons/gi";
import { MdCancel } from "react-icons/md";
import { Textarea } from "./ui/textarea";
import { useCallback, useState } from "react";
import { Field, FieldLabel } from "./ui/field";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { AppointmentUpdateStatus } from "@/app/actions/appointment";
import { toast } from "./ui/toast";

interface IAppointmentActionDialogProps {
  id: number;
  disabled: boolean;
  type: "approve" | "cancel";
}

function AppointmentActionDialog({
  id,
  disabled,
  type,
}: IAppointmentActionDialogProps) {
  const [loadig, setLoading] = useState(false);
  const router = useRouter();
  const [reason, setReason] = useState("");
  console.log(reason)
  const handleAction = useCallback(async () => {
    if (type === "cancel" && reason.length === 0) {
      toast.add({
        title: "error",
        description: "Please privide a reason for cancelletion.",
      });
      return;
    }

    try {
      setLoading(true);
      const newReason =
        reason ||
        `Appointment has ben ${type === "approve" ? "scheduled" : "cancelled"} on ${new Date()}`;
      const response = await AppointmentUpdateStatus(
        id,
        type === "approve" ? "SCHEDULED" : "CANCELLED",
        newReason,
      );
      if (response?.success) {
        router.refresh();
        toast.add({
          title: "success",
          description: response.message,
          type:"success"
        });
      }
    } catch (error) {
      toast.add({
        title: "error",
        description: "Something went wrong. Try again later.",
        type:"error"
      });
    } finally {
      setLoading(false);
    }
  }, [reason]);
  return (
    <Dialog >
      <DialogTrigger
        disabled={disabled}
        render={
          type === "approve" ? (
            <Button className="hover:bg-slate-100 w-full flex items-center justify-start bg-transparent text-green-400">
              <Check className="size-5" />
              <span>Approve</span>
            </Button>
          ) : (
            <Button className="hover:bg-slate-100 w-full flex items-center justify-start bg-transparent text-red-400">
              <Ban className="size-5" />
              <span>Cancel</span>
            </Button>
          )
        }
      />
      <DialogContent className="bg-white! shadow-md">
        <div className="flex flex-col items-center justify-center py-6 gap-2">
          <DialogTitle>
            {type === "approve" ? (
              <div className="bg-emerald-200 h-16 w-16 py-4 flex items-center justify-center rounded-full mb-2">
                <GiConfirmed className="text-emerald-500 size-8" />
              </div>
            ) : (
              <div className="bg-red-200 h-16 w-16 flex justify-center items-center p-4 rounded-full mb-2">
                <MdCancel className="text-red-500 size-14" />
              </div>
            )}
          </DialogTitle>
          <span className="text-xl text-black">
            Appointment {type === "approve" ? "Confiramtion" : "Cancellation"}
          </span>
          <p className="text-sm text-center text-gray-500">
            {type === "approve"
              ? "You're about to confirmed this appointment. Yes to approve or No to cancel."
              : "Are you sure you want to cancel this appointment?"}
          </p>
          {type === "cancel" ? (
            <Field className="mt-4">
              <FieldLabel className="text-black">Reason:</FieldLabel>

              <Textarea
                className="bg-white! text-black"
                rows={8}
                placeholder="Cancellation reason..."
                value={reason}
                onChange={(e) => setReason(e.target.value)}
              />
            </Field>
          ) : null}
          <div className="flex items-center justify-end mt-4 gap-2">
            <Button
              onClick={handleAction}
              disabled={loadig}
              className={cn(
                "px-4 py-2 text-sm font-medium text-white hover:text-white hover:underline",
                type === "approve"
                  ? "bg-blue-600 hover:bg-blue-700"
                  : "bg-destructive hover:bg-destructive",
              )}
            >
              {loadig ? <Loader2 className="animate-spin size-4"/> : `yes,${type === "approve" ? "Approve" : "Cancel"}`}
            </Button>
            <DialogClose>
              <Button
                variant="outline"
                className="px-4 py-2 text-sm underline text-gray-500 hover:text-gray-500 bg-white!"
              >
                No
              </Button>
            </DialogClose>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default AppointmentActionDialog;
