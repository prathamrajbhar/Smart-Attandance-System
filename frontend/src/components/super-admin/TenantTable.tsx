"use client";

import React from "react";
import GlassBadge from "@/components/ui/GlassBadge";
import GlassEmptyState from "@/components/ui/GlassEmptyState";
import Link from "next/link";
import { Building2, Power, PowerOff, ExternalLink } from "lucide-react";
import type { Tenant, TenantStatus } from "@/types/tenant";

interface TenantTableProps {
  tenants: Tenant[];
  loading: boolean;
  onToggleStatus: (tenant: Tenant) => void;
  statusUpdatingId?: string | null;
}

function statusToVariant(status: TenantStatus): "success" | "danger" | "warning" | "info" {
  switch (status) {
    case "ACTIVE":
      return "success";
    case "SUSPENDED":
      return "danger";
    case "TRIAL":
      return "warning";
    case "PROVISIONING":
      return "info";
    default:
      return "info";
  }
}

function typeLabel(type: string): string {
  switch (type) {
    case "SCHOOL":
      return "K-12 School";
    case "COLLEGE":
      return "University / College";
    case "COACHING_CENTER":
      return "Coaching Center";
    default:
      return type;
  }
}

export default function TenantTable({
  tenants,
  loading,
  onToggleStatus,
  statusUpdatingId,
}: TenantTableProps): React.ReactElement {
  if (loading) {
    return (
      <div className="bg-card border border-border rounded-xl p-4 space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-12 rounded-lg bg-muted/40 animate-pulse" />
        ))}
      </div>
    );
  }

  if (tenants.length === 0) {
    return (
      <GlassEmptyState
        title="No institutions found"
        message="No institutional tenants match your search and filter criteria."
      />
    );
  }

  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden shadow-2xs">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-muted/50 border-b border-border text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
            <tr>
              <th className="px-4 py-3">Institution</th>
              <th className="px-4 py-3">Type</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Capacity</th>
              <th className="px-4 py-3">Provisioned</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {tenants.map((tenant) => {
              const isUpdating = statusUpdatingId === tenant.id;
              const isActive = tenant.status === "ACTIVE";
              const rawDate = tenant.created_at || (tenant as unknown as { createdAt?: string }).createdAt;
              const formattedDate = rawDate ? new Date(rawDate).toLocaleDateString(undefined, {
                year: "numeric",
                month: "short",
                day: "numeric",
              }) : "N/A";

              const licenseCount = tenant.license_count ?? (tenant as unknown as { licenseCount?: number }).licenseCount;

              return (
                <tr key={tenant.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-3.5">
                    <Link href={`/super-admin/tenants/${tenant.id}`} className="flex items-center gap-2.5 group">
                      <div className="h-8 w-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors">
                        <Building2 size={16} />
                      </div>
                      <div>
                        <p className="font-semibold text-foreground text-sm group-hover:text-primary transition-colors flex items-center gap-1">
                          <span>{tenant.name}</span>
                          <ExternalLink size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                        </p>
                        <p className="text-[11px] text-muted-foreground font-mono">{tenant.slug}</p>
                      </div>
                    </Link>
                  </td>

                  <td className="px-4 py-3.5">
                    <span className="text-xs text-foreground font-medium">{typeLabel(tenant.type)}</span>
                  </td>

                  <td className="px-4 py-3.5">
                    <GlassBadge variant={statusToVariant(tenant.status)}>
                      {tenant.status}
                    </GlassBadge>
                  </td>

                  <td className="px-4 py-3.5 text-foreground font-medium">
                    {licenseCount ? `${licenseCount.toLocaleString()} licenses` : "Unlimited"}
                  </td>

                  <td className="px-4 py-3.5 text-muted-foreground text-[11px]">
                    {formattedDate}
                  </td>

                  <td className="px-4 py-3.5 text-right">
                    <div className="inline-flex items-center gap-2">
                      <Link
                        href={`/super-admin/tenants/${tenant.id}`}
                        className="px-2.5 py-1 rounded-md text-xs font-semibold bg-secondary hover:bg-secondary/80 text-foreground transition-colors"
                      >
                        Manage
                      </Link>
                      <button
                        type="button"
                        disabled={isUpdating}
                        onClick={() => onToggleStatus(tenant)}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold transition-colors disabled:opacity-50 ${
                          isActive
                            ? "bg-amber-500/10 text-amber-700 dark:text-amber-400 hover:bg-amber-500/20"
                            : "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-500/20"
                        }`}
                      >
                        {isActive ? <PowerOff size={12} /> : <Power size={12} />}
                        <span>{isActive ? "Suspend" : "Activate"}</span>
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
