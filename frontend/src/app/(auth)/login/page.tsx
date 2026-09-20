"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail, Lock, Shield } from "lucide-react";
import toast from "react-hot-toast";

import api, { getApiErrorMessage, applyValidationErrorsToForm } from "@/lib/api";
import { loginSchema, type LoginFormData } from "@/lib/validations/auth";
import { useAuthStore } from "@/store/authStore";
import GlassInput from "@/components/ui/GlassInput";
import GlassButton from "@/components/ui/GlassButton";
import ForceChangePasswordModal from "@/components/auth/ForceChangePasswordModal";
import type { TokenResponse, UserProfile } from "@/types";

export default function LoginPage(): React.ReactElement {
  const router = useRouter();
  const { login, setUser } = useAuthStore();
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [pendingProfile, setPendingProfile] = useState<UserProfile | null>(null);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  function handleSuccessRedirect(profile: UserProfile): void {
    const destination = profile.role === "ADMIN" ? "/admin/dashboard" : "/teacher/classes";
    router.push(destination);
  }

  async function onSubmit(formData: LoginFormData): Promise<void> {
    const cleanEmail = formData.email.trim().toLowerCase();
    try {
      const { data: tokenData } = await api.post<TokenResponse>("/auth/login", {
        email: cleanEmail,
        password: formData.password,
      });
      const { data: profile } = await api.get<UserProfile>("/auth/me", {
        headers: { Authorization: `Bearer ${tokenData.access_token}` },
      });

      if (profile.role === "STUDENT") {
        setError("email", {
          message: "Student accounts must access via the Smart Attendance Mobile App.",
        });
        toast.error("Access Restricted: Student accounts must use the Mobile App.");
        return;
      }

      login(tokenData.access_token, profile);

      if (tokenData.must_change_password || profile.must_change_password) {
        setPendingProfile(profile);
        setShowPasswordModal(true);
        return;
      }

      toast.success("Welcome back!");
      handleSuccessRedirect(profile);
    } catch (err: unknown) {
      const handled = applyValidationErrorsToForm(err, setError);
      if (!handled) {
        toast.error(getApiErrorMessage(err, "Login failed. Please check your credentials."));
      }
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

        <form
          noValidate
          onSubmit={handleSubmit(onSubmit)}
          className="rounded-2xl border border-border bg-card p-7 shadow-sm space-y-5"
        >
          <div className="space-y-1">
            <h2 className="text-base font-semibold text-foreground">Sign In</h2>
            <p className="text-xs text-muted-foreground">
              Access your administrator or faculty account
            </p>
          </div>

          <div className="space-y-3.5">
            <GlassInput
              label="Email Address"
              type="email"
              placeholder="name@university.edu"
              {...register("email")}
              error={errors.email?.message}
              icon={<Mail size={15} />}
              autoComplete="email"
            />

            <div>
              <GlassInput
                label="Password"
                type="password"
                placeholder="••••••••"
                {...register("password")}
                error={errors.password?.message}
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
              loading={isSubmitting}
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
