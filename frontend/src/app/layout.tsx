import type { Metadata } from "next";
import { Toaster } from "react-hot-toast";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Smart Attendance System | AI Multi-Layer Verification",
    template: "%s | Smart Attendance System",
  },
  description: "AI-powered multi-layered smart attendance verification & management dashboard",
  keywords: ["Smart Attendance", "AI Verification", "Geofence Attendance", "Liveness Detection", "Attendance Management"],
  icons: {
    icon: "/favicon.ico",
    apple: "/favicon.ico",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }): React.ReactElement {
  return (
    <html lang="en">
      <body className="bg-background text-foreground antialiased min-h-screen">
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: "#ffffff",
              color: "#0f172a",
              border: "1px solid #e2e8f0",
              borderRadius: "8px",
              fontSize: "14px",
              padding: "12px 16px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
            },
          }}
        />
      </body>
    </html>
  );
}
