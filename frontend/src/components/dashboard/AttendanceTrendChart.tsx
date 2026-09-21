"use client";

import React, { useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface MonthlyDataPoint {
  month: string;
  enrolled: number;
  attended: number;
  rate: number;
}

const monthlyData: MonthlyDataPoint[] = [
  { month: "Apr", enrolled: 1280, attended: 1190, rate: 93.0 },
  { month: "May", enrolled: 1320, attended: 1240, rate: 93.9 },
  { month: "Jun", enrolled: 1350, attended: 1280, rate: 94.8 },
  { month: "Jul", enrolled: 1390, attended: 1310, rate: 94.2 },
  { month: "Aug", enrolled: 1410, attended: 1350, rate: 95.7 },
  { month: "Sep", enrolled: 1420, attended: 1388, rate: 97.7 },
];

export default function AttendanceTrendChart(): React.ReactElement {
  const [period, setPeriod] = useState<"6m" | "30d">("6m");

  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-xs flex flex-col justify-between h-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
        <div>
          <h3 className="text-sm font-bold text-foreground font-[Outfit] tracking-tight">
            Attendance & Verification Overview
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Institutional verification throughput and attendance rate trend
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-xs">
            <span className="flex items-center gap-1 text-muted-foreground">
              <span className="h-2.5 w-2.5 rounded-sm bg-slate-900" />
              <span>Enrolled</span>
            </span>
            <span className="flex items-center gap-1 text-muted-foreground">
              <span className="h-2.5 w-2.5 rounded-sm bg-teal-600" />
              <span>Attended</span>
            </span>
          </div>

          <div className="inline-flex rounded-lg border border-border p-0.5 bg-secondary/60">
            <button
              onClick={() => setPeriod("6m")}
              className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
                period === "6m" ? "bg-card text-foreground shadow-2xs font-semibold" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Last 6 Months
            </button>
            <button
              onClick={() => setPeriod("30d")}
              className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
                period === "30d" ? "bg-card text-foreground shadow-2xs font-semibold" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Last 30 Days
            </button>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="h-[260px] w-full mt-2">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={monthlyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorEnrolled" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#0f172a" stopOpacity={0.12} />
                <stop offset="95%" stopColor="#0f172a" stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="colorAttended" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#0d9488" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#0d9488" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#64748b", fontSize: 12 }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#64748b", fontSize: 12 }}
              domain={[1000, 1600]}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload as MonthlyDataPoint;
                  return (
                    <div className="rounded-lg border border-border bg-card p-3 shadow-md text-xs">
                      <p className="font-bold text-foreground mb-1.5">{data.month} 2026</p>
                      <div className="space-y-1">
                        <div className="flex items-center justify-between gap-4">
                          <span className="text-muted-foreground">Enrolled:</span>
                          <span className="font-mono font-semibold text-foreground">{data.enrolled.toLocaleString()}</span>
                        </div>
                        <div className="flex items-center justify-between gap-4">
                          <span className="text-teal-600 font-medium">Attended:</span>
                          <span className="font-mono font-bold text-teal-700">{data.attended.toLocaleString()}</span>
                        </div>
                        <div className="flex items-center justify-between gap-4 pt-1 border-t border-border">
                          <span className="text-muted-foreground">Rate:</span>
                          <span className="font-mono font-bold text-emerald-600">{data.rate}%</span>
                        </div>
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Area
              type="monotone"
              dataKey="enrolled"
              stroke="#0f172a"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorEnrolled)"
            />
            <Area
              type="monotone"
              dataKey="attended"
              stroke="#0d9488"
              strokeWidth={2.5}
              fillOpacity={1}
              fill="url(#colorAttended)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
