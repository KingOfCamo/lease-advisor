"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  FileText,
  BarChart3,
  FileOutput,
  Settings,
  Building2,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/clients", label: "Clients", icon: Users },
  { href: "/leases", label: "Leases", icon: FileText },
  { href: "/portfolio", label: "Portfolio", icon: BarChart3 },
  { href: "/reports", label: "Reports", icon: FileOutput },
  { href: "/settings", label: "Settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r border-navy-200 bg-navy-900">
      <div className="flex h-full flex-col">
        <div className="flex items-center gap-3 border-b border-navy-700 px-6 py-5">
          <Building2 className="h-7 w-7 text-white" />
          <div>
            <h1 className="text-sm font-semibold text-white">Ben Palmieri</h1>
            <p className="text-xs text-navy-300">Director | Leasing Consultant</p>
          </div>
        </div>

        <nav className="flex-1 space-y-1 px-3 py-4">
          {navItems.map((item) => {
            const isActive =
              pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-navy-700 text-white"
                    : "text-navy-300 hover:bg-navy-800 hover:text-white"
                )}
              >
                <item.icon className="h-5 w-5" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-navy-700 px-6 py-4">
          <p className="text-xs text-navy-400">
            Licensed Estate Agent, VIC
            <br />
            Licence No. 095428L
          </p>
        </div>
      </div>
    </aside>
  );
}
