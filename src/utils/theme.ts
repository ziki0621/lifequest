export interface ThemeConfig {
  id: string;
  name: string;
  bg: string;          // fluid-bg background
  blob1: string;       // top-right blob color
  blob2: string;       // bottom-left blob color
  blob3: string;       // center blob color
  cream: string;       // welcome page / fallback bg
}

export const THEMES: ThemeConfig[] = [
  {
    id: "blossom",
    name: "花语",
    bg: "#FFF0F3",
    blob1: "#FFD6E0",
    blob2: "#E8D1FF",
    blob3: "#FFE5EC",
    cream: "#FFF0F3",
  },
  {
    id: "forest",
    name: "森林",
    bg: "#F0F5F0",
    blob1: "#D4E8D0",
    blob2: "#C8E6C9",
    blob3: "#E8F0E0",
    cream: "#F0F5F0",
  },
  {
    id: "ocean",
    name: "海洋",
    bg: "#F0F4F8",
    blob1: "#D0E0F0",
    blob2: "#C8DCF0",
    blob3: "#E0ECF5",
    cream: "#F0F4F8",
  },
  {
    id: "dusk",
    name: "暮色",
    bg: "#F8F4F0",
    blob1: "#F0D8C8",
    blob2: "#E8D0E0",
    blob3: "#F5E8DC",
    cream: "#F8F4F0",
  },
  {
    id: "moon",
    name: "月光",
    bg: "#F4F4F8",
    blob1: "#D8D8E8",
    blob2: "#D0D0E0",
    blob3: "#E8E8F0",
    cream: "#F4F4F8",
  },
];

const THEME_STORAGE_KEY = "earthguide-theme";

export function loadTheme(): string {
  return localStorage.getItem(THEME_STORAGE_KEY) || "blossom";
}

export function saveTheme(themeId: string): void {
  localStorage.setItem(THEME_STORAGE_KEY, themeId);
}

export function getTheme(themeId: string): ThemeConfig {
  return THEMES.find((t) => t.id === themeId) || THEMES[0];
}
