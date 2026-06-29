import { useState, useEffect, useCallback, type ReactNode } from "react";
import type { AppState, MainQuest, QuestStage, DailyTask, SideQuest, JournalEntry, Achievement, CompletionContext, AttributeReward, QuestPlanDraft } from "./types";
import { AppContext } from "./context";
import { createDefaultAppState } from "./data/defaultData";
import { loadAppState, saveAppState, resetAppState } from "./utils/storage";
import { localTimestamp, today, isDailyTaskDue } from "./utils/date";
import { checkAchievements } from "./utils/achievements";
import { calcLevel, getPlayerTitle, calcAttributeLevel, getMainStageReward } from "./utils/exp";
import { genId } from "./utils/id";
import { loadTheme, saveTheme, getTheme } from "./utils/theme";

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>(() => {
    const saved = loadAppState();
    return saved ?? createDefaultAppState();
  });
  const [newlyUnlocked, setNewlyUnlocked] = useState<Achievement[]>([]);
  const [themeId, setThemeId] = useState<string>(loadTheme);
  const theme = getTheme(themeId);
  const [undoState, setUndoState] = useState<{ label: string; previousState: AppState } | null>(null);

  const setTheme = useCallback((id: string) => {
    setThemeId(id);
    saveTheme(id);
  }, []);

  useEffect(() => { saveAppState(state); }, [state]);

  // ── Undo helper ──
  const pushUndo = useCallback((label: string, previousState: AppState) => {
    setUndoState({ label, previousState });
    setTimeout(() => setUndoState((cur) => cur?.previousState === previousState ? null : cur), 6000);
  }, []);

  // ── Shared reward application ──
  const applyRewards = useCallback((prev: AppState, expReward: number, attributeRewards: AttributeReward[]) => {
    const totalExp = prev.player.totalExp + expReward;
    const newLevel = calcLevel(totalExp);
    const newAttrs = { ...prev.player.attributes };
    attributeRewards.forEach((ar) => {
      const cur = newAttrs[ar.attribute];
      const newExp = cur.exp + ar.exp;
      newAttrs[ar.attribute] = { level: calcAttributeLevel(newExp), exp: newExp };
    });
    return {
      ...prev.player,
      totalExp, level: newLevel, title: getPlayerTitle(newLevel), attributes: newAttrs,
    };
  }, []);

  const applyAchievementUpdates = useCallback((s: AppState): AppState => {
    const { achievements, newlyUnlocked: unlocked } = checkAchievements(s);
    const existing = new Set(s.player.unlockedAchievements);
    const newIds = unlocked.map((a) => a.id).filter((id) => !existing.has(id));
    if (unlocked.length > 0) setTimeout(() => setNewlyUnlocked(unlocked), 100);
    return {
      ...s,
      achievements,
      player: {
        ...s.player,
        unlockedAchievements: [...s.player.unlockedAchievements, ...newIds],
      },
    };
  }, []);

  // ── Complete actions ──

  const completeMainStage = useCallback((mainQuestId: string, stageId: string): CompletionContext | null => {
    let ctx: CompletionContext | null = null;
    setState((prev) => {
      const mq = prev.mainQuests.find((q) => q.id === mainQuestId);
      if (!mq) return prev;
      const stageIdx = mq.stages.findIndex((s) => s.id === stageId);
      if (stageIdx === -1 || mq.stages[stageIdx].completed) return prev;
      const firstUncompleted = mq.stages.findIndex((s) => !s.completed);
      if (stageIdx !== firstUncompleted) return prev;
      const completedAt = localTimestamp();
      const newStages = mq.stages.map((s, i) => i === stageIdx ? { ...s, completed: true, completedAt } : s);
      const allDone = newStages.every((s) => s.completed);
      const newMqs = prev.mainQuests.map((q) => q.id === mainQuestId ? { ...q, stages: newStages, status: allDone ? "completed" as const : q.status } : q);
      const stage = mq.stages[stageIdx];
      const { expReward, attributeRewards } = getMainStageReward(mq, stageIdx);
      ctx = { itemType: "mainStage" as const, itemId: stage.id, title: stage.title, expReward, attributeRewards };
      return applyAchievementUpdates({ ...prev, mainQuests: newMqs, player: applyRewards(prev, expReward, attributeRewards) });
    });
    return ctx;
  }, [applyRewards, applyAchievementUpdates]);

  const completeDailyTask = useCallback((dailyTaskId: string): CompletionContext | null => {
    let ctx: CompletionContext | null = null;
    setState((prev) => {
      const dt = prev.dailyTasks.find((d) => d.id === dailyTaskId);
      if (!dt || !dt.active) return prev;
      const t = today();
      if (!isDailyTaskDue(dt.completions, dt.period, dt.targetCount, dt.active, t, dt.daysOfWeek, dt.timesPerDay)) return prev;
      ctx = { itemType: "daily" as const, itemId: dt.id, title: dt.title, expReward: dt.expReward, attributeRewards: dt.attributeRewards };
      const newDailys = prev.dailyTasks.map((d) => d.id === dailyTaskId ? { ...d, completions: [...d.completions, t] } : d);
      return applyAchievementUpdates({ ...prev, dailyTasks: newDailys, player: applyRewards(prev, dt.expReward, dt.attributeRewards) });
    });
    return ctx;
  }, [applyRewards, applyAchievementUpdates]);

  const completeSideQuest = useCallback((sideQuestId: string): CompletionContext | null => {
    let ctx: CompletionContext | null = null;
    setState((prev) => {
      const sq = prev.sideQuests.find((s) => s.id === sideQuestId);
      if (!sq || sq.completed) return prev;
      const completedAt = localTimestamp();
      ctx = { itemType: "sideQuest" as const, itemId: sq.id, title: sq.title, expReward: sq.expReward, attributeRewards: sq.attributeRewards };
      const newSides = prev.sideQuests.map((s) => s.id === sideQuestId ? { ...s, completed: true, completedAt } : s);
      return applyAchievementUpdates({ ...prev, sideQuests: newSides, player: applyRewards(prev, sq.expReward, sq.attributeRewards) });
    });
    return ctx;
  }, [applyRewards, applyAchievementUpdates]);

  // ── Creation actions ──

  const addJournal = useCallback((entry: Omit<JournalEntry, "id" | "createdAt">) => {
    setState((prev) => {
      const newEntry: JournalEntry = { ...entry, id: genId(), createdAt: new Date().toISOString() };
      return applyAchievementUpdates({ ...prev, journalEntries: [...prev.journalEntries, newEntry] });
    });
  }, [applyAchievementUpdates]);

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

  const updateMainQuest = useCallback((id: string, mq: Partial<MainQuest>) => {
    setState((prev) => ({ ...prev, mainQuests: prev.mainQuests.map((q) => q.id === id ? { ...q, ...mq } : q) }));
  }, []);
  const updateDailyTask = useCallback((id: string, dt: Partial<DailyTask>) => {
    setState((prev) => ({ ...prev, dailyTasks: prev.dailyTasks.map((d) => d.id === id ? { ...d, ...dt } : d) }));
  }, []);
  const updateSideQuest = useCallback((id: string, sq: Partial<SideQuest>) => {
    setState((prev) => ({ ...prev, sideQuests: prev.sideQuests.map((s) => s.id === id ? { ...s, ...sq } : s) }));
  }, []);

  // ── Quest Plan ──
  const applyQuestPlan = useCallback((plan: QuestPlanDraft) => {
    setState((prev) => {
      const now = new Date().toISOString();
      const mainId = genId();
      const mainQuest: MainQuest = {
        ...plan.mainQuest, id: mainId, createdAt: now,
        stages: plan.mainQuest.stages.map((stage, index) => ({ ...stage, id: genId(), completed: false, completedAt: undefined, order: index })),
      };
      const dailyTasks: DailyTask[] = plan.dailyTasks.map((task) => ({ ...task, id: genId(), completions: [], createdAt: now }));
      const sideQuests: SideQuest[] = plan.sideQuests.map((quest) => ({
        ...quest, id: genId(), createdAt: now, completed: false, completedAt: undefined,
        mainQuestId: quest.mainQuestId === "__new_main__" ? mainId : quest.mainQuestId,
      }));
      return { ...prev, mainQuests: [...prev.mainQuests, mainQuest], dailyTasks: [...prev.dailyTasks, ...dailyTasks], sideQuests: [...prev.sideQuests, ...sideQuests] };
    });
  }, []);

  // ── Archive / Delete / Undo ──
  const archiveMainQuest = useCallback((id: string) => {
    setState((prev) => { pushUndo("已归档主线任务", prev); return { ...prev, mainQuests: prev.mainQuests.map((q) => q.id === id ? { ...q, archived: true, archivedAt: new Date().toISOString() } : q) }; });
  }, [pushUndo]);
  const archiveDailyTask = useCallback((id: string) => {
    setState((prev) => { pushUndo("已归档日常任务", prev); return { ...prev, dailyTasks: prev.dailyTasks.map((d) => d.id === id ? { ...d, archived: true, archivedAt: new Date().toISOString(), active: false } : d) }; });
  }, [pushUndo]);
  const archiveSideQuest = useCallback((id: string) => {
    setState((prev) => { pushUndo("已归档支线任务", prev); return { ...prev, sideQuests: prev.sideQuests.map((s) => s.id === id ? { ...s, archived: true, archivedAt: new Date().toISOString() } : s) }; });
  }, [pushUndo]);
  const deleteMainQuest = useCallback((id: string) => {
    setState((prev) => { pushUndo("已删除主线任务", prev); return { ...prev, mainQuests: prev.mainQuests.filter((q) => q.id !== id) }; });
  }, [pushUndo]);
  const deleteDailyTask = useCallback((id: string) => {
    setState((prev) => { pushUndo("已删除日常任务", prev); return { ...prev, dailyTasks: prev.dailyTasks.filter((d) => d.id !== id) }; });
  }, [pushUndo]);
  const deleteSideQuest = useCallback((id: string) => {
    setState((prev) => { pushUndo("已删除支线任务", prev); return { ...prev, sideQuests: prev.sideQuests.filter((s) => s.id !== id) }; });
  }, [pushUndo]);
  const undoLastMutation = useCallback(() => {
    if (!undoState) return; setState(undoState.previousState); setUndoState(null);
  }, [undoState]);

  const resetData = useCallback(() => {
    resetAppState();
    setState(createDefaultAppState());
    setNewlyUnlocked([]);
  }, []);

  const clearNewlyUnlocked = useCallback(() => setNewlyUnlocked([]), []);

  // ── Computed ──
  const t = today();
  const todayDailyTasks = state.dailyTasks.filter((dt) => !dt.archived && isDailyTaskDue(dt.completions, dt.period, dt.targetCount, dt.active, t, dt.daysOfWeek, dt.timesPerDay));
  const todaySideQuests = state.sideQuests.filter((sq) => !sq.completed && !sq.archived);
  const todayCompletedCount =
    state.dailyTasks.reduce((sum, dt) => sum + dt.completions.filter((c) => c === t).length, 0) +
    state.mainQuests.reduce((sum, mq) => sum + mq.stages.filter((s) => s.completed && s.completedAt?.startsWith(t)).length, 0) +
    state.sideQuests.filter((sq) => sq.completed && sq.completedAt?.startsWith(t)).length;

  return (
    <AppContext.Provider value={{
      state, completeMainStage, completeDailyTask, completeSideQuest,
      addJournal, addMainQuest, addMainStage, addDailyTask, addSideQuest,
      updateMainQuest, updateDailyTask, updateSideQuest,
      toggleDailyActive, applyQuestPlan,
      archiveMainQuest, archiveDailyTask, archiveSideQuest,
      deleteMainQuest, deleteDailyTask, deleteSideQuest,
      undoLastMutation, lastUndoLabel: undoState?.label ?? null,
      resetData,
      todayDailyTasks, todaySideQuests, todayCompletedCount,
      theme, setTheme,
      newlyUnlocked, clearNewlyUnlocked,
    }}>
      {children}
    </AppContext.Provider>
  );
}
