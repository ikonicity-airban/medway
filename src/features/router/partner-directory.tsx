import * as React from "react";
import { Facility, CareCategory, CARE_CATEGORIES } from "@/types";
import { FacilityCard } from "@/components/ui/facility-card";
import { Badge } from "@/components/ui/badge";
import { CampusMapView } from "./campus-map-view";
import { LayoutGrid, Map, Search, ShieldCheck } from "lucide-react";

export interface PartnerDirectoryProps {
  facilities: Facility[];
  selectedCategory?: CareCategory;
  onSelectFacility?: (facility: Facility) => void;
  defaultView?: "grid" | "map";
}

export const PartnerDirectory: React.FC<PartnerDirectoryProps> = ({
  facilities,
  selectedCategory = "Antimalarials (ACT)",
  onSelectFacility,
  defaultView = "grid",
}) => {
  const [searchTerm, setSearchTerm] = React.useState("");
  const [activeCategory, setActiveCategory] = React.useState<CareCategory>(selectedCategory);
  const [selectedGate, setSelectedGate] = React.useState<string>("all");
  const [viewMode, setViewMode] = React.useState<"grid" | "map">(defaultView);

  const partnerFacilities = React.useMemo(() => {
    return facilities.filter((f) => !f.isCampusClinic);
  }, [facilities]);

  const filteredFacilities = React.useMemo(() => {
    return partnerFacilities.filter((facility) => {
      // Search matching
      const matchesSearch =
        facility.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        facility.slug.toLowerCase().includes(searchTerm.toLowerCase());

      // Gate matching
      const matchesGate =
        selectedGate === "all" ||
        facility.slug.toLowerCase().includes(selectedGate.toLowerCase()) ||
        facility.name.toLowerCase().includes(selectedGate.toLowerCase());

      return matchesSearch && matchesGate;
    });
  }, [partnerFacilities, searchTerm, selectedGate]);

  return (
    <div className="space-y-6">
      {/* Header with PCN Assurance and View Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl bg-surface border border-border shadow-xs">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-ink">
              Accredited Partner Directory
            </h2>
            <Badge variant="pcn">PCN Accredited</Badge>
          </div>
          <p className="text-xs text-muted">
            Verified private pharmacies and community clinics operating near UNN campus gates.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Grid vs Map Toggle */}
          <div className="inline-flex rounded-lg border border-border bg-surface-subtle p-0.5 shadow-2xs text-xs font-medium">
            <button
              type="button"
              onClick={() => setViewMode("map")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-colors ${
                viewMode === "map"
                  ? "bg-surface text-ink font-bold shadow-2xs"
                  : "text-muted hover:text-ink"
              }`}
            >
              <Map className="w-3.5 h-3.5" />
              <span>Campus Map</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode("grid")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md transition-colors ${
                viewMode === "grid"
                  ? "bg-surface text-ink font-bold shadow-2xs"
                  : "text-muted hover:text-ink"
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>Partner Cards</span>
            </button>
          </div>

          <div className="hidden md:flex items-center gap-1.5 text-xs text-muted font-mono">
            <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span>Field verified</span>
          </div>
        </div>
      </div>

      {viewMode === "map" ? (
        <CampusMapView
          onSelectPass={(facilityName) => {
            const matched = facilities.find((f) => f.name.toLowerCase().includes(facilityName.toLowerCase().split(" ")[0])) || facilities[1];
            if (onSelectFacility && matched) onSelectFacility(matched);
          }}
        />
      ) : (
        <div className="space-y-5">
          {/* Filter and Search Bar */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
              <input
                type="text"
                placeholder="Search pharmacy name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-border bg-surface text-ink placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-accent min-h-[48px]"
              />
            </div>

            {/* Gate Filter Selector */}
            <select
              value={selectedGate}
              onChange={(e) => setSelectedGate(e.target.value)}
              aria-label="Filter by campus gate"
              className="w-full px-3 py-2 text-sm rounded-lg border border-border bg-surface text-ink focus:outline-none focus:ring-2 focus:ring-accent min-h-[48px]"
            >
              <option value="all">All Campus Gates</option>
              <option value="odim">Odim Gate (Franco / Eni Njoku)</option>
              <option value="hilltop">Hilltop Gate (Off Campus Lodges)</option>
              <option value="ogige">Ogige Market Junction</option>
            </select>

            {/* Category Filter Selector */}
            <select
              value={activeCategory}
              onChange={(e) => setActiveCategory(e.target.value as CareCategory)}
              aria-label="Filter by stock category"
              className="w-full px-3 py-2 text-sm rounded-lg border border-border bg-surface text-ink focus:outline-none focus:ring-2 focus:ring-accent min-h-[48px]"
            >
              {CARE_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  Stock: {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Pharmacy Cards List */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {filteredFacilities.length === 0 ? (
              <div className="lg:col-span-2 p-8 text-center rounded-lg border border-dashed border-border bg-surface-subtle">
                <p className="text-sm font-semibold text-ink">No accredited pharmacies found</p>
                <p className="text-xs text-muted mt-1">Try clearing your search query or gate filter.</p>
              </div>
            ) : (
              filteredFacilities.map((facility) => (
                <FacilityCard
                  key={facility.id}
                  facility={facility}
                  selectedCategory={activeCategory}
                  onSelect={onSelectFacility}
                />
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};
