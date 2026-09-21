import { STATUS_COLORS } from "@/lib/chart-colors";

export type BarBucket = { label: string; correct: number; incorrect: number };

export default function StackedBarChart({ data }: { data: BarBucket[] }) {
  if (data.length === 0) {
    return (
      <div className="flex h-[180px] items-center justify-center text-sm text-muted">
        Sem dados no período.
      </div>
    );
  }

  const max = Math.max(...data.map((d) => d.correct + d.incorrect), 1);
  const W = Math.max(320, data.length * 26);
  const H = 180;
  const padLeft = 4;
  const padBottom = 20;
  const chartTop = 8;
  const chartH = H - padBottom - chartTop;
  const gap = 6;
  const barW = Math.max(6, (W - padLeft - 8) / data.length - gap);
  const gapY = 2;
  const labelStride = Math.max(1, Math.ceil(data.length / 8));

  return (
    <div>
      <div className="w-full overflow-x-auto">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          className="block"
          style={{ width: "100%", minWidth: data.length > 14 ? W : undefined }}
          role="img"
          aria-label="Questões corretas e incorretas ao longo do tempo"
        >
          {[0, 0.5, 1].map((f) => (
            <line
              key={f}
              x1={padLeft}
              x2={W - 4}
              y1={chartTop + chartH * (1 - f)}
              y2={chartTop + chartH * (1 - f)}
              stroke="#e1e0d9"
              strokeWidth={1}
            />
          ))}
          {data.map((d, i) => {
            const x = padLeft + i * (barW + gap);
            const correctH = (d.correct / max) * chartH;
            const incorrectH = (d.incorrect / max) * chartH;
            const baseY = chartTop + chartH;
            const hasBoth = d.correct > 0 && d.incorrect > 0;
            return (
              <g key={d.label}>
                {d.correct > 0 && (
                  <rect x={x} y={baseY - correctH} width={barW} height={correctH} fill={STATUS_COLORS.correct}>
                    <title>
                      {d.label}: {d.correct} corretas
                    </title>
                  </rect>
                )}
                {d.incorrect > 0 && (
                  <rect
                    x={x}
                    y={baseY - correctH - (hasBoth ? gapY : 0) - incorrectH}
                    width={barW}
                    height={incorrectH}
                    fill={STATUS_COLORS.incorrect}
                  >
                    <title>
                      {d.label}: {d.incorrect} incorretas
                    </title>
                  </rect>
                )}
                {i % labelStride === 0 && (
                  <text x={x + barW / 2} y={H - 4} textAnchor="middle" style={{ fontSize: 8, fill: "#5b6b80" }}>
                    {d.label}
                  </text>
                )}
              </g>
            );
          })}
        </svg>
      </div>
      <div className="mt-3 flex items-center gap-4 font-mono-label text-[10px] uppercase tracking-wide text-muted">
        <span className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full" style={{ backgroundColor: STATUS_COLORS.correct }} />
          Corretas
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full" style={{ backgroundColor: STATUS_COLORS.incorrect }} />
          Incorretas
        </span>
      </div>
    </div>
  );
}
