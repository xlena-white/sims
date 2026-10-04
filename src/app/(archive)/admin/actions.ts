"use server";

import { revalidatePath } from "next/cache";
import type { FormState } from "@/components/admin/form-bits";
import { PREVIEW_MODE } from "@/lib/supabase/env";
import { requireUser } from "@/lib/supabase/server";
import { isGenerationNumber } from "@/lib/types";

const text = (formData: FormData, key: string) => {
  const value = String(formData.get(key) ?? "").trim();
  return value === "" ? null : value;
};

const PREVIEW_MESSAGE: FormState = { ok: false, message: "Saving needs Supabase to be connected (see SETUP.md)." };

export async function updateSettings(_prev: FormState, formData: FormData): Promise<FormState> {
  if (PREVIEW_MODE) return PREVIEW_MESSAGE;
  const supabase = await requireUser();

  const { error } = await supabase
    .from("site_settings")
    .update({
      title: text(formData, "title") ?? "The Storybook",
      subtitle: text(formData, "subtitle"),
      epigraph: text(formData, "epigraph"),
    })
    .eq("id", true);
  if (error) return { ok: false, message: error.message };

  revalidatePath("/", "layout");
  return { ok: true, message: "Saved." };
}

export async function updateGeneration(_prev: FormState, formData: FormData): Promise<FormState> {
  if (PREVIEW_MODE) return PREVIEW_MESSAGE;
  const supabase = await requireUser();

  const number = Number(formData.get("number"));
  if (!isGenerationNumber(number)) return { ok: false, message: "Unknown generation." };
  const name = text(formData, "name");
  if (!name) return { ok: false, message: "A generation needs a name." };

  const { error } = await supabase
    .from("generations")
    .update({
      name,
      tagline: text(formData, "tagline"),
      description: text(formData, "description"),
      cover_image_url: text(formData, "cover_image_url"),
    })
    .eq("number", number);
  if (error) return { ok: false, message: error.message };

  revalidatePath("/", "layout");
  return { ok: true, message: "Saved." };
}
