import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/formatters";
import { PageHeader } from "@/components/layout/page-header";
import { Badge } from "@/components/ui/badge";
import { notFound } from "next/navigation";
import { EnquiryActions } from "./enquiry-actions";

export const dynamic = "force-dynamic";

const STATUS_STYLES: Record<string, string> = {
  NEW: "bg-blue-100 text-blue-800",
  READ: "bg-gray-100 text-gray-800",
  REPLIED: "bg-green-100 text-green-800",
  ARCHIVED: "bg-gray-50 text-gray-400",
};

const SERVICE_LABELS: Record<string, string> = {
  LEASE_REVIEW: "Lease Review & Analysis",
  TENANT_REP: "Tenant Representation",
  LANDLORD_REP: "Landlord Advisory",
  OTHER: "General Enquiry",
};

export default async function EnquiryDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const enquiry = await prisma.enquiry.findUnique({
    where: { id: params.id },
  });

  if (!enquiry) notFound();

  return (
    <div>
      <PageHeader title={enquiry.name}>
        <Badge className={STATUS_STYLES[enquiry.status] || ""} variant="secondary">
          {enquiry.status}
        </Badge>
      </PageHeader>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Message */}
          <div className="rounded-lg border border-gray-200 p-6">
            <h3 className="mb-3 text-sm font-semibold text-gray-700 uppercase tracking-wider">
              Message
            </h3>
            <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
              {enquiry.message}
            </p>
          </div>

          {/* Actions */}
          <EnquiryActions
            enquiryId={enquiry.id}
            currentStatus={enquiry.status}
            currentNotes={enquiry.notes || ""}
          />
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Contact info */}
          <div className="rounded-lg border border-gray-200 p-6">
            <h3 className="mb-4 text-sm font-semibold text-gray-700 uppercase tracking-wider">
              Contact Details
            </h3>
            <dl className="space-y-3 text-sm">
              <div>
                <dt className="text-gray-400">Name</dt>
                <dd className="font-medium text-navy-900">{enquiry.name}</dd>
              </div>
              <div>
                <dt className="text-gray-400">Email</dt>
                <dd>
                  <a
                    href={`mailto:${enquiry.email}`}
                    className="text-navy-700 hover:underline"
                  >
                    {enquiry.email}
                  </a>
                </dd>
              </div>
              {enquiry.phone && (
                <div>
                  <dt className="text-gray-400">Phone</dt>
                  <dd>
                    <a
                      href={`tel:${enquiry.phone}`}
                      className="text-navy-700 hover:underline"
                    >
                      {enquiry.phone}
                    </a>
                  </dd>
                </div>
              )}
              {enquiry.company && (
                <div>
                  <dt className="text-gray-400">Company</dt>
                  <dd className="text-gray-700">{enquiry.company}</dd>
                </div>
              )}
              {enquiry.service && (
                <div>
                  <dt className="text-gray-400">Service Interest</dt>
                  <dd className="text-gray-700">
                    {SERVICE_LABELS[enquiry.service] || enquiry.service}
                  </dd>
                </div>
              )}
            </dl>
          </div>

          {/* Timestamps */}
          <div className="rounded-lg border border-gray-200 p-6">
            <h3 className="mb-4 text-sm font-semibold text-gray-700 uppercase tracking-wider">
              Dates
            </h3>
            <dl className="space-y-3 text-sm">
              <div>
                <dt className="text-gray-400">Received</dt>
                <dd className="text-gray-700">{formatDate(enquiry.createdAt)}</dd>
              </div>
              <div>
                <dt className="text-gray-400">Last Updated</dt>
                <dd className="text-gray-700">{formatDate(enquiry.updatedAt)}</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}
