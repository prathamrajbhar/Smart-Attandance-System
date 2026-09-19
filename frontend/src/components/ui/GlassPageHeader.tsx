"use client";

import React from "react";
import { cn } from "@/lib/utils";

export interface GlassPageHeaderProps {
  title: string;
  description?: string;
  actions?: React.ReactNode;
  className?: string;
}

export default function GlassPageHeader({
  title,
  description,
  actions,
  className = "",
}: GlassPageHeaderProps): React.ReactElement {
  return (
    <div className={cn("flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6", className)}>
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground font-[Outfit]">{title}</h1>
        {description && <p className="text-sm text-muted-foreground mt-1">{description}</p>}
      </div>
      {actions && <div className="flex items-center gap-2.5 shrink-0">{actions}</div>}
    </div>
  );
}
