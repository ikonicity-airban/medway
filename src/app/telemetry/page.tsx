import { Metadata } from "next";
import { AppHeader } from "@/components/ui/app-header";
import { TelemetryView } from "@/features/telemetry";

export const metadata: Metadata = {
  title: "Institutional Telemetry · MedWay",
  description:
    "Anonymized campus health logistics and supply signals for University of Nigeria Nsukka.",
};

export default function TelemetryPage() {
  return (
    <div className="min-h-screen bg-canvas text-body flex flex-col font-sans antialiased">
      <AppHeader />
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <TelemetryView />
      </main>
    </div>
  );
}
