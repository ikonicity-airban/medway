"use client";

import * as React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CareCategory, Facility } from "@/types";
import {
  ExternalLink,
  Layers,
  MapPin,
  Navigation,
  PhoneCall,
  Search,
  Star,
  Ticket,
} from "lucide-react";

export interface MapPharmacyItem {
  id: string;
  name: string;
  address: string;
  rating?: number;
  openNow: boolean;
  distanceLabel: string;
  coords: { x: number; y: number }; // Relative coordinates on the campus map canvas
  phone: string;
  verified: boolean;
}

const NSUKKA_PHARMACIES: MapPharmacyItem[] = [
  {
    id: "paxs_roban",
    name: "Paxs Pharmacy, Roban Mall Nsukka",
    address: "Main gate, opp. University of Nigeria, UNN Nsukka, Ihe Nsukka 410001, Enugu",
    openNow: true,
    rating: 4.5,
    distanceLabel: "800m (10 min walk)",
    coords: { x: 52, y: 38 },
    phone: "+2348037704288",
    verified: true,
  },
  {
    id: "pharmacy_building",
    name: "Pharmacy Building Dispensary",
    address: "UNN, VC75+HXF, Owerre Eze Rd, Ihe Nsukka, Nsukka 410105, Enugu",
    openNow: true,
    rating: 4.6,
    distanceLabel: "350m (4 min walk)",
    coords: { x: 48, y: 32 },
    phone: "+2348035489721",
    verified: true,
  },
  {
    id: "odim_gate",
    name: "Odim Gate Community Pharmacy",
    address: "Odim Gate Road, adjacent to Franco / Eni Njoku Hall, UNN",
    openNow: true,
    rating: 4.8,
    distanceLabel: "650m (8 min walk)",
    coords: { x: 38, y: 46 },
    phone: "+2348021123456",
    verified: true,
  },
  {
    id: "hilltop_meds",
    name: "Hilltop Care & Meds Pharmacy",
    address: "Hilltop Road, student off-campus residence corridor, Nsukka",
    openNow: true,
    rating: 4.4,
    distanceLabel: "950m (12 min walk)",
    coords: { x: 62, y: 28 },
    phone: "+2348039988776",
    verified: true,
  },
  {
    id: "ogige_central",
    name: "Ogige Central Pharmacy",
    address: "Ogige Main Market junction, Enugu Road, Nsukka Urban",
    openNow: true,
    rating: 4.3,
    distanceLabel: "1.8km (22 min walk / 5 min bike)",
    coords: { x: 45, y: 72 },
    phone: "+2348065544332",
    verified: true,
  },
];

export interface CampusMapViewProps {
  onSelectPass?: (facilityName: string) => void;
}

export const CampusMapView: React.FC<CampusMapViewProps> = ({ onSelectPass }) => {
  const [searchQuery, setSearchQuery] = React.useState("pharmacy near UNN Nsukka");
  const [onlyOpenNow, setOnlyOpenNow] = React.useState(false);
  const [activeArea, setActiveArea] = React.useState("all");
  const [selectedPharmacyId, setSelectedPharmacyId] = React.useState<string>("paxs_roban");
  const [mapType, setMapType] = React.useState<"map" | "satellite">("map");

  const filtered = React.useMemo(() => {
    return NSUKKA_PHARMACIES.filter((p) => {
      if (onlyOpenNow && !p.openNow) return false;
      if (activeArea === "odim" && !p.id.includes("odim")) return false;
      if (activeArea === "ogige" && !p.id.includes("ogige")) return false;
      if (activeArea === "hilltop" && !p.id.includes("hilltop")) return false;
      if (searchQuery.trim().length > 0 && !searchQuery.includes("near UNN")) {
        const query = searchQuery.toLowerCase();
        return (
          p.name.toLowerCase().includes(query) || p.address.toLowerCase().includes(query)
        );
      }
      return true;
    });
  }, [onlyOpenNow, activeArea, searchQuery]);

  const selectedItem = NSUKKA_PHARMACIES.find((p) => p.id === selectedPharmacyId);

  return (
    <div className="bg-surface border border-border rounded-2xl overflow-hidden shadow-xs space-y-4 p-4 sm:p-6">
      {/* Search Header Strip */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-muted">
              Live Google Maps & Places Search · Nsukka Campus Radius
            </span>
            <h2 className="text-base sm:text-lg font-bold text-ink">
              Search Pharmacies on Google Maps
            </h2>
          </div>
          <span className="text-xs font-mono text-muted">
            Teal/Blue: Verified MedWay Partners • Amber: Open Places Search
          </span>
        </div>

        {/* Search Input Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search pharmacy near UNN Nsukka..."
              className="w-full pl-10 pr-3 py-2 text-sm rounded-lg border border-border bg-surface text-ink placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-accent min-h-[44px]"
            />
          </div>

          <button
            type="button"
            onClick={() => setOnlyOpenNow((prev) => !prev)}
            className={`px-3.5 py-2 text-xs font-bold rounded-lg border min-h-[44px] transition-colors ${
              onlyOpenNow
                ? "bg-emerald-500/15 border-emerald-500/40 text-emerald-700 dark:text-emerald-300"
                : "bg-surface border-border text-muted hover:text-ink hover:bg-surface-subtle"
            }`}
          >
            Open Now
          </button>

          <Button
            variant="primary"
            size="sm"
            onClick={() => {}}
            className="text-xs font-bold min-h-[44px] px-4"
          >
            <span>Search Map</span>
          </Button>
        </div>

        {/* Quick Area Filter Chips */}
        <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
          <span className="text-muted font-mono text-[11px] font-semibold">Quick areas:</span>
          {[
            { id: "all", label: "All Nsukka Pharmacies" },
            { id: "odim", label: "Odim Gate" },
            { id: "ogige", label: "Ogige Market" },
            { id: "hilltop", label: "Hilltop & Enugu Rd" },
          ].map((area) => (
            <button
              key={area.id}
              type="button"
              onClick={() => setActiveArea(area.id)}
              className={`px-3 py-1.5 rounded-md border text-xs font-medium transition-colors ${
                activeArea === area.id
                  ? "bg-surface-subtle border-accent text-ink font-bold shadow-2xs"
                  : "bg-surface border-border text-muted hover:text-ink hover:bg-surface-subtle"
              }`}
            >
              {area.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Map + Results Split View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start pt-2">
        {/* Left Map Canvas (7 Cols) */}
        <div className="lg:col-span-7 rounded-xl border border-border bg-surface-subtle overflow-hidden relative min-h-[380px] flex flex-col justify-between p-4">
          {/* Map Controls */}
          <div className="flex items-center justify-between z-10">
            <div className="inline-flex rounded-lg border border-border bg-surface/90 backdrop-blur-xs p-0.5 shadow-xs text-xs font-medium">
              <button
                type="button"
                onClick={() => setMapType("map")}
                className={`px-3 py-1 rounded-md transition-colors ${
                  mapType === "map" ? "bg-surface text-ink font-bold shadow-2xs" : "text-muted hover:text-ink"
                }`}
              >
                Map
              </button>
              <button
                type="button"
                onClick={() => setMapType("satellite")}
                className={`px-3 py-1 rounded-md transition-colors ${
                  mapType === "satellite" ? "bg-surface text-ink font-bold shadow-2xs" : "text-muted hover:text-ink"
                }`}
              >
                Satellite
              </button>
            </div>

            <div className="bg-surface/90 backdrop-blur-xs px-2.5 py-1 rounded-md border border-border text-[11px] font-mono text-muted flex items-center gap-1.5 shadow-xs">
              <Navigation className="w-3 h-3 text-accent" />
              <span>UNN Radius (2.5 km)</span>
            </div>
          </div>

          {/* Interactive Vector Campus Canvas */}
          <div className="absolute inset-0 flex items-center justify-center opacity-90">
            <svg
              className="w-full h-full"
              viewBox="0 0 600 400"
              preserveAspectRatio="xMidYMid slice"
              aria-label="Nsukka Campus Road and Pharmacy Location Map"
            >
              {/* Map Canvas Background */}
              <rect
                width="600"
                height="400"
                fill={mapType === "satellite" ? "#1e293b" : "#f1f5f9"}
                className="transition-colors"
              />

              {/* Campus Roads and Topography */}
              <path
                d="M50 200 Q200 180 300 140 T550 100"
                stroke={mapType === "satellite" ? "#475569" : "#cbd5e1"}
                strokeWidth="10"
                fill="none"
              />
              <path
                d="M300 50 L300 350"
                stroke={mapType === "satellite" ? "#475569" : "#cbd5e1"}
                strokeWidth="8"
                fill="none"
              />
              <path
                d="M150 100 Q260 220 450 320"
                stroke={mapType === "satellite" ? "#334155" : "#e2e8f0"}
                strokeWidth="6"
                fill="none"
              />

              {/* UNN Campus Perimeter Boundary */}
              <ellipse
                cx="300"
                cy="150"
                rx="140"
                ry="90"
                fill="none"
                stroke="#0284c7"
                strokeWidth="2"
                strokeDasharray="6 4"
                opacity="0.4"
              />
              <text
                x="300"
                y="155"
                textAnchor="middle"
                fill={mapType === "satellite" ? "#94a3b8" : "#64748b"}
                fontSize="12"
                fontWeight="bold"
                fontFamily="sans-serif"
                opacity="0.6"
              >
                UNN CAMPUS MAIN ENCLAVE
              </text>

              {/* Odim Gate Label */}
              <text
                x="220"
                y="190"
                textAnchor="middle"
                fill={mapType === "satellite" ? "#cbd5e1" : "#475569"}
                fontSize="10"
                fontFamily="sans-serif"
              >
                Odim Gate
              </text>

              {/* Ogige Market Label */}
              <text
                x="270"
                y="300"
                textAnchor="middle"
                fill={mapType === "satellite" ? "#cbd5e1" : "#475569"}
                fontSize="10"
                fontFamily="sans-serif"
              >
                Ogige Market
              </text>

              {/* Pharmacy Location Pins */}
              {NSUKKA_PHARMACIES.map((p) => {
                const isSelected = p.id === selectedPharmacyId;
                const px = (p.coords.x / 100) * 600;
                const py = (p.coords.y / 100) * 400;

                return (
                  <g
                    key={p.id}
                    className="cursor-pointer transition-transform hover:scale-110"
                    onClick={() => setSelectedPharmacyId(p.id)}
                  >
                    {/* Pulsing ring for selected pin */}
                    {isSelected && (
                      <circle
                        cx={px}
                        cy={py}
                        r="18"
                        fill="#0284c7"
                        opacity="0.25"
                      />
                    )}

                    {/* Pin Outer circle */}
                    <circle
                      cx={px}
                      cy={py}
                      r="12"
                      fill={isSelected ? "#0284c7" : "#f59e0b"}
                      stroke="#ffffff"
                      strokeWidth="2.5"
                      className="shadow-md"
                    />

                    {/* Pin Inner icon glyph */}
                    <circle
                      cx={px}
                      cy={py}
                      r="4"
                      fill="#ffffff"
                    />

                    {/* Pin Callout Label */}
                    <rect
                      x={px - 45}
                      y={py - 30}
                      width="90"
                      height="16"
                      rx="3"
                      fill="#0f172a"
                      opacity="0.85"
                    />
                    <text
                      x={px}
                      y={py - 19}
                      textAnchor="middle"
                      fill="#ffffff"
                      fontSize="9"
                      fontWeight="bold"
                      fontFamily="sans-serif"
                    >
                      {p.name.split(" ")[0]} ({p.distanceLabel.split(" ")[0]})
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Map Footer Bar */}
          <div className="z-10 bg-surface/90 backdrop-blur-xs p-2.5 rounded-lg border border-border flex items-center justify-between text-xs text-muted shadow-xs">
            <span>Click any map pin to inspect live telemetry</span>
            <span className="font-mono text-[11px] font-bold text-ink">
              {filtered.length} Pharmacies in Radius
            </span>
          </div>
        </div>

        {/* Right Places Results Panel (5 Cols) */}
        <div className="lg:col-span-5 space-y-3">
          <div className="flex items-center justify-between pb-1 border-b border-border">
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-muted">
              Google Maps Pharmacy Results
            </h3>
            <span className="text-xs font-mono text-muted">
              {filtered.length} found around Nsukka
            </span>
          </div>

          <div className="space-y-3 max-h-[460px] overflow-y-auto pr-1">
            {filtered.map((item) => {
              const isSelected = item.id === selectedPharmacyId;

              return (
                <div
                  key={item.id}
                  onClick={() => setSelectedPharmacyId(item.id)}
                  className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
                    isSelected
                      ? "bg-surface border-accent shadow-xs ring-1 ring-accent/30"
                      : "bg-surface border-border hover:border-muted hover:bg-surface-subtle"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <h4 className="text-sm font-bold text-ink leading-snug">
                      {item.name}
                    </h4>
                    {item.rating && (
                      <span className="inline-flex items-center gap-1 text-xs font-mono font-bold text-amber-700 dark:text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded shrink-0">
                        <Star className="w-3 h-3 fill-current" />
                        <span>{item.rating}</span>
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-muted leading-relaxed line-clamp-2 mb-3">
                    {item.address}
                  </p>

                  <div className="flex items-center gap-2 mb-3 text-xs text-muted">
                    <span className="font-mono font-bold text-ink">{item.distanceLabel}</span>
                    <span>•</span>
                    <Badge variant={item.openNow ? "in-stock" : "out-of-stock"} className="text-[10px] py-0 px-1.5">
                      {item.openNow ? "Open Now" : "Closed"}
                    </Badge>
                  </div>

                  {/* Actions Row */}
                  <div className="flex items-center gap-2 pt-2 border-t border-border">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (onSelectPass) onSelectPass(item.name);
                      }}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-md bg-accent text-on-accent text-xs font-bold hover:opacity-95 shadow-2xs transition-opacity"
                    >
                      <Ticket className="w-3 h-3" />
                      <span>Intake Pass</span>
                    </button>

                    <a
                      href={`tel:${item.phone}`}
                      onClick={(e) => e.stopPropagation()}
                      className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-md bg-surface-subtle border border-border hover:bg-surface text-ink text-xs font-medium transition-colors"
                      title={`Call ${item.name}`}
                    >
                      <PhoneCall className="w-3 h-3 text-muted" />
                      <span>Call</span>
                    </a>

                    <a
                      href={`https://maps.google.com/?q=${encodeURIComponent(item.name + " Nsukka")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-md bg-surface-subtle border border-border hover:bg-surface text-ink text-xs font-medium transition-colors ml-auto"
                      title="Open Google Maps directions"
                    >
                      <ExternalLink className="w-3 h-3 text-muted" />
                      <span>Directions</span>
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
