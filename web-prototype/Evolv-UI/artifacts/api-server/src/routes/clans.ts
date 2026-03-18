import { Router, type IRouter } from "express";

const router: IRouter = Router();

const clans = [
  { id: 1, name: "Stellar Wolves", description: "Elite explorers pushing the boundaries of every era. Serious players only.", memberCount: 48, maxMembers: 50, level: 15, totalPoints: 892450, emblem: "🐺", isJoined: true },
  { id: 2, name: "Ancient Guardians", description: "We protect the old ways while embracing the new. Friendly community welcome.", memberCount: 32, maxMembers: 50, level: 10, totalPoints: 512300, emblem: "🛡️", isJoined: false },
  { id: 3, name: "Nova Collective", description: "Space age specialists. We coordinate complex cross-planet strategies.", memberCount: 45, maxMembers: 50, level: 12, totalPoints: 678900, emblem: "⭐", isJoined: false },
  { id: 4, name: "Iron Forge Guild", description: "Industrial age aficionados. We love crafting and resource optimization.", memberCount: 28, maxMembers: 50, level: 8, totalPoints: 345600, emblem: "⚒️", isJoined: false },
  { id: 5, name: "Dragon Knights", description: "Combat-focused clan. We run combat events daily and share equipment tips.", memberCount: 50, maxMembers: 50, level: 18, totalPoints: 1245000, emblem: "🐉", isJoined: false },
  { id: 6, name: "Singularity Seekers", description: "We are chasing the final era. Join us on the path to Singularity.", memberCount: 15, maxMembers: 50, level: 5, totalPoints: 120000, emblem: "🔮", isJoined: false },
];

router.get("/clans", (_req, res) => {
  res.json(clans);
});

export default router;
