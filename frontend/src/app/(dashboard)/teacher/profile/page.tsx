"use client";

import React, { useEffect, useState } from "react";
import { User, Building, Briefcase, Award, Shield, Lock } from "lucide-react";
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
    if (!currentPassword) {
      toast.error("Current password is required");
      return;
    }
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
      await api.post("/auth/change-password", {
        current_password: currentPassword,
        new_password: newPassword,
      });
      toast.success("Password updated successfully");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: unknown) {
      toast.error(getApiErrorMessage(err, "Password update failed"));
    } finally {
      setChangingPassword(false);
    }
  };

  if (loading) return <GlassLoader text="Loading faculty profile..." />;
  if (!profile) return <div className="text-center py-20 text-muted-foreground text-xs">Profile unavailable</div>;

  const t = profile.teacher_profile;

  return (
    <div className="space-y-6">
      <GlassPageHeader
        title="Faculty Profile & Security"
        description="Manage institutional credentials, personal identifiers, and security controls"
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <GlassCard className="lg:col-span-1 space-y-5 bg-card">
          <div className="flex flex-col items-center text-center p-3 border-b border-border">
            <div className="w-16 h-16 rounded-full bg-secondary text-primary flex items-center justify-center mb-2.5 font-bold text-lg border border-border">
              {t?.first_name ? t.first_name[0] : (profile.email ? profile.email[0].toUpperCase() : <User size={24} />)}
            </div>
            <h3 className="text-base font-bold text-foreground font-[Outfit]">
              {t ? `${t.first_name} ${t.last_name}` : profile.email}
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">{profile.email}</p>
            <div className="mt-2.5">
              <GlassBadge variant="success">Faculty Member</GlassBadge>
            </div>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between p-2.5 rounded-lg bg-secondary/40 border border-border">
              <span className="flex items-center gap-1.5 text-muted-foreground font-medium">
                <Briefcase size={14} /> Employee ID
              </span>
              <span className="font-mono text-foreground font-semibold">{t?.employee_id || "N/A"}</span>
            </div>
            <div className="flex items-center justify-between p-2.5 rounded-lg bg-secondary/40 border border-border">
              <span className="flex items-center gap-1.5 text-muted-foreground font-medium">
                <Building size={14} /> Department
              </span>
              <span className="text-foreground font-semibold">{t?.department || "N/A"}</span>
            </div>
            <div className="flex items-center justify-between p-2.5 rounded-lg bg-secondary/40 border border-border">
              <span className="flex items-center gap-1.5 text-muted-foreground font-medium">
                <Award size={14} /> Designation
              </span>
              <span className="text-foreground font-semibold">{t?.designation || "N/A"}</span>
            </div>
          </div>
        </GlassCard>

        {/* Password & Security Card */}
        <GlassCard className="lg:col-span-2 space-y-5 bg-card">
          <div>
            <h3 className="text-base font-bold text-foreground font-[Outfit] flex items-center gap-2">
              <Shield size={16} className="text-primary" /> Account Security & Password
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Ensure your account utilizes a robust password with at least 8 characters.
            </p>
          </div>

          <form onSubmit={handleChangePassword} className="space-y-3.5 max-w-md">
            <GlassInput
              type="password"
              label="Current Password"
              placeholder="Enter current password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />
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

            <div className="pt-2 flex justify-start">
              <GlassButton type="submit" variant="primary" loading={changingPassword} icon={<Lock size={14} />}>
                Update Password
              </GlassButton>
            </div>
          </form>
        </GlassCard>
      </div>
    </div>
  );
}
