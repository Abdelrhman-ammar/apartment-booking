"use client";

import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useCallback } from 'react';

interface PaginationProps {
  totalPages: number;
  currentPage: number;
}

export default function Pagination({ totalPages, currentPage }: PaginationProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);
      return params.toString();
    },
    [searchParams]
  );

  const goToPage = (page: number) => {
    router.push(`${pathname}?${createQueryString('page', page.toString())}`);
  };

  const getPageNumbers = () => {
    let startPage = Math.max(1, currentPage - 1);
    let endPage = Math.min(totalPages, startPage + 2);

    if (endPage - startPage < 2 && startPage > 1) {
      startPage = Math.max(1, endPage - 2);
    }

    const pages = [];
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    return pages;
  };

  if (totalPages <= 1) return null;

  const pageNumbers = getPageNumbers();

  return (
    <div className="flex justify-center mt-12 space-x-4">
      {currentPage > 1 && (
        <button
          onClick={() => goToPage(currentPage - 1)}
          className="px-4 py-2 bg-accent text-foreground rounded-md hover:bg-accent/80 transition-colors"
        >
          Previous
        </button>
      )}

      {pageNumbers.map((page) => (
        <button
          key={page}
          onClick={() => goToPage(page)}
          className={`px-4 py-2 rounded-md transition-colors ${
            page === currentPage
              ? 'bg-primary text-background'
              : 'bg-background text-foreground border border-foreground/20 hover:bg-accent/50'
          }`}
        >
          {page}
        </button>
      ))}

      {currentPage < totalPages && (
        <button
          onClick={() => goToPage(currentPage + 1)}
          className="px-4 py-2 bg-accent text-foreground rounded-md hover:bg-accent/80 transition-colors"
        >
          Next
        </button>
      )}
    </div>
  );
}
