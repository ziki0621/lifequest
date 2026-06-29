export interface ThemeConfig {
  id: string;
  name: string;
  bg: string;
  blob1: string;
  blob2: string;
  blob3: string;
  primary: string;
  primaryLight: string;
}

export const THEMES: ThemeConfig[] = [
  {
    id: "blossom",
    name: "花语",
    bg: "#FFF0F3",
    blob1: "#FFD6E0",
    blob2: "#E8D1FF",
    blob3: "#FFE5EC",
    primary: "#3D2C3A",
    primaryLight: "#F0E4EC",
  },
  {
    id: "forest",
    name: "森林",
    bg: "#F2F6EE",
    blob1: "#C5E0B4",
    blob2: "#A8D8B9",
    blob3: "#E0F0D4",
    primary: "#2D5A3D",
    primaryLight: "#E4F0E8",
  },
  {
    id: "ocean",
    name: "海洋",
    bg: "#F0F4FA",
    blob1: "#B4D4F0",
    blob2: "#A0C8E8",
    blob3: "#D4E8F8",
    primary: "#1A3A5C",
    primaryLight: "#E0EAF2",
  },
  {
    id: "dusk",
    name: "暮色",
    bg: "#FBF5EF",
    blob1: "#F0C4A8",
    blob2: "#E0B8D0",
    blob3: "#F8E0CC",
    primary: "#6B3A2E",
    primaryLight: "#F2E4DC",
  },
  {
    id: "moon",
    name: "月光",
    bg: "#F5F5FA",
    blob1: "#C4C4E0",
    blob2: "#B0B8D8",
    blob3: "#E0E0F0",
    primary: "#3D3D5C",
    primaryLight: "#E8E8F0",
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
