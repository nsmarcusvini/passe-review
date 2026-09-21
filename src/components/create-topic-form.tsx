"use client";

import { useRef, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createTopic } from "@/lib/actions/subjects";

export default function CreateTopicForm({ subjectId }: { subjectId: string }) {
  const [pending, startTransition] = useTransition();
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);

  return (
    <form
      ref={formRef}
      onSubmit={(e) => {
        e.preventDefault();
        const name = new FormData(e.currentTarget).get("name");
        if (!name || typeof name !== "string" || !name.trim()) return;
        startTransition(async () => {
          await createTopic(subjectId, name.trim());
          formRef.current?.reset();
          router.refresh();
        });
      }}
      className="flex gap-2"
    >
      <input
        name="name"
        placeholder="Novo tópico (ex: Controle de Constitucionalidade)"
        required
        className="flex-1 rounded-md border border-border px-3 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
      />
      <button
        type="submit"
        disabled={pending}
        className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary-dark disabled:opacity-50"
      >
        {pending ? "Adicionando…" : "Adicionar"}
      </button>
    </form>
  );
}
