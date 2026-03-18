import React, { useState } from "react";
import { Link, useLocation } from "wouter";
import { motion } from "framer-motion";
import { Star, Activity, ShieldAlert, Globe, Zap } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

const ERAS = ["Piedra","Tribal","Bronce","Clásica","Medieval","Industrial","Robótica","Espacial","Singularidad"];

const PLANETS = [
  {
    id: 1, name: "Porera", slug: "porera",
    eraIndex: 2, totalEras: 9, isUnlocked: true,
    description: "Mundo verde primordial — eras primitivas del origen.",
    image: "planet-porera.png", cssClass: "planet-porera",
    color: "hsl(120 60% 45%)", glowColor: "rgba(76,175,80,0.35)",
    activeStructures: 6, productionPerSec: 6.1,
    resources: { stone: 150, wood: 80, food: 45, bronze: 12 },
  },
  {
    id: 2, name: "Doresa", slug: "doresa",
    eraIndex: 5, totalEras: 9, isUnlocked: true,
    description: "Mundo oceánico — avanzando hacia la era tecnológica.",
    image: "planet-doresa.png", cssClass: "planet-doresa",
    color: "hsl(185 80% 45%)", glowColor: "rgba(0,188,212,0.35)",
    activeStructures: 14, productionPerSec: 18.4,
    resources: { stone: 3200, wood: 2100, food: 980, bronze: 340 },
  },
  {
    id: 3, name: "Aitherium", slug: "aitherium",
    eraIndex: 7, totalEras: 9, isUnlocked: false,
    description: "Núcleo de energía cósmica — umbral de la Singularidad.",
    image: "planet-aitherium.png", cssClass: "planet-aitherium",
    color: "hsl(265 85% 60%)", glowColor: "rgba(123,47,252,0.4)",
    activeStructures: 0, productionPerSec: 0,
    resources: {},
  },
];

const STRUCTURES_SUMMARY = [
  { name: "Cantera", resourceIcon: "🪨", rate: 9.92, level: 3 },
  { name: "Aserradero", resourceIcon: "🪵", rate: 4.14, level: 2 },
  { name: "Granja", resourceIcon: "🍖", rate: 2.76, level: 2 },
];

export default function Home() {
  const [selected, setSelected] = useState(0);
  const [, navigate] = useLocation();
  const planet = PLANETS[selected];
  const progress = (planet.eraIndex / (planet.totalEras - 1)) * 100;
  const totalPower = PLANETS.filter(p => p.isUnlocked).reduce((a, p) => a + p.eraIndex * 100, 0);

  return (
    <div className="space-y-6">
      {/* Hero Stats */}
      <section className="glass-panel p-5 rounded-3xl relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 bg-primary/10 rounded-full blur-3xl" />
        <div className="relative z-10 flex items-center gap-6">
          <div className="flex flex-col items-center">
            <Star className="w-5 h-5 text-accent mb-1" fill="currentColor" />
            <span className="text-3xl font-display text-white">{totalPower}</span>
            <span className="text-[10px] text-muted-foreground uppercase font-display">Poder Total</span>
          </div>
          <div className="w-px h-12 bg-white/10" />
          <div className="flex flex-col items-center">
            <Activity className="w-5 h-5 text-secondary mb-1" />
            <span className="text-3xl font-display text-white">{PLANETS.filter(p => p.isUnlocked).length}/3</span>
            <span className="text-[10px] text-muted-foreground uppercase font-display">Planetas</span>
          </div>
          <div className="w-px h-12 bg-white/10" />
          <div className="flex flex-col items-center">
            <Zap className="w-5 h-5 text-primary mb-1" />
            <span className="text-3xl font-display text-white">24.5</span>
            <span className="text-[10px] text-muted-foreground uppercase font-display">Total/s</span>
          </div>
        </div>
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
                  onClick={() => p.isUnlocked && setSelected(idx)}
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
                            {ERAS[p.eraIndex]} → {ERAS[p.eraIndex + 1] ?? "Singularidad"}
                          </div>
                          <div className="space-y-1">
                            <div className="flex justify-between text-[10px] uppercase tracking-wider text-muted-foreground">
                              <span>Evolución</span>
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
                Ver →
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
                Ver todas →
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

          <button disabled={progress < 100}
            className={cn(
              "w-full py-3 rounded-2xl font-display text-sm uppercase tracking-wider transition-all",
              progress >= 100
                ? "bg-gradient-to-r from-accent to-secondary text-white shadow-[0_0_20px_rgba(255,170,0,0.4)]"
                : "bg-white/5 text-white/30 cursor-not-allowed"
            )}>
            {progress >= 100 ? "✨ Avanzar de Era" : `Avanzar de Era (${Math.round(progress)}%)`}
          </button>
        </motion.section>
      )}
    </div>
  );
}
