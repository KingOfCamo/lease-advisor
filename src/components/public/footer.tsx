import Link from "next/link";
import { Building2 } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-gold-400/20 bg-navy-900">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2">
              <Building2 className="h-6 w-6 text-gold-400" />
              <span className="text-lg font-semibold text-white">
                Ancora Property Advisory
              </span>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-navy-300">
              Director | Leasing Consultant
            </p>
            <p className="mt-1 text-sm text-navy-400">
              Licensed Estate Agent — Licence No. 095428L
            </p>
          </div>

          {/* Services */}
          <div>
            <h4 className="mb-4 text-xs font-semibold uppercase tracking-wider text-gold-400">
              Services
            </h4>
            <ul className="space-y-3">
              {[
                "Lease Review & Analysis",
                "Tenant Representation",
                "Landlord Advisory",
                "Market Research",
              ].map((item) => (
                <li key={item}>
                  <Link
                    href="/services"
                    className="text-sm text-navy-300 transition-colors hover:text-gold-400"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="mb-4 text-xs font-semibold uppercase tracking-wider text-gold-400">
              Company
            </h4>
            <ul className="space-y-3">
              {[
                { label: "Home", href: "/" },
                { label: "About", href: "/about" },
                { label: "Services", href: "/services" },
                { label: "Contact", href: "/contact" },
                { label: "Client Portal", href: "/dashboard" },
              ].map((item) => (
                <li key={item.label}>
                  <Link
                    href={item.href}
                    className="text-sm text-navy-300 transition-colors hover:text-gold-400"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="mb-4 text-xs font-semibold uppercase tracking-wider text-gold-400">
              Contact
            </h4>
            <ul className="space-y-3">
              <li className="text-sm text-navy-300">Australia & New Zealand</li>
              <li>
                <Link
                  href="/contact"
                  className="text-sm text-navy-300 transition-colors hover:text-gold-400"
                >
                  Send an enquiry &rarr;
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-navy-800 pt-8 sm:flex-row">
          <p className="text-xs text-navy-400">
            &copy; {new Date().getFullYear()} Ancora Property Advisory. All
            rights reserved.
          </p>
          <div className="flex gap-6">
            <span className="text-xs text-navy-500">Privacy Policy</span>
            <span className="text-xs text-navy-500">Terms of Service</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
