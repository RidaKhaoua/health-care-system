import React, { ReactNode } from "react";

interface ISmallCardProps {
  label: string;
  value?: string;
  children?: ReactNode;
}

function SmallCard({ label, value, children }: ISmallCardProps) {
  return (
    <div className="space-y-2">
      <h4 className="text-slate-500">{label}</h4>
      {value && <p className="text-sm text-black">{value}</p>}
      {children && children}
    </div>
  );
}

export default SmallCard;
