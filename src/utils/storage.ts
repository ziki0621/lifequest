import type { AppState } from "../types";

const STORAGE_KEY = "lifequest-app-state";

export function loadAppState(): AppState | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
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
}
