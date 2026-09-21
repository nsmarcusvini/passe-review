"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { updateSubject } from "@/lib/actions/subjects";
import DeleteButton from "@/components/delete-button";

export default function SubjectCard({
  subject,
  index,
  deleteAction,
}: {
  subject: { id: string; name: string; topicCount: number };
  index: number;
  deleteAction: () => Promise<void>;
}) {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(subject.name);
  const [pending, startTransition] = useTransition();

  function cancel() {
    setEditing(false);
    setName(subject.name);
  }

  function save() {
    const trimmed = name.trim();
    if (!trimmed || trimmed === subject.name) {
      cancel();
      return;
    }
    startTransition(async () => {
      await updateSubject(subject.id, trimmed);
      router.refresh();
      setEditing(false);
    });
  }

  return (
    <li className="group relative">
      <div
        aria-hidden
        className="absolute -top-3 left-5 h-4 w-20 bg-[#d9c89c] [clip-path:polygon(0%_100%,0%_25%,12%_0%,100%_0%,100%_100%)] transition-colors group-hover:bg-accent-dark"
      />
      <div className="relative flex items-stretch justify-between gap-3 rounded-lg rounded-tl-none border border-[#d9c89c] bg-[#ece0c4] p-4 pt-5 shadow-sm transition-all duration-150 group-hover:-translate-y-0.5 group-hover:shadow-md">
        <div className="min-w-0 flex-1">
          <p className="font-mono-label text-[10px] uppercase tracking-widest text-primary/50">
            Dossiê nº {String(index + 1).padStart(2, "0")}
          </p>

          {editing ? (
            <input
              autoFocus
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  save();
                }
                if (e.key === "Escape") cancel();
              }}
              className="mt-0.5 w-full min-w-0 rounded-sm border border-primary/40 bg-white px-2 py-1 font-display text-lg font-semibold text-primary outline-none focus:border-primary"
            />
          ) : (
            <Link href={`/app/materias/${subject.id}`} className="block">
              <p className="mt-0.5 truncate font-display text-lg font-semibold text-primary">
                {subject.name}
              </p>
            </Link>
          )}

          <div className="mt-3 flex items-center gap-2">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 border-primary bg-accent text-[11px] font-bold text-primary-dark">
              {subject.topicCount}
            </span>
            <span className="text-xs text-muted">
              tópico{subject.topicCount === 1 ? "" : "s"}
            </span>
          </div>
        </div>

        <div className="flex shrink-0 flex-col items-end justify-between gap-2">
          {editing ? (
            <div className="flex items-center gap-2.5">
              <button
                type="button"
                disabled={pending}
                onClick={save}
                className="font-mono-label text-[11px] uppercase tracking-wide text-primary transition-colors hover:text-primary-dark disabled:opacity-50"
              >
                {pending ? "Salvando…" : "Salvar"}
              </button>
              <button
                type="button"
                onClick={cancel}
                className="font-mono-label text-[11px] uppercase tracking-wide text-muted transition-colors hover:text-foreground"
              >
                Cancelar
              </button>
            </div>
          ) : (
            <>
              <span
                aria-hidden
                className="hidden text-primary/30 transition-transform group-hover:translate-x-0.5 group-hover:text-primary sm:inline"
              >
                →
              </span>
              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => setEditing(true)}
                  className="font-mono-label text-[11px] uppercase tracking-wide text-muted transition-colors hover:text-primary"
                >
                  Editar
                </button>
                <DeleteButton action={deleteAction} />
              </div>
            </>
          )}
        </div>
      </div>
    </li>
  );
}
