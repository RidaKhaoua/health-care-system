import React from "react";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Button } from "./ui/button";
import { Ellipsis } from "lucide-react";
import DeleteRecord from "./shared/DeleteRecord";
import { deleteDoctor } from "@/utils/services/admin";

interface IDoctorActionsProps {
  id: string;
  status?: boolean | null;
}

function DoctorActions({ id, status }: IDoctorActionsProps) {
  return (
    <Popover>
      <PopoverTrigger
        render={
          <Button variant="link" className="cursor-pointer">
            <Ellipsis className="size-5 text-black" />
          </Button>
        }
      />
      <PopoverContent className="bg-white! text-black flex flex-col items-stretch">
        <DeleteRecord
          id={id}
          handleDeleteRecord={deleteDoctor}
          status={status}
        />
      </PopoverContent>
    </Popover>
  );
}

export default DoctorActions;
