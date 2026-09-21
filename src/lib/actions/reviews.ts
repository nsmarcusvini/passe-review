"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

/** Permite ao usuário reagendar manualmente uma revisão pendente — para revisar antes ou depois do previsto. */
export async function updateReviewDueDate(reviewScheduleId: string, dueDate: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Não autenticado");

  const { error } = await supabase
    .from("review_schedule")
    .update({ due_date: dueDate })
    .eq("id", reviewScheduleId)
    .eq("user_id", user.id)
    .eq("status", "pending");
  if (error) throw new Error(error.message);

  revalidatePath("/app");
  revalidatePath("/app/revisoes");
}
