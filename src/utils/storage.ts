import type { AppState } from "../types";

const STORAGE_KEY = "earthguide-state-v3";
const OLD_KEYS = ["earthguide-state", "lifequest-app-state-v2", "lifequest-app-state"];

export function loadAppState(): AppState | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as AppState;
    for (const key of OLD_KEYS) {
      const old = localStorage.getItem(key);
      if (old) {
        try {
          const parsed = JSON.parse(old);
          // Check for new v3 shape
          if (parsed && parsed.questBooks !== undefined) {
            localStorage.setItem(STORAGE_KEY, old);
            localStorage.removeItem(key);
            return parsed as AppState;
          }
          // Old data — can't migrate
          localStorage.removeItem(key);
        } catch { localStorage.removeItem(key); }
      }
    }
    return null;
  } catch { return null; }
}

export function saveAppState(state: AppState): void { try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch {} }
export function resetAppState(): void { localStorage.removeItem(STORAGE_KEY); OLD_KEYS.forEach((k) => localStorage.removeItem(k)); }
