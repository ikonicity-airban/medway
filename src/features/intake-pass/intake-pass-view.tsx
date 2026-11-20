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
      <Card className="border-2 border-slate-900 bg-surface shadow-lg overflow-hidden">
        {/* Pass Header */}
        <CardHeader className="bg-slate-900 text-white text-center py-4 border-b-2 border-slate-900">
          <div className="flex items-center justify-between gap-2 px-2 pb-2 border-b border-slate-700">
            <span className="text-xs font-mono tracking-wider uppercase text-slate-300">
              Official Student Intake Slip
            </span>
            {pass.tishipCovered ? (
              <Badge variant="tiship">₦0 TISHIP Covered</Badge>
            ) : (
              <Badge variant="neutral">Retail Care Route</Badge>
            )}
          </div>

          <div className="pt-3">
            <CardTitle as="h2" className="text-3xl font-mono font-bold tracking-widest text-white">
              {pass.passCode}
            </CardTitle>
            <p className="text-xs text-slate-300 mt-1 flex items-center justify-center gap-1">
              <Clock className="w-3.5 h-3.5 inline text-slate-400" />
              <span>Generated: {formattedDate}</span>
            </p>
          </div>
        </CardHeader>

        <CardContent className="p-4 md:p-6 space-y-4">
          {/* Vector SVG QR Code */}
          <div className="flex justify-center py-2">
            <PassQrCode passCode={pass.passCode} size={160} />
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
