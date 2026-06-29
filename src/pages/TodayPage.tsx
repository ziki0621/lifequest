import { useState, useCallback, useRef, useEffect } from "react";
import { Plus, Target, CheckCircle2, ListTodo } from "lucide-react";
import { useApp } from "../hooks/useApp";
import DailyTaskCard from "../components/DailyTaskCard";
import CompleteTaskModal from "../components/CompleteTaskModal";
import CreateDailyTaskModal from "../components/CreateDailyTaskModal";
import CreateSideQuestModal from "../components/CreateSideQuestModal";
import CreateMainQuestModal from "../components/CreateMainQuestModal";
import type { CompletionContext, Mood, EnergyLevel } from "../types";
import { today } from "../utils/date";

export default function TodayPage() {
  const { state, completeMainStage, completeDailyTask, completeSideQuest,
    addJournal, addMainQuest, addDailyTask, addSideQuest, toggleDailyActive,
    todayDailyTasks, todaySideQuests } = useApp();

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
      addJournal({ date: today(), taskId: completionCtx.itemId, mood, energy, content: content.trim(), tags: [] });
    }
    setCompletionCtx(null);
  }, [completionCtx, addJournal]);

  const isEmpty = activeStages.length === 0 && todayDailyTasks.length === 0 && todaySideQuests.length === 0;

  return (
    <div className="space-y-6 pb-24 animate-in">

      {isEmpty ? (
        <div className="glass rounded-3xl p-10 text-center">
          <p className="text-navy/40 font-bold text-xs tracking-widest uppercase">今天还没有任务</p>
          <p className="text-navy/30 text-[11px] font-medium mt-1">可以为自己安排一个很小的生活行动。</p>
        </div>
      ) : (
        <>
          {/* ── 主线面板 ── */}
          <PanelShell
            icon={<Target size={15} />}
            title="主线推进"
            accent="border-navy/10"
            accentBar="bg-navy"
            badge={`${activeStages.length} 条`}
            onAdd={() => setCreateModal("main")}
          >
            {activeStages.length === 0 ? (
              <PanelEmpty>暂无进行中的主线阶段。</PanelEmpty>
            ) : (
              activeStages.map(({ quest, stage }) => (
                <SubFrame key={stage.id}>
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <span className="text-[9px] font-bold text-navy/25 uppercase tracking-widest">{quest.title}</span>
                      <h4 className="text-[13px] font-black text-navy mt-0.5">{stage.title}</h4>
                      {stage.description && (
                        <p className="text-[10px] text-navy/35 mt-0.5 line-clamp-1">{stage.description}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      {stage.anchorDate && (
                        <span className="text-[9px] text-navy/25 font-mono">{stage.anchorDate}</span>
                      )}
                      <button onClick={() => handleMainStageComplete(quest.id, stage.id)}
                        className="btn btn-primary !py-1.5 !px-4 !text-[10px] !tracking-widest flex-shrink-0">
                        <CheckCircle2 size={12} /> 完成
                      </button>
                    </div>
                  </div>
                </SubFrame>
              ))
            )}
          </PanelShell>

          {/* ── 日常面板 ── */}
          <PanelShell
            icon={<ListTodo size={15} />}
            title="今日日常"
            accent="border-coral/15"
            accentBar="bg-coral"
            badge={`${todayDailyTasks.filter((dt) => dt.active).length} 项`}
            onAdd={() => setCreateModal("daily")}
          >
            {todayDailyTasks.length === 0 ? (
              <PanelEmpty>今天没有需要打卡的日常。</PanelEmpty>
            ) : (
              todayDailyTasks.map((dt) => (
                <DailyTaskCard key={dt.id} task={dt} onComplete={handleDailyComplete} onToggle={toggleDailyActive} />
              ))
            )}
          </PanelShell>

          {/* ── 支线面板 ── */}
          <PanelShell
            icon={<CheckCircle2 size={15} />}
            title="支线任务"
            accent="border-leaf/15"
            accentBar="bg-leaf"
            badge={`${todaySideQuests.length} 项`}
            onAdd={() => setCreateModal("side")}
          >
            {todaySideQuests.length === 0 ? (
              <PanelEmpty>暂无待完成的支线任务。</PanelEmpty>
            ) : (
              todaySideQuests.slice(0, 6).map((sq) => (
                <SubFrame key={sq.id}>
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <h4 className="text-[13px] font-black text-navy">{sq.title}</h4>
                      {sq.description && (
                        <p className="text-[10px] text-navy/35 mt-0.5 line-clamp-1">{sq.description}</p>
                      )}
                    </div>
                    <button onClick={() => handleSideComplete(sq.id)}
                      className="btn btn-primary !py-1.5 !px-4 !text-[10px] !tracking-widest flex-shrink-0">
                      <CheckCircle2 size={12} /> 完成
                    </button>
                  </div>
                </SubFrame>
              ))
            )}
          </PanelShell>
        </>
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

// ── Panel layout primitives ──

function PanelShell({
  icon, title, accent, accentBar, badge, onAdd, children,
}: {
  icon: React.ReactNode; title: string; accent: string; accentBar: string;
  badge: string; onAdd: () => void; children: React.ReactNode;
}) {
  return (
    <section className={`glass rounded-3xl border ${accent} overflow-hidden`}>
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-navy/5">
        <div className="flex items-center gap-2.5">
          <div className={`w-1 h-4 rounded-full ${accentBar}`} />
          {icon}
          <h3 className="text-[11px] font-black text-navy uppercase tracking-widest">{title}</h3>
          <span className="text-[9px] font-bold text-navy/25 bg-navy/5 px-2 py-0.5 rounded-full">{badge}</span>
        </div>
        <button onClick={onAdd}
          className="flex items-center gap-1 text-[10px] font-bold text-navy/30 hover:text-navy transition-colors">
          <Plus size={13} /> 添加
        </button>
      </div>
      {/* Body */}
      <div className="p-3 space-y-2">
        {children}
      </div>
    </section>
  );
}

function SubFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-white/40 rounded-2xl border border-navy/5 p-3 transition-all duration-200 hover:border-navy/10 hover:bg-white/60">
      {children}
    </div>
  );
}

function PanelEmpty({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-center py-6">
      <p className="text-[10px] font-medium text-navy/25">{children}</p>
    </div>
  );
}
