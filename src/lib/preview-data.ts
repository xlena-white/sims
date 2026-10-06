// Sample data used only in local preview mode (before Supabase is connected).
import type {
  Character,
  Generation,
  Relationship,
  SiteSettings,
  Storyline,
  TimelineEventWithCharacters,
} from "./types";

export const previewSettings: SiteSettings = {
  title: "The Hayes Family",
  subtitle: "A Sims story in three generations",
  epigraph: "Nobody warned us the stove would be the main villain.",
};

export const previewGenerations: Generation[] = [
  {
    number: 1,
    name: "Rachel & Tom",
    tagline: "A starter home and a lot of hope",
    description: "Two broke twenty-somethings, a two-bedroom in Willow Creek, and a smoke alarm that never gets a day off.",
    cover_image_url: null,
  },
  {
    number: 2,
    name: "Emma & Noah",
    tagline: "Growing up Hayes",
    description: "One kid with a five-year plan, one kid with no plan at all, and the same bunk beds until they were sixteen.",
    cover_image_url: null,
  },
  {
    number: 3,
    name: "The Little Ones",
    tagline: "Grandkids, chaos, crayons",
    description: "The house is full again, and somebody has drawn on every wall.",
    cover_image_url: null,
  },
];

const base = {
  photo_url: null,
  tagline: null,
  moral_alignment: null,
  career_current: null,
  career_position: null,
  career_endgame: null,
  past_jobs: [],
  life_status: "alive",
  cause_of_death: null,
  death_note: null,
  relationship_status: null,
  current_partner_id: null,
  current_partner_name: null,
  past_partners: [],
  traits: [],
  hobbies: [],
  parent_one_id: null,
  parent_two_id: null,
  sort_order: 0,
} satisfies Partial<Character>;

export const previewCharacters: Character[] = [
  {
    ...base,
    id: "c9", slug: "rosa-moreno", name: "Rosa Moreno", generation: 1, sort_order: 99,
    tagline: "Taught both girls to cook. Only one of them listened.",
    moral_alignment: "Lawful Good",
    career_current: "Retired", past_jobs: ["Gardener", "Culinary"],
    relationship_status: "Widowed",
    traits: ["Family-Oriented", "Neat", "Nosy"],
    hobbies: ["Gardening", "Cooking", "Knitting"],
    life_status: "dead", cause_of_death: "Old Age", death_note: "Peacefully, in her garden chair, with the radio on.",
  },
  {
    ...base,
    id: "c1", slug: "rachel-hayes", name: "Rachel Hayes", generation: 1,
    tagline: "Runs the house on coffee and lists.",
    moral_alignment: "Neutral Good",
    career_current: "Education", career_position: "Teacher", career_endgame: "Education (Head Chancellor)",
    past_jobs: ["Barista", "Retail Employee"],
    relationship_status: "Married", current_partner_id: "c2",
    past_partners: [{ name: "Kevin Lowe", character_id: null, note: "College boyfriend. Cheated with her roommate." }],
    traits: ["Cheerful", "Family-Oriented", "Bookworm"],
    hobbies: ["Writing", "Gardening", "Baking"],
    parent_one_id: "c9",
  },
  {
    ...base,
    id: "c2", slug: "tom-hayes", name: "Tom Hayes", generation: 1,
    tagline: "Great cook. Has set the kitchen on fire four times.",
    moral_alignment: "Chaotic Good",
    career_current: "Culinary", career_position: "Sous Chef", career_endgame: "Culinary (Celebrity Chef)",
    past_jobs: ["Fast Food Employee", "Manual Laborer"],
    relationship_status: "Married", current_partner_id: "c1",
    traits: ["Goofball", "Foodie", "Clumsy"],
    hobbies: ["Cooking", "Fishing", "Guitar"],
  },
  {
    ...base,
    id: "c3", slug: "jess-moreno", name: "Jess Moreno", generation: 1,
    tagline: "The fun aunt. Allegedly.",
    moral_alignment: "Chaotic Neutral",
    career_current: "Style Influencer", career_position: "Wardrobe Wiz", career_endgame: "Style Influencer (Personal Re-Imager)",
    past_jobs: ["Retail Employee", "Simfluencer"],
    relationship_status: "Single",
    past_partners: [
      { name: "Dev Patel", character_id: "c4", note: "Two dates. We don't talk about it." },
      { name: "Marco (the bartender)", character_id: null, note: "A whole summer." },
    ],
    parent_one_id: "c9",
    traits: ["Outgoing", "Materialistic", "Party Animal", "Self-Absorbed"],
    hobbies: ["Dancing", "Mixology", "Photography"],
  },
  {
    ...base,
    id: "c4", slug: "dev-patel", name: "Dev Patel", generation: 1,
    tagline: "Next door, with the good Wi-Fi.",
    moral_alignment: "Lawful Neutral",
    career_current: "Tech Guru", career_position: "Project Manager", career_endgame: "Tech Guru (Start-Up Genius)",
    past_jobs: ["Freelance Programmer"],
    relationship_status: "Dating", current_partner_name: "Priya Shah",
    past_partners: [{ name: "Jess Moreno", character_id: "c3", note: "Two dates. Still not sure what happened." }],
    traits: ["Geek", "Neat", "Nosy", "Speedrunner Brain"],
    hobbies: ["Programming", "Video Gaming", "Rocket Science"],
  },
  {
    ...base,
    id: "c5", slug: "emma-hayes", name: "Emma Hayes", generation: 2,
    tagline: "Straight A's, then straight to med school.",
    moral_alignment: "Lawful Good",
    career_current: "Doctor", career_position: "Surgeon", career_endgame: "Doctor (Chief of Staff)",
    past_jobs: ["Babysitter", "Lifeguard", "University Student"],
    relationship_status: "Married", current_partner_id: "c7",
    past_partners: [{ name: "Ethan Brooks", character_id: null, note: "Prom date. Peaked at prom." }],
    traits: ["Ambitious", "Perfectionist", "Self-Assured"],
    hobbies: ["Logic", "Fitness", "Piano"],
    parent_one_id: "c1", parent_two_id: "c2",
  },
  {
    ...base,
    id: "c6", slug: "noah-hayes", name: "Noah Hayes", generation: 2,
    tagline: "Will move out eventually.",
    moral_alignment: "Chaotic Neutral",
    career_current: "Video Game Streamer", career_position: "Speedrunner", career_endgame: "Tech Guru (Champion Gamer)",
    past_jobs: ["Fast Food Employee", "Retail Employee"],
    relationship_status: "It's complicated",
    past_partners: [{ name: "Sasha Ortiz", character_id: null, note: "High school sweetheart. On again, off again." }],
    traits: ["Lazy", "Geek", "Goofball"],
    hobbies: ["Video Gaming", "Comedy", "DJ Mixing"],
    parent_one_id: "c1", parent_two_id: "c2",
  },
  {
    ...base,
    id: "c7", slug: "jordan-carter", name: "Jordan Carter", generation: 2,
    tagline: "Married into the chaos, somehow still smiling.",
    moral_alignment: "Neutral Good",
    career_current: "Athlete", career_position: "Professional Bodybuilder", career_endgame: "Athlete (Mr./Ms. Solar System)",
    past_jobs: ["Lifeguard"],
    relationship_status: "Married", current_partner_id: "c5",
    traits: ["Active", "Cheerful", "Outgoing"],
    hobbies: ["Fitness", "Rock Climbing", "Swimming"],
  },
  {
    ...base,
    id: "c8", slug: "mia-carter", name: "Mia Carter", generation: 3,
    tagline: "Draws on every wall she can reach.",
    moral_alignment: "Chaotic Good",
    traits: ["Wild", "Inquisitive"],
    hobbies: ["Painting"],
    parent_one_id: "c5", parent_two_id: "c7",
  },
];

export const previewRelationships: Relationship[] = [
  { id: "r1", character_one_id: "c2", character_two_id: "c4", relationship_type: "Best friends", status: "active", notes: "Grill buddies since the day Tom moved in." },
  { id: "r2", character_one_id: "c1", character_two_id: "c3", relationship_type: "Sibling", status: "active", notes: "Sisters. Rachel is the responsible one." },
  { id: "r3", character_one_id: "c3", character_two_id: "c4", relationship_type: "Ex", status: "ended", notes: "Two dates." },
  { id: "r4", character_one_id: "c5", character_two_id: "c6", relationship_type: "Rivals", status: "complicated", notes: "Sibling rivalry that never really ended." },
  { id: "r5", character_one_id: "c3", character_two_id: "c6", relationship_type: "Friends", status: "active", notes: "Aunt Jess is his favourite." },
];

export const previewStorylines: (Storyline & { character_ids: string[] })[] = [
  {
    id: "s1", slug: "moving-day", title: "Moving Day", generation: 1, era_label: "Spring, Year 1", timeline_position: 1, category: "family",
    summary: "Rachel and Tom get the keys to a very small house.",
    character_ids: ["c1", "c2", "c4"],
    content: `<p>The house on Sage Street had two bedrooms, one bathroom, and a front door that only opened if you lifted it a little. Rachel loved it on sight. Tom loved that it came with a grill.</p><p>They had §1,200 left after the deposit, which bought a bed, a table, and exactly one chair. They took turns sitting in it.</p><blockquote><p>We'll grow into it.</p></blockquote><p>Rachel said it twice, mostly to herself. Tom was already sizing up the backyard for a fire pit.</p><p>Their new neighbour, Dev, came over with a housewarming plant and stayed until midnight fixing their Wi-Fi.</p>`,
  },
  {
    id: "s2", slug: "the-first-fire", title: "The First Fire", generation: 1, era_label: "Autumn, Year 1", timeline_position: 3, category: "conflict",
    summary: "Tom tries to make a soufflé.",
    character_ids: ["c2", "c1"],
    content: `<h2>It started with a soufflé</h2><p>Tom had been watching cooking shows for a week. He was ready. The oven, as it turned out, was not.</p><p>The fire was small, but it was enthusiastic. Rachel put it out with a bag of flour, which is not what you're supposed to do, and which worked anyway.</p><blockquote><p>Fourth time's the charm.</p></blockquote><p>That's what Tom said, three fires later.</p>`,
  },
  {
    id: "s3", slug: "two-kids-one-bathroom", title: "Two Kids, One Bathroom", generation: 2, era_label: "Year 8", timeline_position: 1, category: "family",
    summary: "Emma and Noah share everything, mostly against their will.",
    character_ids: ["c5", "c6", "c1"],
    content: `<p>Emma had a schedule taped to the bathroom door. Noah had never read it. This was the source of most of the shouting in the Hayes house between Years 8 and 14.</p><p>Rachel tried a rota, then a lock, then a second bathroom fund jar on the counter. The jar is still there. It has §34 in it.</p>`,
  },
];

const ref = (id: string) => {
  const c = previewCharacters.find((x) => x.id === id)!;
  return { id: c.id, slug: c.slug, name: c.name };
};

export const previewEvents: TimelineEventWithCharacters[] = [
  { id: "e1", title: "Moving Day", era_label: "Spring, Year 1", timeline_position: 1, generation: 1, storyline_id: "s1", is_key_event: true, description: "Rachel and Tom get the keys to the little house on Sage Street. One chair, two people.", characters: [ref("c1"), ref("c2")] },
  { id: "e2", title: "Meet the Neighbour", era_label: "Spring, Year 1", timeline_position: 2, generation: 1, storyline_id: "s1", is_key_event: true, description: "Dev shows up with a plant and fixes the Wi-Fi. He never really leaves.", characters: [ref("c2"), ref("c4")] },
  { id: "e3", title: "The First Fire", era_label: "Autumn, Year 1", timeline_position: 3, generation: 1, storyline_id: "s2", is_key_event: true, description: "Tom attempts a soufflé. Rachel discovers flour works as a fire extinguisher.", characters: [ref("c2"), ref("c1")] },
  { id: "e4", title: "Backyard Wedding", era_label: "Summer, Year 2", timeline_position: 4, generation: 1, storyline_id: null, is_key_event: true, description: "String lights, a borrowed arch, and Jess giving a toast nobody approved.", characters: [ref("c1"), ref("c2"), ref("c3")] },
  { id: "e5", title: "Emma Arrives", era_label: "Winter, Year 3", timeline_position: 5, generation: 1, storyline_id: null, is_key_event: true, description: "Born at 3am during a snowstorm. Already looks like she has opinions.", characters: [ref("c5"), ref("c1"), ref("c2")] },
  { id: "e6", title: "Then Came Noah", era_label: "Summer, Year 5", timeline_position: 6, generation: 1, storyline_id: null, is_key_event: true, description: "Two kids, one bathroom. The second bathroom fund jar begins.", characters: [ref("c6")] },
  { id: "e7", title: "Two Kids, One Bathroom", era_label: "Year 8", timeline_position: 1, generation: 2, storyline_id: "s3", is_key_event: true, description: "Emma's schedule versus Noah's indifference.", characters: [ref("c5"), ref("c6")] },
];
