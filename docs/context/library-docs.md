# Library Documentation

This document records the verified external libraries, pinned versions, installation commands, and minimal code snippets required for MedWay.

## @supabase/supabase-js

- Purpose: Client and server database communication, Row Level Security authentication, and real time WebSocket subscriptions.
- Pinned version: `2.47.10` (verified 2026-11-20).
- Install: `npm install @supabase/supabase-js`
- Environment variables: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`.
- Documentation link: https://supabase.com/docs/reference/javascript/introduction

### Minimal verified usage snippet

```typescript
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export function subscribeToStockUpdates(facilityId: string, onUpdate: () => void) {
  return supabase
    .channel(`facility-stock-${facilityId}`)
    .on(
      'postgres_changes',
      {
        event: 'UPDATE',
        schema: 'public',
        table: 'facility_stock',
        filter: `facility_id=eq.${facilityId}`
      },
      () => onUpdate()
    )
    .subscribe();
}
```

- Gotchas: When running in offline mode, Supabase queries will reject if network requests fail. Wrap client queries with an offline fallback that reads from local IndexedDB storage.

## workbox-window

- Purpose: Service worker registration, lifecycle monitoring, and cache management for offline execution.
- Pinned version: `7.3.0` (verified 2026-11-20).
- Install: `npm install workbox-window`
- Environment variables: none.
- Documentation link: https://developer.chrome.com/docs/workbox/modules/workbox-window

### Minimal verified usage snippet

```typescript
import { Workbox } from 'workbox-window';

export function registerOfflineWorker() {
  if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
    const wb = new Workbox('/sw.js');
    wb.addEventListener('installed', (event) => {
      if (event.isUpdate) {
        console.log('New MedWay update available; prompt refresh');
      }
    });
    wb.register();
  }
}
```

- Gotchas: Service workers will only register over HTTPS or localhost. Do not attempt service worker registration during Next.js server side rendering.

## zod

- Purpose: Runtime type checking, boundary schema validation, and safe data parsing.
- Pinned version: `3.24.1` (verified 2026-11-20).
- Install: `npm install zod`
- Environment variables: none.
- Documentation link: https://zod.dev

### Minimal verified usage snippet

```typescript
import { z } from 'zod';

export const FacilitySchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1),
  isCampusClinic: z.boolean(),
  distanceMeters: z.number().int().nonnegative(),
  currentQueue: z.enum(['low', 'moderate', 'high']),
  tishipCovered: z.boolean()
});

export type Facility = z.infer<typeof FacilitySchema>;
```

- Gotchas: Always use `safeParse` instead of `parse` at network boundaries to prevent unhandled thrown errors.

## lucide-react

- Purpose: High contrast SVG icon components for clinical navigation, warning banners, and danger sign checklists.
- Pinned version: `0.469.0` (verified 2026-11-20).
- Install: `npm install lucide-react`
- Environment variables: none.
- Documentation link: https://lucide.dev

### Minimal verified usage snippet

```typescript
import { AlertTriangle, ShieldCheck, Clock, MapPin } from 'lucide-react';

export function EmergencyBadge() {
  return (
    <span className="flex items-center gap-1.5 text-red-600 font-semibold">
      <AlertTriangle className="w-5 h-5" aria-hidden="true" />
      Urgent Emergency
    </span>
  );
}
```

- Gotchas: Always provide `aria-hidden="true"` on icons when accompanied by visible text to prevent duplicate announcements on screen readers.
