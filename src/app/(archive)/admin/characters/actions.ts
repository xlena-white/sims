"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type { FormState } from "@/components/admin/form-bits";
import { PREVIEW_MODE } from "@/lib/supabase/env";
import { requireUser } from "@/lib/supabase/server";
import { isGenerationNumber, type PastPartner } from "@/lib/types";
import { isUuid, slugify } from "@/lib/utils";

const PREVIEW_MESSAGE: FormState = { ok: false, message: "Saving needs Supabase to be connected (see SETUP.md)." };

const text = (formData: FormData, key: string, max = 500) => {
  const value = String(formData.get(key) ?? "").trim().slice(0, max);
  return value === "" ? null : value;
};

/** Reads a JSON string array from a hidden field, trimmed and de-duplicated. */
function list(formData: FormData, key: string): string[] {
  try {
    const parsed: unknown = JSON.parse(String(formData.get(key) ?? "[]"));
    if (!Array.isArray(parsed)) return [];
    const seen = new Set<string>();
    return parsed
      .filter((v): v is string => typeof v === "string")
      .map((v) => v.trim().slice(0, 100))
      .filter((v) => v && !seen.has(v.toLowerCase()) && seen.add(v.toLowerCase()));
  } catch {
    return [];
  }
}

function partnerRows(formData: FormData): { name: string; note: string | null }[] {
  try {
    const parsed: unknown = JSON.parse(String(formData.get("past_partners") ?? "[]"));
    if (!Array.isArray(parsed)) return [];
    return parsed.flatMap((row) => {
      if (!row || typeof row !== "object") return [];
      const name = String((row as { name?: unknown }).name ?? "").trim().slice(0, 100);
      const note = String((row as { note?: unknown }).note ?? "").trim().slice(0, 500);
      return name ? [{ name, note: note || null }] : [];
    });
  } catch {
    return [];
  }
}

export async function saveCharacter(_prev: FormState, formData: FormData): Promise<FormState> {
  if (PREVIEW_MODE) return PREVIEW_MESSAGE;
  const supabase = await requireUser();

  const idRaw = String(formData.get("id") ?? "");
  const id = isUuid(idRaw) ? idRaw : null;
  const name = text(formData, "name", 100);
  const generation = Number(formData.get("generation"));
  if (!name) return { ok: false, message: "Every Sim needs a name." };
  if (!isGenerationNumber(generation)) return { ok: false, message: "Pick a generation." };

  // Everyone else, for matching typed partner names to characters and validating parents.
  const { data: others, error: listError } = await supabase.from("characters").select("id, slug, name");
  if (listError) return { ok: false, message: listError.message };
  const pool = others.filter((c) => c.id !== id);
  const findByName = (n: string) => pool.find((c) => c.name.toLowerCase() === n.toLowerCase())?.id ?? null;
  const validId = (key: string) => {
    const v = String(formData.get(key) ?? "");
    return pool.some((c) => c.id === v) ? v : null;
  };

  const partnerName = text(formData, "current_partner", 100);
  const partnerId = partnerName ? findByName(partnerName) : null;
  const pastPartners: PastPartner[] = partnerRows(formData).map((p) => ({ ...p, character_id: findByName(p.name) }));

  const row = {
    name,
    generation,
    photo_url: text(formData, "photo_url", 1000),
    tagline: text(formData, "tagline", 200),
    moral_alignment: text(formData, "moral_alignment", 60),
    career_current: text(formData, "career_current", 100),
    career_endgame: text(formData, "career_endgame", 100),
    past_jobs: list(formData, "past_jobs"),
    relationship_status: text(formData, "relationship_status", 60),
    current_partner_id: partnerId,
    current_partner_name: partnerId ? null : partnerName,
    past_partners: pastPartners,
    traits: list(formData, "traits"),
    hobbies: list(formData, "hobbies"),
    parent_one_id: validId("parent_one_id"),
    parent_two_id: validId("parent_two_id"),
    sort_order: Number.parseInt(String(formData.get("sort_order") ?? "0"), 10) || 0,
  };

  if (id) {
    const { error } = await supabase.from("characters").update(row).eq("id", id);
    if (error) return { ok: false, message: error.message };
    revalidatePath("/", "layout");
    return { ok: true, message: "Saved!" };
  }

  const taken = new Set(others.map((c) => c.slug));
  const base = slugify(name);
  let slug = base;
  for (let n = 2; taken.has(slug); n++) slug = `${base}-${n}`;

  const { data: created, error } = await supabase.from("characters").insert({ ...row, slug }).select("id").single();
  if (error) return { ok: false, message: error.message };
  revalidatePath("/", "layout");
  redirect(`/admin/characters/${created.id}?created=1`);
}

export async function deleteCharacter(id: string) {
  if (PREVIEW_MODE || !isUuid(id)) return;
  const supabase = await requireUser();
  await supabase.from("characters").delete().eq("id", id);
  revalidatePath("/", "layout");
  redirect("/admin/characters");
}

export async function addRelationship(_prev: FormState, formData: FormData): Promise<FormState> {
  if (PREVIEW_MODE) return PREVIEW_MESSAGE;
  const supabase = await requireUser();

  const one = String(formData.get("character_one_id") ?? "");
  const two = String(formData.get("character_two_id") ?? "");
  const type = text(formData, "relationship_type", 60);
  if (!isUuid(one) || !isUuid(two) || one === two) return { ok: false, message: "Pick someone to connect them to." };
  if (!type) return { ok: false, message: "What kind of relationship is it?" };

  const { error } = await supabase.from("relationships").insert({
    character_one_id: one,
    character_two_id: two,
    relationship_type: type,
    status: text(formData, "status", 30) ?? "active",
    notes: text(formData, "notes", 1000),
  });
  if (error) return { ok: false, message: error.message };
  revalidatePath("/", "layout");
  return { ok: true, message: "Added!" };
}

export async function deleteRelationship(id: string) {
  if (PREVIEW_MODE || !isUuid(id)) return;
  const supabase = await requireUser();
  await supabase.from("relationships").delete().eq("id", id);
  revalidatePath("/", "layout");
}
