import React from "react";
import { useGetAchievements } from "@workspace/api-client-react";
import { Progress } from "@/components/ui/progress";
import { GameButton } from "@/components/ui/game-button";
import { Trophy, CheckCircle2 } from "lucide-react";

const MOCK_ACHIEVEMENTS = [
  { id: 1, name: "First Steps", description: "Reach Era 2 on Porera", category: "planet", isUnlocked: true, rewardType: "gems", rewardAmount: 50, iconEmoji: "🔥" },
  { id: 2, name: "Card Collector", description: "Collect 10 different cards", category: "collection", isUnlocked: false, rewardType: "coins", rewardAmount: 1000, iconEmoji: "🃏", progress: 7, maxProgress: 10 },
  { id: 3, name: "Gladiator", description: "Win 5 combat encounters", category: "combat", isUnlocked: false, rewardType: "gems", rewardAmount: 100, iconEmoji: "⚔️", progress: 2, maxProgress: 5 },
  { id: 4, name: "Social Butterfly", description: "Join a clan", category: "clan", isUnlocked: true, rewardType: "coins", rewardAmount: 500, iconEmoji: "🛡️" },
];

export default function Achievements() {
  const { data, isLoading } = useGetAchievements();
  const achievements = data || MOCK_ACHIEVEMENTS;

  if (isLoading) return <div className="p-8 text-center text-primary font-display animate-pulse">Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-secondary/20 rounded-2xl text-secondary">
          <Trophy className="w-8 h-8" />
        </div>
        <div>
          <h1 className="text-3xl font-display text-gradient">Achievements</h1>
          <p className="text-muted-foreground text-sm">Complete tasks to earn rewards</p>
        </div>
      </div>

      <div className="space-y-4">
        {achievements.map((ach: any) => (
          <div key={ach.id} className="bg-card border border-card-border rounded-2xl p-4 flex gap-4 items-center">
            <div className={`w-14 h-14 rounded-xl flex items-center justify-center text-2xl shrink-0 border-2 ${ach.isUnlocked ? 'bg-primary/20 border-primary' : 'bg-black/50 border-white/10 grayscale'}`}>
              {ach.iconEmoji}
            </div>
            
            <div className="flex-1">
              <div className="flex justify-between items-start mb-1">
                <h3 className="font-display text-white text-sm">{ach.name}</h3>
                {ach.isUnlocked ? (
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                ) : (
                  <span className="text-[10px] font-bold text-muted-foreground uppercase">{ach.progress || 0} / {ach.maxProgress || 1}</span>
                )}
              </div>
              <p className="text-[11px] text-muted-foreground mb-2 leading-tight">{ach.description}</p>
              
              {!ach.isUnlocked && ach.maxProgress && (
                <Progress value={((ach.progress || 0) / ach.maxProgress) * 100} className="h-1.5" />
              )}
            </div>

            <div className="shrink-0">
              {ach.isUnlocked ? (
                <GameButton size="sm" variant="outline" className="h-8 text-xs px-3 pointer-events-none opacity-50 border-green-500 text-green-500">
                  Claimed
                </GameButton>
              ) : (
                <div className="text-center bg-black/40 px-2 py-1 rounded-lg border border-white/5">
                  <span className="block text-[8px] text-muted-foreground uppercase">Reward</span>
                  <span className="text-xs font-bold text-accent">{ach.rewardAmount} {ach.rewardType === 'gems' ? '💎' : '🪙'}</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
