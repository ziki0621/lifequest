export interface ThemeConfig {
  id: string;
  name: string;
  primary: string;
  primaryLight: string;
}

export const THEMES: ThemeConfig[] = [
  { id: "blossom", name: "玫瑰", primary: "#B8405E", primaryLight: "#FAD4E2" },
  { id: "forest", name: "苔绿", primary: "#4A7250", primaryLight: "#D4E8D8" },
  { id: "ocean", name: "靛蓝", primary: "#4A7088", primaryLight: "#D4E4F0" },
  { id: "dusk", name: "琥珀", primary: "#A06040", primaryLight: "#FBE0D0" },
  { id: "moon", name: "紫灰", primary: "#6A6688", primaryLight: "#E4E0F0" },
];

const THEME_STORAGE_KEY = "earthguide-theme";

export function loadTheme(): string { return localStorage.getItem(THEME_STORAGE_KEY) || "blossom"; }
export function saveTheme(themeId: string): void { localStorage.setItem(THEME_STORAGE_KEY, themeId); }
export function getTheme(themeId: string): ThemeConfig { return THEMES.find((t) => t.id === themeId) || THEMES[0]; }
