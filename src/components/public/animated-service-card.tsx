"use client";

import { motion } from "framer-motion";

export function AnimatedServiceCard({
  icon,
  title,
  description,
  index = 0,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  index?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.1, ease: "easeOut" }}
      whileHover={{
        y: -8,
        transition: { duration: 0.25 },
      }}
      className="group rounded-2xl border border-gray-200 bg-white p-8 shadow-sm transition-shadow duration-300 hover:border-gold-400 hover:shadow-lg"
    >
      <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-navy-50 text-navy-700 transition-colors group-hover:bg-gold-100 group-hover:text-gold-700">
        {icon}
      </div>
      <h3 className="mb-3 text-lg font-semibold text-navy-900">{title}</h3>
      <p className="text-sm leading-relaxed text-gray-600">{description}</p>
    </motion.div>
  );
}
