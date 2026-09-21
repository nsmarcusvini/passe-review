import { createClient } from "@/lib/supabase/server";
import { getSubjectsWithTopicCount } from "@/lib/data";
import { deleteSubject } from "@/lib/actions/subjects";
import CreateSubjectForm from "@/components/create-subject-form";
import SubjectCard from "@/components/subject-card";

export default async function MateriasPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const subjects = await getSubjectsWithTopicCount(supabase, user!.id);
  const totalTopics = subjects.reduce((sum, s) => sum + s.topicCount, 0);

  return (
    <div className="space-y-8">
      <div>
        <p className="font-mono-label text-[11px] uppercase tracking-[0.16em] text-accent-dark">
          Arquivo de estudos
        </p>
        <div className="mt-1 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
          <h1 className="font-display text-2xl font-semibold tracking-tight text-foreground">Matérias</h1>
          {subjects.length > 0 && (
            <p className="font-mono-label text-[11px] tracking-wide text-muted">
              {subjects.length} dossiê{subjects.length === 1 ? "" : "s"} · {totalTopics} tópico
              {totalTopics === 1 ? "" : "s"}
            </p>
          )}
        </div>
      </div>

      <div className="rounded-sm border border-dashed border-primary/25 bg-white p-4">
        <p className="mb-2 font-mono-label text-[11px] uppercase tracking-[0.14em] text-muted">
          Abrir novo dossiê
        </p>
        <CreateSubjectForm />
      </div>

      {subjects.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border bg-white/60 p-10 text-center">
          <p className="text-sm font-medium text-foreground">Sua estante de dossiês está vazia.</p>
          <p className="mt-1 text-sm text-muted">
            Abra o primeiro dossiê acima para começar a organizar seus estudos.
          </p>
        </div>
      ) : (
        <ul className="grid list-none gap-5 pt-1 sm:grid-cols-2">
          {subjects.map((s, i) => (
            <SubjectCard key={s.id} subject={s} index={i} deleteAction={deleteSubject.bind(null, s.id)} />
          ))}
        </ul>
      )}
    </div>
  );
}
