import React, { useState } from "react";
import { motion } from "framer-motion";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { Hammer, ArrowUp, Lock } from "lucide-react";

interface Structure {
  id: string; name: string; icon: string;
  resource: string; resourceIcon: string; baseRate: number;
  level: number; maxLevel: number; isBuilt: boolean;
  era: string; eraIndex: number; color: string;
  buildCost: Partial<Record<string,number>>;
}

const STRUCTURES: Structure[] = [
  { id:"quarry",    name:"Cantera",      icon:"⛏️", resource:"Piedra",    resourceIcon:"🪨", baseRate:2.5, level:3, maxLevel:10, isBuilt:true,  era:"Piedra",  eraIndex:0, color:"hsl(210 20% 60%)", buildCost:{ wood:20, food:10 } },
  { id:"sawmill",   name:"Aserradero",   icon:"🪚", resource:"Madera",    resourceIcon:"🪵", baseRate:1.8, level:2, maxLevel:10, isBuilt:true,  era:"Piedra",  eraIndex:0, color:"hsl(100 60% 45%)", buildCost:{ stone:30, food:15 } },
  { id:"farm",      name:"Granja",       icon:"🌾", resource:"Comida",    resourceIcon:"🍖", baseRate:1.2, level:2, maxLevel:10, isBuilt:true,  era:"Tribal",  eraIndex:1, color:"hsl(35 90% 55%)",  buildCost:{ stone:20, wood:20 } },
  { id:"forge",     name:"Forja",        icon:"🔥", resource:"Bronce",    resourceIcon:"🥉", baseRate:0.4, level:1, maxLevel:10, isBuilt:true,  era:"Bronce",  eraIndex:2, color:"hsl(30 60% 45%)",  buildCost:{ stone:50, wood:30, food:20 } },
  { id:"generator", name:"Generador",    icon:"⚡", resource:"Energía",   resourceIcon:"⚡", baseRate:0.8, level:0, maxLevel:10, isBuilt:false, era:"Bronce",  eraIndex:2, color:"hsl(55 100% 55%)", buildCost:{ stone:80, bronze:20 } },
  { id:"mine",      name:"Mina de Gemas",icon:"💎", resource:"Diamantes", resourceIcon:"💎", baseRate:0.02,level:0, maxLevel:5,  isBuilt:false, era:"Clásica", eraIndex:3, color:"hsl(193 100% 50%)",buildCost:{ bronze:50, energy:10 } },
];

const AVAILABLE: Record<string,number> = { stone:150, wood:80, food:45, bronze:12, energy:30 };

function calcRate(s: Structure) {
  if (!s.isBuilt || s.level === 0) return 0;
  return s.baseRate * s.level * Math.pow(1.15, s.level - 1);
}
function upgradeCost(s: Structure) {
  const m = Math.pow(1.5, s.level);
  return Object.fromEntries(Object.entries(s.buildCost).map(([k,v]) => [k, Math.floor((v as number)*m)]));
}
function canAfford(cost: Record<string,number>) {
  return Object.entries(cost).every(([k,v]) => (AVAILABLE[k] ?? 0) >= v);
}

export default function Structures() {
  const [structures, setStructures] = useState(STRUCTURES);
  const currentEra = 2;
  const totalProd = structures.reduce((a, s) => a + calcRate(s), 0);

  const handleBuild = (id: string) =>
    setStructures(prev => prev.map(s => s.id===id ? {...s, isBuilt:true, level:1} : s));
  const handleUpgrade = (id: string) =>
    setStructures(prev => prev.map(s => s.id===id && s.level<s.maxLevel ? {...s, level:s.level+1} : s));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass-panel p-4 rounded-3xl flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display uppercase flex items-center gap-2">
            <Hammer className="w-6 h-6 text-primary" /> Estructuras
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">Porera — Era de Bronce</p>
        </div>
        <div className="text-right">
          <div className="text-xl font-display text-green-400">+{totalProd.toFixed(1)}/s</div>
          <div className="text-[10px] text-muted-foreground">Producción Total</div>
        </div>
      </div>

      {/* Tools row */}
      <div>
        <p className="text-[10px] text-muted-foreground font-display uppercase mb-2">🔧 Herramientas Asignadas</p>
        <div className="flex gap-2">
          {["🪓 Hacha Nv.2", "⛏️ Pico Nv.1", "🌿 Hoz Nv.3"].map(t => (
            <div key={t} className="glass-panel px-3 py-1.5 rounded-xl text-xs text-muted-foreground">{t}</div>
          ))}
        </div>
      </div>

      {/* Structure cards */}
      <div className="space-y-3">
        {structures.map((s, i) => {
          const rate = calcRate(s);
          const uCost = upgradeCost(s);
          const cost = s.isBuilt ? uCost : s.buildCost;
          const affordable = canAfford(cost as Record<string,number>);
          const locked = s.eraIndex > currentEra;

          return (
            <motion.div key={s.id}
              initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }}
              transition={{ delay: i*0.06 }}
              className={cn("glass-panel rounded-2xl p-4", locked && "opacity-50")}>
              <div className="flex items-start gap-3">
                {/* Icon */}
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shrink-0 border border-white/10"
                  style={{ background: s.isBuilt ? `${s.color}22` : "rgba(0,0,0,0.3)" }}>
                  {locked ? <Lock className="w-5 h-5 text-white/30" /> : s.isBuilt ? s.icon : "🔒"}
                </div>

                <div className="flex-1 min-w-0">
                  {/* Name row */}
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-display text-sm text-white">{s.name}</span>
                    {s.isBuilt && (
                      <span className="text-[9px] px-1.5 py-0.5 rounded font-display"
                        style={{ background:`${s.color}33`, color:s.color }}>Nv.{s.level}</span>
                    )}
                    <span className="ml-auto text-[9px] text-muted-foreground">{locked ? `🔒 ${s.era}` : s.era}</span>
                  </div>

                  {/* Resource + rate */}
                  <div className="flex items-center gap-1 text-xs mb-2">
                    <span>{s.resourceIcon}</span>
                    <span className="text-muted-foreground">{s.resource}</span>
                    {rate > 0 && <span className="ml-auto text-green-400 font-bold">+{rate.toFixed(2)}/s</span>}
                  </div>

                  {/* Level bar */}
                  {s.isBuilt && (
                    <div className="mb-2">
                      <Progress value={(s.level / s.maxLevel) * 100}
                        className="h-1.5" indicatorClassName="bg-gradient-to-r from-primary to-secondary" />
                      <div className="text-[9px] text-muted-foreground mt-0.5">{s.level}/{s.maxLevel}</div>
                    </div>
                  )}

                  {/* Cost badges */}
                  <div className="flex gap-1 flex-wrap mb-2">
                    {Object.entries(cost).map(([res, amt]) => {
                      const icons: Record<string,string> = { stone:"🪨",wood:"🪵",food:"🍖",bronze:"🥉",energy:"⚡" };
                      const ok = (AVAILABLE[res] ?? 0) >= (amt as number);
                      return (
                        <span key={res} className="text-[10px] px-1.5 py-0.5 rounded bg-black/30 border border-white/8"
                          style={{ color: ok ? "hsl(0 0% 70%)" : "hsl(0 75% 55%)" }}>
                          {icons[res]}{amt}
                        </span>
                      );
                    })}
                  </div>

                  {/* Action button */}
                  {!locked && (
                    <button
                      disabled={!affordable || (s.isBuilt && s.level >= s.maxLevel)}
                      onClick={() => s.isBuilt ? handleUpgrade(s.id) : handleBuild(s.id)}
                      className={cn(
                        "w-full py-2 rounded-xl font-display text-xs uppercase tracking-wide transition-all flex items-center justify-center gap-1",
                        affordable && !(s.isBuilt && s.level >= s.maxLevel)
                          ? s.isBuilt
                            ? "bg-gradient-to-r from-accent to-orange-500 text-black shadow-[0_0_15px_rgba(255,170,0,0.3)]"
                            : "bg-gradient-to-r from-primary to-secondary text-white shadow-[0_0_15px_rgba(0,212,255,0.3)]"
                          : "bg-white/5 text-white/30 cursor-not-allowed"
                      )}>
                      {s.isBuilt
                        ? s.level >= s.maxLevel
                          ? "Nivel Máximo"
                          : <><ArrowUp className="w-3 h-3" /> Mejorar Nv.{s.level + 1}</>
                        : <><Hammer className="w-3 h-3" /> Construir</>}
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
