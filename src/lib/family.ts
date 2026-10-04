import type { Character, CharacterLite, Relationship } from "./types";

export interface Family {
  parents: CharacterLite[];
  siblings: CharacterLite[];
  children: CharacterLite[];
  partner: CharacterLite | null;
}

/** Works out parents, siblings, children and partner from the parent fields. */
export function getFamily(character: Character, everyone: CharacterLite[]): Family {
  const byId = new Map(everyone.map((c) => [c.id, c]));
  const parentIds = [character.parent_one_id, character.parent_two_id].filter((id): id is string => Boolean(id));

  return {
    parents: parentIds.flatMap((id) => byId.get(id) ?? []),
    siblings: everyone.filter(
      (c) =>
        c.id !== character.id &&
        [c.parent_one_id, c.parent_two_id].some((id) => id && parentIds.includes(id)),
    ),
    children: everyone.filter((c) => c.parent_one_id === character.id || c.parent_two_id === character.id),
    partner: character.current_partner_id ? (byId.get(character.current_partner_id) ?? null) : null,
  };
}

export type WebKind = "family" | "romantic" | "friend" | "rival";

export interface WebLink {
  person: CharacterLite;
  label: string;
  kind: WebKind;
  ended: boolean;
}

function kindOf(type: string): WebKind {
  const t = type.toLowerCase();
  if (/(spouse|romantic|partner|crush|ex|dating|lover|fianc)/.test(t)) return "romantic";
  if (/(sibling|parent|child|cousin|family|aunt|uncle|grand)/.test(t)) return "family";
  if (/(rival|enem|nemesis|feud)/.test(t)) return "rival";
  return "friend";
}

/** Everyone connected to a character, one entry per person, for the relationship web. */
export function getWebLinks(
  character: Character,
  family: Family,
  relationships: Relationship[],
  everyone: CharacterLite[],
): WebLink[] {
  const byId = new Map(everyone.map((c) => [c.id, c]));
  const links = new Map<string, WebLink>();
  const add = (person: CharacterLite | undefined, label: string, kind: WebKind, ended = false) => {
    if (!person || person.id === character.id) return;
    const existing = links.get(person.id);
    if (existing) {
      if (!existing.label.toLowerCase().includes(label.toLowerCase())) existing.label += ` · ${label}`;
      return;
    }
    links.set(person.id, { person, label, kind, ended });
  };

  if (family.partner) add(family.partner, character.relationship_status === "Married" ? "Spouse" : "Partner", "romantic");
  family.parents.forEach((p) => add(p, "Parent", "family"));
  family.children.forEach((c) => add(c, "Child", "family"));
  family.siblings.forEach((s) => add(s, "Sibling", "family"));
  character.past_partners.forEach((p) => p.character_id && add(byId.get(p.character_id), "Ex", "romantic", true));
  relationships.forEach((r) => {
    const otherId = r.character_one_id === character.id ? r.character_two_id : r.character_one_id;
    add(byId.get(otherId), r.relationship_type, kindOf(r.relationship_type), r.status === "ended");
  });

  return [...links.values()];
}
