"use client";

import { useEffect, useState } from "react";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/formatters";
import { useParams } from "next/navigation";

interface ClientData {
  businessName: string;
  clientType: string;
  leaseCount: number;
  totalRent: number;
  totalValueAdd: number;
  recommendations: Array<{
    lease: string;
    title: string;
    impact: number;
  }>;
}

export default function FeeProposalPage() {
  const params = useParams();
  const [data, setData] = useState<ClientData | null>(null);
  const [feeModel, setFeeModel] = useState("fixed");
  const [fixedFee, setFixedFee] = useState(0);
  const [percentage, setPercentage] = useState(5);
  const [perLeaseFee, setPerLeaseFee] = useState(3000);
  const [retainerMonthly, setRetainerMonthly] = useState(1500);

  useEffect(() => {
    fetch(`/api/clients/${params.clientId}/portfolio-summary`)
      .then((r) => r.json())
      .then(setData);
  }, [params.clientId]);

  if (!data) {
    return (
      <div>
        <PageHeader title="Fee Proposal" />
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            Loading portfolio data...
          </CardContent>
        </Card>
      </div>
    );
  }

  const calculatedFee =
    feeModel === "fixed"
      ? fixedFee
      : feeModel === "percentage"
      ? data.totalValueAdd * (percentage / 100)
      : feeModel === "per_lease"
      ? data.leaseCount * perLeaseFee
      : retainerMonthly * 12;

  const feeAsPercentOfValueAdd =
    data.totalValueAdd > 0 ? (calculatedFee / data.totalValueAdd) * 100 : 0;

  return (
    <div>
      <PageHeader
        title={`Fee Proposal: ${data.businessName}`}
        description="Generate a consulting fee proposal based on analysis findings"
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          {/* Portfolio Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Portfolio Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                <div>
                  <p className="text-xs text-muted-foreground">Leases Analysed</p>
                  <p className="text-xl font-bold">{data.leaseCount}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Annual Rent Under Advisory</p>
                  <p className="text-xl font-bold">{formatCurrency(data.totalRent)}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Identified Value-Add</p>
                  <p className="text-xl font-bold text-green-700">
                    {formatCurrency(data.totalValueAdd)}/yr
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Fee Model Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Fee Model</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-3 md:grid-cols-2">
                {[
                  { id: "fixed", label: "Fixed Fee", desc: "Set a flat consulting fee" },
                  { id: "percentage", label: "% of Savings", desc: "Fee based on identified value" },
                  { id: "per_lease", label: "Per Lease", desc: "Fee per lease analysed" },
                  { id: "retainer", label: "Monthly Retainer", desc: "Ongoing advisory retainer" },
                ].map((model) => (
                  <label
                    key={model.id}
                    className={`flex items-start gap-3 rounded-lg border p-4 cursor-pointer transition-colors ${
                      feeModel === model.id
                        ? "border-navy-700 bg-navy-50"
                        : "hover:bg-gray-50"
                    }`}
                  >
                    <input
                      type="radio"
                      name="feeModel"
                      value={model.id}
                      checked={feeModel === model.id}
                      onChange={(e) => setFeeModel(e.target.value)}
                      className="mt-1"
                    />
                    <div>
                      <p className="font-medium text-sm">{model.label}</p>
                      <p className="text-xs text-muted-foreground">{model.desc}</p>
                    </div>
                  </label>
                ))}
              </div>

              <div className="border-t pt-4">
                {feeModel === "fixed" && (
                  <div className="space-y-2">
                    <Label>Fixed Fee Amount (AUD)</Label>
                    <Input
                      type="number"
                      value={fixedFee || ""}
                      onChange={(e) => setFixedFee(Number(e.target.value))}
                      placeholder="e.g. 15000"
                    />
                  </div>
                )}
                {feeModel === "percentage" && (
                  <div className="space-y-2">
                    <Label>Percentage of Identified Savings (%)</Label>
                    <Input
                      type="number"
                      step="0.5"
                      value={percentage}
                      onChange={(e) => setPercentage(Number(e.target.value))}
                    />
                    <p className="text-xs text-muted-foreground">
                      {percentage}% of {formatCurrency(data.totalValueAdd)} ={" "}
                      {formatCurrency(data.totalValueAdd * (percentage / 100))}
                    </p>
                  </div>
                )}
                {feeModel === "per_lease" && (
                  <div className="space-y-2">
                    <Label>Fee Per Lease (AUD)</Label>
                    <Input
                      type="number"
                      value={perLeaseFee}
                      onChange={(e) => setPerLeaseFee(Number(e.target.value))}
                    />
                    <p className="text-xs text-muted-foreground">
                      {data.leaseCount} leases × {formatCurrency(perLeaseFee)} ={" "}
                      {formatCurrency(data.leaseCount * perLeaseFee)}
                    </p>
                  </div>
                )}
                {feeModel === "retainer" && (
                  <div className="space-y-2">
                    <Label>Monthly Retainer (AUD)</Label>
                    <Input
                      type="number"
                      value={retainerMonthly}
                      onChange={(e) => setRetainerMonthly(Number(e.target.value))}
                    />
                    <p className="text-xs text-muted-foreground">
                      {formatCurrency(retainerMonthly)}/month ={" "}
                      {formatCurrency(retainerMonthly * 12)}/year
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Opportunity Breakdown */}
          {data.recommendations.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Opportunity Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {data.recommendations.map((rec, i) => (
                    <div key={i} className="flex justify-between text-sm border-b pb-2">
                      <div>
                        <p className="font-medium">{rec.title}</p>
                        <p className="text-xs text-muted-foreground">{rec.lease}</p>
                      </div>
                      <span className="text-green-700 font-medium">
                        {formatCurrency(rec.impact)}/yr
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Fee Summary */}
        <div className="space-y-6">
          <Card className="border-navy-200 bg-navy-50">
            <CardHeader>
              <CardTitle className="text-lg">Fee Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-xs text-muted-foreground uppercase">Proposed Fee</p>
                <p className="text-3xl font-bold text-navy-900">
                  {formatCurrency(calculatedFee)}
                </p>
              </div>
              {data.totalValueAdd > 0 && (
                <div className="border-t pt-3">
                  <p className="text-sm text-muted-foreground">
                    Our fee of {formatCurrency(calculatedFee)} represents just{" "}
                    <span className="font-bold text-navy-900">
                      {feeAsPercentOfValueAdd.toFixed(1)}%
                    </span>{" "}
                    of the {formatCurrency(data.totalValueAdd)} in identified
                    annual value improvements.
                  </p>
                </div>
              )}
              <Button
                className="w-full bg-navy-700 hover:bg-navy-800"
                onClick={async () => {
                  const feeLabels: Record<string, string> = {
                    fixed: `Fixed fee of $${calculatedFee.toLocaleString()}`,
                    percentage: `${percentage}% of identified savings`,
                    per_lease: `$${perLeaseFee.toLocaleString()} per lease (${data.leaseCount} leases)`,
                    retainer: `$${retainerMonthly.toLocaleString()}/month retainer`,
                  };
                  const res = await fetch(`/api/clients/${params.clientId}/fee-proposal`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                      feeModel,
                      feeAmount: calculatedFee,
                      feeDetail: feeLabels[feeModel] || feeModel,
                    }),
                  });
                  if (res.ok) {
                    const blob = await res.blob();
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement("a");
                    a.href = url;
                    a.download = `Fee_Proposal_${data.businessName.replace(/[^a-zA-Z0-9]/g, "_")}.pdf`;
                    a.click();
                    URL.revokeObjectURL(url);
                  }
                }}
                disabled={calculatedFee <= 0}
              >
                Download Fee Proposal PDF
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
