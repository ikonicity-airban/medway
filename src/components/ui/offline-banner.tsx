import * as React from "react";
import { WifiOff } from "lucide-react";

export interface OfflineBannerProps {
  isOffline?: boolean;
  lastSyncTime?: string;
}

export const OfflineBanner: React.FC<OfflineBannerProps> = ({
  isOffline = true,
  lastSyncTime,
}) => {
  if (isOffline === false) {
    return null;
  }

  return (
    <div
      role="status"
      className="bg-surface-subtle border-b border-border px-4 py-2 text-xs text-body flex items-center justify-between gap-2"
    >
      <div className="flex items-center gap-2 max-w-4xl mx-auto w-full">
        <WifiOff className="w-4 h-4 text-warning shrink-0" />
        <span className="font-medium">
          Offline Mode Active: Showing cached UNN facility directory and offline routing data.
        </span>
        {lastSyncTime && (
          <span className="text-muted hidden md:inline ml-auto">
            Last synced: {lastSyncTime}
          </span>
        )}
      </div>
    </div>
  );
};
