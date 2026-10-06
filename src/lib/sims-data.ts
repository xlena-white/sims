// Reference lists for The Sims 4, used as suggestions in the admin forms.
// Anything not listed here (new packs, mods, CC) can still be typed in freely.
import { CAREER_TRACKS } from "./sims-careers";

export interface TraitGroup {
  name: string;
  color: "mint" | "peach" | "lilac" | "sky" | "butter" | "rose" | "stone";
  traits: string[];
}

export const TRAIT_GROUPS: TraitGroup[] = [
  {
    name: "Emotional",
    color: "peach",
    traits: [
      "Ambitious", "Cheerful", "Childish", "Clumsy", "Creative", "Erratic", "Genius", "Gloomy",
      "Goofball", "Hot-Headed", "Lovebug", "Paranoid", "Practice Makes Perfect", "Romantic",
      "Romantically Reserved", "Self-Assured", "Squeamish", "Unflirty",
    ],
  },
  {
    name: "Hobby",
    color: "sky",
    traits: [
      "Art Lover", "Bookworm", "Dance Machine", "Foodie", "Geek", "Loves Outdoors", "Maker",
      "Music Lover", "Recycle Disciple",
    ],
  },
  {
    name: "Lifestyle",
    color: "mint",
    traits: [
      "Active", "Adventurous", "Chased by Death", "Child of the Islands", "Child of the Ocean",
      "Child of the Village", "Competitive", "Disruptive", "Freegan", "Glutton", "Green Fiend",
      "High Maintenance", "Kleptomaniac", "Lactose Intolerant", "Lazy", "Macabre", "Materialistic",
      "Mystical", "Neat", "Overachiever", "Perfectionist", "Rancher", "Skeptical", "Slob",
      "Vegetarian",
    ],
  },
  {
    name: "Social",
    color: "lilac",
    traits: [
      "Animal Enthusiast", "Bro", "Cat Lover", "Cringe", "Dog Lover", "Evil", "Family-Oriented",
      "Generous", "Good", "Hates Children", "Horse Lover", "Idealist", "Insider", "Jealous", "Loner",
      "Loyal", "Mean", "Noncommittal", "Nosy", "Outgoing", "Party Animal", "Plant Lover", "Proper",
      "Self-Absorbed", "Shady", "Snob", "Socially Awkward",
    ],
  },
  {
    name: "Toddler",
    color: "butter",
    traits: ["Angelic", "Charmer", "Clingy", "Fussy", "Independent", "Inquisitive", "Silly", "Wild"],
  },
  {
    name: "Infant",
    color: "butter",
    traits: ["Calm", "Cautious", "Intense", "Sensitive", "Sunny", "Wiggly"],
  },
  {
    name: "Bonus & Reward",
    color: "rose",
    traits: [
      "Alluring", "Antiseptic", "Business Savvy", "Carefree", "Collector", "Creatively Gifted",
      "Domestic", "Entrepreneurial", "Essence of Flavor", "Fertile", "Gregarious", "Hardly Hungry",
      "Highly Driven", "Incredibly Friendly", "Legendary Stamina", "Mentor", "Morning Person", "Muser",
      "Night Owl", "Observant", "Professional Slacker", "Quick Learner", "Shameless", "Speed Reader",
      "Steel Bladder", "Super Green Thumb",
    ],
  },
];

const TRAIT_COLOR = new Map<string, TraitGroup["color"]>();
TRAIT_GROUPS.forEach((g) => g.traits.forEach((t) => TRAIT_COLOR.set(t.toLowerCase(), g.color)));

/** Colour for a trait chip. Custom (modded) traits get the neutral "stone" colour. */
export function traitColor(trait: string): TraitGroup["color"] {
  return TRAIT_COLOR.get(trait.toLowerCase()) ?? "stone";
}

/** Careers with official positions, plus jobs that don't have levels. */
export const CAREERS = [
  ...Object.keys(CAREER_TRACKS),
  "Freelance Artist", "Freelance Crafter", "Freelance Digital Artist", "Freelance Fashion Photographer",
  "Freelance Programmer", "Freelance Writer", "Paranormal Investigator", "Business Owner",
  "Restaurant Owner", "Retail Store Owner", "Vet Clinic Owner", "University Student",
  "Stay-at-Home Parent", "Unemployed", "Retired",
];

export interface PositionGroup {
  label: string;
  positions: { title: string; level: number }[];
}

function findTrack(career: string | null | undefined) {
  if (!career) return undefined;
  const key = Object.keys(CAREER_TRACKS).find((k) => k.toLowerCase() === career.trim().toLowerCase());
  return key ? CAREER_TRACKS[key] : undefined;
}

/** Positions in a career, grouped into the shared levels and each branch. Empty for unknown/mod careers. */
export function positionsFor(career: string | null | undefined): PositionGroup[] {
  const track = findTrack(career);
  if (!track) return [];
  const shared = track.levels.map((title, i) => ({ title, level: i + 1 }));
  const groups: PositionGroup[] = shared.length ? [{ label: Object.keys(track.branches).length ? "Before the branch" : "Levels", positions: shared }] : [];
  for (const [branch, titles] of Object.entries(track.branches)) {
    groups.push({
      label: `${branch} branch`,
      positions: titles.map((title, i) => ({ title, level: shared.length + i + 1 })),
    });
  }
  return groups;
}

/** Level and branch for a position, e.g. { level: 8, branch: "Chef" }, when it's an official one. */
export function describePosition(career: string | null | undefined, position: string | null | undefined) {
  if (!position) return null;
  for (const group of positionsFor(career)) {
    const match = group.positions.find((p) => p.title.toLowerCase() === position.trim().toLowerCase());
    if (match) return { level: match.level, branch: group.label.endsWith(" branch") ? group.label.replace(/ branch$/, "") : null };
  }
  return null;
}

export const HOBBIES = [
  "Acting", "Archaeology", "Baking", "Bowling", "Charisma", "Comedy", "Cooking", "Cross-Stitch",
  "Dancing", "DJ Mixing", "Entrepreneur", "Equestrian", "Fabrication", "Fishing", "Fitness",
  "Flower Arranging", "Gardening", "Gourmet Cooking", "Guitar", "Handiness", "Herbalism",
  "Juice Fizzing", "Knitting", "Logic", "Media Production", "Mischief", "Mixology", "Nectar Making",
  "Painting", "Papercraft", "Parenting", "Photography", "Piano", "Pipe Organ", "Programming",
  "Research & Debate", "Robotics", "Rock Climbing", "Rocket Science", "Romance", "Singing",
  "Skiing", "Snowboarding", "Tattooing", "Veterinarian", "Video Gaming", "Violin", "Wellness",
  "Writing",
  // Everyday hobbies that aren't skills
  "Chess", "Collecting", "Hiking", "Karaoke", "Reading", "Stargazing", "Swimming", "Yoga",
];

export const ALIGNMENTS = [
  "Lawful Good", "Neutral Good", "Chaotic Good",
  "Lawful Neutral", "True Neutral", "Chaotic Neutral",
  "Lawful Evil", "Neutral Evil", "Chaotic Evil",
];

export const RELATIONSHIP_STATUSES = [
  "Single", "Dating", "Engaged", "Married", "Separated", "Divorced", "Widowed", "It's complicated",
];

export const RELATIONSHIP_TYPES = [
  "Best friends", "Friends", "Romantic", "Spouse", "Ex", "Crush", "Sibling", "Parent", "Cousin",
  "Roommates", "Coworkers", "Rivals", "Enemies",
];

export const RELATIONSHIP_STATES = ["active", "ended", "complicated"];

export const DEATH_CAUSES = [
  "Old Age", "Fire", "Drowning", "Electrocution", "Starvation", "Hysteria (laughter)",
  "Embarrassment", "Anger", "Overexertion", "Cowplant", "Poisoned Pufferfish", "Frozen",
  "Overheating", "Lightning", "Meteorite", "Murphy Bed", "Sun (vampire)", "Killer Chicken",
  "Rabid Rodent Fever", "Mother Plant", "Childbirth", "Murder", "Accident", "Illness",
];
