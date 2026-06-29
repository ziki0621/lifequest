import { useState, useEffect, useCallback, type ReactNode } from "react";
import type { AppState, MainQuest, QuestStage, DailyTask, SideQuest, JournalEntry, Achievement, CompletionContext, LifeAttribute } from "./types";
import { AppContext } from "./context";
import { createDefaultAppState } from "./data/defaultData";
import { loadAppState, saveAppState, resetAppState } from "./utils/storage";
import { localTimestamp, today, isDailyTaskDue } from "./utils/date";
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

  useEffect(() => { saveAppState(state); }, [state]);

  // ── Shared reward application ──
  const applyRewards = useCallback((prev: AppState, expReward: number, attributeRewards: { attribute: string; exp: number }[]) => {
    const totalExp = prev.player.totalExp + expReward;
    const newLevel = calcLevel(totalExp);
    const newAttrs = { ...prev.player.attributes };
    attributeRewards.forEach((ar) => {
      const cur = newAttrs[ar.attribute as keyof typeof newAttrs];
      if (!cur) return;
      const newExp = cur.exp + ar.exp;
      newAttrs[ar.attribute as keyof typeof newAttrs] = { level: calcAttributeLevel(newExp), exp: newExp };
    });
    return {
      ...prev.player,
      totalExp, level: newLevel, title: getPlayerTitle(newLevel), attributes: newAttrs,
    };
  }, []);

  const processUnlocks = useCallback((newState: AppState) => {
    const { achievements, newlyUnlocked: unlocked } = checkAchievements(newState);
    newState.achievements = achievements;
    if (unlocked.length > 0) {
      newState.player.unlockedAchievements = [...newState.player.unlockedAchievements, ...unlocked.map((a) => a.id)];
      setTimeout(() => setNewlyUnlocked(unlocked), 100);
    }
  }, []);

  // ── Complete actions (return CompletionContext for modal) ──

  const completeMainStage = useCallback((mainQuestId: string, stageId: string): CompletionContext | null => {
    let ctx: CompletionContext | null = null;
    setState((prev) => {
      const mq = prev.mainQuests.find((q) => q.id === mainQuestId);
      if (!mq) return prev;
      const stageIdx = mq.stages.findIndex((s) => s.id === stageId);
      if (stageIdx === -1 || mq.stages[stageIdx].completed) return prev;
      // Only allow completing the first uncompleted stage
      const firstUncompleted = mq.stages.findIndex((s) => !s.completed);
      if (stageIdx !== firstUncompleted) return prev;

      const completedAt = localTimestamp();
      const newStages = mq.stages.map((s, i) => i === stageIdx ? { ...s, completed: true, completedAt } : s);
      const allDone = newStages.every((s) => s.completed);
      const newMqs = prev.mainQuests.map((q) => q.id === mainQuestId ? {
        ...q, stages: newStages, status: allDone ? "completed" as const : q.status,
      } : q);

      // Rewards from stage difficulty (use easy/normal/hard based on stage order)
      const difficulties: Array<"easy" | "normal" | "hard"> = ["easy", "normal"];
      const diff = difficulties[stageIdx] || "normal";
      const expMap = { easy: 15, normal: 25, hard: 35 };
      const expReward = expMap[diff];
      const stage = mq.stages[stageIdx];
      const attrMap: Record<string, LifeAttribute> = {
        body: "stamina", mind: "mind", relationship: "connection", home: "order",
        exploration: "perception", interest: "creativity", learning: "knowledge",
        career: "order", finance: "order",
      };
      const attributeRewards = [{ attribute: attrMap[mq.domain] || "mind", exp: expReward }];

      const newState = { ...prev, mainQuests: newMqs, player: applyRewards(prev, expReward, attributeRewards) };
      processUnlocks(newState);
      ctx = { itemType: "mainStage" as const, title: stage.title, expReward, attributeRewards };
      return newState;
    });
    return ctx;
  }, [applyRewards, processUnlocks]);

  const completeDailyTask = useCallback((dailyTaskId: string): CompletionContext | null => {
    let ctx: CompletionContext | null = null;
    setState((prev) => {
      const dt = prev.dailyTasks.find((d) => d.id === dailyTaskId);
      if (!dt || !dt.active) return prev;
      const t = today();
      const newDailys = prev.dailyTasks.map((d) => d.id === dailyTaskId ? { ...d, completions: [...d.completions, t] } : d);
      const newState = { ...prev, dailyTasks: newDailys, player: applyRewards(prev, dt.expReward, dt.attributeRewards) };
      processUnlocks(newState);
      ctx = { itemType: "daily" as const, title: dt.title, expReward: dt.expReward, attributeRewards: dt.attributeRewards };
      return newState;
    });
    return ctx;
  }, [applyRewards, processUnlocks]);

  const completeSideQuest = useCallback((sideQuestId: string): CompletionContext | null => {
    let ctx: CompletionContext | null = null;
    setState((prev) => {
      const sq = prev.sideQuests.find((s) => s.id === sideQuestId);
      if (!sq || sq.completed) return prev;
      const completedAt = localTimestamp();
      const newSides = prev.sideQuests.map((s) => s.id === sideQuestId ? { ...s, completed: true, completedAt } : s);
      const newState = { ...prev, sideQuests: newSides, player: applyRewards(prev, sq.expReward, sq.attributeRewards) };
      processUnlocks(newState);
      ctx = { itemType: "sideQuest" as const, title: sq.title, expReward: sq.expReward, attributeRewards: sq.attributeRewards };
      return newState;
    });
    return ctx;
  }, [applyRewards, processUnlocks]);

  // ── Creation actions ──

  const addJournal = useCallback((entry: Omit<JournalEntry, "id" | "createdAt">) => {
    setState((prev) => {
      const newEntry: JournalEntry = { ...entry, id: genId(), createdAt: new Date().toISOString() };
      const newState = { ...prev, journalEntries: [...prev.journalEntries, newEntry] };
      processUnlocks(newState);
      return newState;
    });
  }, [processUnlocks]);

  const addMainQuest = useCallback((mq: Omit<MainQuest, "id" | "createdAt">) => {
    setState((prev) => ({
      ...prev,
      mainQuests: [...prev.mainQuests, { ...mq, id: genId(), createdAt: new Date().toISOString() }],
    }));
  }, []);

  const addMainStage = useCallback((mainQuestId: string, stage: Omit<QuestStage, "id">) => {
    setState((prev) => ({
      ...prev,
      mainQuests: prev.mainQuests.map((q) => q.id === mainQuestId ? {
        ...q,
        stages: [...q.stages, { ...stage, id: genId() }],
      } : q),
    }));
  }, []);

  const addDailyTask = useCallback((dt: Omit<DailyTask, "id" | "createdAt" | "completions">) => {
    setState((prev) => ({
      ...prev,
      dailyTasks: [...prev.dailyTasks, { ...dt, id: genId(), completions: [], createdAt: new Date().toISOString() }],
    }));
  }, []);

  const addSideQuest = useCallback((sq: Omit<SideQuest, "id" | "createdAt" | "completed" | "completedAt">) => {
    setState((prev) => ({
      ...prev,
      sideQuests: [...prev.sideQuests, { ...sq, id: genId(), completed: false, createdAt: new Date().toISOString() }],
    }));
  }, []);

  const toggleDailyActive = useCallback((id: string) => {
    setState((prev) => ({
      ...prev,
      dailyTasks: prev.dailyTasks.map((d) => d.id === id ? { ...d, active: !d.active } : d),
    }));
  }, []);

  const resetData = useCallback(() => {
    resetAppState();
    setState(createDefaultAppState());
    setNewlyUnlocked([]);
  }, []);

  const clearNewlyUnlocked = useCallback(() => setNewlyUnlocked([]), []);

  // ── Computed ──
  const t = today();
  const todayDailyTasks = state.dailyTasks.filter((dt) => isDailyTaskDue(dt.completions, dt.period, dt.targetCount, dt.active, t, dt.daysOfWeek, dt.timesPerDay));
  const todaySideQuests = state.sideQuests.filter((sq) => !sq.completed);
  const todayCompletedCount =
    state.dailyTasks.reduce((sum, dt) => sum + dt.completions.filter((c) => c === t).length, 0) +
    state.mainQuests.reduce((sum, mq) => sum + mq.stages.filter((s) => s.completed && s.completedAt?.startsWith(t)).length, 0) +
    state.sideQuests.filter((sq) => sq.completed && sq.completedAt?.startsWith(t)).length;

  return (
    <AppContext.Provider value={{
      state, completeMainStage, completeDailyTask, completeSideQuest,
      addJournal, addMainQuest, addMainStage, addDailyTask, addSideQuest,
      toggleDailyActive, resetData,
      todayDailyTasks, todaySideQuests, todayCompletedCount,
      newlyUnlocked, clearNewlyUnlocked,
    }}>
      {children}
    </AppContext.Provider>
  );
}
