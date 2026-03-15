"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";

interface SettingsData {
  companyName: string;
  tagline: string;
  licenceNumber: string;
  email: string;
  phone: string;
  address: string;
  primaryColor: string;
  disclaimer: string;
  termsOfEngagement: string;
}

export function SettingsForm({ initialData }: { initialData: SettingsData }) {
  const [data, setData] = useState(initialData);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const update = (field: keyof SettingsData, value: string) => {
    setData((prev) => ({ ...prev, [field]: value }));
    setSaved(false);
  };

  const handleSave = async () => {
    setSaving(true);
    await fetch("/api/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    setSaving(false);
    setSaved(true);
  };

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Branding */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Business Branding</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Company Name</Label>
              <Input
                value={data.companyName}
                onChange={(e) => update("companyName", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>Tagline</Label>
              <Input
                value={data.tagline}
                onChange={(e) => update("tagline", e.target.value)}
              />
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Licence Number</Label>
              <Input
                value={data.licenceNumber}
                onChange={(e) => update("licenceNumber", e.target.value)}
                placeholder="e.g. 123456L"
              />
            </div>
            <div className="space-y-2">
              <Label>Primary Colour</Label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={data.primaryColor}
                  onChange={(e) => update("primaryColor", e.target.value)}
                  className="h-9 w-12 cursor-pointer rounded border"
                />
                <Input
                  value={data.primaryColor}
                  onChange={(e) => update("primaryColor", e.target.value)}
                  className="flex-1"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Contact */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Contact Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Email</Label>
              <Input
                type="email"
                value={data.email}
                onChange={(e) => update("email", e.target.value)}
                placeholder="ben@example.com"
              />
            </div>
            <div className="space-y-2">
              <Label>Phone</Label>
              <Input
                value={data.phone}
                onChange={(e) => update("phone", e.target.value)}
                placeholder="0412 345 678"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Address</Label>
            <Input
              value={data.address}
              onChange={(e) => update("address", e.target.value)}
              placeholder="123 Collins St, Melbourne VIC 3000"
            />
          </div>
        </CardContent>
      </Card>

      {/* Legal */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Disclaimer & Terms</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Report Disclaimer</Label>
            <textarea
              className="w-full min-h-[100px] rounded-md border border-input bg-background px-3 py-2 text-sm"
              value={data.disclaimer}
              onChange={(e) => update("disclaimer", e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              This disclaimer appears on all generated PDF reports.
            </p>
          </div>
          <div className="space-y-2">
            <Label>Terms of Engagement</Label>
            <textarea
              className="w-full min-h-[100px] rounded-md border border-input bg-background px-3 py-2 text-sm"
              value={data.termsOfEngagement}
              onChange={(e) => update("termsOfEngagement", e.target.value)}
            />
            <p className="text-xs text-muted-foreground">
              Included in fee proposals and engagement letters.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Save */}
      <div className="flex items-center gap-3">
        <Button
          onClick={handleSave}
          disabled={saving}
          className="bg-navy-700 hover:bg-navy-800"
        >
          <Save className="mr-2 h-4 w-4" />
          {saving ? "Saving..." : "Save Settings"}
        </Button>
        {saved && (
          <p className="text-sm text-green-700 font-medium">Settings saved.</p>
        )}
      </div>
    </div>
  );
}
