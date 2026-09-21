"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { updateExamGoal } from "@/lib/actions/profile";

const inputClass =
  "w-full rounded-sm border border-border px-3 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary";
const labelClass = "mb-1.5 block font-mono-label text-[11px] uppercase tracking-[0.14em] text-muted";

export default function ExamGoalForm({
  examTarget,
  targetRole,
  examBoard,
  examDate,
  dailyQuestionGoal,
}: {
  examTarget: string | null;
  targetRole: string | null;
  examBoard: string | null;
  examDate: string | null;
  dailyQuestionGoal: number | null;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const [exam, setExam] = useState(examTarget ?? "");
  const [role, setRole] = useState(targetRole ?? "");
  const [board, setBoard] = useState(examBoard ?? "");
  const [date, setDate] = useState(examDate ?? "");
  const [goal, setGoal] = useState(dailyQuestionGoal ? String(dailyQuestionGoal) : "");

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    const goalNum = goal.trim() ? Number(goal) : null;
    if (goalNum !== null && (!Number.isInteger(goalNum) || goalNum <= 0)) {
      setError("A meta diária precisa ser um número inteiro maior que zero.");
      return;
    }

    startTransition(async () => {
      try {
        await updateExamGoal({
          examTarget: exam.trim(),
          targetRole: role.trim(),
          examBoard: board.trim(),
          examDate: date || null,
          dailyQuestionGoal: goalNum,
        });
        setSuccess(true);
        router.refresh();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erro ao salvar o concurso meta.");
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={labelClass}>Concurso</label>
          <input
            value={exam}
            onChange={(e) => setExam(e.target.value)}
            placeholder="Ex: TRF 3ª Região — Analista Judiciário"
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>Cargo pretendido</label>
          <input
            value={role}
            onChange={(e) => setRole(e.target.value)}
            placeholder="Ex: Analista Judiciário — Área Judiciária"
            className={inputClass}
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={labelClass}>Banca organizadora</label>
          <input
            value={board}
            onChange={(e) => setBoard(e.target.value)}
            placeholder="Ex: Cebraspe, FGV, FCC…"
            className={inputClass}
          />
        </div>
        <div>
          <label className={labelClass}>Data da prova</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className={inputClass}
          />
        </div>
      </div>

      <div className="sm:max-w-[calc(50%-0.5rem)]">
        <label className={labelClass}>Meta diária de questões</label>
        <div className="flex items-center gap-2">
          <input
            type="number"
            min={1}
            inputMode="numeric"
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
            placeholder="Ex: 30"
            className={inputClass}
          />
          <span className="whitespace-nowrap text-xs text-muted">questões/dia</span>
        </div>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}
      {success && <p className="text-sm text-success">Concurso meta atualizado.</p>}

      <button
        type="submit"
        disabled={pending}
        className="rounded-sm bg-primary px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary-dark disabled:opacity-50"
      >
        {pending ? "Salvando…" : "Salvar meta"}
      </button>
    </form>
  );
}
