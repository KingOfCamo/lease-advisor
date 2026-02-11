import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/formatters";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function LeasesPage() {
  const leases = await prisma.lease.findMany({
    include: { property: true, client: true, analyses: true },
    orderBy: { updatedAt: "desc" },
  });

  return (
    <div>
      <PageHeader title="Leases" description="All commercial leases under advisory">
        <Link href="/leases/new">
          <Button className="bg-navy-700 hover:bg-navy-800">
            <Plus className="mr-2 h-4 w-4" />
            New Lease
          </Button>
        </Link>
      </PageHeader>

      {leases.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">
              No leases yet. Add your first lease to begin analysis.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {leases.map((lease) => (
            <Link key={lease.id} href={`/leases/${lease.id}`}>
              <Card className="hover:shadow-md transition-shadow">
                <CardContent className="py-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-3">
                        <h3 className="font-semibold text-navy-900">
                          {lease.leaseName}
                        </h3>
                        <Badge
                          variant="outline"
                          className={
                            lease.status === "ANALYSED"
                              ? "border-green-500 text-green-700"
                              : lease.status === "REPORTED"
                              ? "border-blue-500 text-blue-700"
                              : ""
                          }
                        >
                          {lease.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {lease.property.address}, {lease.property.suburb}{" "}
                        {lease.property.postcode} &middot;{" "}
                        {lease.property.propertyType} &middot;{" "}
                        {lease.property.nla} sqm
                      </p>
                      <p className="text-xs text-muted-foreground">
                        <span className="font-medium">{lease.client.businessName}</span>
                        {" "}({lease.client.clientType === "LANDLORD" ? "Landlord" : "Tenant"})
                        {" "}&middot;{" "}
                        {formatDate(lease.commencementDate)} &mdash;{" "}
                        {formatDate(lease.expiryDate)}
                      </p>
                    </div>
                    <div className="text-right space-y-1">
                      <p className="text-lg font-semibold text-navy-900">
                        {formatCurrency(lease.baseRentPA)}/yr
                      </p>
                      {lease.baseRentPSQM && (
                        <p className="text-xs text-muted-foreground">
                          ${lease.baseRentPSQM.toFixed(0)}/sqm
                        </p>
                      )}
                      <p className="text-xs text-muted-foreground">
                        {lease.rentReviewMechanism.replace("_", " ")}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
