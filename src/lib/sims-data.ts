// Reference lists for The Sims 4, used as suggestions in the admin forms.
// Anything not listed here (new packs, mods, CC) can still be typed in freely.

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
      "Cheerful", "Creative", "Erratic", "Genius", "Gloomy", "Goofball", "Hot-Headed",
      "Paranoid", "Romantic", "Romantically Reserved", "Self-Assured", "Unflirty",
    ],
  },
  {
    name: "Hobby",
    color: "sky",
    traits: [
      "Animal Enthusiast", "Art Lover", "Bookworm", "Cat Lover", "Dance Machine", "Dog Lover",
      "Foodie", "Geek", "Loves Outdoors", "Maker", "Music Lover", "Recycle Disciple",
    ],
  },
  {
    name: "Lifestyle",
    color: "mint",
    traits: [
      "Active", "Adventurous", "Ambitious", "Child of the Islands", "Child of the Ocean",
      "Child of the Village", "Childish", "Clumsy", "Freegan", "Glutton", "Green Fiend",
      "High Maintenance", "Kleptomaniac", "Lactose Intolerant", "Lazy", "Macabre", "Materialistic",
      "Neat", "Overachiever", "Party Animal", "Perfectionist", "Proper", "Slob", "Snob",
      "Squeamish", "Vegetarian",
    ],
  },
  {
    name: "Social",
    color: "lilac",
    traits: [
      "Bro", "Evil", "Family-Oriented", "Good", "Hates Children", "Insider", "Jealous", "Loner",
      "Mean", "Noncommittal", "Outgoing", "Self-Absorbed", "Socially Awkward",
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
      "Highly Driven", "Incredibly Friendly", "Mentor", "Morning Person", "Muser", "Night Owl",
      "Observant", "Professional Slacker", "Quick Learner", "Shameless", "Speed Reader",
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

export const CAREERS = [
  // Full-time careers
  "Actor", "Astronaut", "Athlete", "Business", "Civil Designer", "Conservationist", "Criminal",
  "Critic", "Culinary", "Detective", "Doctor", "Education", "Engineer", "Entertainer", "Gardener",
  "Interior Decorator", "Law", "Marine Biologist", "Military", "Painter", "Politician",
  "Reaper", "Romance Consultant", "Salaryperson", "Scientist", "Secret Agent", "Social Media",
  "Style Influencer", "Tech Guru", "Undertaker", "Writer",
  // Freelance & self-employed
  "Freelance Artist", "Freelance Crafter", "Freelance Fashion Photographer", "Freelance Programmer",
  "Freelance Writer", "Paranormal Investigator", "Business Owner", "Restaurant Owner",
  "Retail Store Owner", "Vet Clinic Owner",
  // Part-time & teen jobs
  "Babysitter", "Barista", "Diver", "Fast Food Employee", "Fisherman", "Lifeguard",
  "Manual Laborer", "Retail Employee", "Simfluencer", "Video Gamer",
  // Other
  "University Student", "Stay-at-Home Parent", "Unemployed", "Retired",
];

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
