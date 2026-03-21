// @ts-nocheck
import { useState } from "react";
// @ts-ignore
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "wouter";
import { ArrowLeft, ArrowRight, ChevronDown, Maximize2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";
import { RESOURCE_ICONS, NAV_ICONS, BADGE_ICONS, SHOP_ICONS, DAILY_ICONS, CLAN_ICONS } from "@/lib/icons";

/* ═══════════════════════════════════════════════════════════════
   TYPES
   ═══════════════════════════════════════════════════════════════ */
interface FlowStep {
  title: string;
  description: string;
  screen: () => JSX.Element;
}

interface Flow {
  id: string;
  name: string;
  icon: string;
  color: string;
  description: string;
  category: string;
  steps: FlowStep[];
}

/* ═══════════════════════════════════════════════════════════════
   GAME DATA — Single source of truth
   ═══════════════════════════════════════════════════════════════ */

// ── ERA DATA ──
const ERAS = [
  { name: "Piedra",       color: "#8B8378", emoji: "🪨", resource: "Piedra",      structure: "Cantera",           structIcon: "⛏️", resIcon: "stone"   },
  { name: "Tribal",       color: "#6B8E23", emoji: "🏕️", resource: "Madera",      structure: "Aserradero",        structIcon: "🪚", resIcon: "wood"    },
  { name: "Bronce",       color: "#CD7F32", emoji: "🔥", resource: "Comida",      structure: "Granja",            structIcon: "🌾", resIcon: "food"    },
  { name: "Clásica",      color: "#DAA520", emoji: "🏛️", resource: "Bronce",      structure: "Forja de Bronce",   structIcon: "🔥", resIcon: "bronze"  },
  { name: "Medieval",     color: "#4A4A4A", emoji: "🏰", resource: "Hierro",      structure: "Herrería",          structIcon: "⚒️", resIcon: "iron"    },
  { name: "Industrial",   color: "#FFD700", emoji: "⚙️", resource: "Oro",         structure: "Mina de Oro",       structIcon: "🪙", resIcon: "gold"    },
  { name: "Robótica",     color: "#00CED1", emoji: "🤖", resource: "Cristal",     structure: "Extractor Cristal", structIcon: "💠", resIcon: "crystal"  },
  { name: "Espacial",     color: "#9B00FF", emoji: "🚀", resource: "Plasma",      structure: "Reactor Plasma",    structIcon: "🔮", resIcon: "plasma"   },
  { name: "Singularidad", color: "#FF00FF", emoji: "🌀", resource: "Antimateria", structure: "Nexo Cuántico",     structIcon: "🌀", resIcon: "antimatter" },
];

// ── ERA REQUIREMENTS ──
const ERA_REQUIREMENTS: Record<number, { label: string; met: boolean }[]> = {
  0: [{ label: "Cantera Nv.3+", met: true }, { label: "Aserradero Nv.3+", met: true }, { label: "200 Piedra", met: true }, { label: "150 Madera", met: true }],
  1: [{ label: "Granja Nv.3+", met: false }, { label: "Cantera Nv.5+", met: true }, { label: "Aserradero Nv.5+", met: false }, { label: "500 Piedra", met: true }, { label: "300 Madera", met: true }],
  2: [{ label: "Forja Nv.3+", met: false }, { label: "Cantera Nv.7+", met: false }, { label: "Granja Nv.5+", met: false }, { label: "100 Bronce", met: true }, { label: "1000 Piedra", met: true }],
  3: [{ label: "Herrería Nv.3+", met: false }, { label: "Forja Nv.5+", met: false }, { label: "200 Hierro", met: false }, { label: "500 Bronce", met: false }],
  4: [{ label: "Mina de Oro Nv.3+", met: false }, { label: "Herrería Nv.5+", met: false }, { label: "100 Oro", met: false }, { label: "500 Hierro", met: false }],
  5: [{ label: "Extractor Nv.3+", met: false }, { label: "Mina de Oro Nv.5+", met: false }, { label: "50 Cristal", met: false }, { label: "300 Oro", met: false }],
  6: [{ label: "Reactor Nv.3+", met: false }, { label: "Extractor Nv.5+", met: false }, { label: "20 Plasma", met: false }, { label: "200 Cristal", met: false }],
  7: [{ label: "Nexo Nv.3+", met: false }, { label: "Reactor Nv.5+", met: false }, { label: "10 Antimateria", met: false }, { label: "100 Plasma", met: false }],
};

// ── ENEMIES PER ERA ──
const ENEMIES_BY_ERA: Record<number, { name: string; emoji: string; hp: number; atk: number; def: number; drops: string; xp: number }[]> = {
  0: [
    { name: "Dientes de Sable", emoji: "🐅", hp: 80, atk: 12, def: 3, drops: "30 Piedra", xp: 30 },
    { name: "Oso Cavernario", emoji: "🐻", hp: 120, atk: 18, def: 5, drops: "50 Piedra, 20 Madera", xp: 50 },
    { name: "Escorpión", emoji: "🦂", hp: 60, atk: 22, def: 2, drops: "Carta Común", xp: 40 },
  ],
  1: [
    { name: "Guerrero Tribal", emoji: "🗡️", hp: 150, atk: 25, def: 8, drops: "40 Madera", xp: 60 },
    { name: "Lobo Gigante", emoji: "🐺", hp: 200, atk: 30, def: 10, drops: "60 Madera, 30 Comida", xp: 80 },
    { name: "Chamán", emoji: "🧙", hp: 180, atk: 35, def: 6, drops: "Carta Clara", xp: 100 },
  ],
  2: [
    { name: "Soldado de Bronce", emoji: "🛡️", hp: 300, atk: 40, def: 15, drops: "50 Bronce", xp: 120 },
    { name: "Jabalí Salvaje", emoji: "🐗", hp: 250, atk: 45, def: 12, drops: "80 Comida", xp: 100 },
    { name: "Mercenario", emoji: "⚔️", hp: 350, atk: 50, def: 18, drops: "Carta Épica", xp: 150 },
  ],
  3: [
    { name: "Minotauro", emoji: "🐂", hp: 500, atk: 60, def: 25, drops: "100 Hierro", xp: 200 },
    { name: "Arpía", emoji: "🦅", hp: 400, atk: 70, def: 15, drops: "80 Bronce", xp: 180 },
    { name: "Gladiador", emoji: "🏟️", hp: 550, atk: 65, def: 30, drops: "Carta Legendaria", xp: 250 },
  ],
  4: [
    { name: "Bandido", emoji: "🗡️", hp: 600, atk: 75, def: 30, drops: "120 Hierro", xp: 300 },
    { name: "Caballero Oscuro", emoji: "🖤", hp: 800, atk: 90, def: 40, drops: "50 Oro", xp: 400 },
    { name: "Dragón Joven", emoji: "🐉", hp: 1000, atk: 100, def: 35, drops: "Carta Épica, 100 Oro", xp: 500 },
  ],
  5: [
    { name: "Gólem de Vapor", emoji: "🤖", hp: 1200, atk: 110, def: 50, drops: "200 Oro", xp: 600 },
    { name: "Robot de Fábrica", emoji: "🏭", hp: 1000, atk: 120, def: 45, drops: "50 Cristal", xp: 550 },
    { name: "Máquina Rebelde", emoji: "⚙️", hp: 1500, atk: 130, def: 55, drops: "Carta Legendaria", xp: 700 },
  ],
  6: [
    { name: "Droide Avanzado", emoji: "🤖", hp: 1800, atk: 140, def: 60, drops: "100 Cristal", xp: 800 },
    { name: "Mech de Combate", emoji: "🦾", hp: 2200, atk: 160, def: 70, drops: "50 Plasma", xp: 1000 },
    { name: "Guardián IA", emoji: "🛡️", hp: 2500, atk: 150, def: 80, drops: "Carta Legendaria, 200 Cristal", xp: 1200 },
  ],
  7: [
    { name: "Kraken Espacial", emoji: "🦑", hp: 3000, atk: 180, def: 80, drops: "100 Plasma", xp: 1500 },
    { name: "Soldado Alienígena", emoji: "👽", hp: 2800, atk: 200, def: 75, drops: "30 Antimateria", xp: 1800 },
    { name: "Bestia del Vacío", emoji: "🌑", hp: 3500, atk: 220, def: 90, drops: "Carta Legendaria, 200 Plasma", xp: 2000 },
  ],
  8: [
    { name: "Entidad Singular", emoji: "💠", hp: 5000, atk: 250, def: 100, drops: "100 Antimateria", xp: 3000 },
    { name: "Espectro Cuántico", emoji: "👻", hp: 4500, atk: 280, def: 90, drops: "200 Antimateria", xp: 3500 },
    { name: "Jefe Final", emoji: "💀", hp: 10000, atk: 350, def: 120, drops: "Skin Legendaria, 500 Antimateria", xp: 5000 },
  ],
};

// ── CARDS PER ERA ──
const CARDS_BY_ERA: Record<number, { name: string; rarity: string }[]> = {
  0: [
    { name: "Lanza Primitiva", rarity: "common" }, { name: "Pintura Rupestre", rarity: "common" }, { name: "Círculo de Piedra", rarity: "common" }, { name: "Llama Eterna", rarity: "common" },
    { name: "Cazador Alfa", rarity: "clear" }, { name: "Refugio de Roca", rarity: "clear" }, { name: "Mamut Sagrado", rarity: "clear" },
    { name: "Mano del Destino", rarity: "epic" }, { name: "Ritual del Origen", rarity: "legendary" },
  ],
  1: [
    { name: "Tótem Ancestral", rarity: "common" }, { name: "Máscara de Guerra", rarity: "common" }, { name: "Danza Ritual", rarity: "common" }, { name: "Tambor de Trueno", rarity: "common" },
    { name: "Bastón del Chamán", rarity: "clear" }, { name: "Estandarte Tribal", rarity: "clear" }, { name: "Collar de Huesos", rarity: "clear" },
    { name: "Bosque Sagrado", rarity: "epic" }, { name: "Juramento de Sangre", rarity: "legendary" },
  ],
  2: [
    { name: "Espada de Bronce", rarity: "common" }, { name: "Horno de Fundición", rarity: "common" }, { name: "Escudo Redondo", rarity: "common" }, { name: "Metal Forjado", rarity: "common" },
    { name: "Caravana Mercante", rarity: "clear" }, { name: "Ídolo Dorado", rarity: "clear" }, { name: "Carro de Guerra", rarity: "clear" },
    { name: "Gremio de Herreros", rarity: "epic" }, { name: "Yelmo del Conquistador", rarity: "legendary" },
  ],
  3: [
    { name: "Columna Dórica", rarity: "common" }, { name: "Toga Senatorial", rarity: "common" }, { name: "Lira de Apolo", rarity: "common" }, { name: "Moneda de Oro", rarity: "common" },
    { name: "Cuadriga Imperial", rarity: "clear" }, { name: "Templo de Mármol", rarity: "clear" }, { name: "Pergamino Antiguo", rarity: "clear" },
    { name: "Tridente de Poseidón", rarity: "epic" }, { name: "Corona del César", rarity: "legendary" },
  ],
  4: [
    { name: "Espada Flamígera", rarity: "common" }, { name: "Torre del Vigía", rarity: "common" }, { name: "Catapulta de Asedio", rarity: "common" }, { name: "Escudo Heráldico", rarity: "common" },
    { name: "Caballo de Guerra", rarity: "clear" }, { name: "Castillo Fortificado", rarity: "clear" }, { name: "Ballesta de Acero", rarity: "clear" },
    { name: "Dragón de Fuego", rarity: "epic" }, { name: "Excalibur", rarity: "legendary" },
  ],
  5: [
    { name: "Engranaje Maestro", rarity: "common" }, { name: "Locomotora de Vapor", rarity: "common" }, { name: "Fábrica Automatizada", rarity: "common" }, { name: "Telégrafo", rarity: "common" },
    { name: "Dirigible de Guerra", rarity: "clear" }, { name: "Motor de Combustión", rarity: "clear" }, { name: "Reloj Mecánico", rarity: "clear" },
    { name: "Bomba de Tesla", rarity: "epic" }, { name: "Autómata Supremo", rarity: "legendary" },
  ],
  6: [
    { name: "Chip Neuronal", rarity: "common" }, { name: "Servo Motor", rarity: "common" }, { name: "Dron de Vigilancia", rarity: "common" }, { name: "Escudo de Energía", rarity: "common" },
    { name: "Exoesqueleto", rarity: "clear" }, { name: "Nanobots", rarity: "clear" }, { name: "Holograma Táctico", rarity: "clear" },
    { name: "Mech de Asalto", rarity: "epic" }, { name: "Singularidad IA", rarity: "legendary" },
  ],
  7: [
    { name: "Propulsor Warp", rarity: "common" }, { name: "Estación Orbital", rarity: "common" }, { name: "Cañón de Iones", rarity: "common" }, { name: "Traje Estelar", rarity: "common" },
    { name: "Nave Nodriza", rarity: "clear" }, { name: "Escudo Planetario", rarity: "clear" }, { name: "Portal Dimensional", rarity: "clear" },
    { name: "Devorador de Mundos", rarity: "epic" }, { name: "Llave del Cosmos", rarity: "legendary" },
  ],
  8: [
    { name: "Partícula Divina", rarity: "common" }, { name: "Entrelazamiento", rarity: "common" }, { name: "Colapso de Onda", rarity: "common" }, { name: "Materia Oscura", rarity: "common" },
    { name: "Agujero de Gusano", rarity: "clear" }, { name: "Campo de Higgs", rarity: "clear" }, { name: "Teletransportador", rarity: "clear" },
    { name: "Big Bang", rarity: "epic" }, { name: "Omnisciencia", rarity: "legendary" },
  ],
};

// ── EQUIPMENT ──
const EQUIPMENT_SLOTS = ["Casco", "Arma", "Armadura", "Gadget"] as const;
const EQUIPMENT_RARITIES = [
  { key: "common", label: "Común", color: "#94A3B8", border: "border-slate-500/30" },
  { key: "clear", label: "Claro", color: "#00D4E6", border: "border-cyan-500/30" },
  { key: "epic", label: "Épico", color: "#A855F7", border: "border-purple-500/30" },
  { key: "legendary", label: "Legendario", color: "#F59E0B", border: "border-amber-500/30" },
];
const EQUIPMENT_DATA: { slot: string; rarity: string; name: string; atk: number; def: number; hp: number; emoji: string }[] = [
  { slot: "Casco", rarity: "common", name: "Casco de Cuero", atk: 0, def: 5, hp: 10, emoji: "🪖" },
  { slot: "Casco", rarity: "clear", name: "Casco de Hierro", atk: 0, def: 15, hp: 30, emoji: "⛑️" },
  { slot: "Casco", rarity: "epic", name: "Yelmo de Dragón", atk: 5, def: 30, hp: 80, emoji: "🪖" },
  { slot: "Casco", rarity: "legendary", name: "Corona Cósmica", atk: 15, def: 50, hp: 150, emoji: "👑" },
  { slot: "Arma", rarity: "common", name: "Daga de Piedra", atk: 15, def: 0, hp: 0, emoji: "🗡️" },
  { slot: "Arma", rarity: "clear", name: "Espada de Bronce", atk: 40, def: 0, hp: 0, emoji: "⚔️" },
  { slot: "Arma", rarity: "epic", name: "Hacha de Guerra", atk: 80, def: 5, hp: 0, emoji: "🪓" },
  { slot: "Arma", rarity: "legendary", name: "Espada del Vacío", atk: 150, def: 10, hp: 50, emoji: "⚔️" },
  { slot: "Armadura", rarity: "common", name: "Túnica de Cuero", atk: 0, def: 10, hp: 20, emoji: "🛡️" },
  { slot: "Armadura", rarity: "clear", name: "Cota de Malla", atk: 0, def: 25, hp: 50, emoji: "🛡️" },
  { slot: "Armadura", rarity: "epic", name: "Armadura de Placas", atk: 0, def: 50, hp: 100, emoji: "🛡️" },
  { slot: "Armadura", rarity: "legendary", name: "Armadura Cuántica", atk: 20, def: 80, hp: 200, emoji: "🛡️" },
  { slot: "Gadget", rarity: "common", name: "Amuleto Básico", atk: 5, def: 5, hp: 30, emoji: "📿" },
  { slot: "Gadget", rarity: "clear", name: "Orbe de Poder", atk: 10, def: 10, hp: 60, emoji: "🔮" },
  { slot: "Gadget", rarity: "epic", name: "Reloj Temporal", atk: 20, def: 20, hp: 100, emoji: "⏱️" },
  { slot: "Gadget", rarity: "legendary", name: "Amuleto de la Suerte", atk: 30, def: 30, hp: 150, emoji: "🔮" },
];

// ── CHEST DATA ──
const CHESTS = [
  { name: "Cofre Básico", emoji: "📦", price: 50, items: "1-3", color: "#94A3B8", drops: [{ label: "Común", pct: 70 }, { label: "Clara", pct: 25 }, { label: "Épica", pct: 4.5 }, { label: "Legendaria", pct: 0.5 }] },
  { name: "Cofre Épico", emoji: "🎁", price: 200, items: "3-5", color: "#A855F7", drops: [{ label: "Común", pct: 30 }, { label: "Clara", pct: 40 }, { label: "Épica", pct: 25 }, { label: "Legendaria", pct: 5 }] },
  { name: "Cofre Legendario", emoji: "👑", price: 500, items: "5-7", color: "#F59E0B", drops: [{ label: "Común", pct: 10 }, { label: "Clara", pct: 30 }, { label: "Épica", pct: 40 }, { label: "Legendaria", pct: 20 }] },
];

// ── SHOP TABS ──
const SHOP_TABS = [
  { name: "Ofertas", items: [
    { name: "Primera Compra x3", price: "100 💎", tag: "PRIMERA VEZ", tagColor: "text-green-400" },
    { name: "Pack Legendario", price: "100 💎", tag: "-50%", tagColor: "text-red-400" },
    { name: "Mega Pack Recursos", price: "30 💎", tag: "FLASH", tagColor: "text-orange-400" },
    { name: "Starter Bundle", price: "$1.99", tag: "POPULAR", tagColor: "text-cyan-400" },
  ]},
  { name: "Cofres", items: CHESTS.map(c => ({ name: c.name, price: `${c.price} 💎`, tag: c.items + " items", tagColor: "text-white/50" })) },
  { name: "Diamantes", items: [
    { name: "80 Diamantes", price: "$0.99", tag: "", tagColor: "" },
    { name: "500 Diamantes", price: "$4.99", tag: "+50 BONUS", tagColor: "text-green-400" },
    { name: "1200 Diamantes", price: "$9.99", tag: "+200 BONUS", tagColor: "text-green-400" },
    { name: "6500 Diamantes", price: "$49.99", tag: "+1500 BONUS", tagColor: "text-green-400" },
  ]},
  { name: "Boost", items: [
    { name: "Producción x2 (1h)", price: "20 💎", tag: "BOOST", tagColor: "text-yellow-400" },
    { name: "Producción x2 (24h)", price: "100 💎", tag: "BOOST", tagColor: "text-yellow-400" },
    { name: "XP x2 (1h)", price: "15 💎", tag: "BOOST", tagColor: "text-cyan-400" },
  ]},
  { name: "VIP", items: [
    { name: "VIP Mensual", price: "$9.99/mes", tag: "VIP", tagColor: "text-amber-400" },
    { name: "VIP Anual", price: "$79.99/año", tag: "-33%", tagColor: "text-green-400" },
  ]},
  { name: "Pase Batalla", items: [
    { name: "Premium Pass", price: "999 💎", tag: "TEMPORADA 1", tagColor: "text-purple-400" },
    { name: "Premium + 10 Niveles", price: "1499 💎", tag: "MEJOR VALOR", tagColor: "text-amber-400" },
  ]},
];

// ── BATTLE PASS ──
const BP_REWARDS = [
  { lvl: 1, free: "500 Piedra", premium: "50 Diamantes" },
  { lvl: 2, free: "500 Madera", premium: "Carta Épica" },
  { lvl: 3, free: "300 Comida", premium: "Espada Clara" },
  { lvl: 4, free: "Carta Común x2", premium: "100 Diamantes" },
  { lvl: 5, free: "1000 Piedra", premium: "Skin: Guerrero" },
  { lvl: 6, free: "200 Energía", premium: "Carta Legendaria" },
  { lvl: 7, free: "1500 Madera", premium: "200 Diamantes" },
  { lvl: 8, free: "Carta Común x3", premium: "Armadura Épica" },
  { lvl: 9, free: "800 Comida", premium: "Skin: Mago Estelar" },
  { lvl: 10, free: "25 Diamantes", premium: "Amuleto Legendario" },
];

// ── SKINS ──
const SKINS = [
  { name: "Default", color: "from-blue-700 to-blue-900", unlock: "Gratis — inicio del juego", locked: false },
  { name: "Guerrero de Bronce", color: "from-amber-700 to-amber-900", unlock: "Pase de Batalla Nv.5", locked: false },
  { name: "Caballero Oscuro", color: "from-purple-900 to-gray-900", unlock: "Completar Set de Cartas Medieval", locked: false },
  { name: "Titán Mecánico", color: "from-cyan-700 to-gray-700", unlock: "Llegar a Era Robótica", locked: true },
  { name: "Fénix Solar", color: "from-red-600 to-orange-800", unlock: "Compra en Tienda — 500 💎", locked: true },
  { name: "Fantasma Cuántico", color: "from-cyan-800 to-blue-900", unlock: "Derrotar al Jefe Final", locked: true },
];

// ── DAILY REWARDS ──
const DAILY_REWARDS = [
  { day: 1, reward: "100 Piedra", icon: "stone" },
  { day: 2, reward: "100 Madera", icon: "wood" },
  { day: 3, reward: "50 Bronce", icon: "bronze" },
  { day: 4, reward: "5 Diamantes", icon: "diamonds" },
  { day: 5, reward: "10 Energía", icon: "energy" },
  { day: 6, reward: "15 Diamantes", icon: "diamonds" },
  { day: 7, reward: "Cofre Épico", icon: "diamonds" },
];

// ── ACHIEVEMENTS ──
const ACHIEVEMENTS_DATA = [
  { name: "Primeros Pasos", desc: "Comienza tu viaje en Porera", cat: "Planeta", reward: "50 💎", done: true },
  { name: "Constructor", desc: "Construye 10 estructuras", cat: "Planeta", reward: "75 💎", done: false, prog: "6/10" },
  { name: "Explorador de Eras", desc: "Desbloquea 3 eras", cat: "Planeta", reward: "150 💎", done: true },
  { name: "Primera Sangre", desc: "Gana tu primer combate", cat: "Combate", reward: "200 🪙", done: true },
  { name: "Guerrero", desc: "Gana 50 combates", cat: "Combate", reward: "100 💎", done: false, prog: "23/50" },
  { name: "Coleccionista", desc: "Colecciona 10 cartas", cat: "Colección", reward: "1000 🪙", done: false, prog: "7/10" },
  { name: "Fundador de Clan", desc: "Únete o crea un clan", cat: "Clan", reward: "500 🪙", done: true },
  { name: "Alma Generosa", desc: "Dona 10,000 recursos", cat: "Clan", reward: "2000 🪙", done: false, prog: "4.2K/10K" },
  { name: "Patrocinador", desc: "Realiza tu primera compra", cat: "Compra", reward: "200 💎", done: false, prog: "0/1" },
  { name: "Espectador", desc: "Mira 5 anuncios", cat: "Anuncios", reward: "300 🪙", done: true },
];

// ── RARITY COLORS ──
const RARITY_COLOR: Record<string, string> = {
  common: "#94A3B8", clear: "#00D4E6", epic: "#A855F7", legendary: "#F59E0B",
};
const RARITY_LABEL: Record<string, string> = {
  common: "Común", clear: "Clara", epic: "Épica", legendary: "Legendaria",
};

/* ═══════════════════════════════════════════════════════════════
   REUSABLE MINI UI COMPONENTS FOR MOCKUPS
   ═══════════════════════════════════════════════════════════════ */

const MiniResourceBar = () => (
  <div className="flex gap-1 px-2 py-1 bg-black/40 rounded-lg overflow-x-auto">
    {Object.entries(RESOURCE_ICONS).slice(0, 6).map(([key, src]) => (
      <div key={key} className="flex items-center gap-0.5 shrink-0">
        <img src={src as string} className="w-3 h-3" />
        <span className="text-[6px] text-white/70">1.2K</span>
      </div>
    ))}
  </div>
);

const MiniNavBar = ({ active }: { active: string }) => (
  <div className="flex justify-around items-center py-1.5 bg-[#0f0825]/95 border-t border-white/10">
    {[
      { id: "shop", label: "Tienda", icon: NAV_ICONS.shop },
      { id: "structures", label: "Estructuras", icon: NAV_ICONS.structures },
      { id: "planet", label: "Planeta", icon: NAV_ICONS.home, special: true },
      { id: "combat", label: "Combate", icon: NAV_ICONS.combat },
      { id: "cards", label: "Cartas", icon: NAV_ICONS.cards },
    ].map(n => (
      <div key={n.id} className={cn("flex flex-col items-center gap-0.5", n.special && "-mt-3")}>
        <div className={cn("rounded-full p-1",
          n.id === active ? "bg-primary/20" : "",
          n.special && "bg-green-600 p-2 rounded-full border-2 border-green-400/40")}>
          <img src={n.icon} className={cn("w-3 h-3", n.special && "w-4 h-4")} />
        </div>
        <span className={cn("text-[5px]", n.id === active ? "text-primary" : "text-white/40")}>{n.label}</span>
      </div>
    ))}
  </div>
);

const MiniGlassPanel = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <div className={cn("bg-white/5 border border-white/10 rounded-lg p-2", className)}>{children}</div>
);

const FlowArrow = ({ direction = "right" }: { direction?: "right" | "down" }) => (
  <div className={cn("flex items-center justify-center shrink-0", direction === "down" ? "py-2" : "px-2")}>
    <div className={cn("flex items-center gap-1", direction === "down" && "flex-col")}>
      <div className={cn("bg-gradient-to-r from-primary to-secondary", direction === "down" ? "w-0.5 h-6" : "w-6 h-0.5")} />
      {direction === "down"
        ? <ChevronDown className="w-4 h-4 text-primary" />
        : <ArrowRight className="w-4 h-4 text-primary" />}
    </div>
  </div>
);

const PhoneFrame = ({ children, label }: { children: React.ReactNode; label: string }) => (
  <div className="flex flex-col items-center gap-2 shrink-0">
    <div className="w-[180px] h-[320px] bg-[#0d0520] rounded-2xl border border-white/20 overflow-hidden flex flex-col shadow-[0_0_30px_rgba(0,0,0,0.5)]">
      <div className="flex justify-between px-2 py-0.5 text-[5px] text-white/40">
        <span>9:41</span><span>EVOLVION</span><span>100%</span>
      </div>
      <div className="flex-1 overflow-hidden flex flex-col">{children}</div>
    </div>
    <span className="text-[9px] text-primary font-display uppercase tracking-wider">{label}</span>
  </div>
);

// ── Stat pill helper ──
const StatPill = ({ label, value, color }: { label: string; value: string | number; color: string }) => (
  <div className="flex items-center gap-0.5 px-1 py-0.5 rounded bg-black/30 text-[5px]">
    <span style={{ color }}>{label}:</span>
    <span className="text-white">{value}</span>
  </div>
);

/* ═══════════════════════════════════════════════════════════════
   SCREEN TEMPLATE GENERATORS
   ═══════════════════════════════════════════════════════════════ */

// Generic list screen
function ListScreen({ title, items, activeNav }: { title: string; items: { label: string; sub: string; icon?: string; color?: string }[]; activeNav?: string }) {
  return (
    <div className="flex-1 flex flex-col bg-[#0d0520] p-2 gap-1">
      <p className="text-[7px] text-white font-display">{title}</p>
      {items.slice(0, 5).map((item, i) => (
        <MiniGlassPanel key={i}>
          <div className="flex items-center gap-1.5">
            {item.icon && <span className="text-sm">{item.icon}</span>}
            <div className="flex-1 min-w-0">
              <p className="text-[6px] text-white truncate">{item.label}</p>
              <p className="text-[4px] text-white/40 truncate">{item.sub}</p>
            </div>
            {item.color && <div className="w-2 h-2 rounded-full" style={{ background: item.color }} />}
          </div>
        </MiniGlassPanel>
      ))}
      {activeNav && <div className="mt-auto"><MiniNavBar active={activeNav} /></div>}
    </div>
  );
}

// Generic center-content screen
function CenterScreen({ title, subtitle, emoji, color, children }: { title: string; subtitle?: string; emoji: string; color?: string; children?: React.ReactNode }) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center bg-gradient-to-b from-[#0d0520] to-[#1a0a3e] p-3">
      <span className="text-3xl mb-1">{emoji}</span>
      <p className="text-[8px] font-display mb-1" style={{ color: color || "#fff" }}>{title}</p>
      {subtitle && <p className="text-[5px] text-white/50 text-center mb-2">{subtitle}</p>}
      {children}
    </div>
  );
}

// Generic grid screen
function GridScreen({ title, items, cols = 3 }: { title: string; items: { label: string; sub?: string; color: string }[]; cols?: number }) {
  return (
    <div className="flex-1 flex flex-col bg-[#0d0520] p-2 gap-1 overflow-hidden">
      <p className="text-[7px] text-white font-display">{title}</p>
      <div className={`grid gap-0.5`} style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
        {items.slice(0, cols * 3).map((item, i) => (
          <div key={i} className="aspect-[3/4] rounded border flex flex-col items-center justify-center p-0.5"
            style={{ borderColor: item.color + "60", background: item.color + "15" }}>
            <span className="text-[5px] text-white text-center leading-tight">{item.label}</span>
            {item.sub && <span className="text-[4px] mt-0.5" style={{ color: item.color }}>{item.sub}</span>}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   FLOW DEFINITIONS
   ═══════════════════════════════════════════════════════════════ */

const FLOWS: Flow[] = [
  // ═══════════════════════════════════════════
  // 1. ONBOARDING
  // ═══════════════════════════════════════════
  {
    id: "onboarding", name: "Onboarding", icon: "🚀", color: "#00D4E6", category: "Core",
    description: "Primer ingreso: splash → bienvenida → tutorial → primera construcción",
    steps: [
      {
        title: "Splash Screen", description: "Logo + animación de carga",
        screen: () => (
          <div className="flex-1 flex flex-col items-center justify-center bg-gradient-to-b from-[#0d0520] to-[#1a0a3e] p-4">
            <div className="text-2xl font-display text-primary mb-2">EVOLVION</div>
            <div className="w-24 h-1 bg-white/10 rounded overflow-hidden">
              <motion.div className="h-full bg-primary rounded" animate={{ width: ["0%", "100%"] }} transition={{ duration: 2, repeat: Infinity }} />
            </div>
            <p className="text-[6px] text-white/30 mt-3">Cargando universo...</p>
          </div>
        ),
      },
      {
        title: "Bienvenida", description: "Introducción a Aris",
        screen: () => (
          <CenterScreen title="¡Hola! Soy Aris" subtitle="Tu guía en este viaje a través de las eras" emoji="🧑‍🚀" color="#00D4E6">
            <div className="w-full px-4">
              <div className="bg-primary/20 border border-primary/40 rounded-lg py-1.5 text-center text-[7px] text-primary font-display">COMENZAR VIAJE</div>
            </div>
          </CenterScreen>
        ),
      },
      {
        title: "Tutorial: Construir", description: "Primera estructura guiada",
        screen: () => (
          <div className="flex-1 flex flex-col bg-[#0d0520] p-2">
            <MiniResourceBar />
            <div className="flex-1 flex flex-col items-center justify-center">
              <div className="w-20 h-20 rounded-full bg-green-900/30 border-2 border-green-500/50 flex items-center justify-center mb-2">
                <span className="text-2xl">⛏️</span>
              </div>
              <p className="text-[7px] text-white font-display mb-1">Construye tu Cantera</p>
              <p className="text-[5px] text-white/50 text-center px-4">Toca aquí para empezar a producir piedra</p>
              <div className="mt-2 bg-green-600 rounded-lg px-4 py-1 text-[6px] text-white font-display animate-pulse">¡CONSTRUIR!</div>
            </div>
            <MiniNavBar active="structures" />
          </div>
        ),
      },
      {
        title: "Primera Construcción", description: "Cantera construida + recompensa",
        screen: () => (
          <div className="flex-1 flex flex-col items-center justify-center bg-[#0d0520] p-3">
            <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 0.5 }}>
              <span className="text-4xl">⛏️</span>
            </motion.div>
            <p className="text-[8px] text-white font-display mt-2">¡Cantera Nv.1!</p>
            <div className="flex gap-3 mt-2 text-[6px]">
              <span className="text-green-400">+2.5/s Piedra</span>
              <span className="text-yellow-400">+2 ⚡ Energía</span>
            </div>
            <p className="text-[5px] text-white/40 mt-3">Tutorial completado</p>
          </div>
        ),
      },
    ],
  },

  // ═══════════════════════════════════════════
  // 2. PROGRESIÓN PLANETARIA
  // ═══════════════════════════════════════════
  {
    id: "planet-progression", name: "Progresión Planetaria", icon: "🌍", color: "#4ADE80", category: "Core",
    description: "Lista de planetas → orbital → superficie → línea temporal → requisitos → avance de era",
    steps: [
      {
        title: "Lista de Planetas", description: "3 planetas disponibles",
        screen: () => (
          <ListScreen title="TUS PLANETAS" activeNav="planet" items={[
            { label: "Porera", sub: "Era: Bronce (3/9)", icon: "🌍", color: "#4CAF50" },
            { label: "Doresa", sub: "Era: Industrial (6/9)", icon: "🌊", color: "#00BCD4" },
            { label: "Aitherium", sub: "🔒 Bloqueado", icon: "🔮", color: "#7B2FF7" },
          ]} />
        ),
      },
      {
        title: "Vista Orbital", description: "Planeta 3D con estructuras",
        screen: () => (
          <div className="flex-1 flex flex-col bg-[#0d0520]">
            <div className="p-2 flex items-center gap-1">
              <span className="text-[6px] text-white/40">←</span>
              <span className="text-[8px] text-green-400 font-display">PORERA</span>
              <span className="text-[6px] text-green-400 ml-auto">+17.3/s</span>
            </div>
            <div className="flex-1 flex items-center justify-center relative">
              <div className="w-24 h-24 rounded-full bg-gradient-to-b from-green-500 to-green-800" />
              <div className="absolute top-4 left-2 bg-black/60 rounded px-1 py-0.5 text-[5px] text-white">Cantera +9.9/s</div>
              <div className="absolute top-8 right-3 bg-black/60 rounded px-1 py-0.5 text-[5px] text-white">Granja +2.7/s</div>
              <div className="absolute top-2 right-2 flex gap-0.5">
                <div className="px-1 py-0.5 rounded text-[5px] bg-primary/20 text-primary">Orbital</div>
                <div className="px-1 py-0.5 rounded text-[5px] bg-white/5 text-white/40">Superficie</div>
              </div>
            </div>
            <div className="px-2 pb-1">
              <div className="flex justify-between text-[5px] text-white/40"><span>Bronce</span><span>Clásica</span></div>
              <Progress value={25} className="h-0.5" />
            </div>
            <div className="flex divide-x divide-white/10 border-t border-white/10">
              {["35 ATK", "20 DEF", "1.2K Pobl.", "Nv.3 Tec."].map(s => (
                <div key={s} className="flex-1 text-center py-1 text-[5px] text-white/60">{s}</div>
              ))}
            </div>
          </div>
        ),
      },
      {
        title: "Vista Superficie", description: "Aris + Estructuras en el terreno",
        screen: () => (
          <div className="flex-1 flex flex-col bg-gradient-to-b from-[#0d0520] to-[#0a1520]">
            <div className="flex-1 relative">
              <div className="absolute inset-0 flex items-end justify-center pb-4"><div className="text-3xl">🧑‍🚀</div></div>
              <div className="absolute top-6 left-4 text-lg">⛏️</div>
              <div className="absolute top-10 right-6 text-lg">🌾</div>
              <div className="absolute top-4 right-3 text-lg">🔥</div>
              <div className="absolute top-2 left-1/2 -translate-x-1/2 w-10 h-10 rounded-full border border-cyan-500/50" />
            </div>
          </div>
        ),
      },
      {
        title: "Línea de Eras", description: "Timeline con 9 eras",
        screen: () => (
          <div className="flex-1 flex flex-col bg-[#0d0520] p-2">
            <p className="text-[7px] text-white font-display mb-1">LÍNEA TEMPORAL</p>
            <div className="space-y-0.5">
              {ERAS.map((era, i) => (
                <div key={i} className={cn("flex items-center gap-1 px-1 py-0.5 rounded text-[5px]",
                  i < 3 ? "bg-primary/10 text-primary" : i === 3 ? "bg-accent/10 text-accent" : "bg-white/5 text-white/30")}>
                  <div className="w-1.5 h-1.5 rounded-full" style={{ background: era.color }} />
                  <span className="flex-1">{era.name}</span>
                  <span>{era.emoji}</span>
                  {i < 3 && <span className="text-green-400">✓</span>}
                </div>
              ))}
            </div>
          </div>
        ),
      },
      {
        title: "Requisitos de Era", description: "Checklist para avanzar",
        screen: () => (
          <div className="flex-1 flex flex-col bg-[#0d0520] p-2 gap-1">
            <p className="text-[7px] text-white font-display">REQUISITOS: Bronce → Clásica</p>
            {(ERA_REQUIREMENTS[2] || []).map((r, i) => (
              <div key={i} className={cn("flex items-center gap-1 px-1.5 py-1 rounded border text-[5px]",
                r.met ? "bg-green-500/10 border-green-500/20 text-green-300" : "bg-red-500/10 border-red-500/20 text-white")}>
                <span className={r.met ? "text-green-400" : "text-red-400"}>{r.met ? "✓" : "✕"}</span>
                <span className="flex-1">{r.label}</span>
              </div>
            ))}
            <Progress value={40} className="h-0.5 mt-1" />
          </div>
        ),
      },
      {
        title: "Avance de Era", description: "Animación de evolución",
        screen: () => (
          <CenterScreen title="¡ERA CLÁSICA DESBLOQUEADA!" subtitle="Has avanzado al mundo de las grandes civilizaciones" emoji="🏛️" color="#DAA520">
            <MiniGlassPanel className="w-full mt-2">
              <p className="text-[5px] text-white/50 mb-1">Nuevo contenido:</p>
              <div className="space-y-0.5 text-[5px]">
                <p className="text-green-400">+ Herrería (nueva estructura)</p>
                <p className="text-red-400">+ 3 nuevos enemigos</p>
                <p className="text-purple-400">+ 9 cartas nuevas</p>
              </div>
            </MiniGlassPanel>
          </CenterScreen>
        ),
      },
    ],
  },

  // ═══════════════════════════════════════════
  // 3. ERAS DETALLADAS (9 flows, one per era)
  // ═══════════════════════════════════════════
  ...ERAS.map((era, eraIdx): Flow => ({
    id: `era-${eraIdx}`,
    name: `Era: ${era.name}`,
    icon: era.emoji,
    color: era.color,
    category: "Eras",
    description: `Era ${eraIdx + 1}/9 — Recurso: ${era.resource} — Estructura: ${era.structure}`,
    steps: [
      {
        title: `${era.name}`, description: `Era ${eraIdx + 1} — Vista general`,
        screen: () => (
          <div className="flex-1 flex flex-col bg-[#0d0520] p-2">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center text-2xl" style={{ background: era.color + "25", border: `1px solid ${era.color}50` }}>
                {era.emoji}
              </div>
              <div>
                <p className="text-[8px] font-display" style={{ color: era.color }}>{era.name}</p>
                <p className="text-[5px] text-white/50">Era {eraIdx + 1}/9</p>
              </div>
            </div>
            <MiniGlassPanel className="mb-1">
              <p className="text-[5px] text-white/50">Recurso principal:</p>
              <div className="flex items-center gap-1 mt-0.5">
                <img src={RESOURCE_ICONS[era.resIcon as keyof typeof RESOURCE_ICONS]} className="w-3 h-3" />
                <span className="text-[6px] text-white">{era.resource}</span>
              </div>
            </MiniGlassPanel>
            <MiniGlassPanel className="mb-1">
              <p className="text-[5px] text-white/50">Estructura nueva:</p>
              <div className="flex items-center gap-1 mt-0.5">
                <span className="text-sm">{era.structIcon}</span>
                <span className="text-[6px] text-white">{era.structure}</span>
              </div>
            </MiniGlassPanel>
            <MiniGlassPanel>
              <p className="text-[5px] text-white/50">Enemigos: {ENEMIES_BY_ERA[eraIdx]?.length || 3}</p>
              <p className="text-[5px] text-white/50">Cartas: {CARDS_BY_ERA[eraIdx]?.length || 9}</p>
            </MiniGlassPanel>
          </div>
        ),
      },
      {
        title: "Requisitos", description: eraIdx < 8 ? `Avanzar a ${ERAS[eraIdx + 1]?.name || "MAX"}` : "Era final",
        screen: () => (
          <div className="flex-1 flex flex-col bg-[#0d0520] p-2 gap-0.5">
            <p className="text-[7px] font-display" style={{ color: era.color }}>
              {eraIdx < 8 ? `${era.name} → ${ERAS[eraIdx + 1]?.name}` : "ERA FINAL"}
            </p>
            {(ERA_REQUIREMENTS[eraIdx] || [{ label: "Completar todas las misiones", met: false }]).map((r, i) => (
              <div key={i} className={cn("flex items-center gap-1 px-1 py-0.5 rounded border text-[5px]",
                r.met ? "bg-green-500/10 border-green-500/20 text-green-300" : "bg-white/5 border-white/10 text-white/60")}>
                <span className={r.met ? "text-green-400" : "text-white/30"}>{r.met ? "✓" : "○"}</span>
                <span>{r.label}</span>
              </div>
            ))}
            {eraIdx === 8 && (
              <div className="mt-auto text-center">
                <p className="text-[6px] text-amber-400 font-display">🏆 SINGULARIDAD ALCANZADA</p>
                <p className="text-[4px] text-white/30">Dominio total del universo</p>
              </div>
            )}
          </div>
        ),
      },
      {
        title: "Enemigos", description: `3 enemigos de la era ${era.name}`,
        screen: () => (
          <div className="flex-1 flex flex-col bg-[#0d0520] p-2 gap-1">
            <p className="text-[6px] font-display" style={{ color: era.color }}>ENEMIGOS — {era.name}</p>
            {(ENEMIES_BY_ERA[eraIdx] || []).map((e, i) => (
              <MiniGlassPanel key={i}>
                <div className="flex items-center gap-1.5">
                  <span className="text-sm">{e.emoji}</span>
                  <div className="flex-1">
                    <p className="text-[5px] text-white font-display">{e.name}</p>
                    <div className="flex gap-1.5 text-[4px] text-white/40">
                      <span>HP:{e.hp}</span><span>ATK:{e.atk}</span><span>DEF:{e.def}</span>
                    </div>
                    <p className="text-[4px] text-green-400">{e.drops} • +{e.xp}XP</p>
                  </div>
                </div>
              </MiniGlassPanel>
            ))}
          </div>
        ),
      },
      {
        title: "Cartas", description: `9 cartas del set ${era.name}`,
        screen: () => (
          <div className="flex-1 flex flex-col bg-[#0d0520] p-2">
            <p className="text-[6px] font-display mb-1" style={{ color: era.color }}>CARTAS — {era.name}</p>
            <div className="grid grid-cols-3 gap-0.5">
              {(CARDS_BY_ERA[eraIdx] || []).map((c, i) => (
                <div key={i} className="aspect-[3/4] rounded border flex flex-col items-center justify-center p-0.5"
                  style={{ borderColor: (RARITY_COLOR[c.rarity] || "#555") + "50", background: (RARITY_COLOR[c.rarity] || "#555") + "15" }}>
                  <span className="text-[4px] text-white text-center leading-tight">{c.name}</span>
                  <span className="text-[3px] mt-0.5" style={{ color: RARITY_COLOR[c.rarity] }}>{RARITY_LABEL[c.rarity]}</span>
                </div>
              ))}
            </div>
            <p className="text-[4px] text-amber-400 text-center mt-1">Set completo: +{(eraIdx + 1) * 500} {era.resource}</p>
          </div>
        ),
      },
      {
        title: "Recompensas", description: "Bonus por completar la era",
        screen: () => (
          <CenterScreen title={`¡Era ${era.name} completada!`} emoji={era.emoji} color={era.color}>
            <MiniGlassPanel className="w-full">
              <p className="text-[5px] text-white/50 mb-1">Recompensas de era:</p>
              <div className="space-y-0.5 text-[5px]">
                <p className="text-green-400">+{(eraIdx + 1) * 1000} {era.resource}</p>
                <p className="text-yellow-400">+{(eraIdx + 1) * 10} Diamantes</p>
                <p className="text-purple-400">+{(eraIdx + 1) * 200} XP</p>
                {eraIdx >= 4 && <p className="text-cyan-400">🎨 Skin exclusiva</p>}
              </div>
            </MiniGlassPanel>
          </CenterScreen>
        ),
      },
    ],
  })),

  // ═══════════════════════════════════════════
  // 4. COMBATE DETALLADO
  // ═══════════════════════════════════════════
  {
    id: "combat-detail", name: "Combate Detallado", icon: "⚔️", color: "#EF4444", category: "Gameplay",
    description: "27 enemigos agrupados por era — stats, drops, XP, mecánicas de combate",
    steps: [
      {
        title: "Selección de Enemigo", description: "Lista con filtro por era + energía",
        screen: () => (
          <div className="flex-1 flex flex-col bg-[#0d0520] p-2 gap-1">
            <div className="flex justify-between items-center">
              <span className="text-[7px] text-white font-display">COMBATE</span>
              <div className="flex items-center gap-0.5">
                <img src={RESOURCE_ICONS.energy} className="w-3 h-3" />
                <span className="text-[6px] text-yellow-400">28/30</span>
              </div>
            </div>
            <div className="flex gap-0.5 overflow-x-auto">
              {ERAS.slice(0, 4).map((e, i) => (
                <div key={i} className={cn("px-1 py-0.5 rounded text-[4px] shrink-0",
                  i === 0 ? "bg-primary/20 text-primary" : "bg-white/5 text-white/30")}>{e.name}</div>
              ))}
            </div>
            {(ENEMIES_BY_ERA[0] || []).map((e, i) => (
              <MiniGlassPanel key={i}>
                <div className="flex items-center gap-1.5">
                  <span className="text-sm">{e.emoji}</span>
                  <div className="flex-1">
                    <p className="text-[5px] text-white font-display">{e.name}</p>
                    <div className="flex gap-1 text-[4px] text-white/40">
                      <span>HP:{e.hp}</span><span>ATK:{e.atk}</span><span>DEF:{e.def}</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="text-[4px] text-yellow-400">⚡5</span>
                    <div className="bg-red-600 rounded px-1 py-0.5 text-[4px] text-white">PELEAR</div>
                  </div>
                </div>
              </MiniGlassPanel>
            ))}
            <MiniNavBar active="combat" />
          </div>
        ),
      },
      {
        title: "Arena de Combate", description: "Pelea automática con animaciones",
        screen: () => (
          <div className="flex-1 flex flex-col bg-gradient-to-b from-[#1a0a0a] to-[#0d0520] p-2">
            <div className="flex justify-between mb-2">
              <div className="text-[6px]">
                <p className="text-white font-display">Aris Nv.24</p>
                <Progress value={75} className="h-1 w-16" />
                <p className="text-[5px] text-white/40">75/100 HP</p>
              </div>
              <div className="text-[6px] text-right">
                <p className="text-white font-display">Dientes de Sable</p>
                <Progress value={30} className="h-1 w-16" />
                <p className="text-[5px] text-white/40">24/80 HP</p>
              </div>
            </div>
            <div className="flex-1 flex items-center justify-around">
              <div className="text-3xl">🧑‍🚀</div>
              <div className="flex flex-col items-center">
                <span className="text-red-400 text-[8px] font-bold">-12</span>
                <span className="text-[6px] text-white/40">VS</span>
                <span className="text-[5px] text-white/30">Ronda 5</span>
              </div>
              <div className="text-3xl">🐅</div>
            </div>
            <div className="bg-red-800/30 rounded-lg py-1.5 text-center text-[6px] text-white">Combate automático...</div>
          </div>
        ),
      },
      {
        title: "Victoria + Drops", description: "Recompensas y posible carta",
        screen: () => (
          <CenterScreen title="¡VICTORIA!" emoji="🏆" color="#FBBF24">
            <MiniGlassPanel className="w-full">
              <p className="text-[6px] text-white/50 mb-1">Recompensas:</p>
              <div className="space-y-0.5 text-[6px]">
                <p className="text-yellow-400">+50 XP</p>
                <div className="flex items-center gap-1">
                  <img src={RESOURCE_ICONS.stone} className="w-3 h-3" />
                  <span className="text-green-400">+30 Piedra</span>
                </div>
                <p className="text-purple-400">🃏 Carta: Lanza Primitiva (Común)</p>
              </div>
            </MiniGlassPanel>
          </CenterScreen>
        ),
      },
      {
        title: "Bestiary Completo", description: "27 enemigos (3×9 eras)",
        screen: () => (
          <div className="flex-1 flex flex-col bg-[#0d0520] p-1.5 gap-0.5 overflow-hidden">
            <p className="text-[6px] text-white font-display">BESTIARIO — 27 Enemigos</p>
            <div className="flex-1 overflow-y-auto space-y-0.5" style={{ fontSize: 0 }}>
              {ERAS.map((era, eIdx) => (
                <div key={eIdx}>
                  <p className="text-[4px] font-display py-0.5 px-1 rounded" style={{ color: era.color, background: era.color + "15" }}>
                    {era.emoji} {era.name}
                  </p>
                  {(ENEMIES_BY_ERA[eIdx] || []).map((e, i) => (
                    <div key={i} className="flex items-center gap-1 px-1 py-0.5 border-b border-white/5 text-[4px]">
                      <span>{e.emoji}</span>
                      <span className="text-white flex-1 truncate">{e.name}</span>
                      <span className="text-red-400">{e.hp}HP</span>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        ),
      },
    ],
  },

  // ═══════════════════════════════════════════
  // 5. COLECCIÓN DE CARTAS
  // ═══════════════════════════════════════════
  {
    id: "cards-collection", name: "Colección de Cartas", icon: "🃏", color: "#9B00FF", category: "Gameplay",
    description: "81 cartas (9×9 eras) — álbum, grid, detalle, bonus de set",
    steps: [
      {
        title: "Álbum — Tabs por Era", description: "9 eras, 9 cartas cada una",
        screen: () => (
          <div className="flex-1 flex flex-col bg-[#0d0520] p-2">
            <p className="text-[7px] text-white font-display mb-1">ÁLBUM DE CARTAS</p>
            <div className="flex gap-0.5 mb-1 overflow-x-auto">
              {ERAS.slice(0, 5).map((e, i) => (
                <div key={i} className={cn("px-1 py-0.5 rounded text-[4px] shrink-0",
                  i === 0 ? "bg-primary/20 text-primary" : "bg-white/5 text-white/30")}>{e.name}</div>
              ))}
            </div>
            <p className="text-[5px] text-white/40 mb-1">7/9 cartas — 78%</p>
            <div className="grid grid-cols-3 gap-0.5">
              {(CARDS_BY_ERA[0] || []).map((c, i) => (
                <div key={i} className={cn("aspect-[3/4] rounded border flex items-center justify-center text-[8px]",
                  i < 7 ? "border-purple-500/30 bg-purple-900/30" : "bg-white/5 border-white/10 text-white/20")}
                  style={i < 7 ? { borderColor: (RARITY_COLOR[c.rarity]) + "50" } : {}}>
                  {i < 7 ? "🃏" : "?"}
                </div>
              ))}
            </div>
          </div>
        ),
      },
      {
        title: "Detalle de Carta", description: "Rareza, stats, descripción",
        screen: () => (
          <div className="flex-1 flex flex-col items-center bg-[#0d0520] p-3">
            <div className="w-20 h-28 rounded-lg bg-gradient-to-b from-purple-600 to-purple-900 border border-purple-400/40 flex items-center justify-center text-2xl mb-2">🃏</div>
            <p className="text-[8px] text-white font-display">Mano del Destino</p>
            <span className="text-[5px] text-purple-400 bg-purple-400/10 rounded px-2 py-0.5 mt-0.5">ÉPICA</span>
            <p className="text-[5px] text-white/50 text-center mt-2 px-4">Carta mística del set Piedra</p>
            <MiniGlassPanel className="mt-2 w-full">
              <p className="text-[5px] text-white/50">Bonus: DEF +20, HP +50</p>
            </MiniGlassPanel>
          </div>
        ),
      },
      {
        title: "Set Completo", description: "Bonus al completar 9/9",
        screen: () => (
          <CenterScreen title="¡SET COMPLETO!" subtitle="Era de Piedra — 9/9 cartas" emoji="🎉" color="#FBBF24">
            <MiniGlassPanel className="w-full">
              <p className="text-[5px] text-white/50 mb-1">Recompensas del set:</p>
              <div className="space-y-0.5 text-[6px]">
                <p className="text-green-400">+500 Piedra</p>
                <p className="text-yellow-400">+10 Diamantes</p>
                <p className="text-purple-400">Skin: Guerrero Tribal</p>
              </div>
            </MiniGlassPanel>
          </CenterScreen>
        ),
      },
      {
        title: "Rarezas (4C/3Cl/1E/1L)", description: "Distribución por set",
        screen: () => (
          <div className="flex-1 flex flex-col bg-[#0d0520] p-2">
            <p className="text-[7px] text-white font-display mb-1">DISTRIBUCIÓN POR SET</p>
            {Object.entries(RARITY_COLOR).map(([key, color]) => (
              <div key={key} className="flex items-center gap-1 mb-1">
                <div className="w-2 h-2 rounded-full" style={{ background: color }} />
                <span className="text-[6px] text-white flex-1">{RARITY_LABEL[key]}</span>
                <span className="text-[5px] text-white/40">
                  {key === "common" ? "4 por set" : key === "clear" ? "3 por set" : key === "epic" ? "1 por set" : "1 por set"}
                </span>
                <div className="w-12 h-1 bg-white/10 rounded overflow-hidden">
                  <div className="h-full rounded" style={{ width: key === "common" ? "44%" : key === "clear" ? "33%" : "11%", background: color }} />
                </div>
              </div>
            ))}
            <MiniGlassPanel className="mt-2">
              <p className="text-[5px] text-white/50">Total: 81 cartas (9 sets × 9 cartas)</p>
              <p className="text-[5px] text-amber-400">Cada set completo otorga bonus único</p>
            </MiniGlassPanel>
          </div>
        ),
      },
    ],
  },

  // ═══════════════════════════════════════════
  // 6. EQUIPAMIENTO
  // ═══════════════════════════════════════════
  {
    id: "equipment", name: "Equipamiento", icon: "🛡️", color: "#00BCD4", category: "Gameplay",
    description: "4 slots × 4 rarezas = 16 piezas — stats detalladas, fusión, reciclaje",
    steps: [
      {
        title: "Equipo Actual", description: "4 slots equipados",
        screen: () => (
          <div className="flex-1 flex flex-col bg-[#0d0520] p-2">
            <p className="text-[7px] text-white font-display mb-1">EQUIPO DE ARIS</p>
            <div className="grid grid-cols-2 gap-1">
              {EQUIPMENT_SLOTS.map(slot => {
                const eq = EQUIPMENT_DATA.find(e => e.slot === slot && e.rarity === "clear");
                return (
                  <MiniGlassPanel key={slot} className="text-center">
                    <p className="text-[4px] text-white/40 mb-0.5">{slot}</p>
                    <span className="text-lg">{eq?.emoji}</span>
                    <p className="text-[5px] text-white truncate">{eq?.name}</p>
                    <p className="text-[4px] text-cyan-400">Clara</p>
                  </MiniGlassPanel>
                );
              })}
            </div>
            <MiniGlassPanel className="mt-1">
              <div className="flex justify-around text-[5px]">
                <span className="text-red-400">ATK: 155</span>
                <span className="text-blue-400">DEF: 60</span>
                <span className="text-green-400">HP: 330</span>
              </div>
            </MiniGlassPanel>
          </div>
        ),
      },
      {
        title: "Inventario", description: "16 piezas, 4 rarezas",
        screen: () => (
          <div className="flex-1 flex flex-col bg-[#0d0520] p-1.5 overflow-hidden">
            <p className="text-[6px] text-white font-display mb-1">INVENTARIO — 16 piezas</p>
            <div className="space-y-0.5 flex-1 overflow-y-auto">
              {EQUIPMENT_SLOTS.map(slot => (
                <div key={slot}>
                  <p className="text-[4px] text-white/30 px-1">{slot}</p>
                  <div className="flex gap-0.5">
                    {EQUIPMENT_RARITIES.map(r => {
                      const eq = EQUIPMENT_DATA.find(e => e.slot === slot && e.rarity === r.key);
                      return (
                        <div key={r.key} className="flex-1 rounded border p-0.5 text-center" style={{ borderColor: r.color + "40", background: r.color + "10" }}>
                          <span className="text-[8px]">{eq?.emoji}</span>
                          <p className="text-[3px] text-white truncate">{eq?.name?.split(" ").slice(-1)}</p>
                          <p className="text-[3px]" style={{ color: r.color }}>{r.label}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ),
      },
      {
        title: "Detalle + Stats", description: "ATK, DEF, HP por pieza",
        screen: () => (
          <div className="flex-1 flex flex-col items-center bg-[#0d0520] p-3">
            <span className="text-3xl mb-1">⚔️</span>
            <p className="text-[8px] text-white font-display">Espada de Bronce</p>
            <span className="text-[5px] text-cyan-400 bg-cyan-400/10 rounded px-2 py-0.5">CLARA</span>
            <MiniGlassPanel className="w-full mt-2">
              <div className="space-y-1">
                {[{ label: "ATK", val: 40, max: 150, color: "#EF4444" }, { label: "DEF", val: 0, max: 80, color: "#3B82F6" }, { label: "HP", val: 0, max: 200, color: "#22C55E" }].map(s => (
                  <div key={s.label} className="flex items-center gap-1 text-[5px]">
                    <span className="w-6" style={{ color: s.color }}>{s.label}</span>
                    <div className="flex-1 h-1 bg-white/10 rounded overflow-hidden">
                      <div className="h-full rounded" style={{ width: `${(s.val / s.max) * 100}%`, background: s.color }} />
                    </div>
                    <span className="text-white w-4 text-right">+{s.val}</span>
                  </div>
                ))}
              </div>
            </MiniGlassPanel>
            <div className="flex gap-1 mt-2 w-full">
              <div className="flex-1 bg-green-600/80 rounded py-1 text-center text-[5px] text-white">EQUIPAR</div>
              <div className="flex-1 bg-amber-600/80 rounded py-1 text-center text-[5px] text-white">FUSIONAR</div>
            </div>
          </div>
        ),
      },
    ],
  },

  // ═══════════════════════════════════════════
  // 7. COFRES
  // ═══════════════════════════════════════════
  {
    id: "chests", name: "Cofres", icon: "📦", color: "#F59E0B", category: "Monetización",
    description: "3 tipos: Básico, Épico, Legendario — apertura animada + drops",
    steps: CHESTS.map((chest, i) => ({
      title: chest.name,
      description: `${chest.items} items — ${chest.price} 💎`,
      screen: () => (
        <div className="flex-1 flex flex-col bg-[#0d0520] p-2">
          <div className="flex-1 flex flex-col items-center justify-center">
            <span className="text-4xl mb-2">{chest.emoji}</span>
            <p className="text-[8px] text-white font-display">{chest.name}</p>
            <p className="text-[5px] text-white/40 mb-2">{chest.items} items — {chest.price} 💎</p>
            <div className="grid grid-cols-4 gap-1 w-full mb-2">
              {chest.drops.map(d => (
                <div key={d.label} className="text-center bg-black/30 rounded py-1 px-0.5">
                  <div className="text-[6px] font-display" style={{ color: d.label === "Legendaria" ? "#F59E0B" : d.label === "Épica" ? "#A855F7" : d.label === "Clara" ? "#00D4E6" : "#94A3B8" }}>{d.pct}%</div>
                  <div className="text-[4px] text-white/40">{d.label}</div>
                </div>
              ))}
            </div>
            <div className="rounded-lg py-1.5 px-4 text-center text-[6px] text-black font-display" style={{ background: chest.color }}>
              ABRIR — {chest.price} 💎
            </div>
          </div>
        </div>
      ),
    })).concat([{
      title: "Apertura Animada", description: "Revelación de items",
      screen: () => (
        <CenterScreen title="¡COFRE ÉPICO!" emoji="✨" color="#A855F7" subtitle="3 items revelados">
          <div className="flex gap-1 mt-2 w-full">
            {["⚔️ Espada Clara", "🃏 Carta Épica", "💎 ×50"].map((r, i) => (
              <div key={i} className="flex-1 bg-white/5 rounded px-1 py-1.5 text-[5px] text-white text-center">{r}</div>
            ))}
          </div>
        </CenterScreen>
      ),
    }]),
  },

  // ═══════════════════════════════════════════
  // 8. TIENDA COMPLETA
  // ═══════════════════════════════════════════
  {
    id: "shop-complete", name: "Tienda Completa", icon: "🛍️", color: "#E6BF33", category: "Monetización",
    description: "6 tabs: Ofertas, Cofres, Diamantes, Boost, VIP, Pase de Batalla",
    steps: SHOP_TABS.map(tab => ({
      title: tab.name,
      description: `${tab.items.length} items`,
      screen: () => (
        <div className="flex-1 flex flex-col bg-[#0d0520] p-2 gap-1">
          <div className="flex justify-between items-center">
            <p className="text-[7px] text-white font-display">TIENDA</p>
            <div className="flex items-center gap-0.5">
              <img src={RESOURCE_ICONS.diamonds} className="w-3 h-3" />
              <span className="text-[6px] text-accent">420</span>
            </div>
          </div>
          <div className="flex gap-0.5 overflow-x-auto">
            {SHOP_TABS.map((t, i) => (
              <div key={i} className={cn("px-1 py-0.5 rounded text-[4px] shrink-0",
                t.name === tab.name ? "bg-primary/20 text-primary" : "bg-white/5 text-white/30")}>{t.name}</div>
            ))}
          </div>
          {tab.items.map((item, i) => (
            <MiniGlassPanel key={i}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[5px] text-white">{item.name}</p>
                  {item.tag && <span className={cn("text-[4px]", item.tagColor)}>{item.tag}</span>}
                </div>
                <span className="text-[5px] text-accent">{item.price}</span>
              </div>
            </MiniGlassPanel>
          ))}
        </div>
      ),
    })),
  },

  // ═══════════════════════════════════════════
  // 9. PASE DE BATALLA
  // ═══════════════════════════════════════════
  {
    id: "battle-pass", name: "Pase de Batalla", icon: "🎖️", color: "#CC33B8", category: "Monetización",
    description: "10 niveles — track gratis + premium — XP y recompensas",
    steps: [
      {
        title: "Overview", description: "Nivel actual + XP",
        screen: () => (
          <div className="flex-1 flex flex-col bg-[#0d0520] p-2">
            <div className="flex items-center gap-1 mb-2">
              <span className="text-lg">🎖️</span>
              <div>
                <p className="text-[7px] text-white font-display">PASE DE BATALLA</p>
                <p className="text-[5px] text-white/40">Temporada 1 — Nivel 7</p>
              </div>
            </div>
            <Progress value={78} className="h-1 mb-1" />
            <p className="text-[4px] text-white/30 text-center mb-2">2350/3000 XP</p>
            <div className="bg-secondary/20 border border-secondary/30 rounded-lg p-1.5 text-center mb-2">
              <p className="text-[5px] text-secondary">Desbloquea Premium — 999 💎</p>
            </div>
            {/* mini track */}
            <div className="space-y-0.5">
              <div className="grid grid-cols-[20px_1fr_1fr] gap-1 text-[4px] text-white/30">
                <span>NV</span><span>Gratis</span><span>Premium</span>
              </div>
              {BP_REWARDS.slice(0, 5).map((r, i) => (
                <div key={i} className={cn("grid grid-cols-[20px_1fr_1fr] gap-1 text-[4px] rounded py-0.5 px-0.5",
                  r.lvl <= 6 ? "bg-white/5" : r.lvl === 7 ? "bg-accent/10 border border-accent/30" : "opacity-50")}>
                  <span className="text-white/50">{r.lvl}</span>
                  <span className={r.lvl <= 6 ? "text-green-400" : "text-white/50"}>{r.free}</span>
                  <span className="text-white/30">{r.premium}</span>
                </div>
              ))}
            </div>
          </div>
        ),
      },
      {
        title: "Todos los Niveles", description: "10 niveles con recompensas",
        screen: () => (
          <div className="flex-1 flex flex-col bg-[#0d0520] p-1.5 overflow-hidden">
            <p className="text-[6px] text-white font-display mb-1">TRACK COMPLETO — 10 Niveles</p>
            <div className="space-y-0.5 flex-1 overflow-y-auto">
              {BP_REWARDS.map((r, i) => (
                <div key={i} className={cn("grid grid-cols-[16px_1fr_1fr] gap-0.5 text-[4px] py-0.5 px-0.5 rounded",
                  r.lvl <= 6 ? "bg-green-500/5" : r.lvl === 7 ? "bg-accent/10" : "bg-white/[0.02]")}>
                  <span className={r.lvl <= 7 ? "text-accent" : "text-white/30"}>{r.lvl}</span>
                  <span className={r.lvl <= 6 ? "text-green-400" : "text-white/40"}>{r.lvl <= 6 ? "✓" : ""} {r.free}</span>
                  <span className={r.lvl <= 6 ? "text-purple-400" : "text-white/30"}>{r.premium}</span>
                </div>
              ))}
            </div>
          </div>
        ),
      },
      {
        title: "Reclamar Recompensa", description: "Interacción de claim",
        screen: () => (
          <CenterScreen title="¡Nivel 7 Alcanzado!" emoji="🎖️" color="#CC33B8" subtitle="Recompensa disponible">
            <MiniGlassPanel className="w-full">
              <div className="flex justify-between items-center">
                <span className="text-[6px] text-white">1500 Madera</span>
                <div className="bg-green-600 rounded px-2 py-0.5 text-[5px] text-white">RECLAMAR</div>
              </div>
              <div className="flex justify-between items-center mt-1">
                <span className="text-[6px] text-white/30">200 Diamantes</span>
                <span className="text-[5px] text-white/30">🔒 Premium</span>
              </div>
            </MiniGlassPanel>
          </CenterScreen>
        ),
      },
    ],
  },

  // ═══════════════════════════════════════════
  // 10. CLANES
  // ═══════════════════════════════════════════
  {
    id: "clans", name: "Sistema de Clanes", icon: "⚔️", color: "#2ECC71", category: "Social",
    description: "Crear → buscar → unirse → dashboard → donaciones → eventos → leaderboard",
    steps: [
      {
        title: "Sin Clan", description: "Opciones de crear o unirse",
        screen: () => (
          <CenterScreen title="CLANES" subtitle="Únete a un clan para ganar recompensas cooperativas" emoji="🛡️">
            <div className="w-full space-y-1">
              <div className="bg-green-600 rounded-lg py-1.5 text-center text-[7px] text-white">CREAR CLAN</div>
              <div className="bg-white/5 border border-white/10 rounded-lg py-1.5 text-center text-[7px] text-white/70">BUSCAR CLAN</div>
            </div>
          </CenterScreen>
        ),
      },
      {
        title: "Crear Clan", description: "Formulario de creación",
        screen: () => (
          <div className="flex-1 flex flex-col bg-[#0d0520] p-2 gap-1">
            <p className="text-[7px] text-white font-display">CREAR CLAN</p>
            <MiniGlassPanel>
              <p className="text-[5px] text-white/40">Emblema</p>
              <div className="flex gap-1 mt-0.5">
                {[CLAN_ICONS.stellar_wolves, CLAN_ICONS.dragon_knights, CLAN_ICONS.iron_forge].map((src, i) => (
                  <div key={i} className={cn("w-6 h-6 rounded border flex items-center justify-center",
                    i === 0 ? "border-primary bg-primary/20" : "border-white/10")}>
                    <img src={src} className="w-4 h-4" />
                  </div>
                ))}
              </div>
            </MiniGlassPanel>
            <MiniGlassPanel>
              <p className="text-[5px] text-white/40">Nombre</p>
              <div className="h-4 bg-black/30 rounded mt-0.5 flex items-center px-1 text-[5px] text-white/30">Nombre del clan...</div>
            </MiniGlassPanel>
            <MiniGlassPanel>
              <p className="text-[5px] text-white/40">Privacidad</p>
              <div className="flex gap-1 mt-0.5">
                <div className="flex-1 bg-primary/20 rounded py-0.5 text-[5px] text-primary text-center">Público</div>
                <div className="flex-1 bg-white/5 rounded py-0.5 text-[5px] text-white/30 text-center">Privado</div>
              </div>
            </MiniGlassPanel>
            <div className="mt-auto bg-secondary/80 rounded-lg py-1.5 text-center text-[6px] text-white">CREAR — 500 💎</div>
          </div>
        ),
      },
      {
        title: "Buscar Clanes", description: "Lista con filtros",
        screen: () => (
          <ListScreen title="BUSCAR CLANES" items={[
            { label: "Cosmic Voyagers", sub: "Nv.12 • 45/50 • Gold", color: "#FFD700" },
            { label: "Tech Syndicate", sub: "Nv.15 • 50/50 • Diamond", color: "#00D4E6" },
            { label: "Void Reapers", sub: "Nv.20 • 48/50 • Legend", color: "#A855F7" },
            { label: "Solar Guardians", sub: "Nv.5 • 12/25 • Silver", color: "#94A3B8" },
          ]} />
        ),
      },
      {
        title: "Mi Clan — Dashboard", description: "Info, stats, eventos",
        screen: () => (
          <div className="flex-1 flex flex-col bg-[#0d0520] p-2 gap-1">
            <div className="flex items-center gap-1.5">
              <img src={CLAN_ICONS.dragon_knights} className="w-6 h-6" />
              <div>
                <p className="text-[7px] text-white font-display">Nebula Knights</p>
                <p className="text-[5px] text-white/40">Nv.8 • 20/30 • Silver</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-1">
              {[{ l: "Poder", v: "28.9K" }, { l: "Miembros", v: "20/30" }, { l: "Rango", v: "Silver" }, { l: "Nivel", v: "8" }].map(s => (
                <div key={s.l} className="bg-black/20 rounded p-1.5 text-center">
                  <p className="text-[6px] text-white font-display">{s.v}</p>
                  <p className="text-[4px] text-white/40">{s.l}</p>
                </div>
              ))}
            </div>
            <MiniGlassPanel>
              <p className="text-[5px] text-yellow-400">🏆 Raid Galáctico — Hoy 22:00</p>
              <Progress value={60} className="h-0.5 mt-1" />
            </MiniGlassPanel>
          </div>
        ),
      },
      {
        title: "Donaciones", description: "Donar recursos al clan",
        screen: () => (
          <div className="flex-1 flex flex-col bg-[#0d0520] p-2 gap-1">
            <p className="text-[7px] text-white font-display">DONACIONES</p>
            <p className="text-[5px] text-white/40">3/5 donaciones hoy</p>
            {[
              { res: "Piedra", amount: 100, icon: RESOURCE_ICONS.stone },
              { res: "Madera", amount: 100, icon: RESOURCE_ICONS.wood },
              { res: "Energía", amount: 10, icon: RESOURCE_ICONS.energy },
            ].map((d, i) => (
              <MiniGlassPanel key={i}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <img src={d.icon} className="w-3 h-3" />
                    <span className="text-[5px] text-white">{d.amount} {d.res}</span>
                  </div>
                  <div className="bg-primary/20 rounded px-1.5 py-0.5 text-[5px] text-primary">Donar</div>
                </div>
              </MiniGlassPanel>
            ))}
            <MiniGlassPanel className="mt-auto">
              <p className="text-[5px] text-green-400">Total donado: 4,200 recursos</p>
              <Progress value={42} className="h-0.5 mt-0.5" />
              <p className="text-[4px] text-white/30">4.2K / 10K para logro</p>
            </MiniGlassPanel>
          </div>
        ),
      },
      {
        title: "Clan Leaderboard", description: "Ranking de miembros",
        screen: () => (
          <div className="flex-1 flex flex-col bg-[#0d0520] p-2">
            <p className="text-[7px] text-white font-display mb-1">RANKING DEL CLAN</p>
            {["CosmicDragon", "StarKnight", "NebulaMage", "Tú", "VoidWalker"].map((name, i) => (
              <div key={name} className={cn("flex items-center gap-1.5 py-1 border-b border-white/5",
                name === "Tú" && "bg-primary/10 rounded px-1")}>
                <span className="text-[6px] w-4 text-center">{["🥇", "🥈", "🥉", "4", "5"][i]}</span>
                <span className={cn("text-[6px] flex-1", name === "Tú" ? "text-primary" : "text-white")}>{name}</span>
                <span className="text-[5px] text-white/40">⚡{[12400, 9800, 7200, 4900, 4200][i]}</span>
              </div>
            ))}
          </div>
        ),
      },
    ],
  },

  // ═══════════════════════════════════════════
  // 11. LOGROS
  // ═══════════════════════════════════════════
  {
    id: "achievements", name: "Logros", icon: "🏆", color: "#F59E0B", category: "Social",
    description: "Logros por categoría: Planeta, Combate, Colección, Clan, Compra, Anuncios",
    steps: [
      {
        title: "Vista General", description: "Progreso total de logros",
        screen: () => (
          <div className="flex-1 flex flex-col bg-[#0d0520] p-2">
            <div className="flex items-center gap-1 mb-2">
              <span className="text-lg">🏆</span>
              <div>
                <p className="text-[7px] text-white font-display">LOGROS</p>
                <p className="text-[5px] text-white/40">5/10 completados</p>
              </div>
              <Progress value={50} className="h-1 w-12 ml-auto" />
            </div>
            <div className="flex gap-0.5 mb-1 overflow-x-auto">
              {["Todos", "Planeta", "Combate", "Colección", "Clan"].map((c, i) => (
                <div key={c} className={cn("px-1 py-0.5 rounded text-[4px] shrink-0",
                  i === 0 ? "bg-amber-500/20 text-amber-400" : "bg-white/5 text-white/30")}>{c}</div>
              ))}
            </div>
            {ACHIEVEMENTS_DATA.slice(0, 5).map((a, i) => (
              <div key={i} className={cn("flex items-center gap-1.5 py-1 border-b border-white/5",
                a.done && "opacity-70")}>
                <div className={cn("w-5 h-5 rounded flex items-center justify-center text-[8px]",
                  a.done ? "bg-amber-500/20" : "bg-white/5")}>{a.done ? "✓" : "○"}</div>
                <div className="flex-1 min-w-0">
                  <p className="text-[5px] text-white truncate">{a.name}</p>
                  <p className="text-[4px] text-white/30 truncate">{a.desc}</p>
                </div>
                <span className="text-[4px] text-accent">{a.reward}</span>
              </div>
            ))}
          </div>
        ),
      },
      {
        title: "Detalle de Logro", description: "Progreso + recompensa",
        screen: () => (
          <div className="flex-1 flex flex-col items-center justify-center bg-[#0d0520] p-3">
            <span className="text-3xl mb-1">⚔️</span>
            <p className="text-[8px] text-white font-display">Guerrero</p>
            <p className="text-[5px] text-white/50 mt-1">Gana 50 combates</p>
            <p className="text-[5px] text-white/30 mt-0.5">Categoría: Combate</p>
            <div className="w-full mt-2">
              <div className="flex justify-between text-[5px] text-white/40"><span>23/50</span><span>46%</span></div>
              <Progress value={46} className="h-1" />
            </div>
            <MiniGlassPanel className="w-full mt-2">
              <div className="flex justify-between items-center">
                <span className="text-[5px] text-white/50">Recompensa:</span>
                <span className="text-[6px] text-accent font-display">100 💎</span>
              </div>
            </MiniGlassPanel>
          </div>
        ),
      },
      {
        title: "Logro Completado", description: "Animación de desbloqueo",
        screen: () => (
          <CenterScreen title="¡LOGRO DESBLOQUEADO!" emoji="🏆" color="#F59E0B" subtitle="Explorador de Eras — Desbloquea 3 eras">
            <MiniGlassPanel className="w-full">
              <div className="flex items-center justify-between">
                <span className="text-[5px] text-white/50">Recompensa reclamada:</span>
                <span className="text-[6px] text-accent">+150 💎</span>
              </div>
            </MiniGlassPanel>
          </CenterScreen>
        ),
      },
    ],
  },

  // ═══════════════════════════════════════════
  // 12. LEADERBOARD
  // ═══════════════════════════════════════════
  {
    id: "leaderboard", name: "Leaderboard", icon: "👑", color: "#FFD700", category: "Social",
    description: "Ranking global, clan y temporada — top 10 + tu posición",
    steps: [
      {
        title: "Ranking Global", description: "Top 10 jugadores",
        screen: () => (
          <div className="flex-1 flex flex-col bg-[#0d0520] p-2">
            <p className="text-[7px] text-white font-display mb-1">RANKING GLOBAL</p>
            <div className="flex gap-0.5 mb-1">
              {["Global", "Clan", "Temporada"].map((t, i) => (
                <div key={t} className={cn("flex-1 text-center rounded py-0.5 text-[4px]",
                  i === 0 ? "bg-primary/20 text-primary" : "bg-white/5 text-white/30")}>{t}</div>
              ))}
            </div>
            {/* Podium */}
            <div className="flex items-end justify-center gap-2 mb-1 h-16">
              {[{ n: "🥈 Cosmic", h: "h-10" }, { n: "🥇 Dragon", h: "h-14" }, { n: "🥉 Nova", h: "h-8" }].map((p, i) => (
                <div key={i} className="flex flex-col items-center">
                  <div className={cn("w-8 rounded-t bg-gradient-to-t from-amber-500/20 to-transparent flex items-end justify-center pb-0.5 text-[4px] text-white/70", p.h)}>{p.n}</div>
                </div>
              ))}
            </div>
            {["ShadowForge", "CrystalHunter", "IronWill", "Tú (#47)"].map((name, i) => (
              <div key={name} className={cn("flex items-center gap-1 py-0.5 border-b border-white/5 text-[5px]",
                name.includes("Tú") && "bg-primary/10 rounded px-1")}>
                <span className="w-4 text-white/40">#{i + 4}</span>
                <span className={name.includes("Tú") ? "text-primary flex-1" : "text-white flex-1"}>{name}</span>
                <span className="text-white/30">{[87.2, 78.9, 71.0, 12.5][i]}K</span>
              </div>
            ))}
          </div>
        ),
      },
      {
        title: "Ranking de Clanes", description: "Top clanes globales",
        screen: () => (
          <ListScreen title="RANKING DE CLANES" items={[
            { label: "Void Reapers", sub: "Legend • 92K poder", icon: "🛡️", color: "#A855F7" },
            { label: "Tech Syndicate", sub: "Diamond • 68K poder", icon: "🛡️", color: "#00D4E6" },
            { label: "Cosmic Voyagers", sub: "Gold • 45K poder", icon: "🛡️", color: "#FFD700" },
            { label: "Nebula Knights (Tú)", sub: "Silver • 29K poder", icon: "🛡️", color: "#94A3B8" },
          ]} />
        ),
      },
      {
        title: "Ranking Temporada", description: "Ranking de la temporada actual",
        screen: () => (
          <div className="flex-1 flex flex-col bg-[#0d0520] p-2">
            <p className="text-[7px] text-white font-display mb-1">TEMPORADA 1</p>
            <MiniGlassPanel className="mb-1">
              <p className="text-[5px] text-white/50">Tiempo restante:</p>
              <p className="text-[6px] text-accent">23 días 14:32:08</p>
            </MiniGlassPanel>
            <p className="text-[5px] text-white/40 mb-1">Recompensas por rango:</p>
            {[
              { rank: "Top 10", reward: "500 💎 + Skin Exclusiva", color: "#FFD700" },
              { rank: "Top 100", reward: "200 💎 + Cofre Legendario", color: "#A855F7" },
              { rank: "Top 1000", reward: "50 💎 + Cofre Épico", color: "#00D4E6" },
            ].map((r, i) => (
              <div key={i} className="flex items-center gap-1 py-0.5 text-[5px]">
                <div className="w-2 h-2 rounded-full" style={{ background: r.color }} />
                <span className="text-white flex-1">{r.rank}</span>
                <span className="text-white/40">{r.reward}</span>
              </div>
            ))}
          </div>
        ),
      },
    ],
  },

  // ═══════════════════════════════════════════
  // 13. SKINS DE ARIS
  // ═══════════════════════════════════════════
  {
    id: "skins", name: "Skins de Aris", icon: "👔", color: "#00E5FF", category: "Personalización",
    description: "6 skins con preview, método de desbloqueo y equipamiento",
    steps: [
      {
        title: "Click en Aris", description: "Desde la vista del planeta",
        screen: () => (
          <div className="flex-1 flex flex-col items-center justify-center bg-gradient-to-b from-[#0d0520] to-[#0a1520]">
            <div className="text-4xl mb-2">🧑‍🚀</div>
            <div className="bg-black/60 rounded-lg px-2 py-1 border border-cyan-500/30">
              <p className="text-[6px] text-white">Aris — Default</p>
              <p className="text-[5px] text-white/40">Click para cambiar skin</p>
            </div>
          </div>
        ),
      },
      {
        title: "Galería de Skins", description: "6 skins disponibles",
        screen: () => (
          <div className="flex-1 flex flex-col bg-gradient-to-t from-black to-transparent justify-end p-2">
            <div className="flex-1 flex items-center justify-center"><div className="text-4xl">🧑‍🚀</div></div>
            <p className="text-[7px] text-white font-display mb-1">Skins de Aris</p>
            <div className="flex gap-1 overflow-x-auto pb-1">
              {SKINS.map((s, i) => (
                <div key={i} className={cn("shrink-0 w-10 rounded-lg p-1 border text-center",
                  i === 0 ? "border-cyan-400 bg-cyan-400/10" : s.locked ? "border-white/10 opacity-40" : "border-white/15 bg-white/5")}>
                  <div className={cn("w-6 h-8 mx-auto rounded bg-gradient-to-b mb-0.5", s.color)}>
                    {s.locked && <div className="flex items-center justify-center h-full text-[8px]">🔒</div>}
                  </div>
                  <p className="text-[4px] text-white/70">{s.name.split(" ")[0]}</p>
                  {i === 0 && <p className="text-[3px] text-cyan-400">equipado</p>}
                </div>
              ))}
            </div>
          </div>
        ),
      },
      {
        title: "Detalle — Desbloqueo", description: "Cómo obtener cada skin",
        screen: () => (
          <div className="flex-1 flex flex-col bg-[#0d0520] p-2 gap-0.5">
            <p className="text-[7px] text-white font-display mb-1">CÓMO DESBLOQUEAR</p>
            {SKINS.map((s, i) => (
              <div key={i} className={cn("flex items-center gap-1.5 py-1 px-1.5 rounded border",
                s.locked ? "border-white/10 opacity-60" : "border-cyan-500/20 bg-cyan-500/5")}>
                <div className={cn("w-5 h-7 rounded bg-gradient-to-b shrink-0", s.color)} />
                <div className="flex-1 min-w-0">
                  <p className="text-[5px] text-white truncate">{s.name}</p>
                  <p className="text-[4px] text-white/40 truncate">{s.unlock}</p>
                </div>
                <span className="text-[5px]">{s.locked ? "🔒" : "✓"}</span>
              </div>
            ))}
          </div>
        ),
      },
    ],
  },

  // ═══════════════════════════════════════════
  // 14. RECOMPENSAS DIARIAS
  // ═══════════════════════════════════════════
  {
    id: "daily-rewards", name: "Recompensas Diarias", icon: "🎁", color: "#FF6B35", category: "Engagement",
    description: "Ciclo de 7 días — cada día su recompensa — bonus de racha",
    steps: [
      {
        title: "Popup de Login", description: "Se muestra al entrar cada día",
        screen: () => (
          <div className="flex-1 flex flex-col items-center justify-center bg-[#0d0520]/90 p-3">
            <MiniGlassPanel className="w-full">
              <p className="text-[8px] text-white font-display text-center mb-2">RECOMPENSA DIARIA</p>
              <p className="text-[5px] text-orange-400 text-center mb-2">🔥 Racha: 4 días</p>
              <div className="grid grid-cols-7 gap-0.5 mb-2">
                {DAILY_REWARDS.map((d, i) => (
                  <div key={i} className={cn("aspect-square rounded flex flex-col items-center justify-center",
                    i < 3 ? "bg-green-500/20 border border-green-500/30" :
                    i === 3 ? "bg-yellow-500/20 border border-yellow-500/40" :
                    "bg-white/5 border border-white/10")}>
                    <span className="text-[6px]">{i < 3 ? "✓" : i === 3 ? "🎁" : "🔒"}</span>
                    <span className="text-[3px] text-white/40">D{d.day}</span>
                  </div>
                ))}
              </div>
              <div className="bg-yellow-500/20 rounded-lg py-1.5 text-center text-[6px] text-yellow-400 font-display">RECLAMAR DÍA 4</div>
            </MiniGlassPanel>
          </div>
        ),
      },
      {
        title: "Ciclo de 7 Días", description: "Detalle de cada recompensa",
        screen: () => (
          <div className="flex-1 flex flex-col bg-[#0d0520] p-2 gap-0.5">
            <p className="text-[7px] text-white font-display">CICLO SEMANAL</p>
            {DAILY_REWARDS.map((d, i) => (
              <div key={i} className={cn("flex items-center gap-1.5 py-0.5 px-1 rounded text-[5px]",
                i < 3 ? "bg-green-500/10" : i === 3 ? "bg-yellow-500/10 border border-yellow-500/20" : "bg-white/5 opacity-50")}>
                <span className="text-[6px] w-4">D{d.day}</span>
                <img src={RESOURCE_ICONS[d.icon as keyof typeof RESOURCE_ICONS]} className="w-3 h-3" />
                <span className="text-white flex-1">{d.reward}</span>
                <span className="text-[4px]">{i < 3 ? "✓" : i === 3 ? "HOY" : "🔒"}</span>
              </div>
            ))}
            <MiniGlassPanel className="mt-1">
              <p className="text-[5px] text-orange-400">🔥 Bonus racha 7 días: Cofre Épico + 25 💎 + 100 ⚡</p>
            </MiniGlassPanel>
          </div>
        ),
      },
      {
        title: "Racha de 7 Días", description: "Recompensa especial",
        screen: () => (
          <CenterScreen title="¡RACHA DE 7 DÍAS!" subtitle="Recompensa especial desbloqueada" emoji="🎊" color="#FBBF24">
            <MiniGlassPanel className="w-full">
              <div className="space-y-1 text-[6px]">
                <p className="text-yellow-400">📦 Cofre Épico</p>
                <p className="text-green-400">💎 ×25 Diamantes</p>
                <p className="text-purple-400">⚡ ×100 Energía</p>
              </div>
            </MiniGlassPanel>
          </CenterScreen>
        ),
      },
    ],
  },

  // ═══════════════════════════════════════════
  // 15. CONFIGURACIÓN
  // ═══════════════════════════════════════════
  {
    id: "settings", name: "Configuración", icon: "⚙️", color: "#94A3B8", category: "Sistema",
    description: "Perfil, audio, notificaciones, gráficos, idioma, soporte",
    steps: [
      {
        title: "Perfil del Jugador", description: "Info de cuenta + stats",
        screen: () => (
          <div className="flex-1 flex flex-col bg-[#0d0520] p-2 gap-1">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-10 h-10 rounded-full bg-primary/20 border-2 border-primary/40 flex items-center justify-center text-lg">🧑‍🚀</div>
              <div>
                <p className="text-[7px] text-white font-display">Player_001</p>
                <p className="text-[4px] text-white/30">ID: a1b2c3d4 • Nv.24 • Bronce</p>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-1 text-center">
              {[{ v: "142", l: "Victorias" }, { v: "27", l: "Cartas" }, { v: "7", l: "Logros" }].map(s => (
                <div key={s.l} className="bg-black/20 rounded p-1.5">
                  <p className="text-[6px] text-white font-display">{s.v}</p>
                  <p className="text-[4px] text-white/40">{s.l}</p>
                </div>
              ))}
            </div>
          </div>
        ),
      },
      {
        title: "Ajustes", description: "Audio, notificaciones, gráficos",
        screen: () => (
          <div className="flex-1 flex flex-col bg-[#0d0520] p-2 gap-0.5">
            <p className="text-[7px] text-white font-display">CONFIGURACIÓN</p>
            {[
              { section: "Audio", items: ["Efectos de sonido: ON", "Música: ON"] },
              { section: "Notificaciones", items: ["Push: ON"] },
              { section: "Gráficos", items: ["Calidad: Alto"] },
              { section: "Idioma", items: ["ES / EN / PT"] },
            ].map(s => (
              <MiniGlassPanel key={s.section}>
                <p className="text-[4px] text-white/30 mb-0.5">{s.section}</p>
                {s.items.map((item, i) => (
                  <div key={i} className="flex items-center justify-between py-0.5">
                    <span className="text-[5px] text-white">{item}</span>
                    <div className="w-6 h-3 rounded-full bg-primary/60 relative">
                      <div className="w-2.5 h-2.5 rounded-full bg-white absolute top-0.5 right-0.5" />
                    </div>
                  </div>
                ))}
              </MiniGlassPanel>
            ))}
          </div>
        ),
      },
      {
        title: "Soporte", description: "Reportar, privacidad, info",
        screen: () => (
          <div className="flex-1 flex flex-col bg-[#0d0520] p-2 gap-0.5">
            <p className="text-[7px] text-white font-display mb-1">SOPORTE</p>
            {["Reportar un problema", "Política de privacidad", "Guía de Sprites", "Acerca del juego v1.0.0"].map((item, i) => (
              <div key={i} className="flex items-center justify-between py-1.5 px-2 bg-white/5 rounded border border-white/5">
                <span className="text-[5px] text-white">{item}</span>
                <span className="text-[5px] text-white/20">→</span>
              </div>
            ))}
            <div className="mt-2 space-y-0.5">
              <div className="py-1.5 px-2 bg-red-500/10 rounded border border-red-500/20 text-[5px] text-red-400">Borrar datos guardados</div>
              <div className="py-1.5 px-2 bg-red-500/10 rounded border border-red-500/20 text-[5px] text-red-400">Cerrar sesión</div>
            </div>
          </div>
        ),
      },
    ],
  },

  // ═══════════════════════════════════════════
  // 16. SISTEMA DE ENERGÍA
  // ═══════════════════════════════════════════
  {
    id: "energy-system", name: "Sistema de Energía", icon: "⚡", color: "#FBBF24", category: "Sistema",
    description: "+2 energía por mejora de estructura — se usa en combate — recarga con diamantes o anuncios",
    steps: [
      {
        title: "Barra de Energía", description: "UI siempre visible en combate",
        screen: () => (
          <div className="flex-1 flex flex-col bg-[#0d0520] p-2 gap-1">
            <p className="text-[7px] text-white font-display">SISTEMA DE ENERGÍA</p>
            <MiniGlassPanel className="border-yellow-500/20" style={{ background: "linear-gradient(135deg, rgba(234,179,8,0.05), rgba(234,179,8,0.1))" }}>
              <div className="flex items-center gap-1 mb-1">
                <img src={RESOURCE_ICONS.energy} className="w-3 h-3" />
                <span className="text-[6px] text-white font-display">Energía: 28/30</span>
              </div>
              <Progress value={93} className="h-1" />
              <p className="text-[4px] text-white/30 mt-0.5">Costo por combate: 5</p>
            </MiniGlassPanel>
            <MiniGlassPanel>
              <p className="text-[5px] text-white/50 mb-1">Cómo obtener energía:</p>
              <div className="space-y-0.5 text-[5px]">
                <p className="text-green-400">⛏️ +2 por cada mejora de estructura</p>
                <p className="text-yellow-400">💎 Recargar con 10 diamantes</p>
                <p className="text-cyan-400">📺 Ver anuncio = +5 energía</p>
                <p className="text-purple-400">🎁 Recompensas diarias y logros</p>
              </div>
            </MiniGlassPanel>
          </div>
        ),
      },
      {
        title: "Mejora → Energía", description: "+2 al mejorar estructura",
        screen: () => (
          <div className="flex-1 flex flex-col items-center justify-center bg-[#0d0520] p-3">
            <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 0.5 }}>
              <span className="text-4xl">⛏️</span>
            </motion.div>
            <p className="text-[8px] text-white font-display mt-2">¡Cantera Nv.6!</p>
            <div className="flex gap-3 mt-2 text-[6px]">
              <span className="text-green-400">+12.4/s Piedra</span>
              <span className="text-yellow-400">+2 ⚡ Energía</span>
            </div>
            <MiniGlassPanel className="w-full mt-3">
              <div className="flex items-center justify-between text-[5px]">
                <span className="text-white/50">Energía:</span>
                <span className="text-yellow-400">28 → 30</span>
              </div>
              <Progress value={100} className="h-0.5 mt-0.5" />
            </MiniGlassPanel>
          </div>
        ),
      },
      {
        title: "Sin Energía", description: "Opciones de recarga",
        screen: () => (
          <div className="flex-1 flex flex-col bg-[#0d0520] p-2 gap-1">
            <MiniGlassPanel className="border-red-500/20">
              <div className="flex items-center gap-1">
                <img src={RESOURCE_ICONS.energy} className="w-3 h-3" />
                <span className="text-[6px] text-red-400 font-display">Energía: 2/30</span>
              </div>
              <Progress value={7} className="h-1 mt-0.5" />
              <p className="text-[4px] text-red-400 mt-0.5">Necesitas 5 para combatir</p>
            </MiniGlassPanel>
            <div className="bg-gradient-to-r from-accent to-orange-500 rounded-lg py-2 text-center">
              <p className="text-[6px] text-black font-display">🔋 Recargar — 10 💎</p>
              <p className="text-[4px] text-black/60">Llena toda la barra</p>
            </div>
            <div className="bg-white/10 rounded-lg py-2 text-center border border-white/10">
              <p className="text-[6px] text-white font-display">📺 Ver Anuncio +5</p>
              <p className="text-[4px] text-white/40">Disponible cada 5 min</p>
            </div>
            <MiniGlassPanel className="mt-auto">
              <p className="text-[5px] text-white/50">Tip: Mejora estructuras para ganar +2⚡ cada vez</p>
            </MiniGlassPanel>
          </div>
        ),
      },
    ],
  },
  // ═══════════════════════════════════════════
  // PRESTIGIO / MINIJUEGO IDLE
  // ═══════════════════════════════════════════
  {
    id: "prestige", name: "Prestigio (MiniJuego Idle)", icon: "🔮", color: "#9B00FF", category: "Gameplay",
    description: "Producción idle → Acumulación → Reclamar → Prestigiar → Multiplicadores → Click manual",
    steps: [
      {
        title: "Pantalla Principal",
        description: "Nivel de prestigio + producción",
        screen: () => (
          <div className="flex-1 flex flex-col bg-[#0d0520] p-2 gap-1.5">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-6 h-6 bg-purple-600/30 rounded-lg flex items-center justify-center text-sm">🔮</div>
              <div>
                <p className="text-[8px] text-purple-300 font-display">PRESTIGIO</p>
                <p className="text-[5px] text-white/40">Minijuego Idle de Producción</p>
              </div>
            </div>
            <MiniGlassPanel className="text-center py-3">
              <div className="w-14 h-14 mx-auto rounded-full flex items-center justify-center mb-2"
                style={{ background:"radial-gradient(circle, rgba(123,47,252,0.3), rgba(10,14,39,0.9))", border:"2px solid #9B00FF", boxShadow:"0 0 20px rgba(123,47,252,0.4)" }}>
                <div>
                  <div className="text-xl font-display text-white">3</div>
                  <div className="text-[5px] text-white/40">NIVEL</div>
                </div>
              </div>
              <p className="text-[6px] text-purple-300 font-display">Multiplicador: <span className="text-yellow-400">2.5x</span></p>
            </MiniGlassPanel>
            <div className="grid grid-cols-3 gap-1">
              {[
                { label: "Acumulado", val: "1,247", color: "text-white" },
                { label: "Producción", val: "+4.8/s", color: "text-cyan-400" },
                { label: "Banco", val: "353", color: "text-yellow-400" },
              ].map(s => (
                <div key={s.label} className="bg-black/30 rounded-lg p-1.5 text-center">
                  <div className={`text-[8px] font-display ${s.color}`}>{s.val}</div>
                  <div className="text-[4px] text-white/40">{s.label}</div>
                </div>
              ))}
            </div>
            <div>
              <div className="flex justify-between text-[5px] text-white/40 mb-0.5">
                <span>Próximo Prestigio</span><span>247/500</span>
              </div>
              <div className="h-1 bg-black/40 rounded-full overflow-hidden">
                <div className="h-full rounded-full bg-gradient-to-r from-purple-600 to-cyan-400" style={{ width: "49%" }} />
              </div>
            </div>
            <div className="bg-gradient-to-r from-purple-700 to-purple-900 rounded-lg py-1.5 text-center text-[6px] text-white font-display">
              ▶ Iniciar Producción
            </div>
          </div>
        ),
      },
      {
        title: "Producción Activa",
        description: "Idle auto + click manual",
        screen: () => (
          <div className="flex-1 flex flex-col bg-[#0d0520] p-2 gap-1.5">
            <div className="grid grid-cols-3 gap-1">
              {[
                { label: "Acumulado", val: "2,891", color: "text-white" },
                { label: "Producción", val: "+4.8/s", color: "text-cyan-400" },
                { label: "Banco", val: "353", color: "text-yellow-400" },
              ].map(s => (
                <div key={s.label} className="bg-black/30 rounded-lg p-1.5 text-center">
                  <div className={`text-[8px] font-display ${s.color}`}>{s.val}</div>
                  <div className="text-[4px] text-white/40">{s.label}</div>
                </div>
              ))}
            </div>
            <MiniGlassPanel className="text-center flex-1 flex flex-col items-center justify-center">
              <p className="text-[6px] text-white/50 mb-2">Producción Manual</p>
              <div className="w-16 h-16 rounded-full flex items-center justify-center mb-1"
                style={{ background:"radial-gradient(circle, hsl(280 90% 45%), hsl(280 90% 20%))", boxShadow:"0 0 20px rgba(123,47,252,0.6)", border:"2px solid #9B00FF" }}>
                <span className="text-xl">⚡</span>
              </div>
              <p className="text-[5px] text-white/40">+2.5 por clic</p>
            </MiniGlassPanel>
            <div className="bg-gradient-to-r from-slate-600 to-slate-700 rounded-lg py-1.5 text-center text-[6px] text-white font-display">
              ⏸ Pausar Producción
            </div>
            <div className="bg-gradient-to-r from-cyan-600 to-cyan-700 rounded-lg py-1.5 text-center text-[6px] text-black font-display">
              💰 Reclamar 2,891 recursos
            </div>
          </div>
        ),
      },
      {
        title: "Prestigiar",
        description: "Reset + multiplicador nuevo",
        screen: () => (
          <div className="flex-1 flex flex-col items-center justify-center bg-gradient-to-b from-[#1a0a3e] to-[#0d0520] p-3">
            <div className="w-16 h-16 rounded-full flex items-center justify-center mb-2"
              style={{ background:"radial-gradient(circle, rgba(123,47,252,0.5), rgba(10,14,39,0.9))", border:"3px solid #FFD700", boxShadow:"0 0 30px rgba(255,215,0,0.4)" }}>
              <div className="text-center">
                <div className="text-xl font-display text-yellow-400">4</div>
                <div className="text-[5px] text-yellow-400/60">NUEVO</div>
              </div>
            </div>
            <p className="text-[8px] text-yellow-400 font-display mb-1">¡PRESTIGIO!</p>
            <p className="text-[6px] text-white/60 mb-3">Nivel 3 → 4</p>
            <MiniGlassPanel className="w-full">
              <p className="text-[5px] text-white/50 mb-1">Nuevas bonificaciones:</p>
              <div className="space-y-0.5 text-[5px]">
                <div className="flex justify-between"><span className="text-white/60">Producción</span><span className="text-green-400">+40%</span></div>
                <div className="flex justify-between"><span className="text-white/60">Velocidad combate</span><span className="text-cyan-400">+20%</span></div>
                <div className="flex justify-between"><span className="text-white/60">XP ganada</span><span className="text-purple-400">+60%</span></div>
                <div className="flex justify-between"><span className="text-white/60">Multiplicador</span><span className="text-yellow-400">3.0x</span></div>
              </div>
            </MiniGlassPanel>
          </div>
        ),
      },
      {
        title: "Bonificaciones",
        description: "Lista de mejoras por nivel",
        screen: () => (
          <div className="flex-1 flex flex-col bg-[#0d0520] p-2 gap-1.5">
            <p className="text-[7px] text-white font-display">BONIFICACIONES DE PRESTIGIO</p>
            <p className="text-[5px] text-white/40">Nivel actual: 4 • Mult: 3.0x</p>
            {[
              { label: "Producción de recursos", val: "+40%", color: "text-green-400" },
              { label: "Velocidad de combate", val: "+20%", color: "text-cyan-400" },
              { label: "Experiencia ganada", val: "+60%", color: "text-purple-400" },
              { label: "Multiplicador idle", val: "3.0x", color: "text-yellow-400" },
              { label: "Drop rate cartas", val: "+12%", color: "text-orange-400" },
              { label: "Drop rate equipamiento", val: "+8%", color: "text-blue-400" },
            ].map(b => (
              <div key={b.label} className="flex justify-between items-center bg-white/5 rounded-lg px-2 py-1.5">
                <span className="text-[6px] text-white/60">{b.label}</span>
                <span className={`text-[7px] font-bold ${b.color}`}>{b.val}</span>
              </div>
            ))}
          </div>
        ),
      },
    ],
  },

  // ═══════════════════════════════════════════
  // HOME DETAIL
  // ═══════════════════════════════════════════
  {
    id: "home-detail", name: "Pantalla de Inicio Detallada", icon: "🏠", color: "#4ADE80", category: "Core",
    description: "Home completo: barra superior, badges, planetas, producción total, energía",
    steps: [
      {
        title: "Home Completo", description: "Vista principal con stats y energía",
        screen: () => (
          <div className="flex-1 flex flex-col bg-[#0d0520] p-2 gap-1">
            <div className="text-center text-[8px] font-display text-primary mb-0.5">EVOLVION</div>
            <MiniResourceBar />
            <MiniGlassPanel>
              <div className="flex items-center justify-around">
                <div className="flex flex-col items-center">
                  <span className="text-[5px] text-accent">Poder</span>
                  <span className="text-[8px] text-white font-display">700</span>
                </div>
                <div className="w-px h-5 bg-white/10" />
                <div className="flex flex-col items-center">
                  <span className="text-[5px] text-secondary">Planetas</span>
                  <span className="text-[8px] text-white font-display">2/3</span>
                </div>
                <div className="w-px h-5 bg-white/10" />
                <div className="flex flex-col items-center">
                  <span className="text-[5px] text-primary">Total/s</span>
                  <span className="text-[8px] text-white font-display">24.5</span>
                </div>
              </div>
            </MiniGlassPanel>
            <MiniGlassPanel className="border-blue-500/30">
              <div className="flex items-center gap-1">
                <img src={RESOURCE_ICONS.energy} className="w-3 h-3" />
                <div className="flex-1">
                  <div className="flex justify-between text-[5px]">
                    <span className="text-blue-400">Energía</span>
                    <span className="text-white">28/30</span>
                  </div>
                  <Progress value={93} className="h-0.5 mt-0.5" />
                </div>
              </div>
            </MiniGlassPanel>
            <div className="grid grid-cols-2 gap-0.5">
              <MiniGlassPanel className="border-red-500/20">
                <div className="flex items-center gap-1">
                  <img src={NAV_ICONS.combat} className="w-3 h-3" />
                  <div>
                    <p className="text-[5px] text-white">Combate</p>
                    <p className="text-[4px] text-red-400">3 enemigos</p>
                  </div>
                </div>
              </MiniGlassPanel>
              <MiniGlassPanel className="border-amber-500/20">
                <div className="flex items-center gap-1">
                  <img src={NAV_ICONS.structures} className="w-3 h-3" />
                  <div>
                    <p className="text-[5px] text-white">Estructuras</p>
                    <p className="text-[4px] text-green-400">+24.5/s</p>
                  </div>
                </div>
              </MiniGlassPanel>
            </div>
            <MiniNavBar active="planet" />
          </div>
        ),
      },
      {
        title: "Badges del Home", description: "4 badges de acceso rápido",
        screen: () => (
          <div className="flex-1 flex flex-col bg-[#0d0520] p-2 gap-1">
            <p className="text-[7px] text-white font-display">BADGES</p>
            <div className="grid grid-cols-2 gap-1">
              {[
                { name: "Battle Pass", icon: BADGE_ICONS.battlepass, color: "#A855F7", sub: "Nv.4 — 3 recompensas" },
                { name: "Daily Reward", icon: BADGE_ICONS.dailyreward, color: "#F59E0B", sub: "Racha: 4 días" },
                { name: "Free Ads", icon: BADGE_ICONS.freeads, color: "#22C55E", sub: "3/5 anuncios hoy" },
                { name: "Evento Especial", icon: BADGE_ICONS.event, color: "#EF4444", sub: "2d 14h restantes" },
              ].map(b => (
                <MiniGlassPanel key={b.name} className="flex flex-col items-center gap-0.5 py-1.5">
                  <img src={b.icon} className="w-5 h-5" />
                  <span className="text-[5px] font-display" style={{ color: b.color }}>{b.name}</span>
                  <span className="text-[4px] text-white/40">{b.sub}</span>
                  <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                </MiniGlassPanel>
              ))}
            </div>
            <MiniNavBar active="planet" />
          </div>
        ),
      },
      {
        title: "Tap en Badge", description: "Cada badge abre su sección",
        screen: () => (
          <div className="flex-1 flex flex-col bg-[#0d0520] p-2 gap-1">
            <p className="text-[7px] text-white font-display">ACCIÓN POR BADGE</p>
            {[
              { name: "Battle Pass", action: "Abre popup del Pase de Batalla", color: "#A855F7", icon: "🎫" },
              { name: "Daily Reward", action: "Navega a Recompensas Diarias", color: "#F59E0B", icon: "🎁" },
              { name: "Free Ads", action: "Reproduce anuncio → +5 energía", color: "#22C55E", icon: "📺" },
              { name: "Evento", action: "Muestra detalles del evento activo", color: "#EF4444", icon: "🏆" },
            ].map(b => (
              <MiniGlassPanel key={b.name}>
                <div className="flex items-center gap-1.5">
                  <span className="text-sm">{b.icon}</span>
                  <div className="flex-1">
                    <p className="text-[5px] font-display" style={{ color: b.color }}>{b.name}</p>
                    <p className="text-[4px] text-white/40">{b.action}</p>
                  </div>
                  <ArrowRight className="w-2.5 h-2.5 text-white/20" />
                </div>
              </MiniGlassPanel>
            ))}
          </div>
        ),
      },
      {
        title: "Lista de Planetas", description: "3 planetas con estado de era",
        screen: () => (
          <div className="flex-1 flex flex-col bg-[#0d0520] p-2 gap-1">
            <p className="text-[7px] text-white font-display">TUS PLANETAS</p>
            {[
              { name: "Porera", era: "Bronce (3/9)", prod: "+6.1/s", color: "#4CAF50", icon: "🌍", unlocked: true },
              { name: "Doresa", era: "Industrial (6/9)", prod: "+18.4/s", color: "#00BCD4", icon: "🌊", unlocked: true },
              { name: "Aitherium", era: "Bloqueado", prod: "—", color: "#7B2FF7", icon: "🔮", unlocked: false },
            ].map(p => (
              <MiniGlassPanel key={p.name} className={p.unlocked ? "" : "opacity-50 grayscale"}>
                <div className="flex items-center gap-1.5">
                  <span className="text-lg">{p.icon}</span>
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <span className="text-[6px] font-display text-white">{p.name}</span>
                      <span className="text-[5px]" style={{ color: p.color }}>{p.era}</span>
                    </div>
                    {p.unlocked && (
                      <>
                        <Progress value={p.name === "Porera" ? 25 : 62} className="h-0.5 mt-0.5" />
                        <span className="text-[4px] text-green-400">{p.prod}</span>
                      </>
                    )}
                  </div>
                </div>
              </MiniGlassPanel>
            ))}
            <p className="text-[4px] text-white/30 text-center">Tap en planeta → vista detallada</p>
            <MiniNavBar active="planet" />
          </div>
        ),
      },
    ],
  },

  // ═══════════════════════════════════════════
  // DAILY REWARDS DETAIL
  // ═══════════════════════════════════════════
  {
    id: "daily-rewards-detail", name: "Recompensas Diarias Detalladas", icon: "🎁", color: "#F59E0B", category: "Monetización",
    description: "Grid de 7 días, cofres normales/especiales/épicos, estado completo",
    steps: [
      {
        title: "Grid de 7 Días", description: "Calendario con racha actual",
        screen: () => (
          <div className="flex-1 flex flex-col bg-[#0d0520] p-2 gap-1">
            <div className="flex items-center justify-center gap-1 mb-0.5">
              <span className="text-[8px] text-accent font-display">RECOMPENSAS DIARIAS</span>
            </div>
            <MiniGlassPanel className="border-orange-500/30 text-center py-1">
              <div className="flex items-center justify-center gap-0.5">
                <span className="text-[6px] text-orange-400">Racha: 4 días</span>
                <span className="text-xs">🔥</span>
              </div>
            </MiniGlassPanel>
            <div className="grid grid-cols-4 gap-0.5">
              {DAILY_REWARDS.map((d, i) => (
                <div key={d.day} className={cn(
                  "rounded p-1 flex flex-col items-center border text-center",
                  d.day === 7 && "col-span-2",
                  i < 3 ? "bg-green-500/10 border-green-500/30" :
                  i === 3 ? "bg-accent/20 border-accent/50 shadow-[0_0_8px_rgba(255,170,0,0.3)]" :
                  "bg-white/5 border-white/10 opacity-60"
                )}>
                  <span className="text-[4px] text-white/50">Día {d.day}</span>
                  <img src={RESOURCE_ICONS[d.icon as keyof typeof RESOURCE_ICONS]} className={cn("w-3 h-3 my-0.5", i > 3 && "grayscale")} />
                  <span className="text-[4px] text-white">{d.reward}</span>
                  {i < 3 && <span className="text-[4px] text-green-400">✓</span>}
                  {i === 3 && <span className="text-[4px] text-accent font-display">HOY</span>}
                </div>
              ))}
            </div>
            <div className="bg-accent/20 border border-accent/40 rounded-lg py-1 text-center text-[6px] text-accent font-display">RECLAMAR DÍA 4</div>
          </div>
        ),
      },
      {
        title: "Cofre Normal Abierto", description: "Recompensa de piedra/madera/comida",
        screen: () => (
          <CenterScreen title="¡Cofre Normal!" subtitle="Día 1 — Recompensa reclamada" emoji="📦" color="#94A3B8">
            <MiniGlassPanel className="w-full">
              <div className="space-y-1">
                <div className="flex items-center gap-1.5">
                  <img src={DAILY_ICONS.box_normal} className="w-5 h-5" />
                  <div className="flex-1">
                    <p className="text-[6px] text-white font-display">Contenido:</p>
                  </div>
                </div>
                {[
                  { icon: RESOURCE_ICONS.stone, label: "100 Piedra", color: "text-white" },
                  { icon: RESOURCE_ICONS.wood, label: "50 Madera", color: "text-green-400" },
                  { icon: RESOURCE_ICONS.food, label: "30 Comida", color: "text-orange-400" },
                ].map(r => (
                  <div key={r.label} className="flex items-center gap-1 pl-2">
                    <img src={r.icon} className="w-3 h-3" />
                    <span className={`text-[6px] ${r.color}`}>{r.label}</span>
                  </div>
                ))}
              </div>
            </MiniGlassPanel>
          </CenterScreen>
        ),
      },
      {
        title: "Cofre Especial Abierto", description: "Bronce + energía + carta",
        screen: () => (
          <CenterScreen title="¡Cofre Especial!" subtitle="Día 5 — Recompensa premium" emoji="🎁" color="#00D4E6">
            <MiniGlassPanel className="w-full">
              <div className="space-y-1">
                <div className="flex items-center gap-1.5">
                  <img src={DAILY_ICONS.box_special} className="w-5 h-5" />
                  <div className="flex-1">
                    <p className="text-[6px] text-cyan-400 font-display">Contenido Especial:</p>
                  </div>
                </div>
                {[
                  { icon: RESOURCE_ICONS.bronze, label: "80 Bronce", color: "text-amber-400" },
                  { icon: RESOURCE_ICONS.energy, label: "15 Energía", color: "text-yellow-400" },
                  { icon: NAV_ICONS.cards, label: "Carta Común x1", color: "text-cyan-400" },
                ].map(r => (
                  <div key={r.label} className="flex items-center gap-1 pl-2">
                    <img src={r.icon} className="w-3 h-3" />
                    <span className={`text-[6px] ${r.color}`}>{r.label}</span>
                  </div>
                ))}
              </div>
            </MiniGlassPanel>
          </CenterScreen>
        ),
      },
      {
        title: "Cofre Épico Abierto", description: "Equipo + diamantes + carta rara",
        screen: () => (
          <CenterScreen title="¡Cofre Épico!" subtitle="Día 7 — Recompensa máxima" emoji="👑" color="#F59E0B">
            <MiniGlassPanel className="w-full border-amber-500/30">
              <div className="space-y-1">
                <div className="flex items-center gap-1.5">
                  <img src={DAILY_ICONS.box_epic} className="w-5 h-5" />
                  <div className="flex-1">
                    <p className="text-[6px] text-amber-400 font-display">Contenido Épico:</p>
                  </div>
                </div>
                {[
                  { icon: NAV_ICONS.equipment, label: "Casco de Hierro (Clara)", color: "text-cyan-400" },
                  { icon: RESOURCE_ICONS.diamonds, label: "25 Diamantes", color: "text-purple-400" },
                  { icon: NAV_ICONS.cards, label: "Carta Épica x1", color: "text-amber-400" },
                ].map(r => (
                  <div key={r.label} className="flex items-center gap-1 pl-2">
                    <img src={r.icon} className="w-3 h-3" />
                    <span className={`text-[6px] ${r.color}`}>{r.label}</span>
                  </div>
                ))}
              </div>
            </MiniGlassPanel>
          </CenterScreen>
        ),
      },
      {
        title: "Todo Reclamado", description: "Timer hasta próximo reset",
        screen: () => (
          <div className="flex-1 flex flex-col items-center justify-center bg-gradient-to-b from-[#0d0520] to-[#1a0a3e] p-3">
            <span className="text-3xl mb-2">✅</span>
            <p className="text-[8px] text-green-400 font-display mb-1">¡Todo reclamado hoy!</p>
            <p className="text-[5px] text-white/50 text-center mb-3">Has mantenido tu racha de 4 días</p>
            <MiniGlassPanel className="w-full text-center">
              <p className="text-[5px] text-white/50">Próximo reset en:</p>
              <p className="text-[10px] text-accent font-display mt-0.5">18:32:45</p>
              <p className="text-[4px] text-white/30 mt-0.5">Vuelve mañana para no perder la racha</p>
            </MiniGlassPanel>
          </div>
        ),
      },
    ],
  },

  // ═══════════════════════════════════════════
  // BADGES DETAIL
  // ═══════════════════════════════════════════
  {
    id: "badges-detail", name: "Badges del Home", icon: "🏷️", color: "#A855F7", category: "Core",
    description: "Los 4 badges del home: BattlePass, DailyReward, FreeAds, SpecialEvent",
    steps: [
      {
        title: "4 Badges Visibles", description: "Badges en la pantalla de inicio",
        screen: () => (
          <div className="flex-1 flex flex-col bg-[#0d0520] p-2 gap-1">
            <p className="text-[7px] text-white font-display">HOME — BADGES</p>
            <div className="grid grid-cols-2 gap-1">
              {[
                { name: "Battle Pass", icon: BADGE_ICONS.battlepass, color: "#A855F7", notif: "3" },
                { name: "Daily Reward", icon: BADGE_ICONS.dailyreward, color: "#F59E0B", notif: "1" },
                { name: "Free Ads", icon: BADGE_ICONS.freeads, color: "#22C55E", notif: "3" },
                { name: "Evento", icon: BADGE_ICONS.event, color: "#EF4444", notif: "!" },
              ].map(b => (
                <MiniGlassPanel key={b.name} className="flex flex-col items-center gap-0.5 py-2 relative">
                  <div className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-red-500 flex items-center justify-center">
                    <span className="text-[4px] text-white font-bold">{b.notif}</span>
                  </div>
                  <img src={b.icon} className="w-6 h-6" />
                  <span className="text-[5px] font-display" style={{ color: b.color }}>{b.name}</span>
                </MiniGlassPanel>
              ))}
            </div>
            <p className="text-[4px] text-white/30 text-center mt-1">Cada badge tiene notificación activa</p>
            <MiniNavBar active="planet" />
          </div>
        ),
      },
      {
        title: "Battle Pass Popup", description: "Tap en badge de Battle Pass",
        screen: () => (
          <div className="flex-1 flex flex-col bg-[#0d0520] p-2 gap-1">
            <div className="flex items-center gap-1 mb-0.5">
              <img src={BADGE_ICONS.battlepass} className="w-4 h-4" />
              <span className="text-[7px] text-purple-400 font-display">PASE DE BATALLA</span>
              <span className="text-[5px] text-white/40 ml-auto">Nv.4/10</span>
            </div>
            <Progress value={40} className="h-0.5" />
            <div className="space-y-0.5 flex-1 overflow-hidden">
              {BP_REWARDS.slice(0, 5).map(r => (
                <div key={r.lvl} className={cn("flex items-center gap-1 px-1 py-0.5 rounded border text-[4px]",
                  r.lvl <= 4 ? "bg-green-500/10 border-green-500/20" : "bg-white/5 border-white/10")}>
                  <span className="text-white/50 w-3">Nv.{r.lvl}</span>
                  <span className="flex-1 text-white">{r.free}</span>
                  <span className="text-purple-400">{r.premium}</span>
                  {r.lvl <= 4 && <span className="text-green-400">✓</span>}
                </div>
              ))}
            </div>
            <div className="bg-purple-600/30 border border-purple-500/40 rounded-lg py-1 text-center text-[5px] text-purple-300 font-display">DESBLOQUEAR PREMIUM — 999 💎</div>
          </div>
        ),
      },
      {
        title: "Daily Reward Badge", description: "Tap en badge → abre daily rewards",
        screen: () => (
          <div className="flex-1 flex flex-col bg-[#0d0520] p-2 gap-1">
            <div className="flex items-center gap-1 mb-0.5">
              <img src={BADGE_ICONS.dailyreward} className="w-4 h-4" />
              <span className="text-[7px] text-amber-400 font-display">RECOMPENSA DIARIA</span>
            </div>
            <MiniGlassPanel className="border-orange-500/30 text-center py-1">
              <span className="text-[6px] text-orange-400">🔥 Racha: 4 días</span>
            </MiniGlassPanel>
            <div className="grid grid-cols-4 gap-0.5 flex-1">
              {DAILY_REWARDS.slice(0, 4).map((d, i) => (
                <div key={d.day} className={cn(
                  "rounded p-0.5 flex flex-col items-center border",
                  i < 3 ? "bg-green-500/10 border-green-500/30" : "bg-accent/20 border-accent/50"
                )}>
                  <span className="text-[4px] text-white/50">D{d.day}</span>
                  <img src={RESOURCE_ICONS[d.icon as keyof typeof RESOURCE_ICONS]} className="w-3 h-3" />
                  {i < 3 && <span className="text-[4px] text-green-400">✓</span>}
                  {i === 3 && <span className="text-[4px] text-accent">HOY</span>}
                </div>
              ))}
            </div>
            <div className="bg-accent/20 border border-accent/40 rounded-lg py-1 text-center text-[5px] text-accent font-display">RECLAMAR</div>
          </div>
        ),
      },
      {
        title: "Free Ads Badge", description: "Tap → mira anuncio por recompensa",
        screen: () => (
          <div className="flex-1 flex flex-col bg-[#0d0520] p-2 gap-1">
            <div className="flex items-center gap-1 mb-0.5">
              <img src={BADGE_ICONS.freeads} className="w-4 h-4" />
              <span className="text-[7px] text-green-400 font-display">ANUNCIOS GRATIS</span>
            </div>
            <MiniGlassPanel className="text-center py-2">
              <span className="text-2xl block mb-1">📺</span>
              <p className="text-[6px] text-white font-display">Mira un anuncio</p>
              <p className="text-[5px] text-white/50">Obtén recompensas gratis</p>
            </MiniGlassPanel>
            <div className="space-y-0.5">
              {[
                { reward: "+5 Energía", used: 2, total: 3, color: "text-yellow-400" },
                { reward: "+200 Piedra", used: 1, total: 2, color: "text-white" },
                { reward: "Producción x2 (30m)", used: 0, total: 1, color: "text-green-400" },
              ].map(a => (
                <MiniGlassPanel key={a.reward}>
                  <div className="flex items-center justify-between">
                    <span className={`text-[5px] ${a.color}`}>{a.reward}</span>
                    <span className="text-[4px] text-white/40">{a.used}/{a.total} usados</span>
                  </div>
                </MiniGlassPanel>
              ))}
            </div>
            <div className="bg-green-600/30 border border-green-500/40 rounded-lg py-1 text-center text-[5px] text-green-300 font-display">VER ANUNCIO (+5 ENERGÍA)</div>
          </div>
        ),
      },
      {
        title: "Evento Especial Badge", description: "Tap → detalles del evento",
        screen: () => (
          <div className="flex-1 flex flex-col bg-[#0d0520] p-2 gap-1">
            <div className="flex items-center gap-1 mb-0.5">
              <img src={BADGE_ICONS.event} className="w-4 h-4" />
              <span className="text-[7px] text-red-400 font-display">EVENTO ESPECIAL</span>
            </div>
            <MiniGlassPanel className="border-red-500/30 text-center py-2">
              <span className="text-2xl block mb-1">🏆</span>
              <p className="text-[7px] text-red-400 font-display">Torneo de las Eras</p>
              <p className="text-[5px] text-white/50">Compite por recompensas exclusivas</p>
              <div className="mt-1 flex items-center justify-center gap-0.5">
                <span className="text-[6px] text-accent font-display">2d 14h 32m</span>
              </div>
            </MiniGlassPanel>
            <MiniGlassPanel>
              <p className="text-[5px] text-white/50 mb-0.5">Recompensas del evento:</p>
              <div className="space-y-0.5 text-[5px]">
                <p className="text-amber-400">🥇 1er lugar: Skin Exclusiva + 500 💎</p>
                <p className="text-slate-300">🥈 2do lugar: 300 💎 + Carta Legendaria</p>
                <p className="text-amber-600">🥉 3er lugar: 150 💎 + Carta Épica</p>
              </div>
            </MiniGlassPanel>
            <div className="bg-red-600/30 border border-red-500/40 rounded-lg py-1 text-center text-[5px] text-red-300 font-display">PARTICIPAR</div>
          </div>
        ),
      },
    ],
  },

  // ═══════════════════════════════════════════
  // PLANET TABS DETAIL
  // ═══════════════════════════════════════════
  {
    id: "planet-tabs-detail", name: "Vista del Planeta (Tabs)", icon: "🪐", color: "#4CAF50", category: "Core",
    description: "Tabs: Resumen, Recursos, Estructuras, Cartas, Lore + orbital/superficie",
    steps: [
      {
        title: "Tab Resumen", description: "Descripción, era timeline, producción, avance",
        screen: () => (
          <div className="flex-1 flex flex-col bg-[#0d0520] p-2 gap-1">
            <div className="flex items-center gap-1">
              <span className="text-[6px] text-white/40">←</span>
              <span className="text-[7px] text-green-400 font-display">PORERA — Resumen</span>
              <span className="text-[5px] text-green-400 ml-auto">+17.3/s</span>
            </div>
            <div className="flex gap-0.5 overflow-x-auto">
              {["Resumen", "Recursos", "Estructuras", "Cartas", "Lore"].map((t, i) => (
                <div key={t} className={cn("px-1 py-0.5 rounded text-[4px] shrink-0",
                  i === 0 ? "bg-primary/20 text-primary" : "bg-white/5 text-white/30")}>{t}</div>
              ))}
            </div>
            <MiniGlassPanel>
              <p className="text-[5px] text-white/50">Mundo verde primordial en plena era de Bronce.</p>
            </MiniGlassPanel>
            <MiniGlassPanel>
              <p className="text-[4px] text-white/50 mb-0.5">Línea del Tiempo:</p>
              <div className="flex gap-0.5 flex-wrap">
                {ERAS.map((e, i) => (
                  <div key={i} className={cn("px-0.5 py-0.5 rounded text-[3px]",
                    i < 2 ? "bg-primary/20 text-primary" : i === 2 ? "bg-accent/20 text-accent" : "bg-white/5 text-white/30")}>{e.name}</div>
                ))}
              </div>
            </MiniGlassPanel>
            <MiniGlassPanel className="flex items-center justify-between">
              <span className="text-[5px] text-white">Producción Total</span>
              <span className="text-[6px] text-green-400 font-display">+17.3/s</span>
            </MiniGlassPanel>
            <div className="bg-accent/20 border border-accent/40 rounded py-1 text-center text-[5px] text-white/30 font-display">AVANZAR DE ERA (40%)</div>
          </div>
        ),
      },
      {
        title: "Tab Recursos", description: "11 recursos con cantidades y rates",
        screen: () => (
          <div className="flex-1 flex flex-col bg-[#0d0520] p-2 gap-0.5 overflow-hidden">
            <div className="flex items-center gap-1">
              <span className="text-[7px] text-green-400 font-display">PORERA — Recursos</span>
            </div>
            <div className="flex gap-0.5">
              {["Resumen", "Recursos", "Estructuras"].map((t, i) => (
                <div key={t} className={cn("px-1 py-0.5 rounded text-[4px] shrink-0",
                  i === 1 ? "bg-primary/20 text-primary" : "bg-white/5 text-white/30")}>{t}</div>
              ))}
            </div>
            <div className="flex-1 space-y-0.5 overflow-hidden">
              {[
                { name: "Piedra", amount: "3,400", rate: "+9.92/s", icon: "stone" },
                { name: "Madera", amount: "1,580", rate: "+4.14/s", icon: "wood" },
                { name: "Comida", amount: "890", rate: "+2.76/s", icon: "food" },
                { name: "Bronce", amount: "128", rate: "+0.46/s", icon: "bronze" },
                { name: "Hierro", amount: "35", rate: "+0.18/s", icon: "iron" },
                { name: "Oro", amount: "8", rate: "+0.05/s", icon: "gold" },
                { name: "Energía", amount: "45", rate: "—", icon: "energy" },
                { name: "Diamantes", amount: "12", rate: "—", icon: "diamonds" },
              ].map(r => (
                <div key={r.name} className="flex items-center gap-1 bg-white/5 rounded px-1 py-0.5">
                  <img src={RESOURCE_ICONS[r.icon as keyof typeof RESOURCE_ICONS]} className="w-3 h-3" />
                  <span className="text-[5px] text-white flex-1">{r.name}</span>
                  <span className="text-[4px] text-white/50">{r.amount}</span>
                  <span className="text-[4px] text-green-400">{r.rate}</span>
                </div>
              ))}
            </div>
          </div>
        ),
      },
      {
        title: "Tab Estructuras", description: "9 estructuras con nivel, rate, herramienta",
        screen: () => (
          <div className="flex-1 flex flex-col bg-[#0d0520] p-2 gap-0.5 overflow-hidden">
            <span className="text-[7px] text-green-400 font-display">PORERA — Estructuras</span>
            <div className="flex gap-0.5">
              {["Resumen", "Recursos", "Estructuras"].map((t, i) => (
                <div key={t} className={cn("px-1 py-0.5 rounded text-[4px] shrink-0",
                  i === 2 ? "bg-primary/20 text-primary" : "bg-white/5 text-white/30")}>{t}</div>
              ))}
            </div>
            <div className="flex-1 space-y-0.5 overflow-hidden">
              {[
                { name: "Cantera", icon: "⛏️", lv: 5, rate: "+9.92/s", res: "stone", tool: "🪓 Hacha Nv.2" },
                { name: "Aserradero", icon: "🪚", lv: 3, rate: "+4.14/s", res: "wood", tool: "⛏️ Pico Nv.1" },
                { name: "Granja", icon: "🌾", lv: 2, rate: "+2.76/s", res: "food", tool: "🌿 Hoz Nv.3" },
                { name: "Forja", icon: "🔥", lv: 1, rate: "+0.46/s", res: "bronze", tool: "—" },
                { name: "Herrería", icon: "⚒️", lv: 1, rate: "+0.18/s", res: "iron", tool: "—" },
              ].map(s => (
                <div key={s.name} className="flex items-center gap-1 bg-white/5 rounded px-1 py-0.5">
                  <span className="text-xs">{s.icon}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-0.5">
                      <span className="text-[5px] text-white">{s.name}</span>
                      <span className="text-[4px] px-0.5 rounded bg-primary/20 text-primary">Nv.{s.lv}</span>
                    </div>
                    <div className="flex items-center gap-0.5 text-[4px]">
                      <img src={RESOURCE_ICONS[s.res as keyof typeof RESOURCE_ICONS]} className="w-2 h-2" />
                      <span className="text-green-400">{s.rate}</span>
                      <span className="text-white/30 ml-auto truncate">{s.tool}</span>
                    </div>
                  </div>
                  <div className="bg-accent/20 rounded px-0.5 py-0.5 text-[3px] text-accent shrink-0">UP</div>
                </div>
              ))}
            </div>
          </div>
        ),
      },
      {
        title: "Tab Cartas", description: "Link al álbum de colección",
        screen: () => (
          <div className="flex-1 flex flex-col bg-[#0d0520] p-2 gap-1">
            <span className="text-[7px] text-green-400 font-display">PORERA — Cartas</span>
            <div className="flex gap-0.5">
              {["Resumen", "Recursos", "Estructuras", "Cartas", "Lore"].map((t, i) => (
                <div key={t} className={cn("px-1 py-0.5 rounded text-[4px] shrink-0",
                  i === 3 ? "bg-primary/20 text-primary" : "bg-white/5 text-white/30")}>{t}</div>
              ))}
            </div>
            <div className="flex-1 flex flex-col items-center justify-center">
              <span className="text-2xl mb-1">🃏</span>
              <p className="text-[6px] text-white/50 text-center mb-2">Colecciona cartas explorando y combatiendo</p>
              <div className="bg-primary/20 border border-primary/40 rounded-lg px-3 py-1 text-[6px] text-primary font-display">Ver Álbum →</div>
            </div>
          </div>
        ),
      },
      {
        title: "Tab Lore", description: "Historia del planeta",
        screen: () => (
          <div className="flex-1 flex flex-col bg-[#0d0520] p-2 gap-1">
            <span className="text-[7px] text-green-400 font-display">PORERA — Lore</span>
            <div className="flex gap-0.5">
              {["Resumen", "Recursos", "Estructuras", "Cartas", "Lore"].map((t, i) => (
                <div key={t} className={cn("px-1 py-0.5 rounded text-[4px] shrink-0",
                  i === 4 ? "bg-primary/20 text-primary" : "bg-white/5 text-white/30")}>{t}</div>
              ))}
            </div>
            <MiniGlassPanel className="flex-1">
              <p className="text-[6px] text-white font-display mb-1">Historia de Porera</p>
              <p className="text-[5px] text-white/50 leading-relaxed">
                Porera nació de una nube de gas y polvo hace 4.2 billones de años. Sus bosques primordiales albergan criaturas extintas en otros mundos. Los Foreños descubrieron el fuego hace 3 eras y construyeron las primeras estructuras de piedra.
              </p>
            </MiniGlassPanel>
          </div>
        ),
      },
      {
        title: "Orbital vs Superficie", description: "Toggle entre ambas vistas",
        screen: () => (
          <div className="flex-1 flex flex-col bg-[#0d0520]">
            <div className="flex-1 flex">
              <div className="flex-1 flex flex-col items-center justify-center border-r border-white/10 p-1">
                <div className="flex gap-0.5 mb-1">
                  <div className="px-1 py-0.5 rounded text-[4px] bg-primary/20 text-primary">Orbital</div>
                  <div className="px-1 py-0.5 rounded text-[4px] bg-white/5 text-white/30">Superficie</div>
                </div>
                <div className="w-14 h-14 rounded-full bg-gradient-to-b from-green-500 to-green-800" />
                <p className="text-[4px] text-white/30 mt-1">Vista 3D orbital</p>
                <p className="text-[4px] text-white/30">Estructuras como iconos</p>
              </div>
              <div className="flex-1 flex flex-col items-center justify-center p-1">
                <div className="flex gap-0.5 mb-1">
                  <div className="px-1 py-0.5 rounded text-[4px] bg-white/5 text-white/30">Orbital</div>
                  <div className="px-1 py-0.5 rounded text-[4px] bg-primary/20 text-primary">Superficie</div>
                </div>
                <div className="w-16 h-10 bg-gradient-to-b from-sky-800 to-green-900 rounded relative">
                  <div className="absolute bottom-0.5 left-1/2 -translate-x-1/2 text-xs">🧑‍🚀</div>
                  <div className="absolute top-1 left-1 text-[6px]">⛏️</div>
                  <div className="absolute top-1 right-1 text-[6px]">🌾</div>
                </div>
                <p className="text-[4px] text-white/30 mt-1">Vista de superficie</p>
                <p className="text-[4px] text-white/30">Aris + estructuras en terreno</p>
              </div>
            </div>
          </div>
        ),
      },
    ],
  },

  // ═══════════════════════════════════════════
  // STRUCTURES + TOOLS DETAIL
  // ═══════════════════════════════════════════
  {
    id: "structures-tools-detail", name: "Estructuras + Herramientas", icon: "🏗️", color: "#F59E0B", category: "Gameplay",
    description: "Estructuras produciendo, detalle, asignación de herramientas, fusión, upgrade",
    steps: [
      {
        title: "Lista de Estructuras", description: "Estructuras activas produciendo",
        screen: () => (
          <div className="flex-1 flex flex-col bg-[#0d0520] p-2 gap-1">
            <div className="flex justify-between items-center">
              <span className="text-[7px] text-white font-display">ESTRUCTURAS</span>
              <span className="text-[6px] text-green-400 font-display">+17.3/s total</span>
            </div>
            <div className="flex gap-0.5 text-[4px]">
              <span className="text-white/30">🔧 Herramientas: 3 asignadas</span>
            </div>
            {[
              { name: "Cantera", icon: "⛏️", lv: 5, rate: "+9.92/s", color: "#8B8378", active: true },
              { name: "Aserradero", icon: "🪚", lv: 3, rate: "+4.14/s", color: "#6B8E23", active: true },
              { name: "Granja", icon: "🌾", lv: 2, rate: "+2.76/s", color: "#CD7F32", active: true },
              { name: "Forja", icon: "🔥", lv: 1, rate: "+0.46/s", color: "#DAA520", active: true },
              { name: "Herrería", icon: "⚒️", lv: 1, rate: "+0.18/s", color: "#4A4A4A", active: true },
            ].map(s => (
              <MiniGlassPanel key={s.name}>
                <div className="flex items-center gap-1">
                  <span className="text-sm">{s.icon}</span>
                  <div className="flex-1">
                    <div className="flex items-center gap-0.5">
                      <span className="text-[5px] text-white">{s.name}</span>
                      <span className="text-[4px] px-0.5 rounded" style={{ background: s.color + "30", color: s.color }}>Nv.{s.lv}</span>
                    </div>
                    <span className="text-[4px] text-green-400">{s.rate}</span>
                  </div>
                  {s.active && <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />}
                </div>
              </MiniGlassPanel>
            ))}
            <MiniNavBar active="structures" />
          </div>
        ),
      },
      {
        title: "Detalle de Estructura", description: "Nombre, nivel, producción, upgrade cost, tool",
        screen: () => (
          <div className="flex-1 flex flex-col bg-[#0d0520] p-2 gap-1">
            <div className="flex items-center gap-1">
              <span className="text-[6px] text-white/40">←</span>
              <span className="text-[7px] text-white font-display">CANTERA</span>
            </div>
            <MiniGlassPanel className="text-center py-2">
              <span className="text-3xl block">⛏️</span>
              <p className="text-[7px] text-white font-display mt-1">Cantera Nv.5</p>
              <div className="flex items-center justify-center gap-0.5 mt-0.5">
                <img src={RESOURCE_ICONS.stone} className="w-3 h-3" />
                <span className="text-[6px] text-green-400 font-display">+9.92/s Piedra</span>
              </div>
              <Progress value={50} className="h-0.5 w-20 mx-auto mt-1" />
              <p className="text-[4px] text-white/30 mt-0.5">5/10 nivel</p>
            </MiniGlassPanel>
            <MiniGlassPanel>
              <p className="text-[5px] text-white/50 mb-0.5">Herramienta asignada:</p>
              <div className="flex items-center gap-1">
                <span className="text-sm">🪓</span>
                <span className="text-[5px] text-white">Hacha Nv.2</span>
                <span className="text-[4px] text-green-400 ml-auto">+15% prod</span>
              </div>
            </MiniGlassPanel>
            <MiniGlassPanel>
              <p className="text-[5px] text-white/50 mb-0.5">Costo de mejora a Nv.6:</p>
              <div className="flex gap-1">
                <div className="flex items-center gap-0.5 text-[4px]"><img src={RESOURCE_ICONS.wood} className="w-2 h-2" /><span className="text-white">150</span></div>
                <div className="flex items-center gap-0.5 text-[4px]"><img src={RESOURCE_ICONS.food} className="w-2 h-2" /><span className="text-white">75</span></div>
              </div>
            </MiniGlassPanel>
            <div className="bg-accent/20 border border-accent/40 rounded-lg py-1 text-center text-[5px] text-accent font-display">MEJORAR A NV.6</div>
          </div>
        ),
      },
      {
        title: "Asignación de Herramienta", description: "Drag tool al slot de estructura",
        screen: () => (
          <div className="flex-1 flex flex-col bg-[#0d0520] p-2 gap-1">
            <p className="text-[7px] text-white font-display">ASIGNAR HERRAMIENTA</p>
            <MiniGlassPanel className="text-center py-1.5">
              <span className="text-lg">⛏️</span>
              <p className="text-[5px] text-white">Cantera Nv.5</p>
              <div className="w-8 h-8 mx-auto mt-1 rounded-lg border-2 border-dashed border-primary/50 flex items-center justify-center bg-primary/10">
                <span className="text-[4px] text-primary">SOLTAR AQUÍ</span>
              </div>
            </MiniGlassPanel>
            <p className="text-[5px] text-white/50">Herramientas disponibles:</p>
            <div className="grid grid-cols-3 gap-0.5">
              {[
                { icon: "🪓", name: "Hacha", lv: 2, rarity: "common", bonus: "+15%" },
                { icon: "⛏️", name: "Pico", lv: 1, rarity: "clear", bonus: "+25%" },
                { icon: "🌿", name: "Hoz", lv: 3, rarity: "epic", bonus: "+40%" },
              ].map(t => (
                <div key={t.name} className="flex flex-col items-center p-1 rounded border"
                  style={{ borderColor: RARITY_COLOR[t.rarity] + "50", background: RARITY_COLOR[t.rarity] + "10" }}>
                  <span className="text-sm">{t.icon}</span>
                  <span className="text-[4px] text-white">{t.name} Nv.{t.lv}</span>
                  <span className="text-[3px]" style={{ color: RARITY_COLOR[t.rarity] }}>{t.bonus}</span>
                </div>
              ))}
            </div>
            <p className="text-[4px] text-white/30 text-center">Arrastra una herramienta al slot</p>
          </div>
        ),
      },
      {
        title: "Fusión de Herramientas", description: "Combinar 3 tools en una mejor",
        screen: () => (
          <CenterScreen title="FUSIÓN DE HERRAMIENTAS" subtitle="Combina 3 herramientas del mismo tipo" emoji="🔨" color="#A855F7">
            <MiniGlassPanel className="w-full">
              <div className="flex items-center justify-center gap-1 mb-1.5">
                <div className="flex flex-col items-center p-1 rounded border border-slate-500/30 bg-slate-500/10">
                  <span className="text-sm">🪓</span>
                  <span className="text-[4px] text-white">Hacha Nv.1</span>
                </div>
                <span className="text-[6px] text-white/40">+</span>
                <div className="flex flex-col items-center p-1 rounded border border-slate-500/30 bg-slate-500/10">
                  <span className="text-sm">🪓</span>
                  <span className="text-[4px] text-white">Hacha Nv.1</span>
                </div>
                <span className="text-[6px] text-white/40">+</span>
                <div className="flex flex-col items-center p-1 rounded border border-slate-500/30 bg-slate-500/10">
                  <span className="text-sm">🪓</span>
                  <span className="text-[4px] text-white">Hacha Nv.1</span>
                </div>
              </div>
              <div className="text-center">
                <span className="text-[6px] text-white/40">↓ RESULTADO ↓</span>
              </div>
              <div className="flex flex-col items-center p-1.5 rounded border border-cyan-500/40 bg-cyan-500/10 mt-1">
                <span className="text-lg">🪓</span>
                <span className="text-[5px] text-cyan-400 font-display">Hacha Clara Nv.2</span>
                <span className="text-[4px] text-green-400">+25% producción</span>
              </div>
            </MiniGlassPanel>
            <div className="w-full mt-1 bg-purple-600/30 border border-purple-500/40 rounded-lg py-1 text-center text-[5px] text-purple-300 font-display">FUSIONAR (x3)</div>
          </CenterScreen>
        ),
      },
      {
        title: "Upgrade + Energía", description: "Estructura mejorada, energía ganada",
        screen: () => (
          <CenterScreen title="¡CANTERA MEJORADA!" subtitle="Nivel 5 → Nivel 6" emoji="⛏️" color="#F59E0B">
            <MiniGlassPanel className="w-full">
              <div className="space-y-0.5">
                <div className="flex justify-between text-[5px]">
                  <span className="text-white/50">Producción anterior:</span>
                  <span className="text-white">+9.92/s</span>
                </div>
                <div className="flex justify-between text-[5px]">
                  <span className="text-white/50">Producción nueva:</span>
                  <span className="text-green-400 font-display">+13.40/s</span>
                </div>
                <div className="border-t border-white/10 pt-0.5 mt-0.5">
                  <div className="flex justify-between text-[5px]">
                    <span className="text-white/50">Mejora de prod:</span>
                    <span className="text-green-400">+35%</span>
                  </div>
                </div>
              </div>
            </MiniGlassPanel>
            <MiniGlassPanel className="w-full mt-1 border-yellow-500/30">
              <div className="flex items-center justify-center gap-1">
                <img src={RESOURCE_ICONS.energy} className="w-4 h-4" />
                <div>
                  <p className="text-[6px] text-yellow-400 font-display">+2 Energía ganada</p>
                  <p className="text-[4px] text-white/40">Cada nivel de estructura da +2 energía</p>
                </div>
              </div>
            </MiniGlassPanel>
          </CenterScreen>
        ),
      },
    ],
  },

  // ═══════════════════════════════════════════
  // CARD ALBUM COMPLETE
  // ═══════════════════════════════════════════
  {
    id: "card-album-complete", name: "Álbum de Cartas Completo", icon: "🃏", color: "#A855F7", category: "Gameplay",
    description: "Álbum por era, grid de cartas, obtención, duplicados, set completo, pack opening",
    steps: [
      {
        title: "Album Overview", description: "Tabs por era, progreso por era",
        screen: () => (
          <div className="flex-1 flex flex-col bg-[#0d0520] p-2 gap-1">
            <p className="text-[8px] text-white font-display">ÁLBUM DE CARTAS</p>
            <p className="text-[5px] text-white/40">Porera — 15/81 coleccionadas</p>
            <div className="flex gap-0.5 overflow-x-auto">
              {ERAS.slice(0, 5).map((e, i) => (
                <div key={i} className={cn("px-1 py-0.5 rounded text-[4px] shrink-0",
                  i === 0 ? "bg-primary/20 text-primary" : "bg-white/5 text-white/30")}>{e.name}</div>
              ))}
            </div>
            <div className="flex-1 space-y-0.5">
              {ERAS.slice(0, 6).map((e, i) => {
                const owned = i === 0 ? 6 : i === 1 ? 4 : i === 2 ? 5 : 0;
                return (
                  <div key={i} className="flex items-center gap-1 bg-white/5 rounded px-1 py-0.5">
                    <span className="text-[5px]">{e.emoji}</span>
                    <span className="text-[5px] text-white flex-1">{e.name}</span>
                    <span className="text-[4px] text-white/50">{owned}/9</span>
                    <div className="w-10 h-1 bg-black/40 rounded overflow-hidden">
                      <div className="h-full bg-primary rounded" style={{ width: `${(owned / 9) * 100}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
            <MiniNavBar active="cards" />
          </div>
        ),
      },
      {
        title: "Era Grid", description: "9 cartas owned/missing con rarity borders",
        screen: () => (
          <div className="flex-1 flex flex-col bg-[#0d0520] p-2">
            <div className="flex justify-between items-center mb-1">
              <span className="text-[6px] font-display" style={{ color: ERAS[0].color }}>PIEDRA — 6/9</span>
              <div className="w-8 h-1 bg-black/40 rounded overflow-hidden"><div className="h-full bg-primary rounded" style={{ width: "66%" }} /></div>
            </div>
            <div className="grid grid-cols-3 gap-0.5 flex-1">
              {(CARDS_BY_ERA[0] || []).map((c, i) => {
                const owned = i < 6;
                return (
                  <div key={i} className={cn("aspect-[3/4] rounded border flex flex-col items-center justify-center p-0.5",
                    owned ? "" : "grayscale opacity-40")}
                    style={{ borderColor: (RARITY_COLOR[c.rarity] || "#555") + (owned ? "80" : "30"), background: (RARITY_COLOR[c.rarity] || "#555") + (owned ? "15" : "05") }}>
                    <span className="text-[4px] text-white text-center leading-tight">{owned ? c.name : "???"}</span>
                    <span className="text-[3px] mt-0.5" style={{ color: owned ? RARITY_COLOR[c.rarity] : "#555" }}>{RARITY_LABEL[c.rarity]}</span>
                  </div>
                );
              })}
            </div>
          </div>
        ),
      },
      {
        title: "Carta Obtenida", description: "Popup de nueva carta revelada",
        screen: () => (
          <CenterScreen title="¡NUEVA CARTA!" subtitle="Has obtenido una carta nueva" emoji="✨" color="#A855F7">
            <div className="w-20 aspect-[3/4] rounded-lg border-2 flex flex-col items-center justify-center p-1 mx-auto"
              style={{ borderColor: RARITY_COLOR.epic, background: RARITY_COLOR.epic + "20", boxShadow: `0 0 20px ${RARITY_COLOR.epic}40` }}>
              <span className="text-lg mb-0.5">🦣</span>
              <p className="text-[6px] text-white font-display text-center">Mamut Sagrado</p>
              <p className="text-[4px]" style={{ color: RARITY_COLOR.epic }}>Épica</p>
              <p className="text-[4px] text-green-400 mt-0.5">ATK+35, HP+80</p>
            </div>
            <p className="text-[4px] text-white/30 mt-1">Añadida al álbum — Era Piedra</p>
          </CenterScreen>
        ),
      },
      {
        title: "Carta Duplicada", description: "Se convierte en recursos",
        screen: () => (
          <CenterScreen title="CARTA DUPLICADA" subtitle="Ya tienes esta carta — se convierte en recursos" emoji="🔄" color="#94A3B8">
            <div className="w-16 aspect-[3/4] rounded-lg border-2 flex flex-col items-center justify-center p-1 mx-auto mb-1"
              style={{ borderColor: RARITY_COLOR.common + "60", background: RARITY_COLOR.common + "15" }}>
              <span className="text-sm">🏹</span>
              <p className="text-[5px] text-white text-center">Cazador Primitivo</p>
              <p className="text-[3px]" style={{ color: RARITY_COLOR.common }}>Común</p>
            </div>
            <MiniGlassPanel className="w-full">
              <p className="text-[5px] text-white/50 mb-0.5">Convertida en:</p>
              <div className="flex items-center justify-center gap-2">
                <div className="flex items-center gap-0.5">
                  <img src={RESOURCE_ICONS.stone} className="w-3 h-3" />
                  <span className="text-[6px] text-white">+50</span>
                </div>
                <div className="flex items-center gap-0.5">
                  <img src={RESOURCE_ICONS.diamonds} className="w-3 h-3" />
                  <span className="text-[6px] text-purple-400">+2</span>
                </div>
              </div>
            </MiniGlassPanel>
          </CenterScreen>
        ),
      },
      {
        title: "Set Completo", description: "9/9 cartas — recompensa de era",
        screen: () => (
          <CenterScreen title="¡SET COMPLETO!" subtitle="9/9 cartas de la Era Piedra" emoji="🏆" color="#F59E0B">
            <div className="grid grid-cols-3 gap-0.5 w-full mb-1">
              {(CARDS_BY_ERA[0] || []).map((c, i) => (
                <div key={i} className="aspect-[3/4] rounded border flex items-center justify-center"
                  style={{ borderColor: RARITY_COLOR[c.rarity] + "60", background: RARITY_COLOR[c.rarity] + "15" }}>
                  <span className="text-[3px] text-white text-center">{c.name}</span>
                </div>
              ))}
            </div>
            <MiniGlassPanel className="w-full border-amber-500/30">
              <p className="text-[5px] text-amber-400 font-display mb-0.5">Recompensa de Set:</p>
              <div className="space-y-0.5 text-[5px]">
                <p className="text-green-400">+500 Piedra</p>
                <p className="text-yellow-400">+25 Diamantes</p>
                <p className="text-purple-400">+500 XP</p>
              </div>
            </MiniGlassPanel>
          </CenterScreen>
        ),
      },
      {
        title: "Planeta Album Completo", description: "Todas las eras completas — reward final",
        screen: () => (
          <CenterScreen title="¡ÁLBUM PLANETARIO COMPLETO!" subtitle="81/81 cartas de Porera" emoji="🌟" color="#FF00FF">
            <MiniGlassPanel className="w-full mb-1">
              <div className="space-y-0.5">
                {ERAS.map((e, i) => (
                  <div key={i} className="flex items-center gap-1 text-[4px]">
                    <span>{e.emoji}</span>
                    <span className="text-white flex-1">{e.name}</span>
                    <span className="text-green-400">9/9 ✓</span>
                  </div>
                ))}
              </div>
            </MiniGlassPanel>
            <MiniGlassPanel className="w-full border-pink-500/30">
              <p className="text-[5px] text-pink-400 font-display mb-0.5">Recompensa Definitiva:</p>
              <div className="space-y-0.5 text-[5px]">
                <p className="text-amber-400">🎨 Skin Exclusiva: Coleccionista</p>
                <p className="text-purple-400">+1000 Diamantes</p>
                <p className="text-green-400">Multiplicador permanente x1.5</p>
              </div>
            </MiniGlassPanel>
          </CenterScreen>
        ),
      },
      {
        title: "Card Pack Opening", description: "3 cartas reveladas una por una",
        screen: () => (
          <div className="flex-1 flex flex-col bg-gradient-to-b from-[#0d0520] to-[#1a0a3e] p-3 items-center justify-center">
            <p className="text-[7px] text-white font-display mb-2">ABRIENDO PACK...</p>
            <div className="flex gap-1.5">
              {[
                { name: "Espada de Bronce", rarity: "common", revealed: true },
                { name: "Carro de Guerra", rarity: "epic", revealed: true },
                { name: "???", rarity: "legendary", revealed: false },
              ].map((c, i) => (
                <div key={i} className={cn("w-14 aspect-[3/4] rounded-lg border-2 flex flex-col items-center justify-center p-0.5",
                  c.revealed ? "" : "animate-pulse")}
                  style={{
                    borderColor: c.revealed ? RARITY_COLOR[c.rarity] : "#ffffff30",
                    background: c.revealed ? RARITY_COLOR[c.rarity] + "20" : "rgba(255,255,255,0.05)",
                    boxShadow: c.revealed ? `0 0 12px ${RARITY_COLOR[c.rarity]}30` : undefined,
                  }}>
                  {c.revealed ? (
                    <>
                      <span className="text-[5px] text-white text-center leading-tight">{c.name}</span>
                      <span className="text-[3px] mt-0.5" style={{ color: RARITY_COLOR[c.rarity] }}>{RARITY_LABEL[c.rarity]}</span>
                    </>
                  ) : (
                    <span className="text-lg">❓</span>
                  )}
                </div>
              ))}
            </div>
            <p className="text-[5px] text-white/40 mt-2">Tap para revelar la siguiente carta</p>
          </div>
        ),
      },
    ],
  },

  // ═══════════════════════════════════════════
  // COMBAT DETAILED
  // ═══════════════════════════════════════════
  {
    id: "combat-detailed", name: "Combate Detallado", icon: "⚔️", color: "#EF4444", category: "Gameplay",
    description: "Menú de combate, selección de enemigos, pre-combate, pelea, victoria/derrota, loot",
    steps: [
      {
        title: "Menú de Combate", description: "Energía, filtro de era, lista de enemigos",
        screen: () => (
          <div className="flex-1 flex flex-col bg-[#0d0520] p-2 gap-1">
            <div className="flex justify-between items-center">
              <span className="text-[7px] text-white font-display">COMBATE</span>
              <div className="flex items-center gap-0.5 bg-yellow-500/10 rounded px-1 py-0.5 border border-yellow-500/30">
                <img src={RESOURCE_ICONS.energy} className="w-3 h-3" />
                <span className="text-[6px] text-yellow-400 font-display">28/30</span>
              </div>
            </div>
            <p className="text-[4px] text-white/30">Costo: ⚡5 por combate</p>
            <div className="flex gap-0.5 overflow-x-auto">
              {ERAS.slice(0, 4).map((e, i) => (
                <div key={i} className={cn("px-1 py-0.5 rounded text-[4px] shrink-0",
                  i === 2 ? "bg-red-500/20 text-red-400" : "bg-white/5 text-white/30")}>{e.name}</div>
              ))}
            </div>
            {(ENEMIES_BY_ERA[2] || []).map((e, i) => (
              <MiniGlassPanel key={i}>
                <div className="flex items-center gap-1">
                  <span className="text-sm">{e.emoji}</span>
                  <div className="flex-1">
                    <p className="text-[5px] text-white font-display">{e.name}</p>
                    <div className="flex gap-1 text-[4px] text-white/40">
                      <span>HP:{e.hp}</span><span>ATK:{e.atk}</span><span>DEF:{e.def}</span>
                    </div>
                    <p className="text-[4px] text-green-400">{e.drops} • +{e.xp}XP</p>
                  </div>
                  <div className="bg-red-600 rounded px-1 py-0.5 text-[4px] text-white shrink-0">⚡5 PELEAR</div>
                </div>
              </MiniGlassPanel>
            ))}
            <MiniNavBar active="combat" />
          </div>
        ),
      },
      {
        title: "Selección de Enemigo", description: "3 enemigos con stats y drops",
        screen: () => (
          <div className="flex-1 flex flex-col bg-[#0d0520] p-2 gap-1">
            <p className="text-[7px] text-white font-display">ENEMIGOS — Era Bronce</p>
            {(ENEMIES_BY_ERA[2] || []).map((e, i) => (
              <MiniGlassPanel key={i} className="py-1.5">
                <div className="flex items-center gap-1.5">
                  <span className="text-xl">{e.emoji}</span>
                  <div className="flex-1">
                    <p className="text-[6px] text-white font-display">{e.name}</p>
                    <div className="space-y-0.5 mt-0.5">
                      <div className="flex items-center gap-0.5 text-[4px]">
                        <span className="text-red-400 w-4">HP</span>
                        <div className="flex-1 h-1 bg-black/40 rounded overflow-hidden"><div className="h-full bg-red-500 rounded" style={{ width: `${(e.hp / 500) * 100}%` }} /></div>
                        <span className="text-white/40">{e.hp}</span>
                      </div>
                      <div className="flex items-center gap-0.5 text-[4px]">
                        <span className="text-orange-400 w-4">ATK</span>
                        <div className="flex-1 h-1 bg-black/40 rounded overflow-hidden"><div className="h-full bg-orange-500 rounded" style={{ width: `${(e.atk / 60) * 100}%` }} /></div>
                        <span className="text-white/40">{e.atk}</span>
                      </div>
                      <div className="flex items-center gap-0.5 text-[4px]">
                        <span className="text-blue-400 w-4">DEF</span>
                        <div className="flex-1 h-1 bg-black/40 rounded overflow-hidden"><div className="h-full bg-blue-500 rounded" style={{ width: `${(e.def / 25) * 100}%` }} /></div>
                        <span className="text-white/40">{e.def}</span>
                      </div>
                    </div>
                    <p className="text-[4px] text-green-400 mt-0.5">Drop: {e.drops} • +{e.xp}XP</p>
                  </div>
                </div>
              </MiniGlassPanel>
            ))}
          </div>
        ),
      },
      {
        title: "Pre-Combate", description: "Aris vs Enemigo stats lado a lado",
        screen: () => (
          <div className="flex-1 flex flex-col bg-gradient-to-b from-[#1a0a0a] to-[#0d0520] p-2 gap-1">
            <p className="text-[7px] text-white font-display text-center">PREPARACIÓN</p>
            <div className="flex gap-1 flex-1">
              <MiniGlassPanel className="flex-1 text-center py-2">
                <span className="text-2xl block">🧑‍🚀</span>
                <p className="text-[6px] text-white font-display mt-0.5">Aris Nv.24</p>
                <div className="space-y-0.5 mt-1 text-[4px]">
                  <p className="text-red-400">ATK: 155</p>
                  <p className="text-blue-400">DEF: 60</p>
                  <p className="text-green-400">HP: 330</p>
                </div>
                <div className="mt-1 text-[3px] text-white/30">
                  <p>🗡️ Espada de Bronce</p>
                  <p>🛡️ Túnica de Cuero</p>
                </div>
              </MiniGlassPanel>
              <div className="flex flex-col items-center justify-center">
                <span className="text-[8px] text-red-400 font-display">VS</span>
              </div>
              <MiniGlassPanel className="flex-1 text-center py-2">
                <span className="text-2xl block">🛡️</span>
                <p className="text-[6px] text-white font-display mt-0.5">Soldado de Bronce</p>
                <div className="space-y-0.5 mt-1 text-[4px]">
                  <p className="text-red-400">ATK: 40</p>
                  <p className="text-blue-400">DEF: 15</p>
                  <p className="text-green-400">HP: 300</p>
                </div>
                <div className="mt-1 text-[3px] text-white/30">
                  <p>Drop: 50 Bronce</p>
                  <p>+120 XP</p>
                </div>
              </MiniGlassPanel>
            </div>
            <div className="bg-red-600 rounded-lg py-1 text-center text-[6px] text-white font-display">INICIAR COMBATE (⚡5)</div>
          </div>
        ),
      },
      {
        title: "Combate en Progreso", description: "HP bars, damage numbers, auto-attack",
        screen: () => (
          <div className="flex-1 flex flex-col bg-gradient-to-b from-[#1a0a0a] to-[#0d0520] p-2">
            <div className="flex justify-between mb-1">
              <div>
                <p className="text-[5px] text-white font-display">Aris</p>
                <div className="w-16 h-1 bg-black/40 rounded overflow-hidden"><div className="h-full bg-green-500 rounded" style={{ width: "65%" }} /></div>
                <p className="text-[4px] text-white/40">215/330 HP</p>
              </div>
              <div className="text-right">
                <p className="text-[5px] text-white font-display">Soldado</p>
                <div className="w-16 h-1 bg-black/40 rounded overflow-hidden"><div className="h-full bg-red-500 rounded" style={{ width: "35%" }} /></div>
                <p className="text-[4px] text-white/40">105/300 HP</p>
              </div>
            </div>
            <div className="flex-1 flex items-center justify-around relative">
              <div className="text-3xl">🧑‍🚀</div>
              <div className="flex flex-col items-center gap-0.5">
                <span className="text-[8px] text-red-400 font-display">-28</span>
                <span className="text-[5px] text-white/30">Ronda 7</span>
                <div className="w-8 h-1 bg-white/10 rounded overflow-hidden"><motion.div className="h-full bg-primary rounded" animate={{ width: ["0%", "100%"] }} transition={{ duration: 0.9, repeat: Infinity }} /></div>
                <span className="text-[4px] text-white/20">Auto-attack</span>
              </div>
              <div className="text-3xl">🛡️</div>
              <span className="absolute top-2 left-6 text-[7px] text-green-400 font-display">-42</span>
              <span className="absolute top-2 right-4 text-[7px] text-red-400 font-display">-28</span>
            </div>
            <div className="space-y-0.5 text-[4px] bg-black/30 rounded p-1">
              <p className="text-green-400">Aris ataca: 42 dmg</p>
              <p className="text-yellow-400">CRITICO! Aris golpea: 84 dmg</p>
              <p className="text-red-400">Soldado responde: 28 dmg</p>
            </div>
          </div>
        ),
      },
      {
        title: "Aris Ataca", description: "Animación de daño al enemigo",
        screen: () => (
          <div className="flex-1 flex flex-col items-center justify-center bg-gradient-to-b from-[#1a0a0a] to-[#0d0520] p-3">
            <div className="flex items-center gap-6">
              <div className="text-3xl translate-x-4">🧑‍🚀</div>
              <div className="text-3xl animate-pulse">💥</div>
              <div className="text-3xl -translate-x-2">🛡️</div>
            </div>
            <div className="mt-2 text-center">
              <p className="text-[10px] text-yellow-400 font-display">CRITICO!</p>
              <p className="text-[8px] text-orange-400 font-display">-84 DMG</p>
              <p className="text-[5px] text-white/30 mt-1">Soldado HP: 105 → 21</p>
            </div>
          </div>
        ),
      },
      {
        title: "Enemigo Ataca", description: "Daño recibido por Aris",
        screen: () => (
          <div className="flex-1 flex flex-col items-center justify-center bg-gradient-to-b from-[#1a0a0a] to-[#0d0520] p-3">
            <div className="flex items-center gap-6">
              <div className="text-3xl -translate-x-2">🧑‍🚀</div>
              <div className="text-3xl animate-pulse">💢</div>
              <div className="text-3xl translate-x-4">🛡️</div>
            </div>
            <div className="mt-2 text-center">
              <p className="text-[8px] text-red-400 font-display">-28 DMG</p>
              <p className="text-[5px] text-white/30 mt-1">Aris HP: 215 → 187</p>
            </div>
          </div>
        ),
      },
      {
        title: "Victoria", description: "XP ganada, posible level up",
        screen: () => (
          <CenterScreen title="¡VICTORIA!" subtitle="Has derrotado al Soldado de Bronce" emoji="🏆" color="#FBBF24">
            <MiniGlassPanel className="w-full">
              <div className="space-y-0.5 text-[5px]">
                <div className="flex justify-between">
                  <span className="text-white/50">XP ganada:</span>
                  <span className="text-yellow-400">+120 XP</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/50">XP total:</span>
                  <span className="text-white">1,350/1,500</span>
                </div>
                <Progress value={90} className="h-0.5" />
              </div>
            </MiniGlassPanel>
            <MiniGlassPanel className="w-full mt-1 border-cyan-500/30">
              <div className="text-center">
                <p className="text-[6px] text-cyan-400 font-display">LEVEL UP! Nv.24 → Nv.25</p>
                <div className="flex justify-center gap-2 mt-0.5 text-[5px]">
                  <span className="text-red-400">ATK +5</span>
                  <span className="text-blue-400">DEF +3</span>
                  <span className="text-green-400">HP +15</span>
                </div>
              </div>
            </MiniGlassPanel>
          </CenterScreen>
        ),
      },
      {
        title: "Loot Drops", description: "Recursos, carta (%), equipo (%)",
        screen: () => (
          <CenterScreen title="BOTÍN OBTENIDO" subtitle="Recompensas del combate" emoji="🎁" color="#22C55E">
            <MiniGlassPanel className="w-full">
              <p className="text-[5px] text-white/50 mb-0.5">Drops:</p>
              <div className="space-y-0.5">
                <div className="flex items-center gap-1 text-[5px]">
                  <img src={RESOURCE_ICONS.bronze} className="w-3 h-3" />
                  <span className="text-white">50 Bronce</span>
                  <span className="text-white/30 ml-auto">100%</span>
                </div>
                <div className="flex items-center gap-1 text-[5px]">
                  <span className="text-sm">🃏</span>
                  <span className="text-purple-400">Carta Épica: Carro de Guerra</span>
                  <span className="text-white/30 ml-auto">12%</span>
                </div>
                <div className="flex items-center gap-1 text-[5px]">
                  <span className="text-sm">🗡️</span>
                  <span className="text-cyan-400">Daga Clara Nv.1</span>
                  <span className="text-white/30 ml-auto">8%</span>
                </div>
              </div>
            </MiniGlassPanel>
            <div className="w-full mt-1 bg-primary/20 border border-primary/40 rounded-lg py-1 text-center text-[5px] text-primary font-display">CONTINUAR</div>
          </CenterScreen>
        ),
      },
      {
        title: "Derrota", description: "Retry, heal con energía",
        screen: () => (
          <CenterScreen title="DERROTA" subtitle="Aris fue derrotado" emoji="💀" color="#EF4444">
            <MiniGlassPanel className="w-full">
              <p className="text-[5px] text-white/50 mb-0.5">Opciones:</p>
              <div className="space-y-1">
                <div className="bg-red-600/30 border border-red-500/40 rounded-lg py-1 text-center text-[5px] text-red-300 font-display">REINTENTAR (⚡5)</div>
                <div className="bg-yellow-600/20 border border-yellow-500/30 rounded-lg py-1 text-center text-[5px] text-yellow-300 font-display flex items-center justify-center gap-0.5">
                  <img src={RESOURCE_ICONS.energy} className="w-3 h-3" />CURAR COMPLETO (⚡10)
                </div>
                <div className="bg-white/5 border border-white/10 rounded-lg py-1 text-center text-[5px] text-white/50 font-display">VOLVER AL MENÚ</div>
              </div>
            </MiniGlassPanel>
            <p className="text-[4px] text-white/20 mt-1">Aris se recupera al 30% HP automáticamente</p>
          </CenterScreen>
        ),
      },
    ],
  },

  // ═══════════════════════════════════════════
  // PLANET SURFACE DETAIL
  // ═══════════════════════════════════════════
  {
    id: "planet-surface-detail", name: "Vista de Superficie del Planeta", icon: "🌄", color: "#4CAF50", category: "Core",
    description: "Superficie: Aris, estructuras, portal, producción flotante, skin selector",
    steps: [
      {
        title: "Vista de Superficie", description: "Aris + estructuras + portal",
        screen: () => (
          <div className="flex-1 flex flex-col bg-gradient-to-b from-sky-900/50 to-green-900/50 relative overflow-hidden">
            <div className="absolute top-2 right-2 flex gap-0.5 z-10">
              <div className="px-1 py-0.5 rounded text-[4px] bg-white/5 text-white/30">Orbital</div>
              <div className="px-1 py-0.5 rounded text-[4px] bg-primary/20 text-primary">Superficie</div>
            </div>
            {/* Portal */}
            <div className="absolute top-8 left-1/2 -translate-x-1/2 w-12 h-12 rounded-full border-2 border-cyan-500/40 bg-cyan-500/10 flex items-center justify-center">
              <span className="text-lg animate-pulse">🌀</span>
            </div>
            {/* Structures */}
            <div className="absolute top-16 left-3 text-lg">⛏️</div>
            <div className="absolute top-20 left-12 text-[5px] text-green-400 font-display bg-black/40 rounded px-0.5">+9.9/s</div>
            <div className="absolute top-14 right-4 text-lg">🌾</div>
            <div className="absolute top-18 right-3 text-[5px] text-green-400 font-display bg-black/40 rounded px-0.5">+2.7/s</div>
            <div className="absolute top-24 left-1/4 text-lg">🔥</div>
            <div className="absolute top-28 left-1/4 text-[5px] text-green-400 font-display bg-black/40 rounded px-0.5">+0.4/s</div>
            <div className="absolute top-22 right-1/4 text-lg">🪚</div>
            {/* Aris */}
            <div className="absolute bottom-12 left-1/2 -translate-x-1/2 text-3xl">🧑‍🚀</div>
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
              <span className="text-[5px] text-primary font-display bg-black/40 rounded px-1">Aris</span>
            </div>
            {/* Ground */}
            <div className="absolute bottom-0 left-0 right-0 h-6 bg-gradient-to-t from-green-950 to-transparent" />
            <MiniNavBar active="planet" />
          </div>
        ),
      },
      {
        title: "Tap en Estructura", description: "Popup de producción",
        screen: () => (
          <div className="flex-1 flex flex-col bg-gradient-to-b from-sky-900/50 to-green-900/50 relative overflow-hidden">
            <div className="absolute top-16 left-3 text-lg">⛏️</div>
            <div className="absolute top-14 right-4 text-lg">🌾</div>
            <div className="absolute bottom-16 left-1/2 -translate-x-1/2 text-2xl">🧑‍🚀</div>
            {/* Popup */}
            <div className="absolute top-10 left-6 bg-black/80 border border-white/20 rounded-lg p-2 z-20 shadow-[0_0_15px_rgba(0,0,0,0.5)]">
              <div className="flex items-center gap-1 mb-0.5">
                <span className="text-sm">⛏️</span>
                <span className="text-[6px] text-white font-display">Cantera Nv.5</span>
              </div>
              <div className="flex items-center gap-0.5 text-[5px]">
                <img src={RESOURCE_ICONS.stone} className="w-3 h-3" />
                <span className="text-green-400">+9.92/s Piedra</span>
              </div>
              <div className="flex items-center gap-0.5 text-[4px] mt-0.5">
                <span className="text-white/30">🔧 Hacha Nv.2 (+15%)</span>
              </div>
              <div className="flex gap-0.5 mt-1">
                <div className="bg-accent/20 rounded px-1 py-0.5 text-[4px] text-accent">Mejorar</div>
                <div className="bg-white/10 rounded px-1 py-0.5 text-[4px] text-white/50">Ver detalle</div>
              </div>
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-6 bg-gradient-to-t from-green-950 to-transparent" />
          </div>
        ),
      },
      {
        title: "Tap en Aris", description: "Abre selector de skin",
        screen: () => (
          <div className="flex-1 flex flex-col bg-gradient-to-b from-sky-900/50 to-green-900/50 relative overflow-hidden">
            <div className="absolute top-16 left-3 text-lg opacity-30">⛏️</div>
            <div className="absolute top-14 right-4 text-lg opacity-30">🌾</div>
            <div className="absolute bottom-16 left-1/2 -translate-x-1/2 text-2xl">🧑‍🚀</div>
            {/* Skin selector popup */}
            <div className="absolute bottom-2 left-2 right-2 bg-black/90 border border-white/20 rounded-lg p-2 z-20">
              <p className="text-[6px] text-white font-display mb-1">CAMBIAR SKIN</p>
              <div className="grid grid-cols-3 gap-0.5">
                {SKINS.slice(0, 6).map((s, i) => (
                  <div key={i} className={cn("rounded p-1 flex flex-col items-center text-center border",
                    i === 0 ? "border-primary/50 bg-primary/10" : s.locked ? "border-white/10 opacity-40" : "border-white/10")}>
                    <div className={cn("w-6 h-6 rounded-full bg-gradient-to-b mb-0.5", s.color)} />
                    <span className="text-[3px] text-white leading-tight">{s.name}</span>
                    {s.locked && <span className="text-[3px] text-white/30">🔒</span>}
                    {i === 0 && <span className="text-[3px] text-primary">Activa</span>}
                  </div>
                ))}
              </div>
            </div>
          </div>
        ),
      },
      {
        title: "Producción Flotante", description: "Números +3.4k, +1.2k sobre estructuras",
        screen: () => (
          <div className="flex-1 flex flex-col bg-gradient-to-b from-sky-900/50 to-green-900/50 relative overflow-hidden">
            <div className="absolute top-2 right-2 flex gap-0.5 z-10">
              <div className="px-1 py-0.5 rounded text-[4px] bg-primary/20 text-primary">Superficie</div>
            </div>
            {/* Structures with floating numbers */}
            <div className="absolute top-16 left-3 text-lg">⛏️</div>
            <div className="absolute top-12 left-5 text-[7px] text-green-400 font-display animate-bounce">+3.4k</div>
            <div className="absolute top-14 right-4 text-lg">🌾</div>
            <div className="absolute top-10 right-3 text-[7px] text-green-400 font-display animate-bounce" style={{ animationDelay: "0.3s" }}>+1.2k</div>
            <div className="absolute top-24 left-1/4 text-lg">🔥</div>
            <div className="absolute top-20 left-1/3 text-[7px] text-green-400 font-display animate-bounce" style={{ animationDelay: "0.6s" }}>+0.4k</div>
            <div className="absolute top-22 right-1/4 text-lg">🪚</div>
            <div className="absolute top-18 right-1/3 text-[7px] text-green-400 font-display animate-bounce" style={{ animationDelay: "0.9s" }}>+1.8k</div>
            {/* Aris */}
            <div className="absolute bottom-12 left-1/2 -translate-x-1/2 text-3xl">🧑‍🚀</div>
            <div className="absolute bottom-0 left-0 right-0 h-6 bg-gradient-to-t from-green-950 to-transparent" />
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
              <span className="text-[4px] text-white/40">Los números flotan sobre cada estructura</span>
            </div>
          </div>
        ),
      },
      {
        title: "Zoom In/Out", description: "Demostración de niveles de zoom",
        screen: () => (
          <div className="flex-1 flex flex-col bg-[#0d0520] p-2">
            <p className="text-[7px] text-white font-display mb-1">NIVELES DE ZOOM</p>
            <div className="flex gap-1 flex-1">
              <div className="flex-1 flex flex-col items-center justify-center bg-gradient-to-b from-sky-900/30 to-green-900/30 rounded-lg p-1 border border-white/10">
                <div className="text-[4px] text-white/40 mb-1">Zoom Out</div>
                <div className="w-8 h-8 rounded-full bg-gradient-to-b from-green-500/50 to-green-800/50" />
                <div className="absolute text-[3px] text-green-400">⛏🌾🔥</div>
                <div className="text-[3px] text-white/20 mt-1">Vista completa</div>
              </div>
              <div className="flex-1 flex flex-col items-center justify-center bg-gradient-to-b from-sky-900/30 to-green-900/30 rounded-lg p-1 border border-primary/30">
                <div className="text-[4px] text-primary mb-1">Normal</div>
                <div className="text-lg mb-0.5">🧑‍🚀</div>
                <div className="flex gap-1">
                  <span className="text-xs">⛏️</span>
                  <span className="text-xs">🌾</span>
                </div>
                <div className="text-[3px] text-white/20 mt-1">Vista estándar</div>
              </div>
              <div className="flex-1 flex flex-col items-center justify-center bg-gradient-to-b from-sky-900/30 to-green-900/30 rounded-lg p-1 border border-white/10">
                <div className="text-[4px] text-white/40 mb-1">Zoom In</div>
                <div className="text-2xl">⛏️</div>
                <div className="text-[5px] text-green-400 font-display">+9.92/s</div>
                <div className="text-[3px] text-white/20 mt-1">Detalle estructura</div>
              </div>
            </div>
            <p className="text-[4px] text-white/30 text-center mt-1">Pinch to zoom en la superficie del planeta</p>
          </div>
        ),
      },
    ],
  },
];

/* ═══════════════════════════════════════════════════════════════
   FLOW CATEGORIES — for grouped display
   ═══════════════════════════════════════════════════════════════ */
const CATEGORIES = [
  { key: "Core", label: "Core Gameplay", color: "#00D4E6" },
  { key: "Eras", label: "Eras Detalladas (9)", color: "#CC33B8" },
  { key: "Gameplay", label: "Gameplay Systems", color: "#EF4444" },
  { key: "Monetización", label: "Monetización", color: "#E6BF33" },
  { key: "Social", label: "Social & Ranking", color: "#2ECC71" },
  { key: "Personalización", label: "Personalización", color: "#00E5FF" },
  { key: "Engagement", label: "Engagement", color: "#FF6B35" },
  { key: "Sistema", label: "Sistema", color: "#94A3B8" },
];

/* ═══════════════════════════════════════════════════════════════
   MAIN PAGE COMPONENT
   ═══════════════════════════════════════════════════════════════ */
export default function DesignFlows() {
  const [selectedFlow, setSelectedFlow] = useState<string | null>(null);
  const activeFlow = FLOWS.find(f => f.id === selectedFlow);

  const totalScreens = FLOWS.reduce((a, f) => a + f.steps.length, 0);

  return (
    <div className="min-h-screen bg-[#050210] text-white">
      {/* ─── HEADER ─── */}
      <div className="sticky top-0 z-50 bg-[#050210]/90 backdrop-blur-lg border-b border-white/10 px-6 py-4">
        <div className="max-w-[1600px] mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="text-white/40 hover:text-white transition-colors text-sm">
              <ArrowLeft className="w-4 h-4 inline mr-1" />Volver al juego
            </Link>
            <div className="w-px h-6 bg-white/10" />
            <h1 className="text-xl font-display text-primary">EVOLVION</h1>
            <span className="text-sm text-white/40">Design Flows</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-xs text-white/30">{FLOWS.length} flujos • {totalScreens} pantallas</span>
            {selectedFlow && (
              <button onClick={() => setSelectedFlow(null)}
                className="text-xs px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-white/50 hover:text-white transition-colors">
                Ver todos
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-[1600px] mx-auto px-6 py-8">
        {!selectedFlow ? (
          /* ═══ FLOW GRID — Grouped by category ═══ */
          <div>
            <h2 className="text-2xl font-display text-white mb-2">Flujos del Juego</h2>
            <p className="text-sm text-white/50 mb-8">
              Documentación visual completa — {FLOWS.length} flujos, {totalScreens} pantallas, {ERAS.length} eras, {Object.values(ENEMIES_BY_ERA).flat().length} enemigos, {Object.values(CARDS_BY_ERA).flat().length} cartas
            </p>

            {CATEGORIES.map(cat => {
              const catFlows = FLOWS.filter(f => f.category === cat.key);
              if (catFlows.length === 0) return null;
              return (
                <div key={cat.key} className="mb-8">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-3 h-3 rounded-full" style={{ background: cat.color }} />
                    <h3 className="text-sm font-display uppercase tracking-wider" style={{ color: cat.color }}>{cat.label}</h3>
                    <span className="text-xs text-white/30">{catFlows.length} flujos</span>
                    <div className="flex-1 h-px bg-white/5 ml-2" />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                    {catFlows.map((flow, i) => (
                      <motion.button
                        key={flow.id}
                        onClick={() => setSelectedFlow(flow.id)}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.03 }}
                        className="text-left p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 hover:bg-white/8 transition-all group"
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-xl">{flow.icon}</span>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-display text-xs truncate" style={{ color: flow.color }}>{flow.name}</h4>
                            <p className="text-[10px] text-white/40">{flow.steps.length} pantallas</p>
                          </div>
                          <Maximize2 className="w-3 h-3 text-white/20 group-hover:text-white/50 transition-colors shrink-0" />
                        </div>
                        <p className="text-[10px] text-white/50 leading-relaxed line-clamp-2">{flow.description}</p>
                        <div className="flex gap-0.5 mt-2">
                          {flow.steps.map((_, j) => (
                            <div key={j} className="h-1 flex-1 rounded-full" style={{ background: `${flow.color}${j === 0 ? '' : '40'}` }} />
                          ))}
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </div>
              );
            })}

            {/* ─── Quick Stats Footer ─── */}
            <div className="mt-12 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {[
                { label: "Flujos", val: FLOWS.length, color: "#00D4E6" },
                { label: "Pantallas", val: totalScreens, color: "#CC33B8" },
                { label: "Eras", val: 9, color: "#4ADE80" },
                { label: "Enemigos", val: 27, color: "#EF4444" },
                { label: "Cartas", val: 81, color: "#9B00FF" },
                { label: "Skins", val: 6, color: "#00E5FF" },
              ].map(s => (
                <div key={s.label} className="p-3 rounded-xl bg-white/5 border border-white/10 text-center">
                  <div className="text-lg font-display" style={{ color: s.color }}>{s.val}</div>
                  <div className="text-[10px] text-white/40">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* ═══ FLOW DETAIL VIEW ═══ */
          <div>
            <button onClick={() => setSelectedFlow(null)}
              className="flex items-center gap-2 text-sm text-white/50 hover:text-white mb-6 transition-colors">
              <ArrowLeft className="w-4 h-4" /> Volver a todos los flujos
            </button>

            <div className="flex items-center gap-3 mb-2">
              <span className="text-3xl">{activeFlow!.icon}</span>
              <div>
                <h2 className="text-2xl font-display" style={{ color: activeFlow!.color }}>{activeFlow!.name}</h2>
                <p className="text-sm text-white/50">{activeFlow!.description}</p>
              </div>
              <span className="ml-auto text-xs px-3 py-1 rounded-lg bg-white/5 text-white/30">{activeFlow!.category}</span>
            </div>

            {/* Flow steps — horizontal scroll with arrows */}
            <div className="mt-8 overflow-x-auto pb-8">
              <div className="flex items-start gap-0 min-w-max">
                {activeFlow!.steps.map((step, i) => (
                  <div key={i} className="flex items-start">
                    <div className="flex flex-col items-center">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
                          style={{ background: activeFlow!.color + "30", color: activeFlow!.color }}>
                          {i + 1}
                        </div>
                        <div>
                          <p className="text-sm font-display text-white">{step.title}</p>
                          <p className="text-[10px] text-white/40">{step.description}</p>
                        </div>
                      </div>
                      <PhoneFrame label={step.title}>
                        {step.screen()}
                      </PhoneFrame>
                    </div>
                    {i < activeFlow!.steps.length - 1 && (
                      <div className="flex items-center px-4 pt-40">
                        <div className="flex items-center gap-1">
                          <div className="w-8 h-0.5" style={{ background: `linear-gradient(to right, ${activeFlow!.color}, ${activeFlow!.color}40)` }} />
                          <ArrowRight className="w-4 h-4" style={{ color: activeFlow!.color }} />
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Flow summary */}
            <div className="mt-4 p-4 rounded-xl bg-white/5 border border-white/10">
              <h3 className="font-display text-sm text-white mb-2">Resumen del Flujo</h3>
              <div className="flex gap-4 flex-wrap">
                {activeFlow!.steps.map((step, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs text-white/50">
                    <div className="w-4 h-4 rounded-full flex items-center justify-center text-[8px]"
                      style={{ background: activeFlow!.color + "30", color: activeFlow!.color }}>
                      {i + 1}
                    </div>
                    <span>{step.title}</span>
                    {i < activeFlow!.steps.length - 1 && <span className="text-white/20">→</span>}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
