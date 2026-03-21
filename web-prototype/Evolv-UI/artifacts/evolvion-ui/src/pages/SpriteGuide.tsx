// @ts-ignore
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Palette, Check, AlertCircle, AlertTriangle, X } from "lucide-react";

interface SpriteItem {
  name: string;
  filename: string;
  size: string;
  status: "real" | "placeholder" | "missing";
  color: string;
}

interface SpriteCategory {
  title: string;
  emoji: string;
  folder: string;
  items: SpriteItem[];
}

// ═══════════════════════════════════════════════════════════════
// COMPLETE SPRITE INVENTORY
// ═══════════════════════════════════════════════════════════════
// Status guide:
//   "real"        = User-created vector SVG converted to PNG (or real web image)
//   "placeholder" = Python-generated placeholder (colored rectangle/circle with text)
//   "missing"     = File does not exist at all
// ═══════════════════════════════════════════════════════════════

const CATEGORIES: SpriteCategory[] = [
  // ═══════════════════════════════════
  // UI / ICONS / RESOURCES (11)
  // ═══════════════════════════════════
  {
    title: "Iconos de Recursos",
    emoji: "💎",
    folder: "Assets/Sprites/UI/Icons/Resources/",
    items: [
      { name: "Piedra",      filename: "icon_stone.png",      size: "128x128", status: "real",        color: "#8C8378" },
      { name: "Madera",      filename: "icon_wood.png",       size: "128x128", status: "real",        color: "#A16B28" },
      { name: "Comida",      filename: "icon_food.png",       size: "128x128", status: "real",        color: "#CC4444" },
      { name: "Bronce",      filename: "icon_bronze.png",     size: "128x128", status: "real",        color: "#CC9933" },
      { name: "Hierro",      filename: "icon_iron.png",       size: "128x128", status: "placeholder", color: "#8B8B8B" },
      { name: "Oro",         filename: "icon_gold.png",       size: "128x128", status: "placeholder", color: "#D4AF37" },
      { name: "Cristal",     filename: "icon_crystal.png",    size: "128x128", status: "placeholder", color: "#00BCD4" },
      { name: "Plasma",      filename: "icon_plasma.png",     size: "128x128", status: "placeholder", color: "#1A237E" },
      { name: "Antimateria", filename: "icon_antimatter.png", size: "128x128", status: "placeholder", color: "#9B00FF" },
      { name: "Energia",     filename: "icon_energy.png",     size: "128x128", status: "real",        color: "#E6C619" },
      { name: "Diamantes",   filename: "icon_diamonds.png",   size: "128x128", status: "real",        color: "#3388EE" },
    ],
  },

  // ═══════════════════════════════════
  // UI / ICONS / NAV (10)
  // ═══════════════════════════════════
  {
    title: "Iconos de Navegacion",
    emoji: "🧭",
    folder: "Assets/Sprites/UI/Icons/Nav/",
    items: [
      { name: "Home",         filename: "icon_home.png",         size: "128x128", status: "real", color: "#4ADE80" },
      { name: "Combate",      filename: "icon_combat.png",       size: "128x128", status: "real", color: "#EF4444" },
      { name: "Estructuras",  filename: "icon_structures.png",   size: "128x128", status: "real", color: "#D97706" },
      { name: "Cartas",       filename: "icon_cards.png",        size: "128x128", status: "real", color: "#8B5CF6" },
      { name: "Tienda",       filename: "icon_shop.png",         size: "128x128", status: "real", color: "#CC33B8" },
      { name: "Clan",         filename: "icon_clan.png",         size: "128x128", status: "real", color: "#3B82F6" },
      { name: "Equipamiento", filename: "icon_equipment.png",    size: "128x128", status: "real", color: "#00D4E6" },
      { name: "Prestigio",    filename: "icon_prestige.png",     size: "128x128", status: "real", color: "#A855F7" },
      { name: "Logros",       filename: "icon_achievements.png", size: "128x128", status: "real", color: "#E6BF33" },
      { name: "Config",       filename: "icon_settings.png",     size: "128x128", status: "real", color: "#94A3B8" },
    ],
  },

  // ═══════════════════════════════════
  // UI / BADGES (4)
  // ═══════════════════════════════════
  {
    title: "Badges Pantalla Principal",
    emoji: "🏷️",
    folder: "Assets/Sprites/UI/Badges/",
    items: [
      { name: "Pase de Batalla",    filename: "badge_battlepass.png",   size: "128x128", status: "real", color: "#A855F7" },
      { name: "Recompensa Diaria",  filename: "badge_dailyreward.png",  size: "128x128", status: "real", color: "#4ADE80" },
      { name: "Anuncios Gratis",    filename: "badge_freeads.png",      size: "128x128", status: "real", color: "#E6BF33" },
      { name: "Evento",             filename: "badge_event.png",        size: "128x128", status: "real", color: "#C026D3" },
    ],
  },

  // ═══════════════════════════════════
  // UI / BARS (6)
  // ═══════════════════════════════════
  {
    title: "Barras UI",
    emoji: "📊",
    folder: "Assets/Sprites/UI/Bars/",
    items: [
      { name: "Barra Fondo",    filename: "bar_bg.png",          size: "256x24", status: "real", color: "#1E293B" },
      { name: "Barra HP",       filename: "bar_hp_fill.png",     size: "256x24", status: "real", color: "#4ADE80" },
      { name: "Barra HP Baja",  filename: "bar_hp_low.png",      size: "256x24", status: "real", color: "#EF4444" },
      { name: "Barra XP",       filename: "bar_xp_fill.png",     size: "256x24", status: "real", color: "#00D4E6" },
      { name: "Barra Energia",  filename: "bar_energy_fill.png", size: "256x24", status: "real", color: "#E6C619" },
      { name: "Barra Era",      filename: "bar_era_fill.png",    size: "256x24", status: "real", color: "#C026D3" },
    ],
  },

  // ═══════════════════════════════════
  // UI / BUTTONS (6)
  // ═══════════════════════════════════
  {
    title: "Botones UI",
    emoji: "🔘",
    folder: "Assets/Sprites/UI/Buttons/",
    items: [
      { name: "Primario",   filename: "btn_primary.png",   size: "256x64", status: "real", color: "#00D4E6" },
      { name: "Secundario", filename: "btn_secondary.png", size: "256x64", status: "real", color: "#C026D3" },
      { name: "Accent",     filename: "btn_accent.png",    size: "256x64", status: "real", color: "#E6BF33" },
      { name: "Peligro",    filename: "btn_danger.png",    size: "256x64", status: "real", color: "#EF4444" },
      { name: "Disabled",   filename: "btn_disabled.png",  size: "256x64", status: "real", color: "#374151" },
      { name: "Cerrar",     filename: "btn_close.png",     size: "48x48",  status: "real", color: "#EF4444" },
    ],
  },

  // ═══════════════════════════════════
  // UI / PANELS (5)
  // ═══════════════════════════════════
  {
    title: "Paneles UI",
    emoji: "🖼️",
    folder: "Assets/Sprites/UI/Panels/",
    items: [
      { name: "Panel Oscuro",   filename: "panel_dark.png",    size: "256x256", status: "placeholder", color: "#1A1A2E" },
      { name: "Panel Glass",    filename: "panel_glass.png",   size: "256x256", status: "placeholder", color: "#1E293B" },
      { name: "Panel Carta",    filename: "panel_card.png",    size: "256x256", status: "placeholder", color: "#2B1534" },
      { name: "Panel Popup",    filename: "panel_popup.png",   size: "256x256", status: "placeholder", color: "#110023" },
      { name: "Panel Tooltip",  filename: "panel_tooltip.png", size: "256x256", status: "placeholder", color: "#0D0A1A" },
    ],
  },

  // ═══════════════════════════════════
  // CLANS (6)
  // ═══════════════════════════════════
  {
    title: "Emblemas de Clan",
    emoji: "🛡️",
    folder: "Assets/Sprites/Clans/",
    items: [
      { name: "Lobos Estelares",        filename: "clan_stellar_wolves.png",       size: "128x128", status: "real", color: "#3B82F6" },
      { name: "Guardianes Antiguos",     filename: "clan_ancient_guardians.png",    size: "128x128", status: "real", color: "#4ADE80" },
      { name: "Nova Collective",         filename: "clan_nova_collective.png",      size: "128x128", status: "real", color: "#E6BF33" },
      { name: "Forja de Hierro",         filename: "clan_iron_forge.png",           size: "128x128", status: "real", color: "#94A3B8" },
      { name: "Caballeros Dragon",       filename: "clan_dragon_knights.png",       size: "128x128", status: "real", color: "#EF4444" },
      { name: "Buscadores Singularidad", filename: "clan_singularity_seekers.png",  size: "128x128", status: "real", color: "#A855F7" },
    ],
  },

  // ═══════════════════════════════════
  // SHOP (6)
  // ═══════════════════════════════════
  {
    title: "Iconos de Tienda",
    emoji: "🛒",
    folder: "Assets/Sprites/Shop/",
    items: [
      { name: "Boost x2",          filename: "icon_boost_2x.png",       size: "96x96",   status: "real", color: "#EF4444" },
      { name: "VIP Crown",         filename: "icon_vip.png",            size: "96x96",   status: "real", color: "#E6BF33" },
      { name: "Pack Diamantes S",   filename: "pack_diamonds_small.png", size: "128x128", status: "real", color: "#3388EE" },
      { name: "Pack Diamantes M",   filename: "pack_diamonds_medium.png",size: "128x128", status: "real", color: "#3388EE" },
      { name: "Pack Diamantes L",   filename: "pack_diamonds_large.png", size: "128x128", status: "real", color: "#E6BF33" },
      { name: "Pack Recursos",      filename: "pack_resources.png",      size: "128x128", status: "real", color: "#4ADE80" },
    ],
  },

  // ═══════════════════════════════════
  // DAILY REWARDS (5)
  // ═══════════════════════════════════
  {
    title: "Recompensas Diarias",
    emoji: "🎁",
    folder: "Assets/Sprites/DailyRewards/",
    items: [
      { name: "Caja Normal",     filename: "daily_box_normal.png",  size: "128x128", status: "real", color: "#94A3B8" },
      { name: "Caja Especial",   filename: "daily_box_special.png", size: "128x128", status: "real", color: "#00D4E6" },
      { name: "Caja Epica",      filename: "daily_box_epic.png",    size: "128x128", status: "real", color: "#E6BF33" },
      { name: "Sello Reclamado", filename: "stamp_claimed.png",     size: "64x64",   status: "real", color: "#4ADE80" },
      { name: "Sello Bloqueado", filename: "stamp_locked.png",      size: "64x64",   status: "real", color: "#94A3B8" },
    ],
  },

  // ═══════════════════════════════════
  // CHARACTERS — Aris + 5 Skins (6)
  // ═══════════════════════════════════
  {
    title: "Personajes Aris + Skins",
    emoji: "🧑‍🚀",
    folder: "Assets/Sprites/Characters/",
    items: [
      { name: "Aris Default",          filename: "aris_default.png",          size: "512x768", status: "placeholder", color: "#06B6D4" },
      { name: "Aris Guerrero Bronce",  filename: "aris_bronze_warrior.png",   size: "512x768", status: "placeholder", color: "#CC9933" },
      { name: "Aris Caballero Oscuro", filename: "aris_dark_knight.png",      size: "512x768", status: "placeholder", color: "#4B5563" },
      { name: "Aris Mech Titan",       filename: "aris_mech.png",             size: "512x768", status: "placeholder", color: "#00BCD4" },
      { name: "Aris Fenix Solar",      filename: "aris_solar_phoenix.png",    size: "512x768", status: "missing",     color: "#FF6F00" },
      { name: "Aris Fantasma Cuantico",filename: "aris_quantum_ghost.png",    size: "512x768", status: "missing",     color: "#00E5FF" },
    ],
  },

  // ═══════════════════════════════════
  // ENEMIES — 27 total (3 per era x 9)
  // ═══════════════════════════════════
  {
    title: "Enemigos — Piedra",
    emoji: "👹",
    folder: "Assets/Sprites/Enemies/StoneAge/",
    items: [
      { name: "Dientes de Sable", filename: "enemy_sabertooth.png", size: "256x256", status: "placeholder", color: "#8C8378" },
      { name: "Oso Cavernario",   filename: "enemy_bear.png",       size: "256x256", status: "placeholder", color: "#8C8378" },
      { name: "Escorpion",        filename: "enemy_scorpion.png",   size: "256x256", status: "placeholder", color: "#8C8378" },
    ],
  },
  {
    title: "Enemigos — Tribal",
    emoji: "👹",
    folder: "Assets/Sprites/Enemies/TribalAge/",
    items: [
      { name: "Guerrero Tribal", filename: "enemy_tribesman.png", size: "256x256", status: "placeholder", color: "#A16B28" },
      { name: "Lobo Gigante",    filename: "enemy_direwolf.png",  size: "256x256", status: "placeholder", color: "#A16B28" },
      { name: "Chaman",          filename: "enemy_shaman.png",    size: "256x256", status: "placeholder", color: "#A16B28" },
    ],
  },
  {
    title: "Enemigos — Bronce",
    emoji: "👹",
    folder: "Assets/Sprites/Enemies/BronzeAge/",
    items: [
      { name: "Soldado de Bronce", filename: "enemy_bronze_soldier.png", size: "256x256", status: "placeholder", color: "#CC9933" },
      { name: "Jabali Salvaje",    filename: "enemy_wild_boar.png",      size: "256x256", status: "placeholder", color: "#CC9933" },
      { name: "Mercenario",        filename: "enemy_mercenary.png",      size: "256x256", status: "placeholder", color: "#CC9933" },
    ],
  },
  {
    title: "Enemigos — Clasica",
    emoji: "👹",
    folder: "Assets/Sprites/Enemies/ClassicalAge/",
    items: [
      { name: "Minotauro",  filename: "enemy_minotaur.png",  size: "256x256", status: "placeholder", color: "#C0C0C0" },
      { name: "Arpia",      filename: "enemy_harpy.png",     size: "256x256", status: "placeholder", color: "#C0C0C0" },
      { name: "Gladiador",  filename: "enemy_gladiator.png", size: "256x256", status: "placeholder", color: "#C0C0C0" },
    ],
  },
  {
    title: "Enemigos — Medieval",
    emoji: "👹",
    folder: "Assets/Sprites/Enemies/MiddleAge/",
    items: [
      { name: "Bandido",           filename: "enemy_bandit.png", size: "256x256", status: "placeholder", color: "#4A4A6A" },
      { name: "Caballero Oscuro",  filename: "enemy_knight.png", size: "256x256", status: "placeholder", color: "#4A4A6A" },
      { name: "Dragon Joven",      filename: "enemy_dragon.png", size: "256x256", status: "placeholder", color: "#4A4A6A" },
    ],
  },
  {
    title: "Enemigos — Industrial",
    emoji: "👹",
    folder: "Assets/Sprites/Enemies/IndustrialAge/",
    items: [
      { name: "Golem de Vapor",    filename: "enemy_steam_golem.png",   size: "256x256", status: "placeholder", color: "#8B8B8B" },
      { name: "Robot de Fabrica",  filename: "enemy_factory_bot.png",   size: "256x256", status: "placeholder", color: "#8B8B8B" },
      { name: "Maquina Rebelde",   filename: "enemy_rogue_machine.png", size: "256x256", status: "placeholder", color: "#8B8B8B" },
    ],
  },
  {
    title: "Enemigos — Robotica",
    emoji: "👹",
    folder: "Assets/Sprites/Enemies/RobotAge/",
    items: [
      { name: "Droide Avanzado",   filename: "enemy_advanced_droid.png", size: "256x256", status: "placeholder", color: "#00BCD4" },
      { name: "Mech de Combate",   filename: "enemy_combat_mech.png",   size: "256x256", status: "placeholder", color: "#00BCD4" },
      { name: "Guardian IA",       filename: "enemy_ai_guardian.png",    size: "256x256", status: "placeholder", color: "#00BCD4" },
    ],
  },
  {
    title: "Enemigos — Espacial",
    emoji: "👹",
    folder: "Assets/Sprites/Enemies/SpaceAge/",
    items: [
      { name: "Soldado Alienigena", filename: "enemy_alien_soldier.png", size: "256x256", status: "placeholder", color: "#1A237E" },
      { name: "Kraken Espacial",    filename: "enemy_space_kraken.png",  size: "256x256", status: "placeholder", color: "#1A237E" },
      { name: "Bestia del Vacio",   filename: "enemy_void_beast.png",    size: "256x256", status: "placeholder", color: "#1A237E" },
    ],
  },
  {
    title: "Enemigos — Singularidad",
    emoji: "👹",
    folder: "Assets/Sprites/Enemies/SingularityAge/",
    items: [
      { name: "Entidad Singular",  filename: "enemy_singularity_entity.png", size: "256x256", status: "placeholder", color: "#9B00FF" },
      { name: "Espectro Cuantico", filename: "enemy_quantum_wraith.png",     size: "256x256", status: "placeholder", color: "#9B00FF" },
      { name: "Jefe Final",        filename: "enemy_final_boss.png",         size: "256x256", status: "placeholder", color: "#9B00FF" },
    ],
  },

  // ═══════════════════════════════════
  // STRUCTURES — 27 total (3 per era x 9)
  // ═══════════════════════════════════
  {
    title: "Estructuras — Piedra",
    emoji: "🏗️",
    folder: "Assets/Sprites/Structures/StoneAge/",
    items: [
      { name: "Cantera (Mina Roca)", filename: "struct_rock_mine.png", size: "256x256", status: "placeholder", color: "#8C8378" },
      { name: "Choza de Piedra",     filename: "struct_stone_hut.png", size: "256x256", status: "placeholder", color: "#8C8378" },
      { name: "Fogata",              filename: "struct_campfire.png",  size: "256x256", status: "placeholder", color: "#8C8378" },
    ],
  },
  {
    title: "Estructuras — Tribal",
    emoji: "🏗️",
    folder: "Assets/Sprites/Structures/TribalAge/",
    items: [
      { name: "Cabana Tribal",    filename: "struct_tribal_lodge.png",   size: "256x256", status: "placeholder", color: "#A16B28" },
      { name: "Totem",            filename: "struct_totem_pole.png",     size: "256x256", status: "placeholder", color: "#A16B28" },
      { name: "Terreno de Caza",  filename: "struct_hunting_ground.png", size: "256x256", status: "placeholder", color: "#A16B28" },
    ],
  },
  {
    title: "Estructuras — Bronce",
    emoji: "🏗️",
    folder: "Assets/Sprites/Structures/BronzeAge/",
    items: [
      { name: "Forja de Bronce",   filename: "struct_bronze_forge.png",  size: "256x256", status: "placeholder", color: "#CC9933" },
      { name: "Mina de Bronce",    filename: "struct_bronze_mine.png",   size: "256x256", status: "placeholder", color: "#CC9933" },
      { name: "Puesto Comercial",  filename: "struct_trading_post.png",  size: "256x256", status: "placeholder", color: "#CC9933" },
    ],
  },
  {
    title: "Estructuras — Clasica",
    emoji: "🏗️",
    folder: "Assets/Sprites/Structures/ClassicalAge/",
    items: [
      { name: "Coliseo",     filename: "struct_colosseum.png", size: "256x256", status: "placeholder", color: "#C0C0C0" },
      { name: "Biblioteca",  filename: "struct_library.png",   size: "256x256", status: "placeholder", color: "#C0C0C0" },
      { name: "Puerto",      filename: "struct_harbor.png",    size: "256x256", status: "placeholder", color: "#C0C0C0" },
    ],
  },
  {
    title: "Estructuras — Medieval",
    emoji: "🏗️",
    folder: "Assets/Sprites/Structures/MiddleAge/",
    items: [
      { name: "Castillo",   filename: "struct_castle.png",    size: "256x256", status: "placeholder", color: "#4A4A6A" },
      { name: "Catedral",   filename: "struct_cathedral.png", size: "256x256", status: "placeholder", color: "#4A4A6A" },
      { name: "Molino",     filename: "struct_mill.png",      size: "256x256", status: "placeholder", color: "#4A4A6A" },
    ],
  },
  {
    title: "Estructuras — Industrial",
    emoji: "🏗️",
    folder: "Assets/Sprites/Structures/IndustrialAge/",
    items: [
      { name: "Fabrica",         filename: "struct_factory.png",      size: "256x256", status: "placeholder", color: "#8B8B8B" },
      { name: "Planta Electrica",filename: "struct_powerplant.png",   size: "256x256", status: "placeholder", color: "#8B8B8B" },
      { name: "Motor de Vapor",  filename: "struct_steam_engine.png", size: "256x256", status: "placeholder", color: "#8B8B8B" },
    ],
  },
  {
    title: "Estructuras — Robotica",
    emoji: "🏗️",
    folder: "Assets/Sprites/Structures/RobotAge/",
    items: [
      { name: "Fabrica Robot",  filename: "struct_robot_factory.png", size: "256x256", status: "placeholder", color: "#00BCD4" },
      { name: "Reactor Energia",filename: "struct_energy_grid.png",   size: "256x256", status: "placeholder", color: "#00BCD4" },
      { name: "Centro de Datos",filename: "struct_data_center.png",   size: "256x256", status: "placeholder", color: "#00BCD4" },
    ],
  },
  {
    title: "Estructuras — Espacial",
    emoji: "🏗️",
    folder: "Assets/Sprites/Structures/SpaceAge/",
    items: [
      { name: "Estacion Espacial", filename: "struct_space_station.png", size: "256x256", status: "placeholder", color: "#1A237E" },
      { name: "Plataforma Lanzam.",filename: "struct_launch_pad.png",    size: "256x256", status: "placeholder", color: "#1A237E" },
      { name: "Panel Solar",       filename: "struct_solar_array.png",   size: "256x256", status: "placeholder", color: "#1A237E" },
    ],
  },
  {
    title: "Estructuras — Singularidad",
    emoji: "🏗️",
    folder: "Assets/Sprites/Structures/SingularityAge/",
    items: [
      { name: "Nexo Hub",            filename: "struct_nexus_hub.png",       size: "256x256", status: "placeholder", color: "#9B00FF" },
      { name: "Nucleo Singularidad", filename: "struct_singularity_core.png",size: "256x256", status: "placeholder", color: "#9B00FF" },
      { name: "Puerta Omega",        filename: "struct_omega_gate.png",      size: "256x256", status: "placeholder", color: "#9B00FF" },
    ],
  },

  // ═══════════════════════════════════
  // CARDS — 81 total (9 per era x 9)
  // ═══════════════════════════════════
  ...["StoneAge", "TribalAge", "BronzeAge", "ClassicalAge", "MiddleAge", "IndustrialAge", "RobotAge", "SpaceAge", "SingularityAge"].map((era, eraIdx) => {
    const eraNames = ["Piedra", "Tribal", "Bronce", "Clasica", "Medieval", "Industrial", "Robotica", "Espacial", "Singularidad"];
    const eraColors = ["#8C8378", "#A16B28", "#CC9933", "#C0C0C0", "#4A4A6A", "#8B8B8B", "#00BCD4", "#1A237E", "#9B00FF"];
    const eraKeys = ["stoneage", "tribalage", "bronzeage", "classicalage", "middleage", "industrialage", "robotage", "spaceage", "singularityage"];
    return {
      title: `Cartas — ${eraNames[eraIdx]}`,
      emoji: "🃏",
      folder: `Assets/Sprites/Cards/${era}/`,
      items: Array.from({ length: 9 }, (_, i) => ({
        name: `Carta ${eraNames[eraIdx]} ${i}`,
        filename: `card_${eraKeys[eraIdx]}_${i}.png`,
        size: "192x256",
        status: "placeholder" as const,
        color: eraColors[eraIdx],
      })),
    };
  }),

  // ═══════════════════════════════════
  // CARD FRAMES (4)
  // ═══════════════════════════════════
  {
    title: "Marcos de Carta por Rareza",
    emoji: "🖼️",
    folder: "Assets/Sprites/UI/CardFrames/",
    items: [
      { name: "Marco Comun",      filename: "frame_common.png",    size: "220x300", status: "missing", color: "#94A3B8" },
      { name: "Marco Claro",      filename: "frame_clear.png",     size: "220x300", status: "missing", color: "#00D4E6" },
      { name: "Marco Epico",      filename: "frame_epic.png",      size: "220x300", status: "missing", color: "#A855F7" },
      { name: "Marco Legendario", filename: "frame_legendary.png", size: "220x300", status: "missing", color: "#E6BF33" },
    ],
  },

  // ═══════════════════════════════════
  // TOOLS — 13 total (9 base + 4 upgraded variants)
  // ═══════════════════════════════════
  {
    title: "Herramientas",
    emoji: "🔧",
    folder: "Assets/Sprites/Tools/",
    items: [
      { name: "Pico de Piedra",       filename: "tool_stone_pick.png",           size: "160x160", status: "placeholder", color: "#8C8378" },
      { name: "Pico de Piedra (Claro)",filename: "tool_stone_pick_clear.png",    size: "160x160", status: "placeholder", color: "#8C8378" },
      { name: "Pico de Piedra (Epico)",filename: "tool_stone_pick_epic.png",     size: "160x160", status: "placeholder", color: "#8C8378" },
      { name: "Hacha Tribal",         filename: "tool_tribal_axe.png",           size: "160x160", status: "placeholder", color: "#A16B28" },
      { name: "Hacha Tribal (Claro)", filename: "tool_tribal_axe_clear.png",     size: "160x160", status: "placeholder", color: "#A16B28" },
      { name: "Martillo Bronce",      filename: "tool_bronze_hammer.png",        size: "160x160", status: "placeholder", color: "#CC9933" },
      { name: "Martillo Bronce (Claro)",filename: "tool_bronze_hammer_clear.png",size: "160x160", status: "placeholder", color: "#CC9933" },
      { name: "Cincel Clasico",       filename: "tool_classical_chisel.png",     size: "160x160", status: "placeholder", color: "#C0C0C0" },
      { name: "Martillo Medieval",    filename: "tool_middle_forge.png",         size: "160x160", status: "placeholder", color: "#4A4A6A" },
      { name: "Taladro Industrial",   filename: "tool_industrial_drill.png",     size: "160x160", status: "placeholder", color: "#8B8B8B" },
      { name: "Laser Robotico",       filename: "tool_robot_laser.png",          size: "160x160", status: "placeholder", color: "#00BCD4" },
      { name: "Cortador Plasma",      filename: "tool_space_plasma.png",         size: "160x160", status: "placeholder", color: "#1A237E" },
      { name: "Herram. Cuantica",     filename: "tool_singularity_quantum.png",  size: "160x160", status: "placeholder", color: "#9B00FF" },
    ],
  },

  // ═══════════════════════════════════
  // EQUIPMENT — 16 (4 slots x 4 rarities)
  // ═══════════════════════════════════
  {
    title: "Equipamiento — Cascos",
    emoji: "🪖",
    folder: "Assets/Sprites/Equipment/",
    items: [
      { name: "Casco Comun",      filename: "Common/equip_helmet_common.png",    size: "192x192", status: "placeholder", color: "#94A3B8" },
      { name: "Casco Claro",      filename: "Clear/equip_helmet_clear.png",      size: "192x192", status: "placeholder", color: "#00D4E6" },
      { name: "Casco Epico",      filename: "Epic/equip_helmet_epic.png",        size: "192x192", status: "placeholder", color: "#A855F7" },
      { name: "Casco Legendario", filename: "Legendary/equip_helmet_legendary.png",size: "192x192",status: "placeholder", color: "#E6BF33" },
    ],
  },
  {
    title: "Equipamiento — Armas",
    emoji: "🗡️",
    folder: "Assets/Sprites/Equipment/",
    items: [
      { name: "Arma Comun",      filename: "Common/equip_weapon_common.png",    size: "192x192", status: "placeholder", color: "#94A3B8" },
      { name: "Arma Clara",      filename: "Clear/equip_weapon_clear.png",      size: "192x192", status: "placeholder", color: "#00D4E6" },
      { name: "Arma Epica",      filename: "Epic/equip_weapon_epic.png",        size: "192x192", status: "placeholder", color: "#A855F7" },
      { name: "Arma Legendaria", filename: "Legendary/equip_weapon_legendary.png",size: "192x192",status: "placeholder", color: "#E6BF33" },
    ],
  },
  {
    title: "Equipamiento — Armaduras",
    emoji: "🛡️",
    folder: "Assets/Sprites/Equipment/",
    items: [
      { name: "Armadura Comun",      filename: "Common/equip_armor_common.png",    size: "192x192", status: "placeholder", color: "#94A3B8" },
      { name: "Armadura Clara",      filename: "Clear/equip_armor_clear.png",      size: "192x192", status: "placeholder", color: "#00D4E6" },
      { name: "Armadura Epica",      filename: "Epic/equip_armor_epic.png",        size: "192x192", status: "placeholder", color: "#A855F7" },
      { name: "Armadura Legendaria", filename: "Legendary/equip_armor_legendary.png",size: "192x192",status: "placeholder", color: "#E6BF33" },
    ],
  },
  {
    title: "Equipamiento — Gadgets",
    emoji: "🔮",
    folder: "Assets/Sprites/Equipment/",
    items: [
      { name: "Gadget Comun",      filename: "Common/equip_gadget_common.png",    size: "192x192", status: "placeholder", color: "#94A3B8" },
      { name: "Gadget Claro",      filename: "Clear/equip_gadget_clear.png",      size: "192x192", status: "placeholder", color: "#00D4E6" },
      { name: "Gadget Epico",      filename: "Epic/equip_gadget_epic.png",        size: "192x192", status: "placeholder", color: "#A855F7" },
      { name: "Gadget Legendario", filename: "Legendary/equip_gadget_legendary.png",size: "192x192",status: "placeholder", color: "#E6BF33" },
    ],
  },

  // ═══════════════════════════════════
  // EQUIPMENT SLOTS (8)
  // ═══════════════════════════════════
  {
    title: "Slots de Equipamiento",
    emoji: "📦",
    folder: "Assets/Sprites/Equipment/Slots/",
    items: [
      { name: "Slot Casco",           filename: "slot_helmet.png",       size: "128x128", status: "placeholder", color: "#94A3B8" },
      { name: "Slot Casco (vacio)",   filename: "slot_helmet_empty.png", size: "128x128", status: "placeholder", color: "#374151" },
      { name: "Slot Arma",            filename: "slot_weapon.png",       size: "128x128", status: "placeholder", color: "#94A3B8" },
      { name: "Slot Arma (vacio)",    filename: "slot_weapon_empty.png", size: "128x128", status: "placeholder", color: "#374151" },
      { name: "Slot Armadura",        filename: "slot_armor.png",        size: "128x128", status: "placeholder", color: "#94A3B8" },
      { name: "Slot Armadura (vacio)",filename: "slot_armor_empty.png",  size: "128x128", status: "placeholder", color: "#374151" },
      { name: "Slot Gadget",          filename: "slot_gadget.png",       size: "128x128", status: "placeholder", color: "#94A3B8" },
      { name: "Slot Gadget (vacio)",  filename: "slot_gadget_empty.png", size: "128x128", status: "placeholder", color: "#374151" },
    ],
  },

  // ═══════════════════════════════════
  // BACKGROUNDS (4)
  // ═══════════════════════════════════
  {
    title: "Fondos",
    emoji: "🌌",
    folder: "Assets/Sprites/Backgrounds/",
    items: [
      { name: "Arena Combate", filename: "bg_combat_arena.png", size: "1080x1920", status: "placeholder", color: "#1A0A2E" },
      { name: "Menu Principal",filename: "bg_menu.png",         size: "1080x1920", status: "placeholder", color: "#0D0520" },
      { name: "Prestigio",     filename: "bg_prestige.png",     size: "1080x1920", status: "placeholder", color: "#1A0528" },
      { name: "Tienda",        filename: "bg_shop.png",         size: "1080x1920", status: "placeholder", color: "#1A1505" },
    ],
  },

  // ═══════════════════════════════════
  // EFFECTS (8)
  // ═══════════════════════════════════
  {
    title: "Efectos y Particulas",
    emoji: "✨",
    folder: "Assets/Sprites/Effects/",
    items: [
      { name: "Particula Dorada",   filename: "particle_gold.png",   size: "32x32",   status: "placeholder", color: "#E6BF33" },
      { name: "Particula Purpura",  filename: "particle_purple.png", size: "32x32",   status: "placeholder", color: "#A855F7" },
      { name: "Particula Cyan",     filename: "particle_cyan.png",   size: "32x32",   status: "placeholder", color: "#00D4E6" },
      { name: "Particula Verde",    filename: "particle_green.png",  size: "32x32",   status: "placeholder", color: "#4ADE80" },
      { name: "Particula Roja",     filename: "particle_red.png",    size: "32x32",   status: "placeholder", color: "#EF4444" },
      { name: "Particula Blanca",   filename: "particle_white.png",  size: "32x32",   status: "placeholder", color: "#FFFFFF" },
      { name: "Circulo Glow",       filename: "glow_circle.png",     size: "128x128", status: "placeholder", color: "#00D4E6" },
      { name: "Estrella",           filename: "star.png",            size: "64x64",   status: "placeholder", color: "#E6BF33" },
    ],
  },

  // ═══════════════════════════════════
  // WEB PROTOTYPE IMAGES (5) — real images
  // ═══════════════════════════════════
  {
    title: "Imagenes Web Prototype",
    emoji: "🌍",
    folder: "web-prototype/ (public/images/)",
    items: [
      { name: "Planeta Porera",    filename: "planet-porera.png",    size: "1024x1024", status: "real", color: "#4ADE80" },
      { name: "Planeta Doresa",    filename: "planet-doresa.png",    size: "1024x1024", status: "real", color: "#06B6D4" },
      { name: "Planeta Aitherium", filename: "planet-aitherium.png", size: "1024x1024", status: "real", color: "#8B5CF6" },
      { name: "Hero Aris",         filename: "hero-aris.png",        size: "512x768",   status: "real", color: "#06B6D4" },
      { name: "Fondo Espacio",     filename: "bg-space.png",         size: "1920x1080", status: "real", color: "#0D0520" },
    ],
  },

  // ═══════════════════════════════════
  // CHESTS (6)
  // ═══════════════════════════════════
  {
    title: "Cofres",
    emoji: "📦",
    folder: "Assets/Sprites/Chests/",
    items: [
      { name: "Cofre Basico Cerrado",     filename: "chest_basic_closed.png",     size: "256x256", status: "missing", color: "#94A3B8" },
      { name: "Cofre Basico Abierto",     filename: "chest_basic_open.png",       size: "256x256", status: "missing", color: "#94A3B8" },
      { name: "Cofre Epico Cerrado",      filename: "chest_epic_closed.png",      size: "256x256", status: "missing", color: "#A855F7" },
      { name: "Cofre Epico Abierto",      filename: "chest_epic_open.png",        size: "256x256", status: "missing", color: "#A855F7" },
      { name: "Cofre Legendario Cerrado", filename: "chest_legendary_closed.png", size: "256x256", status: "missing", color: "#E6BF33" },
      { name: "Cofre Legendario Abierto", filename: "chest_legendary_open.png",   size: "256x256", status: "missing", color: "#E6BF33" },
    ],
  },

  // ═══════════════════════════════════
  // ACHIEVEMENTS (10)
  // ═══════════════════════════════════
  {
    title: "Iconos de Logros",
    emoji: "🏆",
    folder: "Assets/Sprites/Achievements/",
    items: [
      { name: "Logro Planeta",         filename: "ach_planet.png",      size: "128x128", status: "missing", color: "#4ADE80" },
      { name: "Logro Coleccion",       filename: "ach_collection.png",  size: "128x128", status: "missing", color: "#8B5CF6" },
      { name: "Logro Combate",         filename: "ach_combat.png",      size: "128x128", status: "missing", color: "#EF4444" },
      { name: "Logro Clan",            filename: "ach_clan.png",        size: "128x128", status: "missing", color: "#3B82F6" },
      { name: "Logro Constructor",     filename: "ach_builder.png",     size: "128x128", status: "missing", color: "#D97706" },
      { name: "Logro Primera Sangre",  filename: "ach_first_blood.png", size: "128x128", status: "missing", color: "#EF4444" },
      { name: "Logro Explorador",      filename: "ach_explorer.png",    size: "128x128", status: "missing", color: "#4ADE80" },
      { name: "Logro Generoso",        filename: "ach_generous.png",    size: "128x128", status: "missing", color: "#3B82F6" },
      { name: "Logro Compra",          filename: "ach_purchase.png",    size: "128x128", status: "missing", color: "#E6BF33" },
      { name: "Logro Anuncios",        filename: "ach_ads.png",         size: "128x128", status: "missing", color: "#E6BF33" },
    ],
  },

  // ═══════════════════════════════════
  // SHOP OFFERS (4)
  // ═══════════════════════════════════
  {
    title: "Iconos de Ofertas (Tienda)",
    emoji: "🏷️",
    folder: "Assets/Sprites/Shop/",
    items: [
      { name: "Oferta Pack Inicial",  filename: "offer_starter.png",  size: "128x128", status: "missing", color: "#4ADE80" },
      { name: "Oferta Pack Cartas",   filename: "offer_cards.png",    size: "128x128", status: "missing", color: "#8B5CF6" },
      { name: "Oferta Pack Especial", filename: "offer_special.png",  size: "128x128", status: "missing", color: "#D97706" },
      { name: "Oferta Pack Premium",  filename: "offer_premium.png",  size: "128x128", status: "missing", color: "#EF4444" },
    ],
  },

  // ═══════════════════════════════════
  // BANNERS (4)
  // ═══════════════════════════════════
  {
    title: "Banners Tienda/Pase",
    emoji: "🖼️",
    folder: "Assets/Sprites/Shop/",
    items: [
      { name: "Banner Oferta Limitada",   filename: "banner_limited_offer.png",        size: "512x200", status: "missing", color: "#C026D3" },
      { name: "Banner Primera Compra x3", filename: "banner_first_purchase.png",       size: "512x200", status: "missing", color: "#4ADE80" },
      { name: "Banner Pase Gratis",       filename: "battlepass_banner_free.png",      size: "512x128", status: "missing", color: "#4ADE80" },
      { name: "Banner Pase Premium",      filename: "battlepass_banner_premium.png",   size: "512x128", status: "missing", color: "#A855F7" },
    ],
  },

  // ═══════════════════════════════════
  // FX SPECIAL (additional combat effects)
  // ═══════════════════════════════════
  {
    title: "Efectos Especiales (Combate)",
    emoji: "💥",
    folder: "Assets/Sprites/Effects/",
    items: [
      { name: "Explosion de Dano",   filename: "fx_explosion.png",   size: "128x128", status: "missing", color: "#F97316" },
      { name: "Curacion",            filename: "fx_heal.png",        size: "128x128", status: "missing", color: "#4ADE80" },
      { name: "Escudo",              filename: "fx_shield.png",      size: "128x128", status: "missing", color: "#3B82F6" },
      { name: "Golpe Critico",       filename: "fx_critical.png",    size: "128x128", status: "missing", color: "#EF4444" },
      { name: "Level Up",            filename: "fx_levelup.png",     size: "128x128", status: "missing", color: "#E6BF33" },
      { name: "Evolucion de Era",    filename: "fx_evolution.png",   size: "256x256", status: "missing", color: "#A855F7" },
      { name: "Apertura de Cofre",   filename: "fx_chest_open.png",  size: "256x256", status: "missing", color: "#E6BF33" },
      { name: "Brillo de Rareza",    filename: "fx_rarity_glow.png", size: "128x128", status: "missing", color: "#00D4E6" },
    ],
  },
];

// ═══════════════════════════════════════════════════════════════
// STATUS HELPERS
// ═══════════════════════════════════════════════════════════════

const STATUS_CONFIG = {
  real:        { label: "real",        badgeBg: "bg-green-500/20",  badgeText: "text-green-400",  borderColor: "border-green-500/30" },
  placeholder: { label: "placeholder", badgeBg: "bg-orange-500/20", badgeText: "text-orange-400", borderColor: "border-orange-500/20" },
  missing:     { label: "no existe",   badgeBg: "bg-red-500/20",    badgeText: "text-red-400",    borderColor: "border-red-500/20" },
} as const;

// ═══════════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════════

export default function SpriteGuide() {
  const totalSprites = CATEGORIES.reduce((acc, cat) => acc + cat.items.length, 0);
  const realSprites = CATEGORIES.reduce((acc, cat) => acc + cat.items.filter((i) => i.status === "real").length, 0);
  const placeholderSprites = CATEGORIES.reduce((acc, cat) => acc + cat.items.filter((i) => i.status === "placeholder").length, 0);
  const missingSprites = CATEGORIES.reduce((acc, cat) => acc + cat.items.filter((i) => i.status === "missing").length, 0);

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="glass-panel p-4 rounded-3xl">
        <div className="flex items-center gap-2 mb-1">
          <Palette className="w-6 h-6 text-primary" />
          <h1 className="text-xl font-display uppercase text-gradient-primary">Guia de Sprites</h1>
        </div>
        <p className="text-xs text-muted-foreground">Estado real de todos los recursos visuales del juego</p>
      </div>

      {/* Summary */}
      <div className="glass-panel p-4 rounded-2xl border border-primary/20">
        <div className="grid grid-cols-4 gap-2 text-center">
          <div>
            <div className="text-2xl font-display text-green-400">{realSprites}</div>
            <div className="text-[9px] text-green-400/70 uppercase font-display">Reales</div>
          </div>
          <div>
            <div className="text-2xl font-display text-orange-400">{placeholderSprites}</div>
            <div className="text-[9px] text-orange-400/70 uppercase font-display">Placeholder</div>
          </div>
          <div>
            <div className="text-2xl font-display text-red-400">{missingSprites}</div>
            <div className="text-[9px] text-red-400/70 uppercase font-display">No existen</div>
          </div>
          <div>
            <div className="text-2xl font-display text-white">{totalSprites}</div>
            <div className="text-[9px] text-muted-foreground uppercase font-display">Total</div>
          </div>
        </div>

        {/* Stacked progress bar */}
        <div className="mt-3 w-full bg-white/5 rounded-full h-2 flex overflow-hidden">
          <div className="h-full bg-green-400 transition-all"
            style={{ width: `${(realSprites / totalSprites) * 100}%` }} />
          <div className="h-full bg-orange-400 transition-all"
            style={{ width: `${(placeholderSprites / totalSprites) * 100}%` }} />
          <div className="h-full bg-red-400 transition-all"
            style={{ width: `${(missingSprites / totalSprites) * 100}%` }} />
        </div>
        <div className="text-[9px] text-muted-foreground text-center mt-1">
          {Math.round((realSprites / totalSprites) * 100)}% arte real completado
        </div>

        {/* Legend */}
        <div className="flex justify-center gap-4 mt-2">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-green-400" />
            <span className="text-[8px] text-green-400/80">Real (SVG/imagen)</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-orange-400" />
            <span className="text-[8px] text-orange-400/80">Placeholder (Python)</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-red-400" />
            <span className="text-[8px] text-red-400/80">No existe</span>
          </div>
        </div>
      </div>

      {/* Categories */}
      {CATEGORIES.map((category, catIdx) => {
        const catReal = category.items.filter(i => i.status === "real").length;
        const catMissing = category.items.filter(i => i.status === "missing").length;
        const catTotal = category.items.length;
        const allReal = catReal === catTotal;

        return (
          <motion.section key={category.title + catIdx}
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: catIdx * 0.02 }}
            className="space-y-2">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-display uppercase text-white flex items-center gap-2">
                <span>{category.emoji}</span>
                {allReal ? "OK" : catMissing > 0 ? "!!" : "..."} {category.title}
              </h2>
              <span className={cn(
                "text-[9px] px-2 py-0.5 rounded-full font-display",
                allReal
                  ? "bg-green-500/20 text-green-400"
                  : catMissing > 0
                    ? "bg-red-500/20 text-red-400"
                    : "bg-orange-500/20 text-orange-400"
              )}>
                {catReal}/{catTotal} real
              </span>
            </div>

            <div className="text-[8px] text-muted-foreground mb-1 font-mono">{category.folder}</div>

            <div className="grid grid-cols-3 gap-2">
              {category.items.map((item, idx) => {
                const cfg = STATUS_CONFIG[item.status];
                return (
                  <div key={`${category.title}-${idx}`}
                    className={cn(
                      "glass-panel rounded-xl p-2 flex flex-col items-center text-center border transition-all",
                      cfg.borderColor
                    )}>
                    <div className="w-10 h-10 rounded-lg mb-1.5 flex items-center justify-center"
                      style={{ backgroundColor: `${item.color}30`, border: `1px solid ${item.color}50` }}>
                      {item.status === "real" ? (
                        <Check className="w-4 h-4 text-green-400" />
                      ) : item.status === "placeholder" ? (
                        <AlertTriangle className="w-4 h-4 text-orange-400" />
                      ) : (
                        <X className="w-4 h-4 text-red-400" />
                      )}
                    </div>
                    <span className="text-[8px] text-white/80 font-display leading-tight line-clamp-2">{item.name}</span>
                    <span className="text-[7px] text-muted-foreground mt-0.5 font-mono">{item.filename.split("/").pop()}</span>
                    <span className="text-[7px] text-muted-foreground">{item.size}</span>
                    <span className={cn(
                      "text-[7px] mt-0.5 px-1.5 rounded-full font-display",
                      cfg.badgeBg, cfg.badgeText
                    )}>
                      {cfg.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </motion.section>
        );
      })}

      {/* Total summary */}
      <div className="glass-panel p-4 rounded-2xl border border-accent/20 text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <AlertCircle className="w-4 h-4 text-accent" />
          <span className="font-display text-sm text-white uppercase">Resumen por Categoria</span>
        </div>
        <div className="space-y-1">
          {CATEGORIES.map((cat, i) => {
            const real = cat.items.filter(i => i.status === "real").length;
            const placeholder = cat.items.filter(i => i.status === "placeholder").length;
            const missing = cat.items.filter(i => i.status === "missing").length;
            const total = cat.items.length;
            return (
              <div key={cat.title + i} className="flex items-center justify-between text-[10px] px-2">
                <span className="text-muted-foreground truncate mr-2">{cat.emoji} {cat.title}</span>
                <div className="flex items-center gap-2 shrink-0">
                  {real > 0 && <span className="text-green-400 font-display">{real}R</span>}
                  {placeholder > 0 && <span className="text-orange-400 font-display">{placeholder}P</span>}
                  {missing > 0 && <span className="text-red-400 font-display">{missing}M</span>}
                  <span className="text-muted-foreground font-display">/{total}</span>
                </div>
              </div>
            );
          })}
          <div className="border-t border-white/10 pt-2 mt-2 space-y-1 px-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-green-400 font-display uppercase">Real (arte final)</span>
              <span className="text-green-400 font-display">{realSprites}</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-orange-400 font-display uppercase">Placeholder (necesita arte)</span>
              <span className="text-orange-400 font-display">{placeholderSprites}</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-red-400 font-display uppercase">No existe (crear)</span>
              <span className="text-red-400 font-display">{missingSprites}</span>
            </div>
            <div className="border-t border-white/10 pt-1 mt-1 flex items-center justify-between text-xs">
              <span className="text-accent font-display uppercase">Total</span>
              <span className="text-accent font-display">{totalSprites}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="h-4" />
    </div>
  );
}
