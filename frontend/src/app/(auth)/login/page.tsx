"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Mail, Lock, Shield } from "lucide-react";
import toast from "react-hot-toast";
import api, { getApiErrorMessage } from "@/lib/api";
import { useAuthStore } from "@/store/authStore";
import GlassInput from "@/components/ui/GlassInput";
import GlassButton from "@/components/ui/GlassButton";
import ForceChangePasswordModal from "@/components/auth/ForceChangePasswordModal";
import type { TokenResponse, UserProfile } from "@/types";

export default function LoginPage(): React.ReactElement {
  const router = useRouter();
  const { login, setUser } = useAuthStore();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [pendingProfile, setPendingProfile] = useState<UserProfile | null>(null);

  function validate(): boolean {
    const errs: { email?: string; password?: string } = {};
    if (!email.trim()) errs.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errs.email = "Invalid email format";
    if (!password) errs.password = "Password is required";
    else if (password.length < 8) errs.password = "Minimum 8 characters";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  function handleSuccessRedirect(profile: UserProfile): void {
    const destination = profile.role === "ADMIN" ? "/admin/dashboard" : "/teacher/classes";
    router.push(destination);
  }

  async function handleSubmit(e: React.FormEvent): Promise<void> {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const { data: tokenData } = await api.post<TokenResponse>("/auth/login", { email, password });
      const { data: profile } = await api.get<UserProfile>("/auth/me", {
        headers: { Authorization: `Bearer ${tokenData.access_token}` },
      });

      login(tokenData.access_token, profile);

      if (tokenData.must_change_password || profile.must_change_password) {
        setPendingProfile(profile);
        setShowPasswordModal(true);
        return;
      }

      toast.success("Welcome back!");
      handleSuccessRedirect(profile);
    } catch (err: unknown) {
      toast.error(getApiErrorMessage(err, "Login failed. Please check your credentials."));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <div className="inline-flex p-3 rounded-xl bg-primary text-primary-foreground shadow-sm mb-3">
            <Shield size={28} />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground font-[Outfit]">
            Smart Attendance
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            Enterprise Verification & Management Suite
          </p>
        </div>

        <form noValidate onSubmit={handleSubmit} className="rounded-2xl border border-border bg-card p-7 shadow-sm space-y-5">
          <div className="space-y-1">
            <h2 className="text-base font-semibold text-foreground">Sign In</h2>
            <p className="text-xs text-muted-foreground">Access your administrator or faculty account</p>
          </div>

          <div className="space-y-3.5">
            <GlassInput
              label="Email Address"
              type="email"
              placeholder="name@university.edu"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={errors.email}
              icon={<Mail size={15} />}
              autoComplete="email"
            />

            <div>
              <GlassInput
                label="Password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                error={errors.password}
                icon={<Lock size={15} />}
                autoComplete="current-password"
              />
              <div className="flex justify-end pt-1.5">
                <Link
                  href="/forgot-password"
                  className="text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  Forgot password?
                </Link>
              </div>
            </div>
          </div>

          <div className="pt-1">
            <GlassButton
              type="submit"
              variant="primary"
              size="lg"
              loading={loading}
              className="w-full font-medium"
            >
              Sign In to Dashboard
            </GlassButton>
          </div>
        </form>

        <p className="text-center text-xs text-muted-foreground mt-6">
          Protected by Smart Attendance Zero-Trust Verification
        </p>
      </div>

      <ForceChangePasswordModal
        isOpen={showPasswordModal}
        onSuccess={() => {
          setShowPasswordModal(false);
          if (pendingProfile) {
            setUser({ ...pendingProfile, must_change_password: false });
            handleSuccessRedirect(pendingProfile);
          }
        }}
      />
    </div>
  );
}
