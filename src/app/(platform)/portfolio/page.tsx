import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function PortfolioPage() {
  const clients = await prisma.client.findMany({
    include: { leases: true },
    orderBy: { businessName: "asc" },
  });

  return (
    <div>
      <PageHeader
        title="Portfolio"
        description="Select a client to view their portfolio dashboard"
      />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {clients.map((client) => (
          <Link key={client.id} href={`/portfolio/${client.id}`}>
            <Card className="hover:shadow-md transition-shadow">
              <CardContent className="pt-6">
                <h3 className="font-semibold text-navy-900">{client.businessName}</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  {client.leases.length} lease{client.leases.length !== 1 ? "s" : ""}
                </p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
