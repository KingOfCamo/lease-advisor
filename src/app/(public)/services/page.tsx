import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  FileSearch,
  Users,
  TrendingUp,
  BarChart3,
  Shield,
  Calculator,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Services — Ancora Property Advisory",
  description: "Commercial lease review, tenant representation, landlord advisory, and market research",
};

const services = [
  {
    icon: FileSearch,
    title: "Lease Review & Analysis",
    description:
      "Comprehensive clause-by-clause review of your commercial lease. Every term is scored for fairness, benchmarked against market standards, and assessed for financial impact.",
    benefits: [
      "Landlord and tenant scoring on every clause",
      "Estimated annual financial impact of each term",
      "Retail leasing legislation compliance check",
      "Clear, prioritised recommendations",
    ],
  },
  {
    icon: Users,
    title: "Tenant Representation",
    description:
      "Acting on behalf of tenants to negotiate the best possible lease terms. From initial heads of agreement through to execution, we ensure your interests are protected.",
    benefits: [
      "Market rent benchmarking and evidence",
      "Negotiation strategy and support",
      "Incentive structuring (rent-free, fitout contributions)",
      "Option and renewal term advice",
    ],
  },
  {
    icon: TrendingUp,
    title: "Landlord Advisory",
    description:
      "Strategic advice for landlords looking to maximise rental income, reduce vacancy, and strengthen lease positions across their portfolio.",
    benefits: [
      "Portfolio-wide lease health analysis",
      "Rent review and expiry profiling",
      "Outgoings recovery optimisation",
      "Vacancy risk identification and mitigation",
    ],
  },
  {
    icon: BarChart3,
    title: "Market Research & Benchmarking",
    description:
      "Access to current market data across Australian and New Zealand markets. Understand where your rent sits relative to comparable properties and recent transactions.",
    benefits: [
      "Suburb-level rent benchmarks ($/sqm)",
      "Property grade and type comparisons",
      "Incentive trend analysis",
      "Vacancy and absorption rates",
    ],
  },
  {
    icon: Shield,
    title: "Compliance Advisory",
    description:
      "Ensure your lease complies with applicable retail leasing legislation across Australian states and territories. Identify issues before they become costly disputes.",
    benefits: [
      "Retail leasing legislation audit (all states)",
      "Disclosure statement review",
      "Key dates and notice period tracking",
      "Risk flag identification",
    ],
  },
  {
    icon: Calculator,
    title: "Fee Proposals & Reporting",
    description:
      "Professional reporting and transparent fee structures. Receive detailed analysis reports and clear fee proposals tailored to the scope of your engagement.",
    benefits: [
      "Detailed PDF analysis reports",
      "Portfolio summary dashboards",
      "Transparent fixed-fee or per-lease pricing",
      "Value-add quantification",
    ],
  },
];

export default function ServicesPage() {
  return (
    <>
      {/* Header */}
      <section className="bg-navy-900 text-white">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold sm:text-4xl">Our Services</h1>
          <p className="mt-3 max-w-2xl text-lg text-navy-200">
            Tailored commercial lease advisory for landlords and tenants across
            Australia and New Zealand — from regional towns to major CBDs.
          </p>
        </div>
      </section>

      {/* Services grid */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 md:grid-cols-2">
            {services.map((service) => (
              <div
                key={service.title}
                className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
              >
                <service.icon className="mb-4 h-8 w-8 text-navy-900" />
                <h3 className="text-lg font-semibold text-navy-900">{service.title}</h3>
                <p className="mt-2 text-sm text-gray-500">{service.description}</p>
                <ul className="mt-4 space-y-2">
                  {service.benefits.map((benefit) => (
                    <li key={benefit} className="flex items-start gap-2 text-sm text-gray-600">
                      <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-navy-900" />
                      {benefit}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gray-50 py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-navy-900">
            Need Help With Your Lease?
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-gray-500">
            Every lease is different. Get in touch to discuss your specific situation
            and find out how we can help.
          </p>
          <Link
            href="/contact"
            className="mt-8 inline-flex items-center rounded-lg bg-navy-900 px-8 py-3 text-sm font-semibold text-white transition hover:bg-navy-800"
          >
            Contact Us
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </div>
      </section>
    </>
  );
}
