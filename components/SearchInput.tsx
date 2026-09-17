"use client";

import { useEffect, useState } from "react";
import { Input } from "./ui/input";
import useSearchDebounce from "@/hooks/searchDebounce";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

function SearchInput() {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const searchDebounce = useSearchDebounce(search);
  const searchParams = useSearchParams()
  const pathName = usePathname();
    
  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    if (searchDebounce.trim().length > 0) {
      console.log(params)
      params.delete("p")
      params.set("q", searchDebounce);
      router.push(pathName + "?" + params.toString());
    } else if(searchDebounce.length === 0) {
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
