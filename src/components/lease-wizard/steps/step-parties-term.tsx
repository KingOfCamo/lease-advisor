"use client";

import { useWizard } from "../wizard-context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Plus, X } from "lucide-react";

export function StepPartiesTerm() {
  const { state, updateData, nextStep, prevStep } = useWizard();

  const handleNext = () => {
    if (!state.data.leaseName || !state.data.tenantName || !state.data.landlordName) return;
    if (!state.data.commencementDate || !state.data.expiryDate) return;
    nextStep();
  };

  const addOption = () => {
    updateData({
      optionsToRenew: [
        ...state.data.optionsToRenew,
        { termMonths: 60, conditions: "" },
      ],
    });
  };

  const removeOption = (index: number) => {
    updateData({
      optionsToRenew: state.data.optionsToRenew.filter((_, i) => i !== index),
    });
  };

  const updateOption = (
    index: number,
    field: "termMonths" | "conditions",
    value: string | number
  ) => {
    const updated = [...state.data.optionsToRenew];
    updated[index] = { ...updated[index], [field]: value };
    updateData({ optionsToRenew: updated });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Step 3: Parties & Term</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>Lease Name *</Label>
          <Input
            value={state.data.leaseName}
            onChange={(e) => updateData({ leaseName: e.target.value })}
            placeholder="e.g. Chapel St Pizza Shop"
          />
          <p className="text-xs text-muted-foreground">A friendly reference name for this lease</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label>Tenant Name *</Label>
            <Input
              value={state.data.tenantName}
              onChange={(e) => updateData({ tenantName: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label>Landlord Name *</Label>
            <Input
              value={state.data.landlordName}
              onChange={(e) => updateData({ landlordName: e.target.value })}
            />
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label>Commencement Date *</Label>
            <Input
              type="date"
              value={state.data.commencementDate}
              onChange={(e) => updateData({ commencementDate: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label>Expiry Date *</Label>
            <Input
              type="date"
              value={state.data.expiryDate}
              onChange={(e) => updateData({ expiryDate: e.target.value })}
            />
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label>Options to Renew</Label>
            <Button type="button" variant="outline" size="sm" onClick={addOption}>
              <Plus className="mr-1 h-3 w-3" />
              Add Option
            </Button>
          </div>
          {state.data.optionsToRenew.map((opt, i) => (
            <div key={i} className="flex gap-3 items-start border rounded-lg p-3">
              <div className="grid gap-3 md:grid-cols-2 flex-1">
                <div className="space-y-1">
                  <Label className="text-xs">Term (months)</Label>
                  <Input
                    type="number"
                    value={opt.termMonths}
                    onChange={(e) =>
                      updateOption(i, "termMonths", Number(e.target.value))
                    }
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Conditions</Label>
                  <Input
                    value={opt.conditions}
                    onChange={(e) => updateOption(i, "conditions", e.target.value)}
                    placeholder="e.g. Same terms and conditions"
                  />
                </div>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => removeOption(i)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>

        <div className="flex justify-between pt-4">
          <Button variant="outline" onClick={prevStep}>
            Back
          </Button>
          <Button onClick={handleNext} className="bg-navy-700 hover:bg-navy-800">
            Next: Rent & Reviews
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
