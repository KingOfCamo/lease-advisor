import type { Metadata } from "next";
import { ContactForm } from "@/components/public/contact-form";
import { Building2, Mail, MapPin, Award } from "lucide-react";

export const metadata: Metadata = {
  title: "Contact — Ben Palmieri Consulting",
  description: "Get in touch for commercial lease advisory services across Australia and New Zealand",
};

export default function ContactPage() {
  return (
    <>
      {/* Header */}
      <section className="bg-navy-900 text-white">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold sm:text-4xl">Contact Us</h1>
          <p className="mt-3 max-w-2xl text-lg text-navy-200">
            Have a question about a commercial lease? Send us an enquiry and
            Ben will be in touch.
          </p>
        </div>
      </section>

      {/* Form + sidebar */}
      <section className="py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-5">
            {/* Form */}
            <div className="lg:col-span-3">
              <h2 className="mb-6 text-xl font-semibold text-navy-900">
                Send an Enquiry
              </h2>
              <ContactForm />
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-2 space-y-6">
              <div className="rounded-xl border border-gray-200 bg-gray-50 p-6">
                <h3 className="mb-4 text-lg font-semibold text-navy-900">
                  Contact Details
                </h3>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <Building2 className="mt-0.5 h-5 w-5 text-navy-900" />
                    <div>
                      <p className="font-medium text-navy-900">Ben Palmieri Consulting</p>
                      <p className="text-sm text-gray-500">Director | Leasing Consultant</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <MapPin className="mt-0.5 h-5 w-5 text-navy-900" />
                    <div>
                      <p className="text-sm text-gray-600">Australia & New Zealand</p>
                      <p className="text-xs text-gray-400">Including regional & remote areas</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <Mail className="mt-0.5 h-5 w-5 text-navy-900" />
                    <div>
                      <p className="text-sm text-gray-600">Send an enquiry via the form</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <Award className="mt-0.5 h-5 w-5 text-navy-900" />
                    <div>
                      <p className="text-sm text-gray-600">
                        Licensed Estate Agent
                        <br />
                        Licence No. 095428L
                      </p>
                    </div>
                  </li>
                </ul>
              </div>

              <div className="rounded-xl border border-navy-100 bg-navy-50 p-6">
                <h3 className="mb-2 text-sm font-semibold text-navy-900">
                  What Happens Next?
                </h3>
                <ol className="space-y-2 text-sm text-gray-600">
                  <li className="flex gap-2">
                    <span className="font-semibold text-navy-900">1.</span>
                    Your enquiry is received and reviewed
                  </li>
                  <li className="flex gap-2">
                    <span className="font-semibold text-navy-900">2.</span>
                    Ben will respond within 1 business day
                  </li>
                  <li className="flex gap-2">
                    <span className="font-semibold text-navy-900">3.</span>
                    We discuss your needs and provide a proposal
                  </li>
                </ol>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
