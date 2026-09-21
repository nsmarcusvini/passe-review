import { createClient } from "@/lib/supabase/server";
import AccountForm from "@/components/settings/account-form";
import ExamGoalForm from "@/components/settings/exam-goal-form";
import ExamCountdownStamp from "@/components/settings/exam-countdown-stamp";

function daysUntil(dateStr: string): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const [year, month, day] = dateStr.split("-").map(Number);
  const target = new Date(year, month - 1, day);
  target.setHours(0, 0, 0, 0);
  return Math.round((target.getTime() - today.getTime()) / 86_400_000);
}

function SectionHeader({ index, title, description }: { index: string; title: string; description: string }) {
  return (
    <div className="border-b border-border pb-3">
      <p className="font-mono-label text-[10px] uppercase tracking-widest text-primary/50">
        Seção {index}
      </p>
      <h2 className="mt-0.5 font-display text-lg font-semibold tracking-tight text-foreground">
        {title}
      </h2>
      <p className="mt-0.5 text-sm text-muted">{description}</p>
    </div>
  );
}

export default async function ConfiguracoesPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from("profiles")
    .select("display_name, exam_target, target_role, exam_board, exam_date, daily_question_goal, created_at")
    .eq("id", user!.id)
    .single();

  const displayName = profile?.display_name || (user!.user_metadata?.display_name as string | undefined) || "";
  const memberSince = profile?.created_at
    ? new Date(profile.created_at).toLocaleDateString("pt-BR", { month: "long", year: "numeric" })
    : "—";
  const daysRemaining = profile?.exam_date ? daysUntil(profile.exam_date) : null;

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-6">
        <div>
          <p className="font-mono-label text-[11px] uppercase tracking-[0.16em] text-accent-dark">
            Sua conta
          </p>
          <h1 className="mt-1 font-display text-2xl font-semibold tracking-tight text-foreground">
            Configurações
          </h1>
          <p className="mt-1.5 max-w-md text-sm text-muted">
            Seus dados de acesso e o concurso que você está mirando — edite quando quiser.
          </p>
        </div>
        <ExamCountdownStamp examTarget={profile?.exam_target ?? null} daysRemaining={daysRemaining} />
      </div>

      <div className="rounded-sm border border-border bg-white p-5 sm:p-6">
        <SectionHeader
          index="01"
          title="Dados da conta"
          description="Nome, email e senha usados para entrar na Passe Revisão."
        />
        <div className="mt-5">
          <AccountForm displayName={displayName} email={user!.email ?? ""} memberSince={memberSince} />
        </div>
      </div>

      <div className="rounded-sm border border-border bg-white p-5 sm:p-6">
        <SectionHeader
          index="02"
          title="Concurso meta"
          description="O concurso, cargo e prazo que orientam sua fila de revisões."
        />
        <div className="mt-5">
          <ExamGoalForm
            examTarget={profile?.exam_target ?? null}
            targetRole={profile?.target_role ?? null}
            examBoard={profile?.exam_board ?? null}
            examDate={profile?.exam_date ?? null}
            dailyQuestionGoal={profile?.daily_question_goal ?? null}
          />
        </div>
      </div>
    </div>
  );
}
