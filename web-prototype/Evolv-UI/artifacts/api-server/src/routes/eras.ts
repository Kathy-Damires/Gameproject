import { Router, type IRouter } from "express";

const router: IRouter = Router();

const eras = [
  { id: 1, name: "Stone Age", description: "The dawn of civilization. Primitive tools, basic shelters, and the first communities form.", planetId: 1, order: 1, isUnlocked: true, enemies: ["Saber-tooth Tiger", "Cave Bear", "Giant Scorpion"], structures: ["Stone Hut", "Campfire", "Rock Mine"], equipmentSet: "Stone Set" },
  { id: 2, name: "Tribal Age", description: "Tribes form and cultures emerge. Basic warfare and shamanic rituals shape society.", planetId: 1, order: 2, isUnlocked: true, enemies: ["Rival Tribesman", "Dire Wolf", "Tribal Shaman"], structures: ["Tribal Lodge", "Totem Pole", "Hunting Ground"], equipmentSet: "Tribal Set" },
  { id: 3, name: "Bronze Age", description: "The discovery of metal changes everything. Stronger weapons, better tools, expanding empires.", planetId: 1, order: 3, isUnlocked: true, enemies: ["Bronze Soldier", "Wild Boar Pack", "Mercenary"], structures: ["Forge", "Bronze Mine", "Trading Post"], equipmentSet: "Bronze Set" },
  { id: 4, name: "Classical Age", description: "Cultural expansion and flourishing trade. Mythological creatures guard ancient treasures.", planetId: 1, order: 4, isUnlocked: false, enemies: ["Minotaur", "Harpy", "Gladiator"], structures: ["Colosseum", "Library", "Harbor"], equipmentSet: "Classical Set" },
  { id: 5, name: "Medieval Age", description: "Kingdoms rise and fall. Castles dot the landscape as knights and dragons clash.", planetId: 2, order: 5, isUnlocked: true, enemies: ["Bandit Captain", "Dark Knight", "Dragon Whelp"], structures: ["Castle", "Cathedral", "Mill"], equipmentSet: "Medieval Set" },
  { id: 6, name: "Industrial Age", description: "Machines reshape the world. Factories belch smoke as primitive robots emerge.", planetId: 2, order: 6, isUnlocked: false, enemies: ["Steam Golem", "Factory Bot", "Rogue Machine"], structures: ["Factory", "Steam Engine", "Power Plant"], equipmentSet: "Industrial Set" },
  { id: 7, name: "Robot Age", description: "Full automation. Advanced robots handle everything, but some turn rogue.", planetId: 3, order: 7, isUnlocked: false, enemies: ["Advanced Droid", "Combat Mech", "AI Guardian"], structures: ["Robot Factory", "Data Center", "Energy Grid"], equipmentSet: "Robot Set" },
  { id: 8, name: "Space Age", description: "Reach for the stars. Alien life and cosmic fauna challenge the brave.", planetId: 3, order: 8, isUnlocked: false, enemies: ["Space Kraken", "Alien Soldier", "Void Beast"], structures: ["Space Station", "Launch Pad", "Solar Array"], equipmentSet: "Space Set" },
  { id: 9, name: "Singularity", description: "The ultimate evolution. A self-sustaining ecosystem integrating all previous eras.", planetId: 3, order: 9, isUnlocked: false, enemies: ["Singularity Entity", "Quantum Wraith", "Final Boss"], structures: ["Singularity Core", "Nexus Hub", "Omega Gate"], equipmentSet: "Singularity Set" },
];

router.get("/eras", (_req, res) => {
  res.json(eras);
});

export default router;
