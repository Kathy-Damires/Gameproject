import { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Gift, CalendarDays, Check, Lock, Flame } from "lucide-react";

interface DayReward {
  day: number;
  icon: string;
  label: string;
  status: "claimed" | "today" | "locked";
  special?: boolean;
}

const REWARDS: DayReward[] = [
  { day: 1, icon: "🪨", label: "100 Piedra", status: "claimed" },
  { day: 2, icon: "🪵", label: "100 Madera", status: "claimed" },
  { day: 3, icon: "🥉", label: "50 Bronce", status: "claimed" },
  { day: 4, icon: "💎", label: "5 Diamantes", status: "today" },
  { day: 5, icon: "⚡", label: "10 Energía", status: "locked" },
  { day: 6, icon: "💎", label: "15 Diamantes", status: "locked" },
  { day: 7, icon: "🎁", label: "Cofre Épico", status: "locked", special: true },
];

export default function DailyRewards() {
  const [claimed, setClaimed] = useState(false);
  const streak = 4;

  const handleClaim = () => {
    setClaimed(true);
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="glass-panel p-4 rounded-3xl text-center">
        <div className="flex items-center justify-center gap-2 mb-1">
          <CalendarDays className="w-6 h-6 text-accent" />
          <h1 className="text-xl font-display uppercase text-gradient-primary">
            Recompensas Diarias
          </h1>
        </div>
        <p className="text-xs text-muted-foreground">
          Inicia sesión cada día para obtener recompensas
        </p>
      </div>

      {/* Streak counter */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-panel p-4 rounded-2xl border border-orange-500/30 text-center"
        style={{
          background:
            "linear-gradient(135deg, rgba(255,100,0,0.1), rgba(255,170,0,0.15))",
        }}
      >
        <div className="flex items-center justify-center gap-2">
          <Flame className="w-5 h-5 text-orange-400" />
          <span className="font-display text-lg text-white">
            Racha: {streak} días consecutivos
          </span>
          <span className="text-lg">🔥</span>
        </div>
        <p className="text-[10px] text-orange-300/70 mt-1">
          ¡No pierdas tu racha! Vuelve mañana para mantenerla
        </p>
      </motion.div>

      {/* 7-day calendar grid */}
      <div className="grid grid-cols-4 gap-3">
        {REWARDS.map((reward, i) => {
          const isClaimed = reward.status === "claimed";
          const isToday = reward.status === "today";
          const isLocked = reward.status === "locked";
          const isTodayClaimed = isToday && claimed;

          return (
            <motion.div
              key={reward.day}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }}
              className={cn(
                "glass-panel rounded-2xl p-3 flex flex-col items-center text-center border-2 relative overflow-hidden transition-all",
                reward.special && "col-span-2",
                isClaimed && "border-green-500/30 bg-green-500/5",
                isToday &&
                  !isTodayClaimed &&
                  "border-accent/60 shadow-[0_0_20px_rgba(255,170,0,0.3)]",
                isTodayClaimed && "border-green-500/30 bg-green-500/5",
                isLocked && "border-white/10 opacity-60",
                reward.special &&
                  isLocked &&
                  "border-amber-500/30 opacity-80"
              )}
            >
              {/* Pulse glow for today */}
              {isToday && !isTodayClaimed && (
                <motion.div
                  className="absolute inset-0 rounded-2xl bg-accent/10"
                  animate={{ opacity: [0.1, 0.3, 0.1] }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
              )}

              {/* Special golden shimmer for day 7 */}
              {reward.special && (
                <div
                  className="absolute inset-0 opacity-10"
                  style={{
                    background:
                      "linear-gradient(135deg, transparent, rgba(255,200,0,0.3), transparent)",
                  }}
                />
              )}

              <div className="relative z-10 flex flex-col items-center gap-1.5">
                <span
                  className={cn(
                    "text-[9px] font-display uppercase tracking-wider",
                    isClaimed
                      ? "text-green-400"
                      : isToday
                        ? "text-accent"
                        : "text-muted-foreground"
                  )}
                >
                  Día {reward.day}
                </span>

                <span className={cn("text-3xl", isLocked && "grayscale")}>
                  {reward.icon}
                </span>

                <span
                  className={cn(
                    "text-[10px] font-display",
                    isClaimed
                      ? "text-green-300"
                      : isToday
                        ? "text-white"
                        : "text-white/50"
                  )}
                >
                  {reward.label}
                </span>

                {/* Status indicators */}
                {(isClaimed || isTodayClaimed) && (
                  <div className="w-5 h-5 rounded-full bg-green-500/30 flex items-center justify-center">
                    <Check className="w-3 h-3 text-green-400" />
                  </div>
                )}

                {isToday && !isTodayClaimed && (
                  <span className="text-[8px] px-2 py-0.5 rounded-full bg-accent/20 text-accent font-display border border-accent/30">
                    HOY
                  </span>
                )}

                {isLocked && (
                  <Lock className="w-3.5 h-3.5 text-white/30" />
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Claim button */}
      {!claimed ? (
        <motion.button
          whileTap={{ scale: 0.96 }}
          onClick={handleClaim}
          className="w-full py-4 rounded-2xl font-display text-sm uppercase tracking-wider bg-gradient-to-r from-accent to-orange-500 text-black shadow-[0_0_25px_rgba(255,170,0,0.4)] transition-all"
        >
          <div className="flex items-center justify-center gap-2">
            <Gift className="w-5 h-5" />
            <span>Reclamar Recompensa del Día 4</span>
          </div>
        </motion.button>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full py-4 rounded-2xl font-display text-sm uppercase tracking-wider bg-green-500/20 text-green-400 text-center border border-green-500/30"
        >
          <div className="flex items-center justify-center gap-2">
            <Check className="w-5 h-5" />
            <span>¡Recompensa reclamada!</span>
          </div>
        </motion.div>
      )}

      {/* Info */}
      <div className="text-center text-[10px] text-muted-foreground">
        <p>Las recompensas se reinician cada semana</p>
        <p className="mt-0.5">
          Perder un día reinicia tu racha a 0
        </p>
      </div>
    </div>
  );
}
