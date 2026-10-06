export type GenerationNumber = 1 | 2 | 3;

export interface SiteSettings {
  title: string;
  subtitle: string | null;
  epigraph: string | null;
}

export interface Generation {
  number: GenerationNumber;
  name: string;
  tagline: string | null;
  description: string | null;
  cover_image_url: string | null;
}

export interface PastPartner {
  name: string;
  character_id: string | null;
  note: string | null;
}

export interface Character {
  id: string;
  slug: string;
  name: string;
  generation: GenerationNumber;
  photo_url: string | null;
  tagline: string | null;
  moral_alignment: string | null;
  career_current: string | null;
  career_position: string | null;
  career_endgame: string | null;
  past_jobs: string[];
  life_status: "alive" | "dead";
  cause_of_death: string | null;
  death_note: string | null;
  relationship_status: string | null;
  current_partner_id: string | null;
  current_partner_name: string | null;
  past_partners: PastPartner[];
  traits: string[];
  hobbies: string[];
  parent_one_id: string | null;
  parent_two_id: string | null;
  sort_order: number;
}

export type CharacterLite = Pick<
  Character,
  "id" | "slug" | "name" | "generation" | "photo_url" | "parent_one_id" | "parent_two_id" | "life_status"
>;

export interface Storyline {
  id: string;
  slug: string;
  title: string;
  summary: string | null;
  content: string;
  generation: GenerationNumber;
  era_label: string | null;
  timeline_position: number;
  category: string | null;
}

export interface Relationship {
  id: string;
  character_one_id: string;
  character_two_id: string;
  relationship_type: string;
  status: string;
  notes: string | null;
}

export interface TimelineEvent {
  id: string;
  title: string;
  description: string | null;
  era_label: string | null;
  timeline_position: number;
  generation: GenerationNumber;
  storyline_id: string | null;
  is_key_event: boolean;
}

export interface TimelineEventWithCharacters extends TimelineEvent {
  characters: Pick<Character, "id" | "slug" | "name">[];
}

export function isGenerationNumber(n: number): n is GenerationNumber {
  return n === 1 || n === 2 || n === 3;
}

/** Each generation gets its own accent colour, used on cards, pills and the timeline. */
export const GEN_ACCENT: Record<GenerationNumber, { text: string; bg: string; border: string; hex: string }> = {
  1: { text: "text-mint", bg: "bg-mint", border: "border-mint", hex: "#8ee4a1" },
  2: { text: "text-peach", bg: "bg-peach", border: "border-peach", hex: "#f5a98b" },
  3: { text: "text-lilac", bg: "bg-lilac", border: "border-lilac", hex: "#b8a7f5" },
};
