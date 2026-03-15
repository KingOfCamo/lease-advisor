"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { CheckCircle2, Loader2 } from "lucide-react";

const SERVICE_OPTIONS = [
  { value: "", label: "Select a service..." },
  { value: "LEASE_REVIEW", label: "Lease Review & Analysis" },
  { value: "TENANT_REP", label: "Tenant Representation" },
  { value: "LANDLORD_REP", label: "Landlord Advisory" },
  { value: "OTHER", label: "Other / General Enquiry" },
];

export function ContactForm() {
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");
    setErrorMessage("");

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      phone: formData.get("phone") as string,
      company: formData.get("company") as string,
      service: formData.get("service") as string,
      message: formData.get("message") as string,
    };

    try {
      const res = await fetch("/api/enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Something went wrong");
      }

      setStatus("success");
    } catch (err) {
      setStatus("error");
      setErrorMessage(err instanceof Error ? err.message : "Failed to send enquiry");
    }
  }

  if (status === "success") {
    return (
      <div className="rounded-xl border border-green-200 bg-green-50 p-8 text-center">
        <CheckCircle2 className="mx-auto mb-3 h-10 w-10 text-green-600" />
        <h3 className="text-lg font-semibold text-green-900">Enquiry Sent</h3>
        <p className="mt-1 text-sm text-green-700">
          Thank you for your enquiry. Ben will be in touch shortly.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="name">Full Name *</Label>
          <Input id="name" name="name" required placeholder="Your name" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="email">Email *</Label>
          <Input id="email" name="email" type="email" required placeholder="you@example.com" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="phone">Phone</Label>
          <Input id="phone" name="phone" type="tel" placeholder="04XX XXX XXX" />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="company">Company</Label>
          <Input id="company" name="company" placeholder="Your business name" />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="service">Service Interest</Label>
        <select
          id="service"
          name="service"
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          {SERVICE_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="message">Message *</Label>
        <Textarea
          id="message"
          name="message"
          required
          rows={5}
          placeholder="Tell us about your lease or how we can help..."
        />
      </div>

      {status === "error" && (
        <p className="text-sm text-red-600">{errorMessage}</p>
      )}

      <Button type="submit" disabled={status === "submitting"} className="w-full bg-navy-900 hover:bg-navy-800">
        {status === "submitting" ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Sending...
          </>
        ) : (
          "Send Enquiry"
        )}
      </Button>
    </form>
  );
}
