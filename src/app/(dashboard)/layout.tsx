import type { Metadata } from "next";
import "../globals.css";

export const metadata: Metadata = {
  title: "RiskSage Security Dashboard: insider threat analytics and SHAP triage",
  description:
    "Monitor user risk scores, inspect SHAP feature attributions, trace behavioral timelines, and triage insider threat alerts.",
};

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen bg-[#0f1f10] text-white antialiased selection:bg-[#c6f19d]/30 selection:text-white font-display">
      {children}
    </div>
  );
}
