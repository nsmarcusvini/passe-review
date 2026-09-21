import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getDashboardStats } from "@/lib/data";

function StatCard({
  label,
  value,
  accent,
}: {
  label: string;
  value: string | number;
  accent?: boolean;
}) {
  return (
    <div className="rounded-xl border border-border bg-white p-4 shadow-sm">
      <p className="text-xs font-medium uppercase tracking-wide text-muted">{label}</p>
      <p className={`mt-1 text-2xl font-bold ${accent ? "text-accent-dark" : "text-primary"}`}>
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold text-foreground">Visão geral</h1>
        <Link
          href="/app/registrar"
          className="rounded-md bg-accent px-4 py-2 text-sm font-semibold text-primary-dark transition-colors hover:bg-accent-dark"
        >
          + Registrar questões
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard label="Revisões atrasadas" value={stats.atrasadasCount} accent={stats.atrasadasCount > 0} />
        <StatCard label="Revisões hoje" value={stats.hojeCount} />
        <StatCard label="% de acerto geral" value={`${stats.accuracy}%`} />
        <StatCard label="Sequência de estudo" value={`${stats.streak} dia${stats.streak === 1 ? "" : "s"}`} />
      </div>

      {(stats.atrasadasCount > 0 || stats.hojeCount > 0) && (
        <Link
          href="/app/revisoes"
          className="block rounded-xl border border-accent-dark/30 bg-accent-light/30 p-4 text-sm font-medium text-primary-dark hover:bg-accent-light/50"
        >
          Você tem {stats.atrasadasCount + stats.hojeCount} revisão(ões) pendente(s) para hoje. Ver fila →
        </Link>
      )}

      <div className="rounded-xl border border-border bg-white p-4 shadow-sm">
        <h2 className="mb-3 text-sm font-semibold text-foreground">Desempenho por matéria</h2>
        {stats.performanceBySubject.length === 0 ? (
          <p className="text-sm text-muted">
            Nenhuma questão registrada ainda. Comece registrando sua primeira sessão de estudo.
          </p>
        ) : (
          <div className="space-y-3">
            {stats.performanceBySubject.map((s) => (
              <div key={s.name}>
                <div className="mb-1 flex justify-between text-xs text-muted">
                  <span className="font-medium text-foreground">{s.name}</span>
                  <span>
                    {s.accuracy}% · {s.total} questões
                  </span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-surface">
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

      <div className="rounded-xl border border-border bg-white p-4 shadow-sm">
        <h2 className="mb-3 text-sm font-semibold text-foreground">Marcadas para revisar</h2>
        {stats.needsRevisit.length === 0 ? (
          <p className="text-sm text-muted">Nenhuma questão marcada como &quot;voltar depois&quot;.</p>
        ) : (
          <ul className="divide-y divide-border">
            {stats.needsRevisit.map((item, i) => (
              <li key={i} className="flex items-center justify-between py-2 text-sm">
                <div>
                  <p className="font-medium text-foreground">{item.topicName}</p>
                  <p className="text-xs text-muted">{item.subjectName}</p>
                </div>
                <span className="text-xs text-muted">
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
