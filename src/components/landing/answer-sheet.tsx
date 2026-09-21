"use client";

import { useEffect, useRef, useState } from "react";
import { mono } from "@/lib/landing-fonts";

const LETTERS = ["A", "B", "C", "D", "E"] as const;
const ROWS = [
  { n: "01", marked: 2 },
  { n: "02", marked: 0 },
  { n: "03", marked: 3 },
  { n: "04", marked: 1 },
  { n: "05", marked: 4 },
];

export default function AnswerSheet() {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const el = ref.current;
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
      { threshold: 0.5 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className="w-full max-w-xs rotate-[1.2deg] rounded-sm border border-border bg-white p-5 shadow-[0_18px_40px_-16px_rgba(0,59,112,0.35)]"
    >
      <div className="flex items-center justify-between border-b border-dashed border-border pb-3">
        <span className={`${mono.className} text-[10px] uppercase tracking-[0.16em] text-muted`}>
          Cartão-resposta
        </span>
        <span className={`${mono.className} text-[10px] text-muted`}>Nº 0041</span>
      </div>

      <div className="mt-4 space-y-3">
        {ROWS.map((row, i) => (
          <div key={row.n} className="flex items-center gap-3">
            <span className={`${mono.className} text-[11px] text-muted`}>{row.n}</span>
            <div className="flex gap-2">
              {LETTERS.map((letter, li) => {
                const filled = active && li === row.marked;
                return (
                  <span
                    key={letter}
                    className={`${mono.className} flex h-5 w-5 items-center justify-center rounded-full border text-[9px] font-bold transition-all ${
                      filled
                        ? "border-accent-dark bg-accent text-primary-dark"
                        : "border-border text-muted"
                    }`}
                    style={{
                      transitionDuration: "380ms",
                      transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
                      transitionDelay: `${i * 260}ms`,
                    }}
                  >
                    {letter}
                  </span>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <p
        className={`${mono.className} mt-4 border-t border-dashed border-border pt-3 text-[10px] leading-relaxed text-muted`}
      >
        cada questão marcada vira uma revisão agendada
      </p>
    </div>
  );
}
