import * as React from "react";
import { Facility, CareCategory, QueueLevel } from "@/types";
import { PartnerAuth } from "./partner-auth";
import { InventoryToggles } from "./inventory-toggles";
import { QueueSelector } from "./queue-selector";
import { TokenScanner } from "./token-scanner";
import { getOfflineStorage } from "@/lib/offline-db";
import { syncChannel } from "@/lib/sync-channel";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Building2, CheckCircle2, LogOut } from "lucide-react";

export interface PartnerDashboardProps {
  initialFacility?: Facility;
}

export const PartnerDashboard: React.FC<PartnerDashboardProps> = ({
  initialFacility,
}) => {
  const [activeFacility, setActiveFacility] = React.useState<Facility | null>(
    initialFacility ?? null
  );
  const [syncStatus, setSyncStatus] = React.useState<string | null>(null);

  const handleAuthenticate = (facility: Facility) => {
    setActiveFacility(facility);
  };

  const handleSignOut = () => {
    setActiveFacility(null);
  };

  const handleToggleStock = async (category: CareCategory) => {
    if (!activeFacility) return;

    const currentVal = Boolean(activeFacility.stock[category]);
    const updatedStock = {
      ...activeFacility.stock,
      [category]: !currentVal,
    };

    const updatedFacility: Facility = {
      ...activeFacility,
      stock: updatedStock,
    };

    setActiveFacility(updatedFacility);

    // Save to local offline storage
    const storage = getOfflineStorage();
    await storage.saveFacility(updatedFacility);

    // Broadcast change to other open student tabs
    syncChannel.broadcast({
      type: "stock_toggled",
      facilityId: updatedFacility.id,
      category,
      inStock: !currentVal,
    });

    setSyncStatus(`Updated ${category} stock to ${!currentVal ? "In Stock" : "Out of Stock"}.`);
    setTimeout(() => setSyncStatus(null), 3000);
  };

  const handleSelectQueue = async (queue: QueueLevel) => {
    if (!activeFacility) return;

    const updatedFacility: Facility = {
      ...activeFacility,
      currentQueue: queue,
      lastQueueUpdate: Date.now(),
    };

    setActiveFacility(updatedFacility);

    // Save to local offline storage
    const storage = getOfflineStorage();
    await storage.saveFacility(updatedFacility);

    // Broadcast change to student router
    syncChannel.broadcast({
      type: "queue_updated",
      facilityId: updatedFacility.id,
      queue,
    });

    setSyncStatus(`Updated current queue to ${queue}.`);
    setTimeout(() => setSyncStatus(null), 3000);
  };

  if (!activeFacility) {
    return <PartnerAuth onAuthenticate={handleAuthenticate} />;
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Facility Header Bar */}
      <div className="p-4 md:p-6 rounded-xl bg-surface border border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-lg bg-surface-subtle border border-border flex items-center justify-center text-muted shrink-0">
            <Building2 className="w-5 h-5 text-ink" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-lg md:text-xl font-bold text-ink">
                {activeFacility.name}
              </h1>
              {activeFacility.isCampusClinic ? (
                <Badge variant="tiship">Campus Clinic</Badge>
              ) : (
                <Badge variant="pcn">PCN Accredited</Badge>
              )}
            </div>
            <p className="text-xs text-muted mt-0.5">
              Attendant Console · Live inventory broadcast active
            </p>
          </div>
        </div>

        <Button
          variant="secondary"
          size="sm"
          onClick={handleSignOut}
          className="self-start sm:self-auto gap-1.5 min-h-[48px]"
        >
          <LogOut className="w-4 h-4 text-muted" />
          <span>Sign Out</span>
        </Button>
      </div>

      {/* Sync Status Banner */}
      {syncStatus && (
        <div
          role="status"
          className="p-3.5 rounded-xl bg-surface border border-border text-ink text-xs font-semibold flex items-center gap-2 shadow-sm animate-in fade-in"
        >
          <CheckCircle2 className="w-4 h-4 text-muted shrink-0" />
          <span>{syncStatus}</span>
        </div>
      )}

      {/* Consolidated Console Surface */}
      <div className="bg-surface border border-border rounded-xl shadow-sm divide-y divide-border overflow-hidden">
        {/* 1. Essential Care Inventory Controls */}
        <section className="p-4 md:p-6">
          <InventoryToggles
            stock={activeFacility.stock}
            onToggle={handleToggleStock}
          />
        </section>

        {/* 2. Queue Level Selector */}
        <section className="p-4 md:p-6">
          <QueueSelector
            currentQueue={activeFacility.currentQueue}
            lastUpdated={activeFacility.lastQueueUpdate}
            onSelectQueue={handleSelectQueue}
          />
        </section>

        {/* 3. Counter Token Scanner */}
        <section className="p-4 md:p-6">
          <TokenScanner
            facilityId={activeFacility.id}
            facilityName={activeFacility.name}
          />
        </section>
      </div>
    </div>
  );
};
