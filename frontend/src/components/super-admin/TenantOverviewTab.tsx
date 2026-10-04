"use client";

import React from "react";
import { GraduationCap, Users, BookOpen, Radio, Globe, Shield, CheckCircle2 } from "lucide-react";
import GlassCard from "@/components/ui/GlassCard";
import type { TenantDetail } from "@/types/tenant";

interface TenantOverviewTabProps {
  tenant: TenantDetail;
}

export default function TenantOverviewTab({ tenant }: TenantOverviewTabProps): React.ReactElement {
  const studentCount = tenant.student_count || 0;
  const maxStudents = tenant.max_allowed_students || 1;
  const capacityPct = Math.min(100, Math.round((studentCount / maxStudents) * 100));

  return (
    <div className="space-y-6">
      {/* Quick Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <GlassCard className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-500">
              <GraduationCap size={20} />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Enrolled Students</p>
              <p className="text-xl font-bold text-foreground font-[Outfit]">
                {studentCount.toLocaleString()} / {maxStudents.toLocaleString()}
              </p>
            </div>
          </div>
          <div className="mt-3">
            <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${
                  capacityPct > 90 ? "bg-red-500" : capacityPct > 70 ? "bg-amber-500" : "bg-primary"
                }`}
                style={{ width: `${capacityPct}%` }}
              />
            </div>
            <p className="text-[10px] text-muted-foreground mt-1 text-right">{capacityPct}% quota used</p>
          </div>
        </GlassCard>

        <GlassCard className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-500">
              <Users size={20} />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Faculty Members</p>
              <p className="text-xl font-bold text-foreground font-[Outfit]">
                {(tenant.teacher_count || 0).toLocaleString()}
              </p>
            </div>
          </div>
          <p className="text-[11px] text-muted-foreground mt-3">Teaching instructors</p>
        </GlassCard>

        <GlassCard className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-500">
              <BookOpen size={20} />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Classes & Subjects</p>
              <p className="text-xl font-bold text-foreground font-[Outfit]">
                {tenant.class_count || 0} classes
              </p>
            </div>
          </div>
          <p className="text-[11px] text-muted-foreground mt-3">{tenant.subject_count || 0} subjects configured</p>
        </GlassCard>

        <GlassCard className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-rose-500/10 text-rose-500">
              <Radio size={20} />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Live Sessions</p>
              <p className="text-xl font-bold text-foreground font-[Outfit]">
                {tenant.active_sessions_count || 0} Active
              </p>
            </div>
          </div>
          <p className="text-[11px] text-muted-foreground mt-3">
            {(tenant.total_attendance_count || 0).toLocaleString()} all-time checks
          </p>
        </GlassCard>
      </div>

      {/* Details & Domain Config */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <GlassCard className="p-5 space-y-4">
          <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
            <Globe size={15} className="text-primary" />
            <span>Custom Domain & Routing</span>
          </h3>
          <p className="text-xs text-muted-foreground">
            Institutions can map a dedicated white-label domain or sub-domain for direct login.
          </p>
          <div className="p-3 bg-muted/40 rounded-xl border border-border space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Default Access URL:</span>
              <span className="font-mono text-foreground">http://localhost:3000 (Slug: {tenant.slug})</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Custom Domain:</span>
              <span className="font-mono text-primary font-semibold">{tenant.domain || "None configured"}</span>
            </div>
          </div>
        </GlassCard>

        <GlassCard className="p-5 space-y-4">
          <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
            <Shield size={15} className="text-primary" />
            <span>Tenant Isolation Health</span>
          </h3>
          <p className="text-xs text-muted-foreground">
            Row-level database scoping and Redis key isolation active for this tenant context.
          </p>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs p-2 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-lg">
              <span className="flex items-center gap-1.5 font-medium">
                <CheckCircle2 size={14} /> Database Partition
              </span>
              <span className="font-mono text-[11px]">Enforced via tenant_id</span>
            </div>
            <div className="flex items-center justify-between text-xs p-2 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-lg">
              <span className="flex items-center gap-1.5 font-medium">
                <CheckCircle2 size={14} /> Redis Resolution Cache
              </span>
              <span className="font-mono text-[11px]">tenant:resolved:{tenant.slug}</span>
            </div>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
