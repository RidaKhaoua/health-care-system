import { useMemo } from "react";

const DOTS = "dots";

/**
 * Génère la liste des pages à afficher, avec des "dots" (…) pour les paginations longues.
 * @param {number} currentPage - page active (1-indexée)
 * @param {number} totalPages - nombre total de pages
 * @param {number} siblingCount - nombre de pages visibles de chaque côté de la page active
 */
const usePaginationRange = (
  currentPage: number,
  totalPages: number,
  siblingCount = 1,
) => {
  return useMemo(() => {
    const totalPageNumbers = siblingCount * 2 + 5;

    if (totalPages <= totalPageNumbers) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
    const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages);

    const showLeftDots = leftSiblingIndex > 2;
    const showRightDots = rightSiblingIndex < totalPages - 1;

    const firstPageIndex = 1;
    const lastPageIndex = totalPages;

    if (!showLeftDots && showRightDots) {
      const leftItemCount = 3 + siblingCount * 2;
      const leftRange = Array.from({ length: leftItemCount }, (_, i) => i + 1);
      return [...leftRange, DOTS, lastPageIndex];
    }

    if (showLeftDots && !showRightDots) {
      const rightItemCount = 3 + siblingCount * 2;
      const rightRange = Array.from(
        { length: rightItemCount },
        (_, i) => totalPages - rightItemCount + i + 1,
      );
      return [firstPageIndex, DOTS, ...rightRange];
    }

    const middleRange = Array.from(
      { length: rightSiblingIndex - leftSiblingIndex + 1 },
      (_, i) => leftSiblingIndex + i,
    );
    return [firstPageIndex, DOTS, ...middleRange, DOTS, lastPageIndex];
  }, [currentPage, totalPages, siblingCount]);
};

export default usePaginationRange;