import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";

export default async function ClientsPage() {
  const clients = await prisma.client.findMany({
    include: { leases: true },
    orderBy: { updatedAt: "desc" },
  });

  return (
    <div>
      <PageHeader title="Clients" description="Manage your landlord and tenant clients">
        <Link href="/clients/new">
          <Button className="bg-navy-700 hover:bg-navy-800">
            <Plus className="mr-2 h-4 w-4" />
            Add Client
          </Button>
        </Link>
      </PageHeader>

      {clients.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">No clients yet. Add your first client to get started.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {clients.map((client) => (
            <Link key={client.id} href={`/clients/${client.id}`}>
              <Card className="hover:shadow-md transition-shadow h-full">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-navy-900">
                        {client.businessName}
                      </h3>
                      {client.contactPerson && (
                        <p className="text-sm text-muted-foreground mt-1">
                          {client.contactPerson}
                        </p>
                      )}
                    </div>
                    <Badge
                      variant={
                        client.clientType === "LANDLORD" ? "default" : "secondary"
                      }
                      className={
                        client.clientType === "LANDLORD"
                          ? "bg-navy-700"
                          : "bg-emerald-100 text-emerald-800"
                      }
                    >
                      {client.clientType === "LANDLORD" ? "Landlord" : "Tenant"}
                    </Badge>
                  </div>
                  <div className="mt-4 flex items-center gap-4 text-sm text-muted-foreground">
                    <span>{client.leases.length} lease{client.leases.length !== 1 ? "s" : ""}</span>
                    {client.email && <span>{client.email}</span>}
                  </div>
                  <div className="mt-2">
                    <Badge variant="outline" className="text-xs">
                      {client.status}
                    </Badge>
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
