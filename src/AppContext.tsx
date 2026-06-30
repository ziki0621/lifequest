import { useState, useEffect, useCallback, type ReactNode } from "react";
import type { AppState, QuestBook, QuestLine, QuestStage, DailyTask, SideQuest, JournalEntry, Achievement, CompletionContext, AttributeReward } from "./types";
import type { QuestPlanDraft } from "./types/agent";
import { AppContext } from "./context";
import { createDefaultAppState } from "./data/defaultData";
import { loadAppState, saveAppState, resetAppState } from "./utils/storage";
import { localTimestamp, today, isDailyTaskDue } from "./utils/date";
import { checkAchievements } from "./utils/achievements";
import { calcLevel, getPlayerTitle, calcAttributeLevel, defaultAttributeRewards, difficultyExp, getStageReward } from "./utils/exp";
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

  const setThemeFn = useCallback((id: string) => { setThemeId(id); saveTheme(id); }, []);
  useEffect(() => { saveAppState(state); }, [state]);

  const pushUndo = useCallback((label: string, previousState: AppState) => {
    setUndoState({ label, previousState });
    setTimeout(() => setUndoState((cur) => cur?.previousState === previousState ? null : cur), 6000);
  }, []);

  const applyRewards = useCallback((prev: AppState, expReward: number, attributeRewards: AttributeReward[]) => {
    const totalExp = prev.player.totalExp + expReward;
    const newLevel = calcLevel(totalExp);
    const newAttrs = { ...prev.player.attributes };
    attributeRewards.forEach((ar) => {
      const cur = newAttrs[ar.attribute];
      const newExp = cur.exp + ar.exp;
      newAttrs[ar.attribute] = { level: calcAttributeLevel(newExp), exp: newExp };
    });
    return { ...prev.player, totalExp, level: newLevel, title: getPlayerTitle(newLevel), attributes: newAttrs };
  }, []);

  const applyAchievementUpdates = useCallback((s: AppState): AppState => {
    const { achievements, newlyUnlocked: unlocked } = checkAchievements(s);
    const existing = new Set(s.player.unlockedAchievements);
    const newIds = unlocked.map((a) => a.id).filter((id) => !existing.has(id));
    if (unlocked.length > 0) setTimeout(() => setNewlyUnlocked(unlocked), 100);
    return { ...s, achievements, player: { ...s.player, unlockedAchievements: [...s.player.unlockedAchievements, ...newIds] } };
  }, []);

  const recomputeQuestBookStatus = useCallback((book: QuestBook): QuestBook => {
    const allStagesDone = book.questLines.every((line) => line.stages.every((stage) => stage.completed));
    const directTasksDone = book.directTasks.every((task) => task.completed);
    return { ...book, status: allStagesDone && directTasksDone ? "completed" : book.status === "completed" ? "active" : book.status };
  }, []);

  // ── Complete actions ──

  const completeQuestStage = useCallback((bookId: string, lineId: string, stageId: string): CompletionContext | null => {
    let ctx: CompletionContext | null = null;
    setState((prev) => {
      const qb = prev.questBooks.find((q) => q.id === bookId);
      if (!qb) return prev;
      const ql = qb.questLines.find((l) => l.id === lineId);
      if (!ql) return prev;
      const stageIdx = ql.stages.findIndex((s) => s.id === stageId);
      if (stageIdx === -1 || ql.stages[stageIdx].completed) return prev;
      const firstUncompleted = ql.stages.findIndex((s) => !s.completed);
      if (stageIdx !== firstUncompleted) return prev;
      const completedAt = localTimestamp();
      const { expReward, attributeRewards: attrRewards } = getStageReward(qb, lineId, stageIdx);
      ctx = { itemType: "questStage" as const, itemId: stageId, title: ql.stages[stageIdx].title, expReward, attributeRewards: attrRewards };
      const newBooks = prev.questBooks.map((b) => b.id === bookId ? {
        ...recomputeQuestBookStatus({
          ...b,
          questLines: b.questLines.map((l) => l.id === lineId ? {
            ...l, stages: l.stages.map((s, i) => i === stageIdx ? { ...s, completed: true, completedAt } : s),
          } : l),
        }),
      } : b);
      return applyAchievementUpdates({ ...prev, questBooks: newBooks, player: applyRewards(prev, expReward, attrRewards) });
    });
    return ctx;
  }, [applyRewards, applyAchievementUpdates, recomputeQuestBookStatus]);

  const completeQuestBookTask = useCallback((bookId: string, taskId: string): CompletionContext | null => {
    let ctx: CompletionContext | null = null;
    setState((prev) => {
      const qb = prev.questBooks.find((q) => q.id === bookId);
      if (!qb) return prev;
      const task = qb.directTasks.find((t) => t.id === taskId);
      if (!task || task.completed) return prev;
      const completedAt = localTimestamp();
      const expReward = 10;
      const attrRewards = defaultAttributeRewards(qb.domain, expReward);
      ctx = { itemType: "questBookTask" as const, itemId: taskId, title: task.title, expReward, attributeRewards: attrRewards };
      const newBooks = prev.questBooks.map((b) => b.id === bookId ? {
        ...recomputeQuestBookStatus({
          ...b,
          directTasks: b.directTasks.map((t) => t.id === taskId ? { ...t, completed: true, completedAt } : t),
        }),
      } : b);
      return applyAchievementUpdates({ ...prev, questBooks: newBooks, player: applyRewards(prev, expReward, attrRewards) });
    });
    return ctx;
  }, [applyRewards, applyAchievementUpdates, recomputeQuestBookStatus]);

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

  const addQuestBook = useCallback((qb: Omit<QuestBook, "id" | "createdAt">) => {
    setState((prev) => ({ ...prev, questBooks: [...prev.questBooks, { ...qb, id: genId(), createdAt: new Date().toISOString() }] }));
  }, []);

  const addQuestLine = useCallback((bookId: string, ql: Omit<QuestLine, "id">) => {
    setState((prev) => ({ ...prev, questBooks: prev.questBooks.map((b) => b.id === bookId ? { ...b, questLines: [...b.questLines, { ...ql, id: genId() }] } : b) }));
  }, []);

  const addQuestStage = useCallback((bookId: string, lineId: string, stage: Omit<QuestStage, "id">) => {
    setState((prev) => ({ ...prev, questBooks: prev.questBooks.map((b) => b.id === bookId ? { ...b, questLines: b.questLines.map((l) => l.id === lineId ? { ...l, stages: [...l.stages, { ...stage, id: genId() }] } : l) } : b) }));
  }, []);

  const addQuestBookTask = useCallback((bookId: string, task: Omit<QuestBook["directTasks"][0], "id">) => {
    setState((prev) => ({ ...prev, questBooks: prev.questBooks.map((b) => b.id === bookId ? { ...b, directTasks: [...b.directTasks, { ...task, id: genId() }] } : b) }));
  }, []);

  const addDailyTask = useCallback((dt: Omit<DailyTask, "id" | "createdAt" | "completions">) => {
    setState((prev) => ({ ...prev, dailyTasks: [...prev.dailyTasks, { ...dt, id: genId(), completions: [], createdAt: new Date().toISOString() }] }));
  }, []);

  const addSideQuest = useCallback((sq: Omit<SideQuest, "id" | "createdAt" | "completed" | "completedAt">) => {
    setState((prev) => ({ ...prev, sideQuests: [...prev.sideQuests, { ...sq, id: genId(), completed: false, createdAt: new Date().toISOString() }] }));
  }, []);

  // ── Updates ──

  const toggleDailyActive = useCallback((id: string) => {
    setState((prev) => ({ ...prev, dailyTasks: prev.dailyTasks.map((d) => d.id === id ? { ...d, active: !d.active } : d) }));
  }, []);

  const updateQuestBook = useCallback((id: string, qb: Partial<QuestBook>) => {
    setState((prev) => ({ ...prev, questBooks: prev.questBooks.map((q) => q.id === id ? { ...q, ...qb } : q) }));
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
      let questBook: QuestBook | null = null;
      const additions: { dailyTasks: DailyTask[]; sideQuests: SideQuest[] } = { dailyTasks: [], sideQuests: [] };

      if (plan.mainQuest) {
        const qlId = genId();
        questBook = {
          id: genId(), title: plan.mainQuest.title, description: plan.mainQuest.description,
          domain: plan.mainQuest.domain, status: "active" as const, createdAt: now,
          questLines: [{
            id: qlId, title: plan.mainQuest.title,
            stages: plan.mainQuest.stages.map((s, i) => ({ id: genId(), title: s.title, description: s.description, anchorDate: s.anchorDate, completed: false, order: i })),
          }],
          directTasks: [],
        };
      }
      if (plan.dailyTasks?.length) {
        additions.dailyTasks = plan.dailyTasks.map((t) => {
          const exp = difficultyExp(t.difficulty);
          return { id: genId(), title: t.title, description: t.description, domain: t.domain, difficulty: t.difficulty, expReward: exp, attributeRewards: defaultAttributeRewards(t.domain, exp), period: t.period, targetCount: t.targetCount, daysOfWeek: t.daysOfWeek, timesPerDay: t.timesPerDay, active: true, completions: [], createdAt: now };
        });
      }
      if (plan.sideQuests?.length) {
        additions.sideQuests = plan.sideQuests.map((q) => {
          const exp = difficultyExp(q.difficulty);
          return { id: genId(), title: q.title, description: q.description, domain: q.domain, difficulty: q.difficulty, expReward: exp, attributeRewards: defaultAttributeRewards(q.domain, exp), dueDate: q.dueDate, completed: false, createdAt: now };
        });
      }
      return { ...prev, questBooks: questBook ? [...prev.questBooks, questBook] : prev.questBooks, dailyTasks: [...prev.dailyTasks, ...additions.dailyTasks], sideQuests: [...prev.sideQuests, ...additions.sideQuests] };
    });
  }, []);

  // ── Archive / Delete / Undo ──

  const archiveQuestBook = useCallback((id: string) => {
    setState((prev) => { pushUndo("已归档任务书", prev); return { ...prev, questBooks: prev.questBooks.map((q) => q.id === id ? { ...q, archived: true, archivedAt: new Date().toISOString() } : q) }; });
  }, [pushUndo]);
  const archiveDailyTask = useCallback((id: string) => {
    setState((prev) => { pushUndo("已归档日常任务", prev); return { ...prev, dailyTasks: prev.dailyTasks.map((d) => d.id === id ? { ...d, archived: true, archivedAt: new Date().toISOString(), active: false } : d) }; });
  }, [pushUndo]);
  const archiveSideQuest = useCallback((id: string) => {
    setState((prev) => { pushUndo("已归档支线任务", prev); return { ...prev, sideQuests: prev.sideQuests.map((s) => s.id === id ? { ...s, archived: true, archivedAt: new Date().toISOString() } : s) }; });
  }, [pushUndo]);
  const deleteQuestBook = useCallback((id: string) => {
    setState((prev) => { pushUndo("已删除任务书", prev); return { ...prev, questBooks: prev.questBooks.filter((q) => q.id !== id) }; });
  }, [pushUndo]);
  const deleteDailyTask = useCallback((id: string) => {
    setState((prev) => { pushUndo("已删除日常任务", prev); return { ...prev, dailyTasks: prev.dailyTasks.filter((d) => d.id !== id) }; });
  }, [pushUndo]);
  const deleteSideQuest = useCallback((id: string) => {
    setState((prev) => { pushUndo("已删除支线任务", prev); return { ...prev, sideQuests: prev.sideQuests.filter((s) => s.id !== id) }; });
  }, [pushUndo]);
  const undoLastMutation = useCallback(() => { if (!undoState) return; setState(undoState.previousState); setUndoState(null); }, [undoState]);

  const resetData = useCallback(() => { resetAppState(); setState(createDefaultAppState()); setNewlyUnlocked([]); }, []);
  const clearNewlyUnlocked = useCallback(() => setNewlyUnlocked([]), []);

  // ── Computed ──
  const t = today();
  const todayDailyTasks = state.dailyTasks.filter((dt) => !dt.archived && isDailyTaskDue(dt.completions, dt.period, dt.targetCount, dt.active, t, dt.daysOfWeek, dt.timesPerDay));
  const todaySideQuests = state.sideQuests.filter((sq) => !sq.completed && !sq.archived);
  const todayCompletedCount =
    state.dailyTasks.reduce((sum, dt) => sum + dt.completions.filter((c) => c === t).length, 0) +
    state.questBooks.reduce((sum, qb) => {
      let s = 0;
      qb.questLines.forEach((ql) => s += ql.stages.filter((st) => st.completed && st.completedAt?.startsWith(t)).length);
      qb.directTasks.forEach((dt) => { if (dt.completed && dt.completedAt?.startsWith(t)) s++; });
      return sum + s;
    }, 0) +
    state.sideQuests.filter((sq) => sq.completed && sq.completedAt?.startsWith(t)).length;

  return (
    <AppContext.Provider value={{
      state, completeQuestStage, completeQuestBookTask, completeDailyTask, completeSideQuest,
      addJournal, addQuestBook, addQuestLine, addQuestStage, addQuestBookTask, addDailyTask, addSideQuest,
      updateQuestBook, updateDailyTask, updateSideQuest,
      toggleDailyActive, applyQuestPlan,
      archiveQuestBook, archiveDailyTask, archiveSideQuest,
      deleteQuestBook, deleteDailyTask, deleteSideQuest,
      undoLastMutation, lastUndoLabel: undoState?.label ?? null,
      resetData,
      todayDailyTasks, todaySideQuests, todayCompletedCount,
      theme, setTheme: setThemeFn,
      newlyUnlocked, clearNewlyUnlocked,
    }}>
      {children}
    </AppContext.Provider>
  );
}
