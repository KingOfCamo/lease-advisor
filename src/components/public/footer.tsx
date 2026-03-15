import Link from "next/link";
import { Building2 } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-navy-900 text-white">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-3">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Building2 className="h-6 w-6 text-white" />
              <span className="text-lg font-semibold">Ancora Property Advisory</span>
            </div>
            <p className="text-sm text-navy-300">
              Director | Leasing Consultant
            </p>
            <p className="mt-1 text-xs text-navy-400">
              Licensed Estate Agent — Licence No. 095428L
            </p>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-navy-300">
              Quick Links
            </h3>
            <ul className="space-y-2">
              {[
                { href: "/", label: "Home" },
                { href: "/about", label: "About" },
                { href: "/services", label: "Services" },
                { href: "/contact", label: "Contact" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-navy-300 transition-colors hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-navy-300">
              Contact
            </h3>
            <ul className="space-y-2 text-sm text-navy-300">
              <li>Australia & New Zealand</li>
              <li>
                <Link href="/contact" className="transition-colors hover:text-white">
                  Send an enquiry &rarr;
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-navy-700 pt-6">
          <p className="text-center text-xs text-navy-400">
            &copy; {new Date().getFullYear()} Ancora Property Advisory. All rights reserved.
            This website is advisory in nature and does not constitute legal advice.
          </p>
        </div>
      </div>
    </footer>
  );
}
