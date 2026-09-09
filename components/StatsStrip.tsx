"use client";

import { useEffect, useRef, useState } from "react";

interface Stat {
  value: string;
  numericEnd: number;
  suffix: string;
  label: string;
  icon: string;
}

const STATS: Stat[] = [
  { value: "10,000+", numericEnd: 10000, suffix: "+", label: "Itineraries Generated", icon: "map" },
  { value: "50+", numericEnd: 50, suffix: "+", label: "Verified Destinations", icon: "location_on" },
  { value: "4.9★", numericEnd: 49, suffix: "", label: "Average Rating", icon: "star" },
  { value: "Free", numericEnd: 0, suffix: "", label: "Always & Forever", icon: "volunteer_activism" },
];

function AnimatedNumber({ end, suffix, started }: { end: number; suffix: string; started: boolean }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!started || end === 0) return;
    const duration = 1800;
    const steps = 60;
    const increment = end / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);
    return () => clearInterval(timer);
  }, [started, end]);

  if (end === 0) return <span>Free</span>;
  if (end === 49) return <span>{started ? `${(count / 10).toFixed(1)}★` : "0.0★"}</span>;
  return <span>{started ? `${count.toLocaleString("en-IN")}${suffix}` : `0${suffix}`}</span>;
}

export default function StatsStrip() {
  const ref = useRef<HTMLDivElement>(null);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setStarted(true); observer.disconnect(); } },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className="w-full bg-surface-container-low dark:bg-[#1C1B1B] border-y-2 border-on-surface dark:border-[rgba(250,247,242,0.25)] py-8 transition-colors"
    >
      <div className="w-full max-w-[84rem] mx-auto px-margin-mobile md:px-margin-tablet lg:px-margin-desktop">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-0 lg:divide-x-2 lg:divide-on-surface dark:lg:divide-[rgba(250,247,242,0.2)]">
          {STATS.map((stat) => (
            <div key={stat.label} className="flex flex-col items-center text-center lg:px-8">
              <span className="material-symbols-outlined text-[22px] text-primary dark:text-[#1E8C80] mb-2">
                {stat.icon}
              </span>
              <span className="font-serif text-3xl md:text-4xl text-on-surface dark:text-[#FAF7F2] font-normal leading-none mb-1">
                <AnimatedNumber end={stat.numericEnd} suffix={stat.suffix} started={started} />
              </span>
              <span className="font-sans text-[11px] uppercase tracking-widest text-outline dark:text-[rgba(250,247,242,0.5)] font-medium">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
