import type { AppState } from "../types";

const STORAGE_KEY = "earthguide-state";
const OLD_KEYS = ["lifequest-app-state-v2", "lifequest-app-state"];

export function loadAppState(): AppState | null {
  try {
    // Try new key first
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as AppState;

    // Migration: try old keys
    for (const key of OLD_KEYS) {
      const old = localStorage.getItem(key);
      if (old) {
        const parsed = JSON.parse(old);
        // Only migrate v2-format data (has mainQuests/dailyTasks/sideQuests)
        if (parsed && (parsed.mainQuests || parsed.dailyTasks || parsed.sideQuests)) {
          const state = parsed as AppState;
          // Save to new key
          localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
          // Clean up old key
          localStorage.removeItem(key);
          return state;
        }
        // Old v1 shape (questLines/tasks) — can't migrate
        localStorage.removeItem(key);
      }
    }
    return null;
  } catch {
    return null;
  }
}

export function saveAppState(state: AppState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.error("Failed to save app state:", e);
  }
}

export function resetAppState(): void {
  localStorage.removeItem(STORAGE_KEY);
  OLD_KEYS.forEach((k) => localStorage.removeItem(k));
}
