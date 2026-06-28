import { createContext } from "react";
import type { Achievement, AppState, JournalEntry, QuestLine, Task } from "./types";

export interface AppContextType {
  state: AppState;
  completeTask: (taskId: string) => void;
  addJournal: (entry: Omit<JournalEntry, "id" | "createdAt">) => void;
  addTask: (task: Omit<Task, "id" | "createdAt" | "completed" | "completedAt">) => void;
  addQuestLine: (ql: Omit<QuestLine, "id" | "createdAt">) => void;
  resetData: () => void;
  todayTasks: Task[];
  todayCompletedTasks: Task[];
  newlyUnlocked: Achievement[];
  clearNewlyUnlocked: () => void;
}

export const AppContext = createContext<AppContextType | null>(null);
