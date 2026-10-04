import "server-only";
import { PREVIEW_MODE } from "./supabase/env";
import { createClient } from "./supabase/server";
import {
  previewCharacters,
  previewEvents,
  previewGenerations,
  previewRelationships,
  previewSettings,
  previewStorylines,
} from "./preview-data";
import type {
  Character,
  CharacterLite,
  Generation,
  GenerationNumber,
  Relationship,
  SiteSettings,
  Storyline,
  TimelineEventWithCharacters,
} from "./types";

const DEFAULT_SETTINGS: SiteSettings = { title: "The Storybook", subtitle: null, epigraph: null };
const LITE_COLUMNS = "id, slug, name, generation, photo_url, parent_one_id, parent_two_id";

export async function getSiteSettings(): Promise<SiteSettings> {
  if (PREVIEW_MODE) return previewSettings;
  const supabase = await createClient();
  const { data, error } = await supabase.from("site_settings").select("title, subtitle, epigraph").maybeSingle();
  if (error) throw error;
  return data ?? DEFAULT_SETTINGS;
}

export async function getGenerations(): Promise<Generation[]> {
  if (PREVIEW_MODE) return previewGenerations;
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("generations")
    .select("number, name, tagline, description, cover_image_url")
    .order("number");
  if (error) throw error;
  return data as Generation[];
}

export async function getGeneration(number: GenerationNumber): Promise<Generation | null> {
  if (PREVIEW_MODE) return previewGenerations.find((g) => g.number === number) ?? null;
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("generations")
    .select("number, name, tagline, description, cover_image_url")
    .eq("number", number)
    .maybeSingle();
  if (error) throw error;
  return data as Generation | null;
}

export async function getCharactersByGeneration(number: GenerationNumber): Promise<Character[]> {
  if (PREVIEW_MODE) return previewCharacters.filter((c) => c.generation === number);
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("characters")
    .select("*")
    .eq("generation", number)
    .order("sort_order")
    .order("name");
  if (error) throw error;
  return data as Character[];
}

/** Every character, with just enough to draw links, avatars and family trees. */
export async function getAllCharactersLite(): Promise<CharacterLite[]> {
  if (PREVIEW_MODE) return previewCharacters;
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("characters")
    .select(LITE_COLUMNS)
    .order("generation")
    .order("sort_order")
    .order("name");
  if (error) throw error;
  return data as CharacterLite[];
}

export async function getCharacterBySlug(slug: string): Promise<Character | null> {
  if (PREVIEW_MODE) return previewCharacters.find((c) => c.slug === slug) ?? null;
  const supabase = await createClient();
  const { data, error } = await supabase.from("characters").select("*").eq("slug", slug).maybeSingle();
  if (error) throw error;
  return data as Character | null;
}

export async function getCharacterById(id: string): Promise<Character | null> {
  if (PREVIEW_MODE) return previewCharacters.find((c) => c.id === id) ?? null;
  const supabase = await createClient();
  const { data, error } = await supabase.from("characters").select("*").eq("id", id).maybeSingle();
  if (error) throw error;
  return data as Character | null;
}

export async function getRelationshipsFor(characterId: string): Promise<Relationship[]> {
  if (PREVIEW_MODE) {
    return previewRelationships.filter(
      (r) => r.character_one_id === characterId || r.character_two_id === characterId,
    );
  }
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("relationships")
    .select("*")
    .or(`character_one_id.eq.${characterId},character_two_id.eq.${characterId}`)
    .order("created_at");
  if (error) throw error;
  return data as Relationship[];
}

/** All storylines a character appears in, oldest first. */
export async function getStorylinesFor(characterId: string): Promise<Storyline[]> {
  if (PREVIEW_MODE) {
    return previewStorylines
      .filter((s) => s.character_ids.includes(characterId))
      .sort((a, b) => a.generation - b.generation || a.timeline_position - b.timeline_position);
  }
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("storylines")
    .select("*, storyline_characters!inner(character_id)")
    .eq("storyline_characters.character_id", characterId)
    .order("generation")
    .order("timeline_position");
  if (error) throw error;
  return (data as (Storyline & { storyline_characters?: unknown })[]).map((s) => {
    delete s.storyline_characters;
    return s;
  });
}

export async function getStorylineById(
  id: string,
): Promise<(Storyline & { characters: CharacterLite[] }) | null> {
  if (PREVIEW_MODE) {
    const s = previewStorylines.find((x) => x.id === id);
    if (!s) return null;
    const { character_ids, ...storyline } = s;
    return { ...storyline, characters: previewCharacters.filter((c) => character_ids.includes(c.id)) };
  }
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("storylines")
    .select(`*, storyline_characters(characters(${LITE_COLUMNS}))`)
    .eq("id", id)
    .maybeSingle();
  if (error) throw error;
  if (!data) return null;
  const { storyline_characters, ...storyline } = data as Storyline & {
    storyline_characters: { characters: CharacterLite | null }[];
  };
  return { ...storyline, characters: storyline_characters.flatMap((sc) => (sc.characters ? [sc.characters] : [])) };
}

export async function getTimelineEvents(number?: GenerationNumber): Promise<TimelineEventWithCharacters[]> {
  if (PREVIEW_MODE) return previewEvents.filter((e) => !number || e.generation === number);
  const supabase = await createClient();
  let query = supabase
    .from("timeline_events")
    .select("*, timeline_event_characters(characters(id, slug, name))")
    .order("generation")
    .order("timeline_position");
  if (number) query = query.eq("generation", number);
  const { data, error } = await query;
  if (error) throw error;

  type Row = TimelineEventWithCharacters & {
    timeline_event_characters: { characters: TimelineEventWithCharacters["characters"][number] | null }[];
  };
  return (data as Row[]).map(({ timeline_event_characters, ...event }) => ({
    ...event,
    characters: timeline_event_characters.flatMap((tc) => (tc.characters ? [tc.characters] : [])),
  }));
}
