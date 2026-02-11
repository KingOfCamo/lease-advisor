"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

const LABEL_MAP: Record<string, string> = {
  dashboard: "Dashboard",
  clients: "Clients",
  leases: "Leases",
  portfolio: "Portfolio",
  reports: "Reports",
  settings: "Settings",
  new: "New",
  upload: "Upload PDF",
  analysis: "Analysis",
  "fee-proposal": "Fee Proposal",
};

export function Breadcrumbs() {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);

  if (segments.length <= 1) return null;

  const crumbs = segments.map((segment, i) => {
    const href = "/" + segments.slice(0, i + 1).join("/");
    const label = LABEL_MAP[segment] || decodeURIComponent(segment);
    const isLast = i === segments.length - 1;
    return { href, label, isLast };
  });

  return (
    <nav className="flex items-center gap-1 text-xs text-muted-foreground mb-4">
      <Link href="/dashboard" className="hover:text-navy-700 transition-colors">
        Home
      </Link>
      {crumbs.map((crumb) => (
        <span key={crumb.href} className="flex items-center gap-1">
          <ChevronRight className="h-3 w-3" />
          {crumb.isLast ? (
            <span className="text-navy-900 font-medium">{crumb.label}</span>
          ) : (
            <Link href={crumb.href} className="hover:text-navy-700 transition-colors">
              {crumb.label}
            </Link>
          )}
        </span>
      ))}
    </nav>
  );
}
