"use client";

import { useWizard } from "../wizard-context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

export function StepClauses() {
  const { state, updateData, nextStep, prevStep } = useWizard();
  const d = state.data;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Step 7: Key Clauses</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>Permitted Use</Label>
          <Input
            value={d.permittedUse}
            onChange={(e) => updateData({ permittedUse: e.target.value })}
            placeholder="e.g. Restaurant and takeaway food premises"
          />
        </div>

        <div className="space-y-2">
          <Label>Make Good Obligations</Label>
          <Textarea
            value={d.makeGoodObligations}
            onChange={(e) => updateData({ makeGoodObligations: e.target.value })}
            placeholder="Describe make good requirements..."
            rows={2}
          />
        </div>

        <div className="space-y-2">
          <Label>Assignment Rights</Label>
          <Textarea
            value={d.assignmentRights}
            onChange={(e) => updateData({ assignmentRights: e.target.value })}
            placeholder="Describe assignment rights..."
            rows={2}
          />
        </div>

        <div className="space-y-2">
          <Label>Subletting Rights</Label>
          <Textarea
            value={d.sublettingRights}
            onChange={(e) => updateData({ sublettingRights: e.target.value })}
            placeholder="Describe subletting rights..."
            rows={2}
          />
        </div>

        <div className="space-y-2">
          <Label>Default Provisions</Label>
          <Textarea
            value={d.defaultProvisions}
            onChange={(e) => updateData({ defaultProvisions: e.target.value })}
            placeholder="Describe default and termination provisions..."
            rows={2}
          />
        </div>

        <div className="space-y-2">
          <Label>Cure Period (days)</Label>
          <Input
            type="number"
            value={d.curePeriodDays ?? ""}
            onChange={(e) =>
              updateData({
                curePeriodDays: e.target.value ? Number(e.target.value) : null,
              })
            }
            placeholder="e.g. 14"
          />
        </div>

        <div className="space-y-2">
          <p className="text-sm font-medium">Special Clauses</p>
          <div className="grid gap-2 md:grid-cols-3">
            <label className="flex items-center gap-2 rounded-lg border p-3">
              <input
                type="checkbox"
                checked={d.demolitionClause}
                onChange={(e) => updateData({ demolitionClause: e.target.checked })}
                className="rounded"
              />
              <span className="text-sm">Demolition Clause</span>
            </label>
            <label className="flex items-center gap-2 rounded-lg border p-3">
              <input
                type="checkbox"
                checked={d.relocationClause}
                onChange={(e) => updateData({ relocationClause: e.target.checked })}
                className="rounded"
              />
              <span className="text-sm">Relocation Clause</span>
            </label>
            <label className="flex items-center gap-2 rounded-lg border p-3">
              <input
                type="checkbox"
                checked={d.firstRightOfRefusal}
                onChange={(e) =>
                  updateData({ firstRightOfRefusal: e.target.checked })
                }
                className="rounded"
              />
              <span className="text-sm">First Right of Refusal</span>
            </label>
          </div>
        </div>

        <div className="flex justify-between pt-4">
          <Button variant="outline" onClick={prevStep}>
            Back
          </Button>
          <Button onClick={nextStep} className="bg-navy-700 hover:bg-navy-800">
            Next: Review & Save
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
