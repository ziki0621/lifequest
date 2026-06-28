import {
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import type { AppState, Task, JournalEntry, QuestLine, Achievement } from "./types";
import { AppContext } from "./context";
import { createDefaultAppState } from "./data/defaultData";
import { loadAppState, saveAppState, resetAppState } from "./utils/storage";
import { localTimestamp, today } from "./utils/date";
import { checkAchievements } from "./utils/achievements";
import { calcLevel, getPlayerTitle, calcAttributeLevel } from "./utils/exp";
import { genId } from "./utils/id";

export { useApp } from "./hooks/useApp";

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>(() => {
    const saved = loadAppState();
    return saved ?? createDefaultAppState();
  });
  const [newlyUnlocked, setNewlyUnlocked] = useState<Achievement[]>([]);

  // Persist on every change
  useEffect(() => {
    saveAppState(state);
  }, [state]);

  const completeTask = useCallback(
    (taskId: string) => {
      setState((prev) => {
        const task = prev.tasks.find((t) => t.id === taskId);
        if (!task || task.completed) return prev;

        const completedAt = localTimestamp();
        const newState = {
          ...prev,
          tasks: prev.tasks.map((t) =>
            t.id === taskId ? { ...t, completed: true, completedAt } : t
          ),
        };
        // 更新经验和属性
        const totalExp = prev.player.totalExp + task.expReward;
        const newLevel = calcLevel(totalExp);
        const newAttrs = { ...prev.player.attributes };
        task.attributeRewards.forEach((ar) => {
          const cur = newAttrs[ar.attribute];
          const newExp = cur.exp + ar.exp;
          newAttrs[ar.attribute] = {
            level: calcAttributeLevel(newExp),
            exp: newExp,
          };
        });
        const updatedPlayer = {
          ...prev.player,
          totalExp,
          level: newLevel,
          title: getPlayerTitle(newLevel),
          attributes: newAttrs,
        };

        // Check achievements on the updated state
        const toCheck = { ...newState, player: updatedPlayer };
        const { achievements, newlyUnlocked: unlocked } = checkAchievements(toCheck);
        toCheck.achievements = achievements;
        if (unlocked.length > 0) {
          toCheck.player.unlockedAchievements = [
            ...toCheck.player.unlockedAchievements,
            ...unlocked.map((a) => a.id),
          ];
        }

        // Propagate unlocked to UI
        if (unlocked.length > 0) {
          setTimeout(() => setNewlyUnlocked(unlocked), 100);
        }

        return toCheck;
      });
    },
    []
  );

  const addJournal = useCallback(
    (entry: Omit<JournalEntry, "id" | "createdAt">) => {
      setState((prev) => {
        const newEntry: JournalEntry = {
          ...entry,
          id: genId(),
          createdAt: new Date().toISOString(),
        };
        const newState = {
          ...prev,
          journalEntries: [...prev.journalEntries, newEntry],
        };
        // Check achievements
        const { achievements, newlyUnlocked: unlocked } = checkAchievements(newState);
        newState.achievements = achievements;
        if (unlocked.length > 0) {
          newState.player = {
            ...newState.player,
            unlockedAchievements: [
              ...newState.player.unlockedAchievements,
              ...unlocked.map((a) => a.id),
            ],
          };
          setTimeout(() => setNewlyUnlocked(unlocked), 100);
        }
        return newState;
      });
    },
    []
  );

  const addTask = useCallback(
    (task: Omit<Task, "id" | "createdAt" | "completed" | "completedAt">) => {
      setState((prev) => ({
        ...prev,
        tasks: [
          ...prev.tasks,
          {
            ...task,
            id: genId(),
            createdAt: new Date().toISOString(),
            completed: false,
          },
        ],
      }));
    },
    []
  );

  const addQuestLine = useCallback(
    (ql: Omit<QuestLine, "id" | "createdAt">) => {
      setState((prev) => ({
        ...prev,
        questLines: [
          ...prev.questLines,
          { ...ql, id: genId(), createdAt: new Date().toISOString() },
        ],
      }));
    },
    []
  );

  const resetData = useCallback(() => {
    resetAppState();
    setState(createDefaultAppState());
    setNewlyUnlocked([]);
  }, []);

  const clearNewlyUnlocked = useCallback(() => setNewlyUnlocked([]), []);

  const t = today();
  const todayTasks = state.tasks.filter((task) => !task.dueDate || task.dueDate <= t);
  const todayCompletedTasks = todayTasks.filter((task) => task.completed && task.completedAt?.startsWith(t));

  return (
    <AppContext.Provider
      value={{
        state,
        completeTask,
        addJournal,
        addTask,
        addQuestLine,
        resetData,
        todayTasks,
        todayCompletedTasks,
        newlyUnlocked,
        clearNewlyUnlocked,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}
