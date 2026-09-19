"use client";

import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface EnterprisePaginationProps {
  totalItems: number;
  currentPage: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
  itemName?: string;
}

export default function EnterprisePagination({
  totalItems,
  currentPage,
  pageSize,
  onPageChange,
  onPageSizeChange,
  itemName = "records",
}: EnterprisePaginationProps): React.ReactElement {
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const startItem = totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);


  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-4 py-3 border-t border-border bg-card rounded-b-xl text-xs text-muted-foreground">
      <p>
        Showing <span className="font-semibold text-foreground">{startItem}</span> to{" "}
        <span className="font-semibold text-foreground">{endItem}</span> of{" "}
        <span className="font-semibold text-foreground">{totalItems}</span> {itemName}{" "}
        <span className="text-muted-foreground/60">(Page {currentPage} of {totalPages})</span>
      </p>

      <div className="flex items-center gap-1.5 self-end sm:self-auto">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          className="inline-flex items-center justify-center h-7 w-7 rounded-md border border-border bg-card text-foreground hover:bg-secondary disabled:opacity-40 disabled:pointer-events-none transition-colors shadow-2xs"
          title="Previous Page"
        >
          <ChevronLeft size={13} />
        </button>

        {Array.from({ length: totalPages }, (_, i) => i + 1).slice(0, 5).map((page) => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`h-7 min-w-7 px-2 rounded-md text-xs font-medium transition-colors ${
              page === currentPage
                ? "bg-primary text-primary-foreground font-semibold shadow-2xs"
                : "border border-border bg-card text-foreground hover:bg-secondary"
            }`}
          >
            {page}
          </button>
        ))}

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          className="inline-flex items-center justify-center h-7 w-7 rounded-md border border-border bg-card text-foreground hover:bg-secondary disabled:opacity-40 disabled:pointer-events-none transition-colors shadow-2xs"
          title="Next Page"
        >
          <ChevronRight size={13} />
        </button>

        {onPageSizeChange && (
          <div className="flex items-center gap-1.5 ml-2 pl-2 border-l border-border">
            <span className="text-[11px] text-muted-foreground">Rows:</span>
            <select
              value={pageSize}
              onChange={(e) => onPageSizeChange(Number(e.target.value))}
              className="h-7 px-1.5 rounded-md border border-border bg-card text-xs text-foreground cursor-pointer focus:outline-none"
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </select>
          </div>
        )}
      </div>
    </div>
  );
}
