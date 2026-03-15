import Link from "next/link";
import { ArrowRight, FileSearch, Users, TrendingUp, Shield } from "lucide-react";

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-navy-900 text-white">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
          <div className="max-w-2xl">
            <p className="mb-3 text-sm font-medium uppercase tracking-wider text-navy-300">
              Ben Palmieri Consulting
            </p>
            <h1 className="text-4xl font-bold leading-tight sm:text-5xl">
              Commercial Lease Advisory
            </h1>
            <p className="mt-5 text-lg text-navy-200">
              Expert guidance for landlords and tenants navigating commercial leases
              across Australia and New Zealand — from regional shopfronts to CBD towers.
              Honest advice. Clear recommendations. Lasting relationships.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/contact"
                className="inline-flex items-center rounded-lg bg-white px-6 py-3 text-sm font-semibold text-navy-900 shadow-sm transition hover:bg-gray-100"
              >
                Get in Touch
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
              <Link
                href="/services"
                className="inline-flex items-center rounded-lg border border-navy-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-navy-800"
              >
                Our Services
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Services overview */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-navy-900 sm:text-3xl">
              How We Help
            </h2>
            <p className="mt-3 text-gray-500">
              Comprehensive lease advisory services tailored to your position
            </p>
          </div>

          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                icon: FileSearch,
                title: "Lease Review",
                description:
                  "Clause-by-clause analysis of your commercial lease with scoring and actionable recommendations.",
              },
              {
                icon: Users,
                title: "Tenant Representation",
                description:
                  "Negotiation support and market insights to secure the best terms for your tenancy.",
              },
              {
                icon: TrendingUp,
                title: "Landlord Advisory",
                description:
                  "Maximise rental income and minimise risk across your commercial property portfolio.",
              },
              {
                icon: Shield,
                title: "Compliance",
                description:
                  "Ensure your lease meets applicable retail leasing legislation and industry standards across Australia.",
              },
            ].map((service) => (
              <div
                key={service.title}
                className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition hover:shadow-md"
              >
                <service.icon className="mb-4 h-8 w-8 text-navy-900" />
                <h3 className="text-lg font-semibold text-navy-900">{service.title}</h3>
                <p className="mt-2 text-sm text-gray-500">{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why choose section */}
      <section className="bg-gray-50 py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <h2 className="text-2xl font-bold text-navy-900 sm:text-3xl">
                Why Ben Palmieri Consulting?
              </h2>
              <ul className="mt-6 space-y-4">
                {[
                  {
                    title: "10 Years of Hands-On Experience",
                    description:
                      "A decade managing commercial leases — from small regional shopfronts to large CBD towers across Australia and New Zealand.",
                  },
                  {
                    title: "Honest & Upfront",
                    description:
                      "Straight-talking advice with no hidden agendas. Your best interests come first, always.",
                  },
                  {
                    title: "Both Sides of the Table",
                    description:
                      "Deep understanding of how both landlords and tenants think, so you get practical advice grounded in real-world negotiation.",
                  },
                  {
                    title: "Exceptional Communication",
                    description:
                      "Built on a foundation of clear, responsive communication and long-lasting client relationships — including hard-to-reach regional areas.",
                  },
                ].map((item) => (
                  <li key={item.title} className="flex gap-3">
                    <div className="mt-1 h-2 w-2 flex-shrink-0 rounded-full bg-navy-900" />
                    <div>
                      <h4 className="font-semibold text-navy-900">{item.title}</h4>
                      <p className="text-sm text-gray-500">{item.description}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-xl bg-navy-900 p-8 text-white">
              <blockquote className="text-lg font-medium leading-relaxed">
                &ldquo;I believe in loyalty, honesty, and always doing right by my clients.
                When you understand both sides of the table, you deliver better outcomes
                for the side you&apos;re on.&rdquo;
              </blockquote>
              <p className="mt-4 text-sm text-navy-300">
                — Ben Palmieri, Director
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-navy-900 sm:text-3xl">
            Ready to Review Your Lease?
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-gray-500">
            Get in touch for a no-obligation conversation about your commercial lease
            needs.
          </p>
          <Link
            href="/contact"
            className="mt-8 inline-flex items-center rounded-lg bg-navy-900 px-8 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-navy-800"
          >
            Contact Us
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </div>
      </section>
    </>
  );
}
