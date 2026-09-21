"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { registerQuestionSession } from "@/lib/actions/sessions";

type Topic = { id: string; name: string; subjectId: string; subjectName: string };

export default function RegisterSessionForm({
  topics,
  defaultTopicId,
  reviewScheduleId,
  onDone,
}: {
  topics: Topic[];
  defaultTopicId?: string;
  reviewScheduleId?: string;
  onDone?: () => void;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [topicId, setTopicId] = useState(defaultTopicId ?? topics[0]?.id ?? "");
  const [total, setTotal] = useState("");
  const [correct, setCorrect] = useState("");
  const [notes, setNotes] = useState("");
  const [needsRevisit, setNeedsRevisit] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const totalNum = Number(total) || 0;
  const correctNum = Number(correct) || 0;
  const incorrectNum = Math.max(totalNum - correctNum, 0);
  const fixedTopic = Boolean(defaultTopicId || reviewScheduleId);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!topicId) {
      setError("Selecione um tópico.");
      return;
    }
    if (totalNum <= 0) {
      setError("Informe o total de questões.");
      return;
    }
    if (correctNum > totalNum) {
      setError("Acertos não podem ser maiores que o total.");
      return;
    }

    startTransition(async () => {
      try {
        await registerQuestionSession({
          topicId,
          sessionDate: new Date().toISOString().slice(0, 10),
          totalQuestions: totalNum,
          correct: correctNum,
          incorrect: incorrectNum,
          notes: notes || undefined,
          needsRevisit,
          reviewScheduleId: reviewScheduleId ?? null,
        });
        setSuccess(true);
        setTotal("");
        setCorrect("");
        setNotes("");
        setNeedsRevisit(false);
        router.refresh();
        onDone?.();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erro ao registrar.");
      }
    });
  }

  const fixedTopicLabel = fixedTopic
    ? topics.find((t) => t.id === topicId)
    : undefined;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {fixedTopic && fixedTopicLabel && (
        <div>
          <p className="mb-1.5 font-mono-label text-[11px] uppercase tracking-[0.14em] text-muted">
            Tópico
          </p>
          <p className="rounded-sm bg-surface px-3 py-2 text-sm text-foreground">
            {fixedTopicLabel.subjectName} — {fixedTopicLabel.name}
          </p>
        </div>
      )}
      {!fixedTopic && (
        <div>
          <label className="mb-1.5 block font-mono-label text-[11px] uppercase tracking-[0.14em] text-muted">
            Tópico
          </label>
          <select
            value={topicId}
            onChange={(e) => setTopicId(e.target.value)}
            required
            className="w-full rounded-sm border border-border px-3 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary/30"
          >
            <option value="" disabled>
              Selecione…
            </option>
            {topics.map((t) => (
              <option key={t.id} value={t.id}>
                {t.subjectName} — {t.name}
              </option>
            ))}
          </select>
        </div>
      )}

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="mb-1.5 block font-mono-label text-[11px] uppercase tracking-[0.14em] text-muted">
            Total de questões
          </label>
          <input
            type="number"
            min={1}
            inputMode="numeric"
            value={total}
            onChange={(e) => setTotal(e.target.value)}
            required
            className="w-full rounded-sm border border-border px-3 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary/30"
          />
        </div>
        <div>
          <label className="mb-1.5 block font-mono-label text-[11px] uppercase tracking-[0.14em] text-muted">
            Acertos
          </label>
          <input
            type="number"
            min={0}
            inputMode="numeric"
            value={correct}
            onChange={(e) => setCorrect(e.target.value)}
            required
            className="w-full rounded-sm border border-border px-3 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary/30"
          />
        </div>
      </div>

      {totalNum > 0 && (
        <p className="font-mono-label text-[11px] tracking-wide text-muted">
          {correctNum} acertos · {incorrectNum} erros ·{" "}
          <span className="text-primary">{Math.round((correctNum / totalNum) * 100)}%</span> de
          aproveitamento
        </p>
      )}

      <div>
        <label className="mb-1.5 block font-mono-label text-[11px] uppercase tracking-[0.14em] text-muted">
          Observações
        </label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={2}
          placeholder="Ex: errei questões de prazo processual, revisar súmulas"
          className="w-full rounded-sm border border-border px-3 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary/30"
        />
      </div>

      <label className="flex items-center gap-2 text-sm text-foreground">
        <input
          type="checkbox"
          checked={needsRevisit}
          onChange={(e) => setNeedsRevisit(e.target.checked)}
          className="h-4 w-4 rounded-sm border-border text-primary focus:ring-primary/30"
        />
        Marcar para voltar depois
      </label>

      {error && (
        <p className="rounded-sm bg-danger-bg px-3 py-2 text-sm text-danger">{error}</p>
      )}
      {success && (
        <p className="rounded-sm bg-success-bg px-3 py-2 text-sm text-success">
          Registrado! Próxima revisão agendada.
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-sm bg-primary px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary-dark disabled:opacity-50"
      >
        {pending ? "Salvando…" : "Registrar"}
      </button>
    </form>
  );
}
