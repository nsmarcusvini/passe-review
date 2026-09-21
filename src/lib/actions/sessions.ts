"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { nextDueDate } from "@/lib/review-engine";

export type RegisterSessionInput = {
  topicId: string;
  sessionDate: string; // YYYY-MM-DD
  totalQuestions: number;
  correct: number;
  incorrect: number;
  notes?: string;
  needsRevisit: boolean;
  /** id da revisão pendente sendo concluída, quando a origem é a fila de revisões */
  reviewScheduleId?: string | null;
};

/**
 * Registra uma sessão de questões e agenda automaticamente a próxima revisão
 * do tópico, seguindo a sequência 24h -> 7d -> 30d -> 45d -> 60d -> (30/45/60)*.
 */
export async function registerQuestionSession(input: RegisterSessionInput) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Não autenticado");

  const { data: session, error: sessionError } = await supabase
    .from("question_sessions")
    .insert({
      user_id: user.id,
      topic_id: input.topicId,
      session_date: input.sessionDate,
      total_questions: input.totalQuestions,
      correct: input.correct,
      incorrect: input.incorrect,
      notes: input.notes || null,
      needs_revisit: input.needsRevisit,
    })
    .select()
    .single();

  if (sessionError || !session) {
    throw new Error(sessionError?.message ?? "Falha ao registrar sessão");
  }

  let pendingId = input.reviewScheduleId ?? null;
  let currentStep = -1;

  if (!pendingId) {
    const { data: existingPending } = await supabase
      .from("review_schedule")
      .select("id, step")
      .eq("topic_id", input.topicId)
      .eq("status", "pending")
      .maybeSingle();
    if (existingPending) {
      pendingId = existingPending.id;
      currentStep = existingPending.step;
    }
  } else {
    const { data: pending } = await supabase
      .from("review_schedule")
      .select("step")
      .eq("id", pendingId)
      .single();
    currentStep = pending?.step ?? -1;
  }

  if (pendingId) {
    const { error: updateError } = await supabase
      .from("review_schedule")
      .update({ status: "done", source_session_id: session.id })
      .eq("id", pendingId);
    if (updateError) throw new Error(updateError.message);
  }

  const nextStep = currentStep + 1;
  const dueDate = nextDueDate(input.sessionDate, nextStep);

  const { error: scheduleError } = await supabase.from("review_schedule").insert({
    user_id: user.id,
    topic_id: input.topicId,
    step: nextStep,
    due_date: dueDate,
    status: "pending",
  });
  if (scheduleError) throw new Error(scheduleError.message);

  revalidatePath("/app");
  revalidatePath("/app/revisoes");
  revalidatePath("/app/materias");

  return session;
}
