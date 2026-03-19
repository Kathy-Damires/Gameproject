import React, { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useRoute, Link } from "wouter";
import { ArrowLeft, Sparkles } from "lucide-react";

const RARITY_CONFIG: Record<string, { border: string; bg: string; label: string; glow: string }> = {
  common: { border: "hsl(210 20% 60%)", bg: "from-slate-700/60 to-slate-800/60", label: "Comun", glow: "rgba(148,163,184,0.3)" },
  clear: { border: "hsl(193 100% 50%)", bg: "from-cyan-900/60 to-cyan-950/60", label: "Clara", glow: "rgba(0,212,255,0.4)" },
  epic: { border: "hsl(280 90% 65%)", bg: "from-purple-900/60 to-purple-950/60", label: "Epica", glow: "rgba(168,85,247,0.5)" },
  legendary: { border: "hsl(45 100% 55%)", bg: "from-yellow-900/60 to-amber-950/60", label: "Legendaria", glow: "rgba(245,158,11,0.6)" },
};

const CHEST_CONFIG: Record<string, { name: string; icon: string; rarity: string; minItems: number; maxItems: number; dropWeights: Record<string, number> }> = {
  basic: {
    name: "Cofre Basico", icon: "📦", rarity: "common", minItems: 1, maxItems: 3,
    dropWeights: { common: 70, clear: 25, epic: 4.5, legendary: 0.5 },
  },
  epic: {
    name: "Cofre Epico", icon: "🎁", rarity: "epic", minItems: 3, maxItems: 5,
    dropWeights: { common: 30, clear: 40, epic: 25, legendary: 5 },
  },
  legendary: {
    name: "Cofre Legendario", icon: "👑", rarity: "legendary", minItems: 5, maxItems: 7,
    dropWeights: { common: 10, clear: 30, epic: 40, legendary: 20 },
  },
};

const POSSIBLE_ITEMS: Record<string, Array<{ name: string; icon: string }>> = {
  common: [
    { name: "Piedra x200", icon: "🪨" },
    { name: "Madera x200", icon: "🪵" },
    { name: "Comida x150", icon: "🍖" },
    { name: "Carta Comun", icon: "🃏" },
    { name: "Pocion Menor", icon: "🧪" },
  ],
  clear: [
    { name: "Bronce x100", icon: "🥉" },
    { name: "Espada Clara", icon: "🗡️" },
    { name: "Escudo Claro", icon: "🛡️" },
    { name: "Carta Clara", icon: "🃏" },
    { name: "Energia x300", icon: "⚡" },
  ],
  epic: [
    { name: "Armadura Epica", icon: "🛡️" },
    { name: "Espada Epica", icon: "🗡️" },
    { name: "Carta Epica", icon: "🃏" },
    { name: "Amuleto Epico", icon: "📿" },
    { name: "Diamantes x50", icon: "💎" },
  ],
  legendary: [
    { name: "Espada Legendaria", icon: "🗡️" },
    { name: "Armadura Legendaria", icon: "🛡️" },
    { name: "Carta Legendaria", icon: "🃏" },
    { name: "Amuleto Legendario", icon: "📿" },
    { name: "Diamantes x200", icon: "💎" },
  ],
};

function pickRarity(weights: Record<string, number>): string {
  const roll = Math.random() * 100;
  let sum = 0;
  for (const [rarity, weight] of Object.entries(weights)) {
    sum += weight;
    if (roll <= sum) return rarity;
  }
  return "common";
}

function generateItems(config: typeof CHEST_CONFIG[string]) {
  const count = config.minItems + Math.floor(Math.random() * (config.maxItems - config.minItems + 1));
  const items: Array<{ name: string; icon: string; rarity: string }> = [];
  for (let i = 0; i < count; i++) {
    const rarity = pickRarity(config.dropWeights);
    const pool = POSSIBLE_ITEMS[rarity];
    const pick = pool[Math.floor(Math.random() * pool.length)];
    items.push({ ...pick, rarity });
  }
  return items;
}

export default function ChestOpen() {
  const [, params] = useRoute("/chest/:type");
  const type = params?.type ?? "basic";
  const config = CHEST_CONFIG[type] || CHEST_CONFIG.basic;
  const chestRarity = RARITY_CONFIG[config.rarity];

  const [phase, setPhase] = useState<"ready" | "opening" | "revealing" | "done">("ready");
  const [items, setItems] = useState<Array<{ name: string; icon: string; rarity: string }>>([]);
  const [revealIndex, setRevealIndex] = useState(-1);

  const handleOpen = useCallback(() => {
    setPhase("opening");
    const generated = generateItems(config);
    setItems(generated);

    setTimeout(() => {
      setPhase("revealing");
      setRevealIndex(0);
    }, 1200);
  }, [config]);

  const handleNextReveal = useCallback(() => {
    if (revealIndex < items.length - 1) {
      setRevealIndex(prev => prev + 1);
    } else {
      setPhase("done");
    }
  }, [revealIndex, items.length]);

  const handleCollectAll = useCallback(() => {
    setPhase("done");
    setRevealIndex(items.length - 1);
  }, [items.length]);

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link href="/shop">
          <button className="glass-panel p-2.5 rounded-xl border border-white/10 hover:bg-white/10 transition-colors">
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
        </Link>
        <div>
          <h1 className="text-xl font-display uppercase text-white">{config.name}</h1>
          <p className="text-[10px] text-muted-foreground">Abre tu cofre para descubrir las recompensas</p>
        </div>
      </div>

      {/* Chest Display */}
      <div className="glass-panel rounded-3xl p-6 flex flex-col items-center justify-center relative overflow-hidden"
        style={{ minHeight: 280 }}>

        {/* Glow background */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-48 h-48 rounded-full opacity-30 blur-3xl"
            style={{ background: `radial-gradient(circle, ${chestRarity.glow}, transparent 70%)` }} />
        </div>

        {/* Grid bg */}
        <div className="absolute inset-0 opacity-5"
          style={{ backgroundImage: "linear-gradient(rgba(0,212,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(0,212,255,0.3) 1px, transparent 1px)", backgroundSize: "30px 30px" }} />

        <div className="relative z-10 flex flex-col items-center">
          {phase === "ready" && (
            <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
              className="flex flex-col items-center">
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                className="text-8xl mb-6 drop-shadow-2xl"
                style={{ filter: `drop-shadow(0 0 20px ${chestRarity.glow})` }}>
                {config.icon}
              </motion.div>
              <motion.button whileTap={{ scale: 0.95 }}
                onClick={handleOpen}
                className="px-8 py-3 rounded-2xl font-display text-sm uppercase tracking-wide text-black shadow-lg"
                style={{ background: `linear-gradient(135deg, ${chestRarity.border}, ${chestRarity.border}aa)`, boxShadow: `0 0 25px ${chestRarity.glow}` }}>
                <Sparkles className="w-4 h-4 inline mr-2" />
                Abrir
              </motion.button>
            </motion.div>
          )}

          {phase === "opening" && (
            <motion.div className="flex flex-col items-center">
              <motion.div
                animate={{ rotate: [0, -10, 10, -5, 5, 0], scale: [1, 1.2, 0.9, 1.1, 1] }}
                transition={{ duration: 1, ease: "easeInOut" }}
                className="text-8xl mb-4"
                style={{ filter: `drop-shadow(0 0 30px ${chestRarity.glow})` }}>
                {config.icon}
              </motion.div>
              <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: [0, 1, 0] }}
                transition={{ duration: 1, repeat: Infinity }}
                className="text-sm font-display text-accent">
                Abriendo...
              </motion.div>
            </motion.div>
          )}

          {phase === "revealing" && revealIndex >= 0 && revealIndex < items.length && (
            <motion.div className="flex flex-col items-center w-full">
              <AnimatePresence mode="wait">
                <motion.div key={revealIndex}
                  initial={{ scale: 0, rotateY: 180, opacity: 0 }}
                  animate={{ scale: 1, rotateY: 0, opacity: 1 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  transition={{ type: "spring", damping: 15, stiffness: 200 }}
                  className="flex flex-col items-center mb-6">
                  <div className="text-[10px] text-muted-foreground font-display mb-2 uppercase">
                    Item {revealIndex + 1} de {items.length}
                  </div>
                  <div className="w-32 h-32 rounded-2xl border-3 flex items-center justify-center mb-3"
                    style={{
                      borderColor: RARITY_CONFIG[items[revealIndex].rarity].border,
                      borderWidth: 3,
                      background: `linear-gradient(135deg, ${RARITY_CONFIG[items[revealIndex].rarity].glow}22, ${RARITY_CONFIG[items[revealIndex].rarity].glow}44)`,
                      boxShadow: `0 0 30px ${RARITY_CONFIG[items[revealIndex].rarity].glow}`,
                    }}>
                    <span className="text-5xl">{items[revealIndex].icon}</span>
                  </div>
                  <div className="font-display text-sm text-white mb-1">{items[revealIndex].name}</div>
                  <span className="text-[9px] px-2 py-0.5 rounded-full font-display"
                    style={{
                      background: `${RARITY_CONFIG[items[revealIndex].rarity].border}22`,
                      color: RARITY_CONFIG[items[revealIndex].rarity].border,
                    }}>
                    {RARITY_CONFIG[items[revealIndex].rarity].label}
                  </span>
                </motion.div>
              </AnimatePresence>

              <div className="flex gap-3 w-full">
                <motion.button whileTap={{ scale: 0.96 }} onClick={handleNextReveal}
                  className="flex-1 py-3 rounded-2xl font-display text-sm uppercase tracking-wide bg-gradient-to-r from-primary to-secondary text-white shadow-[0_0_15px_rgba(0,212,255,0.3)]">
                  {revealIndex < items.length - 1 ? "Siguiente" : "Ver todo"}
                </motion.button>
                {revealIndex < items.length - 1 && (
                  <motion.button whileTap={{ scale: 0.96 }} onClick={handleCollectAll}
                    className="px-4 py-3 rounded-2xl font-display text-[10px] uppercase bg-white/10 text-white/70 border border-white/10">
                    Saltar
                  </motion.button>
                )}
              </div>
            </motion.div>
          )}

          {phase === "done" && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              className="w-full">
              <div className="text-center mb-4">
                <div className="text-lg font-display text-accent mb-1">Recompensas Obtenidas</div>
                <div className="text-[10px] text-muted-foreground">{items.length} items del {config.name}</div>
              </div>
              <div className="grid grid-cols-3 gap-2 mb-5">
                {items.map((item, idx) => (
                  <motion.div key={idx}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: idx * 0.08 }}
                    className="glass-panel rounded-xl p-3 flex flex-col items-center border-2"
                    style={{ borderColor: `${RARITY_CONFIG[item.rarity].border}55` }}>
                    <span className="text-2xl mb-1">{item.icon}</span>
                    <div className="text-[9px] text-white text-center font-display leading-tight">{item.name}</div>
                    <span className="text-[8px] mt-0.5"
                      style={{ color: RARITY_CONFIG[item.rarity].border }}>
                      {RARITY_CONFIG[item.rarity].label}
                    </span>
                  </motion.div>
                ))}
              </div>
              <div className="flex gap-3">
                <motion.button whileTap={{ scale: 0.96 }}
                  onClick={() => { setPhase("ready"); setItems([]); setRevealIndex(-1); }}
                  className="flex-1 py-3 rounded-2xl font-display text-sm uppercase tracking-wide text-black"
                  style={{ background: `linear-gradient(135deg, ${chestRarity.border}, ${chestRarity.border}aa)`, boxShadow: `0 0 15px ${chestRarity.glow}` }}>
                  Abrir Otro
                </motion.button>
                <Link href="/shop" className="flex-1">
                  <button className="w-full py-3 rounded-2xl font-display text-sm uppercase tracking-wide bg-white/10 text-white border border-white/10 hover:bg-white/15 transition-colors">
                    Recoger Todo
                  </button>
                </Link>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Already revealed items preview (during reveal) */}
      {phase === "revealing" && revealIndex > 0 && (
        <div className="glass-panel rounded-2xl p-3">
          <div className="text-[9px] text-muted-foreground font-display uppercase mb-2">Items obtenidos</div>
          <div className="flex gap-2 overflow-x-auto scrollbar-none pb-1">
            {items.slice(0, revealIndex).map((item, idx) => (
              <div key={idx} className="shrink-0 w-14 flex flex-col items-center glass-panel rounded-lg p-1.5 border"
                style={{ borderColor: `${RARITY_CONFIG[item.rarity].border}44` }}>
                <span className="text-lg">{item.icon}</span>
                <span className="text-[7px] text-center leading-tight text-white/60">{item.name.split(" ")[0]}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
