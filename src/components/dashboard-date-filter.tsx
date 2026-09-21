import Link from "next/link";

const PRESETS = [
  { key: "7", label: "7 dias" },
  { key: "30", label: "30 dias" },
  { key: "90", label: "90 dias" },
  { key: "180", label: "6 meses" },
  { key: "all", label: "Tudo" },
];

export default function DashboardDateFilter({
  activeRange,
  isCustom,
  from,
  to,
}: {
  activeRange: string;
  isCustom: boolean;
  from: string;
  to: string;
}) {
  return (
    <div className="flex flex-wrap items-center gap-3 rounded-sm border border-border bg-white p-3 sm:p-3.5">
      <div className="flex flex-wrap gap-1.5">
        {PRESETS.map((p) => (
          <Link
            key={p.key}
            href={`/app/dashboards?range=${p.key}`}
            className={`rounded-sm px-3 py-1.5 font-mono-label text-[11px] uppercase tracking-wide transition-colors ${
              !isCustom && activeRange === p.key
                ? "bg-primary text-white"
                : "bg-surface text-muted hover:text-foreground"
            }`}
          >
            {p.label}
          </Link>
        ))}
      </div>
      <form
        method="get"
        action="/app/dashboards"
        className="flex flex-wrap items-center gap-2 sm:ml-auto"
      >
        <input
          type="date"
          name="from"
          defaultValue={from}
          className="rounded-sm border border-border bg-white px-2 py-1.5 font-mono-label text-[11px] text-foreground"
        />
        <span className="text-muted">→</span>
        <input
          type="date"
          name="to"
          defaultValue={to}
          className="rounded-sm border border-border bg-white px-2 py-1.5 font-mono-label text-[11px] text-foreground"
        />
        <button
          type="submit"
          className={`rounded-sm px-3 py-1.5 font-mono-label text-[11px] uppercase tracking-wide transition-colors ${
            isCustom ? "bg-primary text-white" : "bg-surface text-muted hover:text-foreground"
          }`}
        >
          Aplicar
        </button>
      </form>
    </div>
  );
}
