"use client";

import { useWizard } from "../wizard-context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export function StepProperty() {
  const { state, updateData, nextStep, prevStep } = useWizard();

  const handleNext = () => {
    if (!state.data.address || !state.data.suburb || !state.data.postcode || !state.data.propertyType) return;
    nextStep();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Step 2: Property Details</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>Address *</Label>
          <Input
            value={state.data.address}
            onChange={(e) => updateData({ address: e.target.value })}
            placeholder="e.g. 142 Chapel St"
          />
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <div className="space-y-2">
            <Label>Suburb *</Label>
            <Input
              value={state.data.suburb}
              onChange={(e) => updateData({ suburb: e.target.value })}
              placeholder="e.g. Prahran"
            />
          </div>
          <div className="space-y-2">
            <Label>State</Label>
            <Input
              value={state.data.state}
              onChange={(e) => updateData({ state: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label>Postcode *</Label>
            <Input
              value={state.data.postcode}
              onChange={(e) => updateData({ postcode: e.target.value })}
              placeholder="e.g. 3181"
            />
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <div className="space-y-2">
            <Label>Property Type *</Label>
            <select
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              value={state.data.propertyType}
              onChange={(e) => updateData({ propertyType: e.target.value })}
            >
              <option value="">Select...</option>
              <option value="RETAIL">Retail</option>
              <option value="OFFICE">Office</option>
              <option value="INDUSTRIAL">Industrial</option>
              <option value="MIXED_USE">Mixed Use</option>
              <option value="OTHER">Other</option>
            </select>
          </div>
          <div className="space-y-2">
            <Label>NLA (sqm)</Label>
            <Input
              type="number"
              value={state.data.nla ?? ""}
              onChange={(e) =>
                updateData({ nla: e.target.value ? Number(e.target.value) : null })
              }
              placeholder="e.g. 120"
            />
          </div>
          <div className="space-y-2">
            <Label>Property Grade</Label>
            <select
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              value={state.data.propertyGrade}
              onChange={(e) => updateData({ propertyGrade: e.target.value })}
            >
              <option value="">Ungraded</option>
              <option value="A">A Grade</option>
              <option value="B">B Grade</option>
              <option value="C">C Grade</option>
              <option value="D">D Grade</option>
            </select>
          </div>
        </div>

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={state.data.isRetailLease}
            onChange={(e) => updateData({ isRetailLease: e.target.checked })}
            className="rounded"
          />
          <span className="text-sm font-medium">
            Retail lease under the Retail Leases Act 2003 (Vic)
          </span>
        </label>
        {state.data.isRetailLease && (
          <p className="text-xs text-amber-600 ml-6">
            Additional compliance checks will be applied during analysis.
          </p>
        )}

        <div className="flex justify-between pt-4">
          <Button variant="outline" onClick={prevStep}>
            Back
          </Button>
          <Button onClick={handleNext} className="bg-navy-700 hover:bg-navy-800">
            Next: Parties & Term
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
