"use client";

import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";

function Counter({ value, suffix = "" }: { value: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    let start = 0;
    const duration = 2000;
    const startTime = performance.now();

    function step(currentTime: number) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      start = Math.floor(eased * value);
      setCount(start);
      if (progress < 1) requestAnimationFrame(step);
    }

    requestAnimationFrame(step);
  }, [isInView, value]);

  return (
    <span ref={ref} className="text-4xl font-bold text-gold-400 md:text-5xl">
      {count}
      {suffix}
    </span>
  );
}

export function StatsCounter({
  stats,
}: {
  stats: { value: number; suffix?: string; label: string }[];
}) {
  return (
    <section className="bg-navy-950 py-16">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-10 px-6 md:flex-row md:gap-0">
        {stats.map((stat, i) => (
          <div key={stat.label} className="flex items-center gap-10">
            <div className="text-center">
              <Counter value={stat.value} suffix={stat.suffix} />
              <p className="mt-2 text-sm font-medium uppercase tracking-wider text-navy-300">
                {stat.label}
              </p>
            </div>
            {i < stats.length - 1 && (
              <div className="hidden h-12 w-px bg-gold-400/30 md:block" />
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
