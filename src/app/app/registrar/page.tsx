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
      <h1 className="text-lg font-semibold text-foreground">Registrar questões</h1>

      {topics.length === 0 ? (
        <p className="rounded-xl border border-border bg-white p-4 text-sm text-muted shadow-sm">
          Cadastre uma matéria e um tópico antes de registrar sua primeira sessão de questões.
        </p>
      ) : (
        <div className="rounded-xl border border-border bg-white p-4 shadow-sm sm:p-6">
          <RegisterSessionForm topics={topics} defaultTopicId={topicId} />
        </div>
      )}
    </div>
  );
}
