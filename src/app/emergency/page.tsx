import * as React from "react";
import Link from "next/link";
import { AppHeader } from "@/components/ui/app-header";
import { EmergencyView } from "@/features/triage";
import { ArrowLeft } from "lucide-react";

export const metadata = {
  title: "Emergency Triage & Casualty Escalation | MedWay UNN",
  description:
    "24/7 WHO Red Flag danger signs screening and emergency hospital escalation for UNN students.",
};

export default function EmergencyPage() {
  return (
    <div className="min-h-screen flex flex-col bg-canvas text-body">
      <AppHeader hasRedFlags={true} />

      <main className="flex-1 max-w-5xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        <div>
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-accent hover:underline min-h-[48px]"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Care Router</span>
          </Link>
        </div>

        <EmergencyView />
      </main>
    </div>
  );
}
