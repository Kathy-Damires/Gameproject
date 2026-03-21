// Helper to get icon URLs from public/images/icons/
const base = import.meta.env.BASE_URL + "images/icons/";

export const RESOURCE_ICONS = {
  stone: `${base}icon_stone.svg`,
  wood: `${base}icon_wood.svg`,
  food: `${base}icon_food.svg`,
  bronze: `${base}icon_bronze.svg`,
  iron: `${base}icon_iron.svg`,
  gold: `${base}icon_gold.svg`,
  crystal: `${base}icon_crystal.svg`,
  plasma: `${base}icon_plasma.svg`,
  antimatter: `${base}icon_antimatter.svg`,
  // Special (not produced by structures)
  energy: `${base}icon_energy.svg`,
  diamonds: `${base}icon_diamonds.svg`,
} as const;

export const NAV_ICONS = {
  home: `${base}icon_home.svg`,
  combat: `${base}icon_combat.svg`,
  structures: `${base}icon_structures.svg`,
  cards: `${base}icon_cards.svg`,
  shop: `${base}icon_shop.svg`,
  clan: `${base}icon_clan.svg`,
  equipment: `${base}icon_equipment.svg`,
  prestige: `${base}icon_prestige.svg`,
  achievements: `${base}icon_achievements.svg`,
  settings: `${base}icon_settings.svg`,
} as const;

export const BADGE_ICONS = {
  event: `${base}badge_event.svg`,
  battlepass: `${base}badge_battlepass.svg`,
  freeads: `${base}badge_freeads.svg`,
  dailyreward: `${base}badge_dailyreward.svg`,
} as const;

export const CLAN_ICONS = {
  stellar_wolves: `${base}clan_stellar_wolves.svg`,
  ancient_guardians: `${base}clan_ancient_guardians.svg`,
  nova_collective: `${base}clan_nova_collective.svg`,
  iron_forge: `${base}clan_iron_forge.svg`,
  dragon_knights: `${base}clan_dragon_knights.svg`,
  singularity_seekers: `${base}clan_singularity_seekers.svg`,
} as const;

export const SHOP_ICONS = {
  boost_2x: `${base}icon_boost_2x.svg`,
  vip: `${base}icon_vip.svg`,
  diamonds_small: `${base}pack_diamonds_small.svg`,
  diamonds_medium: `${base}pack_diamonds_medium.svg`,
  diamonds_large: `${base}pack_diamonds_large.svg`,
  resources: `${base}pack_resources.svg`,
} as const;

export const DAILY_ICONS = {
  box_normal: `${base}daily_box_normal.svg`,
  box_special: `${base}daily_box_special.svg`,
  box_epic: `${base}daily_box_epic.svg`,
  claimed: `${base}stamp_claimed.svg`,
  locked: `${base}stamp_locked.svg`,
} as const;

// Reusable icon component helper
export function iconUrl(name: string): string {
  return `${base}${name}.svg`;
}
