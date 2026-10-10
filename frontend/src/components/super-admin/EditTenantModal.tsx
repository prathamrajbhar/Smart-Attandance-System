"use client";

import React, { useState, useEffect } from "react";
import { X, Building2, Save, Loader2 } from "lucide-react";
import GlassButton from "@/components/ui/GlassButton";
import type { Tenant, TenantType, TenantStatus } from "@/types/tenant";

interface EditTenantModalProps {
  isOpen: boolean;
  tenant: Tenant | null;
  onClose: () => void;
  onSave: (id: string, payload: {
    name: string;
    slug: string;
    type: TenantType;
    status: TenantStatus;
    domain?: string;
    license_count: number;
  }) => Promise<void>;
}

export default function EditTenantModal({
  isOpen,
  tenant,
  onClose,
  onSave,
}: EditTenantModalProps): React.ReactElement | null {
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [type, setType] = useState<TenantType>("COLLEGE");
  const [status, setStatus] = useState<TenantStatus>("ACTIVE");
  const [domain, setDomain] = useState("");
  const [licenseCount, setLicenseCount] = useState<number>(100);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (tenant) {
      setName(tenant.name || "");
      setSlug(tenant.slug || "");
      setType(tenant.type || "COLLEGE");
      setStatus(tenant.status || "ACTIVE");
      setDomain(tenant.domain || "");
      setLicenseCount(tenant.license_count ?? 100);
      setError(null);
    }
  }, [tenant]);

  if (!isOpen || !tenant) return null;

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Institution name cannot be empty.");
      return;
    }
    if (!slug.trim() || !/^[a-z0-9-]+$/.test(slug)) {
      setError("Slug must contain only lowercase letters, numbers, and hyphens.");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      await onSave(tenant.id, {
        name: name.trim(),
        slug: slug.trim().toLowerCase(),
        type,
        status,
        domain: domain.trim() || undefined,
        license_count: Number(licenseCount),
      });
      onClose();
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Failed to update tenant details.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="bg-card border border-border w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-muted/30">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
              <Building2 size={20} />
            </div>
            <div>
              <h2 className="text-base font-bold text-foreground">Edit Institution</h2>
              <p className="text-xs text-muted-foreground font-mono">{tenant.slug}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground p-1 rounded-lg hover:bg-muted transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={(e) => void handleSubmit(e)} className="p-6 space-y-4">
          {error && (
            <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-xs font-medium">
              {error}
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground">Institution Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full h-10 px-3 text-xs rounded-lg border border-input bg-background focus:outline-hidden focus:ring-2 focus:ring-primary/30"
              placeholder="e.g. Apex University"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Tenant Slug</label>
              <input
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value.toLowerCase())}
                className="w-full h-10 px-3 text-xs font-mono rounded-lg border border-input bg-background focus:outline-hidden focus:ring-2 focus:ring-primary/30"
                placeholder="apex-university"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Type</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as TenantType)}
                className="w-full h-10 px-3 text-xs rounded-lg border border-input bg-background focus:outline-hidden focus:ring-2 focus:ring-primary/30"
              >
                <option value="COLLEGE">University / College</option>
                <option value="SCHOOL">K-12 School</option>
                <option value="COACHING_CENTER">Coaching Center</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as TenantStatus)}
                className="w-full h-10 px-3 text-xs rounded-lg border border-input bg-background focus:outline-hidden focus:ring-2 focus:ring-primary/30"
              >
                <option value="ACTIVE">ACTIVE</option>
                <option value="SUSPENDED">SUSPENDED</option>
                <option value="TRIAL">TRIAL</option>
                <option value="PROVISIONING">PROVISIONING</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-foreground">License Quota</label>
              <input
                type="number"
                min={0}
                value={licenseCount}
                onChange={(e) => setLicenseCount(Number(e.target.value))}
                className="w-full h-10 px-3 text-xs rounded-lg border border-input bg-background focus:outline-hidden focus:ring-2 focus:ring-primary/30"
                placeholder="e.g. 500"
                required
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground">Custom White-label Domain (Optional)</label>
            <input
              type="text"
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              className="w-full h-10 px-3 text-xs font-mono rounded-lg border border-input bg-background focus:outline-hidden focus:ring-2 focus:ring-primary/30"
              placeholder="e.g. attendance.apex.edu"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-4 border-t border-border">
            <GlassButton type="button" variant="secondary" onClick={onClose} disabled={loading}>
              Cancel
            </GlassButton>
            <GlassButton type="submit" variant="primary" disabled={loading} className="gap-2">
              {loading ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
              <span>Save Changes</span>
            </GlassButton>
          </div>
        </form>
      </div>
    </div>
  );
}
