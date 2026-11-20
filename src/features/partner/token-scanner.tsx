import * as React from "react";
import { getOfflineStorage } from "@/lib/offline-db";
import { verifyCrowdToken } from "@/lib/intake-pass";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { QrCode, CheckCircle2, AlertCircle, ShieldAlert } from "lucide-react";

export interface TokenScannerProps {
  facilityId: string;
  facilityName: string;
  onVerifiedArrival?: (code: string) => void;
}

export const TokenScanner: React.FC<TokenScannerProps> = ({
  facilityId,
  facilityName,
  onVerifiedArrival,
}) => {
  const [inputCode, setInputCode] = React.useState("");
  const [statusMessage, setStatusMessage] = React.useState<string | null>(null);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
  const [verifiedPass, setVerifiedPass] = React.useState<{
    passCode: string;
    category: string;
    allergies: string;
    tishipCovered: boolean;
  } | null>(null);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMessage(null);
    setErrorMessage(null);
    setVerifiedPass(null);

    const cleanCode = inputCode.trim().toUpperCase();
    if (!cleanCode) {
      setErrorMessage("Please enter an intake pass code or arrival token.");
      return;
    }

    const storage = getOfflineStorage();

    // 1. Check if it is a Student Intake Pass (MW-UNN-XXX)
    if (cleanCode.startsWith("MW-UNN-")) {
      const pass = await storage.getIntakePassByCode(cleanCode);
      if (!pass) {
        setErrorMessage(`Intake pass ${cleanCode} not found in local system records.`);
        return;
      }

      setVerifiedPass({
        passCode: pass.passCode,
        category: pass.category,
        allergies: pass.allergies,
        tishipCovered: pass.tishipCovered,
      });

      setStatusMessage(`Student pass ${pass.passCode} verified successfully.`);
      if (onVerifiedArrival) onVerifiedArrival(cleanCode);
      setInputCode("");
      return;
    }

    // 2. Check if it is a Crowd Telemetry Token (CT-UNN-XXX)
    if (cleanCode.startsWith("CT-UNN-")) {
      const token =
        (await storage.getCrowdTokenByCode(inputCode.trim())) ||
        (await storage.getCrowdTokenByCode(cleanCode)) ||
        null;

      if (!token) {
        setErrorMessage(`Arrival token ${cleanCode} not recognized.`);
        return;
      }

      const verified = verifyCrowdToken(token);
      await storage.saveCrowdToken(verified);

      setStatusMessage(`Arrival token ${cleanCode} confirmed. Queue telemetry updated.`);
      if (onVerifiedArrival) onVerifiedArrival(cleanCode);
      setInputCode("");
      return;
    }

    setErrorMessage("Unrecognized code format. Expected MW-UNN-XXXX or CT-UNN-XXXX.");
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <QrCode className="w-5 h-5 text-accent" />
          <h2 className="text-base font-bold text-ink">
            Counter Token & Pass Verification
          </h2>
        </div>
        <span className="text-xs text-muted">Arrival Telemetry</span>
      </div>

      <form onSubmit={handleVerify} className="space-y-3">
        <div className="flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            placeholder="Enter pass code (e.g. MW-UNN-8K2Q) or token..."
            value={inputCode}
            onChange={(e) => setInputCode(e.target.value)}
            className="flex-1 px-3 py-2 text-sm font-mono uppercase rounded-lg border border-border bg-surface text-ink placeholder:text-muted placeholder:font-sans focus:outline-none focus:ring-2 focus:ring-accent min-h-[48px]"
          />
          <Button
            type="submit"
            variant="primary"
            className="min-h-[48px] px-6 text-sm font-bold shrink-0"
          >
            Verify Arrival
          </Button>
        </div>
      </form>

      {/* Success feedback */}
      {statusMessage && (
        <div
          role="status"
          className="p-3.5 rounded-lg bg-success/15 border border-success text-ink text-xs flex items-start gap-2.5"
        >
          <CheckCircle2 className="w-5 h-5 text-success shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="font-bold block">{statusMessage}</span>
            <span className="text-muted block">
              Facility: {facilityName} ({facilityId.slice(0, 8)})
            </span>
          </div>
        </div>
      )}

      {/* Error feedback */}
      {errorMessage && (
        <div
          role="alert"
          className="p-3 rounded-lg bg-danger/10 border border-danger text-danger text-xs flex items-center gap-2"
        >
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Verified Pass Context Card */}
      {verifiedPass && (
        <div className="p-4 rounded-xl border-2 border-border bg-surface-subtle space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-muted uppercase">
              Patient Presentation Slip
            </span>
            {verifiedPass.tishipCovered ? (
              <Badge variant="tiship">₦0 TISHIP Enrolled</Badge>
            ) : (
              <Badge variant="neutral">Retail Patient</Badge>
            )}
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <div>
              <span className="text-muted block">Category Requested:</span>
              <span className="font-bold text-ink block mt-0.5">
                {verifiedPass.category}
              </span>
            </div>

            <div>
              <span className="text-muted block">Pass Identifier:</span>
              <span className="font-mono font-bold text-ink block mt-0.5">
                {verifiedPass.passCode}
              </span>
            </div>
          </div>

          {/* Allergy Highlight */}
          <div
            className={`p-2.5 rounded-lg border ${
              verifiedPass.allergies.toLowerCase() !== "none"
                ? "bg-warning/20 border-warning text-ink"
                : "bg-surface border-border text-muted"
            }`}
          >
            <div className="flex items-center gap-2 text-xs font-bold">
              {verifiedPass.allergies.toLowerCase() !== "none" ? (
                <>
                  <ShieldAlert className="w-4 h-4 text-warning shrink-0" />
                  <span>ALLERGY WARNING: {verifiedPass.allergies}</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4 text-success shrink-0" />
                  <span>No drug allergies declared by student</span>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
