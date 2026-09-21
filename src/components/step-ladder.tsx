import { intervalDaysForStep } from "@/lib/review-engine";

const RUNGS = [
  { days: 1, label: "24H" },
  { days: 7, label: "7D" },
  { days: 30, label: "30D" },
  { days: 45, label: "45D" },
  { days: 60, label: "60D" },
];

/** Posição desta revisão na escada de repetição espaçada (24h -> 7d -> 30d -> 45d -> 60d, com ciclo). */
export default function StepLadder({ step }: { step: number }) {
  const days = intervalDaysForStep(step);
  const activeIndex = RUNGS.findIndex((r) => r.days === days);
  const cycleCount = step >= RUNGS.length ? Math.floor((step - RUNGS.length) / 3) + 1 : 0;

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center">
        {RUNGS.map((rung, i) => {
          const done = i < activeIndex;
          const isActive = i === activeIndex;
          return (
            <div key={rung.label} className="flex items-center">
              {i > 0 && (
                <span className={`h-px w-2.5 ${done || isActive ? "bg-primary/40" : "bg-border"}`} />
              )}
              <span
                title={rung.label}
                className={`block h-1.5 w-1.5 rounded-full ${
                  isActive
                    ? "scale-[1.7] bg-accent"
                    : done
                      ? "bg-primary/50"
                      : "border border-border bg-white"
                }`}
              />
            </div>
          );
        })}
      </div>
      <span className="font-mono-label text-[11px] tracking-wide text-muted">
        {RUNGS[activeIndex]?.label ?? `${days}D`}
        {cycleCount > 0 && <span className="text-muted/60">×{cycleCount + 1}</span>}
      </span>
    </div>
  );
}
