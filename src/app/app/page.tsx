import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getDashboardStats, getDashboardAnalytics } from "@/lib/data";
import { toDateOnlyString } from "@/lib/review-engine";
import { CATEGORICAL_COLORS, OTHER_COLOR, STATUS_COLORS } from "@/lib/chart-colors";
import DashboardDateFilter from "@/components/dashboard-date-filter";
import DonutChart from "@/components/charts/donut-chart";
import StackedBarChart from "@/components/charts/stacked-bar-chart";
import TopicBarChart from "@/components/charts/topic-bar-chart";

function StatCell({
  label,
  value,
  tone,
}: {
  label: string;
  value: string | number;
  tone?: "danger" | "success";
}) {
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

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ range?: string; from?: string; to?: string }>;
}) {
  const sp = await searchParams;
  const isCustom = Boolean(sp.from && sp.to);
  const activeRange = sp.range ?? "30";
  const RANGE_DAYS: Record<string, number | null> = { "7": 7, "30": 30, "90": 90, "180": 180, all: null };
  const { from, to } = isCustom ? { from: sp.from!, to: sp.to! } : presetRange(RANGE_DAYS[activeRange] ?? 30);

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const [stats, analytics] = await Promise.all([
    getDashboardStats(supabase, user!.id),
    getDashboardAnalytics(supabase, user!.id, { from, to }),
  ]);

  const pending = stats.atrasadasCount + stats.hojeCount;
  const today = new Date().toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" });

  const overTimeData = analytics.overTime.map((b) => ({
    label: shortDate(b.date),
    correct: b.correct,
    incorrect: b.incorrect,
  }));

  const TOP_SUBJECTS = 7;
  const topSubjects = analytics.subjectDistribution.slice(0, TOP_SUBJECTS);
  const otherTotal = analytics.subjectDistribution.slice(TOP_SUBJECTS).reduce((sum, s) => sum + s.total, 0);
  const subjectSlices = [
    ...topSubjects.map((s, i) => ({ label: s.name, value: s.total, color: CATEGORICAL_COLORS[i] })),
    ...(otherTotal > 0 ? [{ label: "Outras", value: otherTotal, color: OTHER_COLOR }] : []),
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="font-mono-label text-[11px] uppercase tracking-[0.16em] text-accent-dark">
            Boletim do dia
          </p>
          <h1 className="mt-1 font-display text-2xl font-semibold tracking-tight text-foreground">
            Visão geral
          </h1>
        </div>
        <Link
          href="/app/registrar"
          className="rounded-sm bg-accent px-4 py-2 font-mono-label text-[11px] uppercase tracking-wide text-primary-dark transition-colors hover:bg-accent-dark"
        >
          + Registrar questões
        </Link>
      </div>

      {/* FICHA — boletim de desempenho */}
      <div className="overflow-hidden rounded-sm border border-border bg-white">
        <div className="flex items-center justify-between border-b border-border bg-surface px-4 py-2.5 sm:px-5">
          <span className="font-mono-label text-[10px] uppercase tracking-[0.14em] text-muted">
            Ficha de desempenho
          </span>
          <span className="font-mono-label text-[10px] text-muted">{today}</span>
        </div>
        <div className="grid grid-cols-2 gap-px bg-border sm:grid-cols-4">
          <StatCell label="Atrasadas" value={stats.atrasadasCount} tone={stats.atrasadasCount > 0 ? "danger" : undefined} />
          <StatCell label="Hoje" value={stats.hojeCount} />
          <StatCell label="% de acerto geral" value={`${stats.accuracy}%`} />
          <StatCell label="Sequência" value={`${stats.streak}d`} />
        </div>
      </div>

      {pending > 0 && (
        <Link
          href="/app/revisoes"
          className="flex items-center justify-between gap-3 rounded-sm border border-border border-l-4 border-l-accent-dark bg-white p-4 transition-colors hover:bg-surface"
        >
          <div>
            <p className="font-mono-label text-[10px] uppercase tracking-[0.14em] text-muted">
              Pendente hoje
            </p>
            <p className="mt-0.5 text-sm font-medium text-foreground">
              {pending} revisão{pending === 1 ? "" : "ões"} esperando na fila
            </p>
          </div>
          <span className="shrink-0 font-display text-lg text-primary">→</span>
        </Link>
      )}

      {/* ANÁLISE — gráficos por período */}
      <div>
        <p className="font-mono-label text-[11px] uppercase tracking-[0.16em] text-accent-dark">
          Análise de desempenho
        </p>
        <h2 className="mt-1 font-display text-xl font-semibold tracking-tight text-foreground">
          Dashboards
        </h2>
      </div>

      <DashboardDateFilter activeRange={activeRange} isCustom={isCustom} from={from} to={to} />

      <div className="overflow-hidden rounded-sm border border-border bg-white">
        <div className="border-b border-border bg-surface px-4 py-2.5 sm:px-5">
          <span className="font-mono-label text-[10px] uppercase tracking-[0.14em] text-muted">
            Resumo do período
          </span>
        </div>
        <div className="grid grid-cols-2 gap-px bg-border sm:grid-cols-4">
          <StatCell label="Questões" value={analytics.totalQuestions} />
          <StatCell label="Corretas" value={analytics.totalCorrect} tone="success" />
          <StatCell label="Incorretas" value={analytics.totalIncorrect} tone="danger" />
          <StatCell label="% de acerto" value={`${analytics.accuracy}%`} />
        </div>
      </div>

      {analytics.weakTopics.length > 0 && (
        <div className="overflow-hidden rounded-sm border border-border border-l-4 border-l-danger bg-white">
          <div className="border-b border-border bg-surface px-4 py-2.5 sm:px-5">
            <span className="font-mono-label text-[10px] uppercase tracking-[0.14em] text-muted">
              Prioridades de estudo · acerto abaixo de 70%
            </span>
          </div>
          <ul className="divide-y divide-dashed divide-border">
            {analytics.weakTopics.map((t, i) => (
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
                { label: "Corretas", value: analytics.totalCorrect, color: STATUS_COLORS.correct },
                { label: "Incorretas", value: analytics.totalIncorrect, color: STATUS_COLORS.incorrect },
              ]}
              centerValue={`${analytics.accuracy}%`}
              centerLabel="Acerto"
            />
          </div>
        </div>

        <div className="rounded-sm border border-border bg-white">
          <h2 className="border-b border-border bg-surface px-4 py-2.5 font-mono-label text-[10px] uppercase tracking-[0.14em] text-muted sm:px-5">
            Questões por matéria
          </h2>
          <div className="p-4 sm:p-5">
            <DonutChart slices={subjectSlices} centerValue={String(analytics.totalQuestions)} centerLabel="Questões" />
          </div>
        </div>
      </div>

      <div className="rounded-sm border border-border bg-white">
        <h2 className="border-b border-border bg-surface px-4 py-2.5 font-mono-label text-[10px] uppercase tracking-[0.14em] text-muted sm:px-5">
          Desempenho por matéria
        </h2>
        {analytics.subjectPerformance.length === 0 ? (
          <p className="px-4 py-6 text-sm text-muted sm:px-5">
            Nenhuma questão registrada no período. Comece registrando sua primeira sessão de estudo.
          </p>
        ) : (
          <div className="divide-y divide-dashed divide-border">
            {analytics.subjectPerformance.map((s, i) => (
              <div key={s.name} className="px-4 py-3.5 sm:px-5">
                <div className="mb-1.5 flex items-baseline justify-between gap-3">
                  <span className="flex items-baseline gap-2.5 truncate text-sm font-medium text-foreground">
                    <span className="font-mono-label text-[10px] text-muted/60">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    {s.name}
                  </span>
                  <span className="shrink-0 font-mono-label text-[11px] tracking-wide text-muted">
                    {s.accuracy}% · {s.total}q
                  </span>
                </div>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-surface">
                  <div className="h-full rounded-full bg-primary" style={{ width: `${s.accuracy}%` }} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="rounded-sm border border-border bg-white">
        <h2 className="border-b border-border bg-surface px-4 py-2.5 font-mono-label text-[10px] uppercase tracking-[0.14em] text-muted sm:px-5">
          Acertos e erros por tópico · piores primeiro
        </h2>
        <TopicBarChart topics={analytics.topicPerformance} />
      </div>

      <div className="rounded-sm border border-border bg-white">
        <h2 className="border-b border-border bg-surface px-4 py-2.5 font-mono-label text-[10px] uppercase tracking-[0.14em] text-muted sm:px-5">
          Marcadas para revisar
        </h2>
        {stats.needsRevisit.length === 0 ? (
          <p className="px-4 py-6 text-sm text-muted sm:px-5">
            Nenhuma questão marcada como &quot;voltar depois&quot;.
          </p>
        ) : (
          <ul className="divide-y divide-dashed divide-border">
            {stats.needsRevisit.map((item, i) => (
              <li key={i} className="flex items-center justify-between gap-3 px-4 py-3 sm:px-5">
                <div className="flex items-baseline gap-2.5 min-w-0">
                  <span className="font-mono-label text-[10px] text-muted/60">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-foreground">{item.topicName}</p>
                    <p className="truncate text-xs text-muted">{item.subjectName}</p>
                  </div>
                </div>
                <span className="shrink-0 font-mono-label text-[11px] tracking-wide text-muted">
                  {new Date(item.sessionDate + "T00:00:00").toLocaleDateString("pt-BR")}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
