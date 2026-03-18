import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Sparkles, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Prestige() {
  const [isRunning, setIsRunning] = useState(false);
  const [prestigeLevel, setPrestigeLevel] = useState(3);
  const [accumulated, setAccumulated] = useState(0);
  const [bank, setBank] = useState(0);
  const multiplier = 1 + prestigeLevel * 0.5;
  const productionPerSec = 0.8 * multiplier * prestigeLevel;
  const timerRef = useRef<ReturnType<typeof setInterval>|null>(null);

  useEffect(()=>{
    if(isRunning){
      timerRef.current = setInterval(()=>setAccumulated(p=>p+productionPerSec),1000);
    } else {
      if(timerRef.current) clearInterval(timerRef.current);
    }
    return ()=>{ if(timerRef.current) clearInterval(timerRef.current); };
  },[isRunning,productionPerSec]);

  const handleClaim = ()=>{ setBank(p=>p+Math.floor(accumulated)); setAccumulated(0); setIsRunning(false); };
  const handlePrestige = ()=>{ setPrestigeLevel(p=>p+1); setBank(0); setAccumulated(0); setIsRunning(false); };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-3 bg-secondary/20 rounded-2xl text-secondary">
          <Sparkles className="w-8 h-8" />
        </div>
        <div>
          <h1 className="text-2xl font-display text-gradient uppercase">Prestigio</h1>
          <p className="text-muted-foreground text-xs">Minijuego Idle de Producción</p>
        </div>
      </div>

      {/* Main prestige display */}
      <div className="glass-panel rounded-3xl p-6 text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-10"
          style={{ background:"radial-gradient(circle at 50% 30%, hsl(280 90% 65%), transparent 70%)" }} />
        <div className="relative z-10">
          <div className="w-28 h-28 mx-auto rounded-full flex items-center justify-center mb-4 relative"
            style={{ background:"radial-gradient(circle, rgba(123,47,252,0.3), rgba(10,14,39,0.9))", border:"2px solid hsl(280 90% 65%)", boxShadow:"0 0 40px rgba(123,47,252,0.4)" }}>
            <div>
              <div className="text-4xl font-display text-white">{prestigeLevel}</div>
              <div className="text-[10px] text-muted-foreground font-display">NIVEL</div>
            </div>
          </div>

          <h2 className="font-display text-secondary text-lg mb-1">Nivel de Prestigio</h2>
          <p className="text-xs text-muted-foreground mb-5">Multiplicador: <span className="text-accent font-bold">{multiplier.toFixed(1)}x</span></p>

          <div className="grid grid-cols-3 gap-3 mb-5">
            {[
              {label:"Acumulado",   val:Math.floor(accumulated), color:"text-white"},
              {label:"Producción",  val:`+${productionPerSec.toFixed(1)}/s`, color:"text-primary"},
              {label:"Banco 💎",    val:bank, color:"text-accent"},
            ].map(s=>(
              <div key={s.label} className="bg-black/30 rounded-xl p-3">
                <div className={cn("text-lg font-display",s.color)}>{s.val}</div>
                <div className="text-[9px] text-muted-foreground">{s.label}</div>
              </div>
            ))}
          </div>

          {/* Progress to prestige */}
          <div className="mb-5">
            <div className="flex justify-between text-[10px] text-muted-foreground mb-1">
              <span className="font-display">Próximo Prestigio</span>
              <span>{Math.floor(accumulated)}/500</span>
            </div>
            <div className="h-2 bg-black/40 rounded-full overflow-hidden">
              <motion.div className="h-full rounded-full bg-gradient-to-r from-secondary to-primary"
                animate={{ width:`${Math.min(100,accumulated/5)}%` }} />
            </div>
          </div>

          <button onClick={()=>setIsRunning(p=>!p)}
            className={cn(
              "w-full py-3 rounded-2xl font-display text-sm uppercase tracking-wide transition-all mb-2",
              isRunning
                ? "bg-gradient-to-r from-slate-600 to-slate-700 text-white"
                : "bg-gradient-to-r from-secondary to-purple-700 text-white shadow-[0_0_20px_rgba(123,47,252,0.4)]"
            )}>
            {isRunning ? "⏸ Pausar Producción" : "▶ Iniciar Producción"}
          </button>

          {accumulated > 0 && (
            <button onClick={handleClaim}
              className="w-full py-2.5 rounded-2xl font-display text-sm uppercase tracking-wide mb-2 bg-gradient-to-r from-primary to-cyan-600 text-black">
              💰 Reclamar {Math.floor(accumulated)} recursos
            </button>
          )}

          <button onClick={handlePrestige} disabled={accumulated<500}
            className={cn(
              "w-full py-2.5 rounded-2xl font-display text-sm uppercase tracking-wide transition-all",
              accumulated>=500
                ? "bg-gradient-to-r from-accent to-orange-500 text-black shadow-[0_0_15px_rgba(255,170,0,0.4)]"
                : "bg-white/5 text-white/20 cursor-not-allowed"
            )}>
            ✨ Prestigio (necesita 500)
          </button>
        </div>
      </div>

      {/* Idle clicker */}
      <div className="glass-panel rounded-3xl p-5 text-center">
        <h3 className="font-display text-sm uppercase text-white/70 mb-2">Producción Manual</h3>
        <p className="text-xs text-muted-foreground mb-4">Toca el núcleo para acumular energía adicional</p>
        <motion.button whileTap={{ scale:0.88 }}
          onClick={()=>setAccumulated(p=>p+multiplier)}
          className="w-24 h-24 mx-auto rounded-full flex items-center justify-center relative"
          style={{ background:"radial-gradient(circle, hsl(280 90% 45%), hsl(280 90% 20%))", boxShadow:"0 0 30px rgba(123,47,252,0.6)", border:"2px solid hsl(280 90% 65%)" }}>
          <Zap className="w-10 h-10 text-white" />
          <div className="absolute inset-0 rounded-full animate-ping opacity-15"
            style={{ background:"rgba(123,47,252,0.4)" }} />
        </motion.button>
        <p className="text-xs text-muted-foreground mt-3">+{multiplier.toFixed(1)} por clic</p>
      </div>

      {/* Bonuses */}
      <div className="glass-panel rounded-3xl p-4">
        <h3 className="font-display text-sm uppercase text-white/70 mb-3">Bonificaciones de Prestigio</h3>
        <div className="space-y-2">
          {[
            {label:"Producción de recursos", val:`+${prestigeLevel*10}%`,   color:"text-green-400"},
            {label:"Velocidad de combate",   val:`+${prestigeLevel*5}%`,    color:"text-primary"},
            {label:"Experiencia ganada",     val:`+${prestigeLevel*15}%`,   color:"text-secondary"},
            {label:"Multiplicador idle",     val:`${multiplier.toFixed(1)}x`,color:"text-accent"},
          ].map(b=>(
            <div key={b.label} className="flex justify-between items-center">
              <span className="text-xs text-muted-foreground">{b.label}</span>
              <span className={cn("text-xs font-bold",b.color)}>{b.val}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
