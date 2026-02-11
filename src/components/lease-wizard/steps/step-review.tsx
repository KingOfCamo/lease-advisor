"use client";

import { useWizard } from "../wizard-context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/formatters";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function StepReview() {
  const { state, updateData, prevStep, goToStep } = useWizard();
  const d = state.data;
  const router = useRouter();
  const [saving, setSaving] = useState(false);

  const rentPSQM = d.baseRentPA && d.nla ? (d.baseRentPA / d.nla).toFixed(0) : "—";

  const totalOutgoings =
    (d.councilRates ?? 0) + (d.waterRates ?? 0) + (d.insurance ?? 0) +
    (d.landTax ?? 0) + (d.managementFee ?? 0) + (d.structuralMaintenance ?? 0) +
    (d.otherOutgoings ?? 0);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/leases", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(d),
      });
      if (!res.ok) throw new Error("Failed to save");
      const lease = await res.json();
      router.push(`/leases/${lease.id}`);
    } catch {
      alert("Failed to save lease. Please try again.");
      setSaving(false);
    }
  };

  const Section = ({
    title,
    step,
    children,
  }: {
    title: string;
    step: number;
    children: React.ReactNode;
  }) => (
    <div className="space-y-2 border-b pb-4">
      <div className="flex items-center justify-between">
        <h4 className="font-medium text-navy-900">{title}</h4>
        <Button variant="ghost" size="sm" onClick={() => goToStep(step)} className="text-xs">
          Edit
        </Button>
      </div>
      <div className="text-sm space-y-1">{children}</div>
    </div>
  );

  const Field = ({ label, value }: { label: string; value: string | number | null | undefined }) => (
    <div className="flex justify-between">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium">{value ?? "—"}</span>
    </div>
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Step 8: Review & Save</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Section title="Property" step={1}>
          <Field label="Address" value={`${d.address}, ${d.suburb} ${d.state} ${d.postcode}`} />
          <Field label="Type" value={d.propertyType} />
          <Field label="NLA" value={d.nla ? `${d.nla} sqm` : undefined} />
          <Field label="Retail Lease" value={d.isRetailLease ? "Yes" : "No"} />
        </Section>

        <Section title="Parties & Term" step={2}>
          <Field label="Lease Name" value={d.leaseName} />
          <Field label="Tenant" value={d.tenantName} />
          <Field label="Landlord" value={d.landlordName} />
          <Field label="Term" value={`${d.commencementDate} to ${d.expiryDate}`} />
          {d.optionsToRenew.length > 0 && (
            <Field
              label="Options"
              value={d.optionsToRenew.map((o) => `${o.termMonths}m`).join(", ")}
            />
          )}
        </Section>

        <Section title="Rent & Reviews" step={3}>
          <Field label="Base Rent PA" value={d.baseRentPA ? formatCurrency(d.baseRentPA) : undefined} />
          <Field label="Rent/sqm" value={`$${rentPSQM}/sqm`} />
          <Field label="Review Mechanism" value={d.rentReviewMechanism} />
          <Field label="Review Detail" value={d.rentReviewDetail} />
          <Field label="Ratchet Clause" value={d.hasRatchetClause ? "Yes" : "No"} />
        </Section>

        <Section title="Outgoings" step={4}>
          <Field label="Structure" value={d.outgoingsStructure} />
          {totalOutgoings > 0 && (
            <Field label="Total Outgoings PA" value={formatCurrency(totalOutgoings)} />
          )}
        </Section>

        <Section title="Incentives & Security" step={5}>
          {d.fitoutContribution && (
            <Field label="Fitout Contribution" value={formatCurrency(d.fitoutContribution)} />
          )}
          {d.rentFreePeriodMonths && (
            <Field label="Rent-Free Period" value={`${d.rentFreePeriodMonths} months`} />
          )}
          {d.bondAmount && (
            <Field label="Bond" value={`${formatCurrency(d.bondAmount)} (${d.bondType || "—"})`} />
          )}
        </Section>

        <Section title="Key Clauses" step={6}>
          <Field label="Permitted Use" value={d.permittedUse} />
          <Field label="Demolition Clause" value={d.demolitionClause ? "Yes" : "No"} />
          <Field label="Relocation Clause" value={d.relocationClause ? "Yes" : "No"} />
          <Field label="First Right of Refusal" value={d.firstRightOfRefusal ? "Yes" : "No"} />
        </Section>

        <div className="space-y-2">
          <Label>Special Conditions</Label>
          <Textarea
            value={d.specialConditions}
            onChange={(e) => updateData({ specialConditions: e.target.value })}
            rows={3}
            placeholder="Any special conditions..."
          />
        </div>

        <div className="flex justify-between pt-4">
          <Button variant="outline" onClick={prevStep}>
            Back
          </Button>
          <Button
            onClick={handleSave}
            disabled={saving}
            className="bg-navy-700 hover:bg-navy-800"
          >
            {saving ? "Saving..." : "Save Lease"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
