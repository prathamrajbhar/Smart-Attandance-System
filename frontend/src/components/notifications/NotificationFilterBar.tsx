"use client";

import React from "react";
import { Search, X } from "lucide-react";
import type { NotificationFilterTab } from "@/types/notification";

interface NotificationFilterBarProps {
  searchQuery: string;
  onSearchChange: (val: string) => void;
  activeFilter: NotificationFilterTab;
  onFilterChange: (filter: NotificationFilterTab) => void;
  unreadCount?: number;
}

export function NotificationFilterBar({
  searchQuery,
  onSearchChange,
  activeFilter,
  onFilterChange,
  unreadCount = 0,
}: NotificationFilterBarProps): React.JSX.Element {
  const isUnreadTab = activeFilter === "unread";

  return (
    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
      <div className="relative flex-1">
        <Search
          size={14}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
        />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search notifications..."
          className="w-full pl-9 pr-8 py-2 text-xs sm:text-sm bg-card border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => onSearchChange("")}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground p-0.5 rounded cursor-pointer"
            title="Clear search"
          >
            <X size={13} />
          </button>
        )}
      </div>

      <div className="inline-flex items-center p-0.5 bg-muted/60 border border-border rounded-lg shrink-0 self-start sm:self-auto">
        <button
          type="button"
          onClick={() => onFilterChange("all")}
          className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all cursor-pointer ${
            !isUnreadTab
              ? "bg-card text-foreground shadow-2xs border border-border/50"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          All
        </button>
        <button
          type="button"
          onClick={() => onFilterChange("unread")}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-all cursor-pointer ${
            isUnreadTab
              ? "bg-card text-foreground shadow-2xs border border-border/50"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <span>Unread</span>
          {unreadCount > 0 && (
            <span className="px-1.5 py-0.2 rounded-full text-[10px] font-semibold bg-primary/10 text-primary">
              {unreadCount}
            </span>
          )}
        </button>
      </div>
    </div>
  );
}
