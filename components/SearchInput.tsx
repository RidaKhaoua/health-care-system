"use client";

import { useEffect, useState } from "react";
import { Input } from "./ui/input";
import useSearchDebounce from "@/hooks/searchDebounce";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

function SearchInput() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const searchDebounce = useSearchDebounce(search);
  const pathName = usePathname();
    
  useEffect(() => {
    const params = new URLSearchParams();
    if (searchDebounce.length > 0) {
      params.set("q", searchDebounce);
      router.push(pathName + "?" + params.toString());
    } else {
      params.delete("q");
      router.push(pathName + "?" + params.toString());
    }
  }, [searchDebounce]);

  return (
    <Input
      onChange={(e) => setSearch(e.target.value)}
      value={search}
      placeholder="search"
      className=" border max-w-70 border-slate-200 bg-white! py-5! text-black!"
    />
  );
}

export default SearchInput;
