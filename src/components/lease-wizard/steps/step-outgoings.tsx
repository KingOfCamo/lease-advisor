"use client";

import { useWizard } from "../wizard-context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/formatters";

export function StepOutgoings() {
  const { state, updateData, nextStep, prevStep } = useWizard();
  const d = state.data;

  const totalOutgoings =
    (d.councilRates ?? 0) +
    (d.waterRates ?? 0) +
    (d.insurance ?? 0) +
    (d.landTax ?? 0) +
    (d.managementFee ?? 0) +
    (d.structuralMaintenance ?? 0) +
    (d.otherOutgoings ?? 0);

  const handleNext = () => {
    if (!d.outgoingsStructure) return;
    nextStep();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Step 5: Outgoings</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>Outgoings Structure *</Label>
          <select
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            value={d.outgoingsStructure}
            onChange={(e) => updateData({ outgoingsStructure: e.target.value })}
          >
            <option value="">Select...</option>
            <option value="GROSS">Gross (landlord pays all outgoings)</option>
            <option value="SEMI_GROSS">Semi-Gross (tenant pays some outgoings)</option>
            <option value="NET">Net (tenant pays all outgoings)</option>
          </select>
        </div>

        {(d.outgoingsStructure === "NET" || d.outgoingsStructure === "SEMI_GROSS") && (
          <div className="space-y-3 border-l-4 border-navy-200 pl-4">
            <p className="text-sm font-medium">Itemised Outgoings (Annual, AUD)</p>
            <div className="grid gap-3 md:grid-cols-2">
              {[
                { label: "Council Rates", key: "councilRates" as const },
                { label: "Water Rates", key: "waterRates" as const },
                { label: "Insurance", key: "insurance" as const },
                { label: "Land Tax", key: "landTax" as const },
                { label: "Management Fee", key: "managementFee" as const },
                { label: "Structural Maintenance", key: "structuralMaintenance" as const },
                { label: "Other", key: "otherOutgoings" as const },
              ].map(({ label, key }) => (
                <div key={key} className="space-y-1">
                  <Label className="text-xs">{label}</Label>
                  <Input
                    type="number"
                    value={d[key] ?? ""}
                    onChange={(e) =>
                      updateData({
                        [key]: e.target.value ? Number(e.target.value) : null,
                      })
                    }
                    placeholder="0"
                  />
                </div>
              ))}
            </div>
            <div className="flex items-center justify-between rounded-lg bg-navy-50 p-3">
              <span className="text-sm font-medium">Total Estimated Outgoings PA</span>
              <span className="text-lg font-bold text-navy-900">
                {formatCurrency(totalOutgoings)}
              </span>
            </div>
          </div>
        )}

        <div className="flex justify-between pt-4">
          <Button variant="outline" onClick={prevStep}>
            Back
          </Button>
          <Button onClick={handleNext} className="bg-navy-700 hover:bg-navy-800">
            Next: Incentives & Security
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
