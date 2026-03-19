import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";
import { ShoppingBag, Clock, Lock, Gift, ChevronRight, Gem, Package, Scroll, Diamond, Star } from "lucide-react";
import { Link } from "wouter";

const TABS = ["Ofertas", "Cofres", "Pase de Batalla", "Recursos", "Diamantes"];

const RARITY_BORDER: Record<string, string> = {
  common: "hsl(210 20% 60%)",
  clear: "hsl(193 100% 50%)",
  epic: "hsl(280 90% 65%)",
  legendary: "hsl(45 100% 55%)",
};

/* ══════════════ OFERTAS DATA ══════════════ */
const OFFERS = [
  {
    id: 1, title: "Primera Compra x3", subtitle: "¡Triple valor en tu primera compra!",
    icon: "🎁", original: 100, price: 100, currency: "💎", bonus: "x3", tag: "PRIMERA VEZ",
    tagColor: "bg-green-500/20 text-green-400", gradient: "from-green-900/60 to-emerald-950/60",
    borderColor: "border-green-500/40", timer: null,
  },
  {
    id: 2, title: "Pack Legendario", subtitle: "5 cartas con 1 legendaria garantizada",
    icon: "🃏", original: 200, price: 100, currency: "💎", bonus: "-50%", tag: "TIEMPO LIMITADO",
    tagColor: "bg-red-500/20 text-red-400", gradient: "from-purple-900/60 to-violet-950/60",
    borderColor: "border-purple-500/40", timer: 3 * 3600 + 47 * 60 + 22,
  },
  {
    id: 3, title: "Mega Pack Recursos", subtitle: "5000 de cada recurso básico",
    icon: "💼", original: 80, price: 30, currency: "💎", bonus: "-62%", tag: "OFERTA FLASH",
    tagColor: "bg-orange-500/20 text-orange-400", gradient: "from-orange-900/60 to-amber-950/60",
    borderColor: "border-orange-500/40", timer: 1 * 3600 + 15 * 60 + 8,
  },
  {
    id: 4, title: "Starter Bundle", subtitle: "Todo lo que necesitas para empezar fuerte",
    icon: "🚀", original: 500, price: 199, currency: "💎", bonus: "-60%", tag: "MÁS POPULAR",
    tagColor: "bg-cyan-500/20 text-cyan-400", gradient: "from-cyan-900/60 to-teal-950/60",
    borderColor: "border-cyan-500/40", timer: 23 * 3600 + 59 * 60 + 59,
  },
];

/* ══════════════ COFRES DATA ══════════════ */
const CHESTS = [
  {
    id: "basic", name: "Cofre Básico", icon: "📦", price: 50, currency: "💎",
    items: "1-3 items", rarity: "common",
    drops: [
      { label: "Común", pct: 70, color: "text-slate-400" },
      { label: "Clara", pct: 25, color: "text-cyan-400" },
      { label: "Épica", pct: 4.5, color: "text-purple-400" },
      { label: "Legendaria", pct: 0.5, color: "text-amber-400" },
    ],
    gradient: "from-slate-700/50 to-slate-800/50",
    borderColor: RARITY_BORDER.common,
    glow: "rgba(148,163,184,0.15)",
  },
  {
    id: "epic", name: "Cofre Épico", icon: "🎁", price: 200, currency: "💎",
    items: "3-5 items", rarity: "epic",
    drops: [
      { label: "Común", pct: 30, color: "text-slate-400" },
      { label: "Clara", pct: 40, color: "text-cyan-400" },
      { label: "Épica", pct: 25, color: "text-purple-400" },
      { label: "Legendaria", pct: 5, color: "text-amber-400" },
    ],
    gradient: "from-purple-900/60 to-purple-950/60",
    borderColor: RARITY_BORDER.epic,
    glow: "rgba(168,85,247,0.2)",
  },
  {
    id: "legendary", name: "Cofre Legendario", icon: "👑", price: 500, currency: "💎",
    items: "5-7 items", rarity: "legendary",
    drops: [
      { label: "Común", pct: 10, color: "text-slate-400" },
      { label: "Clara", pct: 30, color: "text-cyan-400" },
      { label: "Épica", pct: 40, color: "text-purple-400" },
      { label: "Legendaria", pct: 20, color: "text-amber-400" },
    ],
    gradient: "from-yellow-900/60 to-amber-950/60",
    borderColor: RARITY_BORDER.legendary,
    glow: "rgba(245,158,11,0.25)",
  },
];

/* ══════════════ BATTLE PASS DATA ══════════════ */
const BP_LEVEL = 7;
const BP_XP = 2350;
const BP_XP_NEXT = 3000;
const BP_PREMIUM = false;

const BP_REWARDS: Array<{
  level: number;
  free: { icon: string; label: string; claimed: boolean };
  premium: { icon: string; label: string; claimed: boolean };
}> = [
  { level: 1, free: { icon: "🪨", label: "500 Piedra", claimed: true }, premium: { icon: "💎", label: "50 Diamantes", claimed: true } },
  { level: 2, free: { icon: "🪵", label: "500 Madera", claimed: true }, premium: { icon: "🃏", label: "Carta Épica", claimed: true } },
  { level: 3, free: { icon: "🍖", label: "300 Comida", claimed: true }, premium: { icon: "🗡️", label: "Espada Clara", claimed: true } },
  { level: 4, free: { icon: "🃏", label: "Carta Común x2", claimed: true }, premium: { icon: "💎", label: "100 Diamantes", claimed: true } },
  { level: 5, free: { icon: "🪨", label: "1000 Piedra", claimed: true }, premium: { icon: "👤", label: "Skin: Guerrero", claimed: true } },
  { level: 6, free: { icon: "⚡", label: "200 Energía", claimed: true }, premium: { icon: "🃏", label: "Carta Legendaria", claimed: true } },
  { level: 7, free: { icon: "🪵", label: "1500 Madera", claimed: false }, premium: { icon: "💎", label: "200 Diamantes", claimed: false } },
  { level: 8, free: { icon: "🃏", label: "Carta Común x3", claimed: false }, premium: { icon: "🛡️", label: "Armadura Épica", claimed: false } },
  { level: 9, free: { icon: "🍖", label: "800 Comida", claimed: false }, premium: { icon: "👤", label: "Skin: Mago Estelar", claimed: false } },
  { level: 10, free: { icon: "💎", label: "25 Diamantes", claimed: false }, premium: { icon: "📿", label: "Amuleto Legendario", claimed: false } },
];

/* ══════════════ RECURSOS DATA ══════════════ */
const RESOURCE_PACKS = [
  { id: 1, icon: "🪨", name: "Pack de Piedra", amount: "x2000", price: 10, rarity: "common" },
  { id: 2, icon: "🪵", name: "Pack de Madera", amount: "x2000", price: 10, rarity: "common" },
  { id: 3, icon: "🍖", name: "Pack de Comida", amount: "x1500", price: 10, rarity: "common" },
  { id: 4, icon: "🥉", name: "Pack de Bronce", amount: "x500", price: 15, rarity: "clear" },
  { id: 5, icon: "⚡", name: "Pack de Energía", amount: "x1000", price: 20, rarity: "clear" },
  { id: 6, icon: "💼", name: "Mega Pack", amount: "x5000 de todo", price: 80, rarity: "epic" },
  { id: 7, icon: "✨", name: "Pack Prestigio", amount: "x10000 de todo", price: 200, rarity: "legendary" },
];

/* ══════════════ DIAMANTES DATA ══════════════ */
const DIAMOND_PACKS = [
  { id: 1, amount: 80, bonus: 0, price: "$0.99", icon: "💎", popular: false },
  { id: 2, amount: 500, bonus: 50, price: "$4.99", icon: "💎💎", popular: false },
  { id: 3, amount: 1200, bonus: 200, price: "$9.99", icon: "💎💎💎", popular: true },
  { id: 4, amount: 2500, bonus: 500, price: "$19.99", icon: "💰", popular: false },
  { id: 5, amount: 6500, bonus: 1500, price: "$49.99", icon: "💰💰", popular: false },
  { id: 6, amount: 14000, bonus: 4000, price: "$99.99", icon: "👑", popular: false },
];

/* ══════════════ TIMER HOOK ══════════════ */
function useCountdown(initial: number | null) {
  const [secs, setSecs] = useState(initial ?? 0);
  useEffect(() => {
    if (initial === null) return;
    const t = setInterval(() => setSecs(s => Math.max(0, s - 1)), 1000);
    return () => clearInterval(t);
  }, [initial]);
  const h = Math.floor(secs / 3600);
  const m = Math.floor((secs % 3600) / 60);
  const s = secs % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

function Timer({ seconds }: { seconds: number }) {
  const display = useCountdown(seconds);
  return (
    <span className="flex items-center gap-1 text-[10px] text-red-400 font-display">
      <Clock className="w-3 h-3" /> {display}
    </span>
  );
}

/* ══════════════ MAIN COMPONENT ══════════════ */
export default function Shop() {
  const [tab, setTab] = useState("Ofertas");
  const [diamonds] = useState(420);

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="glass-panel p-4 rounded-3xl flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display uppercase flex items-center gap-2">
            <ShoppingBag className="w-6 h-6 text-primary" /> Tienda
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">Mejora tu progreso con items exclusivos</p>
        </div>
        <div className="flex items-center gap-1.5 glass-panel px-3 py-1.5 rounded-xl">
          <span>💎</span>
          <span className="font-display text-sm text-accent">{diamonds}</span>
        </div>
      </div>

      {/* Category tabs */}
      <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {TABS.map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={cn(
              "shrink-0 px-3 py-1.5 rounded-xl font-display text-[10px] uppercase tracking-wide transition-all border",
              tab === t
                ? "bg-primary/20 border-primary/50 text-primary"
                : "bg-white/5 border-white/10 text-muted-foreground hover:text-white"
            )}>{t}</button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={tab}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.15 }}>

          {tab === "Ofertas" && <OfertasTab diamonds={diamonds} />}
          {tab === "Cofres" && <CofresTab diamonds={diamonds} />}
          {tab === "Pase de Batalla" && <BattlePassTab />}
          {tab === "Recursos" && <RecursosTab diamonds={diamonds} />}
          {tab === "Diamantes" && <DiamantesTab />}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

/* ══════════════ OFERTAS TAB ══════════════ */
function OfertasTab({ diamonds }: { diamonds: number }) {
  return (
    <div className="space-y-3">
      {OFFERS.map((offer, i) => (
        <motion.div key={offer.id}
          initial={{ opacity: 0, x: -15 }} animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.08 }}
          className={cn("glass-panel rounded-2xl p-4 border relative overflow-hidden", offer.borderColor)}
          style={{ background: `linear-gradient(135deg, var(--tw-gradient-stops))` }}>
          <div className={cn("absolute inset-0 bg-gradient-to-br", offer.gradient)} />
          <div className="relative z-10">
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="text-3xl">{offer.icon}</span>
                <div>
                  <div className="font-display text-sm text-white">{offer.title}</div>
                  <div className="text-[10px] text-muted-foreground">{offer.subtitle}</div>
                </div>
              </div>
              <span className={cn("text-[9px] px-2 py-0.5 rounded-full font-display", offer.tagColor)}>
                {offer.tag}
              </span>
            </div>

            <div className="flex items-center justify-between mt-3">
              <div className="flex items-center gap-2">
                {offer.original !== offer.price && (
                  <span className="text-xs line-through text-muted-foreground">{offer.currency} {offer.original}</span>
                )}
                <span className="text-sm font-display text-accent">{offer.currency} {offer.price}</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-red-500/20 text-red-400 font-display">{offer.bonus}</span>
              </div>
              <div className="flex items-center gap-3">
                {offer.timer !== null && <Timer seconds={offer.timer} />}
                <button className={cn(
                  "px-4 py-2 rounded-xl font-display text-[10px] uppercase tracking-wide transition-all",
                  diamonds >= offer.price
                    ? "bg-gradient-to-r from-accent to-orange-500 text-black shadow-[0_0_12px_rgba(255,170,0,0.3)]"
                    : "bg-white/5 text-white/30 cursor-not-allowed"
                )}>
                  Comprar
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

/* ══════════════ COFRES TAB ══════════════ */
function CofresTab({ diamonds }: { diamonds: number }) {
  return (
    <div className="space-y-4">
      {CHESTS.map((chest, i) => (
        <motion.div key={chest.id}
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
          className={cn("glass-panel rounded-2xl border-2 overflow-hidden")}
          style={{ borderColor: `${chest.borderColor}55`, boxShadow: `0 0 30px ${chest.glow}` }}>

          <div className={cn("p-5 bg-gradient-to-br", chest.gradient)}>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <span className="text-5xl">{chest.icon}</span>
                <div>
                  <div className="font-display text-lg text-white">{chest.name}</div>
                  <div className="text-[10px] text-muted-foreground">Contiene {chest.items}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-display text-lg text-accent">{chest.currency} {chest.price}</div>
              </div>
            </div>

            {/* Drop rates */}
            <div className="grid grid-cols-4 gap-2 mb-4">
              {chest.drops.map(d => (
                <div key={d.label} className="text-center bg-black/30 rounded-lg py-2 px-1">
                  <div className={cn("text-xs font-display", d.color)}>{d.pct}%</div>
                  <div className="text-[9px] text-muted-foreground">{d.label}</div>
                </div>
              ))}
            </div>

            <Link href={`/chest/${chest.id}`}>
              <motion.button whileTap={{ scale: 0.96 }}
                className={cn(
                  "w-full py-3 rounded-xl font-display text-sm uppercase tracking-wide transition-all",
                  diamonds >= chest.price
                    ? "text-black shadow-[0_0_15px_currentColor]"
                    : "bg-white/5 text-white/30 cursor-not-allowed"
                )}
                style={diamonds >= chest.price ? { background: `linear-gradient(135deg, ${chest.borderColor}, ${chest.borderColor}aa)` } : undefined}>
                Abrir — {chest.currency} {chest.price}
              </motion.button>
            </Link>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

/* ══════════════ BATTLE PASS TAB ══════════════ */
function BattlePassTab() {
  const xpPct = (BP_XP / BP_XP_NEXT) * 100;
  const [claimed, setClaimed] = useState<Set<number>>(() => {
    const s = new Set<number>();
    BP_REWARDS.forEach(r => { if (r.free.claimed) s.add(r.level); });
    return s;
  });

  const handleClaim = (level: number) => {
    setClaimed(prev => new Set(prev).add(level));
  };

  return (
    <div className="space-y-4">
      {/* Level & XP header */}
      <div className="glass-panel rounded-2xl p-4 border border-accent/30"
        style={{ background: "linear-gradient(135deg, rgba(255,170,0,0.1), rgba(123,47,252,0.1))" }}>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Scroll className="w-5 h-5 text-accent" />
            <span className="font-display text-lg text-white">Pase de Batalla</span>
          </div>
          <span className="font-display text-sm px-3 py-1 rounded-lg bg-accent/20 text-accent border border-accent/30">
            Temporada 1
          </span>
        </div>
        <div className="flex items-center gap-3 mb-2">
          <div className="flex items-center gap-1">
            <Star className="w-5 h-5 text-accent" fill="currentColor" />
            <span className="font-display text-2xl text-white">Nivel {BP_LEVEL}</span>
            <span className="text-sm text-muted-foreground font-display">/ 50</span>
          </div>
        </div>
        <div className="space-y-1">
          <div className="flex justify-between text-[10px] text-muted-foreground">
            <span>XP: {BP_XP} / {BP_XP_NEXT}</span>
            <span>{Math.round(xpPct)}%</span>
          </div>
          <Progress value={xpPct} indicatorClassName="bg-gradient-to-r from-accent to-secondary" />
        </div>
      </div>

      {!BP_PREMIUM && (
        <div className="glass-panel rounded-2xl p-3 border border-secondary/30 flex items-center justify-between"
          style={{ background: "linear-gradient(135deg, rgba(255,0,200,0.1), rgba(123,47,252,0.15))" }}>
          <div>
            <div className="font-display text-sm text-white">Desbloquea Premium</div>
            <div className="text-[10px] text-muted-foreground">Accede a recompensas exclusivas</div>
          </div>
          <button className="px-4 py-2 rounded-xl font-display text-[10px] uppercase bg-gradient-to-r from-secondary to-purple-500 text-white shadow-[0_0_15px_rgba(255,0,200,0.3)]">
            💎 999 — Comprar Premium
          </button>
        </div>
      )}

      {/* Reward tracks */}
      <div className="space-y-2">
        {/* Header row */}
        <div className="grid grid-cols-[40px_1fr_1fr] gap-2 px-1">
          <div className="text-[9px] text-muted-foreground font-display text-center">NV</div>
          <div className="text-[9px] text-muted-foreground font-display text-center uppercase">Gratis</div>
          <div className="text-[9px] text-muted-foreground font-display text-center uppercase flex items-center justify-center gap-1">
            Premium <Lock className="w-2.5 h-2.5" />
          </div>
        </div>

        {BP_REWARDS.map((row, i) => {
          const isCurrentLevel = row.level === BP_LEVEL;
          const isReached = row.level <= BP_LEVEL;
          const isFreeClaimed = claimed.has(row.level);
          const isPremiumClaimed = BP_PREMIUM && isFreeClaimed;

          return (
            <motion.div key={row.level}
              initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.04 }}
              className={cn(
                "grid grid-cols-[40px_1fr_1fr] gap-2 rounded-xl border transition-all",
                isCurrentLevel
                  ? "border-accent/50 bg-accent/10 shadow-[0_0_15px_rgba(255,170,0,0.15)]"
                  : isReached
                    ? "border-white/10 bg-white/5"
                    : "border-white/5 bg-white/[0.02]"
              )}>

              {/* Level number */}
              <div className={cn(
                "flex items-center justify-center font-display text-sm rounded-l-xl",
                isCurrentLevel ? "text-accent" : isReached ? "text-white" : "text-white/30"
              )}>
                {row.level}
              </div>

              {/* Free reward */}
              <div className="flex items-center gap-2 py-2.5 px-2">
                <span className="text-lg">{row.free.icon}</span>
                <span className={cn("text-[10px] flex-1", isReached ? "text-white" : "text-white/40")}>{row.free.label}</span>
                {isReached && isFreeClaimed ? (
                  <span className="text-green-400 text-xs">✓</span>
                ) : isReached && !isFreeClaimed ? (
                  <button onClick={() => handleClaim(row.level)}
                    className="px-2 py-1 rounded-lg bg-green-500/20 text-green-400 text-[9px] font-display border border-green-500/30 hover:bg-green-500/30 transition-colors">
                    Reclamar
                  </button>
                ) : (
                  <span className="text-white/20 text-[9px]">Nv.{row.level}</span>
                )}
              </div>

              {/* Premium reward */}
              <div className="flex items-center gap-2 py-2.5 px-2 border-l border-white/5">
                <span className={cn("text-lg", !BP_PREMIUM && "opacity-50")}>{row.premium.icon}</span>
                <span className={cn("text-[10px] flex-1", !BP_PREMIUM ? "text-white/30" : isReached ? "text-white" : "text-white/40")}>
                  {row.premium.label}
                </span>
                {!BP_PREMIUM ? (
                  <Lock className="w-3 h-3 text-white/20" />
                ) : isReached && isPremiumClaimed ? (
                  <span className="text-green-400 text-xs">✓</span>
                ) : isReached ? (
                  <button className="px-2 py-1 rounded-lg bg-green-500/20 text-green-400 text-[9px] font-display border border-green-500/30">
                    Reclamar
                  </button>
                ) : (
                  <span className="text-white/20 text-[9px]">Nv.{row.level}</span>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

/* ══════════════ RECURSOS TAB ══════════════ */
function RecursosTab({ diamonds }: { diamonds: number }) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {RESOURCE_PACKS.map((pack, i) => {
        const borderColor = RARITY_BORDER[pack.rarity];
        const canBuy = diamonds >= pack.price;
        return (
          <motion.div key={pack.id}
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="glass-panel rounded-2xl p-4 flex flex-col border-2"
            style={{ borderColor: `${borderColor}55` }}>
            <span className="text-3xl mb-2">{pack.icon}</span>
            <div className="font-display text-xs text-white mb-0.5">{pack.name}</div>
            <div className="text-[10px] text-muted-foreground mb-3 flex-1">{pack.amount}</div>
            <button className={cn(
              "w-full py-2 rounded-xl font-display text-[10px] uppercase tracking-wide transition-all",
              canBuy
                ? "text-black shadow-[0_0_10px_currentColor]"
                : "bg-white/5 text-white/30 cursor-not-allowed"
            )}
              style={canBuy ? { background: `linear-gradient(135deg, ${borderColor}, ${borderColor}aa)` } : undefined}>
              💎 {pack.price}
            </button>
          </motion.div>
        );
      })}
    </div>
  );
}

/* ══════════════ DIAMANTES TAB ══════════════ */
function DiamantesTab() {
  return (
    <div className="space-y-3">
      <div className="glass-panel rounded-2xl p-3 border border-accent/20 text-center"
        style={{ background: "linear-gradient(135deg, rgba(255,170,0,0.05), rgba(255,170,0,0.1))" }}>
        <Diamond className="w-6 h-6 text-accent mx-auto mb-1" />
        <div className="font-display text-sm text-white">Comprar Diamantes</div>
        <div className="text-[10px] text-muted-foreground">Los precios son simulados</div>
      </div>

      {DIAMOND_PACKS.map((pack, i) => (
        <motion.div key={pack.id}
          initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.06 }}
          className={cn(
            "glass-panel rounded-2xl p-4 flex items-center justify-between border transition-all",
            pack.popular
              ? "border-accent/50 shadow-[0_0_20px_rgba(255,170,0,0.15)]"
              : "border-white/10"
          )}>
          <div className="flex items-center gap-3">
            <span className="text-2xl">{pack.icon}</span>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-display text-sm text-white">💎 {pack.amount.toLocaleString()}</span>
                {pack.bonus > 0 && (
                  <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-green-500/20 text-green-400 font-display">
                    +{pack.bonus} BONUS
                  </span>
                )}
              </div>
              {pack.popular && (
                <span className="text-[9px] text-accent font-display uppercase">Mas popular</span>
              )}
            </div>
          </div>
          <button className={cn(
            "px-4 py-2.5 rounded-xl font-display text-xs uppercase tracking-wide transition-all",
            "bg-gradient-to-r from-accent to-orange-500 text-black shadow-[0_0_12px_rgba(255,170,0,0.3)]"
          )}>
            {pack.price}
          </button>
        </motion.div>
      ))}
    </div>
  );
}
