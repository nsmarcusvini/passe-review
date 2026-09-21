"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

async function requireUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Não autenticado");
  return { supabase, user };
}

export type UpdateAccountInput = {
  displayName: string;
  email: string;
};

export async function updateAccount(input: UpdateAccountInput) {
  const { supabase, user } = await requireUser();

  const { error: profileError } = await supabase
    .from("profiles")
    .update({ display_name: input.displayName || null })
    .eq("id", user.id);
  if (profileError) throw new Error(profileError.message);

  if (input.email && input.email !== user.email) {
    const { error: emailError } = await supabase.auth.updateUser({ email: input.email });
    if (emailError) throw new Error(emailError.message);
  }

  const { error: metaError } = await supabase.auth.updateUser({
    data: { display_name: input.displayName || null },
  });
  if (metaError) throw new Error(metaError.message);

  revalidatePath("/app/configuracoes");
  revalidatePath("/app");
}

export async function updatePassword(newPassword: string) {
  await requireUser();
  if (newPassword.length < 6) throw new Error("A senha precisa ter ao menos 6 caracteres.");

  const supabase = (await createClient());
  const { error } = await supabase.auth.updateUser({ password: newPassword });
  if (error) throw new Error(error.message);
}

export type UpdateExamGoalInput = {
  examTarget: string;
  targetRole: string;
  examBoard: string;
  examDate: string | null;
  dailyQuestionGoal: number | null;
};

export async function updateExamGoal(input: UpdateExamGoalInput) {
  const { supabase, user } = await requireUser();

  const { error } = await supabase
    .from("profiles")
    .update({
      exam_target: input.examTarget || null,
      target_role: input.targetRole || null,
      exam_board: input.examBoard || null,
      exam_date: input.examDate || null,
      daily_question_goal: input.dailyQuestionGoal,
    })
    .eq("id", user.id);
  if (error) throw new Error(error.message);

  revalidatePath("/app/configuracoes");
  revalidatePath("/app");
}
