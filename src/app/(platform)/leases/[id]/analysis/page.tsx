import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { formatCurrency } from "@/lib/formatters";
import Link from "next/link";
import { AlertTriangle, FileText, ArrowLeft } from "lucide-react";

export const dynamic = "force-dynamic";

interface ClauseScore {
  clauseName: string;
  rating: string;
  explanation: string;
  recommendation: string;
  estimatedImpactPA: number;
  weight: number;
}

interface Recommendation {
  title: string;
  description: string;
  estimatedAnnualImpact: number;
  priority: string;
}

interface RiskFlag {
  flag: string;
  severity: string;
  detail: string;
}

interface RetailIssue {
  section: string;
  issue: string;
  detail: string;
}

interface Benchmark {
  rentPSQM: { low: number; median: number; high: number };
  typicalIncentive: string;
  typicalReview: string;
}

interface Comparable {
  address: string;
  suburb: string;
  propertyType: string;
  nla: number;
  rentPSQM: number;
  leaseTerm: string;
  reviewType: string;
}

export default async function AnalysisPage({
  params,
}: {
  params: { id: string };
}) {
  const lease = await prisma.lease.findUnique({
    where: { id: params.id },
    include: { property: true, client: true, analyses: true },
  });

  if (!lease) notFound();

  const analysis = lease.analyses[lease.analyses.length - 1];
  if (!analysis) notFound();

  const clauses: ClauseScore[] = JSON.parse(analysis.clauseAnalysis);
  const recommendations: Recommendation[] = JSON.parse(analysis.topRecommendations);
  const riskFlags: RiskFlag[] = analysis.riskFlags ? JSON.parse(analysis.riskFlags) : [];
  const retailIssues: RetailIssue[] = analysis.retailLeasesActIssues
    ? JSON.parse(analysis.retailLeasesActIssues) : [];
  const marketCtx = analysis.marketContext ? JSON.parse(analysis.marketContext) : null;
  const benchmarks: Benchmark | null = marketCtx?.benchmarks;
  const comparables: Comparable[] = marketCtx?.comparables || [];

  const clientType = lease.client.clientType;
  const isLandlord = clientType === "LANDLORD";
  const clientScore = isLandlord ? analysis.overallLandlordScore : analysis.overallTenantScore;

  function ratingColor(rating: string) {
    if (
      (isLandlord && rating === "LANDLORD_FRIENDLY") ||
      (!isLandlord && rating === "TENANT_FRIENDLY")
    ) {
      return "bg-green-100 text-green-800 border-green-300";
    }
    if (rating === "BALANCED") {
      return "bg-amber-100 text-amber-800 border-amber-300";
    }
    return "bg-red-100 text-red-800 border-red-300";
  }

  function ratingLabel(rating: string) {
    if (rating === "LANDLORD_FRIENDLY") return "Landlord-Friendly";
    if (rating === "TENANT_FRIENDLY") return "Tenant-Friendly";
    return "Balanced";
  }

  return (
    <div>
      <PageHeader title={`Analysis: ${lease.leaseName}`}>
        <Link href={`/leases/${lease.id}`}>
          <Button variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Lease
          </Button>
        </Link>
        <Link href={`/api/leases/${lease.id}/report`}>
          <Button className="bg-navy-700 hover:bg-navy-800">
            <FileText className="mr-2 h-4 w-4" />
            Generate Report
          </Button>
        </Link>
      </PageHeader>

      {/* Executive Summary */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-navy-900">Executive Summary</h3>
              <p className="text-sm text-muted-foreground max-w-2xl">
                This {lease.property.propertyType.toLowerCase()} lease at{" "}
                {lease.property.address}, {lease.property.suburb} has been analysed
                from the perspective of {lease.client.businessName} (
                {isLandlord ? "Landlord" : "Tenant"}). The analysis identified{" "}
                {recommendations.length} recommendations with a total estimated
                annual impact of {formatCurrency(analysis.totalEstimatedAnnualImpact)}.
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs text-muted-foreground uppercase">
                {isLandlord ? "Landlord" : "Tenant"} Score
              </p>
              <p className="text-4xl font-bold text-navy-900">{clientScore}</p>
              <p className="text-xs text-muted-foreground">/100</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Score Gauge */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="space-y-3">
            <div className="flex justify-between text-xs font-medium">
              <span className="text-red-600">Landlord-Friendly</span>
              <span className="text-amber-600">Balanced</span>
              <span className="text-green-600">Tenant-Friendly</span>
            </div>
            <div className="relative h-8 rounded-full bg-gradient-to-r from-red-200 via-amber-200 to-green-200">
              <div
                className="absolute top-0 h-8 w-2 rounded-full bg-navy-900 shadow-lg"
                style={{
                  left: `${analysis.overallTenantScore}%`,
                  transform: "translateX(-50%)",
                }}
              />
            </div>
            <div className="flex justify-between text-sm">
              <span>
                <span className="font-semibold">{analysis.overallLandlordScore}%</span>{" "}
                Landlord
              </span>
              <span>
                <span className="font-semibold">{analysis.overallTenantScore}%</span>{" "}
                Tenant
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Risk Flags */}
      {riskFlags.length > 0 && (
        <div className="space-y-3 mb-6">
          {riskFlags.map((flag, i) => (
            <Alert
              key={i}
              variant={flag.severity === "HIGH" ? "destructive" : "default"}
              className={
                flag.severity === "MEDIUM"
                  ? "border-amber-500 text-amber-900 bg-amber-50"
                  : undefined
              }
            >
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>{flag.flag}</AlertTitle>
              <AlertDescription>{flag.detail}</AlertDescription>
            </Alert>
          ))}
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Clause Analysis */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Clause-by-Clause Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {clauses.map((clause, i) => (
                  <div key={i} className="border rounded-lg p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-navy-900">
                        {clause.clauseName}
                      </h4>
                      <Badge className={ratingColor(clause.rating)}>
                        {ratingLabel(clause.rating)}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {clause.explanation}
                    </p>
                    {clause.recommendation && (
                      <div className="bg-navy-50 rounded p-3">
                        <p className="text-xs font-medium text-navy-600 uppercase mb-1">
                          Recommendation
                        </p>
                        <p className="text-sm">{clause.recommendation}</p>
                      </div>
                    )}
                    {clause.estimatedImpactPA > 0 && (
                      <p className="text-sm font-medium text-navy-700">
                        Est. annual impact: {formatCurrency(clause.estimatedImpactPA)}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Retail Leases Act Issues */}
          {retailIssues.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-amber-500" />
                  Retail Leases Act 2003 (Vic) Issues
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {retailIssues.map((issue, i) => (
                    <div key={i} className="border-l-4 border-amber-400 bg-amber-50 p-4 rounded-r">
                      <p className="text-xs font-medium text-amber-700">{issue.section}</p>
                      <p className="font-medium text-sm mt-1">{issue.issue}</p>
                      <p className="text-sm text-muted-foreground mt-1">{issue.detail}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right column: Recommendations + Market Context */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">
                Top Recommendations
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Total estimated impact:{" "}
                <span className="font-bold text-navy-900">
                  {formatCurrency(analysis.totalEstimatedAnnualImpact)}/yr
                </span>
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recommendations.map((rec, i) => (
                  <div key={i} className="border rounded-lg p-3 space-y-1">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-medium">{rec.title}</h4>
                      <Badge
                        variant="outline"
                        className={
                          rec.priority === "HIGH"
                            ? "border-red-500 text-red-700"
                            : rec.priority === "MEDIUM"
                            ? "border-amber-500 text-amber-700"
                            : "border-gray-400 text-gray-600"
                        }
                      >
                        {rec.priority}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {rec.description}
                    </p>
                    {rec.estimatedAnnualImpact > 0 && (
                      <p className="text-sm font-semibold text-green-700">
                        +{formatCurrency(rec.estimatedAnnualImpact)}/yr
                      </p>
                    )}
                  </div>
                ))}
                {recommendations.length === 0 && (
                  <p className="text-sm text-muted-foreground">
                    No specific recommendations — lease terms are generally favourable.
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {benchmarks && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Market Context</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-xs text-muted-foreground uppercase mb-2">
                    Rent Comparison ($/sqm)
                  </p>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Market Low</span>
                      <span>${benchmarks.rentPSQM.low}/sqm</span>
                    </div>
                    <div className="relative h-4 rounded-full bg-gray-200">
                      <div
                        className="absolute top-0 h-4 rounded-full bg-navy-300"
                        style={{
                          left: "0%",
                          width: `${Math.min(100, ((benchmarks.rentPSQM.median - benchmarks.rentPSQM.low) / (benchmarks.rentPSQM.high - benchmarks.rentPSQM.low)) * 100)}%`,
                        }}
                      />
                      {lease.baseRentPSQM && (
                        <div
                          className="absolute top-0 h-4 w-1.5 rounded-full bg-navy-900"
                          style={{
                            left: `${Math.min(100, Math.max(0, ((lease.baseRentPSQM - benchmarks.rentPSQM.low) / (benchmarks.rentPSQM.high - benchmarks.rentPSQM.low)) * 100))}%`,
                          }}
                        />
                      )}
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Market High</span>
                      <span>${benchmarks.rentPSQM.high}/sqm</span>
                    </div>
                    <div className="flex justify-between text-sm font-medium">
                      <span>This Lease</span>
                      <span>${lease.baseRentPSQM?.toFixed(0) ?? "—"}/sqm</span>
                    </div>
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>Market Median</span>
                      <span>${benchmarks.rentPSQM.median}/sqm</span>
                    </div>
                  </div>
                </div>

                <div className="border-t pt-3 space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Typical Incentive</span>
                    <span>{benchmarks.typicalIncentive}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Typical Review</span>
                    <span>{benchmarks.typicalReview}</span>
                  </div>
                </div>

                {comparables.length > 0 && (
                  <div className="border-t pt-3">
                    <p className="text-xs text-muted-foreground uppercase mb-2">
                      Comparable Leases
                    </p>
                    <div className="space-y-2">
                      {comparables.slice(0, 4).map((comp, i) => (
                        <div key={i} className="text-xs border rounded p-2">
                          <p className="font-medium">{comp.address}, {comp.suburb}</p>
                          <p className="text-muted-foreground">
                            {comp.nla} sqm &middot; ${comp.rentPSQM}/sqm &middot;{" "}
                            {comp.leaseTerm} &middot; {comp.reviewType}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Disclaimer */}
      <div className="mt-8 rounded-lg border bg-gray-50 p-4">
        <p className="text-xs text-muted-foreground">
          <strong>Disclaimer:</strong> This report is advisory in nature and does
          not constitute legal advice. Ben Palmieri Consulting recommends seeking
          independent legal advice before acting on any recommendations. Analysis
          performed using {analysis.aiModel === "mock" ? "rule-based" : "AI"} engine.
        </p>
      </div>
    </div>
  );
}
