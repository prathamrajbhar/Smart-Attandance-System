"use client";

import React, { useEffect, useState } from "react";
import { User, Mail, Building, Briefcase, Award, Shield, Lock, CheckCircle2 } from "lucide-react";
import toast from "react-hot-toast";
import api, { getApiErrorMessage } from "@/lib/api";
import GlassPageHeader from "@/components/ui/GlassPageHeader";
import GlassCard from "@/components/ui/GlassCard";
import GlassButton from "@/components/ui/GlassButton";
import GlassInput from "@/components/ui/GlassInput";
import GlassLoader from "@/components/ui/GlassLoader";
import GlassBadge from "@/components/ui/GlassBadge";
import type { UserProfile } from "@/types";

export default function TeacherProfilePage(): React.ReactElement {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [changingPassword, setChangingPassword] = useState(false);

  useEffect(() => {
    async function loadProfile() {
      try {
        const { data } = await api.get<UserProfile>("/auth/me");
        setProfile(data);
      } catch (err: unknown) {
        toast.error(getApiErrorMessage(err, "Failed to load profile"));
      } finally {
        setLoading(false);
      }
    }
    void loadProfile();
  }, []);

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword || newPassword.length < 8) {
      toast.error("New password must be at least 8 characters");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }

    setChangingPassword(true);
    try {
      if (profile?.id) {
        await api.put(`/admin/users/${profile.id}/reset-password`, {
          new_password: newPassword,
        });
        toast.success("Password updated successfully");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      }
    } catch (err: unknown) {
      toast.error(getApiErrorMessage(err, "Password update failed"));
    } finally {
      setChangingPassword(false);
    }
  };

  if (loading) return <GlassLoader text="Loading profile..." />;
  if (!profile) return <div className="text-center py-20 text-slate-500">Profile unavailable</div>;

  const t = profile.teacher_profile;

  return (
    <div className="animate-fade-in-up space-y-6">
      <GlassPageHeader
        title="Faculty Profile & Security"
        description="Manage your institutional credentials and account settings"
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <GlassCard className="lg:col-span-1 space-y-6">
          <div className="flex flex-col items-center text-center p-4 border-b border-white/[0.06]">
            <div className="w-20 h-20 rounded-full bg-emerald-500/10 border-2 border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-3 shadow-lg">
              <User size={36} />
            </div>
            <h3 className="text-lg font-bold text-slate-100 font-[Outfit]">
              {t ? `${t.first_name} ${t.last_name}` : profile.email}
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">{profile.email}</p>
            <div className="mt-3">
              <GlassBadge variant="success">Faculty Member</GlassBadge>
            </div>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between p-2.5 rounded-lg bg-white/[0.02] border border-white/[0.04]">
              <span className="flex items-center gap-2 text-slate-400">
                <Briefcase size={14} className="text-emerald-400" /> Employee ID
              </span>
              <span className="font-mono text-slate-200 font-semibold">{t?.employee_id || "N/A"}</span>
            </div>
            <div className="flex items-center justify-between p-2.5 rounded-lg bg-white/[0.02] border border-white/[0.04]">
              <span className="flex items-center gap-2 text-slate-400">
                <Building size={14} className="text-emerald-400" /> Department
              </span>
              <span className="text-slate-200 font-semibold">{t?.department || "N/A"}</span>
            </div>
            <div className="flex items-center justify-between p-2.5 rounded-lg bg-white/[0.02] border border-white/[0.04]">
              <span className="flex items-center gap-2 text-slate-400">
                <Award size={14} className="text-emerald-400" /> Designation
              </span>
              <span className="text-slate-200 font-semibold">{t?.designation || "N/A"}</span>
            </div>
          </div>
        </GlassCard>

        {/* Password & Security Card */}
        <GlassCard className="lg:col-span-2 space-y-6">
          <div>
            <h3 className="text-base font-bold text-slate-100 font-[Outfit] flex items-center gap-2">
              <Shield size={18} className="text-emerald-400" /> Account Security & Password
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Ensure your account utilizes a robust password with at least 8 characters.
            </p>
          </div>

          <form onSubmit={handleChangePassword} className="space-y-4">
            <GlassInput
              type="password"
              label="New Password"
              placeholder="Minimum 8 characters"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <GlassInput
              type="password"
              label="Confirm New Password"
              placeholder="Re-enter new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />

            <div className="pt-2 flex justify-end">
              <GlassButton type="submit" variant="primary" loading={changingPassword}>
                <Lock size={14} className="mr-1.5" /> Update Password
              </GlassButton>
            </div>
          </form>
        </GlassCard>
      </div>
    </div>
  );
}
