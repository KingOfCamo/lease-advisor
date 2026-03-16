"use client";

import { ScrollReveal } from "@/components/public/scroll-reveal";
import { motion } from "framer-motion";
import Image from "next/image";
import {
  FileSearch,
  Users,
  Building2,
  ShieldCheck,
  BarChart3,
  FileText,
  CheckCircle,
} from "lucide-react";
import Link from "next/link";

const services = [
  {
    icon: FileSearch,
    title: "Lease Review & Analysis",
    description:
      "Line-by-line review of your lease to identify risks, obligations, and opportunities.",
    benefits: ["Risk identification", "Obligation mapping", "Market comparison"],
  },
  {
    icon: Users,
    title: "Tenant Representation",
    description:
      "Expert negotiation and advocacy to secure the best possible terms for your tenancy.",
    benefits: [
      "Lease negotiation",
      "Renewal strategy",
      "Rent review preparation",
    ],
  },
  {
    icon: Building2,
    title: "Landlord Advisory",
    description:
      "Strategic advice to maximise asset value, minimise vacancy, and manage tenant relationships.",
    benefits: [
      "Tenant retention",
      "Vacancy minimisation",
      "Portfolio strategy",
    ],
  },
  {
    icon: BarChart3,
    title: "Market Research & Benchmarking",
    description:
      "Data-driven insights on rental rates, incentives, and market conditions.",
    benefits: [
      "Rental benchmarking",
      "Market trend analysis",
      "Comparable evidence",
    ],
  },
  {
    icon: ShieldCheck,
    title: "Compliance Advisory",
    description:
      "Ensure your lease meets all legislative requirements and industry standards.",
    benefits: [
      "Regulatory compliance",
      "Disclosure obligations",
      "Risk mitigation",
    ],
  },
  {
    icon: FileText,
    title: "Fee Proposals & Reporting",
    description:
      "Professional reports and fee proposals for transparent, structured advisory.",
    benefits: [
      "Detailed reporting",
      "Fee transparency",
      "Client presentations",
    ],
  },
];

export default function ServicesPage() {
  return (
    <main>
      {/* Hero Section */}
      <section className="relative h-[50vh] overflow-hidden flex items-center">
        <Image
          src="https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=1920&q=80"
          alt="Conference room"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-navy-950/70" />
        <div className="relative z-10 max-w-6xl mx-auto px-6">
          <ScrollReveal>
            <p className="text-xs uppercase tracking-widest text-gold-400 mb-4">
              OUR SERVICES
            </p>
          </ScrollReveal>
          <ScrollReveal>
            <h1 className="text-4xl md:text-5xl font-bold text-white">
              Expert Commercial Lease Advisory
            </h1>
          </ScrollReveal>
          <ScrollReveal>
            <p className="text-lg text-navy-200 mt-4 max-w-2xl">
              Comprehensive advisory services for tenants, landlords, and
              property professionals across Australia and New Zealand.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {services.map((service, index) => {
              const Icon = service.icon;
              return (
                <motion.div
                  key={service.title}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -4 }}
                  className="rounded-2xl border border-gray-200 p-8 group hover:border-gold-400 transition-all hover:shadow-lg"
                >
                  <div className="h-12 w-12 rounded-xl bg-gold-50 flex items-center justify-center group-hover:bg-gold-100 transition-colors">
                    <Icon className="h-6 w-6 text-gold-700" />
                  </div>
                  <h3 className="text-xl font-semibold text-navy-900 mt-5">
                    {service.title}
                  </h3>
                  <p className="text-gray-600 mt-3 leading-relaxed">
                    {service.description}
                  </p>
                  <ul className="mt-5 space-y-2">
                    {service.benefits.map((benefit) => (
                      <li
                        key={benefit}
                        className="flex items-center gap-2 text-gray-600"
                      >
                        <CheckCircle className="h-4 w-4 text-gold-400 flex-shrink-0" />
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-navy-900 text-center">
        <ScrollReveal>
          <h2 className="text-3xl font-bold text-white">
            Ready to Get Started?
          </h2>
          <p className="text-navy-200 mt-4 max-w-xl mx-auto">
            Get in touch today and let us help you navigate your next commercial
            lease with confidence.
          </p>
          <Link
            href="/contact"
            className="inline-block mt-8 px-8 py-3 bg-gold-400 text-navy-900 font-semibold rounded-lg hover:bg-gold-500 transition-colors"
          >
            Contact Us
          </Link>
        </ScrollReveal>
      </section>
    </main>
  );
}
