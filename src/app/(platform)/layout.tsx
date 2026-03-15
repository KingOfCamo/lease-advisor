import type { Metadata } from "next";
import { Sidebar } from "@/components/layout/sidebar";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import AuthProvider from "@/components/providers/session-provider";

export const metadata: Metadata = {
  title: "Director | Leasing Consultant — Ancora Property Advisory",
  description: "Commercial lease analysis platform",
};

export default function PlatformLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <Sidebar />
      <main className="ml-64 min-h-screen bg-background p-8">
        <Breadcrumbs />
        {children}
      </main>
    </AuthProvider>
  );
}
