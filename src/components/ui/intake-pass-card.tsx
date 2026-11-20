import * as React from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { IntakePass } from "@/types";
import { AlertCircle, CheckCircle2, Clock, ShieldAlert } from "lucide-react";

export interface IntakePassCardProps {
  pass: IntakePass;
  tokenCode?: string;
}

export const IntakePassCard: React.FC<IntakePassCardProps> = ({
  pass,
  tokenCode,
}) => {
  const formattedDate = new Date(pass.timestamp).toLocaleString("en-NG", {
    dateStyle: "medium",
    timeStyle: "short",
  });

  const hasAllergies =
    pass.allergies.trim().toLowerCase() !== "none" &&
    pass.allergies.trim().length > 0;

  return (
    <Card className="border-2 border-border shadow-md max-w-lg mx-auto">
      <CardHeader className="bg-surface-subtle border-b-2 border-border">
        <div className="flex items-center justify-between gap-2">
          <span className="text-xs font-bold text-muted uppercase tracking-wider">
            Student Intake Pass
          </span>
          {pass.tishipCovered ? (
            <Badge variant="tiship">₦0 TISHIP Applied</Badge>
          ) : (
            <Badge variant="neutral">Retail Care Route</Badge>
          )}
        </div>

        <div className="pt-2 text-center">
          <CardTitle as="h2" className="text-2xl md:text-3xl font-mono tracking-widest text-ink">
            {pass.passCode}
          </CardTitle>
          <p className="text-xs text-muted mt-1 flex items-center justify-center gap-1">
            <Clock className="w-3.5 h-3.5 inline" />
            <span>Generated: {formattedDate}</span>
          </p>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Destination & Care Category */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 p-3.5 rounded-md bg-surface-subtle border border-border-subtle">
          <div>
            <span className="text-xs font-semibold text-muted block uppercase">
              Target Facility
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

        {/* Drug Allergy Declaration */}
        <div
          className={`p-3.5 rounded-md border ${
            hasAllergies
              ? "bg-warning/10 border-warning text-ink"
              : "bg-surface-subtle border-border-subtle text-body"
          }`}
        >
          <div className="flex items-start gap-2.5">
            {hasAllergies ? (
              <ShieldAlert className="w-5 h-5 text-warning shrink-0 mt-0.5" />
            ) : (
              <CheckCircle2 className="w-5 h-5 text-success shrink-0 mt-0.5" />
            )}
            <div>
              <span className="text-xs font-bold uppercase tracking-wider block">
                Declared Drug Allergies
              </span>
              <span className="text-sm font-semibold block mt-0.5">
                {pass.allergies}
              </span>
              {hasAllergies && (
                <p className="text-xs text-muted mt-1">
                  Alert attendant before dispensing any medication or administering injections.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Counter Check-in Telemetry Code */}
        {tokenCode && (
          <div className="p-3 rounded-md bg-surface border border-border text-center space-y-1">
            <span className="text-xs font-semibold text-muted block uppercase">
              Counter Telemetry Token (30 min valid)
            </span>
            <span className="font-mono text-sm font-bold text-ink select-all">
              {tokenCode}
            </span>
            <p className="text-xs text-muted">
              Show this slip or code to the pharmacy attendant to confirm arrival.
            </p>
          </div>
        )}

        {/* Safety Disclaimer */}
        <div className="p-3 rounded-md bg-surface-subtle border border-border-subtle text-xs text-muted flex items-start gap-2">
          <AlertCircle className="w-4 h-4 text-muted shrink-0 mt-0.5" />
          <p>
            MedWay provides deterministic triage routing and facility navigation.
            This slip is not a medical diagnosis or prescription. Attendants verify
            student eligibility upon arrival.
          </p>
        </div>
      </CardContent>

      <CardFooter className="justify-center text-center">
        <span className="text-xs text-muted">
          University of Nigeria Nsukka · Campus Care Router & Pre-Triage
        </span>
      </CardFooter>
    </Card>
  );
};
