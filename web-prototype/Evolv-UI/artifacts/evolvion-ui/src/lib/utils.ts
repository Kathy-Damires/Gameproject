import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Helper to format large numbers for games (e.g. 1.2K, 3.4M)
export function formatNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
}

// Map planet IDs to their specific color variables
export function getPlanetColor(planetId: number): string {
  switch (planetId) {
    case 1: return "var(--color-planet-porera)";
    case 2: return "var(--color-planet-doresa)";
    case 3: return "var(--color-planet-aitherium)";
    default: return "var(--color-primary)";
  }
}
