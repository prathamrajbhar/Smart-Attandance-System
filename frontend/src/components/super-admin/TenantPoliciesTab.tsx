"use client";

import React, { useState } from "react";
import { Save } from "lucide-react";
import GlassCard from "@/components/ui/GlassCard";
import GlassInput from "@/components/ui/GlassInput";
import GlassButton from "@/components/ui/GlassButton";
import type { TenantDetail } from "@/types/tenant";

interface TenantPoliciesTabProps {
  tenant: TenantDetail;
  onSave: (payload: {
    name: string;
    domain?: string;
    license_count: number;
    config: Record<string, unknown>;
  }) => Promise<void>;
  saving: boolean;
}

export default function TenantPoliciesTab({
  tenant,
  onSave,
  saving,
}: TenantPoliciesTabProps): React.ReactElement {
  const cfg = (tenant.config || {}) as Record<string, unknown>;

  const [name, setName] = useState(tenant.name || "");
  const [domain, setDomain] = useState(tenant.domain || "");
  const [licenseCount, setLicenseCount] = useState<number>(tenant.license_count || 0);

  const [faceEnabled, setFaceEnabled] = useState(cfg.isFaceRecognitionEnabled !== false);
  const [gpsEnabled, setGpsEnabled] = useState(cfg.isGpsVerificationEnabled !== false);
  const [backgroundAiEnabled, setBackgroundAiEnabled] = useState(cfg.isAiBackgroundValidationEnabled !== false);
  const [geofenceRadius, setGeofenceRadius] = useState<number>(
    typeof cfg.geofenceRadiusMeters === "number" ? cfg.geofenceRadiusMeters : 50
  );

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    await onSave({
      name,
      domain: domain.trim() || undefined,
      license_count: Number(licenseCount),
      config: {
        isFaceRecognitionEnabled: faceEnabled,
        isGpsVerificationEnabled: gpsEnabled,
        isAiBackgroundValidationEnabled: backgroundAiEnabled,
        geofenceRadiusMeters: Number(geofenceRadius),
      },
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <GlassCard className="p-6 space-y-6">
        <div>
          <h3 className="text-sm font-bold text-foreground font-[Outfit]">General Institutional Settings</h3>
          <p className="text-xs text-muted-foreground">Configure tenant display identity and capacity constraints.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <GlassInput
            label="Institution Legal Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <GlassInput
            label="Custom Domain"
            placeholder="e.g. portal.school.edu"
            value={domain}
            onChange={(e) => setDomain(e.target.value)}
          />
          <GlassInput
            label="License Count"
            type="number"
            value={licenseCount}
            onChange={(e) => setLicenseCount(Number(e.target.value))}
            min={0}
            required
          />
        </div>
      </GlassCard>

      <GlassCard className="p-6 space-y-6">
        <div>
          <h3 className="text-sm font-bold text-foreground font-[Outfit]">Biometric & Location Verification Policies</h3>
          <p className="text-xs text-muted-foreground">
            Control mandatory verification pipelines applied across all classroom sessions for this institution.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <label className="flex items-start gap-3 p-4 rounded-xl border border-border bg-muted/20 hover:bg-muted/40 transition-colors cursor-pointer">
            <input
              type="checkbox"
              checked={faceEnabled}
              onChange={(e) => setFaceEnabled(e.target.checked)}
              className="mt-1 h-4 w-4 rounded border-border text-primary focus:ring-primary"
            />
            <div>
              <p className="text-xs font-semibold text-foreground">Facial Recognition Verification</p>
              <p className="text-[11px] text-muted-foreground">
                Enforces deep neural network face embedding matching for student check-ins.
              </p>
            </div>
          </label>

          <label className="flex items-start gap-3 p-4 rounded-xl border border-border bg-muted/20 hover:bg-muted/40 transition-colors cursor-pointer">
            <input
              type="checkbox"
              checked={gpsEnabled}
              onChange={(e) => setGpsEnabled(e.target.checked)}
              className="mt-1 h-4 w-4 rounded border-border text-primary focus:ring-primary"
            />
            <div>
              <p className="text-xs font-semibold text-foreground">GPS Geofence Validation</p>
              <p className="text-[11px] text-muted-foreground">
                Validates student device coordinate proximity against classroom polygon boundaries.
              </p>
            </div>
          </label>

          <label className="flex items-start gap-3 p-4 rounded-xl border border-border bg-muted/20 hover:bg-muted/40 transition-colors cursor-pointer">
            <input
              type="checkbox"
              checked={backgroundAiEnabled}
              onChange={(e) => setBackgroundAiEnabled(e.target.checked)}
              className="mt-1 h-4 w-4 rounded border-border text-primary focus:ring-primary"
            />
            <div>
              <p className="text-xs font-semibold text-foreground">AI Background Anti-Spoofing</p>
              <p className="text-[11px] text-muted-foreground">
                Analyzes camera surroundings to detect screen proxies, printed photos, and spoof attempts.
              </p>
            </div>
          </label>

          <div className="p-4 rounded-xl border border-border bg-muted/20 space-y-2">
            <label className="text-xs font-semibold text-foreground block">Geofence Radius (Meters)</label>
            <input
              type="range"
              min={10}
              max={500}
              step={5}
              value={geofenceRadius}
              onChange={(e) => setGeofenceRadius(Number(e.target.value))}
              className="w-full accent-primary"
            />
            <p className="text-xs font-mono text-primary font-bold">{geofenceRadius} meters boundary</p>
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <GlassButton variant="primary" disabled={saving} className="gap-2 font-semibold shadow-xs">
            <Save size={14} />
            <span>{saving ? "Saving Policies..." : "Save Policies & Identity"}</span>
          </GlassButton>
        </div>
      </GlassCard>
    </form>
  );
}
