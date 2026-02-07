import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Figma drop shadow: 0 6px 30px 12px with color at 16% opacity */
export function getIconShadow(hexColor: string): string {
  const hex = hexColor.replace("#", "");
  if (hex.length !== 6 || !/^[0-9A-Fa-f]{6}$/.test(hex)) {
    // Fallback for invalid colors (e.g. "gray")
    return "0 6px 30px 12px rgba(156, 163, 175, 0.16)";
  }
  const r = parseInt(hex.slice(0, 2), 16);
  const g = parseInt(hex.slice(2, 4), 16);
  const b = parseInt(hex.slice(4, 6), 16);
  return `0 6px 30px 12px rgba(${r}, ${g}, ${b}, 0.16)`;
}
