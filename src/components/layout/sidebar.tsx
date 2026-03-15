"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import {
  LayoutDashboard,
  Users,
  FileText,
  BarChart3,
  FileOutput,
  Settings,
  Building2,
  MessageSquare,
  Bot,
  Globe,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";

const allNavItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard, adminOnly: false },
  { href: "/clients", label: "Clients", icon: Users, adminOnly: true },
  { href: "/leases", label: "Leases", icon: FileText, adminOnly: false },
  { href: "/portfolio", label: "Portfolio", icon: BarChart3, adminOnly: false },
  { href: "/reports", label: "Reports", icon: FileOutput, adminOnly: true },
  { href: "/enquiries", label: "Enquiries", icon: MessageSquare, showBadge: true, adminOnly: true },
  { href: "/assistant", label: "Assistant", icon: Bot, adminOnly: true },
  { href: "/settings", label: "Settings", icon: Settings, adminOnly: false },
];

export function Sidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [newCount, setNewCount] = useState(0);

  const isAdmin = session?.user?.role === "ADMIN";
  const navItems = allNavItems.filter((item) => !item.adminOnly || isAdmin);

  useEffect(() => {
    if (!isAdmin) return;
    fetch("/api/enquiries?status=NEW")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setNewCount(data.length);
      })
      .catch(() => {});
  }, [pathname, isAdmin]);

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r border-navy-200 bg-navy-900">
      <div className="flex h-full flex-col">
        <div className="flex items-center gap-3 border-b border-navy-700 px-6 py-5">
          <Building2 className="h-7 w-7 text-white" />
          <div>
            <h1 className="text-sm font-semibold text-white">
              {session?.user?.name || "Client Portal"}
            </h1>
            <p className="text-xs text-navy-300">
              {isAdmin ? "Admin" : "Client"}
            </p>
          </div>
        </div>

        <nav className="flex-1 space-y-1 px-3 py-4">
          {navItems.map((item) => {
            const isActive =
              pathname === item.href || pathname.startsWith(item.href + "/");
            const showBadge = "showBadge" in item && item.showBadge && newCount > 0;
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
                <span className="flex-1">{item.label}</span>
                {showBadge && (
                  <span className="flex h-5 min-w-[20px] items-center justify-center rounded-full bg-blue-500 px-1.5 text-[10px] font-bold text-white">
                    {newCount}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-navy-700 px-3 py-3 space-y-1">
          <Link
            href="/"
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-navy-400 transition-colors hover:bg-navy-800 hover:text-white"
          >
            <Globe className="h-4 w-4" />
            View Website
          </Link>
          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-navy-400 transition-colors hover:bg-navy-800 hover:text-white"
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </button>
        </div>

        <div className="border-t border-navy-700 px-6 py-4">
          <p className="text-xs text-navy-400">
            Licensed Estate Agent
            <br />
            Licence No. 095428L
          </p>
        </div>
      </div>
    </aside>
  );
}
