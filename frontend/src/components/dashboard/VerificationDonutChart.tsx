"use client";

import React, { useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

interface BreakdownItem {
  name: string;
  count: number;
  percentage: number;
  color: string;
}

const breakdownData: BreakdownItem[] = [
  { name: "Facial Recognition (pgvector)", count: 1088, percentage: 78.4, color: "#0f172a" },
  { name: "Geofence Verification (BLE/GPS)", count: 216, percentage: 15.6, color: "#0d9488" },
  { name: "Manual Override (Faculty)", count: 84, percentage: 6.0, color: "#94a3b8" },
];

export default function VerificationDonutChart(): React.ReactElement {
  const [viewType, setViewType] = useState<"donut" | "bar">("donut");
  const totalCount = breakdownData.reduce((acc, item) => acc + item.count, 0);

  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-xs flex flex-col justify-between h-full">
      {/* Header */}
      <div className="flex items-center justify-between gap-2 mb-2">
        <div>
          <h3 className="text-sm font-bold text-foreground font-[Outfit] tracking-tight">
            Verification Breakdown
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">Distribution by verification layer</p>
        </div>

        <div className="inline-flex rounded-lg border border-border p-0.5 bg-secondary/60">
          <button
            onClick={() => setViewType("donut")}
            className={`px-2 py-0.5 text-xs font-medium rounded-md transition-colors ${
              viewType === "donut" ? "bg-card text-foreground shadow-2xs font-semibold" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Donut
          </button>
          <button
            onClick={() => setViewType("bar")}
            className={`px-2 py-0.5 text-xs font-medium rounded-md transition-colors ${
              viewType === "bar" ? "bg-card text-foreground shadow-2xs font-semibold" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            List
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 my-auto pt-2">
        {/* Donut graphic with center label */}
        <div className="relative h-[180px] w-[180px] shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={breakdownData}
                cx="50%"
                cy="50%"
                innerRadius={54}
                outerRadius={78}
                paddingAngle={3}
                dataKey="count"
              >
                {breakdownData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const item = payload[0].payload as BreakdownItem;
                    return (
                      <div className="rounded-lg border border-border bg-card p-2 shadow-md text-xs">
                        <p className="font-semibold text-foreground">{item.name}</p>
                        <p className="font-mono text-muted-foreground mt-0.5">
                          {item.count.toLocaleString()} ({item.percentage}%)
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
            </PieChart>
          </ResponsiveContainer>

          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-xl font-bold font-mono tracking-tight text-foreground">
              {totalCount.toLocaleString()}
            </span>
            <span className="text-[10px] uppercase font-semibold tracking-wider text-muted-foreground">
              Verified
            </span>
          </div>
        </div>

        {/* Legend */}
        <div className="flex-1 w-full space-y-2.5">
          {breakdownData.map((item) => (
            <div key={item.name} className="flex items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-2 min-w-0">
                <span
                  className="h-2.5 w-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-foreground truncate font-medium">{item.name}</span>
              </div>
              <div className="flex items-center gap-2 shrink-0 font-mono">
                <span className="text-muted-foreground">{item.count.toLocaleString()}</span>
                <span className="font-bold text-foreground bg-secondary px-1.5 py-0.5 rounded text-[11px]">
                  {item.percentage}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="pt-3 mt-2 border-t border-border flex items-center justify-between text-[11px] text-muted-foreground">
        <span>Zero-Trust Fallback Policy: Strict</span>
        <span className="text-emerald-600 font-semibold">99.8% Confidence</span>
      </div>
    </div>
  );
}
