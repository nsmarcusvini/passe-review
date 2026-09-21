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
    <div className="space-y-8">
      <div>
        <Link
          href="/app/materias"
          className="font-mono-label text-[11px] uppercase tracking-[0.2em] text-primary/60 hover:text-primary"
        >
          ← Voltar ao arquivo
        </Link>
        <div className="mt-2 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
          <h1 className="font-display text-2xl font-semibold tracking-tight text-primary">{subject.name}</h1>
          {topics.length > 0 && (
            <p className="font-mono-label text-[11px] tracking-wide text-muted">
              {topics.length} documento{topics.length === 1 ? "" : "s"} no dossiê
            </p>
          )}
        </div>
      </div>

      <div className="rounded-sm border border-dashed border-primary/25 bg-white p-4">
        <p className="mb-2 font-mono-label text-[11px] uppercase tracking-[0.14em] text-muted">
          Adicionar documento
        </p>
        <CreateTopicForm subjectId={subject.id} />
      </div>

      {topics.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border bg-white/60 p-10 text-center">
          <p className="text-sm font-medium text-foreground">Este dossiê ainda está vazio.</p>
          <p className="mt-1 text-sm text-muted">
            Adicione o primeiro tópico acima para começar a registrar questões.
          </p>
        </div>
      ) : (
        <ul className="list-none overflow-hidden rounded-lg border border-[#d9c89c] bg-[#ece0c4] shadow-sm">
          {topics.map((t, i) => (
            <li
              key={t.id}
              className={`flex flex-wrap items-center justify-between gap-3 px-4 py-3 ${
                i === 0 ? "" : "border-t border-dashed border-[#c9b784]"
              }`}
            >
              <div className="flex min-w-0 items-baseline gap-2">
                <span className="font-mono-label text-[10px] text-primary/40">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="truncate text-sm font-medium text-primary-dark">{t.name}</span>
              </div>
              <div className="flex shrink-0 items-center gap-3">
                <Link
                  href={`/app/registrar?topicId=${t.id}`}
                  className="rounded-sm bg-primary px-3 py-1.5 font-mono-label text-[10px] uppercase tracking-wide text-white transition-colors hover:bg-primary-dark"
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
