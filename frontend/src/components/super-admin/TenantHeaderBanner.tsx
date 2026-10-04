"use client";

import React from "react";
import { Building2, Power, PowerOff, RefreshCw } from "lucide-react";
import GlassBadge from "@/components/ui/GlassBadge";
import GlassButton from "@/components/ui/GlassButton";
import type { TenantDetail } from "@/types/tenant";

interface TenantHeaderBannerProps {
  tenant: TenantDetail;
  onRefresh: () => void;
  onToggleStatus: () => void;
}

export default function TenantHeaderBanner({
  tenant,
  onRefresh,
  onToggleStatus,
}: TenantHeaderBannerProps): React.ReactElement {
  return (
    <div className="bg-card border border-border rounded-2xl p-6 shadow-xs flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <div className="flex items-center gap-4">
        <div className="h-14 w-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
          <Building2 size={28} />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-foreground font-[Outfit]">{tenant.name}</h1>
            <GlassBadge variant={tenant.status === "ACTIVE" ? "success" : "danger"}>
              {tenant.status}
            </GlassBadge>
          </div>
          <p className="text-xs text-muted-foreground font-mono mt-0.5">
            slug: {tenant.slug} • type: {tenant.type} • ID: {tenant.id}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <GlassButton variant="secondary" onClick={onRefresh} className="gap-1.5">
          <RefreshCw size={13} />
          <span>Refresh</span>
        </GlassButton>
        <GlassButton
          variant={tenant.status === "ACTIVE" ? "danger" : "primary"}
          onClick={onToggleStatus}
          className="gap-1.5"
        >
          {tenant.status === "ACTIVE" ? <PowerOff size={13} /> : <Power size={13} />}
          <span>{tenant.status === "ACTIVE" ? "Suspend Tenant" : "Activate Tenant"}</span>
        </GlassButton>
      </div>
    </div>
  );
}
