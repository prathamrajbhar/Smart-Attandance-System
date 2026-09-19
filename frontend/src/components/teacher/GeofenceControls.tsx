"use client";

import React, { useState } from "react";
import { Save, Download, Info } from "lucide-react";
import toast from "react-hot-toast";
import api, { getApiErrorMessage } from "@/lib/api";
import GlassCard from "@/components/ui/GlassCard";
import GlassInput from "@/components/ui/GlassInput";
import GlassSlider from "@/components/ui/GlassSlider";
import GlassButton from "@/components/ui/GlassButton";
import type { AttendanceExportRow } from "@/types";

interface GeofenceControlsProps {
  classId: string;
  classNameTitle: string;
  lat: number;
  lng: number;
  radius: number;
  onRadiusChange: (radius: number) => void;
}

async function downloadCsv(
  rows: AttendanceExportRow[],
  fileName: string
): Promise<void> {
  const Papa = (await import("papaparse")).default;
  const csv = Papa.unparse(rows);
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = fileName;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
}

export default function GeofenceControls({
  classId,
  classNameTitle,
  lat,
  lng,
  radius,
  onRadiusChange,
}: GeofenceControlsProps): React.ReactElement {
  const [saving, setSaving] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const handleSave = async (): Promise<void> => {
    setSaving(true);
    try {
      await api.post(`/teacher/classes/${classId}/geofence`, {
        latitude: lat,
        longitude: lng,
        radius_meters: radius,
      });
      toast.success("Geofence saved successfully");
    } catch (err: unknown) {
      toast.error(getApiErrorMessage(err, "Failed to save geofence"));
    } finally {
      setSaving(false);
    }
  };

  const handleExportCsv = async (): Promise<void> => {
    setExporting(true);
    try {
      const params = new URLSearchParams();
      if (fromDate) params.set("from_date", new Date(fromDate).toISOString());
      if (toDate) params.set("to_date", new Date(toDate).toISOString());
      const query = params.toString() ? `?${params.toString()}` : "";

      const { data } = await api.get<AttendanceExportRow[]>(
        `/teacher/classes/${classId}/export-attendance${query}`
      );

      if (data.length === 0) {
        toast("No attendance records found for the selected range.", {
          icon: "ℹ️",
        });
        return;
      }

      const today = new Date().toISOString().slice(0, 10);
      const cleanName = classNameTitle.replace(/\s+/g, "_") || "class";
      await downloadCsv(data, `attendance_${cleanName}_${today}.csv`);
      toast.success(`Downloaded ${data.length} record(s)`);
    } catch {
      toast.error("Export failed");
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="space-y-6">
      <GlassCard>
        <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">
          Geofence Settings
        </h3>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="p-2.5 rounded-lg bg-white/[0.02] border border-white/5">
              <p className="text-[11px] text-slate-500 mb-0.5">Latitude</p>
              <p className="text-sm font-mono text-emerald-400 font-medium">
                {lat.toFixed(6)}
              </p>
            </div>
            <div className="p-2.5 rounded-lg bg-white/[0.02] border border-white/5">
              <p className="text-[11px] text-slate-500 mb-0.5">Longitude</p>
              <p className="text-sm font-mono text-emerald-400 font-medium">
                {lng.toFixed(6)}
              </p>
            </div>
          </div>
          <GlassSlider
            label="Geofence Radius"
            min={10}
            max={500}
            step={5}
            value={radius}
            onChange={onRadiusChange}
            unit="m"
          />
        </div>
      </GlassCard>

      <GlassButton
        variant="primary"
        size="lg"
        className="w-full bg-emerald-600 hover:bg-emerald-500 border-emerald-400/30 text-white font-medium"
        onClick={() => void handleSave()}
        loading={saving}
        icon={<Save size={18} />}
      >
        Save Geofence
      </GlassButton>

      <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/[0.02] border border-white/5 text-slate-400 text-xs">
        <Info size={14} className="text-emerald-400 shrink-0" />
        <span>Click map or search a place to relocate geofence center</span>
      </div>

      <GlassCard>
        <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">
          Export Attendance
        </h3>
        <div className="space-y-3">
          <GlassInput
            label="From Date (optional)"
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
          />
          <GlassInput
            label="To Date (optional)"
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
          />
          <GlassButton
            variant="ghost"
            size="md"
            className="w-full mt-2"
            icon={<Download size={16} />}
            loading={exporting}
            onClick={() => void handleExportCsv()}
          >
            Export CSV
          </GlassButton>
        </div>
      </GlassCard>
    </div>
  );
}
