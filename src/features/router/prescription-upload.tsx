"use client";

import * as React from "react";
import { Badge } from "@/components/ui/badge";
import { Camera, Check, FileText, Image as ImageIcon, Sparkles, Trash2, X, ZoomIn } from "lucide-react";

export interface PrescriptionUploadProps {
  prescriptionImage?: string;
  onChange: (image: string | undefined) => void;
}

// Generate realistic SVG doctor prescription data URL for instant demos & offline testing
export function generateSampleDoctorRx(): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="420" viewBox="0 0 600 420">
    <defs>
      <pattern id="lines" width="100" height="24" patternUnits="userSpaceOnUse">
        <line x1="0" y1="24" x2="100" y2="24" stroke="#e2e8f0" stroke-width="1"/>
      </pattern>
    </defs>
    <rect width="600" height="420" fill="#fffef8" rx="8" stroke="#cbd5e1" stroke-width="2"/>
    <rect width="600" height="420" fill="url(#lines)"/>
    
    <!-- Clinic Letterhead -->
    <rect x="0" y="0" width="600" height="70" fill="#0f766e" rx="8 8 0 0"/>
    <text x="30" y="32" font-family="'Plus Jakarta Sans', sans-serif" font-size="16" font-weight="bold" fill="#ffffff">UNIVERSITY OF NIGERIA, NSUKKA : HEALTH SERVICES</text>
    <text x="30" y="52" font-family="'Inter', sans-serif" font-size="11" fill="#ccfbf1">Medical Centre Consultation Bay • Outpatient Rx Order Slip</text>
    <text x="560" y="42" font-family="monospace" font-size="12" font-weight="bold" fill="#ffffff" text-anchor="end">DATE: 20 NOV 2026</text>

    <!-- Patient Header -->
    <text x="35" y="96" font-family="'Inter', sans-serif" font-size="12" font-weight="bold" fill="#334155">STUDENT REG: <tspan font-family="monospace" font-weight="normal">2022/248192 (TISHIP ENROLLED)</tspan></text>
    <text x="400" y="96" font-family="'Inter', sans-serif" font-size="12" font-weight="bold" fill="#334155">CLINIC: <tspan font-weight="normal">Ward Bay B</tspan></text>
    <line x1="30" y1="110" x2="570" y2="110" stroke="#94a3b8" stroke-width="1.5"/>

    <!-- Doctor Handwritten Prescription Section -->
    <text x="35" y="145" font-family="Georgia, serif" font-size="32" font-weight="bold" fill="#0f766e" font-style="italic">Rx</text>

    <!-- Realistic Cursive/Medical Shorthand Script Lines -->
    <g fill="#1e293b" font-family="'Brush Script MT', 'Segoe Script', 'Caveat', cursive, serif" font-size="19">
      <text x="75" y="152">1. Tab Coartem (Artemether 80mg / Lumefantrine 480mg)</text>
      <text x="95" y="176" fill="#475569" font-size="17">Sig: 1 tab b.d. x 3/7 (take with fatty meal)</text>

      <text x="75" y="216">2. Tab Paracetamol 1g</text>
      <text x="95" y="240" fill="#475569" font-size="17">Sig: 2 tabs t.d.s. x 3/7 for fever &amp; headache</text>

      <text x="75" y="280">3. ORS Sachets (Oral Rehydration Salts) ii</text>
      <text x="95" y="304" fill="#475569" font-size="17">Sig: Dissolve 1 sachet in 1L clean water, drink p.r.n.</text>
    </g>

    <!-- Doctor Stamp & Signature Box -->
    <line x1="30" y1="330" x2="570" y2="330" stroke="#cbd5e1" stroke-width="1"/>
    <g transform="translate(400, 342)">
      <!-- Official Stamp Border -->
      <rect x="0" y="0" width="170" height="65" fill="#f8fafc" stroke="#0f766e" stroke-dasharray="3,3" stroke-width="1.5" rx="4"/>
      <text x="85" y="18" font-family="sans-serif" font-size="9" font-weight="bold" fill="#0f766e" text-anchor="middle">UNN MEDICAL CENTRE</text>
      <text x="85" y="32" font-family="sans-serif" font-size="8" fill="#475569" text-anchor="middle">Dr. E. C. Okafor (MBBS, MWACP)</text>
      <text x="85" y="44" font-family="sans-serif" font-size="8" fill="#475569" text-anchor="middle">Reg: MDCN/64811/FMCGP</text>
      <text x="85" y="56" font-family="monospace" font-size="8" fill="#047857" text-anchor="middle">VERIFIED OFFICIAL Rx</text>
    </g>
    <text x="35" y="375" font-family="sans-serif" font-size="11" fill="#64748b">Dispensing Instruction: Community Pharmacy or UNN Dispensary</text>
  </svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

export const PrescriptionUpload: React.FC<PrescriptionUploadProps> = ({
  prescriptionImage,
  onChange,
}) => {
  const [isPreviewModalOpen, setIsPreviewModalOpen] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        onChange(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleUseSample = () => {
    const sample = generateSampleDoctorRx();
    onChange(sample);
  };

  const handleRemove = () => {
    onChange(undefined);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-3 pt-2 border-t border-border">
      <div className="flex items-center justify-between gap-2">
        <label className="text-xs font-mono font-bold uppercase tracking-wider text-muted">
          Doctor Written Prescription
        </label>
        <span className="text-[11px] text-muted font-mono">Pharmacist Decoded</span>
      </div>

      <p className="text-xs text-muted leading-relaxed">
        Have a written prescription from a doctor? Take a picture or upload it so the dispensing pharmacist can read and transcribe illegible handwriting prior to arrival.
      </p>

      {/* Hidden File Input */}
      <input
        type="file"
        ref={fileInputRef}
        accept="image/*"
        capture="environment"
        onChange={handleFileChange}
        className="hidden"
        id="prescription-file-upload"
      />

      {prescriptionImage ? (
        /* Uploaded Preview Strip */
        <div className="p-3.5 rounded-xl border-2 border-accent/40 bg-accent/5 space-y-3">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 text-accent font-bold text-xs font-mono">
              <Check className="w-4 h-4 shrink-0 text-emerald-600" />
              <span>Prescription Photo Attached</span>
            </div>

            <Badge variant="pcn" className="text-[10px]">
              Ready for Pharmacist
            </Badge>
          </div>

          <div className="flex items-center gap-3">
            <div
              onClick={() => setIsPreviewModalOpen(true)}
              className="relative w-20 h-16 rounded-lg overflow-hidden border border-border bg-white cursor-pointer group shrink-0"
              title="Click to zoom prescription"
            >
              <img
                src={prescriptionImage}
                alt="Doctor prescription preview"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
              />
              <div className="absolute inset-0 bg-black/25 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                <ZoomIn className="w-4 h-4 text-white" />
              </div>
            </div>

            <div className="flex-1 min-w-0 space-y-1">
              <span className="text-xs font-bold text-ink block truncate">
                Doctor Written Slip Attached
              </span>
              <p className="text-[11px] text-muted leading-snug">
                The community pharmacist will review and clarify doctor handwriting for your pass.
              </p>
            </div>

            <button
              type="button"
              onClick={handleRemove}
              className="p-2 rounded-lg text-muted hover:text-error hover:bg-surface border border-transparent hover:border-border transition-colors min-h-[40px] shrink-0"
              aria-label="Remove uploaded prescription"
              title="Remove prescription"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        /* Action Buttons to Upload or Use Demo */
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center justify-center gap-2 p-3 rounded-lg border border-border bg-surface hover:bg-surface-subtle text-ink text-xs font-bold transition-all min-h-[48px] shadow-2xs focus-visible:outline-2"
          >
            <Camera className="w-4 h-4 text-accent shrink-0" />
            <span>Snap Photo or Upload</span>
          </button>

          <button
            type="button"
            onClick={handleUseSample}
            className="flex items-center justify-center gap-2 p-3 rounded-lg border border-accent/30 bg-accent/10 hover:bg-accent/15 text-accent text-xs font-bold transition-all min-h-[48px] shadow-2xs focus-visible:outline-2"
          >
            <Sparkles className="w-4 h-4 shrink-0 text-accent" />
            <span>Use Sample Doctor Rx</span>
          </button>
        </div>
      )}

      {/* Prescription Zoom Modal */}
      {isPreviewModalOpen && prescriptionImage && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in"
        >
          <div className="bg-surface rounded-2xl border border-border max-w-xl w-full p-4 space-y-3 shadow-xl">
            <div className="flex items-center justify-between pb-2 border-b border-border">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-accent" />
                <h3 className="text-sm font-bold text-ink">
                  Doctor Written Prescription Inspection
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsPreviewModalOpen(false)}
                className="p-1.5 rounded-lg text-muted hover:text-ink hover:bg-surface-subtle"
                aria-label="Close preview modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="rounded-xl overflow-hidden border border-border bg-slate-50 p-2 flex items-center justify-center max-h-[70vh] overflow-y-auto">
              <img
                src={prescriptionImage}
                alt="Full doctor prescription slip"
                className="w-full h-auto object-contain max-h-[60vh] rounded"
              />
            </div>

            <div className="flex items-center justify-between text-xs text-muted pt-1">
              <span>UNN Medical Centre / Community Pharmacy Dispensing Slip</span>
              <button
                type="button"
                onClick={() => setIsPreviewModalOpen(false)}
                className="px-4 py-2 rounded-lg bg-surface border border-border font-bold text-ink hover:bg-surface-subtle min-h-[40px]"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
