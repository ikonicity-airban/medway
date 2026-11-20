import * as React from "react";
import { IntakePass } from "@/types";
import { PassQrCode } from "./pass-qr-code";
import { formatPassText } from "@/lib/intake-pass";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AlertCircle,
  Check,
  CheckCircle2,
  Clock,
  Copy,
  ShieldAlert,
  Smartphone,
} from "lucide-react";

export interface IntakePassViewProps {
  pass: IntakePass;
  tokenCode?: string;
  onClose?: () => void;
}

export const IntakePassView: React.FC<IntakePassViewProps> = ({
  pass,
  tokenCode,
  onClose,
}) => {
  const [copied, setCopied] = React.useState(false);

  const formattedDate = new Date(pass.timestamp).toLocaleString("en-NG", {
    dateStyle: "medium",
    timeStyle: "short",
  });

  const hasAllergies =
    pass.allergies.trim().toLowerCase() !== "none" &&
    pass.allergies.trim().length > 0;

  const handleCopy = async () => {
    try {
      const text = formatPassText(pass);
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback for older browsers
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div className="space-y-4 max-w-lg mx-auto">
      {/* Toast Notification */}
      {copied && (
        <div
          role="status"
          className="p-3 rounded-lg bg-success text-white text-xs font-bold flex items-center justify-center gap-2 shadow-md animate-in fade-in duration-200"
        >
          <Check className="w-4 h-4" />
          <span>Intake slip copied to clipboard!</span>
        </div>
      )}

      {/* Main Intake Pass Card */}
      <Card className="border border-border bg-surface shadow-md overflow-hidden rounded-2xl">
        {/* Pass Header */}
        <CardHeader className="bg-surface-subtle border-b border-border text-center py-4 px-4 sm:px-6">
          <div className="flex items-center justify-between gap-2 pb-2 border-b border-border-subtle">
            <span className="text-xs font-mono font-bold tracking-wider uppercase text-muted">
              Official Student Intake Slip
            </span>
            {pass.tishipCovered ? (
              <Badge variant="tiship">₦0 TISHIP Covered</Badge>
            ) : (
              <Badge variant="neutral">Retail Care Route</Badge>
            )}
          </div>

          <div className="pt-2 text-center">
            <CardTitle as="h2" className="text-xl sm:text-2xl font-mono font-bold tracking-widest text-ink">
              {pass.passCode}
            </CardTitle>
            <p className="text-xs text-muted mt-0.5 flex items-center justify-center gap-1 font-mono">
              <Clock className="w-3.5 h-3.5 inline text-muted" />
              <span>Issued: {formattedDate}</span>
            </p>
          </div>
        </CardHeader>

        <CardContent className="p-4 sm:p-6 space-y-4">
          {/* Real Scannable Vector QR Code inside Viewfinder Ticket */}
          <div className="flex justify-center py-1">
            <PassQrCode passCode={pass.passCode} size={170} />
          </div>

          {/* Facility & Category Overview */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 rounded-lg bg-surface-subtle border border-border">
            <div>
              <span className="text-xs font-semibold text-muted block uppercase">
                Care Destination
              </span>
              <span className="text-sm font-bold text-ink block mt-0.5">
                {pass.facilityName}
              </span>
            </div>

            <div>
              <span className="text-xs font-semibold text-muted block uppercase">
                Care Category
              </span>
              <span className="text-sm font-bold text-accent block mt-0.5">
                {pass.category}
              </span>
            </div>
          </div>

          {/* Allergy Alert Box */}
          <div className="p-4 rounded-lg border border-border bg-surface-subtle text-ink">
            <div className="flex items-start gap-3">
              <ShieldAlert className="w-5 h-5 text-ink shrink-0 mt-0.5" />
              <div className="space-y-0.5 flex-1">
                <span className="text-xs font-mono font-bold uppercase tracking-wider block text-muted">
                  Declared Drug Allergies
                </span>
                <span className="text-sm font-bold text-ink block">
                  {pass.allergies}
                </span>
                {hasAllergies ? (
                  <p className="text-xs text-muted mt-1 font-medium">
                    Critical: Present this alert to the attendant prior to drug dispensing.
                  </p>
                ) : (
                  <p className="text-xs text-muted mt-0.5">
                    No adverse drug reactions declared by student.
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Doctor Written Prescription Section */}
          {pass.prescriptionImage && (
            <div className="p-4 rounded-xl border border-border bg-surface space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-mono font-bold uppercase tracking-wider text-muted">
                  Doctor Written Prescription
                </span>
                <Badge variant="tiship">Photo Transmitted</Badge>
              </div>

              <div className="rounded-lg overflow-hidden border border-border bg-slate-50 p-2 flex items-center justify-center max-h-56">
                <img
                  src={pass.prescriptionImage}
                  alt="Doctor written prescription slip"
                  className="w-full h-auto object-contain max-h-52 rounded"
                />
              </div>

              {pass.pharmacistNotes ? (
                <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-xs text-ink space-y-1">
                  <div className="flex items-center gap-1.5 text-emerald-800 dark:text-emerald-300 font-bold font-mono text-[11px] uppercase">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>PCN Pharmacist Handwriting Clarification</span>
                  </div>
                  <p className="text-body font-medium leading-relaxed">
                    {pass.pharmacistNotes}
                  </p>
                </div>
              ) : (
                <div className="p-2.5 rounded-lg bg-surface-subtle text-[11px] text-muted flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-muted shrink-0" />
                  <span>Awaiting dispensing pharmacist handwriting clarification at the counter.</span>
                </div>
              )}
            </div>
          )}

          {/* Telemetry Token (if issued) */}
          {tokenCode && (
            <div className="p-3 rounded-lg border border-border bg-surface text-center space-y-1">
              <span className="text-xs font-bold text-muted uppercase">
                Arrival Counter Token
              </span>
              <span className="font-mono text-sm font-bold text-ink block select-all">
                {tokenCode}
              </span>
              <p className="text-xs text-muted">
                Scan or read this code at the pharmacy counter to update queue telemetry.
              </p>
            </div>
          )}

          {/* Safety Disclaimer */}
          <div className="p-3 rounded-md bg-surface-subtle border border-border text-xs text-muted flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-muted shrink-0 mt-0.5" />
            <p>
              MedWay is an institutional care router and pre-triage platform. This slip does
              not constitute a clinical prescription or diagnosis.
            </p>
          </div>
        </CardContent>

        {/* Action Buttons */}
        <CardFooter className="flex flex-col gap-2 p-4 md:p-6 bg-surface-subtle border-t border-border">
          <Button
            variant="primary"
            fullWidth
            onClick={handleCopy}
            className="min-h-[48px] text-sm font-bold flex items-center justify-center gap-2"
          >
            <Copy className="w-4 h-4" />
            <span>Copy Slip to Clipboard</span>
          </Button>

          {onClose && (
            <Button
              variant="secondary"
              fullWidth
              onClick={onClose}
              className="min-h-[48px] text-sm"
            >
              Done & Return to Router
            </Button>
          )}

          <div className="flex items-center justify-center gap-1.5 text-xs text-muted pt-1">
            <Smartphone className="w-3.5 h-3.5" />
            <span>Pass saved to offline local storage</span>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};
