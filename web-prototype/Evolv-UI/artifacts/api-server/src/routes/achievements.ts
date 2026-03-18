import { Router, type IRouter } from "express";

const router: IRouter = Router();

const achievements = [
  { id: 1, name: "First Steps", description: "Begin your journey on Porera", category: "planet", isUnlocked: true, rewardType: "resources", rewardAmount: 1000, iconEmoji: "🌍" },
  { id: 2, name: "Era Explorer", description: "Unlock 3 different eras", category: "planet", isUnlocked: true, rewardType: "resources", rewardAmount: 5000, iconEmoji: "🗺️" },
  { id: 3, name: "Planet Master", description: "Complete all 9 eras on one planet", category: "planet", isUnlocked: false, rewardType: "legendary_card", rewardAmount: 1, iconEmoji: "🏆" },
  { id: 4, name: "Builder", description: "Build 10 structures", category: "planet", isUnlocked: true, rewardType: "resources", rewardAmount: 2500, iconEmoji: "🏗️" },
  { id: 5, name: "First Blood", description: "Win your first combat", category: "combat", isUnlocked: true, rewardType: "resources", rewardAmount: 500, iconEmoji: "⚔️" },
  { id: 6, name: "Warrior", description: "Win 50 combats", category: "combat", isUnlocked: false, rewardType: "epic_card", rewardAmount: 1, iconEmoji: "🗡️" },
  { id: 7, name: "Legendary Fighter", description: "Equip a full legendary set", category: "combat", isUnlocked: false, rewardType: "skin", rewardAmount: 1, iconEmoji: "👑" },
  { id: 8, name: "Boss Slayer", description: "Defeat the Singularity final boss", category: "combat", isUnlocked: false, rewardType: "legendary_card", rewardAmount: 3, iconEmoji: "💀" },
  { id: 9, name: "Collector", description: "Collect 10 cards", category: "collection", isUnlocked: true, rewardType: "resources", rewardAmount: 1000, iconEmoji: "🃏" },
  { id: 10, name: "Album Completer", description: "Complete a full era album", category: "collection", isUnlocked: false, rewardType: "epic_card", rewardAmount: 2, iconEmoji: "📚" },
  { id: 11, name: "Planet Collector", description: "Complete all cards for one planet", category: "collection", isUnlocked: false, rewardType: "legendary_card", rewardAmount: 1, iconEmoji: "🌌" },
  { id: 12, name: "Clan Founder", description: "Join or create a clan", category: "clan", isUnlocked: true, rewardType: "resources", rewardAmount: 2000, iconEmoji: "🛡️" },
  { id: 13, name: "Generous Soul", description: "Donate 10,000 resources to clan", category: "clan", isUnlocked: false, rewardType: "resources", rewardAmount: 5000, iconEmoji: "🤝" },
  { id: 14, name: "Clan Champion", description: "Win a clan cooperative event", category: "clan", isUnlocked: false, rewardType: "epic_card", rewardAmount: 1, iconEmoji: "🏅" },
  { id: 15, name: "Ad Watcher", description: "Watch 5 ads for bonuses", category: "ads", isUnlocked: true, rewardType: "resources", rewardAmount: 1000, iconEmoji: "📺" },
  { id: 16, name: "Supporter", description: "Make your first purchase", category: "purchase", isUnlocked: false, rewardType: "legendary_card", rewardAmount: 1, iconEmoji: "💎" },
  { id: 17, name: "VIP Member", description: "Subscribe to VIP", category: "purchase", isUnlocked: false, rewardType: "skin", rewardAmount: 3, iconEmoji: "⭐" },
];

router.get("/achievements", (_req, res) => {
  res.json(achievements);
});

export default router;
