"use client";

import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import GlassButton from "@/components/ui/GlassButton";
import GlassInput from "@/components/ui/GlassInput";
import { superAdminService } from "@/lib/services/superAdminService";
import { getApiErrorMessage } from "@/lib/api";
import type { Tenant, TenantType } from "@/types";
import toast from "react-hot-toast";

interface ProvisionTenantModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (tenant: Tenant) => void;
}

export default function ProvisionTenantModal({
  isOpen,
  onClose,
  onSuccess,
}: ProvisionTenantModalProps): React.ReactElement {
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [type, setType] = useState<TenantType>("COLLEGE");
  const [licenseCount, setLicenseCount] = useState("0");
  const [adminName, setAdminName] = useState("");
  const [adminEmail, setAdminEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  function handleNameChange(val: string): void {
    setName(val);
    if (!slug || slug === name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "")) {
      setSlug(val.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, ""));
    }
  }

  async function handleSubmit(e: React.FormEvent): Promise<void> {
    e.preventDefault();
    setErrorMsg(null);

    if (!name.trim() || !slug.trim() || !adminEmail.trim() || !adminName.trim()) {
      setErrorMsg("All required fields must be filled.");
      return;
    }

    try {
      setLoading(true);
      const newTenant = await superAdminService.provisionTenant({
        name: name.trim(),
        slug: slug.trim(),
        type,
        license_count: parseInt(licenseCount, 10) || 0,
        admin_name: adminName.trim(),
        admin_email: adminEmail.trim().toLowerCase(),
      });
      toast.success(`Institution '${newTenant.name}' provisioned successfully!`);
      onSuccess(newTenant);
      onClose();
    } catch (err) {
      setErrorMsg(getApiErrorMessage(err, "Failed to provision institution."));
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold font-[Outfit]">Provision New Institution</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-3.5 mt-2">
          {errorMsg && (
            <div className="p-3 text-xs rounded-lg bg-destructive/10 text-destructive border border-destructive/20 font-medium">
              {errorMsg}
            </div>
          )}

          <div>
            <label className="text-xs font-semibold text-foreground block mb-1">Institution Name *</label>
            <GlassInput
              placeholder="e.g. Stanford Academy of Technology"
              value={name}
              onChange={(e) => handleNameChange(e.target.value)}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-foreground block mb-1">Subdomain Slug *</label>
              <GlassInput
                placeholder="stanford-academy"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-foreground block mb-1">Institution Type *</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as TenantType)}
                aria-label="Institution Type"
                className="flex h-10 w-full rounded-md border border-input bg-card px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="SCHOOL">School</option>
                <option value="COLLEGE">College / University</option>
                <option value="COACHING_CENTER">Coaching Center</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-foreground block mb-1">License Count</label>
            <GlassInput
              type="number"
              placeholder="0"
              value={licenseCount}
              onChange={(e) => setLicenseCount(e.target.value)}
              min="0"
              max="100000"
            />
          </div>

          <div className="pt-2 border-t border-border">
            <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-2">
              Primary Administrator Credentials
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-foreground block mb-1">Admin Full Name *</label>
                <GlassInput
                  placeholder="Prof. John Doe"
                  value={adminName}
                  onChange={(e) => setAdminName(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-foreground block mb-1">Admin Email *</label>
                <GlassInput
                  type="email"
                  placeholder="admin@institution.edu"
                  value={adminEmail}
                  onChange={(e) => setAdminEmail(e.target.value)}
                  required
                />
              </div>
            </div>
          </div>

          <DialogFooter className="pt-3">
            <GlassButton type="button" variant="secondary" onClick={onClose} disabled={loading}>
              Cancel
            </GlassButton>
            <GlassButton type="submit" loading={loading} disabled={loading}>
              Provision Institution
            </GlassButton>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
