import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
export function processText(text: string) {
  return text.trim().replace(/\n/g, " ").replace(/\s+/g, " ");
}
