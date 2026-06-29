import { createContext } from "react";
import type {
  AppState, JournalEntry, MainQuest, QuestStage, DailyTask, SideQuest,
  Achievement, CompletionContext,
} from "./types";

export interface AppContextType {
  state: AppState;
  completeMainStage: (mainQuestId: string, stageId: string) => CompletionContext | null;
  completeDailyTask: (dailyTaskId: string) => CompletionContext | null;
  completeSideQuest: (sideQuestId: string) => CompletionContext | null;
  addJournal: (entry: Omit<JournalEntry, "id" | "createdAt">) => void;
  addMainQuest: (mq: Omit<MainQuest, "id" | "createdAt">) => void;
  addMainStage: (mainQuestId: string, stage: Omit<QuestStage, "id">) => void;
  addDailyTask: (dt: Omit<DailyTask, "id" | "createdAt" | "completions">) => void;
  addSideQuest: (sq: Omit<SideQuest, "id" | "createdAt" | "completed" | "completedAt">) => void;
  toggleDailyActive: (id: string) => void;
  resetData: () => void;
  todayDailyTasks: DailyTask[];
  todaySideQuests: SideQuest[];
  todayCompletedCount: number;
  newlyUnlocked: Achievement[];
  clearNewlyUnlocked: () => void;
}

export const AppContext = createContext<AppContextType | null>(null);
