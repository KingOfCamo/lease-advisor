import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Award, Briefcase, MapPin, Scale } from "lucide-react";

export const metadata: Metadata = {
  title: "About — Ben Palmieri Consulting",
  description: "Licensed estate agent with 10 years experience in commercial lease advisory across Australia and New Zealand",
};

export default function AboutPage() {
  return (
    <>
      {/* Header */}
      <section className="bg-navy-900 text-white">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold sm:text-4xl">About Ben Palmieri</h1>
          <p className="mt-3 max-w-2xl text-lg text-navy-200">
            Director &amp; Leasing Consultant — helping landlords and tenants make
            informed decisions on commercial leases across Australia and New Zealand.
          </p>
        </div>
      </section>

      {/* Bio */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-5">
            <div className="lg:col-span-3 space-y-5 text-gray-600 leading-relaxed">
              <p>
                With over 10 years of hands-on experience managing commercial leases —
                from small regional shopfronts to large CBD towers across Australia and
                New Zealand — Ben Palmieri Consulting delivers practical, results-driven
                advisory services for landlords and tenants of all sizes.
              </p>
              <p>
                Ben is a licensed estate agent who prides himself on being honest and
                upfront. There are no hidden agendas — just straight-talking advice with
                your best interests at heart. Having worked extensively on both sides of
                the table, Ben understands exactly how landlords and tenants think, what
                they want, and what drives their decisions. That insight means sharper
                negotiations and better outcomes for the side he represents.
              </p>
              <p>
                Above all, Ben is loyal to his clients. He believes exceptional
                communication is the foundation of every successful engagement, and takes
                pride in building long-lasting relationships — particularly with clients in
                regional and hard-to-reach areas who deserve the same quality of service as
                those in the city.
              </p>
              <p>
                Every lease is unique. Ben&apos;s approach combines clause-by-clause scoring,
                market benchmarking, and financial impact analysis to give you a complete
                picture of where you stand and what to negotiate.
              </p>
            </div>

            <div className="lg:col-span-2 space-y-6">
              {[
                {
                  icon: Award,
                  title: "Licensed Estate Agent",
                  detail: "Licence No. 095428L",
                },
                {
                  icon: Briefcase,
                  title: "10+ Years Experience",
                  detail: "Small shopfronts to large CBD towers across AU & NZ",
                },
                {
                  icon: MapPin,
                  title: "Coverage",
                  detail: "All of Australia & New Zealand — including regional areas",
                },
                {
                  icon: Scale,
                  title: "Specialisation",
                  detail: "Commercial Lease Advisory",
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className="flex items-start gap-4 rounded-lg border border-gray-200 p-4"
                >
                  <item.icon className="mt-0.5 h-5 w-5 flex-shrink-0 text-navy-900" />
                  <div>
                    <h3 className="font-semibold text-navy-900">{item.title}</h3>
                    <p className="text-sm text-gray-500">{item.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Approach */}
      <section className="bg-gray-50 py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-navy-900">Our Approach</h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-3">
            {[
              {
                step: "01",
                title: "Understand",
                description:
                  "We start by understanding your position — landlord or tenant — your objectives, and the specifics of your lease or portfolio.",
              },
              {
                step: "02",
                title: "Analyse",
                description:
                  "Every clause is scored against market benchmarks and best practice. We identify risks, opportunities, and financial impacts.",
              },
              {
                step: "03",
                title: "Advise",
                description:
                  "You receive clear, prioritised recommendations with estimated dollar impacts, so you can negotiate from a position of strength.",
              },
            ].map((item) => (
              <div key={item.step} className="rounded-xl bg-white p-6 shadow-sm">
                <span className="text-3xl font-bold text-navy-200">{item.step}</span>
                <h3 className="mt-3 text-lg font-semibold text-navy-900">{item.title}</h3>
                <p className="mt-2 text-sm text-gray-500">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-navy-900">Let&apos;s Talk</h2>
          <p className="mx-auto mt-3 max-w-lg text-gray-500">
            Ready to get expert advice on your commercial lease? Reach out for a
            no-obligation conversation.
          </p>
          <Link
            href="/contact"
            className="mt-8 inline-flex items-center rounded-lg bg-navy-900 px-8 py-3 text-sm font-semibold text-white transition hover:bg-navy-800"
          >
            Get in Touch
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </div>
      </section>
    </>
  );
}
