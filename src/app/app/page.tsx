import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getDashboardStats } from "@/lib/data";

function StatCell({
  label,
  value,
  accent,
}: {
  label: string;
  value: string | number;
  accent?: boolean;
}) {
  return (
    <div className="bg-white p-4">
      <p className="font-mono-label text-[10px] uppercase tracking-[0.14em] text-muted">{label}</p>
      <p
        className={`mt-1.5 font-display text-2xl font-semibold tracking-tight sm:text-3xl ${
          accent ? "text-danger" : "text-primary"
        }`}
      >
        {value}
      </p>
    </div>
  );
}

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const stats = await getDashboardStats(supabase, user!.id);
  const pending = stats.atrasadasCount + stats.hojeCount;
  const today = new Date().toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

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
          <StatCell label="Atrasadas" value={stats.atrasadasCount} accent={stats.atrasadasCount > 0} />
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

      <div className="rounded-sm border border-border bg-white">
        <h2 className="border-b border-border bg-surface px-4 py-2.5 font-mono-label text-[10px] uppercase tracking-[0.14em] text-muted sm:px-5">
          Desempenho por matéria
        </h2>
        {stats.performanceBySubject.length === 0 ? (
          <p className="px-4 py-6 text-sm text-muted sm:px-5">
            Nenhuma questão registrada ainda. Comece registrando sua primeira sessão de estudo.
          </p>
        ) : (
          <div className="divide-y divide-dashed divide-border">
            {stats.performanceBySubject.map((s, i) => (
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
                  <div
                    className="h-full rounded-full bg-primary"
                    style={{ width: `${s.accuracy}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
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
