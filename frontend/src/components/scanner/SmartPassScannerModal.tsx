"use client";

import React, { useState, useEffect, useRef } from "react";
import { QrCode, X, CheckCircle2, AlertCircle, Camera, RefreshCw } from "lucide-react";
import api, { getApiErrorMessage } from "@/lib/api";
import GlassButton from "@/components/ui/GlassButton";
import GlassInput from "@/components/ui/GlassInput";
import type { SmartPassVerifyResponse } from "@/types";

interface SmartPassScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  sessionId: string;
  onSuccess: (response: SmartPassVerifyResponse) => void;
}

export default function SmartPassScannerModal({
  isOpen,
  onClose,
  sessionId,
  onSuccess,
}: SmartPassScannerModalProps): React.ReactElement | null {
  const [manualToken, setManualToken] = useState("");
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    if (!isOpen) {
      stopCamera();
      setFeedback(null);
      setManualToken("");
      return;
    }
    startCamera();
    return () => {
      stopCamera();
    };
  }, [isOpen]);

  const startCamera = async () => {
    setCameraError(null);
    try {
      if (!navigator.mediaDevices?.getUserMedia) {
        throw new Error("Camera API is not supported on this device/browser.");
      }
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      setCameraActive(true);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to access camera";
      setCameraError(msg);
      setCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setCameraActive(false);
  };

  const verifyToken = async (tokenToVerify: string) => {
    const trimmed = tokenToVerify.trim();
    if (!trimmed) {
      setFeedback({ type: "error", message: "Please provide a valid Smart Pass QR token." });
      return;
    }

    setLoading(true);
    setFeedback(null);

    try {
      const { data } = await api.post<SmartPassVerifyResponse>("/teacher/smart-pass/verify", {
        qr_token: trimmed,
        session_id: sessionId,
      });

      setFeedback({ type: "success", message: data.message });
      onSuccess(data);
      setManualToken("");
    } catch (err: unknown) {
      setFeedback({ type: "error", message: getApiErrorMessage(err, "Verification failed") });
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-white/10 bg-slate-900/95 p-6 shadow-2xl">
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              <QrCode size={20} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-100 font-[Outfit]">Smart Pass QR Verification</h3>
              <p className="text-xs text-slate-400">Scan student rotating QR or enter token</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Video / Camera Viewport */}
        <div className="my-5 relative rounded-xl overflow-hidden bg-slate-950 border border-white/10 aspect-video flex items-center justify-center">
          {cameraActive ? (
            <>
              <video ref={videoRef} className="w-full h-full object-cover" playsInline muted />
              {/* Scan Overlay Frame */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-48 h-48 border-2 border-emerald-400/80 rounded-xl relative animate-pulse">
                  <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-emerald-400" />
                  <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-emerald-400" />
                  <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-emerald-400" />
                  <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-emerald-400" />
                </div>
              </div>
            </>
          ) : (
            <div className="text-center p-6 space-y-2">
              <Camera size={32} className="mx-auto text-slate-600" />
              <p className="text-xs text-slate-400 font-medium">{cameraError || "Camera standby"}</p>
              <GlassButton variant="secondary" size="sm" onClick={startCamera}>
                <RefreshCw size={14} className="mr-1.5" /> Initialize Camera
              </GlassButton>
            </div>
          )}
        </div>

        {/* Feedback Alert */}
        {feedback && (
          <div
            className={`mb-4 p-3 rounded-xl border flex items-center gap-2.5 text-xs font-semibold ${
              feedback.type === "success"
                ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300"
                : "bg-rose-500/10 border-rose-500/30 text-rose-300"
            }`}
          >
            {feedback.type === "success" ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
            <span>{feedback.message}</span>
          </div>
        )}

        {/* Manual Token Entry Fallback */}
        <div className="space-y-3">
          <GlassInput
            label="Smart Pass Token (or Barcode Data)"
            placeholder="Paste JWT / Smart Pass QR token string..."
            value={manualToken}
            onChange={(e) => setManualToken(e.target.value)}
          />
          <div className="flex gap-3">
            <GlassButton
              variant="primary"
              className="w-full"
              loading={loading}
              onClick={() => verifyToken(manualToken)}
              disabled={!manualToken.trim()}
            >
              Verify & Mark Present
            </GlassButton>
          </div>
        </div>
      </div>
    </div>
  );
}
