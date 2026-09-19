"use client";

import React from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export interface SelectOption {
  value: string;
  label: string;
}

export interface GlassSelectProps {
  label?: string;
  options: SelectOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  error?: string;
  id?: string;
  disabled?: boolean;
}

export default function GlassSelect({
  label,
  options,
  value,
  onChange,
  placeholder = "Select...",
  error,
  id,
  disabled = false,
}: GlassSelectProps): React.ReactElement {
  const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

  return (
    <div className="flex flex-col gap-1.5 w-full">
      {label && (
        <label htmlFor={selectId} className="text-sm font-medium text-foreground">
          {label}
        </label>
      )}
      <div className="relative w-full">
        <select
          id={selectId}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          className={cn(
            "flex h-9 w-full appearance-none rounded-md border border-input bg-card px-3 py-1 pr-8 text-sm shadow-sm transition-colors cursor-pointer",
            "text-foreground",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:border-transparent",
            "disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-slate-50",
            error && "border-destructive focus-visible:ring-destructive"
          )}
        >
          <option value="" disabled className="text-muted-foreground">
            {placeholder}
          </option>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value} className="text-foreground bg-card">
              {opt.label}
            </option>
          ))}
        </select>
        <ChevronDown
          size={16}
          className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground opacity-60"
        />
      </div>
      {error && <p className="text-xs font-medium text-destructive mt-0.5">{error}</p>}
    </div>
  );
}
