import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { createClient } from "@/actions/client-actions";

export default function NewClientPage() {
  return (
    <div>
      <PageHeader title="Add New Client" description="Create a new landlord or tenant client" />

      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Client Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={createClient} className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="businessName">Business Name *</Label>
                <Input id="businessName" name="businessName" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contactPerson">Contact Person</Label>
                <Input id="contactPerson" name="contactPerson" />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input id="phone" name="phone" />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="clientType">Client Type *</Label>
                <select
                  id="clientType"
                  name="clientType"
                  required
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                >
                  <option value="">Select type...</option>
                  <option value="LANDLORD">Landlord</option>
                  <option value="TENANT">Tenant</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="abn">ABN</Label>
                <Input id="abn" name="abn" placeholder="XX XXX XXX XXX" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea id="notes" name="notes" rows={3} />
            </div>

            <div className="flex gap-3 pt-4">
              <Button type="submit" className="bg-navy-700 hover:bg-navy-800">
                Create Client
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
