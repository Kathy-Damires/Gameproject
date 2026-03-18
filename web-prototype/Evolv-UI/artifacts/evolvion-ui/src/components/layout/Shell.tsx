import React, { useEffect, useState, useRef } from "react";
import { Link, useLocation } from "wouter";
import { Building2, Swords, GalleryVerticalEnd, ShoppingBag, Trophy, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface Resources { stone:number; wood:number; food:number; bronze:number; energy:number; diamonds:number; }
const RATES: Resources = { stone:2.5, wood:1.8, food:1.2, bronze:0.4, energy:0.8, diamonds:0.02 };
const ICONS: Record<keyof Resources,string> = { stone:"🪨", wood:"🪵", food:"🍖", bronze:"🥉", energy:"⚡", diamonds:"💎" };

export function Shell({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const [resources, setResources] = useState<Resources>({ stone:150, wood:80, food:45, bronze:12, energy:30, diamonds:5 });
  const tickRef = useRef<ReturnType<typeof setInterval>|null>(null);
  const [achievements] = useState(7);

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
          <span className="text-sm font-display text-gradient-primary tracking-widest">EVOLVION</span>
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] px-2 py-1 rounded-full bg-white/5 border border-white/10 text-muted-foreground font-display">
              Era: Bronce
            </span>
            {/* Logros (Achievements) — in top bar as requested */}
            <Link href="/achievements"
              className="relative flex items-center gap-1 px-2 py-1 rounded-full bg-accent/10 border border-accent/20 hover:bg-accent/20 transition-colors">
              <Trophy className="w-3 h-3 text-accent" />
              <span className="text-[10px] font-display text-accent">{achievements}</span>
            </Link>
            {/* Clans — top bar compact */}
            <Link href="/clans"
              className="flex items-center p-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 hover:bg-blue-500/20 transition-colors">
              <Users className="w-3.5 h-3.5 text-blue-400" />
            </Link>
          </div>
        </div>

        {/* Resources + Prestige shortcut */}
        <div className="flex gap-1.5 overflow-x-auto pb-0.5 scrollbar-none">
          {(Object.keys(resources) as (keyof Resources)[]).map(key => (
            <React.Fragment key={key}>
              <div className="flex items-center gap-1 shrink-0 bg-black/30 px-2 py-1 rounded-lg border border-white/8 text-xs">
                <span className="text-sm">{ICONS[key]}</span>
                <span className="font-bold text-white">{fmt(resources[key])}</span>
                <span className="text-green-400 text-[9px]">+{RATES[key]}/s</span>
              </div>
              {/* Prestige shortcut — right after energy */}
              {key === "energy" && (
                <Link href="/minigames" className="shrink-0">
                  <div className={cn(
                    "flex items-center gap-1 px-2 py-1 rounded-lg border text-xs transition-all",
                    location === "/minigames"
                      ? "bg-secondary/20 border-secondary/40 text-secondary"
                      : "bg-purple-900/40 border-purple-500/30 text-purple-300 hover:bg-purple-900/60"
                  )}>
                    <span className="text-sm">✨</span>
                    <span className="font-display font-bold text-[10px]">Prestigio</span>
                    <span className="text-purple-400 text-[9px]">Nv.3</span>
                  </div>
                </Link>
              )}
            </React.Fragment>
          ))}
        </div>
      </header>

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

      {/* ── Bottom Nav ── */}
      <nav className="fixed bottom-0 w-full max-w-md z-30">
        <div className="glass-panel mx-3 mb-4 rounded-2xl shadow-2xl shadow-black/60 border border-white/10">
          <div className="flex items-end px-3 py-1.5 gap-1">

            {/* LEFT: Tienda — full tab, more visible with color accent */}
            <NavFull href="/shop" icon={ShoppingBag} label="Tienda" active={location==="/shop"} accent />

            {/* LEFT: Estructuras — full tab */}
            <NavFull href="/structures" icon={Building2} label="Estructuras" active={location==="/structures"} />

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

            {/* RIGHT: Combate — badge style */}
            <NavBadge href="/character" icon={Swords} label="Combate" active={location==="/character"} badge={3} color="red" />

            {/* RIGHT: Cartas — badge style */}
            <NavBadge href="/collection" icon={GalleryVerticalEnd} label="Cartas" active={location==="/collection"} badge={12} color="cyan" />

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
  { href:string; icon:any; label:string; active:boolean; badge?:number; color:"red"|"cyan" }) {
  const colors = {
    red:  { ring:"border-red-500/40",  bg:"bg-red-500/20",   text:"text-red-400",   badgeBg:"bg-red-500" },
    cyan: { ring:"border-cyan-400/40", bg:"bg-cyan-400/20",  text:"text-cyan-400",  badgeBg:"bg-cyan-500" },
  }[color];

  return (
    <Link href={href} className="flex-1">
      <div className="flex flex-col items-center justify-center gap-0.5 py-1">
        {/* Compact circular badge button */}
        <div className="relative">
          <div className={cn(
            "w-10 h-10 rounded-full flex items-center justify-center transition-all border-2",
            active
              ? cn(colors.ring, colors.bg)
              : "border-white/15 bg-white/5 hover:bg-white/10"
          )}>
            <Icon className={cn("w-4 h-4", active ? colors.text : "text-muted-foreground")} />
          </div>
          {/* Notification badge */}
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
