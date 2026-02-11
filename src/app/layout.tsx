import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Sidebar } from "@/components/layout/sidebar";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Lease Advisor — Ben Palmieri Consulting",
  description: "Commercial lease analysis platform for Victorian estate agents",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} font-[family-name:var(--font-geist-sans)] antialiased`}>
        <Sidebar />
        <main className="ml-64 min-h-screen bg-background p-8">
          <Breadcrumbs />
          {children}
        </main>
      </body>
    </html>
  );
}
