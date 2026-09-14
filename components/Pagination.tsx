"use client";
import usePaginationRange from "@/hooks/usePagination";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  PaginationContent,
  Pagination,
  PaginationItem,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
  PaginationLink,
} from "./ui/pagination";
import { cn } from "@/lib/utils";


interface IPagination {
  totalRecords: number;
  totalPages: number;
  limit: number;
  currentPage: number;
}

const DOTS = "dots";

function PaginationBtn({
  totalRecords,
  totalPages,
  limit,
  currentPage,
}: IPagination) {
  
  const paginationRange = usePaginationRange(currentPage, totalPages, 1);

  const pathName = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  const createQueryString = (name: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set(name, value);
    return params.toString();
  };
  const handlePrevious = () => {
    if (currentPage > 1) {
      router.push(
        `${pathName}?${createQueryString("p", (currentPage - 1).toString())}`,
      );
      
    }
  };

  const handelNext = () => {
    if (currentPage < totalPages) {
      router.push(
        `${pathName}?${createQueryString("p", (currentPage + 1).toString())}`,
      );
      
    }
  };

  return (
    <Pagination className="flex items-center justify-end text-black my-4">
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            onClick={(e) => {
              e.preventDefault();
              handlePrevious();
            }}
            aria-disabled={currentPage > 1}
            className={currentPage <= 1 ? "pointer-events-none opacity-40" : ""}
          />
        </PaginationItem>
        {paginationRange.map((page, idx) =>
          page === DOTS ? (
            <PaginationItem key={`dots-${idx}`}>
              <PaginationEllipsis />
            </PaginationItem>
          ) : (
            <PaginationItem key={page}>
              <PaginationLink
                aria-disabled={currentPage === totalPages}
                className={cn(
                  "border border-slate-400!",
                  currentPage === page
                    ? "pointer-events-none text-white bg-blue-500!"
                    : "cursor-pointer bg-white! text-black!  hover:bg-blue-500! hover:text-white!",
                )}
                onClick={(e) => {
                  e.preventDefault();
                  if (currentPage <= totalPages)
                    router.push(
                      `${pathName}?${createQueryString("p", page.toString())}`,
                    );
                }}
              >
                {page}
              </PaginationLink>
            </PaginationItem>
          ),
        )}

        <PaginationItem>
          <PaginationNext
            onClick={(e) => {
              e.preventDefault();
              handelNext();
            }}
            aria-disabled={currentPage >= totalPages}
            className={
              currentPage >= totalPages ? "pointer-events-none opacity-40" : ""
            }
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}

export default PaginationBtn;
