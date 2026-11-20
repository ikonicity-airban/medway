import * as React from "react";
import { Facility, CareCategory, CARE_CATEGORIES } from "@/types";
import { FacilityCard } from "@/components/ui/facility-card";
import { Badge } from "@/components/ui/badge";
import { Search, ShieldCheck } from "lucide-react";

export interface PartnerDirectoryProps {
  facilities: Facility[];
  selectedCategory?: CareCategory;
  onSelectFacility?: (facility: Facility) => void;
}

export const PartnerDirectory: React.FC<PartnerDirectoryProps> = ({
  facilities,
  selectedCategory = "Antimalarials (ACT)",
  onSelectFacility,
}) => {
  const [searchTerm, setSearchTerm] = React.useState("");
  const [activeCategory, setActiveCategory] = React.useState<CareCategory>(selectedCategory);
  const [selectedGate, setSelectedGate] = React.useState<string>("all");

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
      {/* Header with PCN Assurance */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-lg bg-surface border border-border">
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

        <div className="flex items-center gap-1.5 text-xs text-muted">
          <ShieldCheck className="w-4 h-4 text-muted shrink-0" />
          <span>Field verified within 4 hours</span>
        </div>
      </div>

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
      <div className="space-y-4">
        {filteredFacilities.length === 0 ? (
          <div className="p-8 text-center rounded-lg border border-dashed border-border bg-surface-subtle">
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
  );
};
