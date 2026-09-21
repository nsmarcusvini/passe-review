"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { updateReviewDueDate } from "@/lib/actions/reviews";

export default function EditReviewDateForm({
  reviewScheduleId,
  currentDueDate,
  onDone,
}: {
  reviewScheduleId: string;
  currentDueDate: string;
  onDone?: () => void;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [dueDate, setDueDate] = useState(currentDueDate);
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!dueDate) {
      setError("Escolha uma data.");
      return;
    }
    startTransition(async () => {
      try {
        await updateReviewDueDate(reviewScheduleId, dueDate);
        router.refresh();
        onDone?.();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erro ao reagendar.");
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-wrap items-end gap-3">
      <div>
        <label className="mb-1.5 block font-mono-label text-[11px] uppercase tracking-[0.14em] text-muted">
          Nova data de revisão
        </label>
        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          required
          className="rounded-sm border border-border px-3 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary/30"
        />
      </div>
      {error && <p className="text-sm text-danger">{error}</p>}
      <button
        type="submit"
        disabled={pending}
        className="rounded-sm bg-primary px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary-dark disabled:opacity-50"
      >
        {pending ? "Salvando…" : "Salvar nova data"}
      </button>
    </form>
  );
}
