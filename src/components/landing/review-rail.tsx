"use client";

import { useEffect, useRef, useState } from "react";

const STEPS = ["24H", "7D", "30D", "45D", "60D", "30D", "45D", "60D"];

export default function ReviewRail() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setActive(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setActive(true);
          observer.disconnect();
        }
      },
      { threshold: 0.4 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={containerRef} className="w-full">
      <div className="relative flex items-center justify-between px-1 py-6 sm:px-3">
        <div className="absolute left-1 right-1 top-1/2 h-px -translate-y-1/2 bg-white/15 sm:left-3 sm:right-3" />
        <div
          className="absolute left-1 top-1/2 h-px -translate-y-1/2 bg-accent transition-[width] sm:left-3"
          style={{
            width: active ? "calc(100% - 0.5rem)" : "0%",
            transitionDuration: "1800ms",
            transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
          }}
        />
        {STEPS.map((label, i) => (
          <div key={i} className="relative z-10 flex flex-col items-center gap-1.5 sm:gap-2.5">
            <span
              className={`block h-2.5 w-2.5 rounded-full border-2 transition-all sm:h-3 sm:w-3 ${
                active ? "scale-125 border-accent bg-accent" : "border-white/25 bg-primary-dark"
              }`}
              style={{
                transitionDuration: "450ms",
                transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
                transitionDelay: `${i * 110}ms`,
              }}
            />
            <span
              className={`font-mono text-[8px] tracking-wide transition-colors duration-500 sm:text-[11px] ${
                active ? "text-accent-light" : "text-white/40"
              }`}
              style={{ transitionDelay: `${i * 110}ms` }}
            >
              {label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
