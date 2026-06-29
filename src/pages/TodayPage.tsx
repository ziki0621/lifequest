import { useState, useCallback, useRef, useEffect } from "react";
import { Zap, Plus, Target, CheckCircle2, ListTodo } from "lucide-react";
import { useApp } from "../hooks/useApp";
import DailyTaskCard from "../components/DailyTaskCard";
import SideQuestCard from "../components/SideQuestCard";
import CompleteTaskModal from "../components/CompleteTaskModal";
import CreateDailyTaskModal from "../components/CreateDailyTaskModal";
import CreateSideQuestModal from "../components/CreateSideQuestModal";
import CreateMainQuestModal from "../components/CreateMainQuestModal";
import type { CompletionContext, Mood, EnergyLevel } from "../types";
import { readableDate, today, daysSince } from "../utils/date";

export default function TodayPage() {
  const { state, completeMainStage, completeDailyTask, completeSideQuest,
    addJournal, addMainQuest, addDailyTask, addSideQuest, toggleDailyActive,
    todayDailyTasks, todaySideQuests, todayCompletedCount } = useApp();

  const [completionCtx, setCompletionCtx] = useState<CompletionContext | null>(null);
  const [showFab, setShowFab] = useState(false);
  const [createModal, setCreateModal] = useState<"main" | "daily" | "side" | null>(null);
  const fabRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (fabRef.current && !fabRef.current.contains(e.target as Node)) setShowFab(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Get active main quest stages (first uncompleted of each active quest)
  const activeStages = state.mainQuests
    .filter((q) => q.status === "active")
    .map((q) => {
      const stage = q.stages.find((s) => !s.completed);
      return stage ? { quest: q, stage } : null;
    })
    .filter(Boolean) as { quest: typeof state.mainQuests[0]; stage: typeof state.mainQuests[0]["stages"][0] }[];

  const handleMainStageComplete = useCallback((mqId: string, sId: string) => {
    const ctx = completeMainStage(mqId, sId);
    if (ctx) setCompletionCtx(ctx);
  }, [completeMainStage]);

  const handleDailyComplete = useCallback((id: string) => {
    const ctx = completeDailyTask(id);
    if (ctx) setCompletionCtx(ctx);
  }, [completeDailyTask]);

  const handleSideComplete = useCallback((id: string) => {
    const ctx = completeSideQuest(id);
    if (ctx) setCompletionCtx(ctx);
  }, [completeSideQuest]);

  const handleSaveJournal = useCallback((content: string, mood: Mood, energy: EnergyLevel) => {
    if (completionCtx && content.trim()) {
      addJournal({ date: today(), mood, energy, content: content.trim(), tags: [] });
    }
    setCompletionCtx(null);
  }, [completionCtx, addJournal]);

  const earthDays = daysSince(state.player.startDate);
  const status = todayCompletedCount >= 3 ? "今天过得不错" : todayCompletedCount >= 1 ? "已经开始行动了" : "适合轻量推进";

  return (
    <div className="space-y-10 pb-24 animate-in">
      {/* Hero */}
      <div className="pt-2 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <p className="text-coral font-bold text-xs tracking-widest uppercase mb-2">今天是你来到地球的第 {earthDays} 天</p>
          <h2 className="text-3xl md:text-4xl font-black text-navy tracking-tight serif leading-tight">
            {todayCompletedCount > 0 ? "用心经营你的日常生活" : "选择一个小任务开始"}
          </h2>
          <p className="text-[11px] font-bold text-navy/40 uppercase tracking-widest mt-2">{readableDate(today())} · {status}</p>
        </div>
        <div className="glass rounded-full px-5 py-2.5 flex items-center gap-2">
          <Zap size={16} className="text-coral" />
          <span className="font-black text-navy text-sm">{state.player.totalExp} XP</span>
        </div>
      </div>

      {/* 主线当前阶段 */}
      {activeStages.length > 0 && (
        <section>
          <div className="flex items-center gap-3 mb-3">
            <Target size={14} className="text-navy" />
            <h3 className="text-[11px] font-bold text-navy/40 uppercase tracking-widest">主线推进</h3>
            <div className="flex-1 h-px bg-navy/5" />
          </div>
          <div className="space-y-2 stagger-1">
            {activeStages.map(({ quest, stage }) => (
              <div key={stage.id} className="glass rounded-3xl p-4 transition-all hover:-translate-y-0.5">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <span className="text-[9px] font-bold text-navy/30 uppercase tracking-widest">{quest.title}</span>
                    <h4 className="text-[14px] font-black text-navy">{stage.title}</h4>
                    {stage.description && <p className="text-[10px] text-navy/40 mt-0.5">{stage.description}</p>}
                  </div>
                  <button onClick={() => handleMainStageComplete(quest.id, stage.id)}
                    className="btn btn-primary !py-2 !px-5 !text-[10px] flex-shrink-0">
                    完成
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 日常任务 */}
      {todayDailyTasks.length > 0 && (
        <section>
          <div className="flex items-center gap-3 mb-3">
            <ListTodo size={14} className="text-coral" />
            <h3 className="text-[11px] font-bold text-navy/40 uppercase tracking-widest">今日日常</h3>
            <div className="flex-1 h-px bg-navy/5" />
          </div>
          <div className="space-y-2 stagger-1">
            {todayDailyTasks.map((dt) => (
              <DailyTaskCard key={dt.id} task={dt} onComplete={handleDailyComplete} onToggle={toggleDailyActive} />
            ))}
          </div>
        </section>
      )}

      {/* 支线任务 */}
      {todaySideQuests.length > 0 && (
        <section>
          <div className="flex items-center gap-3 mb-3">
            <CheckCircle2 size={14} className="text-leaf" />
            <h3 className="text-[11px] font-bold text-navy/40 uppercase tracking-widest">支线任务</h3>
            <div className="flex-1 h-px bg-navy/5" />
          </div>
          <div className="space-y-2 stagger-1">
            {todaySideQuests.slice(0, 5).map((sq) => (
              <SideQuestCard key={sq.id} quest={sq} onComplete={handleSideComplete} />
            ))}
          </div>
        </section>
      )}

      {/* Empty state */}
      {activeStages.length === 0 && todayDailyTasks.length === 0 && todaySideQuests.length === 0 && (
        <div className="glass rounded-3xl p-10 text-center">
          <p className="text-navy/40 font-bold text-xs tracking-widest uppercase">今天还没有任务</p>
          <p className="text-navy/30 text-[11px] font-medium mt-1">可以为自己安排一个很小的生活行动。</p>
        </div>
      )}

      {/* FAB */}
      <div ref={fabRef} className="fixed bottom-20 md:bottom-6 right-4 md:right-6 z-40">
        {showFab && (
          <div className="absolute bottom-14 right-0 flex flex-col gap-2 mb-2 animate-scale">
            <button onClick={() => { setCreateModal("main"); setShowFab(false); }}
              className="btn btn-primary !py-2 !px-4 !text-[10px] whitespace-nowrap shadow-lg">
              <Target size={13} /> 新建主线
            </button>
            <button onClick={() => { setCreateModal("daily"); setShowFab(false); }}
              className="btn btn-accent !py-2 !px-4 !text-[10px] whitespace-nowrap shadow-lg">
              <ListTodo size={13} /> 新建日常
            </button>
            <button onClick={() => { setCreateModal("side"); setShowFab(false); }}
              className="btn btn-primary !bg-leaf !py-2 !px-4 !text-[10px] whitespace-nowrap shadow-lg">
              <CheckCircle2 size={13} /> 新建支线
            </button>
          </div>
        )}
        <button onClick={() => setShowFab(!showFab)}
          className="w-12 h-12 bg-navy text-white rounded-full shadow-xl shadow-navy/30 flex items-center justify-center transition-all hover:scale-105 active:scale-95">
          <Plus size={20} strokeWidth={2.5} />
        </button>
      </div>

      {completionCtx && (
        <CompleteTaskModal ctx={completionCtx} onClose={() => setCompletionCtx(null)} onSaveJournal={handleSaveJournal} />
      )}
      {createModal === "main" && <CreateMainQuestModal onClose={() => setCreateModal(null)} onCreate={addMainQuest} />}
      {createModal === "daily" && <CreateDailyTaskModal onClose={() => setCreateModal(null)} onCreate={addDailyTask} />}
      {createModal === "side" && <CreateSideQuestModal mainQuests={state.mainQuests} onClose={() => setCreateModal(null)} onCreate={addSideQuest} />}
    </div>
  );
}
