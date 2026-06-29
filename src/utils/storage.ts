import type { AppState } from "../types";

const STORAGE_KEY = "lifequest-app-state-v2";

export function loadAppState(): AppState | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      // Attempt migration from v1
      const old = localStorage.getItem("lifequest-app-state");
      if (old) {
        const parsed = JSON.parse(old);
        // Old shape has "questLines" or "tasks" — can't migrate, return null for fresh start
        if (parsed && (parsed.questLines !== undefined || parsed.tasks !== undefined)) {
          localStorage.removeItem("lifequest-app-state");
          return null;
        }
      }
      return null;
    }
    return JSON.parse(raw) as AppState;
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
  localStorage.removeItem("lifequest-app-state"); // clean up old key too
}
