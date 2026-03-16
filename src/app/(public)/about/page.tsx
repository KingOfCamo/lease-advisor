"use client";

import { ScrollReveal } from "@/components/public/scroll-reveal";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

export default function AboutPage() {
  return (
    <main>
      {/* Hero Section */}
      <section className="relative h-[60vh] overflow-hidden flex items-center">
        <Image
          src="https://images.unsplash.com/photo-1497366216548-37526070297c?w=1920&q=80"
          alt="Modern office"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-navy-950/70" />
        <div className="relative z-10 max-w-6xl mx-auto px-6">
          <ScrollReveal>
            <p className="text-xs uppercase tracking-widest text-gold-400 mb-4">
              ABOUT US
            </p>
          </ScrollReveal>
          <ScrollReveal>
            <h1 className="text-4xl md:text-5xl font-bold text-white">
              About Ancora Property Advisory
            </h1>
          </ScrollReveal>
          <ScrollReveal>
            <p className="text-lg text-navy-200 mt-4 max-w-2xl">
              Independent commercial lease advisory, grounded in experience and
              focused on delivering clear outcomes for tenants and landlords
              across Australia and New Zealand.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* Bio Section */}
      <section className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-5 gap-16">
          {/* Left column */}
          <div className="lg:col-span-3">
            <ScrollReveal>
              <p className="text-gray-600 leading-relaxed mb-6">
                With over a decade of experience across Australia and New
                Zealand, Ancora Property Advisory provides independent
                commercial lease advisory services to tenants, landlords, and
                property professionals seeking clear, unbiased guidance.
              </p>
            </ScrollReveal>
            <ScrollReveal delay={0.1}>
              <p className="text-gray-600 leading-relaxed mb-6">
                Ben Palmieri is a Licensed Estate Agent who brings practical,
                results-driven advisory to every engagement. Whether you are
                entering a new lease, navigating a renewal, or reviewing complex
                terms, Ancora is here to ensure you make informed decisions.
              </p>
            </ScrollReveal>
            <ScrollReveal delay={0.2}>
              <p className="text-gray-600 leading-relaxed mb-6">
                From negotiating CBD office leases to reviewing regional retail
                terms, Ancora Property Advisory delivers clear, independent
                guidance that protects your interests and strengthens your
                position.
              </p>
            </ScrollReveal>
            <ScrollReveal delay={0.2}>
              <p className="text-gray-600 leading-relaxed mb-6">
                Our approach is simple: understand your position, analyse the
                market, and advise with confidence.
              </p>
            </ScrollReveal>
          </div>

          {/* Right column — Timeline */}
          <div className="lg:col-span-2">
            <div className="relative">
              <div className="absolute left-4 w-0.5 bg-gold-200 top-0 bottom-0" />

              <ScrollReveal delay={0}>
                <div className="relative pl-12 pb-8">
                  <div className="absolute left-2.5 w-3 h-3 rounded-full bg-gold-400 border-2 border-white" />
                  <p className="font-bold text-navy-900">
                    Licensed Estate Agent
                  </p>
                  <p className="text-gray-600">Licence No. 095428L</p>
                </div>
              </ScrollReveal>

              <ScrollReveal delay={0.1}>
                <div className="relative pl-12 pb-8">
                  <div className="absolute left-2.5 w-3 h-3 rounded-full bg-gold-400 border-2 border-white" />
                  <p className="font-bold text-navy-900">
                    10+ Years Experience
                  </p>
                  <p className="text-gray-600">Commercial lease advisory</p>
                </div>
              </ScrollReveal>

              <ScrollReveal delay={0.2}>
                <div className="relative pl-12 pb-8">
                  <div className="absolute left-2.5 w-3 h-3 rounded-full bg-gold-400 border-2 border-white" />
                  <p className="font-bold text-navy-900">
                    Australia &amp; New Zealand
                  </p>
                  <p className="text-gray-600">Regional to CBD coverage</p>
                </div>
              </ScrollReveal>

              <ScrollReveal delay={0.3}>
                <div className="relative pl-12 pb-8">
                  <div className="absolute left-2.5 w-3 h-3 rounded-full bg-gold-400 border-2 border-white" />
                  <p className="font-bold text-navy-900">
                    Independent Advisory
                  </p>
                  <p className="text-gray-600">No conflicts, no commissions</p>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </div>
      </section>

      {/* Our Approach Section */}
      <section className="py-24 bg-navy-50">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <ScrollReveal>
            <h2 className="text-3xl font-bold text-navy-900">Our Approach</h2>
            <div className="w-16 h-1 bg-gold-400 mx-auto mt-4" />
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0 }}
            >
              <p className="text-5xl font-bold text-gold-200 mb-4">01</p>
              <h3 className="text-xl font-semibold text-navy-900">
                Understand
              </h3>
              <p className="text-gray-600 mt-2">
                We listen, review your lease, and understand your position.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
            >
              <p className="text-5xl font-bold text-gold-200 mb-4">02</p>
              <h3 className="text-xl font-semibold text-navy-900">Analyse</h3>
              <p className="text-gray-600 mt-2">
                We benchmark against market data and identify key risks and
                opportunities.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <p className="text-5xl font-bold text-gold-200 mb-4">03</p>
              <h3 className="text-xl font-semibold text-navy-900">Advise</h3>
              <p className="text-gray-600 mt-2">
                We deliver clear, actionable recommendations tailored to your
                goals.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-white text-center">
        <ScrollReveal>
          <h2 className="text-3xl font-bold text-navy-900">
            Let&apos;s Talk
          </h2>
          <p className="text-gray-600 mt-4 max-w-xl mx-auto">
            Whether you need a lease reviewed, terms negotiated, or strategic
            advice on your next move, we are here to help.
          </p>
          <Link
            href="/contact"
            className="inline-block mt-8 px-8 py-3 bg-gold-400 text-navy-900 font-semibold rounded-lg hover:bg-gold-500 transition-colors"
          >
            Get in Touch
          </Link>
        </ScrollReveal>
      </section>
    </main>
  );
}
