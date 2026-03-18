import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Progress } from "@/components/ui/progress";
import { Sword, Shield, Heart, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

const EQUIPMENT = {
  helmet: { name:"Máscara Tribal",      emoji:"🪖", rarity:"epic",      atk:0,   def:30,  hp:80  },
  weapon: { name:"Espada de Bronce",    emoji:"🗡️", rarity:"clear",     atk:120, def:0,   hp:0   },
  armor:  { name:"Túnica de Cuero",     emoji:"🛡️", rarity:"common",    atk:0,   def:30,  hp:0   },
  gadget: { name:"Amuleto de la Suerte",emoji:"📿", rarity:"legendary", atk:0,   def:0,   hp:150 },
};

const BASE = { atk:35, def:20, hp:100 };
const totalEq = (key:"atk"|"def"|"hp") => Object.values(EQUIPMENT).reduce((a,e)=>a+e[key],0);
const STATS = { atk:BASE.atk+totalEq("atk"), def:BASE.def+totalEq("def"), hp:BASE.hp+totalEq("hp") };

const ENEMIES = [
  { name:"Bestia de la Cueva", emoji:"🦁", sprite:"🦁", hp:200, atk:20, def:5,  color:"#FF8A65", reward:"🪨×30 • XP+50"   },
  { name:"Lobo Tribal",        emoji:"🐺", sprite:"🐺", hp:350, atk:35, def:12, color:"#78909C", reward:"🪵×25 • XP+90"   },
  { name:"Guerrero de Bronce", emoji:"🛡️", sprite:"🛡️", hp:500, atk:50, def:20, color:"#CD7F32", reward:"🥉×15 • XP+150"  },
];

const RARITY_COLOR: Record<string,string> = {
  common:"hsl(210 20% 60%)", clear:"hsl(193 100% 50%)", epic:"hsl(280 90% 65%)", legendary:"hsl(45 100% 55%)",
};

type LogEntry = { id:number; text:string; type:"dealt"|"received"|"info"|"crit"|"reward" };

export default function Character() {
  const [activeTab, setActiveTab] = useState<"combat"|"equipment">("combat");
  const [enemyIdx, setEnemyIdx] = useState(0);
  const [arisHP, setArisHP] = useState(STATS.hp);
  const [enemyHP, setEnemyHP] = useState(ENEMIES[0].hp);
  const [fighting, setFighting] = useState(false);
  const [wins, setWins] = useState(12);
  const [log, setLog] = useState<LogEntry[]>([{ id:0, text:"¡Presiona Iniciar para combatir!", type:"info" }]);
  const [arisShake, setArisShake] = useState(false);
  const [enemyShake, setEnemyShake] = useState(false);
  const [arisAttack, setArisAttack] = useState(false);
  const [enemyAttack, setEnemyAttack] = useState(false);
  const [lastDmg, setLastDmg] = useState<{aris?:number;enemy?:number;arisCrit?:boolean}>({});
  const [round, setRound] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval>|null>(null);
  const logRef = useRef<HTMLDivElement>(null);
  const enemy = ENEMIES[enemyIdx];

  const resetCombat = (idx:number) => {
    if(timerRef.current) clearInterval(timerRef.current);
    setFighting(false); setEnemyIdx(idx);
    setArisHP(STATS.hp); setEnemyHP(ENEMIES[idx].hp); setRound(0);
    setLog([{id:Date.now(), text:`Enemigo: ${ENEMIES[idx].name}`, type:"info"}]);
  };

  const startCombat = () => {
    if (fighting) { if(timerRef.current) clearInterval(timerRef.current); setFighting(false); return; }
    let aHp = arisHP > 0 ? arisHP : STATS.hp;
    let eHp = enemyHP > 0 ? enemyHP : enemy.hp;
    if(arisHP <= 0) { setArisHP(STATS.hp); aHp = STATS.hp; }
    if(enemyHP <= 0) { setEnemyHP(enemy.hp); eHp = enemy.hp; }
    setFighting(true);

    timerRef.current = setInterval(async () => {
      const isCrit = Math.random() < 0.15;
      const dmg = Math.max(1, Math.floor((STATS.atk - enemy.def) * (isCrit ? 2 : 1) + Math.random()*12 - 6));
      const take = Math.max(1, Math.floor(enemy.atk - STATS.def + Math.random()*8 - 4));

      // Animate: Aris attacks
      setArisAttack(true);
      setTimeout(() => {
        setArisAttack(false);
        setEnemyShake(true);
        setLastDmg({enemy:dmg, arisCrit:isCrit});
        setTimeout(()=>{ setEnemyShake(false); setLastDmg(p=>({...p,enemy:undefined})); }, 500);
      }, 250);

      // Animate: enemy counterattacks
      setTimeout(() => {
        setEnemyAttack(true);
        setTimeout(()=>{
          setEnemyAttack(false);
          setArisShake(true);
          setLastDmg(p=>({...p,aris:take}));
          setTimeout(()=>{ setArisShake(false); setLastDmg(p=>({...p,aris:undefined})); }, 500);
        }, 250);
      }, 600);

      eHp = Math.max(0, eHp - dmg);
      aHp = Math.max(0, aHp - take);
      setEnemyHP(eHp);
      setArisHP(aHp);
      setRound(r => r+1);

      const newLog: LogEntry[] = [
        { id:Date.now(), text:isCrit ? `⚡CRÍTICO! Aris golpea: ${dmg}` : `Aris ataca: ${dmg}`, type: isCrit ? "crit" : "dealt" },
        { id:Date.now()+1, text:`${enemy.name} responde: ${take}`, type:"received" },
      ];

      if (eHp <= 0) {
        clearInterval(timerRef.current!); setFighting(false);
        setWins(w=>w+1);
        newLog.push({ id:Date.now()+2, text:`🎉 ¡Victoria! ${enemy.reward}`, type:"reward" });
      } else if (aHp <= 0) {
        clearInterval(timerRef.current!); setFighting(false);
        setTimeout(()=>setArisHP(Math.floor(STATS.hp*0.3)), 800);
        newLog.push({ id:Date.now()+2, text:"Aris fue derrotado. Recuperando...", type:"info" });
      }

      setLog(prev=>[...prev.slice(-30), ...newLog]);
      setTimeout(()=>{ if(logRef.current) logRef.current.scrollTop = 99999; }, 40);
    }, 900);
  };

  useEffect(()=>()=>{ if(timerRef.current) clearInterval(timerRef.current); },[]);

  const arisHpPct = Math.max(0, (arisHP / STATS.hp) * 100);
  const enemyHpPct = Math.max(0, (enemyHP / enemy.hp) * 100);

  return (
    <div className="space-y-4">
      {/* Tabs */}
      <div className="flex gap-2">
        {[{id:"combat" as const,label:"⚔️ Combate"},{id:"equipment" as const,label:"🛡️ Equipo"}].map(t=>(
          <button key={t.id} onClick={()=>setActiveTab(t.id)}
            className={cn(
              "flex-1 py-2.5 rounded-2xl font-display text-xs uppercase tracking-wide transition-all border",
              activeTab===t.id
                ? "bg-primary/20 border-primary/50 text-primary"
                : "bg-white/5 border-white/10 text-muted-foreground hover:text-white"
            )}>{t.label}</button>
        ))}
      </div>

      {activeTab==="combat" && (<>
        {/* Stat pills */}
        <div className="grid grid-cols-4 gap-2">
          {[
            {icon:Sword,  val:STATS.atk, label:"ATK", color:"text-red-400"},
            {icon:Shield, val:STATS.def, label:"DEF", color:"text-blue-400"},
            {icon:Heart,  val:STATS.hp,  label:"HP",  color:"text-green-400"},
            {icon:Zap,    val:wins,      label:"Wins",color:"text-accent"},
          ].map(({icon:Icon,val,label,color})=>(
            <div key={label} className="glass-panel rounded-2xl p-2.5 text-center">
              <Icon className={cn("w-4 h-4 mx-auto mb-0.5",color)} />
              <div className="font-display text-sm text-white">{val}</div>
              <div className="text-[9px] text-muted-foreground uppercase">{label}</div>
            </div>
          ))}
        </div>

        {/* Enemy selector */}
        <div className="flex gap-2">
          {ENEMIES.map((e,i)=>(
            <button key={i} disabled={fighting}
              onClick={()=>resetCombat(i)}
              className={cn(
                "flex-1 py-2 rounded-xl font-display text-[10px] uppercase transition-all border",
                i===enemyIdx
                  ? "bg-red-500/20 border-red-500/50 text-red-400"
                  : "bg-white/5 border-white/10 text-muted-foreground hover:text-white"
              )}>{e.emoji} {e.name.split(" ")[0]}</button>
          ))}
        </div>

        {/* ══ VISUAL ARENA ══ */}
        <div className="rounded-3xl overflow-hidden relative"
          style={{ background:"linear-gradient(180deg, #0d0520 0%, #120828 40%, #0a1428 100%)", minHeight:260 }}>

          {/* BG grid lines for sci-fi look */}
          <div className="absolute inset-0 opacity-10"
            style={{ backgroundImage:"linear-gradient(rgba(0,212,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(0,212,255,0.3) 1px, transparent 1px)", backgroundSize:"40px 40px" }} />

          {/* Glow beneath fighters */}
          <div className="absolute bottom-0 left-[18%] w-24 h-6 rounded-full opacity-50"
            style={{ background:"radial-gradient(ellipse, rgba(76,175,80,0.8), transparent 70%)", filter:"blur(4px)" }} />
          <div className="absolute bottom-0 right-[18%] w-24 h-6 rounded-full opacity-50"
            style={{ background:`radial-gradient(ellipse, ${enemy.color}cc, transparent 70%)`, filter:"blur(4px)" }} />

          {/* Fighters row */}
          <div className="relative flex items-end justify-between px-6 pt-6 pb-4" style={{ minHeight:200 }}>
            {/* Aris */}
            <div className="flex flex-col items-center" style={{ width:"40%" }}>
              {/* Damage popup */}
              <AnimatePresence>
                {lastDmg.aris && (
                  <motion.div key="aris-dmg"
                    initial={{y:0,opacity:1}} animate={{y:-30,opacity:0}} exit={{opacity:0}} transition={{duration:0.7}}
                    className="absolute text-red-400 font-display text-lg pointer-events-none"
                    style={{ top:"30%", left:"10%" }}>
                    -{lastDmg.aris}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Aris sprite */}
              <motion.div
                animate={
                  arisShake ? { x:[-6,6,-4,4,0] } :
                  arisAttack ? { x:[0,30,0] } : {}
                }
                transition={{ duration:0.3 }}
                className="text-7xl select-none">
                🧑‍🚀
              </motion.div>

              {/* HP bar */}
              <div className="w-full mt-3 space-y-1">
                <div className="flex justify-between text-[9px] font-display">
                  <span className="text-white">Aris</span>
                  <span className="text-green-400">{Math.max(0,arisHP)}/{STATS.hp}</span>
                </div>
                <div className="h-2.5 bg-black/60 rounded-full overflow-hidden border border-white/10">
                  <motion.div className="h-full rounded-full"
                    animate={{ width:`${arisHpPct}%` }}
                    style={{ background: arisHpPct > 50 ? "linear-gradient(90deg,#4CAF50,#81C784)" : arisHpPct > 25 ? "linear-gradient(90deg,#FF9800,#FFB74D)" : "linear-gradient(90deg,#f44336,#EF5350)" }} />
                </div>
              </div>
            </div>

            {/* VS center */}
            <div className="flex flex-col items-center gap-1 pb-8">
              <motion.div
                animate={ fighting ? { scale:[1,1.2,1], rotate:[0,5,-5,0] } : {} }
                transition={{ duration:0.9, repeat:Infinity }}
                className="font-display text-xl text-red-400 text-glow">
                {fighting ? "⚡" : "VS"}
              </motion.div>
              <div className="text-[9px] text-muted-foreground font-display">Ronda {round}</div>
            </div>

            {/* Enemy */}
            <div className="flex flex-col items-center" style={{ width:"40%" }}>
              <AnimatePresence>
                {lastDmg.enemy && (
                  <motion.div key="enemy-dmg"
                    initial={{y:0,opacity:1}} animate={{y:-30,opacity:0}} exit={{opacity:0}} transition={{duration:0.7}}
                    className={cn("absolute font-display text-lg pointer-events-none", lastDmg.arisCrit ? "text-yellow-400 text-xl" : "text-orange-400")}
                    style={{ top:"30%", right:"8%" }}>
                    {lastDmg.arisCrit ? `💥-${lastDmg.enemy}` : `-${lastDmg.enemy}`}
                  </motion.div>
                )}
              </AnimatePresence>

              <motion.div
                animate={
                  enemyShake ? { x:[6,-6,4,-4,0] } :
                  enemyAttack ? { x:[0,-30,0] } : {}
                }
                transition={{ duration:0.3 }}
                className="text-7xl select-none">
                {enemy.emoji}
              </motion.div>

              <div className="w-full mt-3 space-y-1">
                <div className="flex justify-between text-[9px] font-display">
                  <span className="text-white truncate">{enemy.name.split(" ")[0]}</span>
                  <span style={{ color:enemy.color }}>{Math.max(0,enemyHP)}/{enemy.hp}</span>
                </div>
                <div className="h-2.5 bg-black/60 rounded-full overflow-hidden border border-white/10">
                  <motion.div className="h-full rounded-full"
                    animate={{ width:`${enemyHpPct}%` }}
                    style={{ background:`linear-gradient(90deg, ${enemy.color}cc, ${enemy.color})` }} />
                </div>
              </div>
            </div>
          </div>

          {/* Combat log */}
          <div ref={logRef} className="overflow-y-auto px-3 pb-3 custom-scrollbar" style={{ maxHeight:75 }}>
            <div className="space-y-0.5">
              {log.slice(-8).map(l=>(
                <div key={l.id} className={cn("text-[10px] font-display",
                  l.type==="dealt"?"text-green-400":
                  l.type==="crit"?"text-yellow-400":
                  l.type==="received"?"text-red-400":
                  l.type==="reward"?"text-accent":
                  "text-muted-foreground")}>
                  {l.text}
                </div>
              ))}
            </div>
          </div>

          {/* Action button */}
          <div className="px-3 pb-3">
            <motion.button whileTap={{ scale:0.96 }}
              onClick={startCombat}
              className={cn(
                "w-full py-3 rounded-2xl font-display text-sm uppercase tracking-wide text-white transition-all",
                fighting
                  ? "bg-gradient-to-r from-slate-600 to-slate-700"
                  : arisHP <= 0
                    ? "bg-gradient-to-r from-blue-600 to-blue-700"
                    : "bg-gradient-to-r from-red-600 to-pink-600 shadow-[0_0_20px_rgba(244,67,54,0.4)]"
              )}>
              {fighting ? "⏸ Pausar" : arisHP <= 0 ? "♻️ Reiniciar" : `▶ Luchar — ${enemy.name}`}
            </motion.button>
            <div className="text-center text-[9px] text-muted-foreground mt-1">
              Recompensa: <span className="text-accent font-bold">{enemy.reward}</span>
            </div>
          </div>
        </div>
      </>)}

      {activeTab==="equipment" && (<>
        <h2 className="font-display text-lg uppercase text-gradient">Equipamiento de Aris</h2>
        <div className="grid grid-cols-2 gap-3">
          {Object.entries(EQUIPMENT).map(([slot,item])=>{
            const col = RARITY_COLOR[item.rarity];
            const slotLabel: Record<string,string> = { helmet:"Casco",weapon:"Arma",armor:"Armadura",gadget:"Gadget" };
            return (
              <div key={slot}
                className="glass-panel rounded-2xl p-4 text-center cursor-pointer transition-all hover:scale-105 border-2"
                style={{ borderColor:`${col}55`, boxShadow:`inset 0 0 20px ${col}12` }}>
                <div className="text-[9px] text-muted-foreground font-display uppercase mb-1">{slotLabel[slot]}</div>
                <div className="text-4xl my-2">{item.emoji}</div>
                <div className="font-display text-xs text-white leading-tight mb-0.5">{item.name}</div>
                <div className="text-[9px] mb-1.5" style={{ color:col }}>{item.rarity}</div>
                <div className="text-[9px] text-muted-foreground">
                  {item.atk>0&&`ATK+${item.atk} `}{item.def>0&&`DEF+${item.def} `}{item.hp>0&&`HP+${item.hp}`}
                </div>
              </div>
            );
          })}
        </div>
        <div className="flex gap-2">
          {[
            {label:"✨ Auto Equipar", cls:"bg-gradient-to-r from-primary to-secondary text-white shadow-[0_0_15px_rgba(0,212,255,0.3)]"},
            {label:"🔗 Fusionar ×3",  cls:"bg-gradient-to-r from-accent to-orange-500 text-black"},
            {label:"♻️ Reciclar",     cls:"bg-white/5 text-white/50 border border-white/10"},
          ].map(btn=>(
            <button key={btn.label} className={cn("flex-1 py-2.5 rounded-2xl font-display text-[10px] uppercase tracking-wide transition-all", btn.cls)}>
              {btn.label}
            </button>
          ))}
        </div>
      </>)}
    </div>
  );
}
