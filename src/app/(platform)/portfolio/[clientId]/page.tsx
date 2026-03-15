import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatCurrency, formatDate } from "@/lib/formatters";
import Link from "next/link";
import { Plus, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { PortfolioCharts } from "@/components/portfolio/portfolio-charts";
import { format } from "date-fns";

export const dynamic = "force-dynamic";

interface Recommendation {
  title: string;
  description: string;
  estimatedAnnualImpact: number;
  priority: string;
}

function DeltaArrow({ current, previous }: { current: number; previous: number }) {
  const diff = current - previous;
  if (Math.abs(diff) < 0.5) return <Minus className="h-4 w-4 text-gray-400" />;
  if (diff > 0) return <TrendingUp className="h-4 w-4 text-green-600" />;
  return <TrendingDown className="h-4 w-4 text-red-600" />;
}

export default async function PortfolioPage({
  params,
}: {
  params: { clientId: string };
}) {
  const client = await prisma.client.findUnique({
    where: { id: params.clientId },
    include: {
      leases: {
        include: { property: true, analyses: true },
        orderBy: { baseRentPA: "desc" },
      },
      snapshots: {
        orderBy: { snapshotDate: "asc" },
      },
    },
  });

  if (!client) notFound();

  const isLandlord = client.clientType === "LANDLORD";
  const totalRent = client.leases.reduce((s, l) => s + l.baseRentPA, 0);
  const analysedLeases = client.leases.filter((l) => l.analyses.length > 0);
  const totalValueAdd = analysedLeases.reduce((s, l) => {
    const a = l.analyses[l.analyses.length - 1];
    return s + a.totalEstimatedAnnualImpact;
  }, 0);

  const now = new Date();
  const in12Months = new Date(now.getFullYear() + 1, now.getMonth(), now.getDate());
  const expiringLeases = client.leases.filter(
    (l) => l.expiryDate <= in12Months
  );

  const avgScore =
    analysedLeases.length > 0
      ? Math.round(
          analysedLeases.reduce((s, l) => {
            const a = l.analyses[l.analyses.length - 1];
            return s + (isLandlord ? a.overallLandlordScore : a.overallTenantScore);
          }, 0) / analysedLeases.length
        )
      : 0;

  // Prepare chart data
  const leaseScoreData = analysedLeases.map((l) => {
    const a = l.analyses[l.analyses.length - 1];
    return {
      name: l.leaseName,
      score: isLandlord ? a.overallLandlordScore : a.overallTenantScore,
      rent: l.baseRentPA,
    };
  });

  const reviewBreakdown = client.leases.reduce(
    (acc, l) => {
      const key = l.rentReviewMechanism;
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );
  const reviewData = Object.entries(reviewBreakdown).map(([name, value]) => ({
    name: name.replace(/_/g, " "),
    value,
  }));

  const expiryData = client.leases.map((l) => ({
    name: l.leaseName,
    expiry: l.expiryDate.toISOString(),
    rent: l.baseRentPA,
  }));

  const valueAddData = analysedLeases.flatMap((l) => {
    const a = l.analyses[l.analyses.length - 1];
    const recs: Recommendation[] = JSON.parse(a.topRecommendations);
    return recs.map((r) => ({
      lease: l.leaseName,
      title: r.title,
      impact: r.estimatedAnnualImpact,
    }));
  }).sort((a, b) => b.impact - a.impact).slice(0, 10);

  // Snapshot data for trend charts
  const snapshotData = client.snapshots.map((s) => ({
    date: format(s.snapshotDate, "dd/MM/yy"),
    avgScore: s.avgScore,
    totalValueAdd: s.totalValueAdd,
    leaseCount: s.leaseCount,
    totalRentPA: s.totalRentPA,
  }));

  const firstSnapshot = client.snapshots.length > 0 ? client.snapshots[0] : null;
  const latestSnapshot = client.snapshots.length > 1 ? client.snapshots[client.snapshots.length - 1] : null;

  return (
    <div>
      <PageHeader title={`Portfolio: ${client.businessName}`}>
        <Link href={`/leases/new?clientId=${client.id}`}>
          <Button className="bg-navy-700 hover:bg-navy-800">
            <Plus className="mr-2 h-4 w-4" />
            Add Lease
          </Button>
        </Link>
      </PageHeader>

      {/* Progress Card — Before vs After */}
      {firstSnapshot && latestSnapshot && (
        <Card className="mb-6 border-navy-200 bg-gradient-to-r from-navy-50 to-white">
          <CardHeader>
            <CardTitle className="text-lg">Your Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[
                {
                  label: "Avg Score",
                  first: firstSnapshot.avgScore,
                  current: latestSnapshot.avgScore,
                  format: (v: number) => `${Math.round(v)}/100`,
                },
                {
                  label: "Annual Rent",
                  first: firstSnapshot.totalRentPA,
                  current: latestSnapshot.totalRentPA,
                  format: (v: number) => formatCurrency(v),
                },
                {
                  label: "Value-Add Identified",
                  first: firstSnapshot.totalValueAdd,
                  current: latestSnapshot.totalValueAdd,
                  format: (v: number) => `${formatCurrency(v)}/yr`,
                },
                {
                  label: "Leases Managed",
                  first: firstSnapshot.leaseCount,
                  current: latestSnapshot.leaseCount,
                  format: (v: number) => `${v}`,
                },
              ].map((metric) => (
                <div key={metric.label} className="rounded-lg bg-white p-4 border border-gray-100">
                  <p className="text-xs text-muted-foreground uppercase">{metric.label}</p>
                  <div className="mt-1 flex items-center gap-2">
                    <p className="text-xl font-bold text-navy-900">{metric.format(metric.current)}</p>
                    <DeltaArrow current={metric.current} previous={metric.first} />
                  </div>
                  <p className="mt-1 text-xs text-gray-400">
                    First engagement: {metric.format(metric.first)}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5 mb-6">
        <Card>
          <CardContent className="pt-6">
            <p className="text-xs text-muted-foreground uppercase">Total Leases</p>
            <p className="text-2xl font-bold text-navy-900">{client.leases.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-xs text-muted-foreground uppercase">Annual Rent</p>
            <p className="text-2xl font-bold text-navy-900">{formatCurrency(totalRent)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-xs text-muted-foreground uppercase">Avg Score</p>
            <p className="text-2xl font-bold text-navy-900">{avgScore}/100</p>
          </CardContent>
        </Card>
        <Card className="bg-green-50 border-green-200">
          <CardContent className="pt-6">
            <p className="text-xs text-green-700 uppercase">Est. Value-Add</p>
            <p className="text-2xl font-bold text-green-800">{formatCurrency(totalValueAdd)}/yr</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-xs text-muted-foreground uppercase">Expiring &lt;12m</p>
            <p className="text-2xl font-bold text-navy-900">{expiringLeases.length}</p>
          </CardContent>
        </Card>
      </div>

      {/* Health Table */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg">Lease Portfolio Health</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left">
                  <th className="pb-2 font-medium">Property</th>
                  <th className="pb-2 font-medium">Annual Rent</th>
                  <th className="pb-2 font-medium">$/sqm</th>
                  <th className="pb-2 font-medium">Review</th>
                  <th className="pb-2 font-medium">Managing Agent</th>
                  <th className="pb-2 font-medium">Expiry</th>
                  <th className="pb-2 font-medium">Score</th>
                  <th className="pb-2 font-medium">Value-Add</th>
                </tr>
              </thead>
              <tbody>
                {client.leases.map((lease) => {
                  const analysis = lease.analyses.length > 0 ? lease.analyses[lease.analyses.length - 1] : null;
                  const score = analysis
                    ? isLandlord ? analysis.overallLandlordScore : analysis.overallTenantScore
                    : null;
                  const scoreColor = score === null ? "" : score < 35 ? "text-red-700 bg-red-50" : score < 65 ? "text-amber-700 bg-amber-50" : "text-green-700 bg-green-50";

                  return (
                    <tr key={lease.id} className="border-b hover:bg-gray-50">
                      <td className="py-3">
                        <Link href={`/leases/${lease.id}`} className="text-navy-700 hover:underline font-medium">
                          {lease.property.address}, {lease.property.suburb}
                        </Link>
                        <p className="text-xs text-muted-foreground">{lease.tenantName}</p>
                      </td>
                      <td className="py-3 font-medium">{formatCurrency(lease.baseRentPA)}</td>
                      <td className="py-3">${lease.baseRentPSQM?.toFixed(0) ?? "—"}</td>
                      <td className="py-3">
                        <Badge variant="outline" className="text-xs">
                          {lease.rentReviewMechanism.replace(/_/g, " ")}
                        </Badge>
                      </td>
                      <td className="py-3 text-xs text-gray-500">
                        {lease.managingAgentCompany || lease.managingAgentName || "—"}
                      </td>
                      <td className="py-3">{formatDate(lease.expiryDate)}</td>
                      <td className="py-3">
                        {score !== null ? (
                          <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${scoreColor}`}>
                            {score}
                          </span>
                        ) : (
                          <span className="text-xs text-muted-foreground">—</span>
                        )}
                      </td>
                      <td className="py-3">
                        {analysis ? (
                          <span className="text-green-700 font-medium">
                            {formatCurrency(analysis.totalEstimatedAnnualImpact)}
                          </span>
                        ) : (
                          <Link href={`/leases/${lease.id}`} className="text-xs text-navy-600 underline">
                            Analyse
                          </Link>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Charts */}
      <PortfolioCharts
        leaseScoreData={leaseScoreData}
        reviewData={reviewData}
        expiryData={expiryData}
        valueAddData={valueAddData}
        snapshotData={snapshotData}
      />

      {/* Critical Dates */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="text-lg">Critical Dates</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {client.leases
              .sort((a, b) => a.expiryDate.getTime() - b.expiryDate.getTime())
              .map((lease) => {
                const monthsLeft = Math.round(
                  (lease.expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24 * 30.44)
                );
                const urgency = monthsLeft < 6 ? "border-red-400 bg-red-50" : monthsLeft < 12 ? "border-amber-400 bg-amber-50" : "border-gray-200";

                return (
                  <div key={lease.id} className={`flex items-center justify-between border-l-4 p-3 rounded-r ${urgency}`}>
                    <div>
                      <p className="font-medium text-sm">{lease.leaseName}</p>
                      <p className="text-xs text-muted-foreground">
                        {lease.property.address}, {lease.property.suburb}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">
                        Expires {formatDate(lease.expiryDate)}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {monthsLeft > 0 ? `${monthsLeft} months` : "Expired"}
                      </p>
                    </div>
                  </div>
                );
              })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
