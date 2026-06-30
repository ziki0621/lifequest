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
    name: "羊皮纸",
    bg: "#F4EAD8",
    blob1: "#EBD8B8",
    blob2: "#DCC69E",
    blob3: "#F8F0E2",
    primary: "#5D7D42",
    primaryLight: "#DDE6C9",
  },
  {
    id: "forest",
    name: "森林",
    bg: "#F2F6EE",
    blob1: "#C5E0B4",
    blob2: "#A8D8B9",
    blob3: "#E0F0D4",
    primary: "#52753C",
    primaryLight: "#D9E5C6",
  },
  {
    id: "ocean",
    name: "青灰",
    bg: "#F3EEE4",
    blob1: "#C8D4C6",
    blob2: "#B8C6B9",
    blob3: "#ECE6D9",
    primary: "#5E7465",
    primaryLight: "#DDE5DC",
  },
  {
    id: "dusk",
    name: "暮色",
    bg: "#FBF5EF",
    blob1: "#F0C4A8",
    blob2: "#E0B8D0",
    blob3: "#F8E0CC",
    primary: "#8F6B3C",
    primaryLight: "#EBDCC4",
  },
  {
    id: "moon",
    name: "月光",
    bg: "#F5F5FA",
    blob1: "#C4C4E0",
    blob2: "#B0B8D8",
    blob3: "#E0E0F0",
    primary: "#6F6352",
    primaryLight: "#E2D8C8",
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
