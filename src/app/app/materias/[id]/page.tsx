import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getSubjectWithTopics } from "@/lib/data";
import { deleteTopic } from "@/lib/actions/subjects";
import CreateTopicForm from "@/components/create-topic-form";
import DeleteButton from "@/components/delete-button";

export default async function MateriaPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { subject, topics } = await getSubjectWithTopics(supabase, user!.id, id);
  if (!subject) notFound();

  return (
    <div className="space-y-6">
      <div>
        <Link href="/app/materias" className="text-sm text-muted hover:text-primary">
          ← Matérias
        </Link>
        <h1 className="mt-1 text-lg font-semibold text-foreground">{subject.name}</h1>
      </div>

      <div className="rounded-xl border border-border bg-white p-4 shadow-sm">
        <CreateTopicForm subjectId={subject.id} />
      </div>

      {topics.length === 0 ? (
        <p className="text-sm text-muted">Nenhum tópico cadastrado ainda.</p>
      ) : (
        <ul className="divide-y divide-border rounded-xl border border-border bg-white shadow-sm">
          {topics.map((t) => (
            <li key={t.id} className="flex items-center justify-between px-4 py-3">
              <span className="text-sm font-medium text-foreground">{t.name}</span>
              <div className="flex items-center gap-3">
                <Link
                  href={`/app/registrar?topicId=${t.id}`}
                  className="text-xs font-medium text-primary hover:underline"
                >
                  Registrar questões
                </Link>
                <DeleteButton action={deleteTopic.bind(null, subject.id, t.id)} />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
