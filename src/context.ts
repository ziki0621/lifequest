import { createContext } from "react";
import type {
  AppState, JournalEntry, MainQuest, QuestStage, DailyTask, SideQuest,
  Achievement, CompletionContext, QuestPlanDraft,
} from "./types";
import type { ThemeConfig } from "./utils/theme";

export interface AppContextType {
  state: AppState;
  theme: ThemeConfig;
  setTheme: (id: string) => void;
  completeMainStage: (mainQuestId: string, stageId: string) => CompletionContext | null;
  completeDailyTask: (dailyTaskId: string) => CompletionContext | null;
  completeSideQuest: (sideQuestId: string) => CompletionContext | null;
  addJournal: (entry: Omit<JournalEntry, "id" | "createdAt">) => void;
  addMainQuest: (mq: Omit<MainQuest, "id" | "createdAt">) => void;
  addMainStage: (mainQuestId: string, stage: Omit<QuestStage, "id">) => void;
  addDailyTask: (dt: Omit<DailyTask, "id" | "createdAt" | "completions">) => void;
  addSideQuest: (sq: Omit<SideQuest, "id" | "createdAt" | "completed" | "completedAt">) => void;
  updateMainQuest: (id: string, mq: Partial<MainQuest>) => void;
  updateDailyTask: (id: string, dt: Partial<DailyTask>) => void;
  updateSideQuest: (id: string, sq: Partial<SideQuest>) => void;
  toggleDailyActive: (id: string) => void;
  applyQuestPlan: (plan: QuestPlanDraft) => void;
  archiveMainQuest: (id: string) => void;
  archiveDailyTask: (id: string) => void;
  archiveSideQuest: (id: string) => void;
  deleteMainQuest: (id: string) => void;
  deleteDailyTask: (id: string) => void;
  deleteSideQuest: (id: string) => void;
  undoLastMutation: () => void;
  lastUndoLabel: string | null;
  resetData: () => void;
  todayDailyTasks: DailyTask[];
  todaySideQuests: SideQuest[];
  todayCompletedCount: number;
  newlyUnlocked: Achievement[];
  clearNewlyUnlocked: () => void;
}

export const AppContext = createContext<AppContextType | null>(null);
