import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getDashboardAnalytics } from "@/lib/data";
import { toDateOnlyString } from "@/lib/review-engine";
import { CATEGORICAL_COLORS, OTHER_COLOR, STATUS_COLORS } from "@/lib/chart-colors";
import DashboardDateFilter from "@/components/dashboard-date-filter";
import DonutChart from "@/components/charts/donut-chart";
import StackedBarChart from "@/components/charts/stacked-bar-chart";
import TopicBarChart from "@/components/charts/topic-bar-chart";

function StatCell({ label, value, tone }: { label: string; value: string | number; tone?: "danger" | "success" }) {
  return (
    <div className="bg-white p-4">
      <p className="font-mono-label text-[10px] uppercase tracking-[0.14em] text-muted">{label}</p>
      <p
        className={`mt-1.5 font-display text-2xl font-semibold tracking-tight sm:text-3xl ${
          tone === "danger" ? "text-danger" : tone === "success" ? "text-success" : "text-primary"
        }`}
      >
        {value}
      </p>
    </div>
  );
}

function shortDate(dateStr: string) {
  const [, m, d] = dateStr.split("-");
  return `${d}/${m}`;
}

function presetRange(days: number | null) {
  const to = toDateOnlyString(new Date());
  if (days === null) return { from: "2015-01-01", to };
  const start = new Date();
  start.setDate(start.getDate() - (days - 1));
  return { from: toDateOnlyString(start), to };
}

export default async function DashboardsPage({
  searchParams,
}: {
  searchParams: Promise<{ range?: string; from?: string; to?: string }>;
}) {
  const sp = await searchParams;
  const isCustom = Boolean(sp.from && sp.to);
  const activeRange = sp.range ?? "30";

  const RANGE_DAYS: Record<string, number | null> = { "7": 7, "30": 30, "90": 90, "180": 180, all: null };
  const { from, to } = isCustom
    ? { from: sp.from!, to: sp.to! }
    : presetRange(RANGE_DAYS[activeRange] ?? 30);

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const stats = await getDashboardAnalytics(supabase, user!.id, { from, to });

  const overTimeData = stats.overTime.map((b) => ({
    label: stats.bucketMode === "day" ? shortDate(b.date) : shortDate(b.date),
    correct: b.correct,
    incorrect: b.incorrect,
  }));

  const TOP_SUBJECTS = 7;
  const sortedSubjects = stats.subjectDistribution;
  const topSubjects = sortedSubjects.slice(0, TOP_SUBJECTS);
  const otherTotal = sortedSubjects.slice(TOP_SUBJECTS).reduce((sum, s) => sum + s.total, 0);
  const subjectSlices = [
    ...topSubjects.map((s, i) => ({ label: s.name, value: s.total, color: CATEGORICAL_COLORS[i] })),
    ...(otherTotal > 0 ? [{ label: "Outras", value: otherTotal, color: OTHER_COLOR }] : []),
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="font-mono-label text-[11px] uppercase tracking-[0.16em] text-accent-dark">
            Análise de desempenho
          </p>
          <h1 className="mt-1 font-display text-2xl font-semibold tracking-tight text-foreground">Dashboards</h1>
        </div>
      </div>

      <DashboardDateFilter activeRange={activeRange} isCustom={isCustom} from={from} to={to} />

      <div className="overflow-hidden rounded-sm border border-border bg-white">
        <div className="border-b border-border bg-surface px-4 py-2.5 sm:px-5">
          <span className="font-mono-label text-[10px] uppercase tracking-[0.14em] text-muted">
            Resumo do período
          </span>
        </div>
        <div className="grid grid-cols-2 gap-px bg-border sm:grid-cols-4">
          <StatCell label="Questões" value={stats.totalQuestions} />
          <StatCell label="Corretas" value={stats.totalCorrect} tone="success" />
          <StatCell label="Incorretas" value={stats.totalIncorrect} tone="danger" />
          <StatCell label="% de acerto" value={`${stats.accuracy}%`} />
        </div>
      </div>

      {stats.weakTopics.length > 0 && (
        <div className="overflow-hidden rounded-sm border border-border border-l-4 border-l-danger bg-white">
          <div className="border-b border-border bg-surface px-4 py-2.5 sm:px-5">
            <span className="font-mono-label text-[10px] uppercase tracking-[0.14em] text-muted">
              Prioridades de estudo · acerto abaixo de 70%
            </span>
          </div>
          <ul className="divide-y divide-dashed divide-border">
            {stats.weakTopics.map((t, i) => (
              <li key={t.topicId} className="flex items-center justify-between gap-3 px-4 py-3 sm:px-5">
                <div className="flex min-w-0 items-baseline gap-2.5">
                  <span className="font-mono-label text-[10px] text-muted/60">{String(i + 1).padStart(2, "0")}</span>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-foreground">{t.topicName}</p>
                    <p className="truncate text-xs text-muted">
                      {t.subjectName} · {t.accuracy}% de acerto ({t.correct}/{t.total})
                    </p>
                  </div>
                </div>
                <Link
                  href={`/app/registrar?topicId=${t.topicId}`}
                  className="shrink-0 rounded-sm bg-danger px-3 py-1.5 font-mono-label text-[10px] uppercase tracking-wide text-white transition-colors hover:opacity-90"
                >
                  Estudar
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="rounded-sm border border-border bg-white">
        <h2 className="border-b border-border bg-surface px-4 py-2.5 font-mono-label text-[10px] uppercase tracking-[0.14em] text-muted sm:px-5">
          Corretas e incorretas ao longo do tempo
        </h2>
        <div className="p-4 sm:p-5">
          <StackedBarChart data={overTimeData} />
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div className="rounded-sm border border-border bg-white">
          <h2 className="border-b border-border bg-surface px-4 py-2.5 font-mono-label text-[10px] uppercase tracking-[0.14em] text-muted sm:px-5">
            Corretas vs. incorretas
          </h2>
          <div className="p-4 sm:p-5">
            <DonutChart
              slices={[
                { label: "Corretas", value: stats.totalCorrect, color: STATUS_COLORS.correct },
                { label: "Incorretas", value: stats.totalIncorrect, color: STATUS_COLORS.incorrect },
              ]}
              centerValue={`${stats.accuracy}%`}
              centerLabel="Acerto"
            />
          </div>
        </div>

        <div className="rounded-sm border border-border bg-white">
          <h2 className="border-b border-border bg-surface px-4 py-2.5 font-mono-label text-[10px] uppercase tracking-[0.14em] text-muted sm:px-5">
            Questões por matéria
          </h2>
          <div className="p-4 sm:p-5">
            <DonutChart
              slices={subjectSlices}
              centerValue={String(stats.totalQuestions)}
              centerLabel="Questões"
            />
          </div>
        </div>
      </div>

      <div className="rounded-sm border border-border bg-white">
        <h2 className="border-b border-border bg-surface px-4 py-2.5 font-mono-label text-[10px] uppercase tracking-[0.14em] text-muted sm:px-5">
          Acertos e erros por tópico · piores primeiro
        </h2>
        <TopicBarChart topics={stats.topicPerformance} />
      </div>
    </div>
  );
}
