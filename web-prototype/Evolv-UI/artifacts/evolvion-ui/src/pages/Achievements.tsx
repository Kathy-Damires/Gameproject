import React, { useState } from "react";
import { useGetAchievements } from "@workspace/api-client-react";
import { Progress } from "@/components/ui/progress";
import { GameButton } from "@/components/ui/game-button";
import { Trophy, CheckCircle2, Crown, Medal, Award } from "lucide-react";
import { cn } from "@/lib/utils";
import { RESOURCE_ICONS, NAV_ICONS } from "@/lib/icons";

const MOCK_ACHIEVEMENTS = [
  { id: 1, name: "Primeros Pasos", description: "Comienza tu viaje en Porera", category: "planet", isUnlocked: true, rewardType: "gems", rewardAmount: 50, iconEmoji: "🌍" },
  { id: 2, name: "Coleccionista", description: "Colecciona 10 cartas", category: "collection", isUnlocked: false, rewardType: "coins", rewardAmount: 1000, iconEmoji: "🃏", progress: 7, maxProgress: 10 },
  { id: 3, name: "Guerrero", description: "Gana 50 combates", category: "combat", isUnlocked: false, rewardType: "gems", rewardAmount: 100, iconEmoji: "⚔️", progress: 23, maxProgress: 50 },
  { id: 4, name: "Fundador de Clan", description: "Únete o crea un clan", category: "clan", isUnlocked: true, rewardType: "coins", rewardAmount: 500, iconEmoji: "🛡️" },
  { id: 5, name: "Constructor", description: "Construye 10 estructuras", category: "planet", isUnlocked: false, rewardType: "gems", rewardAmount: 75, iconEmoji: "🏗️", progress: 6, maxProgress: 10 },
  { id: 6, name: "Primera Sangre", description: "Gana tu primer combate", category: "combat", isUnlocked: true, rewardType: "coins", rewardAmount: 200, iconEmoji: "🗡️" },
  { id: 7, name: "Explorador de Eras", description: "Desbloquea 3 eras", category: "planet", isUnlocked: true, rewardType: "gems", rewardAmount: 150, iconEmoji: "🗺️" },
  { id: 8, name: "Alma Generosa", description: "Dona 10,000 recursos al clan", category: "clan", isUnlocked: false, rewardType: "coins", rewardAmount: 2000, iconEmoji: "🤝", progress: 4200, maxProgress: 10000 },
  { id: 9, name: "Patrocinador", description: "Realiza tu primera compra", category: "purchase", isUnlocked: false, rewardType: "gems", rewardAmount: 200, iconSrc: RESOURCE_ICONS.diamonds, iconEmoji: "💎", progress: 0, maxProgress: 1 },
  { id: 10, name: "Espectador", description: "Mira 5 anuncios", category: "ads", isUnlocked: true, rewardType: "coins", rewardAmount: 300, iconEmoji: "📺" },
];

const LEADERBOARD = [
  { rank: 1, name: "DragonSlayer99", level: 48, power: 125000, era: "Singularidad", avatar: "👑" },
  { rank: 2, name: "CosmicAris", level: 45, power: 112000, era: "Espacial", avatar: "🌟" },
  { rank: 3, name: "NovaMaster", level: 42, power: 98500, era: "Espacial", avatar: "⚡" },
  { rank: 4, name: "ShadowForge", level: 39, power: 87200, era: "Robótica", avatar: "🔥" },
  { rank: 5, name: "CrystalHunter", level: 37, power: 78900, era: "Robótica", avatar: "💎" },
  { rank: 6, name: "IronWill", level: 35, power: 71000, era: "Industrial", avatar: "⚙️" },
  { rank: 7, name: "StormBringer", level: 33, power: 64500, era: "Industrial", avatar: "🌪️" },
  { rank: 8, name: "MoonWalker", level: 30, power: 55200, era: "Medieval", avatar: "🌙" },
  { rank: 9, name: "BlazeKing", level: 28, power: 48000, era: "Medieval", avatar: "🔱" },
  { rank: 10, name: "EchoStar", level: 26, power: 42300, era: "Clásica", avatar: "✨" },
];

const MY_RANK = { rank: 47, name: "Player_001", level: 24, power: 12500, era: "Bronce", avatar: "🧑‍🚀" };

const CATEGORIES = [
  { key: "all", label: "Todos" },
  { key: "planet", label: "Planeta" },
  { key: "combat", label: "Combate" },
  { key: "collection", label: "Colección" },
  { key: "clan", label: "Clan" },
];

export default function Achievements() {
  const [tab, setTab] = useState<"achievements" | "leaderboard">("achievements");
  const [category, setCategory] = useState("all");
  const { data, isLoading } = useGetAchievements();
  const achievements = data || MOCK_ACHIEVEMENTS;

  const filtered = category === "all"
    ? achievements
    : achievements.filter((a: any) => a.category === category);

  const unlockedCount = achievements.filter((a: any) => a.isUnlocked).length;

  if (isLoading) return <div className="p-8 text-center text-primary font-display animate-pulse">Cargando...</div>;

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-amber-500/20 rounded-2xl">
            <img src={NAV_ICONS.achievements} alt="achievements" className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-2xl font-display text-gradient">Logros</h1>
            <p className="text-[11px] text-muted-foreground">{unlockedCount}/{achievements.length} completados</p>
          </div>
        </div>
        <Progress value={(unlockedCount / achievements.length) * 100}
          className="w-20 h-2"
          indicatorClassName="bg-gradient-to-r from-amber-400 to-amber-600" />
      </div>

      {/* Tabs: Logros / Leaderboard */}
      <div className="flex gap-2">
        <button onClick={() => setTab("achievements")}
          className={cn(
            "flex-1 py-2.5 rounded-xl text-sm font-display uppercase transition-all",
            tab === "achievements"
              ? "bg-amber-500/20 border border-amber-500/40 text-amber-400"
              : "bg-white/5 border border-white/10 text-muted-foreground hover:bg-white/10"
          )}>
          <img src={NAV_ICONS.achievements} alt="" className="w-4 h-4 inline mr-1.5" />
          Logros
        </button>
        <button onClick={() => setTab("leaderboard")}
          className={cn(
            "flex-1 py-2.5 rounded-xl text-sm font-display uppercase transition-all",
            tab === "leaderboard"
              ? "bg-primary/20 border border-primary/40 text-primary"
              : "bg-white/5 border border-white/10 text-muted-foreground hover:bg-white/10"
          )}>
          <Crown className="w-4 h-4 inline mr-1.5" />
          Ranking
        </button>
      </div>

      {tab === "achievements" ? (
        <>
          {/* Category filter */}
          <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {CATEGORIES.map(c => (
              <button key={c.key}
                onClick={() => setCategory(c.key)}
                className={cn(
                  "px-3 py-1.5 rounded-xl text-[10px] font-display uppercase whitespace-nowrap transition-all shrink-0",
                  category === c.key
                    ? "bg-amber-500/20 border border-amber-500/40 text-amber-400"
                    : "bg-white/5 border border-white/10 text-muted-foreground hover:bg-white/10"
                )}>
                {c.label}
              </button>
            ))}
          </div>

          {/* Achievement list */}
          <div className="space-y-3">
            {filtered.map((ach: any) => (
              <div key={ach.id} className={cn(
                "glass-panel rounded-2xl p-4 flex gap-3 items-center transition-all",
                ach.isUnlocked && "border-amber-500/20"
              )}>
                <div className={cn(
                  "w-12 h-12 rounded-xl flex items-center justify-center text-xl shrink-0 border-2",
                  ach.isUnlocked ? "bg-amber-500/20 border-amber-500/40" : "bg-black/50 border-white/10 grayscale"
                )}>
                  {ach.iconSrc ? <img src={ach.iconSrc} alt={ach.name} className="w-6 h-6" /> : <span className="text-xl">{ach.iconEmoji}</span>}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start mb-0.5">
                    <h3 className="font-display text-white text-sm truncate">{ach.name}</h3>
                    {ach.isUnlocked ? (
                      <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0 ml-1" />
                    ) : ach.maxProgress ? (
                      <span className="text-[9px] font-bold text-muted-foreground shrink-0 ml-1">
                        {typeof ach.progress === 'number' && ach.progress >= 1000
                          ? `${(ach.progress/1000).toFixed(1)}K`
                          : ach.progress || 0} / {typeof ach.maxProgress === 'number' && ach.maxProgress >= 1000
                          ? `${(ach.maxProgress/1000).toFixed(0)}K`
                          : ach.maxProgress}
                      </span>
                    ) : null}
                  </div>
                  <p className="text-[10px] text-muted-foreground mb-1.5 leading-tight">{ach.description}</p>

                  {!ach.isUnlocked && ach.maxProgress && (
                    <Progress value={((ach.progress || 0) / ach.maxProgress) * 100} className="h-1"
                      indicatorClassName="bg-gradient-to-r from-amber-500 to-primary" />
                  )}
                </div>

                <div className="shrink-0">
                  {ach.isUnlocked ? (
                    <div className="text-center bg-green-500/10 px-2 py-1 rounded-lg border border-green-500/20">
                      <span className="text-[9px] text-green-400 font-display">✓</span>
                    </div>
                  ) : (
                    <div className="text-center bg-black/40 px-2 py-1 rounded-lg border border-white/5">
                      <span className="text-[8px] text-muted-foreground uppercase block">Premio</span>
                      <span className="text-[10px] font-bold text-accent flex items-center gap-0.5">{ach.rewardAmount} <img src={ach.rewardType === 'gems' ? RESOURCE_ICONS.diamonds : RESOURCE_ICONS.bronze} alt={ach.rewardType} className="w-3 h-3 inline" /></span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        /* Leaderboard */
        <div className="space-y-3">
          {/* Top 3 podium */}
          <div className="glass-panel rounded-2xl p-4">
            <div className="flex items-end justify-center gap-3 mb-4">
              {/* 2nd place */}
              <div className="flex flex-col items-center">
                <span className="text-2xl mb-1">{LEADERBOARD[1].avatar}</span>
                <div className="w-16 h-20 bg-gradient-to-t from-gray-400/20 to-gray-400/5 rounded-t-xl flex flex-col items-center justify-end pb-2 border border-gray-400/20">
                  <Medal className="w-4 h-4 text-gray-400 mb-1" />
                  <span className="text-[9px] font-display text-gray-300 truncate w-14 text-center">{LEADERBOARD[1].name}</span>
                  <span className="text-[8px] text-gray-400">{(LEADERBOARD[1].power/1000).toFixed(0)}K</span>
                </div>
              </div>
              {/* 1st place */}
              <div className="flex flex-col items-center">
                <span className="text-3xl mb-1">{LEADERBOARD[0].avatar}</span>
                <div className="w-18 h-28 bg-gradient-to-t from-amber-500/20 to-amber-500/5 rounded-t-xl flex flex-col items-center justify-end pb-2 border border-amber-500/30 px-1">
                  <Crown className="w-5 h-5 text-amber-400 mb-1" />
                  <span className="text-[9px] font-display text-amber-300 truncate w-16 text-center">{LEADERBOARD[0].name}</span>
                  <span className="text-[8px] text-amber-400">{(LEADERBOARD[0].power/1000).toFixed(0)}K</span>
                </div>
              </div>
              {/* 3rd place */}
              <div className="flex flex-col items-center">
                <span className="text-2xl mb-1">{LEADERBOARD[2].avatar}</span>
                <div className="w-16 h-16 bg-gradient-to-t from-orange-700/20 to-orange-700/5 rounded-t-xl flex flex-col items-center justify-end pb-2 border border-orange-700/20">
                  <Award className="w-4 h-4 text-orange-600 mb-1" />
                  <span className="text-[9px] font-display text-orange-400 truncate w-14 text-center">{LEADERBOARD[2].name}</span>
                  <span className="text-[8px] text-orange-500">{(LEADERBOARD[2].power/1000).toFixed(0)}K</span>
                </div>
              </div>
            </div>
          </div>

          {/* Rest of leaderboard */}
          <div className="glass-panel rounded-2xl overflow-hidden">
            {LEADERBOARD.slice(3).map((player) => (
              <div key={player.rank}
                className="flex items-center gap-3 px-4 py-3 border-b border-white/5 last:border-0">
                <span className={cn(
                  "w-7 text-center font-display text-sm",
                  player.rank <= 5 ? "text-primary" : "text-muted-foreground"
                )}>
                  #{player.rank}
                </span>
                <span className="text-lg">{player.avatar}</span>
                <div className="flex-1 min-w-0">
                  <div className="text-sm text-white font-bold truncate">{player.name}</div>
                  <div className="text-[9px] text-muted-foreground">Nv.{player.level} · {player.era}</div>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-xs font-bold text-white">{(player.power/1000).toFixed(1)}K</div>
                  <div className="text-[8px] text-muted-foreground">poder</div>
                </div>
              </div>
            ))}
          </div>

          {/* My rank */}
          <div className="glass-panel rounded-2xl p-4 border border-primary/30">
            <div className="flex items-center gap-3">
              <span className="w-7 text-center font-display text-sm text-primary">#{MY_RANK.rank}</span>
              <span className="text-lg">{MY_RANK.avatar}</span>
              <div className="flex-1">
                <div className="text-sm text-primary font-bold">{MY_RANK.name} (Tú)</div>
                <div className="text-[9px] text-muted-foreground">Nv.{MY_RANK.level} · {MY_RANK.era}</div>
              </div>
              <div className="text-right">
                <div className="text-xs font-bold text-primary">{(MY_RANK.power/1000).toFixed(1)}K</div>
                <div className="text-[8px] text-muted-foreground">poder</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
