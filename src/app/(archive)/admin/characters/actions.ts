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

  // Everyone else, for matching typed names to characters, validating parents and linking family.
  const { data: everyone, error: listError } = await supabase
    .from("characters")
    .select("id, slug, name, parent_one_id, parent_two_id, current_partner_id");
  if (listError) return { ok: false, message: listError.message };
  const pool = everyone.filter((c) => c.id !== id);
  const findByName = (n: string) => pool.find((c) => c.name.toLowerCase() === n.toLowerCase())?.id ?? null;
  const validId = (key: string) => {
    const v = String(formData.get(key) ?? "");
    return pool.some((c) => c.id === v) ? v : null;
  };

  const partnerName = text(formData, "current_partner", 100);
  const partnerId = partnerName ? findByName(partnerName) : null;
  const pastPartners: PastPartner[] = partnerRows(formData).map((p) => ({ ...p, character_id: findByName(p.name) }));
  const dead = formData.get("life_status") === "dead";

  const row = {
    name,
    generation,
    photo_url: text(formData, "photo_url", 1000),
    tagline: text(formData, "tagline", 200),
    moral_alignment: text(formData, "moral_alignment", 60),
    career_current: text(formData, "career_current", 100),
    career_position: text(formData, "career_position", 100),
    career_endgame: text(formData, "career_endgame", 100),
    past_jobs: list(formData, "past_jobs"),
    life_status: dead ? "dead" : "alive",
    cause_of_death: dead ? text(formData, "cause_of_death", 100) : null,
    death_note: dead ? text(formData, "death_note", 1000) : null,
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

  const taken = new Set(everyone.map((c) => c.slug));
  const uniqueSlug = (n: string) => {
    const base = slugify(n);
    let slug = base;
    for (let i = 2; taken.has(slug); i++) slug = `${base}-${i}`;
    taken.add(slug);
    return slug;
  };

  let selfId: string;
  if (id) {
    const { error } = await supabase.from("characters").update(row).eq("id", id);
    if (error) return { ok: false, message: error.message };
    selfId = id;
  } else {
    const { data: created, error } = await supabase
      .from("characters")
      .insert({ ...row, slug: uniqueSlug(name) })
      .select("id")
      .single();
    if (error) return { ok: false, message: error.message };
    selfId = created.id;
  }

  // Partners point at each other: if the partner has nobody listed, list this character.
  if (partnerId) {
    const partner = pool.find((c) => c.id === partnerId);
    if (partner && !partner.current_partner_id) {
      await supabase.from("characters").update({ current_partner_id: selfId }).eq("id", partnerId);
    }
  }

  const familyResult = await linkFamily(supabase, selfId, row, familyRows(formData), pool, uniqueSlug);
  revalidatePath("/", "layout");

  if (!id) redirect(`/admin/characters/${selfId}?created=1`);
  if (familyResult.error) return { ok: false, message: `Saved, but: ${familyResult.error}` };
  const added = familyResult.added;
  return { ok: true, message: added.length ? `Saved! Added ${added.join(", ")} to the family.` : "Saved!" };
}

type Supabase = Awaited<ReturnType<typeof requireUser>>;
type Relation = "parent" | "child" | "sibling" | "partner";
interface FamilyRow {
  relation: Relation;
  name: string;
  generation: number;
}
interface PoolEntry {
  id: string;
  name: string;
  parent_one_id: string | null;
  parent_two_id: string | null;
  current_partner_id: string | null;
}

function familyRows(formData: FormData): FamilyRow[] {
  try {
    const parsed: unknown = JSON.parse(String(formData.get("new_family") ?? "[]"));
    if (!Array.isArray(parsed)) return [];
    return parsed.flatMap((r) => {
      if (!r || typeof r !== "object") return [];
      const { relation, name, generation } = r as Record<string, unknown>;
      const n = String(name ?? "").trim().slice(0, 100);
      if (!n || !["parent", "child", "sibling", "partner"].includes(String(relation))) return [];
      const g = Number(generation);
      return [{ relation: relation as Relation, name: n, generation: isGenerationNumber(g) ? g : 1 }];
    });
  } catch {
    return [];
  }
}

/**
 * Creates (or finds by name) each family member from the "Add family members"
 * rows and links them to this character.
 */
async function linkFamily(
  supabase: Supabase,
  selfId: string,
  self: { parent_one_id: string | null; parent_two_id: string | null; current_partner_id: string | null },
  rows: FamilyRow[],
  pool: PoolEntry[],
  uniqueSlug: (name: string) => string,
): Promise<{ added: string[]; error: string | null }> {
  const added: string[] = [];
  const parents = [self.parent_one_id, self.parent_two_id];
  let partnerId = self.current_partner_id;
  const selfUpdate: Record<string, string | null> = {};

  for (const row of rows) {
    let person = pool.find((c) => c.name.toLowerCase() === row.name.toLowerCase());
    if (!person) {
      const fresh: Record<string, unknown> = { name: row.name, generation: row.generation, slug: uniqueSlug(row.name) };
      // New children get this character (and their partner) as parents; new siblings share parents.
      if (row.relation === "child") {
        fresh.parent_one_id = selfId;
        fresh.parent_two_id = partnerId;
      } else if (row.relation === "sibling") {
        fresh.parent_one_id = parents[0];
        fresh.parent_two_id = parents[1];
      } else if (row.relation === "partner") {
        fresh.current_partner_id = selfId;
      }
      const { data, error } = await supabase.from("characters").insert(fresh).select("id").single();
      if (error) return { added, error: `couldn't add ${row.name} (${error.message})` };
      person = {
        id: data.id,
        name: row.name,
        parent_one_id: (fresh.parent_one_id as string | null) ?? null,
        parent_two_id: (fresh.parent_two_id as string | null) ?? null,
        current_partner_id: (fresh.current_partner_id as string | null) ?? null,
      };
      pool.push(person);
      added.push(row.name);
    } else {
      // Linking someone who already exists.
      if (row.relation === "child" && person.parent_one_id !== selfId && person.parent_two_id !== selfId) {
        const slot = !person.parent_one_id ? "parent_one_id" : !person.parent_two_id ? "parent_two_id" : null;
        if (!slot) return { added, error: `${person.name} already has two parents` };
        await supabase.from("characters").update({ [slot]: selfId }).eq("id", person.id);
        person[slot] = selfId;
      } else if (row.relation === "sibling") {
        if (parents.some(Boolean) && !person.parent_one_id && !person.parent_two_id) {
          await supabase.from("characters").update({ parent_one_id: parents[0], parent_two_id: parents[1] }).eq("id", person.id);
        } else if (!parents.some((p) => p && (p === person!.parent_one_id || p === person!.parent_two_id))) {
          // No shared parents in the story: record them as siblings directly.
          await supabase.from("relationships").insert({
            character_one_id: selfId,
            character_two_id: person.id,
            relationship_type: "Sibling",
            status: "active",
          });
        }
      } else if (row.relation === "partner" && !person.current_partner_id) {
        await supabase.from("characters").update({ current_partner_id: selfId }).eq("id", person.id);
      }
    }

    if (row.relation === "parent" && !parents.includes(person.id)) {
      const slot = !parents[0] ? 0 : !parents[1] ? 1 : -1;
      if (slot < 0) return { added, error: "this character already has two parents" };
      parents[slot] = person.id;
      selfUpdate[slot === 0 ? "parent_one_id" : "parent_two_id"] = person.id;
    } else if (row.relation === "partner") {
      partnerId = person.id;
      selfUpdate.current_partner_id = person.id;
      selfUpdate.current_partner_name = null;
    }
  }

  if (Object.keys(selfUpdate).length) {
    const { error } = await supabase.from("characters").update(selfUpdate).eq("id", selfId);
    if (error) return { added, error: error.message };
  }
  return { added, error: null };
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
