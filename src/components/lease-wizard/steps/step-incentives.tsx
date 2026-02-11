"use client";

import { useWizard } from "../wizard-context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

export function StepIncentives() {
  const { state, updateData, nextStep, prevStep } = useWizard();
  const d = state.data;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Step 6: Incentives & Security</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Incentives offered and security arrangements for the lease.
        </p>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label>Fitout Contribution (AUD)</Label>
            <Input
              type="number"
              value={d.fitoutContribution ?? ""}
              onChange={(e) =>
                updateData({
                  fitoutContribution: e.target.value ? Number(e.target.value) : null,
                })
              }
              placeholder="e.g. 15000"
            />
          </div>
          <div className="space-y-2">
            <Label>Rent-Free Period (months)</Label>
            <Input
              type="number"
              value={d.rentFreePeriodMonths ?? ""}
              onChange={(e) =>
                updateData({
                  rentFreePeriodMonths: e.target.value ? Number(e.target.value) : null,
                })
              }
              placeholder="e.g. 2"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Other Incentives Detail</Label>
          <Textarea
            value={d.incentivesDetail}
            onChange={(e) => updateData({ incentivesDetail: e.target.value })}
            placeholder="Describe any other incentives..."
            rows={2}
          />
        </div>

        <div className="border-t pt-4 space-y-4">
          <h4 className="font-medium">Security</h4>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Bond Amount (AUD)</Label>
              <Input
                type="number"
                value={d.bondAmount ?? ""}
                onChange={(e) =>
                  updateData({
                    bondAmount: e.target.value ? Number(e.target.value) : null,
                  })
                }
                placeholder="e.g. 19500"
              />
            </div>
            <div className="space-y-2">
              <Label>Bond Type</Label>
              <select
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={d.bondType}
                onChange={(e) => updateData({ bondType: e.target.value })}
              >
                <option value="">Select...</option>
                <option value="BANK_GUARANTEE">Bank Guarantee</option>
                <option value="CASH_BOND">Cash Bond</option>
                <option value="PERSONAL_GUARANTEE">Personal Guarantee</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Bond Reduction Terms</Label>
            <Textarea
              value={d.bondReductionTerms}
              onChange={(e) => updateData({ bondReductionTerms: e.target.value })}
              placeholder="e.g. Bond reduces to 2 months rent after 3 years of compliance"
              rows={2}
            />
          </div>
        </div>

        <div className="flex justify-between pt-4">
          <Button variant="outline" onClick={prevStep}>
            Back
          </Button>
          <Button onClick={nextStep} className="bg-navy-700 hover:bg-navy-800">
            Next: Key Clauses
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
