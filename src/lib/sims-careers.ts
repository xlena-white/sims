// Career positions for The Sims 4, from the official EA help pages (help.ea.com).
// Generated once; edit by hand if a pack changes them. Mod careers can be typed in freely.

export interface CareerTrack {
  /** Shared levels before the career splits. */
  levels: string[];
  /** Branch name → its levels, in order. */
  branches: Record<string, string[]>;
  partTime?: boolean;
}

export const CAREER_TRACKS: Record<string, CareerTrack> = {
  "Actor": {
    levels: ["Uncredited Extra","Background Actor","Commercial Spokesperson","Guest Star","Supporting Actor/Actress","Sitcom Star","Rising Star","Seasoned Thespian","Superstar","Silver Screen Icon"],
    branches: {},
  },
  "Astronaut": {
    levels: ["Intern","Module Cleaner","Technician","Command Center Lead","Low-Orbit Specialist","Space Cadet","Astronaut"],
    branches: {
      "Space Ranger": ["Planet Patrol","Sheriff of the Stars","Space Ranger"],
      "Interstellar Smuggler": ["Moon Mercenary","Alien Goods Trader","Interstellar Smuggler"],
    },
  },
  "Athlete": {
    levels: ["Waterperson","Locker Room Attendant","Team Mascot","Dance Team Captain"],
    branches: {
      "Professional Athlete": ["Minor Leaguer","Rookie","Starter","All-Star","MVP","Hall of Famer"],
      "Bodybuilder": ["Personal Trainer","Professional Bodybuilder","Champion Bodybuilder","Trainer to the Stars","Celebrity Bodybuilder","Mr./Ms. Solar System"],
    },
  },
  "Business": {
    levels: ["Mailroom Technician","Office Assistant","Assistant to the Manager","Assistant Manager","Regional Manager","Senior Manager"],
    branches: {
      "Management": ["Vice-President","President","CEO","Business Tycoon"],
      "Investor": ["Futures Trader","Hedge Fund Manager","Corporate Raider","Angel Investor"],
    },
  },
  "Civil Designer": {
    levels: ["Junior Draftsperson","Architectural Apprentice","Construction Technician"],
    branches: {
      "Civic Planner": ["Utilities Assistant","Urban Surveyor","Policy Planner","Civic Anarchist","Neighbourhood Improvement Officer","Municipal Engineer","City Master Planner"],
      "Green Technician": ["Installation Intern","Design Guru","Machine Modifier","Eco-Tech Scientist","Device Savant","Expert Fabricator","Master Inventor"],
    },
  },
  "Conservationist": {
    levels: ["Wildlife Enthusiast","Field Assistant","Land Surveyor","Wildlife Technician","Nature Historian","Conservation Director"],
    branches: {
      "Environmental Manager": ["Conservation Regulator","Sustainability Specialist","Environmental Ambassador","Chief Sustainability Officer"],
      "Marine Biologist": ["Ocean Observer","Fisheries Specialist","Aquatic Ecologist","Master of Marine Affairs"],
    },
  },
  "Criminal": {
    levels: ["Tough Guy/Gal","Petty Thief","Ring Leader","Felonious Monk","Minor Crimelord"],
    branches: {
      "Boss": ["The Muscle","Getaway Driver","Safe Cracker","The Brains","The Boss"],
      "Oracle": ["Digi Thief","Elite Hacker","An0nymous Ghost","Net Demon","The Oracle"],
    },
  },
  "Critic": {
    levels: ["Paper Deliverer","Story Researcher","Beat Reporter"],
    branches: {
      "Arts Critic": ["Snooty Pundit","Show Scout","Refined Reviewer","Cultural Connoisseur","Chief Critic","Syndicated Superstar","Grand Steward of the Arts"],
      "Food Critic": ["Chow Chaser","Food Stall Frequenter","Restaurant Rater","Local Gourmand","Expert Epicurean","Kitchen’s Worst Nightmare","Curator of the Finest Flavors"],
    },
  },
  "Culinary": {
    levels: ["Assistant Dishwasher","Head Dishwasher","Caterer","Mixologist","Line Cook"],
    branches: {
      "Chef": ["Head Caterer","Pastry Chef","Sous Chef","Executive Chef","Celebrity Chef"],
      "Mixologist": ["Head Mixologist","Juice Boss","Chief Drink Operator","Drinkmaster","Celebrity Mixologist"],
    },
  },
  "Detective": {
    levels: ["Cadet","Officer","Corporal","Detective","Senior Detective","Sergeant","Lieutenant","Captain","Colonel","Chief"],
    branches: {},
  },
  "Doctor": {
    levels: ["Medical Intern","Orderly","Medical Assistant","Medical Technologist","Assistant Nurse","R.N.","Doctor-General Practitioner","Medical Specialist","Surgeon","Chief of Staff"],
    branches: {},
  },
  "Education": {
    levels: ["Substitute Teacher","Teaching Assistant","Teacher","Mentor Teacher","Department Head"],
    branches: {
      "Administrator": ["Student Services Officer","Dean of Admissions","Director of Academics","Vice-Chancellor","Head Chancellor"],
      "Professor": ["Intrepid Instructor","Lead Lecturer","Adjunct Professor","Tenured Professor","Master Educator"],
    },
  },
  "Engineer": {
    levels: ["Support Technician","Engineering Intern","Apprentice of Algorithms","Cog in the Machine","Engineering Technician","Expert Engineer"],
    branches: {
      "Computer Engineer": ["Constructor of Computers","Processor of Processors","Computer Connoisseur","PC Prodigy"],
      "Mechanical Engineer": ["Maker of Mechanisms","Artisan of Apparatuses","Mechanical Genius","Master of Machines"],
    },
  },
  "Entertainer": {
    levels: ["Amateur Entertainer","Open Mic Seeker","C-Lister","Opening Act"],
    branches: {
      "Comedian": ["Jokesmith","Solid Storyteller","Rising Comedian","Roast Master","Stand Up Star","Show Stopper"],
      "Musician": ["Jingle Jammer","Serious Musician","Professional Pianist","Symphonic String Player","Instrumental Wonder","Concert Virtuoso"],
    },
  },
  "Gardener": {
    levels: ["Dirt Digger","Soil-Sifter","Seed Scatterer","Leaf Cutter"],
    branches: {
      "Botanist": ["Plant Nerd","Stem Researcher","Sap Splicer","Flower Fellow","Bouquet Biologist","PHD of Pollen"],
      "Floral Designer": ["Petal-Placer","Stem Cutter","Anther Artist","Floral Organizer","Leafy Luminary","Visionary of Vases"],
    },
  },
  "Interior Decorator": {
    levels: ["Interior Design Consultant","Interior Design Technician","Space Manager","Decorating Consultant","Building Space Planner","Home Organizer","Home Decorator","Business Interior Designer","Interior Designer","Certified Interior Designer"],
    branches: {},
  },
  "Law": {
    levels: ["Process Server","File Clerk","Legal Secretary","Paralegal","Budding Barrister","Adept Attorney","Promising Prosecutor"],
    branches: {
      "Judge": ["Gavel Smasher","Honorable Arbitrator","Chief of Justice"],
      "Private Attorney": ["Lead Litigator","Legal Eagle","Preeminent Partner"],
    },
  },
  "Military": {
    levels: ["Raw Recruit","Private Fourth Class","Lacking Corporal","Sergeant Minor","Warrant Officer"],
    branches: {
      "Covert Operator": ["Evidence Eraser","Conspiracy Squelcher","Clandestine Investigator","[Redacted]","Sim-in-Black"],
      "Officer": ["Fourth Lieutenant","Courageous Captain","Lieutenant Colonel","Brigadier","Grand Marshal"],
    },
  },
  "Painter": {
    levels: ["Palette Cleaner","Art Book Collator","Hungry Artist","Watercolor Dabbler","Canvas Creator","Imaginative Imaginist"],
    branches: {
      "Patron of the Arts": ["Color Theory Critic","Fine-Art Aficionado","Composition Curator","Patron of the Arts"],
      "Master of the Real": ["Artist En Residence","Professional Painter","Illustrious Illustrator","Master of the Real"],
    },
  },
  "Politician": {
    levels: ["Unruly Activist","Campaign Intern","Social Justice Worker","Community Organizer"],
    branches: {
      "Politician": ["Civil Servant","Public Official","Councilperson","Representative","Elder Statesperson","National Leader"],
      "Charity Organizer": ["Friendly Lobbyist","Fundraising Specialist","Charity Organizer","Non-Profit Director","Leader of the Cause","Charity Icon"],
    },
  },
  "Reaper": {
    levels: ["Grimtern","Restceptionist","Dust-To-Dust Buster","Collections Agent","Soul Slayer","Spirit Expert (Extraction & Resolution)","Nether-Tether","D.N.R. (Death Negotiation Reporter)","Graveling","Reaper"],
    branches: {},
  },
  "Romance Consultant": {
    levels: ["Romance Newbie","Passion Assistant","Love Mediator","Romance Practitioner","Emotional Health Counselor","Love Language Expert","Romance Health Specialist"],
    branches: {
      "Relationship Counselor": ["Intimate Relationship Coach","Qualified Relationship Professional","Licensed Clinical Romance Counselor"],
      "Matchmaker": ["Love Connection Specialist","Relationship Compatibility Expert","Certified Dating Specialist"],
    },
  },
  "Salaryperson": {
    levels: ["New Hire","Pencil Pusher","Competent Clerk","Office Doyen"],
    branches: {
      "Expert": ["Data Wrangler","Calculus Adept","Spreadsheet Specialist","Master/Mistress of the Cells","Formula Virtuoso","Cloud Date Guru"],
      "Supervisor": ["Valued Employee","Team Leader","Skilled Supervisor","Prime Planner","Group Oracle","Head of the Department"],
    },
  },
  "Scientist": {
    levels: ["Lab Technician","Apprentice Inventor","Junior Tinkerer","Serum Sequencer","Technological Innovator","Ufologist","Laboratory Leader","Pioneer of New Technologies","Mad Scientist","Extraterrestrial Explorer"],
    branches: {},
  },
  "Secret Agent": {
    levels: ["Agency Clerk","Intelligence Researcher","Agent Handler","Field Agent","Lead Detective","Government Agent","Secret Agent"],
    branches: {
      "Diamond Agent": ["Spy Captain","Shadow Agent","Double Diamond Agent"],
      "Villain": ["Double Agent","[Redacted]","Supreme Villain","Triple Agent"],
    },
  },
  "Social Media": {
    levels: ["Media Intern","Engagement Monkey","Clickbait Writer"],
    branches: {
      "Internet Personality": ["Simstagram Searcher","Cat Video Creator","Niche Broadcaster","Meme Maker","Online A-Lister","Reality Show Contestant","Internet Superstar"],
      "Public Relations": ["Public Relations Coordinator","Community Manager","Press Agent","Account Executive","Director of Communications","VP. of Public Relations","Spin Doctor"],
    },
  },
  "Style Influencer": {
    levels: ["Rag Reviewer","Consignment Commentator","Wearable Wordsmith","Ensemble Author","Culture Columnist"],
    branches: {
      "Trend Setter": ["Dedicated Dresser","Textile Tactician","Wardrobe Wiz","Make-Over Miracle Worker","Personal Re-Imager"],
      "Stylist": ["Posh Profiler","Fashion Figure","Best Self-Helper","It Sim","Icon O’Class"],
    },
  },
  "Tech Guru": {
    levels: ["Live Chat Support Agent","Quality Assurance","Code Monkey","Ace Engineer","Project Manager","Development Captain"],
    branches: {
      "eSport Gamer": ["eSports Competitor","Pro Gamer","APM King/Queen","Champion Gamer"],
      "Start-up Entrepreneur": ["The Next Big Thing?","Independent Consultant","Dot-Com Pioneer","Start-Up Genius"],
    },
  },
  "Undertaker": {
    levels: ["Grave Digger","Bodyguard","Grave Keeper","Removal Service Staff"],
    branches: {
      "Funeral Director": ["Administrative Assistant","Grief Counselor","Burial Consultant","Services Manager","Assistant Director","Funeral Director"],
      "Mortician": ["Death Scene Cleaner","Microbial Researcher","Cremation Specialist","Embalmer","Mortuary Assistant","Mortician"],
    },
  },
  "Writer": {
    levels: ["Writer’s Assistant","Blogger","Freelance Article Writer","Advice Columnist","Regular Contributor"],
    branches: {
      "Author": ["Short Story Writer","Novelist","Fan Favorite","Bestselling Author","Creator of Worlds"],
      "Journalist": ["Page Two Journalist","Front Page Writer","Investigative Journalist","Editor-in-Chief","Scribe of History"],
    },
  },
  "Babysitter": {
    levels: ["Babysitter","Nanny","Daycare Admin"],
    branches: {},
    partTime: true,
  },
  "Barista": {
    levels: ["Coffee Stain Remover","Bean Blender","Latte Artist"],
    branches: {},
    partTime: true,
  },
  "Diver": {
    levels: ["Snorkel Guide","Scuba Instructor","Sunken Treasure Hunter"],
    branches: {},
    partTime: true,
  },
  "Fast Food Employee": {
    levels: ["Table Cleaner","Fry Cook","Food Service Cashier"],
    branches: {},
    partTime: true,
  },
  "Fisherman": {
    levels: ["Goldfish Hunter","River Wrangler","Deep Sea Fishing Master"],
    branches: {},
    partTime: true,
  },
  "Handyperson": {
    levels: ["Able Tinkerer","Hotshot Helper","Prime Fixer Upper"],
    branches: {},
    partTime: true,
  },
  "Lifeguard": {
    levels: ["CPR Dummy Stand-In","Wave Watcher","Prolific Whistler"],
    branches: {},
    partTime: true,
  },
  "Manual Laborer": {
    levels: ["Lawn Mower","Landscaper","Backhoe Operator"],
    branches: {},
    partTime: true,
  },
  "Retail Employee": {
    levels: ["Shelf Stocker","Sales Floor Clerk","Customer Support"],
    branches: {},
    partTime: true,
  },
  "Simfluencer": {
    levels: ["Nano-Simfluencer","Macro-Simfluencer","Mega-Simfluencer"],
    branches: {},
    partTime: true,
  },
  "Video Game Streamer": {
    levels: ["Casual Streamer","Speedrunner","Pro-Gamer"],
    branches: {},
    partTime: true,
  },
};
