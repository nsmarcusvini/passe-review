import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { getSubjectsWithTopicCount } from "@/lib/data";
import { deleteSubject } from "@/lib/actions/subjects";
import CreateSubjectForm from "@/components/create-subject-form";
import DeleteButton from "@/components/delete-button";

export default async function MateriasPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const subjects = await getSubjectsWithTopicCount(supabase, user!.id);

  return (
    <div className="space-y-6">
      <h1 className="text-lg font-semibold text-foreground">Matérias</h1>

      <div className="rounded-xl border border-border bg-white p-4 shadow-sm">
        <CreateSubjectForm />
      </div>

      {subjects.length === 0 ? (
        <p className="text-sm text-muted">Nenhuma matéria cadastrada ainda.</p>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {subjects.map((s) => (
            <div
              key={s.id}
              className="flex items-center justify-between rounded-xl border border-border bg-white p-4 shadow-sm"
            >
              <Link href={`/app/materias/${s.id}`} className="flex-1">
                <p className="font-medium text-foreground hover:text-primary">{s.name}</p>
                <p className="text-xs text-muted">
                  {s.topicCount} tópico{s.topicCount === 1 ? "" : "s"}
                </p>
              </Link>
              <DeleteButton action={deleteSubject.bind(null, s.id)} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
