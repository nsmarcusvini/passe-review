import { describeArcPath } from "@/lib/chart-colors";

export type DonutSlice = {
  label: string;
  value: number;
  color: string;
};

export default function DonutChart({
  slices,
  centerLabel,
  centerValue,
}: {
  slices: DonutSlice[];
  centerLabel?: string;
  centerValue?: string;
}) {
  const total = slices.reduce((sum, s) => sum + s.value, 0);
  const size = 168;
  const cx = size / 2;
  const cy = size / 2;
  const rOuter = 76;
  const rInner = 48;

  const nonZeroSlices = slices.filter((s) => s.value > 0);
  const cumulative = nonZeroSlices.reduce<number[]>((acc, s, i) => {
    acc.push((acc[i - 1] ?? 0) + s.value);
    return acc;
  }, []);
  const arcs = nonZeroSlices.map((s, i) => {
    const startAngle = ((cumulative[i] - s.value) / total) * Math.PI * 2;
    const endAngle = (cumulative[i] / total) * Math.PI * 2;
    const gap = nonZeroSlices.length > 1 ? 0.012 : 0;
    return {
      ...s,
      path: describeArcPath(cx, cy, rOuter, rInner, startAngle + gap, endAngle - gap),
      pct: Math.round((s.value / total) * 100),
    };
  });

  if (total === 0) {
    return (
      <div className="flex h-[168px] items-center justify-center text-sm text-muted">
        Sem dados no período.
      </div>
    );
  }

  return (
    <div className="flex flex-wrap items-center gap-6">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} role="img" aria-label="Gráfico de pizza">
        {arcs.map((a) => (
          <path key={a.label} d={a.path} fill={a.color}>
            <title>
              {a.label}: {a.value} ({a.pct}%)
            </title>
          </path>
        ))}
        <text
          x={cx}
          y={cy - 2}
          textAnchor="middle"
          className="font-display"
          style={{ fontSize: 20, fontWeight: 600, fill: "#111827" }}
        >
          {centerValue}
        </text>
        {centerLabel && (
          <text
            x={cx}
            y={cy + 16}
            textAnchor="middle"
            style={{ fontSize: 9, letterSpacing: "0.06em", fill: "#5b6b80", textTransform: "uppercase" }}
          >
            {centerLabel}
          </text>
        )}
      </svg>

      <ul className="min-w-[140px] flex-1 space-y-1.5">
        {arcs.map((a) => (
          <li key={a.label} className="flex items-center justify-between gap-3 text-sm">
            <span className="flex min-w-0 items-center gap-2">
              <span
                className="h-2.5 w-2.5 shrink-0 rounded-full"
                style={{ backgroundColor: a.color }}
                aria-hidden
              />
              <span className="truncate text-foreground">{a.label}</span>
            </span>
            <span className="shrink-0 font-mono-label text-[11px] tracking-wide text-muted">
              {a.value} · {a.pct}%
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
