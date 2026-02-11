"use client";

import { useWizard } from "../wizard-context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

interface ClientOption {
  id: string;
  businessName: string;
  clientType: string;
}

export function StepClient() {
  const { state, updateData, nextStep } = useWizard();
  const [clients, setClients] = useState<ClientOption[]>([]);

  useEffect(() => {
    fetch("/api/clients")
      .then((r) => r.json())
      .then(setClients);
  }, []);

  const handleNext = () => {
    if (!state.data.clientId && !state.data.createNewClient) return;
    if (state.data.createNewClient && !state.data.newClientName) return;
    nextStep();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Step 1: Select Client</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>Existing Client</Label>
          <select
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            value={state.data.clientId}
            onChange={(e) =>
              updateData({
                clientId: e.target.value,
                createNewClient: false,
              })
            }
            disabled={state.data.createNewClient}
          >
            <option value="">Select a client...</option>
            {clients.map((c) => (
              <option key={c.id} value={c.id}>
                {c.businessName} ({c.clientType === "LANDLORD" ? "Landlord" : "Tenant"})
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <div className="flex-1 border-t" />
          <span>or</span>
          <div className="flex-1 border-t" />
        </div>

        <div className="space-y-3">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={state.data.createNewClient}
              onChange={(e) =>
                updateData({
                  createNewClient: e.target.checked,
                  clientId: e.target.checked ? "" : state.data.clientId,
                })
              }
              className="rounded"
            />
            <span className="text-sm font-medium">Create new client</span>
          </label>

          {state.data.createNewClient && (
            <div className="grid gap-3 md:grid-cols-2 pl-6">
              <div className="space-y-1">
                <Label>Business Name *</Label>
                <Input
                  value={state.data.newClientName}
                  onChange={(e) => updateData({ newClientName: e.target.value })}
                />
              </div>
              <div className="space-y-1">
                <Label>Client Type *</Label>
                <select
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={state.data.newClientType}
                  onChange={(e) =>
                    updateData({ newClientType: e.target.value })
                  }
                >
                  <option value="">Select...</option>
                  <option value="LANDLORD">Landlord</option>
                  <option value="TENANT">Tenant</option>
                </select>
              </div>
              <div className="space-y-1">
                <Label>Email</Label>
                <Input
                  type="email"
                  value={state.data.newClientEmail}
                  onChange={(e) =>
                    updateData({ newClientEmail: e.target.value })
                  }
                />
              </div>
              <div className="space-y-1">
                <Label>Phone</Label>
                <Input
                  value={state.data.newClientPhone}
                  onChange={(e) =>
                    updateData({ newClientPhone: e.target.value })
                  }
                />
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-end pt-4">
          <Button
            onClick={handleNext}
            className="bg-navy-700 hover:bg-navy-800"
          >
            Next: Property Details
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
