"use client";

import * as React from "react";
import Link from "next/link";
import { AppHeader } from "@/components/ui/app-header";
import { PartnerDashboard } from "@/features/partner";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function PartnerPage() {
  return (
    <div className="min-h-screen bg-canvas flex flex-col font-sans antialiased">
      <AppHeader activeNav="partner" isOffline={false} />

      <main className="flex-1 max-w-6xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        <div className="flex items-center justify-between">
          <Link href="/">
            <Button variant="ghost" size="sm" className="gap-1.5 text-muted hover:text-ink">
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Student Router</span>
            </Button>
          </Link>

          <span className="text-xs font-mono font-bold text-muted uppercase">
            MedWay Dispenser Portal
          </span>
        </div>

        <PartnerDashboard />
      </main>
    </div>
  );
}
