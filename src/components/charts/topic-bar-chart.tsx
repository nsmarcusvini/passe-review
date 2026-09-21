import { STATUS_COLORS } from "@/lib/chart-colors";

export type TopicPerf = {
  topicId: string;
  topicName: string;
  subjectName: string;
  correct: number;
  incorrect: number;
  total: number;
  accuracy: number;
};

const WEAK_THRESHOLD = 70;
const MIN_SAMPLE = 3;

export default function TopicBarChart({ topics }: { topics: TopicPerf[] }) {
  if (topics.length === 0) {
    return (
      <p className="px-4 py-6 text-sm text-muted sm:px-5">Nenhuma questão registrada no período.</p>
    );
  }

  return (
    <ul className="divide-y divide-dashed divide-border">
      {topics.map((t, i) => {
        const isWeak = t.total >= MIN_SAMPLE && t.accuracy < WEAK_THRESHOLD;
        return (
          <li key={t.topicId} className="px-4 py-3.5 sm:px-5">
            <div className="mb-1.5 flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
              <span className="flex min-w-0 flex-wrap items-baseline gap-2">
                <span className="font-mono-label text-[10px] text-muted/60">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="truncate text-sm font-medium text-foreground">{t.topicName}</span>
                <span className="shrink-0 text-xs text-muted">{t.subjectName}</span>
                {isWeak && (
                  <span className="shrink-0 rounded-sm bg-danger-bg px-1.5 py-0.5 font-mono-label text-[9px] uppercase tracking-wide text-danger">
                    Estudar mais
                  </span>
                )}
              </span>
              <span className="shrink-0 font-mono-label text-[11px] tracking-wide text-muted">
                {t.accuracy}% · {t.correct}/{t.total}
              </span>
            </div>
            <div className="flex h-1.5 w-full overflow-hidden rounded-full bg-surface">
              {t.correct > 0 && (
                <div
                  style={{ width: `${(t.correct / t.total) * 100}%`, backgroundColor: STATUS_COLORS.correct }}
                  title={`${t.correct} corretas`}
                />
              )}
              {t.incorrect > 0 && (
                <div
                  style={{ width: `${(t.incorrect / t.total) * 100}%`, backgroundColor: STATUS_COLORS.incorrect }}
                  title={`${t.incorrect} incorretas`}
                />
              )}
            </div>
          </li>
        );
      })}
    </ul>
  );
}
