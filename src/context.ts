import { createContext } from "react";
import type {
  AppState, JournalEntry, QuestBook, QuestLine, QuestStage, DailyTask, SideQuest,
  Achievement, CompletionContext,
} from "./types";
import type { QuestPlanDraft } from "./types/agent";
import type { ThemeConfig } from "./utils/theme";

export interface AppContextType {
  state: AppState;
  theme: ThemeConfig;
  setTheme: (id: string) => void;

  completeQuestStage: (bookId: string, lineId: string, stageId: string) => CompletionContext | null;
  completeQuestBookTask: (bookId: string, taskId: string) => CompletionContext | null;
  completeDailyTask: (dailyTaskId: string) => CompletionContext | null;
  completeSideQuest: (sideQuestId: string) => CompletionContext | null;

  addJournal: (entry: Omit<JournalEntry, "id" | "createdAt">) => void;

  addQuestBook: (qb: Omit<QuestBook, "id" | "createdAt">) => void;
  addQuestLine: (bookId: string, ql: Omit<QuestLine, "id">) => void;
  addQuestStage: (bookId: string, lineId: string, stage: Omit<QuestStage, "id">) => void;
  addQuestBookTask: (bookId: string, task: Omit<QuestBook["directTasks"][0], "id">) => void;
  addDailyTask: (dt: Omit<DailyTask, "id" | "createdAt" | "completions">) => void;
  addSideQuest: (sq: Omit<SideQuest, "id" | "createdAt" | "completed" | "completedAt">) => void;

  updateQuestBook: (id: string, qb: Partial<QuestBook>) => void;
  updateDailyTask: (id: string, dt: Partial<DailyTask>) => void;
  updateSideQuest: (id: string, sq: Partial<SideQuest>) => void;
  toggleDailyActive: (id: string) => void;

  applyQuestPlan: (plan: QuestPlanDraft) => void;

  archiveQuestBook: (id: string) => void;
  archiveDailyTask: (id: string) => void;
  archiveSideQuest: (id: string) => void;
  deleteQuestBook: (id: string) => void;
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
