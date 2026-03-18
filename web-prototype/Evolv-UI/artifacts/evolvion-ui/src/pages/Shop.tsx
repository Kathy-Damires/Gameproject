import React, { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { ShoppingBag } from "lucide-react";

const TABS = ["Equipamiento","Cartas","Recursos","Especiales"];

const ITEMS: Record<string, Array<{id:number;name:string;icon:string;rarity:string;price:number;currency:string;desc:string;slot?:string}>> = {
  "Equipamiento": [
    {id:1, name:"Espada de Bronce",  icon:"🗡️", rarity:"clear",     price:50,  currency:"💎", desc:"ATK+120, VEL+10",      slot:"weapon"},
    {id:2, name:"Armadura Tribal",   icon:"🛡️", rarity:"epic",      price:200, currency:"💎", desc:"DEF+180, HP+300",      slot:"armor"},
    {id:3, name:"Casco de Guerrero", icon:"🪖", rarity:"common",    price:20,  currency:"💎", desc:"DEF+45, HP+80",        slot:"helmet"},
    {id:4, name:"Amuleto Legendario",icon:"📿", rarity:"legendary", price:500, currency:"💎", desc:"ATK+85, DEF+85, HP+150",slot:"gadget"},
  ],
  "Cartas": [
    {id:5, name:"Pack Era Piedra",   icon:"🃏", rarity:"common",    price:100, currency:"🪨", desc:"3 cartas garantizadas"},
    {id:6, name:"Pack Era Bronce",   icon:"🃏", rarity:"clear",     price:300, currency:"🥉", desc:"5 cartas, 1 épica"},
    {id:7, name:"Pack Legendario",   icon:"🃏", rarity:"legendary", price:100, currency:"💎", desc:"5 cartas, 1 legendaria"},
  ],
  "Recursos": [
    {id:8,  name:"Bolsa de Piedra",  icon:"🪨", rarity:"common",    price:5,   currency:"💎", desc:"×1000 Piedra"},
    {id:9,  name:"Bolsa de Madera",  icon:"🪵", rarity:"common",    price:5,   currency:"💎", desc:"×1000 Madera"},
    {id:10, name:"Pack de Energía",  icon:"⚡", rarity:"clear",     price:15,  currency:"💎", desc:"×500 Energía"},
    {id:11, name:"Paquete Premium",  icon:"💼", rarity:"epic",      price:50,  currency:"💎", desc:"×2000 de todos"},
  ],
  "Especiales": [
    {id:12, name:"Slot Constructor", icon:"🏗️", rarity:"epic",      price:80,  currency:"💎", desc:"Slot extra de construcción"},
    {id:13, name:"Acelerador ×2",    icon:"⏩", rarity:"clear",     price:30,  currency:"💎", desc:"Producción ×2 por 1 hora"},
    {id:14, name:"Renacimiento",     icon:"✨", rarity:"legendary", price:200, currency:"💎", desc:"Reinicia con bonos de prestigio"},
  ],
};

const RARITY_CONFIG: Record<string,{border:string;bg:string;label:string;text:string}> = {
  common:    {border:"hsl(210 20% 60%)", bg:"from-slate-700/50 to-slate-800/50", label:"Común",    text:"hsl(210 20% 70%)"},
  clear:     {border:"hsl(193 100% 50%)",bg:"from-cyan-900/60 to-cyan-950/60",   label:"Clara",     text:"hsl(193 100% 65%)"},
  epic:      {border:"hsl(280 90% 65%)", bg:"from-purple-900/60 to-purple-950/60",label:"Épica",    text:"hsl(280 90% 75%)"},
  legendary: {border:"hsl(45 100% 55%)", bg:"from-yellow-900/60 to-amber-950/60",label:"Legendaria",text:"hsl(45 100% 65%)"},
};

export default function Shop() {
  const [tab, setTab] = useState("Equipamiento");
  const [diamonds] = useState(42);
  const items = ITEMS[tab] || [];

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="glass-panel p-4 rounded-3xl flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display uppercase flex items-center gap-2">
            <ShoppingBag className="w-6 h-6 text-primary" /> Tienda
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">Items exclusivos del juego</p>
        </div>
        <div className="flex items-center gap-1.5 glass-panel px-3 py-1.5 rounded-xl">
          <span>💎</span>
          <span className="font-display text-sm text-accent">{diamonds}</span>
        </div>
      </div>

      {/* Special banner */}
      <div className="rounded-3xl p-4 relative overflow-hidden"
        style={{ background:"linear-gradient(135deg, rgba(123,47,252,0.4), rgba(26,10,46,0.9))", border:"1px solid rgba(123,47,252,0.4)" }}>
        <div className="absolute right-3 top-3 text-4xl opacity-20">🌟</div>
        <p className="text-[10px] font-display text-secondary uppercase mb-1">Oferta Especial</p>
        <h3 className="font-display text-white mb-1">Pack Legendario</h3>
        <div className="flex items-center gap-2">
          <span className="text-xs line-through text-muted-foreground">💎 200</span>
          <span className="text-sm font-display text-accent">💎 100</span>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-red-500/20 text-red-400 font-display">-50%</span>
        </div>
      </div>

      {/* Category tabs */}
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

      {/* Items */}
      <div className="grid grid-cols-2 gap-3">
        {items.map((item,i)=>{
          const rc = RARITY_CONFIG[item.rarity];
          const canBuy = diamonds >= item.price;
          return (
            <motion.div key={item.id}
              initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }}
              transition={{ delay:i*0.06 }}
              className={cn("glass-panel rounded-2xl p-4 flex flex-col border-2 bg-gradient-to-br", rc.bg)}
              style={{ borderColor:`${rc.border}55` }}>
              <div className="flex items-start justify-between mb-2">
                <span className="text-3xl">{item.icon}</span>
                <span className="text-[9px] px-1.5 py-0.5 rounded font-display"
                  style={{ background:`${rc.border}22`, color:rc.text }}>{rc.label}</span>
              </div>
              <div className="font-display text-xs text-white mb-0.5 leading-tight">{item.name}</div>
              <p className="text-[10px] text-muted-foreground mb-2 flex-1">{item.desc}</p>
              {item.slot && <div className="text-[9px] text-muted-foreground mb-1.5 uppercase font-display">Slot: {item.slot}</div>}
              <button
                className={cn(
                  "w-full py-2 rounded-xl font-display text-[10px] uppercase tracking-wide transition-all",
                  canBuy
                    ? "text-black shadow-[0_0_12px_currentColor]"
                    : "bg-white/5 text-white/30 cursor-not-allowed"
                )}
                style={ canBuy ? { background:`linear-gradient(135deg, ${rc.border}, ${rc.border}aa)` } : undefined}>
                {item.currency} {item.price} — Comprar
              </button>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
