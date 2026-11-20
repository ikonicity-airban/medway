import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MedWay — Campus Care Router & Pre-Triage",
  description:
    "Waze for campus healthcare. Deterministic emergency screening, TISHIP clinic routing, and verified off-campus pharmacy telemetry for UNN students.",
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#0F172A",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-canvas text-body antialiased flex flex-col">
        <div className="w-full min-h-screen flex flex-col bg-canvas">
          {children}
        </div>
      </body>
    </html>
  );
}
