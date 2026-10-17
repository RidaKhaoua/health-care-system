"use client";
import { Dialog, DialogContent, DialogTrigger } from "../ui/dialog";

import { CircleQuestionMark, Loader, RotateCcw, Trash, Triangle } from "lucide-react";
import { Button } from "../ui/button";
import { deleteDoctor, deletePatient } from "@/utils/services/admin";
import { toast } from "../ui/toast";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface IDeletRecord {
  id: string;
  handleDeleteRecord: (
    id: string,
    isArchived: boolean,
  ) => Promise<{
    success: boolean;
    error?: boolean;
    message: string;
    status: number;
  }>;
  status?: boolean | null;
}

function DeleteRecord({ id, status, handleDeleteRecord }: IDeletRecord) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const handleDelete = async () => {
    setLoading(true);
    const response = await handleDeleteRecord(id, status!);
    if (response.success) {
      toast.add({
        title: "Sucess",
        description: response.message,
      });
      router.refresh();
    } else {
      toast.add({
        title: "Error",
        description: response.message,
      });
      setLoading(false);
    }
  };
  return (
    <Dialog>
      <DialogTrigger
        render={
          status ? (
            <Button className="text-green-500 hover:bg-slate-100 flex items-center justify-start bg-transparent">
              <RotateCcw className="size-4" />
              <span>Restore</span>
            </Button>
          ) : (
            <Button className="text-red-500 hover:bg-slate-100 flex items-center justify-start bg-transparent">
              <Trash className="size-4" />
              <span>Delete</span>
            </Button>
          )
        }
      />
      <DialogContent className="bg-white md:max-w-lg text-black flex flex-col items-center justify-center">
         <CircleQuestionMark className="size-20 text-black" />
         <h4 className="font-semibold text-xl"> {status ? "Restore" : "Delete"} Confirmation</h4>
          <p className="text-slate-500 text-md">
            Are you sure  you want {status ? "restore" : "delete"} the selected record?
          </p>
        <div className="flex items-center  gap-4">
          <Button variant="link" className="text-black!">
            Cancel
          </Button>
          <Button
            onClick={() => {
              handleDelete();
            }}
            variant="secondary"
            className="hover:text-black!"
            disabled={loading}
          >
            {loading ? <Loader className="animate-spin" /> : "Confirm"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default DeleteRecord;
