/**
 * Centralized game data for the Evolvion web prototype API.
 *
 * All entity data lives here so route files can import a single source of truth.
 * Names, IDs, and progression match the Unity project at Assets/Scripts/Data/.
 *
 * Era enum mapping (Unity -> display name):
 *   StoneAge       -> Stone Age
 *   TribalAge      -> Tribal Age
 *   BronzeAge      -> Bronze Age
 *   ClassicalAge   -> Classical Age
 *   MiddleAge      -> Medieval Age
 *   IndustrialAge  -> Industrial Age
 *   RobotAge       -> Robot Age
 *   SpaceAge       -> Space Age
 *   SingularityAge -> Singularity
 */

// ---------------------------------------------------------------------------
// Type definitions (mirrors the Zod-generated types from lib/api-zod)
// ---------------------------------------------------------------------------

export type CardRarity = "common" | "clear" | "epic" | "legendary";
export type AchievementCategory = "planet" | "combat" | "clan" | "collection" | "purchase" | "ads";
export type EquipmentSlot = "helmet" | "weapon" | "armor" | "gadget";

export interface Planet {
  id: number;
  name: string;
  description: string;
  currentEra: number;
  totalEras: number;
  color: string;
  icon: string;
  resources: number;
  population: number;
  isUnlocked: boolean;
}

export interface Era {
  id: number;
  name: string;
  description: string;
  planetId: number;
  order: number;
  isUnlocked: boolean;
  enemies: string[];
  structures: string[];
  equipmentSet: string;
}

export interface Card {
  id: number;
  name: string;
  planetId: number;
  eraId: number;
  rarity: CardRarity;
  isOwned: boolean;
  imageUrl?: string;
  description: string;
}

export interface EquipmentItem {
  id: number;
  name: string;
  rarity: CardRarity;
  era: string;
  statBonus: number;
  emoji: string;
}

export interface Equipment {
  helmet: EquipmentItem;
  weapon: EquipmentItem;
  armor: EquipmentItem;
  gadget: EquipmentItem;
}

export interface Character {
  name: string;
  level: number;
  currentEra: string;
  health: number;
  maxHealth: number;
  attack: number;
  defense: number;
  equipment: Equipment;
  currentSkin: string;
  experience: number;
  maxExperience: number;
}

export interface Achievement {
  id: number;
  name: string;
  description: string;
  category: AchievementCategory;
  isUnlocked: boolean;
  rewardType: string;
  rewardAmount: number;
  iconEmoji: string;
}

export interface Clan {
  id: number;
  name: string;
  description: string;
  memberCount: number;
  maxMembers: number;
  level: number;
  totalPoints: number;
  emblem: string;
  isJoined: boolean;
}

// ---------------------------------------------------------------------------
// PLANETS
// ---------------------------------------------------------------------------

export const planets: Planet[] = [
  {
    id: 1,
    name: "Porera",
    description:
      "The first planet, birthplace of civilization. Journey from primitive stone tools to the discovery of metals and beyond.",
    currentEra: 3,
    totalEras: 9,
    color: "#FF6B35",
    icon: "\u{1F30B}", // volcano
    resources: 142500,
    population: 85000,
    isUnlocked: true,
  },
  {
    id: 2,
    name: "Doresa",
    description:
      "A lush planet of culture and commerce. From classical empires to industrial revolution, this world drives progress.",
    currentEra: 2,
    totalEras: 9,
    color: "#2ECC71",
    icon: "\u{1F33F}", // herb
    resources: 87300,
    population: 210000,
    isUnlocked: true,
  },
  {
    id: 3,
    name: "Aitherium",
    description:
      "The technological frontier. Robotics, space exploration, and the ultimate singularity await those who unlock this world.",
    currentEra: 1,
    totalEras: 9,
    color: "#00D4FF",
    icon: "\u26A1", // lightning
    resources: 12000,
    population: 5000,
    isUnlocked: false,
  },
];

// ---------------------------------------------------------------------------
// ERAS  (order 1-9, maps to Unity EraType enum)
// ---------------------------------------------------------------------------

export const eras: Era[] = [
  {
    id: 1,
    name: "Stone Age",
    description:
      "The dawn of civilization. Primitive tools, basic shelters, and the first communities form.",
    planetId: 1,
    order: 1,
    isUnlocked: true,
    enemies: ["Saber-tooth Tiger", "Cave Bear", "Giant Scorpion"],
    structures: ["Stone Hut", "Campfire", "Rock Mine"],
    equipmentSet: "Stone Set",
  },
  {
    id: 2,
    name: "Tribal Age",
    description:
      "Tribes form and cultures emerge. Basic warfare and shamanic rituals shape society.",
    planetId: 1,
    order: 2,
    isUnlocked: true,
    enemies: ["Rival Tribesman", "Dire Wolf", "Tribal Shaman"],
    structures: ["Tribal Lodge", "Totem Pole", "Hunting Ground"],
    equipmentSet: "Tribal Set",
  },
  {
    id: 3,
    name: "Bronze Age",
    description:
      "The discovery of metal changes everything. Stronger weapons, better tools, expanding empires.",
    planetId: 1,
    order: 3,
    isUnlocked: true,
    enemies: ["Bronze Soldier", "Wild Boar Pack", "Mercenary"],
    structures: ["Forge", "Bronze Mine", "Trading Post"],
    equipmentSet: "Bronze Set",
  },
  {
    id: 4,
    name: "Classical Age",
    description:
      "Cultural expansion and flourishing trade. Mythological creatures guard ancient treasures.",
    planetId: 1,
    order: 4,
    isUnlocked: false,
    enemies: ["Minotaur", "Harpy", "Gladiator"],
    structures: ["Colosseum", "Library", "Harbor"],
    equipmentSet: "Classical Set",
  },
  {
    id: 5,
    name: "Medieval Age",
    description:
      "Kingdoms rise and fall. Castles dot the landscape as knights and dragons clash.",
    planetId: 2,
    order: 5,
    isUnlocked: true,
    enemies: ["Bandit Captain", "Dark Knight", "Dragon Whelp"],
    structures: ["Castle", "Cathedral", "Mill"],
    equipmentSet: "Medieval Set",
  },
  {
    id: 6,
    name: "Industrial Age",
    description:
      "Machines reshape the world. Factories belch smoke as primitive robots emerge.",
    planetId: 2,
    order: 6,
    isUnlocked: false,
    enemies: ["Steam Golem", "Factory Bot", "Rogue Machine"],
    structures: ["Factory", "Steam Engine", "Power Plant"],
    equipmentSet: "Industrial Set",
  },
  {
    id: 7,
    name: "Robot Age",
    description:
      "Full automation. Advanced robots handle everything, but some turn rogue.",
    planetId: 3,
    order: 7,
    isUnlocked: false,
    enemies: ["Advanced Droid", "Combat Mech", "AI Guardian"],
    structures: ["Robot Factory", "Data Center", "Energy Grid"],
    equipmentSet: "Robot Set",
  },
  {
    id: 8,
    name: "Space Age",
    description:
      "Reach for the stars. Alien life and cosmic fauna challenge the brave.",
    planetId: 3,
    order: 8,
    isUnlocked: false,
    enemies: ["Space Kraken", "Alien Soldier", "Void Beast"],
    structures: ["Space Station", "Launch Pad", "Solar Array"],
    equipmentSet: "Space Set",
  },
  {
    id: 9,
    name: "Singularity",
    description:
      "The ultimate evolution. A self-sustaining ecosystem integrating all previous eras.",
    planetId: 3,
    order: 9,
    isUnlocked: false,
    enemies: ["Singularity Entity", "Quantum Wraith", "Final Boss"],
    structures: ["Singularity Core", "Nexus Hub", "Omega Gate"],
    equipmentSet: "Singularity Set",
  },
];

// ---------------------------------------------------------------------------
// CARDS  (9 per era = 81 total, deterministic rarities + ownership)
// ---------------------------------------------------------------------------

const eraNames = [
  "Stone Age",
  "Tribal Age",
  "Bronze Age",
  "Classical Age",
  "Medieval Age",
  "Industrial Age",
  "Robot Age",
  "Space Age",
  "Singularity",
];

const cardNames: string[][] = [
  // Era 1 - Stone Age
  ["Flint Spear", "Cave Painting", "Stone Circle", "Ancient Flame", "First Hunter", "Rock Shelter", "Wild Mammoth", "Painted Hand", "Dawn Ritual"],
  // Era 2 - Tribal Age
  ["Totem Beast", "Tribal Mask", "Spirit Dance", "War Drum", "Shaman Staff", "Clan Banner", "Bone Necklace", "Sacred Grove", "Blood Oath"],
  // Era 3 - Bronze Age
  ["Bronze Sword", "Iron Furnace", "Copper Shield", "Metal Worker", "Trade Caravan", "Bronze Idol", "War Chariot", "Merchant Guild", "Metal Helm"],
  // Era 4 - Classical Age
  ["Olympian", "Sea Serpent", "Golden Fleece", "Oracle Vision", "Spartan Shield", "Roman Eagle", "Centurion", "Phoenix Egg", "Ancient Map"],
  // Era 5 - Medieval Age
  ["Dragon Slayer", "Holy Grail", "Black Knight", "Castle Gate", "Court Jester", "Royal Decree", "Siege Engine", "Witch Hunter", "Sacred Relic"],
  // Era 6 - Industrial Age
  ["Steam Titan", "Gear Heart", "Coal Golem", "Factory Smoke", "Iron Horse", "Telegraph Wire", "Inventor's Lab", "Union Strike", "Machine God"],
  // Era 7 - Robot Age
  ["Chrome Sentinel", "Neural Web", "Hover Tank", "Logic Core", "Synthetic Soul", "Bot Uprising", "Circuit Mind", "Drone Swarm", "Mech Armor"],
  // Era 8 - Space Age
  ["Star Cruiser", "Alien Diplomat", "Void Rift", "Nebula Spirit", "Cosmic Ray", "Zero Gravity", "Planet Seed", "Stellar Map", "Quantum Gate"],
  // Era 9 - Singularity
  ["Singular Mind", "Infinity Loop", "Digital Eden", "Omega Pulse", "Nexus Heart", "Eternal Code", "All-Knowing Eye", "Time Crystal", "Genesis Core"],
];

// Deterministic rarity pattern per 9-card era block:
// 4 common, 3 clear, 1 epic, 1 legendary
const rarityPattern: CardRarity[] = [
  "common", "common", "clear", "common", "clear", "epic", "common", "clear", "legendary",
];

// Deterministic ownership: first 3 eras mostly owned, rest mostly not
const ownershipPattern: boolean[][] = [
  // Stone Age - all owned (completed)
  [true, true, true, true, true, true, true, true, true],
  // Tribal Age - mostly owned
  [true, true, true, true, true, true, true, false, false],
  // Bronze Age - partially owned
  [true, true, true, true, false, true, false, false, false],
  // Classical Age - few owned
  [true, false, false, true, false, false, false, false, false],
  // Medieval Age - few owned
  [true, true, false, false, false, false, false, false, false],
  // Industrial Age - almost none
  [true, false, false, false, false, false, false, false, false],
  // Robot Age - none
  [false, false, false, false, false, false, false, false, false],
  // Space Age - none
  [false, false, false, false, false, false, false, false, false],
  // Singularity - none
  [false, false, false, false, false, false, false, false, false],
];

const planetIdsForEra = [1, 1, 1, 1, 2, 2, 3, 3, 3];

export const cards: Card[] = [];
let cardId = 1;
for (let era = 0; era < 9; era++) {
  for (let card = 0; card < 9; card++) {
    cards.push({
      id: cardId,
      name: cardNames[era][card],
      planetId: planetIdsForEra[era],
      eraId: era + 1,
      rarity: rarityPattern[card],
      isOwned: ownershipPattern[era][card],
      description: `A rare card from the ${eraNames[era]} era.`,
    });
    cardId++;
  }
}

// ---------------------------------------------------------------------------
// EQUIPMENT ITEMS  (16 items: 4 slots x 4 rarities, spanning multiple eras)
// ---------------------------------------------------------------------------

export const equipmentItems: EquipmentItem[] = [
  // -- Helmets --
  { id: 1, name: "Stone Cap", rarity: "common", era: "Stone Age", statBonus: 10, emoji: "\u{1FA96}" },
  { id: 2, name: "Tribal Headdress", rarity: "clear", era: "Tribal Age", statBonus: 22, emoji: "\u{1F451}" },
  { id: 3, name: "Bronze Helm", rarity: "epic", era: "Bronze Age", statBonus: 45, emoji: "\u26D1\uFE0F" },
  { id: 4, name: "Golden Crown", rarity: "legendary", era: "Classical Age", statBonus: 78, emoji: "\u{1F451}" },

  // -- Weapons --
  { id: 5, name: "Flint Knife", rarity: "common", era: "Stone Age", statBonus: 12, emoji: "\u{1FA93}" },
  { id: 6, name: "Bone Club", rarity: "clear", era: "Tribal Age", statBonus: 28, emoji: "\u{1F9B4}" },
  { id: 7, name: "Bronze Spear", rarity: "clear", era: "Bronze Age", statBonus: 62, emoji: "\u{1F5E1}\uFE0F" },
  { id: 8, name: "Gladius", rarity: "epic", era: "Classical Age", statBonus: 85, emoji: "\u2694\uFE0F" },

  // -- Armor --
  { id: 9, name: "Hide Wrap", rarity: "common", era: "Stone Age", statBonus: 8, emoji: "\u{1F9E5}" },
  { id: 10, name: "Leather Tunic", rarity: "clear", era: "Tribal Age", statBonus: 20, emoji: "\u{1F45A}" },
  { id: 11, name: "Scaled Armor", rarity: "epic", era: "Bronze Age", statBonus: 55, emoji: "\u{1F6E1}\uFE0F" },
  { id: 12, name: "Legion Plate", rarity: "legendary", era: "Classical Age", statBonus: 92, emoji: "\u{1F6E1}\uFE0F" },

  // -- Gadgets --
  { id: 13, name: "Lucky Pebble", rarity: "common", era: "Stone Age", statBonus: 5, emoji: "\u{1FAA8}" },
  { id: 14, name: "Fire Amulet", rarity: "legendary", era: "Tribal Age", statBonus: 80, emoji: "\u{1F525}" },
  { id: 15, name: "Bronze Compass", rarity: "clear", era: "Bronze Age", statBonus: 35, emoji: "\u{1F9ED}" },
  { id: 16, name: "Oracle Pendant", rarity: "epic", era: "Classical Age", statBonus: 68, emoji: "\u{1F52E}" },
];

// ---------------------------------------------------------------------------
// CHARACTER  (Aris - the player character)
// ---------------------------------------------------------------------------

export const character: Character = {
  name: "Aris",
  level: 24,
  currentEra: "Bronze Age",
  health: 780,
  maxHealth: 1000,
  attack: 145,
  defense: 98,
  experience: 6840,
  maxExperience: 10000,
  currentSkin: "Bronze Warrior",
  equipment: {
    helmet: { id: 3, name: "Bronze Helm", rarity: "epic", era: "Bronze Age", statBonus: 45, emoji: "\u26D1\uFE0F" },
    weapon: { id: 7, name: "Bronze Spear", rarity: "clear", era: "Bronze Age", statBonus: 62, emoji: "\u{1F5E1}\uFE0F" },
    armor: { id: 11, name: "Scaled Armor", rarity: "epic", era: "Bronze Age", statBonus: 55, emoji: "\u{1F6E1}\uFE0F" },
    gadget: { id: 14, name: "Fire Amulet", rarity: "legendary", era: "Tribal Age", statBonus: 80, emoji: "\u{1F525}" },
  },
};

// ---------------------------------------------------------------------------
// ACHIEVEMENTS  (17 total across 6 categories)
// ---------------------------------------------------------------------------

export const achievements: Achievement[] = [
  // Planet (4)
  { id: 1, name: "First Steps", description: "Begin your journey on Porera", category: "planet", isUnlocked: true, rewardType: "resources", rewardAmount: 1000, iconEmoji: "\u{1F30D}" },
  { id: 2, name: "Era Explorer", description: "Unlock 3 different eras", category: "planet", isUnlocked: true, rewardType: "resources", rewardAmount: 5000, iconEmoji: "\u{1F5FA}\uFE0F" },
  { id: 3, name: "Planet Master", description: "Complete all 9 eras on one planet", category: "planet", isUnlocked: false, rewardType: "legendary_card", rewardAmount: 1, iconEmoji: "\u{1F3C6}" },
  { id: 4, name: "Builder", description: "Build 10 structures", category: "planet", isUnlocked: true, rewardType: "resources", rewardAmount: 2500, iconEmoji: "\u{1F3D7}\uFE0F" },

  // Combat (4)
  { id: 5, name: "First Blood", description: "Win your first combat", category: "combat", isUnlocked: true, rewardType: "resources", rewardAmount: 500, iconEmoji: "\u2694\uFE0F" },
  { id: 6, name: "Warrior", description: "Win 50 combats", category: "combat", isUnlocked: false, rewardType: "epic_card", rewardAmount: 1, iconEmoji: "\u{1F5E1}\uFE0F" },
  { id: 7, name: "Legendary Fighter", description: "Equip a full legendary set", category: "combat", isUnlocked: false, rewardType: "skin", rewardAmount: 1, iconEmoji: "\u{1F451}" },
  { id: 8, name: "Boss Slayer", description: "Defeat the Singularity final boss", category: "combat", isUnlocked: false, rewardType: "legendary_card", rewardAmount: 3, iconEmoji: "\u{1F480}" },

  // Collection (3)
  { id: 9, name: "Collector", description: "Collect 10 cards", category: "collection", isUnlocked: true, rewardType: "resources", rewardAmount: 1000, iconEmoji: "\u{1F0CF}" },
  { id: 10, name: "Album Completer", description: "Complete a full era album", category: "collection", isUnlocked: false, rewardType: "epic_card", rewardAmount: 2, iconEmoji: "\u{1F4DA}" },
  { id: 11, name: "Planet Collector", description: "Complete all cards for one planet", category: "collection", isUnlocked: false, rewardType: "legendary_card", rewardAmount: 1, iconEmoji: "\u{1F30C}" },

  // Clan (3)
  { id: 12, name: "Clan Founder", description: "Join or create a clan", category: "clan", isUnlocked: true, rewardType: "resources", rewardAmount: 2000, iconEmoji: "\u{1F6E1}\uFE0F" },
  { id: 13, name: "Generous Soul", description: "Donate 10,000 resources to clan", category: "clan", isUnlocked: false, rewardType: "resources", rewardAmount: 5000, iconEmoji: "\u{1F91D}" },
  { id: 14, name: "Clan Champion", description: "Win a clan cooperative event", category: "clan", isUnlocked: false, rewardType: "epic_card", rewardAmount: 1, iconEmoji: "\u{1F3C5}" },

  // Ads (1)
  { id: 15, name: "Ad Watcher", description: "Watch 5 ads for bonuses", category: "ads", isUnlocked: true, rewardType: "resources", rewardAmount: 1000, iconEmoji: "\u{1F4FA}" },

  // Purchase (2)
  { id: 16, name: "Supporter", description: "Make your first purchase", category: "purchase", isUnlocked: false, rewardType: "legendary_card", rewardAmount: 1, iconEmoji: "\u{1F48E}" },
  { id: 17, name: "VIP Member", description: "Subscribe to VIP", category: "purchase", isUnlocked: false, rewardType: "skin", rewardAmount: 3, iconEmoji: "\u2B50" },
];

// ---------------------------------------------------------------------------
// CLANS
// ---------------------------------------------------------------------------

export const clans: Clan[] = [
  {
    id: 1,
    name: "Stellar Wolves",
    description: "Elite explorers pushing the boundaries of every era. Serious players only.",
    memberCount: 48,
    maxMembers: 50,
    level: 15,
    totalPoints: 892450,
    emblem: "\u{1F43A}",
    isJoined: true,
  },
  {
    id: 2,
    name: "Ancient Guardians",
    description: "We protect the old ways while embracing the new. Friendly community welcome.",
    memberCount: 32,
    maxMembers: 50,
    level: 10,
    totalPoints: 512300,
    emblem: "\u{1F6E1}\uFE0F",
    isJoined: false,
  },
  {
    id: 3,
    name: "Nova Collective",
    description: "Space age specialists. We coordinate complex cross-planet strategies.",
    memberCount: 45,
    maxMembers: 50,
    level: 12,
    totalPoints: 678900,
    emblem: "\u2B50",
    isJoined: false,
  },
  {
    id: 4,
    name: "Iron Forge Guild",
    description: "Industrial age aficionados. We love crafting and resource optimization.",
    memberCount: 28,
    maxMembers: 50,
    level: 8,
    totalPoints: 345600,
    emblem: "\u2692\uFE0F",
    isJoined: false,
  },
  {
    id: 5,
    name: "Dragon Knights",
    description: "Combat-focused clan. We run combat events daily and share equipment tips.",
    memberCount: 50,
    maxMembers: 50,
    level: 18,
    totalPoints: 1245000,
    emblem: "\u{1F409}",
    isJoined: false,
  },
  {
    id: 6,
    name: "Singularity Seekers",
    description: "We are chasing the final era. Join us on the path to Singularity.",
    memberCount: 15,
    maxMembers: 50,
    level: 5,
    totalPoints: 120000,
    emblem: "\u{1F52E}",
    isJoined: false,
  },
];
