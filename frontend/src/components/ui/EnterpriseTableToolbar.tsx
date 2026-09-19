"use client";

import React from "react";
import { Search, Filter, ChevronDown } from "lucide-react";

interface FilterOption {
  value: string;
  label: string;
}

interface EnterpriseTableToolbarProps {
  searchPlaceholder?: string;
  searchValue?: string;
  onSearch: (value: string) => void;
  filterLabel?: string;
  filterOptions?: FilterOption[];
  selectedFilter?: string;
  onFilterChange?: (value: string) => void;
  statusOptions?: FilterOption[];
  selectedStatus?: string;
  onStatusChange?: (value: string) => void;
}

export default function EnterpriseTableToolbar({
  searchPlaceholder = "Search by name, email, ID...",
  searchValue,
  onSearch,
  filterLabel = "Filter",
  filterOptions = [],
  selectedFilter = "all",
  onFilterChange,
  statusOptions = [],
  selectedStatus = "all",
  onStatusChange,
}: EnterpriseTableToolbarProps): React.ReactElement {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
      {/* Search Input */}
      <div className="relative flex-1 max-w-md">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
        <input
          type="text"
          value={searchValue !== undefined ? searchValue : undefined}
          placeholder={searchPlaceholder}
          onChange={(e) => onSearch(e.target.value)}
          className="w-full h-9 pl-9 pr-3 rounded-lg border border-border bg-card text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring focus:border-slate-400 transition-colors shadow-2xs"
        />
      </div>


      {/* Filter Dropdowns */}
      <div className="flex items-center gap-2 flex-wrap">
        {filterOptions.length > 0 && onFilterChange && (
          <div className="relative inline-flex items-center">
            <div className="flex items-center gap-1.5 h-9 px-3 rounded-lg border border-border bg-card text-xs text-muted-foreground hover:bg-secondary cursor-pointer transition-colors shadow-2xs">
              <Filter size={12} className="text-muted-foreground" />
              <span className="font-medium text-foreground">{filterLabel}:</span>
              <select
                value={selectedFilter}
                onChange={(e) => onFilterChange(e.target.value)}
                className="bg-transparent text-xs text-foreground cursor-pointer focus:outline-none font-medium pr-4 appearance-none"
              >
                <option value="all">All</option>
                {filterOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              <ChevronDown size={11} className="pointer-events-none text-muted-foreground -ml-3" />
            </div>
          </div>
        )}

        {statusOptions.length > 0 && onStatusChange && (
          <div className="relative inline-flex items-center">
            <div className="flex items-center gap-1.5 h-9 px-3 rounded-lg border border-border bg-card text-xs text-muted-foreground hover:bg-secondary cursor-pointer transition-colors shadow-2xs">
              <span className="font-medium text-foreground">Status:</span>
              <select
                value={selectedStatus}
                onChange={(e) => onStatusChange(e.target.value)}
                className="bg-transparent text-xs text-foreground cursor-pointer focus:outline-none font-medium pr-4 appearance-none"
              >
                <option value="all">All Status</option>
                {statusOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              <ChevronDown size={11} className="pointer-events-none text-muted-foreground -ml-3" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
