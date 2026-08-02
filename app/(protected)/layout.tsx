import React, { ReactNode } from "react";

function layout({ children }: { children: ReactNode }) {
  return (
    <div className="flex gap-2 min-h-screen">
      <aside className="w-xs px-3 border-r border-slate-300">this is aside</aside>

      {children}
    </div>
  );
}

export default layout;
