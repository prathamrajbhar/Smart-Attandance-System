"use client";

import React from "react";
import { Sliders, Cpu, ScanSearch, Info } from "lucide-react";
import GlassCard from "@/components/ui/GlassCard";
import GlassSlider from "@/components/ui/GlassSlider";
import GlassButton from "@/components/ui/GlassButton";

interface ScannerControlsProps {
  contamination: number;
  onContaminationChange: (val: number) => void;
  onRunScan: () => void;
  loading: boolean;
}

export default function ScannerControls({
  contamination,
  onContaminationChange,
  onRunScan,
  loading,
}: ScannerControlsProps): React.ReactElement {
  const currentPercentage = Math.round(contamination * 100);

  const getActiveMode = () => {
    if (contamination <= 0.05) {
      return {
        modeName: "Strict Mode (0.01 – 0.05)",
        badge: "Strict",
        desc: "Flags only the top 1%–5% extreme chronic absentees and severe outliers.",
        color: "text-rose-500 bg-rose-500/10 border-rose-500/20",
      };
    }
    if (contamination <= 0.15) {
      return {
        modeName: "Balanced Mode (0.06 – 0.15)",
        badge: "Balanced",
        desc: "Recommended setting. Flags the top 6%–15% habitual pattern skippers.",
        color: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20",
      };
    }
    return {
      modeName: "Broad Mode (0.16 – 0.50)",
      badge: "Broad",
      desc: "Wide net. Flags top 16%–50% students including early/minor irregular absences.",
      color: "text-amber-500 bg-amber-500/10 border-amber-500/20",
    };
  };

  const activeMode = getActiveMode();

  return (
    <div className="flex flex-col gap-5">
      <GlassCard className="bg-card">
        <div className="flex items-center justify-between gap-2.5 mb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-secondary text-primary">
              <Sliders size={18} />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-foreground">Scan Sensitivity</h3>
              <p className="text-xs text-muted-foreground">Contamination Factor</p>
            </div>
          </div>
          <span className={`px-2.5 py-0.5 text-xs font-semibold rounded-full border ${activeMode.color}`}>
            {activeMode.badge} ({currentPercentage}%)
          </span>
        </div>

        <GlassSlider
          label="Contamination Factor"
          min={0.01}
          max={0.50}
          step={0.01}
          value={contamination}
          onChange={onContaminationChange}
        />

        {/* Dynamic Range Mode Explanation */}
        <div className="mt-4 p-3.5 rounded-xl bg-secondary/50 border border-border space-y-2 text-xs leading-relaxed">
          <div className="flex items-center justify-between font-medium text-foreground">
            <div className="flex items-center gap-1.5">
              <Info size={13} className="text-primary" />
              <span>Current Range: <strong>{activeMode.modeName}</strong></span>
            </div>
            <span className="text-muted-foreground font-mono">Top {currentPercentage}%</span>
          </div>
          <p className="text-muted-foreground">{activeMode.desc}</p>
        </div>

        {/* Range Legend */}
        <div className="mt-3 p-3 rounded-lg bg-card/50 border border-border text-[11px] text-muted-foreground space-y-1.5">
          <div className="font-semibold text-foreground text-xs mb-1">Sensitivity Range Guide:</div>
          <div className="flex justify-between">
            <span className="text-rose-500 font-medium">0.01 – 0.05: Strict</span>
            <span>Severe chronic defaulters only</span>
          </div>
          <div className="flex justify-between">
            <span className="text-emerald-500 font-medium">0.06 – 0.15: Balanced</span>
            <span>Standard pattern detection (Default)</span>
          </div>
          <div className="flex justify-between">
            <span className="text-amber-500 font-medium">0.16 – 0.50: Broad</span>
            <span>Early warning & borderline skippers</span>
          </div>
        </div>

        <div className="mt-5">
          <GlassButton
            variant="primary"
            size="lg"
            loading={loading}
            onClick={onRunScan}
            className="w-full font-medium"
            icon={<ScanSearch size={16} />}
          >
            {loading ? "Analyzing Datasets..." : "Run AI Anomaly Scan"}
          </GlassButton>
        </div>
      </GlassCard>

      <GlassCard className="bg-card">
        <div className="flex items-center gap-2.5 mb-3">
          <div className="p-2 rounded-lg bg-secondary text-primary">
            <Cpu size={18} />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-foreground">How It Works</h3>
            <p className="text-xs text-muted-foreground">Isolation Forest (iForest)</p>
          </div>
        </div>
        <div className="space-y-2 text-xs text-muted-foreground leading-relaxed">
          <p>
            <strong className="text-foreground">What it detects:</strong> Unsupervised machine learning analyzes day-of-week absence clusters (e.g., repeated Monday/Friday skippers) rather than simple total counts.
          </p>
          <p>
            <strong className="text-foreground">Why iForest:</strong> Normal patterns cluster together; anomalous absence profiles require fewer decision-tree splits to isolate, generating higher outlier scores.
          </p>
        </div>
      </GlassCard>
    </div>
  );
}
