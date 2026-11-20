"use client";

import * as React from "react";
import { DANGER_SIGNS, DangerSign } from "@/components/ui/danger-sign-checklist";

const STORAGE_KEY = "medway_emergency_flags_v1";

export interface EmergencyTriageState {
  hasRedFlags: boolean;
  selectedFlags: string[];
  activeSigns: DangerSign[];
  toggleDangerSign: (signId: string) => void;
  clearDangerSigns: () => void;
}

export function useEmergencyTriage(): EmergencyTriageState {
  const [selectedFlags, setSelectedFlags] = React.useState<string[]>(() => {
    if (typeof window !== "undefined" && window.sessionStorage) {
      try {
        const saved = window.sessionStorage.getItem(STORAGE_KEY);
        if (saved) {
          return JSON.parse(saved) as string[];
        }
      } catch {
        // Fallback to empty array on parse errors
      }
    }
    return [];
  });

  const toggleDangerSign = React.useCallback((signId: string) => {
    setSelectedFlags((prev) => {
      const set = new Set(prev);
      if (set.has(signId)) {
        set.delete(signId);
      } else {
        set.add(signId);
      }
      const nextList = Array.from(set);
      if (typeof window !== "undefined" && window.sessionStorage) {
        try {
          window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(nextList));
        } catch {
          // Ignore storage write issues
        }
      }
      return nextList;
    });
  }, []);

  const clearDangerSigns = React.useCallback(() => {
    setSelectedFlags([]);
    if (typeof window !== "undefined" && window.sessionStorage) {
      try {
        window.sessionStorage.removeItem(STORAGE_KEY);
      } catch {
        // Ignore storage write issues
      }
    }
  }, []);

  const hasRedFlags = selectedFlags.length > 0;

  const activeSigns = React.useMemo(() => {
    return DANGER_SIGNS.filter((s) => selectedFlags.includes(s.id));
  }, [selectedFlags]);

  return {
    hasRedFlags,
    selectedFlags,
    activeSigns,
    toggleDangerSign,
    clearDangerSigns,
  };
}
