// @ts-ignore
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Palette, ImageIcon, Check, AlertCircle } from "lucide-react";

interface SpriteItem {
  name: string;
  size: string;
  status: "placeholder" | "real";
  color: string;
}

interface SpriteCategory {
  title: string;
  emoji: string;
  items: SpriteItem[];
}

const ERAS = [
  "Piedra",
  "Tribal",
  "Bronce",
  "Clásica",
  "Medieval",
  "Industrial",
  "Robótica",
  "Espacial",
  "Singularidad",
];

const RARITIES = ["Común", "Clara", "Épica", "Legendaria"];
const SLOTS = ["Arma", "Armadura", "Casco", "Amuleto"];

function generateEraItems(
  prefix: string,
  perEra: number,
  size: string,
  color: string
): SpriteItem[] {
  const items: SpriteItem[] = [];
  for (const era of ERAS) {
    for (let i = 1; i <= perEra; i++) {
      items.push({
        name: `${prefix} ${era} ${i}`,
        size,
        status: "placeholder",
        color,
      });
    }
  }
  return items;
}

const CATEGORIES: SpriteCategory[] = [
  {
    title: "Iconos de UI",
    emoji: "🎨",
    items: [
      { name: "Icono Piedra", size: "64x64", status: "placeholder", color: "#78716c" },
      { name: "Icono Madera", size: "64x64", status: "placeholder", color: "#a16207" },
      { name: "Icono Comida", size: "64x64", status: "placeholder", color: "#dc2626" },
      { name: "Icono Bronce", size: "64x64", status: "placeholder", color: "#d97706" },
      { name: "Icono Energía", size: "64x64", status: "placeholder", color: "#eab308" },
      { name: "Icono Diamantes", size: "64x64", status: "placeholder", color: "#3b82f6" },
      { name: "Nav Inicio", size: "48x48", status: "placeholder", color: "#4ade80" },
      { name: "Nav Tienda", size: "48x48", status: "placeholder", color: "#f59e0b" },
      { name: "Nav Cartas", size: "48x48", status: "placeholder", color: "#8b5cf6" },
      { name: "Nav Clanes", size: "48x48", status: "placeholder", color: "#3b82f6" },
      { name: "Nav Logros", size: "48x48", status: "placeholder", color: "#f59e0b" },
      { name: "Nav Planeta", size: "48x48", status: "placeholder", color: "#4ade80" },
      { name: "Nav Combate", size: "48x48", status: "placeholder", color: "#ef4444" },
      { name: "Nav Estructuras", size: "48x48", status: "placeholder", color: "#d97706" },
      { name: "Nav Config", size: "48x48", status: "placeholder", color: "#6b7280" },
    ],
  },
  {
    title: "Personajes (Aris Skins)",
    emoji: "🧑‍🚀",
    items: [
      { name: "Aris Base", size: "256x256", status: "placeholder", color: "#4ade80" },
      { name: "Aris Guerrero", size: "256x256", status: "placeholder", color: "#ef4444" },
      { name: "Aris Mago Estelar", size: "256x256", status: "placeholder", color: "#8b5cf6" },
      { name: "Aris Legendario", size: "256x256", status: "placeholder", color: "#f59e0b" },
    ],
  },
  {
    title: "Planetas",
    emoji: "🌍",
    items: [
      { name: "Porera", size: "512x512", status: "real", color: "#4ade80" },
      { name: "Doresa", size: "512x512", status: "real", color: "#06b6d4" },
      { name: "Aitherium", size: "512x512", status: "real", color: "#8b5cf6" },
    ],
  },
  {
    title: "Enemigos",
    emoji: "👹",
    items: generateEraItems("Enemigo", 3, "128x128", "#ef4444"),
  },
  {
    title: "Estructuras",
    emoji: "🏗️",
    items: generateEraItems("Estructura", 3, "128x128", "#d97706"),
  },
  {
    title: "Equipamiento",
    emoji: "⚔️",
    items: SLOTS.flatMap((slot) =>
      RARITIES.map((rarity) => ({
        name: `${slot} ${rarity}`,
        size: "96x96",
        status: "placeholder" as const,
        color:
          rarity === "Común"
            ? "#94a3b8"
            : rarity === "Clara"
              ? "#06b6d4"
              : rarity === "Épica"
                ? "#a855f7"
                : "#f59e0b",
      }))
    ),
  },
  {
    title: "Herramientas",
    emoji: "🔧",
    items: ERAS.map((era) => ({
      name: `Herramienta ${era}`,
      size: "96x96",
      status: "placeholder" as const,
      color: "#6b7280",
    })),
  },
  {
    title: "Cartas",
    emoji: "🃏",
    items: generateEraItems("Carta", 9, "200x280", "#8b5cf6"),
  },
  {
    title: "Efectos Visuales",
    emoji: "✨",
    items: [
      { name: "Explosión", size: "128x128", status: "placeholder", color: "#f97316" },
      { name: "Curación", size: "128x128", status: "placeholder", color: "#22c55e" },
      { name: "Escudo", size: "128x128", status: "placeholder", color: "#3b82f6" },
      { name: "Crítico", size: "128x128", status: "placeholder", color: "#ef4444" },
      { name: "Level Up", size: "128x128", status: "placeholder", color: "#eab308" },
      { name: "Evolución", size: "128x128", status: "placeholder", color: "#a855f7" },
      { name: "Teletransporte", size: "128x128", status: "placeholder", color: "#06b6d4" },
      { name: "Recolección", size: "128x128", status: "placeholder", color: "#4ade80" },
    ],
  },
  {
    title: "Paneles y Botones UI",
    emoji: "🖼️",
    items: [
      { name: "Panel Principal", size: "400x300", status: "placeholder", color: "#1e293b" },
      { name: "Panel Diálogo", size: "350x200", status: "placeholder", color: "#1e293b" },
      { name: "Panel Inventario", size: "400x500", status: "placeholder", color: "#1e293b" },
      { name: "Botón Primario", size: "200x60", status: "placeholder", color: "#4ade80" },
      { name: "Botón Secundario", size: "200x60", status: "placeholder", color: "#f59e0b" },
      { name: "Botón Peligro", size: "200x60", status: "placeholder", color: "#ef4444" },
      { name: "Barra de Vida", size: "300x30", status: "placeholder", color: "#22c55e" },
      { name: "Barra de XP", size: "300x30", status: "placeholder", color: "#3b82f6" },
      { name: "Marco Carta Común", size: "220x300", status: "placeholder", color: "#94a3b8" },
      { name: "Marco Carta Clara", size: "220x300", status: "placeholder", color: "#06b6d4" },
      { name: "Marco Carta Épica", size: "220x300", status: "placeholder", color: "#a855f7" },
      { name: "Marco Carta Legendaria", size: "220x300", status: "placeholder", color: "#f59e0b" },
    ],
  },
];

export default function SpriteGuide() {
  const totalSprites = CATEGORIES.reduce(
    (acc, cat) => acc + cat.items.length,
    0
  );
  const realSprites = CATEGORIES.reduce(
    (acc, cat) => acc + cat.items.filter((i) => i.status === "real").length,
    0
  );

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="glass-panel p-4 rounded-3xl">
        <div className="flex items-center gap-2 mb-1">
          <Palette className="w-6 h-6 text-primary" />
          <h1 className="text-xl font-display uppercase text-gradient-primary">
            Guía de Sprites Necesarios
          </h1>
        </div>
        <p className="text-xs text-muted-foreground">
          Todos los recursos visuales que el juego necesita
        </p>
      </div>

      {/* Summary */}
      <div className="glass-panel p-4 rounded-2xl border border-primary/20">
        <div className="grid grid-cols-3 gap-3 text-center">
          <div>
            <div className="text-2xl font-display text-white">{totalSprites}</div>
            <div className="text-[9px] text-muted-foreground uppercase font-display">
              Total
            </div>
          </div>
          <div>
            <div className="text-2xl font-display text-green-400">{realSprites}</div>
            <div className="text-[9px] text-green-400/70 uppercase font-display">
              Reales
            </div>
          </div>
          <div>
            <div className="text-2xl font-display text-orange-400">
              {totalSprites - realSprites}
            </div>
            <div className="text-[9px] text-orange-400/70 uppercase font-display">
              Pendientes
            </div>
          </div>
        </div>
        <div className="mt-3 w-full bg-white/5 rounded-full h-2">
          <div
            className="h-full rounded-full bg-gradient-to-r from-primary to-secondary transition-all"
            style={{ width: `${(realSprites / totalSprites) * 100}%` }}
          />
        </div>
        <div className="text-[9px] text-muted-foreground text-center mt-1">
          {Math.round((realSprites / totalSprites) * 100)}% completado
        </div>
      </div>

      {/* Categories */}
      {CATEGORIES.map((category, catIdx) => (
        <motion.section
          key={category.title}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: catIdx * 0.05 }}
          className="space-y-2"
        >
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-display uppercase text-white flex items-center gap-2">
              <span>{category.emoji}</span>
              {category.title}
            </h2>
            <span className="text-[9px] px-2 py-0.5 rounded-full bg-white/10 text-muted-foreground font-display">
              {category.items.length} sprites
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {category.items.map((item, idx) => (
              <motion.div
                key={`${category.title}-${idx}`}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: catIdx * 0.03 + idx * 0.01 }}
                className={cn(
                  "glass-panel rounded-xl p-2 flex flex-col items-center text-center border transition-all",
                  item.status === "real"
                    ? "border-green-500/30"
                    : "border-white/5"
                )}
              >
                {/* Color placeholder box */}
                <div
                  className="w-10 h-10 rounded-lg mb-1.5 flex items-center justify-center"
                  style={{ backgroundColor: `${item.color}30`, border: `1px solid ${item.color}50` }}
                >
                  {item.status === "real" ? (
                    <Check className="w-4 h-4 text-green-400" />
                  ) : (
                    <ImageIcon className="w-4 h-4" style={{ color: `${item.color}80` }} />
                  )}
                </div>

                <span className="text-[8px] text-white/80 font-display leading-tight line-clamp-2">
                  {item.name}
                </span>
                <span className="text-[7px] text-muted-foreground mt-0.5">
                  {item.size}
                </span>
                <span
                  className={cn(
                    "text-[7px] mt-0.5 px-1.5 rounded-full font-display",
                    item.status === "real"
                      ? "bg-green-500/20 text-green-400"
                      : "bg-orange-500/20 text-orange-400"
                  )}
                >
                  {item.status === "real" ? "real" : "placeholder"}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.section>
      ))}

      {/* Total count at bottom */}
      <div className="glass-panel p-4 rounded-2xl border border-accent/20 text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <AlertCircle className="w-4 h-4 text-accent" />
          <span className="font-display text-sm text-white uppercase">
            Resumen Total
          </span>
        </div>
        <div className="space-y-1">
          {CATEGORIES.map((cat) => (
            <div
              key={cat.title}
              className="flex items-center justify-between text-[10px] px-2"
            >
              <span className="text-muted-foreground">
                {cat.emoji} {cat.title}
              </span>
              <span className="text-white font-display">{cat.items.length}</span>
            </div>
          ))}
          <div className="border-t border-white/10 pt-1 mt-2 flex items-center justify-between text-xs px-2">
            <span className="text-accent font-display uppercase">Total</span>
            <span className="text-accent font-display text-lg">{totalSprites}</span>
          </div>
        </div>
      </div>

      <div className="h-4" />
    </div>
  );
}
