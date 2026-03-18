import { Router, type IRouter } from "express";

const router: IRouter = Router();

const rarities = ["common", "clear", "epic", "legendary"] as const;
const cardNames = [
  ["Flint Spear", "Cave Painting", "Stone Circle", "Ancient Flame", "First Hunter", "Rock Shelter", "Wild Mammoth", "Painted Hand", "Dawn Ritual"],
  ["Totem Beast", "Tribal Mask", "Spirit Dance", "War Drum", "Shaman Staff", "Clan Banner", "Bone Necklace", "Sacred Grove", "Blood Oath"],
  ["Bronze Sword", "Iron Furnace", "Copper Shield", "Metal Worker", "Trade Caravan", "Bronze Idol", "War Chariot", "Merchant Guild", "Metal Helm"],
  ["Olympian", "Sea Serpent", "Golden Fleece", "Oracle Vision", "Spartan Shield", "Roman Eagle", "Centurion", "Phoenix Egg", "Ancient Map"],
  ["Dragon Slayer", "Holy Grail", "Black Knight", "Castle Gate", "Court Jester", "Royal Decree", "Siege Engine", "Witch Hunter", "Sacred Relic"],
  ["Steam Titan", "Gear Heart", "Coal Golem", "Factory Smoke", "Iron Horse", "Telegraph Wire", "Inventor's Lab", "Union Strike", "Machine God"],
  ["Chrome Sentinel", "Neural Web", "Hover Tank", "Logic Core", "Synthetic Soul", "Bot Uprising", "Circuit Mind", "Drone Swarm", "Mech Armor"],
  ["Star Cruiser", "Alien Diplomat", "Void Rift", "Nebula Spirit", "Cosmic Ray", "Zero Gravity", "Planet Seed", "Stellar Map", "Quantum Gate"],
  ["Singular Mind", "Infinity Loop", "Digital Eden", "Omega Pulse", "Nexus Heart", "Eternal Code", "All-Knowing Eye", "Time Crystal", "Genesis Core"],
];

const cards = [];
let cardId = 1;
const planetIds = [1, 1, 1, 1, 2, 2, 3, 3, 3];
const eraIds = [1, 2, 3, 4, 5, 6, 7, 8, 9];

for (let era = 0; era < 9; era++) {
  for (let card = 0; card < 9; card++) {
    const rarityIndex = Math.floor(Math.random() * 4);
    cards.push({
      id: cardId++,
      name: cardNames[era][card],
      planetId: planetIds[era],
      eraId: eraIds[era],
      rarity: rarities[rarityIndex],
      isOwned: Math.random() > 0.5,
      description: `A rare card from the ${["Stone Age", "Tribal Age", "Bronze Age", "Classical Age", "Medieval Age", "Industrial Age", "Robot Age", "Space Age", "Singularity"][era]} era.`,
    });
  }
}

router.get("/cards", (_req, res) => {
  res.json(cards);
});

export default router;
