"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { CheckCircle2, Eye, Archive, Loader2 } from "lucide-react";

const STATUS_TRANSITIONS: Record<string, { label: string; next: string; icon: typeof Eye }[]> = {
  NEW: [
    { label: "Mark as Read", next: "READ", icon: Eye },
    { label: "Mark as Replied", next: "REPLIED", icon: CheckCircle2 },
  ],
  READ: [
    { label: "Mark as Replied", next: "REPLIED", icon: CheckCircle2 },
    { label: "Archive", next: "ARCHIVED", icon: Archive },
  ],
  REPLIED: [
    { label: "Archive", next: "ARCHIVED", icon: Archive },
  ],
  ARCHIVED: [
    { label: "Reopen", next: "NEW", icon: Eye },
  ],
};

export function EnquiryActions({
  enquiryId,
  currentStatus,
  currentNotes,
}: {
  enquiryId: string;
  currentStatus: string;
  currentNotes: string;
}) {
  const router = useRouter();
  const [notes, setNotes] = useState(currentNotes);
  const [saving, setSaving] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);

  async function updateStatus(newStatus: string) {
    setUpdatingStatus(newStatus);
    try {
      await fetch(`/api/enquiries/${enquiryId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      router.refresh();
    } finally {
      setUpdatingStatus(null);
    }
  }

  async function saveNotes() {
    setSaving(true);
    try {
      await fetch(`/api/enquiries/${enquiryId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notes }),
      });
      router.refresh();
    } finally {
      setSaving(false);
    }
  }

  const transitions = STATUS_TRANSITIONS[currentStatus] || [];

  return (
    <div className="space-y-6">
      {/* Status actions */}
      {transitions.length > 0 && (
        <div className="rounded-lg border border-gray-200 p-6">
          <h3 className="mb-3 text-sm font-semibold text-gray-700 uppercase tracking-wider">
            Actions
          </h3>
          <div className="flex flex-wrap gap-3">
            {transitions.map((t) => (
              <Button
                key={t.next}
                variant={t.next === "ARCHIVED" ? "outline" : "default"}
                className={t.next !== "ARCHIVED" ? "bg-navy-900 hover:bg-navy-800" : ""}
                disabled={updatingStatus !== null}
                onClick={() => updateStatus(t.next)}
              >
                {updatingStatus === t.next ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <t.icon className="mr-2 h-4 w-4" />
                )}
                {t.label}
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Internal notes */}
      <div className="rounded-lg border border-gray-200 p-6">
        <h3 className="mb-3 text-sm font-semibold text-gray-700 uppercase tracking-wider">
          Internal Notes
        </h3>
        <div className="space-y-3">
          <Label htmlFor="notes" className="sr-only">Notes</Label>
          <Textarea
            id="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={4}
            placeholder="Add private notes about this enquiry..."
          />
          <Button
            onClick={saveNotes}
            disabled={saving || notes === currentNotes}
            variant="outline"
            size="sm"
          >
            {saving ? (
              <>
                <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                Saving...
              </>
            ) : (
              "Save Notes"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
