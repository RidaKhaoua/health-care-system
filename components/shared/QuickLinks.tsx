import React from "react";
import { Card } from "../ui/card";
import Link from "next/link";

interface IQuickLinksProps {
  links: { name: string; href: string }[];
}

function QuickLinks({ links }: IQuickLinksProps) {
  return (
    <Card className="bg-white! text-black shadow-md border border-slate-100 p-4">
      <h1 className="mb-4 font-bold text-xl">Quick Links</h1>
      <div className="flex flex-wrap gap-4">
        {links.map((item) => (
          <Link
            className="p-3 rounded-md bg-yellow-50 text-sm shadow-md text-black hover:underline"
            href={item.href}
          >
            {item.name}
          </Link>
        ))}
      </div>
    </Card>
  );
}

export default QuickLinks;
