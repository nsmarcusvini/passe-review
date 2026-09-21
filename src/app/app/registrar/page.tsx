import { createClient } from "@/lib/supabase/server";
import { getTopicsForUser } from "@/lib/data";
import RegisterSessionForm from "@/components/register-session-form";

export default async function RegistrarPage({
  searchParams,
}: {
  searchParams: Promise<{ topicId?: string }>;
}) {
  const { topicId } = await searchParams;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const topics = await getTopicsForUser(supabase, user!.id);

  return (
    <div className="space-y-6">
      <div>
        <p className="font-mono-label text-[11px] uppercase tracking-[0.16em] text-accent-dark">
          Menos de 20 segundos
        </p>
        <h1 className="mt-1 font-display text-2xl font-semibold tracking-tight text-foreground">
          Registrar questões
        </h1>
      </div>

      {topics.length === 0 ? (
        <div className="rounded-sm border border-dashed border-border p-6 text-center text-sm text-muted">
          Cadastre uma matéria e um tópico antes de registrar sua primeira sessão de questões.
        </div>
      ) : (
        <div className="overflow-hidden rounded-sm border border-border bg-white">
          <div className="flex items-center justify-between border-b border-border bg-surface px-4 py-2.5 sm:px-6">
            <span className="font-mono-label text-[10px] uppercase tracking-[0.14em] text-muted">
              Ficha de registro
            </span>
            <span className="font-mono-label text-[10px] text-muted">
              {new Date().toLocaleDateString("pt-BR")}
            </span>
          </div>
          <div className="p-4 sm:p-6">
            <RegisterSessionForm topics={topics} defaultTopicId={topicId} />
          </div>
        </div>
      )}
    </div>
  );
}
