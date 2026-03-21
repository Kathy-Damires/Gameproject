import React, { useState, useEffect, Suspense, lazy } from "react";
import { useRoute, Link } from "wouter";
// @ts-ignore
import { motion, AnimatePresence } from "framer-motion";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { RESOURCE_ICONS, NAV_ICONS } from "@/lib/icons";

const PlanetScene = lazy(() => import("@/components/3d/PlanetScene"));
const PlanetSurface = lazy(() => import("@/components/3d/PlanetSurface"));

const ERAS = ["Piedra","Tribal","Bronce","Clásica","Medieval","Industrial","Robótica","Espacial","Singularidad"];

// Requirements to advance to next era (index = current era)
interface EraRequirement { label: string; current: number; required: number; met: boolean; }
const ERA_REQUIREMENTS: Record<number, EraRequirement[]> = {
  0: [ // Piedra → Tribal
    { label: "Cantera Nv.3+",    current: 5, required: 3, met: true },
    { label: "Aserradero Nv.3+", current: 3, required: 3, met: true },
    { label: "200 Piedra",        current: 3400, required: 200, met: true },
    { label: "150 Madera",        current: 1580, required: 150, met: true },
  ],
  1: [ // Tribal → Bronce
    { label: "Granja Nv.3+",     current: 2, required: 3, met: false },
    { label: "Cantera Nv.5+",    current: 5, required: 5, met: true },
    { label: "Aserradero Nv.5+", current: 3, required: 5, met: false },
    { label: "500 Piedra",        current: 3400, required: 500, met: true },
    { label: "300 Madera",        current: 1580, required: 300, met: true },
  ],
  2: [ // Bronce → Clásica
    { label: "Forja Nv.3+",       current: 1, required: 3, met: false },
    { label: "Cantera Nv.7+",     current: 5, required: 7, met: false },
    { label: "Granja Nv.5+",      current: 2, required: 5, met: false },
    { label: "100 Bronce",         current: 128, required: 100, met: true },
    { label: "1000 Piedra",        current: 3400, required: 1000, met: true },
    { label: "500 Comida",         current: 890, required: 500, met: true },
  ],
  3: [ // Clásica → Medieval
    { label: "Herrería Nv.3+",    current: 1, required: 3, met: false },
    { label: "Forja Nv.5+",       current: 1, required: 5, met: false },
    { label: "200 Hierro",         current: 35, required: 200, met: false },
    { label: "500 Bronce",         current: 128, required: 500, met: false },
    { label: "2000 Piedra",        current: 3400, required: 2000, met: true },
  ],
  4: [ // Medieval → Industrial
    { label: "Mina de Oro Nv.3+", current: 0, required: 3, met: false },
    { label: "Herrería Nv.5+",    current: 1, required: 5, met: false },
    { label: "100 Oro",            current: 8, required: 100, met: false },
    { label: "500 Hierro",         current: 35, required: 500, met: false },
    { label: "1000 Bronce",        current: 128, required: 1000, met: false },
  ],
  5: [ // Industrial → Robótica
    { label: "Extractor Nv.3+",   current: 0, required: 3, met: false },
    { label: "Mina de Oro Nv.5+", current: 0, required: 5, met: false },
    { label: "50 Cristal",         current: 0, required: 50, met: false },
    { label: "300 Oro",            current: 8, required: 300, met: false },
    { label: "1000 Hierro",        current: 35, required: 1000, met: false },
  ],
  6: [ // Robótica → Espacial
    { label: "Reactor Nv.3+",     current: 0, required: 3, met: false },
    { label: "Extractor Nv.5+",   current: 0, required: 5, met: false },
    { label: "20 Plasma",          current: 0, required: 20, met: false },
    { label: "200 Cristal",        current: 0, required: 200, met: false },
    { label: "500 Oro",            current: 8, required: 500, met: false },
  ],
  7: [ // Espacial → Singularidad
    { label: "Nexo Nv.3+",        current: 0, required: 3, met: false },
    { label: "Reactor Nv.5+",     current: 0, required: 5, met: false },
    { label: "10 Antimateria",     current: 0, required: 10, met: false },
    { label: "100 Plasma",         current: 0, required: 100, met: false },
    { label: "500 Cristal",        current: 0, required: 500, met: false },
    { label: "1000 Oro",           current: 8, required: 1000, met: false },
  ],
};

interface Structure {
  name: string;
  icon: string;
  level: number;
  rate: number;
  resourceSrc: string;
  resourceName: string;
  position: { x: string; y: string }; // position on planet view
}

interface PlanetInfo {
  name: string;
  cssClass: string;
  color: string;
  glow: string;
  eraIndex: number;
  description: string;
  image: string;
  resources: Record<string, { iconSrc: string; amount: number; rate: number }>;
  structures: Structure[];
  stats: { atk: number; def: number; pop: number | string; tech: number };
}

const PLANET_DATA: Record<string, PlanetInfo> = {
  "1": {
    name: "Porera", cssClass: "planet-porera", color: "hsl(120 60% 45%)", glow: "rgba(76,175,80,0.4)",
    eraIndex: 2, image: "planet-porera.png",
    description: "Mundo verde primordial en plena era de Bronce.",
    resources: {
      stone:    { iconSrc: RESOURCE_ICONS.stone,    amount: 3400,  rate: 9.92 },
      wood:     { iconSrc: RESOURCE_ICONS.wood,     amount: 1580,  rate: 4.14 },
      food:     { iconSrc: RESOURCE_ICONS.food,     amount: 890,   rate: 2.76 },
      bronze:   { iconSrc: RESOURCE_ICONS.bronze,   amount: 128,   rate: 0.46 },
      iron:     { iconSrc: RESOURCE_ICONS.iron,     amount: 35,    rate: 0.18 },
      gold:     { iconSrc: RESOURCE_ICONS.gold,     amount: 8,     rate: 0.05 },
      crystal:  { iconSrc: RESOURCE_ICONS.crystal,  amount: 0,     rate: 0 },
      plasma:   { iconSrc: RESOURCE_ICONS.plasma,   amount: 0,     rate: 0 },
      energy:   { iconSrc: RESOURCE_ICONS.energy,   amount: 45,    rate: 0 },
      diamonds: { iconSrc: RESOURCE_ICONS.diamonds, amount: 12,    rate: 0 },
    },
    structures: [
      { name: "Cantera",        icon: "⛏️", level: 5, rate: 9.92, resourceSrc: RESOURCE_ICONS.stone,   resourceName: "Piedra",   position: { x: "10%", y: "25%" } },
      { name: "Aserradero",     icon: "🪓", level: 3, rate: 4.14, resourceSrc: RESOURCE_ICONS.wood,    resourceName: "Madera",   position: { x: "40%", y: "20%" } },
      { name: "Granja",         icon: "🌾", level: 2, rate: 2.76, resourceSrc: RESOURCE_ICONS.food,    resourceName: "Comida",   position: { x: "70%", y: "25%" } },
      { name: "Forja de Bronce",icon: "🔥", level: 1, rate: 0.46, resourceSrc: RESOURCE_ICONS.bronze,  resourceName: "Bronce",   position: { x: "15%", y: "45%" } },
      { name: "Herrería",       icon: "⚒️", level: 1, rate: 0.18, resourceSrc: RESOURCE_ICONS.iron,    resourceName: "Hierro",   position: { x: "45%", y: "40%" } },
      { name: "Mina de Oro",    icon: "🪙", level: 0, rate: 0.05, resourceSrc: RESOURCE_ICONS.gold,    resourceName: "Oro",      position: { x: "75%", y: "45%" } },
      { name: "Extractor Cristal",icon:"💠", level: 0, rate: 0,   resourceSrc: RESOURCE_ICONS.crystal, resourceName: "Cristal",  position: { x: "25%", y: "65%" } },
      { name: "Reactor Plasma", icon: "🔮", level: 0, rate: 0,    resourceSrc: RESOURCE_ICONS.plasma,  resourceName: "Plasma",   position: { x: "55%", y: "60%" } },
      { name: "Nexo Cuántico",  icon: "🌀", level: 0, rate: 0,    resourceSrc: RESOURCE_ICONS.antimatter, resourceName: "Antimateria", position: { x: "85%", y: "65%" } },
    ],
    stats: { atk: 35, def: 20, pop: 1200, tech: 3 },
  },
  "2": {
    name: "Doresa", cssClass: "planet-doresa", color: "hsl(185 80% 45%)", glow: "rgba(0,188,212,0.4)",
    eraIndex: 5, image: "planet-doresa.png",
    description: "Mundo oceánico en era Industrial.",
    resources: {
      stone:    { iconSrc: RESOURCE_ICONS.stone,    amount: 22000, rate: 28.4 },
      wood:     { iconSrc: RESOURCE_ICONS.wood,     amount: 15800, rate: 18.1 },
      food:     { iconSrc: RESOURCE_ICONS.food,     amount: 7160,  rate: 12.4 },
      bronze:   { iconSrc: RESOURCE_ICONS.bronze,   amount: 2180,  rate: 6.2 },
      iron:     { iconSrc: RESOURCE_ICONS.iron,     amount: 980,   rate: 3.5 },
      gold:     { iconSrc: RESOURCE_ICONS.gold,     amount: 320,   rate: 1.2 },
      crystal:  { iconSrc: RESOURCE_ICONS.crystal,  amount: 85,    rate: 0.6 },
      plasma:   { iconSrc: RESOURCE_ICONS.plasma,   amount: 45,    rate: 0.3 },
      energy:   { iconSrc: RESOURCE_ICONS.energy,   amount: 890,   rate: 0 },
      diamonds: { iconSrc: RESOURCE_ICONS.diamonds, amount: 65,    rate: 0 },
    },
    structures: [
      { name: "Mina Sub",          icon: "⛏️", level: 6, rate: 28.4, resourceSrc: RESOURCE_ICONS.stone,   resourceName: "Piedra",   position: { x: "10%", y: "25%" } },
      { name: "Bosque Kelp",       icon: "🌿", level: 5, rate: 18.1, resourceSrc: RESOURCE_ICONS.wood,    resourceName: "Madera",   position: { x: "40%", y: "20%" } },
      { name: "Pescadería",        icon: "🐠", level: 4, rate: 12.4, resourceSrc: RESOURCE_ICONS.food,    resourceName: "Comida",   position: { x: "70%", y: "25%" } },
      { name: "Fundición",         icon: "🏭", level: 3, rate: 6.2,  resourceSrc: RESOURCE_ICONS.bronze,  resourceName: "Bronce",   position: { x: "15%", y: "45%" } },
      { name: "Acería Marina",     icon: "⚒️", level: 3, rate: 3.5,  resourceSrc: RESOURCE_ICONS.iron,    resourceName: "Hierro",   position: { x: "45%", y: "40%" } },
      { name: "Banco Dorado",      icon: "🪙", level: 2, rate: 1.2,  resourceSrc: RESOURCE_ICONS.gold,    resourceName: "Oro",      position: { x: "75%", y: "45%" } },
      { name: "Cueva de Cristal",  icon: "💠", level: 2, rate: 0.6,  resourceSrc: RESOURCE_ICONS.crystal, resourceName: "Cristal",  position: { x: "25%", y: "65%" } },
      { name: "Acelerador",        icon: "🔮", level: 1, rate: 0.3,  resourceSrc: RESOURCE_ICONS.plasma,  resourceName: "Plasma",   position: { x: "55%", y: "60%" } },
      { name: "Templo Coralino",   icon: "🏛️", level: 2, rate: 3.1,  resourceSrc: RESOURCE_ICONS.stone,   resourceName: "Piedra",   position: { x: "85%", y: "65%" } },
    ],
    stats: { atk: 85, def: 60, pop: 45000, tech: 6 },
  },
  "3": {
    name: "Aitherium", cssClass: "planet-aitherium", color: "hsl(265 85% 60%)", glow: "rgba(123,47,252,0.4)",
    eraIndex: 7, image: "planet-aitherium.png",
    description: "Núcleo de energía cósmica — bloqueado.",
    resources: {},
    structures: [],
    stats: { atk: 0, def: 0, pop: "???", tech: 0 },
  },
};

const TABS = ["Resumen","Recursos","Estructuras","Cartas","Lore"] as const;
type Tab = typeof TABS[number];

export default function PlanetDetail() {
  const [, params] = useRoute("/planet/:id");
  const id = params?.id ?? "1";
  const planet = PLANET_DATA[id] ?? PLANET_DATA["1"];
  const isLocked = id === "3";
  const eraProgress = (planet.eraIndex / 8) * 100;
  const totalRate = planet.structures.reduce((a, s) => a + s.rate, 0);
  const [tab, setTab] = useState<Tab>("Resumen");
  const [currentSkin, setCurrentSkin] = useState("default");
  const [viewMode, setViewMode] = useState<"orbit" | "surface">("orbit");

  // Floating production numbers animation
  const [floatingNums, setFloatingNums] = useState<{ id: number; x: string; y: string; amount: string; color: string }[]>([]);
  const floatIdRef = React.useRef(0);

  useEffect(() => {
    if (isLocked || planet.structures.length === 0) return;
    const interval = setInterval(() => {
      const struct = planet.structures[Math.floor(Math.random() * planet.structures.length)];
      const newFloat = {
        id: floatIdRef.current++,
        x: struct.position.x,
        y: struct.position.y,
        amount: `+${struct.rate.toFixed(1)}`,
        color: "text-green-400",
      };
      setFloatingNums(prev => [...prev.slice(-4), newFloat]);
      setTimeout(() => {
        setFloatingNums(prev => prev.filter(f => f.id !== newFloat.id));
      }, 2000);
    }, 1500);
    return () => clearInterval(interval);
  }, [isLocked, planet.structures]);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/" className="p-2 glass-panel rounded-xl text-muted-foreground hover:text-white transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-xl font-display uppercase" style={{ color: planet.color }}>{planet.name}</h1>
            <p className="text-[10px] text-muted-foreground">{ERAS[planet.eraIndex]} · {planet.description}</p>
          </div>
        </div>
        {!isLocked && (
          <div className="text-right">
            <div className="text-xs text-green-400 font-display font-bold">+{totalRate.toFixed(1)}/s</div>
            <div className="text-[8px] text-muted-foreground">producción</div>
          </div>
        )}
      </div>

      {/* ═══ PLANET VIEW — 3D Interactive Scene ═══ */}
      <div className="glass-panel rounded-3xl overflow-hidden relative">
        {/* View toggle */}
        {!isLocked && (
          <div className="absolute top-3 right-3 z-10 flex gap-1">
            <button onClick={() => setViewMode("orbit")}
              className={cn("px-2.5 py-1 rounded-lg text-[9px] font-display uppercase transition-all",
                viewMode === "orbit" ? "bg-primary/30 text-primary border border-primary/40" : "bg-black/40 text-white/50 border border-white/10 hover:text-white")}>
              Orbital
            </button>
            <button onClick={() => setViewMode("surface")}
              className={cn("px-2.5 py-1 rounded-lg text-[9px] font-display uppercase transition-all",
                viewMode === "surface" ? "bg-primary/30 text-primary border border-primary/40" : "bg-black/40 text-white/50 border border-white/10 hover:text-white")}>
              Superficie
            </button>
          </div>
        )}

        {!isLocked ? (
          <Suspense fallback={
            <div className="flex items-center justify-center aspect-[4/3]">
              <div className="text-muted-foreground text-sm animate-pulse">Cargando planeta 3D...</div>
            </div>
          }>
            {viewMode === "orbit" ? (
              <PlanetScene
                planetColor={planet.color}
                planetName={planet.name}
                totalRate={totalRate}
                className="aspect-[4/3]"
                currentSkinId={currentSkin}
                onSkinChange={setCurrentSkin}
                structures={planet.structures.map(s => ({
                  name: s.name,
                  level: s.level,
                  rate: s.rate,
                  resourceName: s.resourceName,
                  color: s.resourceSrc.includes("stone") ? "#8C8378" :
                         s.resourceSrc.includes("wood") ? "#A16B28" :
                         s.resourceSrc.includes("food") ? "#C0392B" :
                         s.resourceSrc.includes("bronze") ? "#CD7F32" :
                         s.resourceSrc.includes("energy") ? "#F1C40F" : "#3498db",
                  type: s.name.includes("Cantera") || s.name.includes("Mina") ? "quarry" as const :
                        s.name.includes("Aserradero") || s.name.includes("Bosque") ? "lumber" as const :
                        s.name.includes("Granja") || s.name.includes("Pescad") ? "farm" as const :
                        s.name.includes("Forja") || s.name.includes("Fundic") || s.name.includes("Herrería") || s.name.includes("Acería") ? "forge" as const :
                        s.name.includes("Reactor") || s.name.includes("Acelerador") || s.name.includes("Extractor") ? "generator" as const :
                        s.name.includes("Nexo") || s.name.includes("Cueva") || s.name.includes("Banco") ? "quarry" as const : "temple" as const,
                }))}
              />
            ) : (
              <PlanetSurface
                planetColor={planet.color}
                className="aspect-[4/3]"
                currentSkinId={currentSkin}
                onSkinChange={setCurrentSkin}
                structures={planet.structures.map(s => ({
                  name: s.name,
                  level: s.level,
                  rate: s.rate,
                  resourceName: s.resourceName,
                  color: s.resourceSrc.includes("stone") ? "#8C8378" :
                         s.resourceSrc.includes("wood") ? "#A16B28" :
                         s.resourceSrc.includes("food") ? "#C0392B" :
                         s.resourceSrc.includes("bronze") ? "#CD7F32" :
                         s.resourceSrc.includes("energy") ? "#F1C40F" : "#3498db",
                  type: s.name.includes("Cantera") || s.name.includes("Mina") ? "quarry" as const :
                        s.name.includes("Aserradero") || s.name.includes("Bosque") ? "lumber" as const :
                        s.name.includes("Granja") || s.name.includes("Pescad") ? "farm" as const :
                        s.name.includes("Forja") || s.name.includes("Fundic") || s.name.includes("Herrería") || s.name.includes("Acería") ? "forge" as const :
                        s.name.includes("Reactor") || s.name.includes("Acelerador") || s.name.includes("Extractor") ? "generator" as const :
                        s.name.includes("Nexo") || s.name.includes("Cueva") || s.name.includes("Banco") ? "quarry" as const : "temple" as const,
                }))}
              />
            )}
          </Suspense>
        ) : (
          <div className="flex flex-col items-center justify-center aspect-[4/3]">
            <span className="text-5xl mb-3">🔒</span>
            <p className="text-muted-foreground text-sm">Planeta bloqueado</p>
          </div>
        )}

        {/* Era progress bar */}
        {!isLocked && (
          <div className="px-6 pb-3">
            <div className="flex justify-between text-[9px] text-muted-foreground mb-1">
              <span>{ERAS[planet.eraIndex]}</span>
              <span>{ERAS[planet.eraIndex + 1] ?? "MAX"}</span>
            </div>
            <Progress value={eraProgress} className="h-2"
              indicatorClassName="bg-gradient-to-r from-primary to-secondary" />
            <div className="text-[9px] text-muted-foreground text-center mt-1">{Math.round(eraProgress)}% completada</div>
          </div>
        )}

        {/* Quick stats bar */}
        {!isLocked && (
          <div className="flex divide-x divide-white/10 border-t border-white/10">
            {[
              { icon: NAV_ICONS.combat, val: planet.stats.atk, label: "ATK" },
              { icon: NAV_ICONS.equipment, val: planet.stats.def, label: "DEF" },
              { icon: NAV_ICONS.clan, val: typeof planet.stats.pop === 'number' ? planet.stats.pop.toLocaleString() : planet.stats.pop, label: "Pobl." },
              { icon: NAV_ICONS.settings, val: `Nv.${planet.stats.tech}`, label: "Tec." },
            ].map(s => (
              <div key={s.label} className="flex-1 flex flex-col items-center py-2.5">
                <img src={s.icon} alt={s.label} className="w-5 h-5 mb-0.5 opacity-60" />
                <span className="font-display text-xs text-white">{s.val}</span>
                <span className="text-[8px] text-muted-foreground">{s.label}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ═══ TABS — Resumen / Recursos / Estructuras / Cartas / Lore ═══ */}
      {!isLocked && (<>
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
          <motion.div key={tab} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }}>

            {tab === "Resumen" && (
              <div className="space-y-3">
                <div className="glass-panel rounded-2xl p-4">
                  <p className="text-sm text-muted-foreground">{planet.description}</p>
                </div>
                <div className="glass-panel rounded-2xl p-4">
                  <div className="font-display text-xs text-white/70 uppercase mb-3">Línea del Tiempo</div>
                  <div className="flex gap-1 flex-wrap">
                    {ERAS.map((era, i) => (
                      <div key={era} className={cn(
                        "px-2 py-1 rounded-lg text-[9px] font-display border",
                        i < planet.eraIndex ? "bg-primary/20 border-primary/30 text-primary" :
                        i === planet.eraIndex ? "bg-accent/20 border-accent/50 text-accent" :
                        "bg-white/5 border-white/10 text-white/30"
                      )}>{era}</div>
                    ))}
                  </div>
                </div>
                <div className="glass-panel rounded-2xl p-4 flex items-center justify-between">
                  <span className="font-display text-sm text-white uppercase">Producción Total</span>
                  <span className="font-display text-lg text-green-400">+{totalRate.toFixed(1)}/s</span>
                </div>
                {/* Era requirements */}
                {ERA_REQUIREMENTS[planet.eraIndex] && (() => {
                  const reqs = ERA_REQUIREMENTS[planet.eraIndex];
                  const metCount = reqs.filter(r => r.met).length;
                  const allMet = metCount === reqs.length;
                  return (
                    <div className="glass-panel rounded-2xl p-4">
                      <div className="flex items-center justify-between mb-3">
                        <span className="font-display text-xs text-white uppercase">Requisitos para Avanzar</span>
                        <span className={cn("text-[10px] px-2 py-0.5 rounded-lg font-display",
                          allMet ? "bg-green-500/20 text-green-400" : "bg-white/10 text-white/50"
                        )}>{metCount}/{reqs.length} completados</span>
                      </div>
                      <div className="space-y-2">
                        {reqs.map((req, i) => (
                          <div key={i} className={cn(
                            "flex items-center gap-2.5 px-3 py-2 rounded-xl border",
                            req.met ? "bg-green-500/10 border-green-500/30" : "bg-red-500/10 border-red-500/20"
                          )}>
                            <div className={cn("w-5 h-5 rounded-full flex items-center justify-center text-[10px] shrink-0",
                              req.met ? "bg-green-500/30 text-green-400" : "bg-red-500/20 text-red-400"
                            )}>{req.met ? "✓" : "✕"}</div>
                            <span className={cn("text-xs font-display flex-1", req.met ? "text-green-300" : "text-white")}>
                              {req.label}
                            </span>
                            <span className={cn("text-[10px]", req.met ? "text-green-400/60" : "text-red-400/80")}>
                              ({req.current >= req.required ? "listo" : `${req.current}/${req.required}`})
                            </span>
                          </div>
                        ))}
                      </div>
                      {!allMet && (
                        <div className="mt-3">
                          <Progress value={(metCount / reqs.length) * 100} className="h-1.5"
                            indicatorClassName="bg-gradient-to-r from-accent to-primary" />
                          <p className="text-[9px] text-muted-foreground text-center mt-1.5">
                            Completa todos los requisitos para avanzar a {ERAS[planet.eraIndex + 1]}
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })()}

                <button disabled={!ERA_REQUIREMENTS[planet.eraIndex]?.every(r => r.met)}
                  className={cn(
                    "w-full py-3 rounded-2xl font-display text-sm uppercase tracking-wider transition-all",
                    ERA_REQUIREMENTS[planet.eraIndex]?.every(r => r.met)
                      ? "bg-gradient-to-r from-accent to-secondary text-white shadow-[0_0_20px_rgba(255,170,0,0.4)]"
                      : "bg-white/5 text-white/30 cursor-not-allowed"
                  )}>
                  {ERA_REQUIREMENTS[planet.eraIndex]?.every(r => r.met)
                    ? `✨ Avanzar a: ${ERAS[planet.eraIndex + 1] ?? "MAX"}`
                    : `Avanzar de Era (${ERA_REQUIREMENTS[planet.eraIndex] ? Math.round((ERA_REQUIREMENTS[planet.eraIndex].filter(r=>r.met).length / ERA_REQUIREMENTS[planet.eraIndex].length)*100) : 0}%)`}
                </button>
              </div>
            )}

            {tab === "Recursos" && (
              <div className="space-y-3">
                {Object.entries(planet.resources).map(([key, res]) => (
                  <div key={key} className="glass-panel rounded-2xl p-4 flex items-center gap-4">
                    <img src={res.iconSrc} alt={key} className="w-8 h-8" />
                    <div className="flex-1">
                      <div className="flex justify-between mb-1">
                        <span className="font-display text-sm text-white capitalize">{key}</span>
                        <span className="text-green-400 font-bold text-sm">+{res.rate}/s</span>
                      </div>
                      <div className="text-xs text-muted-foreground">Almacenado: {res.amount.toLocaleString()}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {tab === "Estructuras" && (
              <div className="space-y-3">
                <div className="flex justify-end">
                  <Link href="/structures" className="text-xs text-primary font-display">+ Construir nueva →</Link>
                </div>
                {planet.structures.map(s => (
                  <div key={s.name} className="glass-panel rounded-2xl p-4 flex items-center gap-3">
                    <span className="text-2xl">{s.icon}</span>
                    <div className="flex-1">
                      <div className="flex justify-between items-center">
                        <span className="font-display text-sm text-white">{s.name}</span>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-primary/20 text-primary font-display">Nv.{s.level}</span>
                      </div>
                      <div className="text-xs text-green-400 mt-0.5 flex items-center gap-1">
                        <img src={s.resourceSrc} alt="" className="w-3 h-3 inline" /> +{s.rate}/s {s.resourceName}
                      </div>
                      <Progress value={(s.level / 10) * 100} className="h-1 mt-1.5"
                        indicatorClassName="bg-gradient-to-r from-primary to-secondary" />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {tab === "Cartas" && (
              <div className="glass-panel rounded-2xl p-4 text-center">
                <p className="text-sm text-muted-foreground mb-3">Colecciona cartas explorando y combatiendo</p>
                <Link href="/collection"
                  className="inline-block px-4 py-2 rounded-xl bg-primary/20 border border-primary/40 text-primary font-display text-sm hover:bg-primary/30 transition-colors">
                  Ver Álbum →
                </Link>
              </div>
            )}

            {tab === "Lore" && (
              <div className="glass-panel rounded-2xl p-5">
                <span className="font-display text-sm text-white uppercase">Historia de {planet.name}</span>
                <p className="text-sm text-muted-foreground leading-relaxed mt-2">
                  {planet.name === "Porera"
                    ? "Porera nació de una nube de gas y polvo hace 4.2 billones de años. Sus bosques primordiales albergan criaturas extintas en otros mundos. Los Foreños — sus habitantes — descubrieron el fuego hace 3 eras y construyeron las primeras estructuras de piedra."
                    : planet.name === "Doresa"
                    ? "Doresa es un mundo acuático con continentes flotantes. Sus habitantes — los Doreanos — construyeron civilizaciones submarinas únicas. La era Industrial trajo mega-fábricas de extracción marina."
                    : "Aitherium no es un planeta convencional: es un núcleo de energía oscura comprimida."}
                </p>
              </div>
            )}

          </motion.div>
        </AnimatePresence>
      </>)}

      {/* Locked message */}
      {isLocked && (
        <div className="glass-panel rounded-2xl p-6 text-center">
          <span className="text-4xl block mb-3">🔒</span>
          <h2 className="font-display text-lg text-white mb-2">Planeta Bloqueado</h2>
          <p className="text-sm text-muted-foreground">Completa la Era 9 en Doresa para desbloquear Aitherium</p>
        </div>
      )}
    </div>
  );
}
