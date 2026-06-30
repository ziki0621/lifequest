import { useState, useCallback, useRef, useEffect } from "react";
import { Plus, CheckCircle2, ListTodo, Zap, BookOpen } from "lucide-react";
import { useApp } from "../hooks/useApp";
import DailyTaskCard from "../components/DailyTaskCard";
import CompleteTaskModal from "../components/CompleteTaskModal";
import CreateDailyTaskModal from "../components/CreateDailyTaskModal";
import CreateSideQuestModal from "../components/CreateSideQuestModal";
import CreateQuestBookModal from "../components/CreateQuestBookModal";
import EditDailyTaskModal from "../components/EditDailyTaskModal";
import EditSideQuestModal from "../components/EditSideQuestModal";
import DailyShareCardModal from "../components/DailyShareCardModal";
import NpcAgentPanel from "../components/NpcAgentPanel";
import { NPCS } from "../data/npcs";
import { getTodayRecommendation, getLLMTodayRecommendation } from "../services/todayRecommendAgent";
import { loadLLMConfig } from "../utils/llmConfig";
import type { CompletionContext, Mood, EnergyLevel, DailyTask, SideQuest } from "../types";
import { today } from "../utils/date";

export default function TodayPage() {
  const { state, completeQuestStage, completeQuestBookTask, completeDailyTask, completeSideQuest,
    addJournal, addQuestBook, addDailyTask, addSideQuest, toggleDailyActive,
    updateDailyTask, updateSideQuest, todayDailyTasks, todaySideQuests } = useApp();

  const [completionCtx, setCompletionCtx] = useState<CompletionContext | null>(null);
  const [showFab, setShowFab] = useState(false);
  const [createModal, setCreateModal] = useState<"book" | "daily" | "side" | null>(null);
  const [editingDaily, setEditingDaily] = useState<DailyTask | null>(null);
  const [editingSide, setEditingSide] = useState<SideQuest | null>(null);
  const [showShareCard, setShowShareCard] = useState(false);
  const [lumiMessage, setLumiMessage] = useState("欢迎来到今日营地。");
  const [lumiLoading, setLumiLoading] = useState(false);
  const fabRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => { if (fabRef.current && !fabRef.current.contains(e.target as Node)) setShowFab(false); };
    document.addEventListener("mousedown", handler); return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Collect all active stages/tasks from questBooks
  const questBookItems: { bookId: string; bookTitle: string; lineTitle?: string; stageId?: string; taskId?: string; title: string; description?: string; type: "stage" | "task" }[] = [];
  state.questBooks.filter((qb) => qb.status === "active" && !qb.archived).forEach((qb) => {
    qb.questLines.forEach((ql) => {
      const firstUncompleted = ql.stages.find((s) => !s.completed);
      if (firstUncompleted) questBookItems.push({ bookId: qb.id, bookTitle: qb.title, lineTitle: ql.title, stageId: firstUncompleted.id, title: firstUncompleted.title, description: firstUncompleted.description, type: "stage" });
    });
    qb.directTasks.filter((t) => !t.completed).forEach((t) => questBookItems.push({ bookId: qb.id, bookTitle: qb.title, taskId: t.id, title: t.title, description: t.description, type: "task" }));
  });

  const isEmpty = questBookItems.length === 0 && todayDailyTasks.length === 0 && todaySideQuests.length === 0;

  const handleSaveJournal = useCallback((content: string, mood: Mood, energy: EnergyLevel) => {
    if (completionCtx && content.trim()) addJournal({ date: today(), taskId: completionCtx.itemId, mood, energy, content: content.trim(), tags: [] });
    setCompletionCtx(null);
  }, [completionCtx, addJournal]);

  return (
    <div className="space-y-6 pb-24 animate-in">
      <NpcAgentPanel npc={NPCS.lumi} message={lumiMessage}
        actionLabel={lumiLoading ? "正在思考…" : "推荐一个任务"}
        onAction={async () => { setLumiLoading(true); try { const config = loadLLMConfig(); const rec = await getLLMTodayRecommendation(state, config); setLumiMessage(rec.npcReply); } catch { setLumiMessage(getTodayRecommendation(state).npcReply); } setLumiLoading(false); }}
        secondaryLabel="我今天有点累"
        onSecondary={() => setLumiMessage("那今天不要挑战太多。")}
      />
      <button onClick={() => setShowShareCard(true)} className="glass rounded-3xl p-3 flex items-center justify-center gap-2 hover:-translate-y-0.5 transition-all w-full">
        <Zap size={14} className="text-coral" /><span className="text-[11px] font-black text-navy">今日冒险总结</span>
      </button>

      {isEmpty ? (
        <div className="glass rounded-3xl p-10 text-center"><p className="text-navy/40 font-bold text-xs tracking-widest uppercase">今天还没有任务</p></div>
      ) : (
        <>
          {questBookItems.length > 0 && (
            <PanelShell icon={<BookOpen size={15} />} title="任务书" accent="border-navy/10" accentBar="bg-theme" badge={`${questBookItems.length}`} onAdd={() => setCreateModal("book")}>
              {questBookItems.map((item) => (
                <SubFrame key={item.stageId || item.taskId}>
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <span className="text-[9px] font-bold text-navy/25 uppercase tracking-widest">{item.bookTitle}{item.lineTitle ? ` → ${item.lineTitle}` : ""}</span>
                      <h4 className="text-[13px] font-black text-navy mt-0.5">{item.title}</h4>
                      {item.description && <p className="text-[10px] text-navy/35 mt-0.5 line-clamp-1">{item.description}</p>}
                    </div>
                    <button
                      onClick={() => { if (item.type === "stage" && item.stageId) { const ctx = completeQuestStage(item.bookId, state.questBooks.find((q) => q.id === item.bookId)!.questLines.find((l) => l.stages.some((s) => s.id === item.stageId))!.id, item.stageId); if (ctx) setCompletionCtx(ctx); } if (item.type === "task" && item.taskId) { const ctx = completeQuestBookTask(item.bookId, item.taskId); if (ctx) setCompletionCtx(ctx); } }}
                      className="btn btn-primary !py-1.5 !px-4 !text-[10px] flex-shrink-0"><CheckCircle2 size={12} /> 完成</button>
                  </div>
                </SubFrame>
              ))}
            </PanelShell>
          )}
          {todayDailyTasks.length > 0 && (
            <PanelShell icon={<ListTodo size={15} />} title="今日日常" accent="border-coral/15" accentBar="bg-coral" badge={`${todayDailyTasks.filter((dt) => dt.active).length} 项`} onAdd={() => setCreateModal("daily")}>
              {todayDailyTasks.map((dt) => <DailyTaskCard key={dt.id} task={dt} onComplete={(id) => { const ctx = completeDailyTask(id); if (ctx) setCompletionCtx(ctx); }} onToggle={toggleDailyActive} onEdit={setEditingDaily} />)}
            </PanelShell>
          )}
          {todaySideQuests.length > 0 && (
            <PanelShell icon={<CheckCircle2 size={15} />} title="支线任务" accent="border-leaf/15" accentBar="bg-leaf" badge={`${todaySideQuests.length} 项`} onAdd={() => setCreateModal("side")}>
              {todaySideQuests.slice(0, 6).map((sq) => (
                <SubFrame key={sq.id}>
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex-1 min-w-0 cursor-pointer" onClick={() => setEditingSide(sq)}><h4 className="text-[13px] font-black text-navy">{sq.title}</h4>{sq.description && <p className="text-[10px] text-navy/35 mt-0.5 line-clamp-1">{sq.description}</p>}</div>
                    <button onClick={() => { const ctx = completeSideQuest(sq.id); if (ctx) setCompletionCtx(ctx); }} className="btn btn-primary !py-1.5 !px-4 !text-[10px] flex-shrink-0"><CheckCircle2 size={12} /> 完成</button>
                  </div>
                </SubFrame>
              ))}
            </PanelShell>
          )}
        </>
      )}

      <div ref={fabRef} className="fixed bottom-20 md:bottom-6 right-4 md:right-6 z-40">
        {showFab && (
          <div className="absolute bottom-14 right-0 flex flex-col gap-2 mb-2 animate-scale">
            <button onClick={() => { setCreateModal("book"); setShowFab(false); }} className="btn btn-primary !py-2 !px-4 !text-[10px] whitespace-nowrap shadow-lg"><BookOpen size={13} /> 新建任务书</button>
            <button onClick={() => { setCreateModal("daily"); setShowFab(false); }} className="btn btn-accent !py-2 !px-4 !text-[10px] whitespace-nowrap shadow-lg"><ListTodo size={13} /> 新建日常</button>
            <button onClick={() => { setCreateModal("side"); setShowFab(false); }} className="btn btn-primary !bg-leaf !py-2 !px-4 !text-[10px] whitespace-nowrap shadow-lg"><CheckCircle2 size={13} /> 新建支线</button>
          </div>
        )}
        <button onClick={() => setShowFab(!showFab)} className="w-12 h-12 bg-theme text-white rounded-full shadow-xl shadow-navy/30 flex items-center justify-center transition-all hover:scale-105 active:scale-95"><Plus size={20} strokeWidth={2.5} /></button>
      </div>

      {completionCtx && <CompleteTaskModal ctx={completionCtx} onClose={() => setCompletionCtx(null)} onSaveJournal={handleSaveJournal} />}
      {createModal === "book" && <CreateQuestBookModal onClose={() => setCreateModal(null)} onCreate={addQuestBook} />}
      {createModal === "daily" && <CreateDailyTaskModal onClose={() => setCreateModal(null)} onCreate={addDailyTask} />}
      {createModal === "side" && <CreateSideQuestModal onClose={() => setCreateModal(null)} onCreate={addSideQuest} />}
      {editingDaily && <EditDailyTaskModal task={editingDaily} onClose={() => setEditingDaily(null)} onUpdate={updateDailyTask} />}
      {editingSide && <EditSideQuestModal quest={editingSide} onClose={() => setEditingSide(null)} onUpdate={updateSideQuest} />}
      {showShareCard && <DailyShareCardModal onClose={() => setShowShareCard(false)} />}
    </div>
  );
}

function PanelShell({ icon, title, accent, accentBar, badge, onAdd, children }: { icon: React.ReactNode; title: string; accent: string; accentBar: string; badge: string; onAdd: () => void; children: React.ReactNode }) {
  return (<section className={`glass rounded-3xl border ${accent} overflow-hidden`}><div className="flex items-center justify-between px-5 py-3.5 border-b border-navy/5"><div className="flex items-center gap-2.5"><div className={`w-1 h-4 rounded-full ${accentBar}`} />{icon}<h3 className="text-[11px] font-black text-navy uppercase tracking-widest">{title}</h3><span className="text-[9px] font-bold text-navy/25 bg-navy/5 px-2 py-0.5 rounded-full">{badge}</span></div><button onClick={onAdd} className="flex items-center gap-1 text-[10px] font-bold text-navy/30 hover:text-navy"><Plus size={13} /> 添加</button></div><div className="p-3 space-y-2">{children}</div></section>);
}
function SubFrame({ children }: { children: React.ReactNode }) { return <div className="bg-white/20 rounded-2xl border border-navy/5 p-3 transition-all duration-200 hover:border-navy/10 hover:bg-white/35">{children}</div>; }
