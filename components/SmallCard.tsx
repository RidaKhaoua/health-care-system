import React from "react";

interface ISmallCardProps {
  label: string;
  value: string;
}

function SmallCard({ label, value }: ISmallCardProps) {
  return (
    <div className="space-y-2">
      <h4 className="text-slate-500">{label}</h4>
      <p className="text-sm text-black">{value}</p>
    </div>
  );
}

export default SmallCard;
