import React, { useState } from "react";
import { useRoute, Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, Zap, Star } from "lucide-react";
import { cn } from "@/lib/utils";

const ERAS = ["Piedra","Tribal","Bronce","Clásica","Medieval","Industrial","Robótica","Espacial","Singularidad"];

const PLANET_DATA: Record<string, {
  name:string; cssClass:string; color:string; glow:string;
  eraIndex:number; description:string;
  resources: Record<string,{icon:string;amount:number;rate:number}>;
  structures: {name:string;icon:string;level:number;rate:number;resource:string}[];
  cards: {name:string;emoji:string;rarity:string}[];
  stats: {atk:number;def:number;pop:number|string;tech:number};
  lore: string;
}> = {
  "1": {
    name:"Porera", cssClass:"planet-porera", color:"hsl(120 60% 45%)", glow:"rgba(76,175,80,0.4)",
    eraIndex:2,
    description:"Mundo verde primordial en plena era de Bronce. Hogar de las primeras civilizaciones.",
    lore:"Porera nació de una nube de gas y polvo hace 4.2 billones de años. Sus bosques primordiales albergan criaturas extintas en otros mundos. Los Foreños — sus habitantes — descubrieron el fuego hace 3 eras y construyeron las primeras estructuras de piedra.",
    resources: {
      stone:  {icon:"🪨",amount:150,  rate:2.5},
      wood:   {icon:"🪵",amount:80,   rate:1.8},
      food:   {icon:"🍖",amount:45,   rate:1.2},
      bronze: {icon:"🥉",amount:12,   rate:0.4},
    },
    structures: [
      {name:"Cantera",    icon:"⛏️", level:3, rate:9.92, resource:"🪨"},
      {name:"Aserradero", icon:"🪚", level:2, rate:4.14, resource:"🪵"},
      {name:"Granja",     icon:"🌾", level:2, rate:2.76, resource:"🍖"},
      {name:"Forja",      icon:"🔥", level:1, rate:0.46, resource:"🥉"},
    ],
    cards: [
      {name:"Cazador Primitivo", emoji:"🏹", rarity:"common"},
      {name:"Mamut Salvaje",     emoji:"🦣", rarity:"epic"},
      {name:"Roca Sagrada",      emoji:"🪨", rarity:"common"},
    ],
    stats: {atk:35, def:20, pop:"1,200", tech:3},
  },
  "2": {
    name:"Doresa", cssClass:"planet-doresa", color:"hsl(185 80% 45%)", glow:"rgba(0,188,212,0.4)",
    eraIndex:5,
    description:"Mundo oceánico en era Industrial. Sus mares cubren el 80% de la superficie.",
    lore:"Doresa es un mundo acuático con continentes flotantes. Sus habitantes — los Doreanos — construyeron civilizaciones submarinas únicas. La era Industrial trajo mega-fábricas de extracción marina y torres de perforación submarina.",
    resources: {
      stone:  {icon:"🪨",amount:3200,  rate:12.5},
      wood:   {icon:"🪵",amount:2100,  rate:8.4},
      food:   {icon:"🍖",amount:980,   rate:6.2},
      bronze: {icon:"🥉",amount:340,   rate:2.8},
    },
    structures: [
      {name:"Mina Submarina", icon:"⛏️", level:6, rate:28.4, resource:"🪨"},
      {name:"Kelp Forest",    icon:"🌿", level:5, rate:18.1, resource:"🪵"},
      {name:"Pescadería",     icon:"🐠", level:4, rate:12.4, resource:"🍖"},
      {name:"Smelter",        icon:"🏭", level:3, rate:6.2,  resource:"🥉"},
    ],
    cards: [
      {name:"Capitán Naval", emoji:"⚓", rarity:"clear"},
      {name:"Leviatán",      emoji:"🦈", rarity:"legendary"},
      {name:"Ingeniero",     emoji:"⚙️", rarity:"epic"},
    ],
    stats: {atk:85, def:60, pop:"45,000", tech:6},
  },
  "3": {
    name:"Aitherium", cssClass:"planet-aitherium", color:"hsl(265 85% 60%)", glow:"rgba(123,47,252,0.4)",
    eraIndex:7,
    description:"Núcleo de energía cósmica — bloqueado.",
    lore:"Aitherium no es un planeta convencional: es un núcleo de energía oscura comprimida. Sus \"habitantes\" son entidades de luz pura que evolucionaron más allá de la biología. Se desbloquea completando Doresa.",
    resources: {},
    structures: [],
    cards: [],
    stats: {atk:0, def:0, pop:"???", tech:0},
  },
};

const RARITY_COLOR: Record<string,string> = {
  common:"hsl(210 20% 60%)", clear:"hsl(193 100% 50%)", epic:"hsl(280 90% 65%)", legendary:"hsl(45 100% 55%)",
};

const TABS = ["Resumen","Recursos","Estructuras","Cartas","Lore"] as const;
type Tab = typeof TABS[number];

export default function PlanetDetail() {
  const [, params] = useRoute("/planet/:id");
  const id = params?.id ?? "1";
  const planet = PLANET_DATA[id] ?? PLANET_DATA["1"];
  const isLocked = id === "3";
  const [tab, setTab] = useState<Tab>("Resumen");
  const eraProgress = (planet.eraIndex / 8) * 100;

  return (
    <div className="space-y-5">
      {/* Back */}
      <div className="flex items-center gap-3">
        <Link href="/" className="p-2 glass-panel rounded-xl text-muted-foreground hover:text-white transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-display uppercase" style={{ color:planet.color }}>{planet.name}</h1>
          <p className="text-xs text-muted-foreground">{ERAS[planet.eraIndex]}</p>
        </div>
      </div>

      {/* Planet hero */}
      <div className="glass-panel rounded-3xl overflow-hidden relative">
        <div className="absolute inset-0"
          style={{ background:`radial-gradient(ellipse at 50% 70%, ${planet.glow} 0%, transparent 70%)` }} />

        <div className="relative z-10 flex flex-col items-center pt-8 pb-4">
          {/* Animated floating planet */}
          <motion.div
            animate={{ y:[0,-10,0] }}
            transition={{ duration:4, repeat:Infinity, ease:"easeInOut" }}
            className="relative mb-4">
            <div className={cn("w-36 h-36 rounded-full", planet.cssClass, isLocked && "grayscale brightness-50")} />
            {/* Orbital ring */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-[155%] h-[26%] rounded-full border border-white/25 rotate-[25deg]" />
            </div>
            {/* Glow halo */}
            {!isLocked && (
              <div className="absolute -inset-4 rounded-full opacity-20 pointer-events-none"
                style={{ background:`radial-gradient(circle, ${planet.color}, transparent 70%)`, filter:"blur(10px)" }} />
            )}
            {isLocked && (
              <div className="absolute inset-0 flex items-center justify-center text-4xl">🔒</div>
            )}
          </motion.div>

          {/* Era progress */}
          {!isLocked && (
            <div className="w-52 text-center">
              <div className="flex justify-between text-[10px] text-muted-foreground mb-1">
                <span>{ERAS[planet.eraIndex]}</span>
                <span>{ERAS[planet.eraIndex+1]??"MAX"}</span>
              </div>
              <Progress value={eraProgress} className="h-2"
                indicatorClassName="bg-gradient-to-r from-primary to-secondary" />
              <div className="text-[10px] text-muted-foreground mt-0.5">{Math.round(eraProgress)}% completada</div>
            </div>
          )}

          {isLocked && (
            <p className="text-sm text-muted-foreground text-center px-8 pb-2">
              Completa Doresa Era 9 para desbloquear
            </p>
          )}
        </div>

        {/* Quick stats bar */}
        {!isLocked && (
          <div className="flex divide-x divide-white/10 border-t border-white/10">
            {[
              {icon:"⚔️", val:planet.stats.atk, label:"ATK"},
              {icon:"🛡️", val:planet.stats.def, label:"DEF"},
              {icon:"👥", val:planet.stats.pop, label:"Pobl."},
              {icon:"🔬", val:`Nv.${planet.stats.tech}`, label:"Tec."},
            ].map(s=>(
              <div key={s.label} className="flex-1 flex flex-col items-center py-3">
                <span className="text-base">{s.icon}</span>
                <span className="font-display text-xs text-white">{s.val}</span>
                <span className="text-[9px] text-muted-foreground">{s.label}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Tabs */}
      {!isLocked && (<>
        <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {TABS.map(t=>(
            <button key={t} onClick={()=>setTab(t)}
              className={cn(
                "shrink-0 px-3 py-1.5 rounded-xl font-display text-[10px] uppercase tracking-wide transition-all border",
                tab===t
                  ? "bg-primary/20 border-primary/50 text-primary"
                  : "bg-white/5 border-white/10 text-muted-foreground hover:text-white"
              )}>{t}</button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div key={tab} initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} exit={{opacity:0}} transition={{duration:0.15}}>

            {tab==="Resumen" && (
              <div className="space-y-4">
                <div className="glass-panel rounded-2xl p-4">
                  <p className="text-sm text-muted-foreground">{planet.description}</p>
                </div>
                {/* Era timeline */}
                <div className="glass-panel rounded-2xl p-4">
                  <div className="font-display text-xs text-white/70 uppercase mb-3">Línea del Tiempo</div>
                  <div className="flex gap-1 flex-wrap">
                    {ERAS.map((era,i)=>(
                      <div key={era} className={cn(
                        "px-2 py-1 rounded-lg text-[9px] font-display border",
                        i < planet.eraIndex ? "bg-primary/20 border-primary/30 text-primary" :
                        i === planet.eraIndex ? "bg-accent/20 border-accent/50 text-accent" :
                        "bg-white/5 border-white/10 text-white/30"
                      )}>{era}</div>
                    ))}
                  </div>
                </div>
                {/* Production total */}
                <div className="glass-panel rounded-2xl p-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Zap className="w-5 h-5 text-green-400" />
                    <span className="font-display text-sm text-white uppercase">Producción Total</span>
                  </div>
                  <span className="font-display text-lg text-green-400">
                    +{planet.structures.reduce((a,s)=>a+s.rate,0).toFixed(1)}/s
                  </span>
                </div>
                <button disabled={eraProgress<100}
                  className={cn(
                    "w-full py-3 rounded-2xl font-display text-sm uppercase tracking-wider transition-all",
                    eraProgress>=100
                      ? "bg-gradient-to-r from-accent to-secondary text-white shadow-[0_0_20px_rgba(255,170,0,0.4)]"
                      : "bg-white/5 text-white/30 cursor-not-allowed"
                  )}>
                  {eraProgress>=100 ? `✨ Avanzar a: ${ERAS[planet.eraIndex+1]??"MAX"}` : `Avanzar de Era (${Math.round(eraProgress)}%)`}
                </button>
              </div>
            )}

            {tab==="Recursos" && (
              <div className="space-y-3">
                {Object.entries(planet.resources).map(([key,res])=>(
                  <div key={key} className="glass-panel rounded-2xl p-4 flex items-center gap-4">
                    <div className="text-3xl">{res.icon}</div>
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

            {tab==="Estructuras" && (
              <div className="space-y-3">
                <div className="flex justify-end">
                  <Link href="/structures" className="text-xs text-primary font-display">+ Construir nueva →</Link>
                </div>
                {planet.structures.map(s=>(
                  <div key={s.name} className="glass-panel rounded-2xl p-4 flex items-center gap-3">
                    <div className="text-3xl">{s.icon}</div>
                    <div className="flex-1">
                      <div className="flex justify-between items-center">
                        <span className="font-display text-sm text-white">{s.name}</span>
                        <span className="text-[10px] px-2 py-0.5 rounded bg-primary/20 text-primary font-display">Nv.{s.level}</span>
                      </div>
                      <div className="text-xs text-green-400 mt-0.5">{s.resource} +{s.rate}/s</div>
                      <Progress value={(s.level/10)*100} className="h-1 mt-1.5"
                        indicatorClassName="bg-gradient-to-r from-primary to-secondary" />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {tab==="Cartas" && (
              <div className="grid grid-cols-3 gap-3">
                {planet.cards.map(card=>{
                  const col = RARITY_COLOR[card.rarity];
                  return (
                    <div key={card.name}
                      className="glass-panel rounded-2xl aspect-[3/4] flex flex-col items-center justify-center gap-2 p-3 border-2"
                      style={{ borderColor:`${col}55`, boxShadow:`0 0 10px ${col}22` }}>
                      <div className="text-3xl">{card.emoji}</div>
                      <div className="text-[9px] font-display text-white text-center leading-tight">{card.name}</div>
                      <div className="text-[8px]" style={{ color:col }}>{card.rarity}</div>
                    </div>
                  );
                })}
                <Link href="/collection">
                  <div className="glass-panel rounded-2xl aspect-[3/4] flex flex-col items-center justify-center gap-1 p-3 border-2 border-dashed border-white/20 hover:border-primary/40 transition-colors cursor-pointer">
                    <span className="text-2xl">+</span>
                    <div className="text-[9px] font-display text-muted-foreground text-center">Ver álbum</div>
                  </div>
                </Link>
              </div>
            )}

            {tab==="Lore" && (
              <div className="glass-panel rounded-2xl p-5">
                <div className="flex items-center gap-2 mb-3">
                  <Star className="w-4 h-4 text-accent" />
                  <span className="font-display text-sm text-white uppercase">Historia de {planet.name}</span>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">{planet.lore}</p>
              </div>
            )}

          </motion.div>
        </AnimatePresence>
      </>)}
    </div>
  );
}
