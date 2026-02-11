import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileText, BarChart3, Plus } from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/formatters";
import Link from "next/link";

export default async function ClientDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const client = await prisma.client.findUnique({
    where: { id: params.id },
    include: {
      leases: {
        include: { property: true, analyses: true },
        orderBy: { updatedAt: "desc" },
      },
    },
  });

  if (!client) notFound();

  const totalAnnualRent = client.leases.reduce(
    (sum, l) => sum + l.baseRentPA,
    0
  );

  return (
    <div>
      <PageHeader title={client.businessName}>
        <Link href={`/portfolio/${client.id}`}>
          <Button variant="outline">
            <BarChart3 className="mr-2 h-4 w-4" />
            Portfolio
          </Button>
        </Link>
        <Link href={`/leases/new?clientId=${client.id}`}>
          <Button className="bg-navy-700 hover:bg-navy-800">
            <Plus className="mr-2 h-4 w-4" />
            Add Lease
          </Button>
        </Link>
      </PageHeader>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-lg">Client Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-2">
              <Badge
                className={
                  client.clientType === "LANDLORD"
                    ? "bg-navy-700"
                    : "bg-emerald-100 text-emerald-800"
                }
              >
                {client.clientType === "LANDLORD" ? "Landlord" : "Tenant"}
              </Badge>
              <Badge variant="outline">{client.status}</Badge>
            </div>
            {client.contactPerson && (
              <div>
                <p className="text-xs text-muted-foreground">Contact</p>
                <p className="text-sm">{client.contactPerson}</p>
              </div>
            )}
            {client.email && (
              <div>
                <p className="text-xs text-muted-foreground">Email</p>
                <p className="text-sm">{client.email}</p>
              </div>
            )}
            {client.phone && (
              <div>
                <p className="text-xs text-muted-foreground">Phone</p>
                <p className="text-sm">{client.phone}</p>
              </div>
            )}
            {client.abn && (
              <div>
                <p className="text-xs text-muted-foreground">ABN</p>
                <p className="text-sm">{client.abn}</p>
              </div>
            )}
            {client.notes && (
              <div>
                <p className="text-xs text-muted-foreground">Notes</p>
                <p className="text-sm">{client.notes}</p>
              </div>
            )}
            <div className="pt-2 border-t">
              <p className="text-xs text-muted-foreground">Total Annual Rent</p>
              <p className="text-lg font-semibold text-navy-900">
                {formatCurrency(totalAnnualRent)}
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">
                Leases ({client.leases.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {client.leases.length === 0 ? (
                <p className="text-sm text-muted-foreground py-4">
                  No leases yet.{" "}
                  <Link
                    href={`/leases/new?clientId=${client.id}`}
                    className="text-navy-700 underline"
                  >
                    Add the first lease
                  </Link>
                </p>
              ) : (
                <div className="space-y-3">
                  {client.leases.map((lease) => (
                    <Link
                      key={lease.id}
                      href={`/leases/${lease.id}`}
                      className="flex items-center justify-between rounded-lg border p-4 hover:bg-accent transition-colors"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-navy-500" />
                          <p className="font-medium text-navy-900">
                            {lease.leaseName}
                          </p>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {lease.property.address}, {lease.property.suburb}{" "}
                          &middot; {lease.property.propertyType} &middot;{" "}
                          {lease.property.nla} sqm
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {formatDate(lease.commencementDate)} &mdash;{" "}
                          {formatDate(lease.expiryDate)}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-navy-900">
                          {formatCurrency(lease.baseRentPA)}/yr
                        </p>
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
                    </Link>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
