"use client";

import { ScrollReveal } from "@/components/public/scroll-reveal";
import { ContactForm } from "@/components/public/contact-form";
import { Mail, MapPin, Clock } from "lucide-react";

export default function ContactPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="bg-navy-900 pt-32 pb-16">
        <div className="max-w-6xl mx-auto px-6">
          <ScrollReveal>
            <p className="text-xs uppercase tracking-widest text-gold-400 mb-4">
              CONTACT US
            </p>
            <h1 className="text-4xl font-bold text-white">Get in Touch</h1>
            <p className="text-navy-200 mt-4 max-w-2xl">
              Have a question about your commercial lease? We&apos;re here to help.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* Form Section */}
      <section className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-16">
            {/* Left — Contact Form */}
            <div className="lg:col-span-3">
              <ScrollReveal>
                <ContactForm />
              </ScrollReveal>
            </div>

            {/* Right — Info Cards */}
            <div className="lg:col-span-2">
              <ScrollReveal delay={0.2}>
                <div className="space-y-8">
                  {/* Location */}
                  <div className="flex gap-4 items-start">
                    <div className="w-10 h-10 rounded-lg bg-gold-50 flex items-center justify-center shrink-0">
                      <MapPin className="text-gold-600 h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-navy-900">Location</h3>
                      <p className="text-gray-600">Australia &amp; New Zealand</p>
                    </div>
                  </div>

                  {/* Enquiries */}
                  <div className="flex gap-4 items-start">
                    <div className="w-10 h-10 rounded-lg bg-gold-50 flex items-center justify-center shrink-0">
                      <Mail className="text-gold-600 h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-navy-900">Enquiries</h3>
                      <p className="text-gray-600">
                        Submit the form and we&apos;ll respond within 24 hours.
                      </p>
                    </div>
                  </div>

                  {/* Business Hours */}
                  <div className="flex gap-4 items-start">
                    <div className="w-10 h-10 rounded-lg bg-gold-50 flex items-center justify-center shrink-0">
                      <Clock className="text-gold-600 h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-navy-900">Business Hours</h3>
                      <p className="text-gray-600">Monday – Friday, 9am – 5pm AEST</p>
                    </div>
                  </div>

                  {/* What Happens Next? */}
                  <div className="mt-8 rounded-2xl border border-gold-200 bg-gold-50/50 p-6">
                    <h3 className="text-lg font-semibold text-navy-900 mb-4">
                      What Happens Next?
                    </h3>
                    <div className="space-y-4">
                      <div className="flex gap-3">
                        <div className="w-6 h-6 rounded-full bg-gold-400 text-white text-xs font-bold flex items-center justify-center shrink-0">
                          1
                        </div>
                        <p className="text-sm text-gray-600">
                          We&apos;ll review your enquiry within 24 hours
                        </p>
                      </div>
                      <div className="flex gap-3">
                        <div className="w-6 h-6 rounded-full bg-gold-400 text-white text-xs font-bold flex items-center justify-center shrink-0">
                          2
                        </div>
                        <p className="text-sm text-gray-600">
                          Schedule a free initial consultation
                        </p>
                      </div>
                      <div className="flex gap-3">
                        <div className="w-6 h-6 rounded-full bg-gold-400 text-white text-xs font-bold flex items-center justify-center shrink-0">
                          3
                        </div>
                        <p className="text-sm text-gray-600">
                          Provide a tailored advisory proposal
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
