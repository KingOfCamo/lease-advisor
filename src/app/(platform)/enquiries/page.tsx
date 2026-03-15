import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/formatters";
import { PageHeader } from "@/components/layout/page-header";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { MessageSquare } from "lucide-react";

export const dynamic = "force-dynamic";

const STATUS_STYLES: Record<string, string> = {
  NEW: "bg-blue-100 text-blue-800",
  READ: "bg-gray-100 text-gray-800",
  REPLIED: "bg-green-100 text-green-800",
  ARCHIVED: "bg-gray-50 text-gray-400",
};

const SERVICE_LABELS: Record<string, string> = {
  LEASE_REVIEW: "Lease Review",
  TENANT_REP: "Tenant Rep",
  LANDLORD_REP: "Landlord Advisory",
  OTHER: "General",
};

export default async function EnquiriesPage() {
  const enquiries = await prisma.enquiry.findMany({
    orderBy: { createdAt: "desc" },
  });

  const newCount = enquiries.filter((e) => e.status === "NEW").length;

  return (
    <div>
      <PageHeader
        title="Website Enquiries"
        description={`${enquiries.length} total enquiries${newCount > 0 ? ` \u2022 ${newCount} new` : ""}`}
      />

      {enquiries.length === 0 ? (
        <div className="mt-12 text-center">
          <MessageSquare className="mx-auto h-12 w-12 text-gray-300" />
          <h3 className="mt-3 text-lg font-medium text-gray-700">No enquiries yet</h3>
          <p className="mt-1 text-sm text-gray-500">
            Enquiries from the public website contact form will appear here.
          </p>
        </div>
      ) : (
        <div className="mt-6 overflow-hidden rounded-lg border border-gray-200">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-gray-200 bg-gray-50">
              <tr>
                <th className="px-4 py-3 font-medium text-gray-700">Status</th>
                <th className="px-4 py-3 font-medium text-gray-700">Name</th>
                <th className="px-4 py-3 font-medium text-gray-700">Company</th>
                <th className="px-4 py-3 font-medium text-gray-700">Service</th>
                <th className="px-4 py-3 font-medium text-gray-700">Date</th>
                <th className="px-4 py-3 font-medium text-gray-700">Message</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {enquiries.map((enquiry) => (
                <tr key={enquiry.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <Badge className={STATUS_STYLES[enquiry.status] || ""} variant="secondary">
                      {enquiry.status}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">
                    <Link
                      href={`/enquiries/${enquiry.id}`}
                      className="font-medium text-navy-900 hover:underline"
                    >
                      {enquiry.name}
                    </Link>
                    <p className="text-xs text-gray-400">{enquiry.email}</p>
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    {enquiry.company || "—"}
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    {enquiry.service ? SERVICE_LABELS[enquiry.service] || enquiry.service : "—"}
                  </td>
                  <td className="px-4 py-3 text-gray-500">
                    {formatDate(enquiry.createdAt)}
                  </td>
                  <td className="px-4 py-3 max-w-xs truncate text-gray-500">
                    {enquiry.message}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
