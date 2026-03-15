import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, FileText, DollarSign, TrendingUp } from "lucide-react";
import { formatCurrency } from "@/lib/formatters";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const [clients, leases, analyses] = await Promise.all([
    prisma.client.findMany(),
    prisma.lease.findMany({ include: { property: true, client: true } }),
    prisma.leaseAnalysis.findMany(),
  ]);

  const totalAnnualRent = leases.reduce((sum, l) => sum + l.baseRentPA, 0);
  const totalValueAdd = analyses.reduce(
    (sum, a) => sum + a.totalEstimatedAnnualImpact,
    0
  );

  const stats = [
    {
      title: "Total Clients",
      value: clients.length.toString(),
      icon: Users,
      href: "/clients",
    },
    {
      title: "Total Leases",
      value: leases.length.toString(),
      icon: FileText,
      href: "/leases",
    },
    {
      title: "Annual Rent Under Advisory",
      value: formatCurrency(totalAnnualRent),
      icon: DollarSign,
      href: "/leases",
    },
    {
      title: "Value-Add Identified",
      value: formatCurrency(totalValueAdd),
      icon: TrendingUp,
      href: "/portfolio",
    },
  ];

  return (
    <div>
      <PageHeader
        title="Dashboard"
        description="Overview of your lease advisory practice"
      />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Link key={stat.title} href={stat.href}>
            <Card className="hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <stat.icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-navy-900">
                  {stat.value}
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Recent Clients</CardTitle>
          </CardHeader>
          <CardContent>
            {clients.length === 0 ? (
              <p className="text-sm text-muted-foreground">No clients yet</p>
            ) : (
              <div className="space-y-3">
                {clients.slice(0, 5).map((client) => (
                  <Link
                    key={client.id}
                    href={`/clients/${client.id}`}
                    className="flex items-center justify-between rounded-lg border p-3 hover:bg-accent transition-colors"
                  >
                    <div>
                      <p className="font-medium text-navy-900">
                        {client.businessName}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {client.clientType === "LANDLORD"
                          ? "Landlord"
                          : "Tenant"}{" "}
                        &middot; {client.contactPerson}
                      </p>
                    </div>
                    <span className="text-xs font-medium text-navy-600">
                      {client.status}
                    </span>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Recent Leases</CardTitle>
          </CardHeader>
          <CardContent>
            {leases.length === 0 ? (
              <p className="text-sm text-muted-foreground">No leases yet</p>
            ) : (
              <div className="space-y-3">
                {leases.slice(0, 5).map((lease) => (
                  <Link
                    key={lease.id}
                    href={`/leases/${lease.id}`}
                    className="flex items-center justify-between rounded-lg border p-3 hover:bg-accent transition-colors"
                  >
                    <div>
                      <p className="font-medium text-navy-900">
                        {lease.leaseName}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {lease.property.address}, {lease.property.suburb} &middot;{" "}
                        {formatCurrency(lease.baseRentPA)}/yr
                      </p>
                    </div>
                    <span className="text-xs font-medium text-navy-600">
                      {lease.status}
                    </span>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
