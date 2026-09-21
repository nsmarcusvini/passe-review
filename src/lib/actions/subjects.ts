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

export async function createSubject(name: string) {
  const { supabase, user } = await requireUser();
  const { error } = await supabase
    .from("subjects")
    .insert({ name, user_id: user.id });
  if (error) throw new Error(error.message);
  revalidatePath("/app/materias");
}

export async function updateSubject(id: string, name: string) {
  const { supabase, user } = await requireUser();
  const { error } = await supabase
    .from("subjects")
    .update({ name })
    .eq("id", id)
    .eq("user_id", user.id);
  if (error) throw new Error(error.message);
  revalidatePath("/app/materias");
  revalidatePath(`/app/materias/${id}`);
}

export async function deleteSubject(id: string) {
  const { supabase, user } = await requireUser();
  const { error } = await supabase
    .from("subjects")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);
  if (error) throw new Error(error.message);
  revalidatePath("/app/materias");
}

export async function createTopic(subjectId: string, name: string) {
  const { supabase, user } = await requireUser();
  const { error } = await supabase
    .from("topics")
    .insert({ subject_id: subjectId, name, user_id: user.id });
  if (error) throw new Error(error.message);
  revalidatePath(`/app/materias/${subjectId}`);
  revalidatePath("/app/materias");
}

export async function deleteTopic(subjectId: string, id: string) {
  const { supabase, user } = await requireUser();
  const { error } = await supabase
    .from("topics")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);
  if (error) throw new Error(error.message);
  revalidatePath(`/app/materias/${subjectId}`);
  revalidatePath("/app/materias");
}
