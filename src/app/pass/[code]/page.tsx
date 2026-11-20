"use client";

import * as React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { getOfflineStorage } from "@/lib/offline-db";
import { IntakePass } from "@/types";
import { IntakePassView } from "@/features/intake-pass";
import { AppHeader } from "@/components/ui/app-header";
import { Button } from "@/components/ui/button";
import { ArrowLeft, FileQuestion } from "lucide-react";

export default function PassDetailPage() {
  const params = useParams();
  const codeParam = params?.code as string | undefined;

  const [pass, setPass] = React.useState<IntakePass | null>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    async function loadPass() {
      if (!codeParam) {
        setLoading(false);
        return;
      }

      const storage = getOfflineStorage();
      const loaded = await storage.getIntakePassByCode(codeParam.toUpperCase());
      setPass(loaded);
      setLoading(false);
    }

    loadPass();
  }, [codeParam]);

  return (
    <div className="min-h-screen bg-canvas flex flex-col">
      <AppHeader isOffline={false} />

      <main className="flex-1 max-w-5xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        <div className="flex items-center gap-2">
          <Link href="/">
            <Button variant="ghost" size="sm" className="gap-1.5 text-muted hover:text-ink">
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Care Router</span>
            </Button>
          </Link>
        </div>

        {loading ? (
          <div className="p-12 text-center text-muted text-sm font-semibold">
            Loading intake pass from local storage...
          </div>
        ) : pass ? (
          <IntakePassView pass={pass} />
        ) : (
          <div className="p-8 text-center rounded-lg border border-dashed border-border bg-surface-subtle max-w-md mx-auto space-y-4">
            <FileQuestion className="w-12 h-12 text-muted mx-auto" />
            <div className="space-y-1">
              <h2 className="text-lg font-bold text-ink">Intake Pass Not Found</h2>
              <p className="text-xs text-muted">
                No local pass found for code &quot;{codeParam}&quot;. If you cleared your
                browser cache, please generate a new pass from the care router.
              </p>
            </div>

            <Link href="/">
              <Button variant="primary">Generate New Pass</Button>
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}
