"use client";

import React from "react";
import { Sliders, Cpu, ScanSearch } from "lucide-react";
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
  return (
    <div className="flex flex-col gap-5">
      <GlassCard className="bg-card">
        <div className="flex items-center gap-2.5 mb-5">
          <div className="p-2 rounded-lg bg-secondary text-primary">
            <Sliders size={18} />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-foreground">Scan Parameters</h3>
            <p className="text-xs text-muted-foreground">Configure sensitivity thresholds</p>
          </div>
        </div>

        <GlassSlider
          label="Contamination Factor"
          min={0.01}
          max={0.50}
          step={0.01}
          value={contamination}
          onChange={onContaminationChange}
        />

        <p className="text-xs text-muted-foreground bg-secondary/60 p-3 rounded-lg mt-4 border border-border leading-relaxed">
          <strong className="text-foreground font-medium">Contamination:</strong> Estimates the proportion of outliers in the dataset. Lower values flag only extreme deviations.
        </p>

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
        <p className="text-xs text-muted-foreground leading-relaxed">
          Isolation Forest isolates anomalies instead of profiling normal points. By constructing random trees, anomalous student patterns require fewer splits to isolate, resulting in higher anomaly scores.
        </p>
      </GlassCard>
    </div>
  );
}
