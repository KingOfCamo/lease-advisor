import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/formatters";
import Link from "next/link";
import { FileText, Download, BarChart3 } from "lucide-react";

export default async function ReportsPage() {
  const analysedLeases = await prisma.lease.findMany({
    where: { analyses: { some: {} } },
    include: { property: true, client: true, analyses: true },
    orderBy: { updatedAt: "desc" },
  });

  const clients = await prisma.client.findMany({
    include: {
      leases: {
        include: { analyses: true },
      },
    },
  });

  const clientsWithAnalyses = clients.filter(
    (c) => c.leases.some((l) => l.analyses.length > 0)
  );

  return (
    <div>
      <PageHeader
        title="Reports"
        description="Generate analysis reports and fee proposals from completed analyses"
      />

      {analysedLeases.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <FileText className="mx-auto h-10 w-10 text-muted-foreground mb-3" />
            <p className="text-muted-foreground">
              No leases have been analysed yet. Go to a lease and click
              &quot;Analyse Lease&quot; to get started.
            </p>
            <Link href="/leases">
              <Button variant="link" className="mt-2">View all leases</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {/* Analysis Reports */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Analysis Reports
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {analysedLeases.map((lease) => {
                  const analysis = lease.analyses[lease.analyses.length - 1];
                  const isLandlord = lease.client.clientType === "LANDLORD";
                  const score = isLandlord
                    ? analysis.overallLandlordScore
                    : analysis.overallTenantScore;

                  return (
                    <div
                      key={lease.id}
                      className="flex items-center justify-between border rounded-lg p-4"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium text-navy-900">
                            {lease.leaseName}
                          </h4>
                          <Badge variant="outline" className="text-xs">
                            Score: {score}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {lease.property.address}, {lease.property.suburb} —{" "}
                          {lease.client.businessName}
                        </p>
                        <p className="text-xs text-green-700 font-medium">
                          Value-add: {formatCurrency(analysis.totalEstimatedAnnualImpact)}/yr
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Link href={`/leases/${lease.id}/analysis`}>
                          <Button variant="outline" size="sm">
                            View Analysis
                          </Button>
                        </Link>
                        <Link href={`/api/leases/${lease.id}/report`}>
                          <Button size="sm" className="bg-navy-700 hover:bg-navy-800">
                            <Download className="mr-1 h-3 w-3" />
                            PDF
                          </Button>
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Fee Proposals */}
          {clientsWithAnalyses.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Fee Proposals
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {clientsWithAnalyses.map((client) => {
                    const leaseCount = client.leases.filter(
                      (l) => l.analyses.length > 0
                    ).length;

                    return (
                      <div
                        key={client.id}
                        className="flex items-center justify-between border rounded-lg p-4"
                      >
                        <div>
                          <h4 className="font-medium text-navy-900">
                            {client.businessName}
                          </h4>
                          <p className="text-xs text-muted-foreground">
                            {leaseCount} analysed lease{leaseCount !== 1 ? "s" : ""} —{" "}
                            {client.clientType === "LANDLORD" ? "Landlord" : "Tenant"}
                          </p>
                        </div>
                        <Link href={`/reports/fee-proposal/${client.id}`}>
                          <Button variant="outline" size="sm">
                            Generate Fee Proposal
                          </Button>
                        </Link>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
