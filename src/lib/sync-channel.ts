export type SyncMessage =
  | { type: "facility_updated"; facilityId: string; timestamp: number }
  | { type: "stock_toggled"; facilityId: string; category: string; inStock: boolean }
  | { type: "queue_updated"; facilityId: string; queue: string };

type Listener = (msg: SyncMessage) => void;

class SyncChannelManager {
  private channel: BroadcastChannel | null = null;
  private listeners: Set<Listener> = new Set();

  constructor() {
    if (typeof window !== "undefined" && "BroadcastChannel" in window) {
      try {
        this.channel = new BroadcastChannel("medway_sync_channel");
        this.channel.onmessage = (event) => {
          this.notifyListeners(event.data);
        };
      } catch {
        this.channel = null;
      }
    }
  }

  public subscribe(listener: Listener): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  public broadcast(msg: SyncMessage): void {
    if (this.channel) {
      try {
        this.channel.postMessage(msg);
      } catch {
        // Fallback or ignore
      }
    }
    // Also notify local listeners in the same tab
    this.notifyListeners(msg);
  }

  private notifyListeners(msg: SyncMessage): void {
    this.listeners.forEach((listener) => {
      try {
        listener(msg);
      } catch {
        // Ignore listener error
      }
    });
  }
}

export const syncChannel = new SyncChannelManager();
