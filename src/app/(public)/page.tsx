"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { FileSearch, Users, Building2, ShieldCheck, ChevronRight } from "lucide-react";
import { VideoHero } from "@/components/public/video-hero";
import { StatsCounter } from "@/components/public/stats-counter";
import { ScrollReveal } from "@/components/public/scroll-reveal";
import { AnimatedServiceCard } from "@/components/public/animated-service-card";
import { ParallaxImage } from "@/components/public/parallax-image";

export default function HomePage() {
  return (
    <>
      {/* Section 1: Video Hero */}
      <VideoHero
        videoSrc="https://videos.pexels.com/video-files/3129671/3129671-hd_1920_1080_30fps.mp4"
        posterSrc="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1920&q=80"
      >
        <div className="max-w-2xl">
          <p className="text-xs font-medium uppercase tracking-widest text-gold-400">
            ANCORA PROPERTY ADVISORY
          </p>
          <h1 className="text-5xl md:text-7xl font-bold text-white">
            Navigate Your Commercial Lease With Confidence
          </h1>
          <p className="text-lg text-navy-200 mt-6">
            Expert guidance for landlords and tenants navigating commercial leases
            across Australia and New Zealand.
          </p>
          <div className="mt-8 flex gap-4">
            <Link
              href="/contact"
              className="inline-flex items-center bg-gold-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-gold-600 transition"
            >
              Get in Touch
              <ChevronRight className="ml-2 h-4 w-4" />
            </Link>
            <Link
              href="/services"
              className="inline-flex items-center border border-white/30 text-white px-6 py-3 rounded-lg font-medium hover:bg-white/10 transition"
            >
              Our Services
            </Link>
          </div>
        </div>
      </VideoHero>

      {/* Section 2: Stats Counter */}
      <StatsCounter
        stats={[
          { value: 10, suffix: "+", label: "Years Experience" },
          { value: 100, suffix: "+", label: "Leases Managed" },
          { value: 100, suffix: "%", label: "Client Satisfaction" },
          { value: 2, suffix: "", label: "Countries" },
        ]}
      />

      {/* Section 3: Services Overview */}
      <section className="py-24 bg-white">
        <div className="mx-auto max-w-6xl px-6">
          <ScrollReveal>
            <div className="text-center">
              <h2 className="text-3xl md:text-4xl font-bold text-navy-900">
                How We Help
              </h2>
              <div className="w-16 h-0.5 bg-gold-400 mx-auto mt-4 mb-4" />
              <p className="text-gray-500 max-w-2xl mx-auto text-center">
                Comprehensive lease advisory services tailored to your position —
                whether you&apos;re a landlord or tenant.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
            <AnimatedServiceCard
              icon={<FileSearch className="h-6 w-6" />}
              title="Lease Review & Analysis"
              description="Comprehensive analysis of lease terms, obligations, and market positioning."
            />
            <AnimatedServiceCard
              icon={<Users className="h-6 w-6" />}
              title="Tenant Representation"
              description="Expert advocacy and negotiation for tenants securing the best terms."
              index={1}
            />
            <AnimatedServiceCard
              icon={<Building2 className="h-6 w-6" />}
              title="Landlord Advisory"
              description="Strategic advice to maximise returns and minimise vacancy risk."
              index={2}
            />
            <AnimatedServiceCard
              icon={<ShieldCheck className="h-6 w-6" />}
              title="Compliance Advisory"
              description="Ensure lease compliance with current legislation and market standards."
              index={3}
            />
          </div>
        </div>
      </section>

      {/* Section 4: Property Showcase */}
      <section className="py-24 bg-navy-50">
        <div className="mx-auto max-w-6xl px-6">
          <ScrollReveal>
            <div className="text-center">
              <h2 className="text-3xl font-bold text-navy-900">
                From Regional Shopfronts to CBD Towers
              </h2>
              <div className="w-16 h-0.5 bg-gold-400 mx-auto mt-4 mb-4" />
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            {[
              {
                src: "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=600&q=80",
                alt: "CBD Office",
                label: "CBD Offices",
              },
              {
                src: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600&q=80",
                alt: "Mixed Use",
                label: "Retail & Mixed-Use",
              },
              {
                src: "https://images.unsplash.com/photo-1582407947092-dab289423a59?w=600&q=80",
                alt: "Regional",
                label: "Regional Commercial",
              },
            ].map((item) => (
              <motion.div
                key={item.label}
                whileHover={{ scale: 1.02 }}
                className="relative overflow-hidden rounded-2xl h-80 group"
              >
                <Image
                  src={item.src}
                  alt={item.alt}
                  fill
                  className="object-cover group-hover:scale-110 transition duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy-950/80 to-transparent" />
                <div className="absolute bottom-0 left-0 p-6">
                  <p className="text-white text-lg font-semibold">{item.label}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 5: Why Ancora */}
      <section className="py-24 bg-white">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center max-w-6xl mx-auto px-6">
          <ParallaxImage
            src="https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=1200&q=80"
            alt="Sydney skyline"
            className="relative h-[500px] rounded-2xl"
          />

          <div>
            <ScrollReveal>
              <h2 className="text-3xl font-bold text-navy-900">
                Why Ancora Property Advisory?
              </h2>
              <div className="w-16 h-0.5 bg-gold-400 mt-4 mb-8" />
            </ScrollReveal>

            {[
              {
                title: "Licensed & Experienced",
                description:
                  "Licensed Estate Agent with over a decade of commercial lease expertise.",
                delay: 0.1,
              },
              {
                title: "Independent Advice",
                description:
                  "No commissions, no conflicts — just straightforward advisory in your best interest.",
                delay: 0.2,
              },
              {
                title: "Australia & New Zealand",
                description:
                  "Coverage from regional towns to major CBD markets.",
                delay: 0.3,
              },
              {
                title: "Results-Driven",
                description:
                  "Practical recommendations that save time and money.",
                delay: 0.4,
              },
            ].map((item) => (
              <ScrollReveal key={item.title} delay={item.delay}>
                <div className="flex gap-4 items-start mb-6">
                  <div className="w-2 h-2 rounded-full bg-gold-400 mt-2 shrink-0" />
                  <div>
                    <h4 className="font-bold text-navy-900">{item.title}</h4>
                    <p className="text-gray-600">{item.description}</p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Section 6: Testimonial */}
      <section className="py-24 bg-navy-900">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <p className="text-6xl text-gold-400 font-serif leading-none mb-4">
            &ldquo;
          </p>
          <ScrollReveal>
            <blockquote className="text-xl md:text-2xl text-white/90 font-light italic max-w-3xl mx-auto leading-relaxed">
              Every clause matters. We help you understand what you&apos;re signing,
              negotiate better outcomes, and protect your interests for the long term.
            </blockquote>
            <p className="mt-6 text-gold-400 font-medium">
              — Ben Palmieri, Director
            </p>
          </ScrollReveal>

          <div className="mt-12 flex justify-center gap-12">
            <div className="flex flex-col items-center gap-2">
              <ShieldCheck className="h-6 w-6 text-gold-400" />
              <span className="text-sm text-navy-200">Licensed Agent</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <Building2 className="h-6 w-6 text-gold-400" />
              <span className="text-sm text-navy-200">10+ Years</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <Users className="h-6 w-6 text-gold-400" />
              <span className="text-sm text-navy-200">AU & NZ Wide</span>
            </div>
          </div>
        </div>
      </section>

      {/* Section 7: CTA */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1514395462725-fb4566210144?w=1200&q=80"
            alt="Melbourne"
            fill
            className="object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-navy-950/80" />
        <div className="relative z-10 text-center mx-auto max-w-4xl px-6">
          <ScrollReveal>
            <h2 className="text-3xl md:text-4xl font-bold text-white">
              Ready to Review Your Lease?
            </h2>
            <p className="text-navy-200 mt-4 max-w-xl mx-auto">
              Get in touch for a no-obligation conversation about your commercial
              lease needs.
            </p>
            <Link
              href="/contact"
              className="mt-8 inline-flex items-center bg-gold-500 text-white px-8 py-3.5 rounded-lg font-medium hover:bg-gold-600 transition"
            >
              Contact Us
              <ChevronRight className="ml-2 h-4 w-4" />
            </Link>
          </ScrollReveal>
        </div>
      </section>
    </>
  );
}
