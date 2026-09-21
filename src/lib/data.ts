import { createClient } from "@/lib/supabase/server";
import { toDateOnlyString } from "@/lib/review-engine";

type SupabaseClient = Awaited<ReturnType<typeof createClient>>;

export type ReviewQueueItem = {
  id: string;
  step: number;
  due_date: string;
  topic_id: string;
  topic_name: string;
  subject_name: string;
};

export async function getReviewQueue(supabase: SupabaseClient, userId: string) {
  const { data, error } = await supabase
    .from("review_schedule")
    .select("id, step, due_date, topic_id, topics(name, subjects(name))")
    .eq("user_id", userId)
    .eq("status", "pending")
    .order("due_date", { ascending: true });

  if (error) throw new Error(error.message);

  const today = toDateOnlyString(new Date());

  const items: ReviewQueueItem[] = (data ?? []).map((row) => {
    const topic = row.topics as unknown as { name: string; subjects: { name: string } | null } | null;
    return {
      id: row.id,
      step: row.step,
      due_date: row.due_date,
      topic_id: row.topic_id,
      topic_name: topic?.name ?? "Tópico removido",
      subject_name: topic?.subjects?.name ?? "—",
    };
  });

  return {
    atrasadas: items.filter((i) => i.due_date < today),
    hoje: items.filter((i) => i.due_date === today),
    proximas: items.filter((i) => i.due_date > today).slice(0, 10),
  };
}

export async function getDashboardStats(supabase: SupabaseClient, userId: string) {
  const [{ data: sessions, error: sessionsError }, queue] = await Promise.all([
    supabase
      .from("question_sessions")
      .select("total_questions, correct, incorrect, session_date, needs_revisit, topic_id, topics(name, subjects(name))")
      .eq("user_id", userId)
      .order("session_date", { ascending: false }),
    getReviewQueue(supabase, userId),
  ]);

  if (sessionsError) throw new Error(sessionsError.message);

  const rows = sessions ?? [];
  const totalQuestions = rows.reduce((sum, r) => sum + r.total_questions, 0);
  const totalCorrect = rows.reduce((sum, r) => sum + r.correct, 0);
  const accuracy = totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0;

  const bySubject = new Map<string, { correct: number; total: number }>();
  for (const r of rows) {
    const topic = r.topics as unknown as { name: string; subjects: { name: string } | null } | null;
    const subjectName = topic?.subjects?.name ?? "Sem matéria";
    const entry = bySubject.get(subjectName) ?? { correct: 0, total: 0 };
    entry.correct += r.correct;
    entry.total += r.total_questions;
    bySubject.set(subjectName, entry);
  }

  const performanceBySubject = Array.from(bySubject.entries()).map(([name, v]) => ({
    name,
    accuracy: v.total > 0 ? Math.round((v.correct / v.total) * 100) : 0,
    total: v.total,
  }));

  const studyDays = new Set(rows.map((r) => r.session_date));
  let streak = 0;
  const cursor = new Date();
  for (;;) {
    const key = toDateOnlyString(cursor);
    if (!studyDays.has(key)) break;
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }

  const needsRevisit = rows
    .filter((r) => r.needs_revisit)
    .slice(0, 8)
    .map((r) => {
      const topic = r.topics as unknown as { name: string; subjects: { name: string } | null } | null;
      return {
        topicId: r.topic_id,
        topicName: topic?.name ?? "Tópico removido",
        subjectName: topic?.subjects?.name ?? "—",
        sessionDate: r.session_date,
      };
    });

  return {
    totalQuestions,
    totalCorrect,
    totalIncorrect: totalQuestions - totalCorrect,
    accuracy,
    streak,
    atrasadasCount: queue.atrasadas.length,
    hojeCount: queue.hoje.length,
    performanceBySubject,
    needsRevisit,
  };
}

export async function getSubjectsWithTopicCount(supabase: SupabaseClient, userId: string) {
  const { data, error } = await supabase
    .from("subjects")
    .select("id, name, created_at, topics(count)")
    .eq("user_id", userId)
    .order("created_at", { ascending: true });
  if (error) throw new Error(error.message);
  return (data ?? []).map((s) => ({
    id: s.id,
    name: s.name,
    topicCount: (s.topics as unknown as { count: number }[])?.[0]?.count ?? 0,
  }));
}

export async function getSubjectWithTopics(supabase: SupabaseClient, userId: string, subjectId: string) {
  const { data: subject, error: subjectError } = await supabase
    .from("subjects")
    .select("id, name")
    .eq("user_id", userId)
    .eq("id", subjectId)
    .single();
  if (subjectError) throw new Error(subjectError.message);

  const { data: topics, error: topicsError } = await supabase
    .from("topics")
    .select("id, name, created_at")
    .eq("user_id", userId)
    .eq("subject_id", subjectId)
    .order("created_at", { ascending: true });
  if (topicsError) throw new Error(topicsError.message);

  return { subject, topics: topics ?? [] };
}

export async function getTopicsForUser(supabase: SupabaseClient, userId: string) {
  const { data, error } = await supabase
    .from("topics")
    .select("id, name, subject_id, subjects(name)")
    .eq("user_id", userId)
    .order("name", { ascending: true });
  if (error) throw new Error(error.message);
  return (data ?? []).map((t) => ({
    id: t.id,
    name: t.name,
    subjectId: t.subject_id,
    subjectName: (t.subjects as unknown as { name: string } | null)?.name ?? "—",
  }));
}
