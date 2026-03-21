import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Users, Search, Plus, MessageCircle, Shield, Star, Send } from "lucide-react";
import { cn } from "@/lib/utils";
import { RESOURCE_ICONS, NAV_ICONS, CLAN_ICONS } from "@/lib/icons";

const MOCK_CLANS = [
  { id:1, name:"Cosmic Voyagers",  desc:"¡Explorando lo desconocido!", level:12, members:45, max:50, emblemSrc:CLAN_ICONS.stellar_wolves, isJoined:false, power:45200, rank:"Gold"   },
  { id:2, name:"Nebula Knights",   desc:"Solo combatientes feroces.",   level:8,  members:20, max:30, emblemSrc:CLAN_ICONS.dragon_knights, isJoined:true,  power:28900, rank:"Silver" },
  { id:3, name:"Tech Syndicate",   desc:"Clan nativo de Aitherium.",    level:15, members:50, max:50, emblemSrc:CLAN_ICONS.singularity_seekers, isJoined:false, power:68000, rank:"Diamond"},
  { id:4, name:"Solar Guardians",  desc:"Guardianes del Sistema.",      level:5,  members:12, max:25, emblemSrc:CLAN_ICONS.nova_collective, isJoined:false, power:14200, rank:"Silver" },
  { id:5, name:"Void Reapers",     desc:"Del vacío emergemos.",         level:20, members:48, max:50, emblemSrc:CLAN_ICONS.iron_forge, isJoined:false, power:92000, rank:"Legend" },
];

const MY_CLAN = MOCK_CLANS.find(c=>c.isJoined)!;

const CHAT_HISTORY = [
  { id:1, user:"StarKnight",   avatar:"⭐", text:"¡Buenas a todos!", time:"10:23" },
  { id:2, user:"TúPlayer",     avatar:"🧑‍🚀", text:"¡Hola equipo!", time:"10:24", isMe:true },
  { id:3, user:"CosmicDragon", avatar:"🐉", text:"¿Alguien para el raid de esta noche?", time:"10:28" },
  { id:4, user:"StarKnight",   avatar:"⭐", text:"Yo estoy 🙋", time:"10:29" },
  { id:5, user:"NebulaMage",   avatar:"🔮", text:"Acabo de subir al nivel 45 🎉", time:"10:35" },
];

const MEMBERS = [
  { name:"CosmicDragon", avatar:"🐉", role:"Líder",    level:45, power:12400 },
  { name:"StarKnight",   avatar:"⭐", role:"Officer",  level:38, power:9800  },
  { name:"NebulaMage",   avatar:"🔮", role:"Member",   level:31, power:7200  },
  { name:"TúPlayer",     avatar:"🧑‍🚀", role:"Member",  level:24, power:4900  },
  { name:"VoidWalker",   avatar:"🌑", role:"Member",   level:22, power:4200  },
];

const RANK_COLOR: Record<string,string> = {
  Silver:"hsl(210 20% 70%)", Gold:"hsl(45 100% 55%)", Diamond:"hsl(193 100% 70%)", Legend:"hsl(280 90% 75%)"
};

const TABS = ["Mi Clan","Buscar","Crear"] as const;
const CLAN_TABS = ["Info","Chat","Miembros"] as const;
type Tab = typeof TABS[number];
type ClanTab = typeof CLAN_TABS[number];

export default function Clans() {
  const [tab, setTab] = useState<Tab>("Mi Clan");
  const [clanTab, setClanTab] = useState<ClanTab>("Info");
  const [search, setSearch] = useState("");
  const [msg, setMsg] = useState("");
  const [chat, setChat] = useState(CHAT_HISTORY);
  const [hasJoined, setHasJoined] = useState(true);
  const chatRef = useRef<HTMLDivElement>(null);

  // Create form state
  const [createForm, setCreateForm] = useState({ name:"", desc:"", emblemSrc:CLAN_ICONS.stellar_wolves as string, isPublic:true });
  const EMBLEM_SRCS = [CLAN_ICONS.stellar_wolves, CLAN_ICONS.ancient_guardians, CLAN_ICONS.nova_collective, CLAN_ICONS.iron_forge, CLAN_ICONS.dragon_knights, CLAN_ICONS.singularity_seekers];

  useEffect(()=>{ if(chatRef.current) chatRef.current.scrollTop = 99999; },[chat]);

  const sendMsg = () => {
    if(!msg.trim()) return;
    setChat(prev=>[...prev, { id:Date.now(), user:"TúPlayer", avatar:"🧑‍🚀", text:msg, time:new Date().toLocaleTimeString('es',{hour:'2-digit',minute:'2-digit'}), isMe:true }]);
    setMsg("");
  };

  const filtered = MOCK_CLANS.filter(c => c.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-3 bg-blue-500/20 rounded-2xl">
          <img src={NAV_ICONS.clan} alt="clans" className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-2xl font-display uppercase">Clanes</h1>
          <p className="text-xs text-muted-foreground">Únete a la batalla colectiva</p>
        </div>
      </div>

      {/* Main tabs */}
      <div className="flex gap-2">
        {TABS.map(t=>(
          <button key={t} onClick={()=>setTab(t)}
            className={cn(
              "flex-1 py-2.5 rounded-2xl font-display text-xs uppercase tracking-wide transition-all border",
              tab===t
                ? "bg-primary/20 border-primary/50 text-primary"
                : "bg-white/5 border-white/10 text-muted-foreground hover:text-white"
            )}>{t==="Mi Clan"?<>🛡️ Mi Clan</>:t==="Buscar"?<>🔍 Buscar</>:<>➕ Crear</>}</button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={tab} initial={{opacity:0,y:8}} animate={{opacity:1,y:0}} exit={{opacity:0}} transition={{duration:0.15}}>

          {/* ─── MI CLAN ─── */}
          {tab==="Mi Clan" && (
            <div className="space-y-4">
              {hasJoined ? (<>
                {/* Clan banner */}
                <div className="rounded-3xl p-5 relative overflow-hidden border-2"
                  style={{ background:"linear-gradient(135deg, rgba(30,20,80,0.9), rgba(10,14,39,0.9))", borderColor:"rgba(99,102,241,0.5)" }}>
                  <div className="absolute top-0 right-0 -mr-6 -mt-6 w-28 h-28 bg-indigo-500/10 rounded-full blur-3xl" />
                  <div className="flex items-center gap-4 relative z-10">
                    <div className="w-16 h-16 rounded-2xl flex items-center justify-center border border-indigo-500/30 bg-black/30">
                      <img src={MY_CLAN.emblemSrc} alt="" className="w-10 h-10" />
                    </div>
                    <div>
                      <h2 className="text-xl font-display text-white">{MY_CLAN.name}</h2>
                      <p className="text-xs text-indigo-300">{MY_CLAN.desc}</p>
                      <div className="flex gap-3 mt-2 text-xs font-bold">
                        <span className="flex items-center gap-1 text-yellow-400"><Star className="w-3 h-3"/>Nv.{MY_CLAN.level}</span>
                        <span className="flex items-center gap-1 text-blue-300"><Users className="w-3 h-3"/>{MY_CLAN.members}/{MY_CLAN.max}</span>
                        <span className="flex items-center gap-1" style={{ color:RANK_COLOR[MY_CLAN.rank] }}>
                          <Shield className="w-3 h-3"/>{MY_CLAN.rank}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Clan inner tabs */}
                <div className="flex gap-2">
                  {CLAN_TABS.map(ct=>(
                    <button key={ct} onClick={()=>setClanTab(ct)}
                      className={cn(
                        "flex-1 py-2 rounded-xl font-display text-[10px] uppercase tracking-wide transition-all border",
                        clanTab===ct
                          ? "bg-indigo-500/20 border-indigo-500/50 text-indigo-400"
                          : "bg-white/5 border-white/10 text-muted-foreground"
                      )}>{ct}</button>
                  ))}
                </div>

                {/* Info */}
                {clanTab==="Info" && (
                  <div className="space-y-3">
                    <div className="glass-panel rounded-2xl p-4 grid grid-cols-2 gap-3">
                      {[
                        {label:"Poder Total",  val:MY_CLAN.power.toLocaleString(), emoji:"⚡"},
                        {label:"Nivel",        val:MY_CLAN.level,   emoji:"⭐"},
                        {label:"Miembros",     val:`${MY_CLAN.members}/${MY_CLAN.max}`, emoji:"👥"},
                        {label:"Rango",        val:MY_CLAN.rank,    emoji:"🏆"},
                      ].map(s=>(
                        <div key={s.label} className="bg-black/20 rounded-xl p-3 text-center">
                          <span className="text-xl block mx-auto mb-1">{s.emoji}</span>
                          <div className="font-display text-sm text-white">{s.val}</div>
                          <div className="text-[9px] text-muted-foreground">{s.label}</div>
                        </div>
                      ))}
                    </div>

                    {/* Raid & events */}
                    <div className="glass-panel rounded-2xl p-4">
                      <div className="font-display text-xs text-white/70 uppercase mb-2">Eventos Activos</div>
                      <div className="space-y-2">
                        {([
                          {name:"Raid Galáctico",   time:"Hoy 22:00", rewardSrc:RESOURCE_ICONS.diamonds, rewardEmoji:undefined as string|undefined, rewardText:"x100", color:"text-accent"},
                          {name:"Liga de Clanes",   time:"3 días",    rewardSrc:undefined as string|undefined, rewardEmoji:"🏆", rewardText:"Trofeo",color:"text-yellow-400"},
                        ]).map(e=>(
                          <div key={e.name} className="flex items-center justify-between bg-black/20 rounded-xl px-3 py-2">
                            <div>
                              <div className="text-xs text-white font-bold">{e.name}</div>
                              <div className="text-[10px] text-muted-foreground">{e.time}</div>
                            </div>
                            <span className={cn("text-xs font-bold flex items-center gap-0.5", e.color)}>{e.rewardSrc ? <img src={e.rewardSrc} alt="" className="w-4 h-4 inline" /> : <span>{e.rewardEmoji}</span>}{e.rewardText}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <button onClick={()=>setHasJoined(false)}
                      className="w-full py-2.5 rounded-2xl font-display text-xs uppercase tracking-wide bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 transition-colors">
                      Salir del Clan
                    </button>
                  </div>
                )}

                {/* Chat */}
                {clanTab==="Chat" && (
                  <div className="glass-panel rounded-2xl overflow-hidden flex flex-col" style={{ height:320 }}>
                    <div ref={chatRef} className="flex-1 overflow-y-auto p-3 space-y-2 custom-scrollbar">
                      {chat.map(m=>(
                        <div key={m.id} className={cn("flex items-start gap-2", (m as any).isMe && "flex-row-reverse")}>
                          <div className="text-xl shrink-0">{m.avatar}</div>
                          <div className={cn("max-w-[70%]", (m as any).isMe && "items-end flex flex-col")}>
                            {!(m as any).isMe && (
                              <div className="text-[9px] text-muted-foreground mb-0.5 font-display">{m.user}</div>
                            )}
                            <div className={cn(
                              "rounded-2xl px-3 py-2 text-xs",
                              (m as any).isMe
                                ? "bg-primary/20 text-white border border-primary/30 rounded-tr-sm"
                                : "bg-white/5 text-white border border-white/10 rounded-tl-sm"
                            )}>
                              {m.text}
                            </div>
                            <div className="text-[9px] text-muted-foreground mt-0.5">{m.time}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="flex gap-2 p-2 border-t border-white/10">
                      <input value={msg} onChange={e=>setMsg(e.target.value)}
                        onKeyDown={e=>e.key==="Enter"&&sendMsg()}
                        placeholder="Escribe un mensaje..."
                        className="flex-1 bg-black/30 rounded-xl px-3 py-2 text-xs text-white outline-none border border-white/10 focus:border-primary/50 transition-colors" />
                      <button onClick={sendMsg}
                        className="p-2 rounded-xl bg-primary/20 border border-primary/30 text-primary hover:bg-primary/30 transition-colors">
                        <Send className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}

                {/* Miembros */}
                {clanTab==="Miembros" && (
                  <div className="space-y-2">
                    {MEMBERS.map((m,i)=>(
                      <div key={m.name}
                        className={cn("glass-panel rounded-2xl p-3 flex items-center gap-3",
                          m.name==="TúPlayer" && "border border-primary/30 bg-primary/5")}>
                        <div className="text-3xl">{m.avatar}</div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-display text-sm text-white">{m.name}</span>
                            {m.name==="TúPlayer" && <span className="text-[9px] text-primary font-display">TÚ</span>}
                            <span className="text-[9px] px-1.5 py-0.5 rounded bg-white/10 text-muted-foreground font-display">{m.role}</span>
                          </div>
                          <div className="text-[10px] text-muted-foreground flex items-center gap-0.5">Nv.{m.level} • <img src={RESOURCE_ICONS.energy} alt="" className="w-3 h-3 inline" />{m.power.toLocaleString()}</div>
                        </div>
                        <div className="text-xs font-display text-muted-foreground">#{i+1}</div>
                      </div>
                    ))}
                  </div>
                )}
              </>) : (
                <div className="glass-panel rounded-3xl p-6 text-center">
                  <img src={NAV_ICONS.clan} alt="" className="w-12 h-12 mx-auto mb-3" />
                  <h3 className="font-display text-white mb-1">Sin clan</h3>
                  <p className="text-xs text-muted-foreground mb-4">Únete o crea un clan para competir</p>
                  <div className="flex gap-2">
                    <button onClick={()=>setTab("Buscar")}
                      className="flex-1 py-2.5 rounded-2xl font-display text-xs uppercase bg-primary/20 border border-primary/30 text-primary">
                      Buscar Clan
                    </button>
                    <button onClick={()=>setTab("Crear")}
                      className="flex-1 py-2.5 rounded-2xl font-display text-xs uppercase bg-secondary/20 border border-secondary/30 text-secondary">
                      Crear Clan
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ─── BUSCAR ─── */}
          {tab==="Buscar" && (
            <div className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input value={search} onChange={e=>setSearch(e.target.value)}
                  placeholder="Buscar clan..."
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm text-white bg-card border border-card-border focus:border-primary/50 outline-none transition-colors" />
              </div>

              <div className="flex gap-1.5 flex-wrap">
                {["Todos","Gold","Diamond","Legend"].map(f=>(
                  <button key={f} className="text-[10px] px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-muted-foreground hover:text-white transition-colors font-display">
                    {f}
                  </button>
                ))}
              </div>

              <div className="space-y-3">
                {filtered.map(clan=>{
                  const full = clan.members>=clan.max;
                  const rankCol = RANK_COLOR[clan.rank]??"#fff";
                  return (
                    <div key={clan.id} className="glass-panel rounded-2xl p-4 flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl flex items-center justify-center border border-white/10 bg-black/30 shrink-0">
                        <img src={clan.emblemSrc} alt="" className="w-7 h-7" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="font-display text-sm text-white truncate">{clan.name}</span>
                          <span className="text-[9px] px-1.5 rounded font-display shrink-0"
                            style={{ background:`${rankCol}22`, color:rankCol }}>{clan.rank}</span>
                        </div>
                        <div className="text-[10px] text-muted-foreground mb-1 truncate">{clan.desc}</div>
                        <div className="flex gap-2 text-[9px] text-muted-foreground">
                          <span>Nv.{clan.level}</span>
                          <span className={full?"text-red-400":"text-green-400"}>{clan.members}/{clan.max}</span>
                          <span className="inline-flex items-center gap-0.5"><img src={RESOURCE_ICONS.energy} alt="" className="w-3 h-3 inline" />{clan.power.toLocaleString()}</span>
                        </div>
                      </div>
                      <button
                        disabled={full||clan.isJoined}
                        onClick={()=>{ if(!full){ setHasJoined(true); setTab("Mi Clan"); } }}
                        className={cn(
                          "shrink-0 py-1.5 px-3 rounded-xl font-display text-[10px] uppercase transition-all",
                          clan.isJoined ? "bg-green-500/20 border border-green-500/30 text-green-400" :
                          full ? "bg-white/5 text-white/30 cursor-not-allowed" :
                          "bg-primary/20 border border-primary/30 text-primary hover:bg-primary/30"
                        )}>
                        {clan.isJoined?"Unido":full?"Lleno":"Unirse"}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ─── CREAR ─── */}
          {tab==="Crear" && (
            <div className="space-y-4">
              <div className="glass-panel rounded-3xl p-5">
                <h3 className="font-display text-base text-white uppercase mb-4 flex items-center gap-2">
                  <Plus className="w-4 h-4 text-secondary" /> Crear Nuevo Clan
                </h3>

                {/* Emblem picker */}
                <div className="mb-4">
                  <label className="text-[10px] font-display text-muted-foreground uppercase block mb-2">Emblema</label>
                  <div className="flex gap-2 flex-wrap">
                    {EMBLEM_SRCS.map(src=>(
                      <button key={src} onClick={()=>setCreateForm(f=>({...f,emblemSrc:src}))}
                        className={cn(
                          "w-10 h-10 rounded-xl flex items-center justify-center transition-all border-2",
                          createForm.emblemSrc===src
                            ? "border-primary bg-primary/20 scale-110"
                            : "border-white/10 bg-white/5 hover:border-white/30"
                        )}><img src={src} alt="" className="w-6 h-6" /></button>
                    ))}
                  </div>
                </div>

                {/* Preview */}
                <div className="bg-black/20 rounded-2xl p-3 mb-4 flex items-center gap-3">
                  <img src={createForm.emblemSrc} alt="" className="w-8 h-8" />
                  <div>
                    <div className="font-display text-sm text-white">{createForm.name||"Nombre del Clan"}</div>
                    <div className="text-[10px] text-muted-foreground">{createForm.desc||"Descripción..."}</div>
                    <div className="text-[9px] text-green-400 mt-0.5">Nivel 1 • 0/50 miembros</div>
                  </div>
                </div>

                {/* Form fields */}
                <div className="space-y-3">
                  <div>
                    <label className="text-[10px] font-display text-muted-foreground uppercase block mb-1">Nombre del Clan</label>
                    <input value={createForm.name}
                      onChange={e=>setCreateForm(f=>({...f,name:e.target.value}))}
                      placeholder="Ej: Cosmic Legends"
                      maxLength={20}
                      className="w-full bg-black/30 rounded-xl px-3 py-2.5 text-sm text-white outline-none border border-white/10 focus:border-primary/50 transition-colors" />
                  </div>
                  <div>
                    <label className="text-[10px] font-display text-muted-foreground uppercase block mb-1">Descripción</label>
                    <textarea value={createForm.desc}
                      onChange={e=>setCreateForm(f=>({...f,desc:e.target.value}))}
                      placeholder="Describe tu clan..."
                      maxLength={60}
                      rows={2}
                      className="w-full bg-black/30 rounded-xl px-3 py-2.5 text-sm text-white outline-none border border-white/10 focus:border-primary/50 transition-colors resize-none" />
                  </div>
                  <div>
                    <label className="text-[10px] font-display text-muted-foreground uppercase block mb-2">Privacidad</label>
                    <div className="flex gap-2">
                      {[{val:true,label:"🌐 Público"},{val:false,label:"🔒 Privado"}].map(opt=>(
                        <button key={String(opt.val)} onClick={()=>setCreateForm(f=>({...f,isPublic:opt.val}))}
                          className={cn(
                            "flex-1 py-2 rounded-xl font-display text-xs uppercase border transition-all",
                            createForm.isPublic===opt.val
                              ? "bg-primary/20 border-primary/50 text-primary"
                              : "bg-white/5 border-white/10 text-muted-foreground"
                          )}>{opt.label}</button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-4 p-3 rounded-xl bg-black/20 text-[10px] text-muted-foreground flex items-start gap-2">
                  <img src={RESOURCE_ICONS.diamonds} alt="diamonds" className="w-4 h-4" />
                  <span>Costo de creación: <strong className="text-accent">500 Diamantes</strong></span>
                </div>

                <button
                  disabled={!createForm.name.trim()}
                  onClick={()=>{ if(createForm.name.trim()){ setHasJoined(true); setTab("Mi Clan"); } }}
                  className={cn(
                    "w-full mt-4 py-3 rounded-2xl font-display text-sm uppercase tracking-wide transition-all",
                    createForm.name.trim()
                      ? "bg-gradient-to-r from-secondary to-primary text-white shadow-[0_0_15px_rgba(0,212,255,0.3)]"
                      : "bg-white/5 text-white/30 cursor-not-allowed"
                  )}>
                  Crear Clan — <img src={RESOURCE_ICONS.diamonds} alt="diamonds" className="w-4 h-4 inline" />500
                </button>
              </div>
            </div>
          )}

        </motion.div>
      </AnimatePresence>
    </div>
  );
}
