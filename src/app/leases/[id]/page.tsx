import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatCurrency, formatDate, formatArea } from "@/lib/formatters";
import Link from "next/link";
import { BarChart3 } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function LeaseDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const lease = await prisma.lease.findUnique({
    where: { id: params.id },
    include: { property: true, client: true, analyses: true },
  });

  if (!lease) notFound();

  const latestAnalysis = lease.analyses.length > 0 ? lease.analyses[lease.analyses.length - 1] : null;

  const outgoings = lease.outgoingsDetail
    ? JSON.parse(lease.outgoingsDetail)
    : null;
  const options = lease.optionsToRenew
    ? JSON.parse(lease.optionsToRenew)
    : null;

  return (
    <div>
      <PageHeader title={lease.leaseName}>
        {latestAnalysis ? (
          <Link href={`/leases/${lease.id}/analysis`}>
            <Button variant="outline">
              <BarChart3 className="mr-2 h-4 w-4" />
              View Analysis
            </Button>
          </Link>
        ) : (
          <form action={`/api/leases/${lease.id}/analyze`} method="POST">
            <Button type="submit" className="bg-navy-700 hover:bg-navy-800">
              <BarChart3 className="mr-2 h-4 w-4" />
              Analyse Lease
            </Button>
          </form>
        )}
      </PageHeader>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left column: Property & Client info */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Property</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <p className="font-medium">{lease.property.address}</p>
              <p>
                {lease.property.suburb}, {lease.property.state}{" "}
                {lease.property.postcode}
              </p>
              <div className="flex gap-2 pt-1">
                <Badge variant="outline">{lease.property.propertyType}</Badge>
                {lease.property.propertyGrade && (
                  <Badge variant="outline">
                    Grade {lease.property.propertyGrade}
                  </Badge>
                )}
                {lease.property.isRetailLease && (
                  <Badge className="bg-amber-100 text-amber-800">
                    Retail Lease
                  </Badge>
                )}
              </div>
              <p className="text-muted-foreground">
                NLA: {formatArea(lease.property.nla)}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Parties</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div>
                <p className="text-xs text-muted-foreground">Client</p>
                <Link
                  href={`/clients/${lease.client.id}`}
                  className="font-medium text-navy-700 hover:underline"
                >
                  {lease.client.businessName}
                </Link>
                <Badge variant="outline" className="ml-2 text-xs">
                  {lease.client.clientType === "LANDLORD" ? "Landlord" : "Tenant"}
                </Badge>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Landlord</p>
                <p>{lease.landlordName}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Tenant</p>
                <p>{lease.tenantName}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Middle column: Lease terms */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Lease Term</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <p className="text-xs text-muted-foreground">Commencement</p>
                  <p>{formatDate(lease.commencementDate)}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Expiry</p>
                  <p>{formatDate(lease.expiryDate)}</p>
                </div>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Total Term</p>
                <p>{lease.totalTermMonths} months</p>
              </div>
              {options && options.length > 0 && (
                <div>
                  <p className="text-xs text-muted-foreground">Options to Renew</p>
                  {options.map((opt: { termMonths: number; conditions: string }, i: number) => (
                    <p key={i} className="text-sm">
                      {opt.termMonths} months — {opt.conditions}
                    </p>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Rent & Reviews</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <p className="text-xs text-muted-foreground">Base Rent PA</p>
                  <p className="text-lg font-semibold text-navy-900">
                    {formatCurrency(lease.baseRentPA)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Rent per sqm</p>
                  <p className="text-lg font-semibold text-navy-900">
                    ${lease.baseRentPSQM?.toFixed(0) ?? "—"}/sqm
                  </p>
                </div>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Review Mechanism</p>
                <p>{lease.rentReviewMechanism.replace(/_/g, " ")}</p>
              </div>
              {lease.rentReviewDetail && (
                <div>
                  <p className="text-xs text-muted-foreground">Review Detail</p>
                  <p>{lease.rentReviewDetail}</p>
                </div>
              )}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <p className="text-xs text-muted-foreground">Review Frequency</p>
                  <p>{lease.rentReviewFrequencyMonths} months</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Ratchet Clause</p>
                  <p>{lease.hasRatchetClause ? "Yes" : "No"}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right column: Financial & clauses */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Outgoings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div>
                <p className="text-xs text-muted-foreground">Structure</p>
                <Badge variant="outline">
                  {lease.outgoingsStructure.replace("_", " ")}
                </Badge>
              </div>
              {lease.outgoingsEstimatePA && (
                <div>
                  <p className="text-xs text-muted-foreground">
                    Est. Outgoings PA
                  </p>
                  <p className="font-semibold">
                    {formatCurrency(lease.outgoingsEstimatePA)}
                  </p>
                </div>
              )}
              {outgoings && (
                <div className="space-y-1 pt-2 border-t">
                  {Object.entries(outgoings).map(([key, value]) => (
                    <div key={key} className="flex justify-between">
                      <span className="text-muted-foreground capitalize">
                        {key.replace(/([A-Z])/g, " $1").trim()}
                      </span>
                      <span>{formatCurrency(value as number)}</span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Security</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              {lease.bondAmount && (
                <div>
                  <p className="text-xs text-muted-foreground">Bond Amount</p>
                  <p className="font-semibold">
                    {formatCurrency(lease.bondAmount)}
                  </p>
                </div>
              )}
              {lease.bondType && (
                <div>
                  <p className="text-xs text-muted-foreground">Bond Type</p>
                  <p>{lease.bondType.replace(/_/g, " ")}</p>
                </div>
              )}
              {lease.bondReductionTerms && (
                <div>
                  <p className="text-xs text-muted-foreground">Bond Reduction</p>
                  <p>{lease.bondReductionTerms}</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Key Clauses</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              {lease.permittedUse && (
                <div>
                  <p className="text-xs text-muted-foreground">Permitted Use</p>
                  <p>{lease.permittedUse}</p>
                </div>
              )}
              {lease.makeGoodObligations && (
                <div>
                  <p className="text-xs text-muted-foreground">Make Good</p>
                  <p>{lease.makeGoodObligations}</p>
                </div>
              )}
              {lease.assignmentRights && (
                <div>
                  <p className="text-xs text-muted-foreground">Assignment</p>
                  <p>{lease.assignmentRights}</p>
                </div>
              )}
              {lease.sublettingRights && (
                <div>
                  <p className="text-xs text-muted-foreground">Subletting</p>
                  <p>{lease.sublettingRights}</p>
                </div>
              )}
              <div className="grid grid-cols-3 gap-2 pt-2 border-t">
                <div className="text-center">
                  <p className="text-xs text-muted-foreground">Demolition</p>
                  <p>{lease.demolitionClause ? "Yes" : "No"}</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-muted-foreground">Relocation</p>
                  <p>{lease.relocationClause ? "Yes" : "No"}</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-muted-foreground">First Refusal</p>
                  <p>{lease.firstRightOfRefusal ? "Yes" : "No"}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
