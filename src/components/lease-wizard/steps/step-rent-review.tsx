"use client";

import { useWizard } from "../wizard-context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export function StepRentReview() {
  const { state, updateData, nextStep, prevStep } = useWizard();
  const d = state.data;

  const rentPSQM =
    d.baseRentPA && d.nla ? (d.baseRentPA / d.nla).toFixed(0) : "—";

  const handleNext = () => {
    if (!d.baseRentPA || !d.rentReviewMechanism) return;
    nextStep();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Step 4: Rent & Reviews</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4 md:grid-cols-3">
          <div className="space-y-2">
            <Label>Base Rent PA (AUD) *</Label>
            <Input
              type="number"
              value={d.baseRentPA ?? ""}
              onChange={(e) =>
                updateData({
                  baseRentPA: e.target.value ? Number(e.target.value) : null,
                })
              }
              placeholder="e.g. 78000"
            />
          </div>
          <div className="space-y-2">
            <Label>Rent per sqm</Label>
            <div className="flex h-10 items-center rounded-md border bg-muted px-3 text-sm font-medium">
              ${rentPSQM}/sqm
            </div>
            <p className="text-xs text-muted-foreground">Auto-calculated</p>
          </div>
          <div className="space-y-2">
            <Label>Review Frequency</Label>
            <select
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              value={d.rentReviewFrequencyMonths}
              onChange={(e) =>
                updateData({
                  rentReviewFrequencyMonths: Number(e.target.value),
                })
              }
            >
              <option value={12}>Annual (12 months)</option>
              <option value={6}>Semi-annual (6 months)</option>
              <option value={24}>Biennial (24 months)</option>
              <option value={36}>Triennial (36 months)</option>
            </select>
          </div>
        </div>

        <div className="space-y-2">
          <Label>Rent Review Mechanism *</Label>
          <select
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            value={d.rentReviewMechanism}
            onChange={(e) =>
              updateData({ rentReviewMechanism: e.target.value })
            }
          >
            <option value="">Select mechanism...</option>
            <option value="FIXED_PERCENT">Fixed Percentage</option>
            <option value="CPI">CPI</option>
            <option value="CPI_PLUS">CPI + Margin</option>
            <option value="MARKET">Market Review</option>
            <option value="COMBINATION">Combination / Other</option>
          </select>
        </div>

        {d.rentReviewMechanism === "FIXED_PERCENT" && (
          <div className="space-y-2 border-l-4 border-navy-200 pl-4">
            <Label>Fixed Increase (%)</Label>
            <Input
              type="number"
              step="0.1"
              value={d.fixedPercent ?? ""}
              onChange={(e) =>
                updateData({
                  fixedPercent: e.target.value ? Number(e.target.value) : null,
                  rentReviewDetail: `${e.target.value}% fixed increase annually`,
                })
              }
              placeholder="e.g. 3.0"
            />
          </div>
        )}

        {d.rentReviewMechanism === "CPI" && (
          <div className="border-l-4 border-navy-200 pl-4">
            <p className="text-sm text-muted-foreground">
              CPI-only reviews — rent adjusts in line with the Consumer Price Index.
            </p>
          </div>
        )}

        {d.rentReviewMechanism === "CPI_PLUS" && (
          <div className="space-y-2 border-l-4 border-navy-200 pl-4">
            <Label>CPI + Margin (%)</Label>
            <Input
              type="number"
              step="0.1"
              value={d.cpiMargin ?? ""}
              onChange={(e) =>
                updateData({
                  cpiMargin: e.target.value ? Number(e.target.value) : null,
                  rentReviewDetail: `CPI + ${e.target.value}% annually`,
                })
              }
              placeholder="e.g. 1.0"
            />
          </div>
        )}

        {d.rentReviewMechanism === "MARKET" && (
          <div className="space-y-3 border-l-4 border-navy-200 pl-4">
            <div className="space-y-2">
              <Label>Cap on Increase (%)</Label>
              <Input
                type="number"
                step="0.1"
                value={d.marketCap ?? ""}
                onChange={(e) =>
                  updateData({
                    marketCap: e.target.value ? Number(e.target.value) : null,
                  })
                }
                placeholder="Leave blank if no cap"
              />
              <p className="text-xs text-muted-foreground">
                Maximum % rent can increase at market review. Leave blank if uncapped.
              </p>
            </div>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={d.hasRatchetClause}
                onChange={(e) =>
                  updateData({ hasRatchetClause: e.target.checked })
                }
                className="rounded"
              />
              <span className="text-sm">
                Ratchet clause (rent cannot decrease below current level)
              </span>
            </label>
          </div>
        )}

        {d.rentReviewMechanism === "COMBINATION" && (
          <div className="space-y-2 border-l-4 border-navy-200 pl-4">
            <Label>Describe the review mechanism</Label>
            <Input
              value={d.rentReviewDetail}
              onChange={(e) => updateData({ rentReviewDetail: e.target.value })}
              placeholder="e.g. CPI during term, market at option exercise"
            />
          </div>
        )}

        {d.rentReviewMechanism !== "MARKET" && (
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={d.hasRatchetClause}
              onChange={(e) =>
                updateData({ hasRatchetClause: e.target.checked })
              }
              className="rounded"
            />
            <span className="text-sm">Ratchet clause applies</span>
          </label>
        )}

        <div className="flex justify-between pt-4">
          <Button variant="outline" onClick={prevStep}>
            Back
          </Button>
          <Button onClick={handleNext} className="bg-navy-700 hover:bg-navy-800">
            Next: Outgoings
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
