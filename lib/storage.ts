import { THEME_STORAGE_KEY } from "@/lib/constants";

export type ThemeMode = "light" | "dark";

export function getStoredTheme(): ThemeMode {
  if (typeof window === "undefined") return "light";
  const value = localStorage.getItem(THEME_STORAGE_KEY);
  return value === "dark" ? "dark" : "light";
}

export function setStoredTheme(theme: ThemeMode) {
  if (typeof window === "undefined") return;
  localStorage.setItem(THEME_STORAGE_KEY, theme);
}
