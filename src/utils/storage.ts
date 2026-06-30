import type { AppState, QuestBook } from "../types";

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
          if (parsed && parsed.questBooks !== undefined) {
            localStorage.setItem(STORAGE_KEY, old);
            localStorage.removeItem(key);
            return parsed as AppState;
          }
          const migrated = migrateLegacyState(parsed);
          if (migrated) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(migrated));
            localStorage.removeItem(key);
            return migrated;
          }
          localStorage.removeItem(key);
        } catch { localStorage.removeItem(key); }
      }
    }
    return null;
  } catch { return null; }
}

export function saveAppState(state: AppState): void { try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch {} }
export function resetAppState(): void { localStorage.removeItem(STORAGE_KEY); OLD_KEYS.forEach((k) => localStorage.removeItem(k)); }

function migrateLegacyState(parsed: any): AppState | null {
  if (!parsed || !Array.isArray(parsed.mainQuests)) return null;

  const questBooks: QuestBook[] = parsed.mainQuests.map((mq: any) => ({
    id: String(mq.id),
    title: mq.title || "未命名任务书",
    description: mq.description || "",
    domain: mq.domain || "mind",
    status: mq.status || "active",
    questLines: [
      {
        id: `${mq.id}-line`,
        title: mq.title || "任务线",
        description: mq.description,
        stages: Array.isArray(mq.stages)
          ? mq.stages.map((stage: any, index: number) => ({
              id: String(stage.id),
              title: stage.title || "未命名阶段",
              description: stage.description,
              anchorDate: stage.anchorDate,
              completed: Boolean(stage.completed),
              completedAt: stage.completedAt,
              order: Number.isFinite(stage.order) ? stage.order : index,
            }))
          : [],
      },
    ],
    directTasks: [],
    createdAt: mq.createdAt || new Date().toISOString(),
    archived: mq.archived,
    archivedAt: mq.archivedAt,
  }));

  return {
    player: parsed.player,
    questBooks,
    dailyTasks: Array.isArray(parsed.dailyTasks) ? parsed.dailyTasks : [],
    sideQuests: Array.isArray(parsed.sideQuests)
      ? parsed.sideQuests.map((sq: any) => {
          const { mainQuestId: _mainQuestId, ...rest } = sq;
          return rest;
        })
      : [],
    journalEntries: Array.isArray(parsed.journalEntries) ? parsed.journalEntries : [],
    achievements: Array.isArray(parsed.achievements) ? parsed.achievements : [],
  } as AppState;
}
