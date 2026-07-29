import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merges Tailwind class names safely, resolving conflicting utility classes.
 * Used by every UI primitive in the design system.
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
