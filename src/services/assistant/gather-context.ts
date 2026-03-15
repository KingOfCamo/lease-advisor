import { prisma } from "@/lib/prisma";
import { formatCurrency, formatDate, formatArea, formatMonths } from "@/lib/formatters";

export async function gatherPlatformContext(): Promise<string> {
  const [clients, leases, enquiries, settings, snapshots] = await Promise.all([
    prisma.client.findMany({ orderBy: { businessName: "asc" } }),
    prisma.lease.findMany({
      include: {
        property: true,
        client: true,
        analyses: { orderBy: { analysedAt: "desc" }, take: 1 },
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.enquiry.findMany({ orderBy: { createdAt: "desc" } }),
    prisma.businessSettings.findUnique({ where: { id: "default" } }),
    prisma.portfolioSnapshot.findMany({ orderBy: { snapshotDate: "desc" } }),
  ]);

  const sections: string[] = [];

  // Business Settings
  if (settings) {
    sections.push(
      `## Business Settings
Company: ${settings.companyName}
Tagline: ${settings.tagline}
Licence: ${settings.licenceNumber}
Email: ${settings.email || "Not set"}
Phone: ${settings.phone || "Not set"}
Address: ${settings.address || "Not set"}`
    );
  }

  // Clients
  sections.push(
    `## Clients (${clients.length} total)\n${
      clients.length === 0
        ? "No clients yet."
        : clients
            .map(
              (c) =>
                `- ${c.businessName} [${c.clientType}] — Status: ${c.status}, Contact: ${c.contactPerson || "N/A"}, Email: ${c.email || "N/A"}, Phone: ${c.phone || "N/A"}, ABN: ${c.abn || "N/A"}${c.notes ? `, Notes: ${c.notes}` : ""}`
            )
            .join("\n")
    }`
  );

  // Leases with analysis summaries
  sections.push(
    `## Leases (${leases.length} total)\n${
      leases.length === 0
        ? "No leases yet."
        : leases
            .map((l) => {
              const analysis = l.analyses[0];
              let line = `- "${l.leaseName}" — Tenant: ${l.tenantName}, Landlord: ${l.landlordName}, Client: ${l.client.businessName}
  Property: ${l.property.address}, ${l.property.suburb} ${l.property.state} ${l.property.postcode} (${l.property.propertyType}, ${formatArea(l.property.nla)}, Retail: ${l.property.isRetailLease ? "Yes" : "No"})
  Term: ${formatDate(l.commencementDate)} to ${formatDate(l.expiryDate)} (${formatMonths(l.totalTermMonths)})
  Base Rent: ${formatCurrency(l.baseRentPA)}/yr${l.baseRentPSQM ? ` (${formatCurrency(l.baseRentPSQM)}/sqm)` : ""}
  Review: ${l.rentReviewMechanism}${l.rentReviewDetail ? ` — ${l.rentReviewDetail}` : ""}, every ${l.rentReviewFrequencyMonths} months${l.hasRatchetClause ? ", RATCHET CLAUSE" : ""}
  Outgoings: ${l.outgoingsStructure}${l.outgoingsEstimatePA ? `, Est. ${formatCurrency(l.outgoingsEstimatePA)}/yr` : ""}
  Bond: ${l.bondAmount ? `${formatCurrency(l.bondAmount)} (${l.bondType || "N/A"})` : "None"}${l.managingAgentName || l.managingAgentCompany ? `\n  Managing Agent: ${l.managingAgentName || ""}${l.managingAgentCompany ? ` (${l.managingAgentCompany})` : ""}` : ""}
  Status: ${l.status}`;

              if (analysis) {
                const recs = JSON.parse(analysis.topRecommendations as string);
                const risks = analysis.riskFlags
                  ? JSON.parse(analysis.riskFlags as string)
                  : [];
                const rlaIssues = analysis.retailLeasesActIssues
                  ? JSON.parse(analysis.retailLeasesActIssues as string)
                  : [];
                line += `
  ANALYSIS: Landlord Score ${analysis.overallLandlordScore}/100, Tenant Score ${analysis.overallTenantScore}/100
  Est. Annual Value-Add: ${formatCurrency(analysis.totalEstimatedAnnualImpact)}/yr
  Recommendations: ${recs.length}, Risk Flags: ${risks.length}, RLA Issues: ${rlaIssues.length}`;

                // Include top 3 recommendations
                if (recs.length > 0) {
                  const topRecs = recs.slice(0, 3);
                  line += `\n  Top Recommendations:`;
                  for (const rec of topRecs) {
                    line += `\n    • [${rec.priority}] ${rec.title}: ${rec.description} (${formatCurrency(rec.estimatedAnnualImpact)}/yr impact)`;
                  }
                }

                // Include risk flags
                if (risks.length > 0) {
                  line += `\n  Risk Flags:`;
                  for (const risk of risks) {
                    line += `\n    ⚠ [${risk.severity}] ${risk.flag}: ${risk.detail}`;
                  }
                }
              }

              return line;
            })
            .join("\n\n")
    }`
  );

  // Portfolio Snapshots
  if (snapshots.length > 0) {
    const latestByClient = new Map<string, (typeof snapshots)[0]>();
    const earliestByClient = new Map<string, (typeof snapshots)[0]>();
    for (const s of snapshots) {
      if (!latestByClient.has(s.clientId)) latestByClient.set(s.clientId, s);
      earliestByClient.set(s.clientId, s); // last one processed = earliest (desc order)
    }
    const clientNames = new Map(clients.map((c) => [c.id, c.businessName]));

    sections.push(
      `## Portfolio Snapshots\n${Array.from(latestByClient.entries())
        .map(([clientId, latest]) => {
          const earliest = earliestByClient.get(clientId);
          let line = `- ${clientNames.get(clientId) || clientId} (latest): ${latest.leaseCount} leases, Total Rent ${formatCurrency(latest.totalRentPA)}/yr, Avg Score ${latest.avgScore}/100, Value-Add ${formatCurrency(latest.totalValueAdd)}/yr (${formatDate(latest.snapshotDate)})`;
          if (earliest && earliest.id !== latest.id) {
            line += `\n  First engagement: ${earliest.leaseCount} leases, Total Rent ${formatCurrency(earliest.totalRentPA)}/yr, Avg Score ${earliest.avgScore}/100, Value-Add ${formatCurrency(earliest.totalValueAdd)}/yr (${formatDate(earliest.snapshotDate)})`;
          }
          return line;
        })
        .join("\n")}`
    );
  }

  // Enquiries
  if (enquiries.length > 0) {
    sections.push(
      `## Enquiries (${enquiries.length} total, ${enquiries.filter((e) => e.status === "NEW").length} new)\n${enquiries
        .map(
          (e) =>
            `- ${e.name} (${e.email}${e.company ? `, ${e.company}` : ""}) — Service: ${e.service || "General"}, Status: ${e.status}, Date: ${formatDate(e.createdAt)}
  Message: ${e.message.substring(0, 200)}${e.message.length > 200 ? "..." : ""}${e.notes ? `\n  Notes: ${e.notes}` : ""}`
        )
        .join("\n")}`
    );
  }

  return sections.join("\n\n");
}
