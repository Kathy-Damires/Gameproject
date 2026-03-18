import { Router, type IRouter } from "express";

const router: IRouter = Router();

const character = {
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
    helmet: { id: 1, name: "Bronze Helm", rarity: "epic", era: "Bronze Age", statBonus: 45, emoji: "⛑️" },
    weapon: { id: 2, name: "Bronze Spear", rarity: "clear", era: "Bronze Age", statBonus: 62, emoji: "🗡️" },
    armor: { id: 3, name: "Scaled Armor", rarity: "epic", era: "Bronze Age", statBonus: 55, emoji: "🛡️" },
    gadget: { id: 4, name: "Fire Amulet", rarity: "legendary", era: "Tribal Age", statBonus: 80, emoji: "🔥" },
  },
};

router.get("/character", (_req, res) => {
  res.json(character);
});

export default router;
