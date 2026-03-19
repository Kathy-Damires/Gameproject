import React, { useState } from "react";
import { Link, useLocation } from "wouter";
import { motion } from "framer-motion";
import { Star, Activity, ShieldAlert, Globe, Zap, Swords, Building2, Check, X } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

const ERAS = ["Piedra","Tribal","Bronce","Clasica","Medieval","Industrial","Robotica","Espacial","Singularidad"];

const PLANETS = [
  {
    id: 1, name: "Porera", slug: "porera",
    eraIndex: 2, totalEras: 9, isUnlocked: true,
    description: "Mundo verde primordial — eras primitivas del origen.",
    image: "planet-porera.png", cssClass: "planet-porera",
    color: "hsl(120 60% 45%)", glowColor: "rgba(76,175,80,0.35)",
    activeStructures: 6, productionPerSec: 6.1,
    resources: { stone: 650, wood: 120, food: 45, bronze: 12 },
  },
  {
    id: 2, name: "Doresa", slug: "doresa",
    eraIndex: 5, totalEras: 9, isUnlocked: true,
    description: "Mundo oceanico — avanzando hacia la era tecnologica.",
    image: "planet-doresa.png", cssClass: "planet-doresa",
    color: "hsl(185 80% 45%)", glowColor: "rgba(0,188,212,0.35)",
    activeStructures: 14, productionPerSec: 18.4,
    resources: { stone: 3200, wood: 2100, food: 980, bronze: 340 },
  },
  {
    id: 3, name: "Aitherium", slug: "aitherium",
    eraIndex: 7, totalEras: 9, isUnlocked: false,
    description: "Nucleo de energia cosmica — umbral de la Singularidad.",
    image: "planet-aitherium.png", cssClass: "planet-aitherium",
    color: "hsl(265 85% 60%)", glowColor: "rgba(123,47,252,0.4)",
    activeStructures: 0, productionPerSec: 0,
    resources: {},
  },
];

const STRUCTURES_SUMMARY = [
  { name: "Cantera", resourceIcon: "🪨", rate: 9.92, level: 5 },
  { name: "Aserradero", resourceIcon: "🪵", rate: 4.14, level: 3 },
  { name: "Granja", resourceIcon: "🍖", rate: 2.76, level: 2 },
];

/* Era advancement requirements per planet */
function getEraRequirements(planet: typeof PLANETS[number], structures: typeof STRUCTURES_SUMMARY) {
  const reqs: Array<{
    label: string;
    met: boolean;
    actual: string;
    required: string;
  }> = [];

  // Structure level requirements
  const structureReqs: Record<string, number> = {
    "Cantera": 5,
    "Aserradero": 5,
    "Granja": 5,
  };

  for (const [name, reqLevel] of Object.entries(structureReqs)) {
    const struct = structures.find(s => s.name === name);
    const actualLevel = struct?.level ?? 0;
    reqs.push({
      label: `${name} Nv.${reqLevel}+`,
      met: actualLevel >= reqLevel,
      actual: `Nv.${actualLevel}`,
      required: `Nv.${reqLevel}`,
    });
  }

  // Resource requirements
  const resourceReqs: Array<{ key: string; icon: string; name: string; amount: number }> = [
    { key: "stone", icon: "🪨", name: "Piedra", amount: 500 },
    { key: "wood", icon: "🪵", name: "Madera", amount: 300 },
  ];

  for (const res of resourceReqs) {
    const actual = (planet.resources as Record<string, number>)[res.key] ?? 0;
    reqs.push({
      label: `${res.amount} ${res.name}`,
      met: actual >= res.amount,
      actual: `tienes: ${actual}`,
      required: `${res.amount}`,
    });
  }

  return reqs;
}

export default function Home() {
  const [selected, setSelected] = useState(0);
  const [, navigate] = useLocation();
  const planet = PLANETS[selected];
  const progress = (planet.eraIndex / (planet.totalEras - 1)) * 100;
  const totalPower = PLANETS.filter(p => p.isUnlocked).reduce((a, p) => a + p.eraIndex * 100, 0);

  const eraReqs = planet.isUnlocked ? getEraRequirements(planet, STRUCTURES_SUMMARY) : [];
  const metCount = eraReqs.filter(r => r.met).length;
  const allMet = metCount === eraReqs.length;


  return (
    <div className="space-y-6">
      {/* Hero Stats */}
      <section className="glass-panel p-4 rounded-3xl relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 bg-primary/10 rounded-full blur-3xl" />
        <div className="relative z-10 flex items-center gap-6 justify-center">
            <div className="flex flex-col items-center">
              <Star className="w-4 h-4 text-accent mb-0.5" fill="currentColor" />
              <span className="text-2xl font-display text-white">{totalPower}</span>
              <span className="text-[9px] text-muted-foreground uppercase font-display">Poder</span>
            </div>
            <div className="w-px h-10 bg-white/10" />
            <div className="flex flex-col items-center">
              <Activity className="w-4 h-4 text-secondary mb-0.5" />
              <span className="text-2xl font-display text-white">{PLANETS.filter(p => p.isUnlocked).length}/3</span>
              <span className="text-[9px] text-muted-foreground uppercase font-display">Planetas</span>
            </div>
            <div className="w-px h-10 bg-white/10" />
            <div className="flex flex-col items-center">
              <Zap className="w-4 h-4 text-primary mb-0.5" />
              <span className="text-2xl font-display text-white">24.5</span>
              <span className="text-[9px] text-muted-foreground uppercase font-display">Total/s</span>
            </div>
        </div>
      </section>

      {/* Quick access: Combate + Estructuras */}
      <section className="grid grid-cols-2 gap-2">
        <Link href="/character">
          <motion.div whileTap={{ scale:0.96 }}
            className="glass-panel p-3 rounded-2xl flex items-center gap-2.5 border border-red-500/20 hover:border-red-500/40 transition-all cursor-pointer">
            <div className="w-10 h-10 rounded-xl bg-red-500/20 flex items-center justify-center shrink-0">
              <Swords className="w-5 h-5 text-red-400" />
            </div>
            <div>
              <div className="text-xs font-display text-white">Combate</div>
              <div className="text-[10px] text-red-400 font-bold">3 enemigos</div>
              <div className="text-[9px] text-muted-foreground">⚡28/30</div>
            </div>
          </motion.div>
        </Link>
        <Link href="/structures">
          <motion.div whileTap={{ scale:0.96 }}
            className="glass-panel p-3 rounded-2xl flex items-center gap-2.5 border border-amber-500/20 hover:border-amber-500/40 transition-all cursor-pointer">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center shrink-0">
              <Building2 className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <div className="text-xs font-display text-white">Estructuras</div>
              <div className="text-[10px] text-green-400 font-bold">+24.5/s</div>
              <div className="text-[9px] text-muted-foreground">6 activas</div>
            </div>
          </motion.div>
        </Link>
      </section>

      {/* Planet section */}
      <section className="space-y-4">
        <h2 className="text-xl font-display flex items-center gap-2 uppercase">
          <Globe className="w-5 h-5 text-primary" /> Tus Planetas
        </h2>

        <div className="grid gap-4">
          {PLANETS.map((p, idx) => {
            const pProgress = (p.eraIndex / (p.totalEras - 1)) * 100;
            return (
              <motion.div key={p.id}
                initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}>
                <div
                  onClick={() => {
                    if (p.isUnlocked) {
                      setSelected(idx);
                      navigate(`/planet/${p.id}`);
                    }
                  }}
                  className={cn(
                    "relative rounded-3xl p-4 transition-all duration-300 border-2 overflow-hidden group",
                    selected === idx && p.isUnlocked
                      ? "border-white/30 ring-2 ring-primary/30"
                      : p.isUnlocked
                        ? "bg-card border-card-border hover:border-white/20 cursor-pointer"
                        : "bg-card/50 border-card-border/30 opacity-60 grayscale cursor-not-allowed"
                  )}
                  style={{ background: selected === idx && p.isUnlocked ? `linear-gradient(135deg, hsl(260 40% 14%), hsl(260 40% 12%))` : undefined }}
                >
                  {p.isUnlocked && (
                    <div className="absolute inset-0 opacity-8 group-hover:opacity-15 transition-opacity"
                      style={{ backgroundColor: p.color }} />
                  )}
                  {selected === idx && p.isUnlocked && (
                    <div className="absolute inset-0 opacity-10"
                      style={{ background: `radial-gradient(ellipse at 30% 50%, ${p.glowColor}, transparent 70%)` }} />
                  )}

                  <div className="relative z-10 flex items-center gap-4">
                    {/* Planet avatar */}
                    <div className="w-20 h-20 shrink-0 relative drop-shadow-[0_0_15px_rgba(0,0,0,0.5)]">
                      {p.isUnlocked ? (
                        <img src={`${import.meta.env.BASE_URL}images/${p.image}`} alt={p.name}
                          className="w-full h-full object-contain animate-[spin_60s_linear_infinite]" />
                      ) : (
                        <div className="w-full h-full rounded-full bg-black/50 border-2 border-dashed border-white/20 flex items-center justify-center">
                          <ShieldAlert className="w-8 h-8 text-white/30" />
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-1">
                        <h3 className="text-xl font-display text-white">{p.name}</h3>
                        {p.isUnlocked && (
                          <span className="text-xs font-bold px-2 py-1 rounded-md bg-black/50 border border-white/10"
                            style={{ color: p.color }}>
                            Era {p.eraIndex + 1}/{p.totalEras}
                          </span>
                        )}
                      </div>

                      {p.isUnlocked ? (
                        <>
                          <p className="text-xs text-muted-foreground mb-1 line-clamp-1">{p.description}</p>
                          <div className="text-[10px] text-green-400 mb-2 font-bold">
                            {ERAS[p.eraIndex]} &rarr; {ERAS[p.eraIndex + 1] ?? "Singularidad"}
                          </div>
                          <div className="space-y-1">
                            <div className="flex justify-between text-[10px] uppercase tracking-wider text-muted-foreground">
                              <span>Evolucion</span>
                              <span>{Math.round(pProgress)}%</span>
                            </div>
                            <Progress value={pProgress}
                              indicatorClassName="bg-gradient-to-r from-primary to-secondary" />
                          </div>
                        </>
                      ) : (
                        <div className="mt-2 text-sm text-muted-foreground font-display flex items-center gap-2">
                          🔒 Bloqueado
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Selected planet detail */}
      {planet.isUnlocked && (
        <motion.section key={selected} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          className="glass-panel p-5 rounded-3xl space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-display text-lg uppercase" style={{ color: planet.color }}>
              {planet.name} — {ERAS[planet.eraIndex]}
            </h3>
            <div className="flex items-center gap-2">
              <span className="text-xs text-green-400 font-bold">+{planet.productionPerSec}/s</span>
              <Link href={`/planet/${planet.id}`}
                className="text-[10px] px-2 py-1 rounded-lg bg-white/10 border border-white/20 text-white hover:bg-white/20 transition-colors font-display">
                Ver &rarr;
              </Link>
            </div>
          </div>

          {/* Era progress */}
          <div>
            <div className="flex gap-1 flex-wrap mb-2">
              {ERAS.map((era, i) => (
                <div key={era} className={cn(
                  "px-1.5 py-0.5 rounded text-[9px] font-display transition-all",
                  i < planet.eraIndex ? "bg-primary/20 text-primary" :
                  i === planet.eraIndex ? "bg-accent/20 text-accent border border-accent/40" :
                  "bg-white/5 text-white/30"
                )}>{era}</div>
              ))}
            </div>
            <div className="space-y-1">
              <div className="flex justify-between text-[10px] text-muted-foreground">
                <span>Progreso de Era</span><span>{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} indicatorClassName="bg-gradient-to-r from-accent to-primary" />
            </div>
          </div>

          {/* Active structures */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-display text-white/70 uppercase">Estructuras Activas</span>
              <Link href="/structures"
                className="text-[10px] text-primary hover:text-primary/80 font-display">
                Ver todas &rarr;
              </Link>
            </div>
            <div className="space-y-1.5">
              {STRUCTURES_SUMMARY.map(s => (
                <div key={s.name} className="flex items-center justify-between bg-black/20 rounded-xl px-3 py-2">
                  <div className="flex items-center gap-2">
                    <span>{s.resourceIcon}</span>
                    <span className="text-xs text-white font-bold">{s.name}</span>
                    <span className="text-[9px] px-1.5 rounded bg-white/10 text-white/50 font-display">Nv.{s.level}</span>
                  </div>
                  <span className="text-xs text-green-400 font-bold">+{s.rate}/s</span>
                </div>
              ))}
            </div>
          </div>

          {/* Era Advancement Requirements */}
          <div className="glass-panel rounded-2xl p-4 border border-accent/20"
            style={{ background: "linear-gradient(135deg, rgba(255,170,0,0.03), rgba(255,170,0,0.08))" }}>
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-display text-sm text-white uppercase">Requisitos para avanzar</h4>
              <span className={cn(
                "text-[10px] font-display px-2 py-0.5 rounded-full",
                allMet
                  ? "bg-green-500/20 text-green-400 border border-green-500/30"
                  : "bg-white/10 text-muted-foreground border border-white/10"
              )}>
                {metCount}/{eraReqs.length} completados
              </span>
            </div>

            <div className="space-y-2">
              {eraReqs.map((req, i) => (
                <motion.div key={i}
                  initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className={cn(
                    "flex items-center justify-between rounded-xl px-3 py-2.5 border transition-all",
                    req.met
                      ? "bg-green-500/10 border-green-500/20"
                      : "bg-red-500/5 border-red-500/15"
                  )}>
                  <div className="flex items-center gap-2.5">
                    <div className={cn(
                      "w-5 h-5 rounded-full flex items-center justify-center shrink-0",
                      req.met ? "bg-green-500/30" : "bg-red-500/20"
                    )}>
                      {req.met
                        ? <Check className="w-3 h-3 text-green-400" />
                        : <X className="w-3 h-3 text-red-400" />
                      }
                    </div>
                    <span className={cn(
                      "text-xs font-display",
                      req.met ? "text-green-300" : "text-red-300"
                    )}>
                      {req.label}
                    </span>
                  </div>
                  <span className={cn(
                    "text-[10px] font-display",
                    req.met ? "text-green-400/70" : "text-red-400/70"
                  )}>
                    (actual: {req.actual})
                  </span>
                </motion.div>
              ))}
            </div>

            {!allMet && (
              <div className="mt-3 text-center">
                <div className="w-full bg-white/5 rounded-full h-1.5 mb-2">
                  <div className="h-full rounded-full bg-gradient-to-r from-accent to-secondary transition-all"
                    style={{ width: `${(metCount / eraReqs.length) * 100}%` }} />
                </div>
                <span className="text-[9px] text-muted-foreground">
                  Completa todos los requisitos para desbloquear el avance de era
                </span>
              </div>
            )}
          </div>

          <button disabled={!allMet}
            className={cn(
              "w-full py-3 rounded-2xl font-display text-sm uppercase tracking-wider transition-all",
              allMet
                ? "bg-gradient-to-r from-accent to-secondary text-white shadow-[0_0_20px_rgba(255,170,0,0.4)]"
                : "bg-white/5 text-white/30 cursor-not-allowed"
            )}>
            {allMet ? "Avanzar de Era" : `Avanzar de Era (${metCount}/${eraReqs.length} requisitos)`}
          </button>
        </motion.section>
      )}
    </div>
  );
}

