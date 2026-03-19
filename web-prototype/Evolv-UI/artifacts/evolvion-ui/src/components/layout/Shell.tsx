import React, { useEffect, useState, useRef } from "react";
import { Link, useLocation } from "wouter";
import { GalleryVerticalEnd, ShoppingBag, Trophy, Users, Settings, Gift } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface Resources { stone:number; wood:number; food:number; bronze:number; energy:number; diamonds:number; }
const RATES: Resources = { stone:2.5, wood:1.8, food:1.2, bronze:0.4, energy:0.8, diamonds:0.02 };
const ICONS: Record<keyof Resources,string> = { stone:"🪨", wood:"🪵", food:"🍖", bronze:"🥉", energy:"⚡", diamonds:"💎" };

/* ── Social notification messages ── */
const SOCIAL_MESSAGES = [
  "⚔️ DragonSlayer99 te superó en el ranking!",
  "🏆 Tu clan completó un evento!",
  "💎 Oferta flash: 50% descuento por 30 min",
  "🔥 NovaStar42 evolucionó a la Era Espacial!",
  "⚡ Tu producción aumentó un 15%!",
  "🎁 Nuevo cofre disponible en la tienda!",
  "👑 CosmicKing alcanzó el Top 10!",
];

export function Shell({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const [resources, setResources] = useState<Resources>({ stone:150, wood:80, food:45, bronze:12, energy:30, diamonds:5 });
  const tickRef = useRef<ReturnType<typeof setInterval>|null>(null);

  /* ── Offline earnings popup state ── */
  const [showOfflinePopup, setShowOfflinePopup] = useState(false);
  const [offlineCollected, setOfflineCollected] = useState(false);

  /* ── Social notification state ── */
  const [socialMsg, setSocialMsg] = useState<string | null>(null);
  const socialTimer = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    tickRef.current = setInterval(() => {
      setResources(prev => ({
        stone:    prev.stone    + RATES.stone,
        wood:     prev.wood     + RATES.wood,
        food:     prev.food     + RATES.food,
        bronze:   prev.bronze   + RATES.bronze,
        energy:   prev.energy   + RATES.energy,
        diamonds: prev.diamonds + RATES.diamonds,
      }));
    }, 1000);
    return () => { if (tickRef.current) clearInterval(tickRef.current); };
  }, []);

  /* Side badge states */
  const [showBattlePass, setShowBattlePass] = useState(false);
  const [adsWatched, setAdsWatched] = useState(0);

  /* Event timer */
  const [eventSeconds, setEventSeconds] = useState(2 * 3600 + 15 * 60);
  useEffect(() => {
    const t = setInterval(() => setEventSeconds(s => Math.max(0, s - 1)), 1000);
    return () => clearInterval(t);
  }, []);
  const evtH = Math.floor(eventSeconds / 3600);
  const evtM = Math.floor((eventSeconds % 3600) / 60);
  const evtS = eventSeconds % 60;

  /* Show offline popup only once per session */
  useEffect(() => {
    if (sessionStorage.getItem("offlineShown")) return;
    const t = setTimeout(() => {
      setShowOfflinePopup(true);
      sessionStorage.setItem("offlineShown", "1");
    }, 5000);
    return () => clearTimeout(t);
  }, []);

  /* Social notifications every 30 seconds */
  useEffect(() => {
    socialTimer.current = setInterval(() => {
      const msg = SOCIAL_MESSAGES[Math.floor(Math.random() * SOCIAL_MESSAGES.length)];
      setSocialMsg(msg);
      setTimeout(() => setSocialMsg(null), 4000);
    }, 30000);
    return () => { if (socialTimer.current) clearInterval(socialTimer.current); };
  }, []);

  const handleCollectOffline = (double: boolean) => {
    const multiplier = double ? 2 : 1;
    setResources(prev => ({
      ...prev,
      stone: prev.stone + 1240 * multiplier,
      wood: prev.wood + 890 * multiplier,
      food: prev.food + 560 * multiplier,
    }));
    setOfflineCollected(true);
    setTimeout(() => setShowOfflinePopup(false), 600);
  };

  const fmt = (n: number) =>
    n >= 1_000_000 ? (n/1_000_000).toFixed(1)+"M"
    : n >= 1_000   ? (n/1_000).toFixed(1)+"K"
    : Math.floor(n).toString();

  const isHome = location === "/";

  return (
    <div className="min-h-screen bg-background relative flex flex-col max-w-md mx-auto overflow-hidden shadow-2xl">
      {/* Cosmic BG */}
      <div className="fixed inset-0 z-0 opacity-40 pointer-events-none bg-cover bg-center"
        style={{ backgroundImage:`url(${import.meta.env.BASE_URL}images/bg-space.png)` }} />

      {/* ── Top bar ── */}
      <header className="relative z-20 glass-panel border-t-0 border-x-0 rounded-b-2xl px-3 py-2 sticky top-0 shadow-lg">
        <div className="flex items-center justify-between mb-1.5">
          <div className="flex items-center gap-1.5">
            <span className="text-sm font-display text-gradient-primary tracking-widest">EVOLVION</span>
            {/* Prestigio */}
            <Link href="/minigames"
              className={cn(
                "flex items-center gap-1 px-2 py-1 rounded-full border text-[10px] transition-all",
                location === "/minigames"
                  ? "bg-secondary/20 border-secondary/40 text-secondary"
                  : "bg-purple-900/40 border-purple-500/30 text-purple-300 hover:bg-purple-900/60"
              )}>
              <span className="text-xs">✨</span>
              <span className="font-display font-bold">Nv.3</span>
            </Link>
          </div>
          <div className="flex items-center gap-1.5">
            {/* Daily rewards notification dot */}
            <Link href="/daily-rewards"
              className="relative flex items-center p-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 hover:bg-amber-500/20 transition-colors">
              <Gift className="w-3.5 h-3.5 text-amber-400" />
              <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-red-500 border border-background animate-pulse" />
            </Link>
            <span className="text-[10px] px-2 py-1 rounded-full bg-white/5 border border-white/10 text-muted-foreground font-display">
              Era: Bronce
            </span>
            {/* Configuracion */}
            <Link href="/settings"
              className="flex items-center p-1.5 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
              <Settings className="w-3.5 h-3.5 text-muted-foreground" />
            </Link>
          </div>
        </div>

        {/* Resources — todos visibles */}
        <div className="grid grid-cols-6 gap-1 pb-0.5">
          {(Object.keys(resources) as (keyof Resources)[]).map(key => (
            <div key={key} className="flex items-center gap-0.5 bg-black/30 px-1.5 py-1 rounded-lg border border-white/8 text-[10px]">
              <span className="text-xs">{ICONS[key]}</span>
              <span className="font-bold text-white">{fmt(resources[key])}</span>
            </div>
          ))}
        </div>
      </header>

      {/* ── Side badges (right inside screen, only on home) ── */}
      {isHome && (
        <div className="absolute right-2 top-[120px] z-25 flex flex-col gap-2">
          {/* Evento x2 XP */}
          {eventSeconds > 0 && (
            <Link href="/shop">
              <motion.div whileTap={{ scale: 0.9 }}
                className="relative w-12 flex flex-col items-center cursor-pointer">
                <div className="w-11 h-11 rounded-full bg-secondary/20 border-2 border-secondary/40 flex flex-col items-center justify-center shadow-[0_0_10px_rgba(200,50,180,0.3)]">
                  <div className="absolute inset-0 rounded-full border-2 border-secondary/20 animate-ping pointer-events-none" />
                  <span className="text-sm leading-none">🔥</span>
                </div>
                <span className="text-[7px] font-display text-secondary mt-0.5">x2 XP</span>
                <span className="text-[6px] text-white/60 tabular-nums">{evtH}:{String(evtM).padStart(2,"0")}:{String(evtS).padStart(2,"0")}</span>
              </motion.div>
            </Link>
          )}
          {/* Pase de Batalla */}
          <motion.button whileTap={{ scale: 0.9 }}
            onClick={() => setShowBattlePass(true)}
            className="relative w-12 flex flex-col items-center">
            <div className="absolute -top-1 -right-0.5 w-3.5 h-3.5 rounded-full bg-red-500 flex items-center justify-center text-[6px] font-display text-white z-10">!</div>
            <div className="w-11 h-11 rounded-full bg-purple-500/20 border-2 border-purple-500/30 flex items-center justify-center">
              <span className="text-sm leading-none">📜</span>
            </div>
            <span className="text-[7px] font-display text-purple-400 mt-0.5">Pase</span>
            <span className="text-[6px] text-white/60">Nv.7</span>
          </motion.button>
          {/* Anuncios gratis */}
          {adsWatched < 3 && (
            <motion.button whileTap={{ scale: 0.9 }}
              onClick={() => { setAdsWatched(a => a + 1); }}
              className="relative w-12 flex flex-col items-center">
              <div className="absolute -top-1 -right-0.5 w-3.5 h-3.5 rounded-full bg-amber-500 flex items-center justify-center text-[6px] font-display text-black z-10">{3 - adsWatched}</div>
              <div className="w-11 h-11 rounded-full bg-amber-400/15 border-2 border-amber-400/30 flex items-center justify-center">
                <span className="text-sm leading-none">🎬</span>
              </div>
              <span className="text-[7px] font-display text-amber-300 mt-0.5">Gratis</span>
              <span className="text-[6px] text-white/60">{3 - adsWatched}/3</span>
            </motion.button>
          )}
        </div>
      )}

      {/* ── Battle Pass Popup (triggered from side badge) ── */}
      <AnimatePresence>
        {showBattlePass && <BattlePassOverlay onClose={() => setShowBattlePass(false)} />}
      </AnimatePresence>

      {/* ── Main content ── */}
      <main className="flex-1 relative z-10 overflow-y-auto pb-32 pt-4 px-4 custom-scrollbar">
        <AnimatePresence mode="wait">
          <motion.div key={location}
            initial={{ opacity:0, y:10, scale:0.98 }}
            animate={{ opacity:1, y:0, scale:1 }}
            exit={{ opacity:0, y:-10, scale:0.98 }}
            transition={{ duration:0.2 }}>
            {children}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* ── Social Notification Toast ── */}
      <AnimatePresence>
        {socialMsg && (
          <motion.div
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            transition={{ type: "spring", bounce: 0.3, duration: 0.5 }}
            className="fixed bottom-[100px] left-1/2 -translate-x-1/2 z-40 w-[calc(100%-2rem)] max-w-[calc(var(--max-w-md,448px)-2rem)]"
          >
            <div className="glass-panel rounded-xl px-4 py-3 border border-white/15 shadow-2xl shadow-black/60">
              <p className="text-xs text-white text-center font-display">{socialMsg}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Offline Earnings Popup ── */}
      <AnimatePresence>
        {showOfflinePopup && !offlineCollected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-6"
          >
            <motion.div
              initial={{ scale: 0.8, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 30, opacity: 0 }}
              transition={{ type: "spring", bounce: 0.3 }}
              className="glass-panel rounded-3xl p-6 border border-white/20 w-full max-w-sm shadow-2xl relative overflow-hidden"
            >
              {/* Decorative glow */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -mt-10 w-40 h-40 bg-accent/20 rounded-full blur-3xl" />

              <div className="relative z-10 text-center space-y-4">
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 1, repeat: Infinity, repeatDelay: 2 }}
                  className="text-5xl"
                >
                  👋
                </motion.div>

                <div>
                  <h2 className="text-xl font-display text-white mb-1">
                    ¡Bienvenido de vuelta!
                  </h2>
                  <p className="text-xs text-muted-foreground">
                    Mientras no estabas ganaste:
                  </p>
                </div>

                {/* Resource earnings */}
                <div className="flex justify-center gap-3">
                  <div className="glass-panel px-3 py-2 rounded-xl border border-white/10 text-center">
                    <span className="text-lg">🪨</span>
                    <div className="text-sm font-display text-green-400">+1,240</div>
                  </div>
                  <div className="glass-panel px-3 py-2 rounded-xl border border-white/10 text-center">
                    <span className="text-lg">🪵</span>
                    <div className="text-sm font-display text-green-400">+890</div>
                  </div>
                  <div className="glass-panel px-3 py-2 rounded-xl border border-white/10 text-center">
                    <span className="text-lg">🍖</span>
                    <div className="text-sm font-display text-green-400">+560</div>
                  </div>
                </div>

                <p className="text-[10px] text-muted-foreground">
                  Tiempo fuera: 4h 23m
                </p>

                {/* Buttons */}
                <div className="flex gap-3">
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleCollectOffline(false)}
                    className="flex-1 py-3 rounded-xl font-display text-sm uppercase tracking-wide bg-gradient-to-r from-primary to-green-600 text-white shadow-[0_0_15px_rgba(76,175,80,0.3)] transition-all"
                  >
                    Recoger
                  </motion.button>
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleCollectOffline(true)}
                    className="flex-1 py-3 rounded-xl font-display text-sm uppercase tracking-wide bg-gradient-to-r from-amber-500 to-orange-500 text-black shadow-[0_0_15px_rgba(255,170,0,0.4)] transition-all"
                  >
                    x2 Ver anuncio
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Collected confirmation */}
      <AnimatePresence>
        {offlineCollected && showOfflinePopup && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-6"
          >
            <motion.div
              initial={{ scale: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="glass-panel rounded-3xl p-6 border border-green-500/30 text-center"
            >
              <span className="text-4xl">✅</span>
              <p className="text-sm font-display text-green-400 mt-2">
                ¡Recursos recogidos!
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Bottom Nav ── */}
      <nav className="fixed bottom-0 w-full max-w-md z-30">
        <div className="glass-panel mx-3 mb-4 rounded-2xl shadow-2xl shadow-black/60 border border-white/10">
          <div className="flex items-end px-3 py-1.5 gap-1">

            {/* LEFT: Tienda */}
            <NavFull href="/shop" icon={ShoppingBag} label="Tienda" active={location==="/shop"} accent />

            {/* LEFT: Cartas */}
            <NavFull href="/collection" icon={GalleryVerticalEnd} label="Cartas" active={location==="/collection"} />

            {/* CENTER: Planet button */}
            <Link href="/" className="flex-shrink-0 flex justify-center mx-1" style={{ marginTop:-20 }}>
              <div className="flex flex-col items-center">
                <motion.div whileTap={{ scale:0.9 }}
                  className={cn(
                    "w-[62px] h-[62px] rounded-full relative border-4 transition-all",
                    isHome ? "border-white/50 scale-110" : "border-white/20"
                  )}
                  style={{ boxShadow:isHome ? "0 0 24px rgba(76,175,80,0.7)" : "0 0 10px rgba(76,175,80,0.3)" }}>
                  <div className="w-full h-full rounded-full planet-porera overflow-hidden">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-[140%] h-[22%] rounded-full border border-white/30 rotate-[20deg]" />
                    </div>
                  </div>
                </motion.div>
                <span className={cn("text-[9px] font-display mt-1", isHome ? "text-green-400" : "text-muted-foreground")}>
                  Planeta
                </span>
              </div>
            </Link>

            {/* RIGHT: Clanes */}
            <NavBadge href="/clans" icon={Users} label="Clanes" active={location==="/clans"} badge={5} color="blue" />

            {/* RIGHT: Logros */}
            <NavBadge href="/achievements" icon={Trophy} label="Logros" active={location==="/achievements"} badge={7} color="gold" />

          </div>
        </div>
      </nav>
    </div>
  );
}

/* Full nav item (icon + label below) */
function NavFull({ href, icon:Icon, label, active, accent }:
  { href:string; icon:any; label:string; active:boolean; accent?:boolean }) {
  const activeColor = accent ? "text-secondary bg-secondary/20" : "text-primary bg-primary/20";
  const accentBorder = accent && !active ? "border border-secondary/20" : "";
  return (
    <Link href={href} className="flex-1">
      <div className="flex flex-col items-center justify-center gap-0.5 py-1">
        <div className={cn(
          "p-2 rounded-xl transition-all duration-300 relative",
          active ? activeColor : cn("text-muted-foreground hover:text-white", accentBorder),
        )}>
          <Icon className={cn("w-5 h-5", accent && !active && "text-secondary/70")} />
          {active && (
            <motion.div layoutId={`blob-${href}`}
              className={cn("absolute inset-0 rounded-xl blur-sm -z-10", accent ? "bg-secondary/20" : "bg-primary/20")}
              transition={{ type:"spring", bounce:0.2, duration:0.6 }} />
          )}
        </div>
        <span className={cn(
          "text-[9px] font-display transition-colors",
          active ? (accent ? "text-secondary" : "text-primary") : (accent ? "text-secondary/60" : "text-muted-foreground")
        )}>{label}</span>
      </div>
    </Link>
  );
}

/* Badge-style nav item — compact circular with notification count */
function NavBadge({ href, icon:Icon, label, active, badge, color }:
  { href:string; icon:any; label:string; active:boolean; badge?:number; color:"red"|"cyan"|"blue"|"gold" }) {
  const colorMap = {
    red:  { ring:"border-red-500/40",    bg:"bg-red-500/20",    text:"text-red-400",    badgeBg:"bg-red-500" },
    cyan: { ring:"border-cyan-400/40",   bg:"bg-cyan-400/20",   text:"text-cyan-400",   badgeBg:"bg-cyan-500" },
    blue: { ring:"border-blue-400/40",   bg:"bg-blue-400/20",   text:"text-blue-400",   badgeBg:"bg-blue-500" },
    gold: { ring:"border-amber-400/40",  bg:"bg-amber-400/20",  text:"text-amber-400",  badgeBg:"bg-amber-500" },
  };
  const colors = colorMap[color];

  return (
    <Link href={href} className="flex-1">
      <div className="flex flex-col items-center justify-center gap-0.5 py-1">
        <div className="relative">
          <div className={cn(
            "w-10 h-10 rounded-full flex items-center justify-center transition-all border-2",
            active
              ? cn(colors.ring, colors.bg)
              : "border-white/15 bg-white/5 hover:bg-white/10"
          )}>
            <Icon className={cn("w-4 h-4", active ? colors.text : "text-muted-foreground")} />
          </div>
          {badge !== undefined && (
            <div className={cn(
              "absolute -top-1 -right-1 min-w-[16px] h-4 rounded-full flex items-center justify-center",
              "text-[8px] font-display text-white px-1",
              active ? colors.badgeBg : "bg-white/20"
            )}>
              {badge}
            </div>
          )}
        </div>
        <span className={cn(
          "text-[9px] font-display transition-colors",
          active ? colors.text : "text-muted-foreground"
        )}>{label}</span>
      </div>
    </Link>
  );
}

/* ── Battle Pass Overlay ── */
const BP_DATA = [
  { level: 1, free: "100 🪨", premium: "500 🪨 + 5 💎", fi: "🪨", pi: "💎" },
  { level: 2, free: "100 🪵", premium: "500 🪵 + 5 💎", fi: "🪵", pi: "💎" },
  { level: 3, free: "50 🍖", premium: "Carta Común", fi: "🍖", pi: "🃏" },
  { level: 4, free: "2 💎", premium: "Carta Clara", fi: "💎", pi: "🃏" },
  { level: 5, free: "200 🪨", premium: "10 💎 + Cofre", fi: "🪨", pi: "🎁" },
  { level: 6, free: "5 ⚡", premium: "Carta Épica", fi: "⚡", pi: "🃏" },
  { level: 7, free: "150 🥉", premium: "15 💎", fi: "🥉", pi: "💎" },
  { level: 8, free: "300 🪨", premium: "Equipo Épico", fi: "🪨", pi: "⚔️" },
  { level: 9, free: "10 💎", premium: "Carta Legendaria", fi: "💎", pi: "👑" },
  { level: 10, free: "500 🪨", premium: "🎨 Skin", fi: "🪨", pi: "🎨" },
];

function BattlePassOverlay({ onClose }: { onClose: () => void }) {
  const cur = 7;
  const [claimed, setClaimed] = React.useState(new Set(["f1","f2","f3","f4","f5","f6"]));
  const claim = (k: string) => setClaimed(p => new Set([...p, k]));
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 backdrop-blur-sm" onClick={onClose}>
      <motion.div initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
        transition={{ type: "spring", bounce: 0.15, duration: 0.5 }}
        className="w-full max-w-md bg-[#0d0520] rounded-t-3xl border-t border-x border-white/10 max-h-[85vh] flex flex-col"
        onClick={e => e.stopPropagation()}>
        <div className="p-4 border-b border-white/10 shrink-0">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="text-lg">📜</span>
              <h2 className="text-base font-display text-white uppercase">Pase de Batalla</h2>
            </div>
            <button onClick={onClose} className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center text-white/60 hover:bg-white/20 text-sm">✕</button>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-purple-500/20 border-2 border-purple-500/40 flex flex-col items-center justify-center">
              <span className="text-sm font-display text-purple-400">{cur}</span>
              <span className="text-[6px] font-display text-purple-400/70 uppercase">Nv</span>
            </div>
            <div className="flex-1">
              <div className="flex justify-between text-[10px] mb-1">
                <span className="text-muted-foreground">XP: 65/100</span>
                <span className="text-purple-400 font-display">Nv {cur + 1}</span>
              </div>
              <div className="w-full bg-white/10 rounded-full h-2">
                <div className="h-full rounded-full bg-gradient-to-r from-purple-500 to-primary" style={{ width: "65%" }} />
              </div>
              <div className="text-[8px] text-muted-foreground mt-1">Temporada: 23 días restantes</div>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-[32px_1fr_1fr] gap-1.5 px-3 pt-2 text-center">
          <span className="text-[7px] text-muted-foreground font-display">NV</span>
          <span className="text-[7px] text-green-400 font-display uppercase">Gratis</span>
          <span className="text-[7px] text-purple-400 font-display uppercase">Premium 🔒</span>
        </div>
        <div className="flex-1 overflow-y-auto custom-scrollbar px-3 pb-3 pt-1 space-y-1">
          {BP_DATA.map(bp => {
            const reached = bp.level <= cur;
            const isCur = bp.level === cur;
            const fk = `f${bp.level}`;
            const fc = claimed.has(fk);
            return (
              <div key={bp.level} className={cn(
                "grid grid-cols-[32px_1fr_1fr] gap-1.5 items-center rounded-lg px-1 py-1.5",
                isCur ? "bg-purple-500/10 border border-purple-500/30" : reached ? "bg-white/3" : "opacity-35"
              )}>
                <div className={cn("w-6 h-6 rounded flex items-center justify-center font-display text-[10px]",
                  isCur ? "bg-purple-500/30 text-purple-400" : reached ? "bg-white/10 text-white" : "text-white/30"
                )}>{bp.level}</div>
                <div className={cn("rounded-lg px-2 py-1 text-center border",
                  fc ? "bg-green-500/10 border-green-500/20" : reached ? "bg-white/5 border-white/10" : "border-white/5"
                )}>
                  <span className="text-xs">{bp.fi}</span>
                  <div className="text-[7px] text-white/80">{bp.free}</div>
                  {reached && !fc ? (
                    <button onClick={() => claim(fk)} className="px-1.5 py-0.5 rounded bg-green-500 text-[6px] font-display text-white uppercase mt-0.5">Reclamar</button>
                  ) : fc ? <span className="text-[7px] text-green-400">✓</span> : null}
                </div>
                <div className="rounded-lg px-2 py-1 text-center border border-white/5 bg-black/20 relative">
                  <div className="absolute top-0 right-0.5 text-[6px]">🔒</div>
                  <span className="text-xs">{bp.pi}</span>
                  <div className="text-[7px] text-white/80">{bp.premium}</div>
                </div>
              </div>
            );
          })}
        </div>
        <div className="p-3 border-t border-white/10 shrink-0">
          <motion.button whileTap={{ scale: 0.97 }}
            className="w-full py-2.5 rounded-2xl font-display text-sm uppercase bg-gradient-to-r from-purple-500 to-primary text-white shadow-[0_0_15px_rgba(168,85,247,0.3)]">
            Comprar Premium — 999 💎
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}
