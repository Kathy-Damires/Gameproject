import React, { useState } from "react";
import { Search, Lock } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const ERA_TABS = ["Piedra","Tribal","Bronce","Clásica","Medieval","Industrial","Robótica","Espacial","Singularidad"];

const CARDS_BY_ERA: Record<string, Array<{id:number;name:string;rarity:string;isOwned:boolean;emoji:string;bonus:string}>> = {
  "Piedra": [
    {id:1, name:"Cazador Primitivo", rarity:"common",    isOwned:true,  emoji:"🏹", bonus:"ATK +5"},
    {id:2, name:"Roca Sagrada",      rarity:"common",    isOwned:true,  emoji:"🪨", bonus:"DEF +8"},
    {id:3, name:"Cueva Ancestral",   rarity:"clear",     isOwned:true,  emoji:"🏔️", bonus:"HP +50"},
    {id:4, name:"Fuego Primordial",  rarity:"clear",     isOwned:false, emoji:"🔥", bonus:"ATK +15"},
    {id:5, name:"Mamut Salvaje",     rarity:"epic",      isOwned:true,  emoji:"🦣", bonus:"ATK+35, HP+80"},
    {id:6, name:"Espíritu del Origen",rarity:"legendary",isOwned:false, emoji:"✨", bonus:"Todo +25%"},
    {id:7, name:"Pescador Tribal",   rarity:"common",    isOwned:true,  emoji:"🎣", bonus:"Comida+10%"},
    {id:8, name:"Tallador de Flint", rarity:"common",    isOwned:false, emoji:"🗿", bonus:"DEF +4"},
    {id:9, name:"Recolector Nómada", rarity:"clear",     isOwned:true,  emoji:"🌿", bonus:"Recursos+20%"},
  ],
  "Tribal": [
    {id:10,name:"Chamán",            rarity:"epic",      isOwned:false, emoji:"🧙", bonus:"XP +30%"},
    {id:11,name:"Guerrero Tribal",   rarity:"common",    isOwned:true,  emoji:"⚔️", bonus:"ATK +12"},
    {id:12,name:"Tótem del Clan",    rarity:"clear",     isOwned:true,  emoji:"🪵", bonus:"DEF +20"},
    {id:13,name:"Danza de Guerra",   rarity:"legendary", isOwned:false, emoji:"💃", bonus:"ATK+50,VEL+25%"},
    {id:14,name:"Arco Largo",        rarity:"common",    isOwned:true,  emoji:"🏹", bonus:"ATK +18"},
    {id:15,name:"Escudo de Cuero",   rarity:"common",    isOwned:false, emoji:"🛡️", bonus:"DEF +15"},
    {id:16,name:"Curandero",         rarity:"clear",     isOwned:true,  emoji:"💊", bonus:"HP regen 5/s"},
    {id:17,name:"Bestia Domada",     rarity:"epic",      isOwned:false, emoji:"🐺", bonus:"ATK+40,HP+100"},
    {id:18,name:"Ritual Ancestral",  rarity:"legendary", isOwned:false, emoji:"🌀", bonus:"Prestigio+1"},
  ],
  "Bronce": [
    {id:19,name:"Herrero",           rarity:"common",    isOwned:true,  emoji:"🔨", bonus:"Bronce+20%"},
    {id:20,name:"Espada de Bronce",  rarity:"clear",     isOwned:true,  emoji:"🗡️", bonus:"ATK +30"},
    {id:21,name:"Carro de Guerra",   rarity:"epic",      isOwned:true,  emoji:"🏇", bonus:"ATK+55,VEL+30%"},
    {id:22,name:"Forja Mística",     rarity:"legendary", isOwned:false, emoji:"⚙️", bonus:"Estructuras+50%"},
    {id:23,name:"Mercader",          rarity:"common",    isOwned:true,  emoji:"🧳", bonus:"Diamantes+10%"},
    {id:24,name:"Catapulta",         rarity:"clear",     isOwned:false, emoji:"🏰", bonus:"ATK área +25"},
    {id:25,name:"Oráculo",           rarity:"epic",      isOwned:false, emoji:"🔮", bonus:"XP +50%"},
    {id:26,name:"Rey de Bronce",     rarity:"legendary", isOwned:false, emoji:"👑", bonus:"Multiplicador x2"},
    {id:27,name:"Ballesta",          rarity:"common",    isOwned:true,  emoji:"🏹", bonus:"ATK +22"},
  ],
};

// From Unity CardSystem — rarity colors
const RARITY_CONFIG: Record<string, {border:string;bg:string;text:string;label:string}> = {
  common:    {border:"hsl(210 20% 60%)",    bg:"from-slate-700 to-slate-800",   text:"hsl(210 20% 70%)", label:"Común"},
  clear:     {border:"hsl(193 100% 50%)",   bg:"from-cyan-900 to-cyan-950",     text:"hsl(193 100% 60%)",label:"Clara"},
  epic:      {border:"hsl(280 90% 65%)",    bg:"from-purple-900 to-purple-950", text:"hsl(280 90% 75%)", label:"Épica"},
  legendary: {border:"hsl(45 100% 55%)",   bg:"from-yellow-900 to-yellow-950", text:"hsl(45 100% 65%)", label:"Legendaria"},
};

export default function Collection() {
  const [currentEra, setCurrentEra] = useState("Piedra");
  const [search, setSearch] = useState("");

  const cards = CARDS_BY_ERA[currentEra] || [];
  const filtered = cards.filter(c => c.name.toLowerCase().includes(search.toLowerCase()));
  const owned = cards.filter(c => c.isOwned).length;

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display text-gradient uppercase">Álbum de Cartas</h1>
          <p className="text-xs text-muted-foreground">Porera — {owned}/{cards.length} coleccionadas</p>
        </div>
      </div>

      {/* Progress */}
      <div className="glass-panel rounded-2xl px-4 py-3">
        <div className="flex justify-between text-[10px] text-muted-foreground mb-1.5">
          <span className="font-display uppercase">{currentEra}</span>
          <span className="font-display text-primary">{owned}/{cards.length}</span>
        </div>
        <div className="w-full h-2 rounded-full bg-black/40 overflow-hidden">
          <motion.div className="h-full rounded-full bg-gradient-to-r from-primary to-secondary"
            animate={{ width: `${cards.length ? (owned / cards.length) * 100 : 0}%` }} />
        </div>
      </div>

      {/* Era tabs */}
      <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {ERA_TABS.map(era => (
          <button key={era} onClick={() => setCurrentEra(era)}
            className={cn(
              "shrink-0 px-3 py-1.5 rounded-xl text-[10px] font-display uppercase tracking-wide transition-all border",
              currentEra === era
                ? "bg-primary/20 border-primary/50 text-primary"
                : "bg-white/5 border-white/10 text-muted-foreground hover:text-white"
            )}>{era}</button>
        ))}
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Buscar cartas..."
          className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm text-white placeholder-muted-foreground outline-none
            bg-card border border-card-border focus:border-primary/50 transition-colors" />
      </div>

      {/* Cards grid */}
      <div className="grid grid-cols-3 gap-3">
        {filtered.map((card, i) => {
          const rc = RARITY_CONFIG[card.rarity];
          return (
            <motion.div key={card.id}
              initial={{ opacity:0, scale:0.88 }} animate={{ opacity:1, scale:1 }}
              transition={{ delay:i*0.04 }}
              className={cn(
                "aspect-[3/4] rounded-2xl border-2 relative overflow-hidden cursor-pointer transition-all",
                card.isOwned
                  ? `bg-gradient-to-br ${rc.bg} hover:scale-105 hover:-translate-y-1`
                  : "bg-card/50 border-white/10 grayscale opacity-50"
              )}
              style={{ borderColor: card.isOwned ? rc.border : undefined,
                boxShadow: card.isOwned ? `0 0 12px ${rc.border}44` : undefined }}>

              {/* Holographic shimmer */}
              {card.isOwned && (
                <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/10 to-white/0 opacity-60" />
              )}

              <div className="absolute inset-1.5 flex flex-col">
                {/* Rarity */}
                <div className="text-right">
                  <span className="text-[8px] font-display uppercase"
                    style={{ color: card.isOwned ? rc.text : "#555" }}>
                    {rc.label}
                  </span>
                </div>

                {/* Art */}
                <div className="flex-1 flex items-center justify-center">
                  {card.isOwned
                    ? <span className="text-3xl drop-shadow-lg">{card.emoji}</span>
                    : <Lock className="w-5 h-5 text-white/20" />}
                </div>

                {/* Name + bonus */}
                <div className="text-center">
                  <div className="text-[9px] font-display text-white leading-tight">
                    {card.isOwned ? card.name : "???"}
                  </div>
                  {card.isOwned && (
                    <div className="text-[8px] mt-0.5" style={{ color: rc.text }}>{card.bonus}</div>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12 text-muted-foreground font-display">No se encontraron cartas</div>
      )}
    </div>
  );
}
