"use client";

import { Database } from "lucide-react";

interface IEmptyData {
    message:string;
}
function EmptyData({message}:IEmptyData) {
  return (
    <div className="min-h-screen flex items-center justify-center text-slate-400">
      <div className="space-y-4 flex flex-col justify-center items-center">
        <Database className="siize-20" />
        <p>{message}</p>
      </div>
    </div>
  );
}

export default EmptyData;
