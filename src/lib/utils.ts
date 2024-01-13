import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getFileSizeSuffix(bytes: number): string {
  const suffixes = ["", "K", "M", "G", "T"];
  const magnitude = Math.floor(Math.log2(bytes) / 10);
  const suffix = suffixes[magnitude] + "B";
  return suffix;
}
