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

  useEffect(() => { const handler = (e: MouseEvent) => { if (fabRef.current && !fabRef.current.contains(e.target as Node)) setShowFab(false); }; document.addEventListener("mousedown", handler); return () => document.removeEventListener("mousedown", handler); }, []);

  const questBookItems: { bookId: string; bookTitle: string; lineTitle?: string; stageId?: string; taskId?: string; title: string; description?: string; type: "stage" | "task" }[] = [];
  state.questBooks.filter((qb) => qb.status === "active" && !qb.archived).forEach((qb) => {
    qb.questLines.forEach((ql) => { const s = ql.stages.find((st) => !st.completed); if (s) questBookItems.push({ bookId: qb.id, bookTitle: qb.title, lineTitle: ql.title, stageId: s.id, title: s.title, description: s.description, type: "stage" }); });
    qb.directTasks.filter((t) => !t.completed).forEach((t) => questBookItems.push({ bookId: qb.id, bookTitle: qb.title, taskId: t.id, title: t.title, description: t.description, type: "task" }));
  });

  const isEmpty = questBookItems.length === 0 && todayDailyTasks.length === 0 && todaySideQuests.length === 0;

  const handleSaveJournal = useCallback((content: string, mood: Mood, energy: EnergyLevel) => { if (completionCtx && content.trim()) addJournal({ date: today(), taskId: completionCtx.itemId, mood, energy, content: content.trim(), tags: [] }); setCompletionCtx(null); }, [completionCtx, addJournal]);

  return (
    <div className="space-y-6 pb-24 animate-in">
      <NpcAgentPanel npc={NPCS.lumi} message={lumiMessage}
        actionLabel={lumiLoading ? "思考中…" : "推荐一个任务"}
        onAction={async () => { setLumiLoading(true); try { const config = loadLLMConfig(); const rec = await getLLMTodayRecommendation(state, config); setLumiMessage(rec.npcReply); } catch { setLumiMessage(getTodayRecommendation(state).npcReply); } setLumiLoading(false); }}
        secondaryLabel="我今天有点累" onSecondary={() => setLumiMessage("那今天不要挑战太多。")} />
      <div onClick={() => setShowShareCard(true)} className="wireframe cursor-pointer hover:shadow-[3px_3px_0px_rgba(74,59,44,0.15)] transition-all">
        <div className="wireframe-inner p-3 flex items-center justify-center gap-2"><Zap size={14} className="text-coral" /><span className="text-[11px] font-black text-ink">今日冒险总结</span></div>
      </div>

      {isEmpty ? <div className="wireframe"><div className="wireframe-inner p-8 text-center"><p className="text-ink/40 font-bold text-xs tracking-widest uppercase">今天还没有任务</p></div></div> : (
        <>
          {questBookItems.length > 0 && <Panel icon={<BookOpen size={15} />} title="任务书" accent="border-ink" accentBar="bg-ink" badge={`${questBookItems.length}`} onAdd={() => setCreateModal("book")}>
            {questBookItems.map((item) => (
              <div key={item.stageId || item.taskId} className="wireframe wireframe-shaded">
                <div className="wireframe-inner p-3 flex items-center justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <span className="text-[9px] font-bold text-ink/30 uppercase tracking-widest">{item.bookTitle}{item.lineTitle ? ` → ${item.lineTitle}` : ""}</span>
                    <h4 className="text-[13px] font-black text-ink mt-0.5">{item.title}</h4>
                    {item.description && <p className="text-[10px] text-ink/35 mt-0.5 line-clamp-1">{item.description}</p>}
                  </div>
                  <div className="chamfer-btn h-7 flex-shrink-0" onClick={() => { if (item.type === "stage" && item.stageId) { const qb = state.questBooks.find((q) => q.id === item.bookId); const ql = qb?.questLines.find((l) => l.stages.some((s) => s.id === item.stageId)); if (ql) { const ctx = completeQuestStage(item.bookId, ql.id, item.stageId); if (ctx) setCompletionCtx(ctx); } } if (item.type === "task" && item.taskId) { const ctx = completeQuestBookTask(item.bookId, item.taskId); if (ctx) setCompletionCtx(ctx); } }}><div className="chamfer-outer"><div className="chamfer-gap"><div className="chamfer-inner"><div className="chamfer-core px-3"><CheckCircle2 size={11} /><span className="text-[10px] font-bold ml-1">完成</span></div></div></div></div></div>
                </div>
              </div>
            ))}
          </Panel>}
          {todayDailyTasks.length > 0 && <Panel icon={<ListTodo size={15} />} title="今日日常" accent="border-coral/30" accentBar="bg-coral" badge={`${todayDailyTasks.filter((dt) => dt.active).length} 项`} onAdd={() => setCreateModal("daily")}>
            {todayDailyTasks.map((dt) => <DailyTaskCard key={dt.id} task={dt} onComplete={(id) => { const ctx = completeDailyTask(id); if (ctx) setCompletionCtx(ctx); }} onToggle={toggleDailyActive} onEdit={setEditingDaily} />)}
          </Panel>}
          {todaySideQuests.length > 0 && <Panel icon={<CheckCircle2 size={15} />} title="支线任务" accent="border-leaf/30" accentBar="bg-leaf" badge={`${todaySideQuests.length} 项`} onAdd={() => setCreateModal("side")}>
            {todaySideQuests.slice(0, 6).map((sq) => (
              <div key={sq.id} className="wireframe wireframe-shaded">
                <div className="wireframe-inner p-3 flex items-center justify-between gap-3">
                  <div className="flex-1 min-w-0 cursor-pointer" onClick={() => setEditingSide(sq)}><h4 className="text-[13px] font-black text-ink">{sq.title}</h4>{sq.description && <p className="text-[10px] text-ink/35 mt-0.5 line-clamp-1">{sq.description}</p>}</div>
                  <div className="chamfer-btn h-7 flex-shrink-0" onClick={() => { const ctx = completeSideQuest(sq.id); if (ctx) setCompletionCtx(ctx); }}><div className="chamfer-outer"><div className="chamfer-gap"><div className="chamfer-inner"><div className="chamfer-core px-3"><CheckCircle2 size={11} /><span className="text-[10px] font-bold ml-1">完成</span></div></div></div></div></div>
                </div>
              </div>
            ))}
          </Panel>}
        </>
      )}

      <div ref={fabRef} className="fixed bottom-20 md:bottom-6 right-4 md:right-6 z-40">
        {showFab && (<div className="absolute bottom-14 right-0 flex flex-col gap-2 mb-2 animate-scale">
          <div className="chamfer-btn h-9" onClick={() => { setCreateModal("book"); setShowFab(false); }}><div className="chamfer-outer"><div className="chamfer-gap"><div className="chamfer-inner"><div className="chamfer-core px-4"><BookOpen size={13} /><span className="text-[10px] font-bold ml-1.5">新建任务书</span></div></div></div></div></div>
          <div className="chamfer-btn chamfer-btn-shaded h-9" onClick={() => { setCreateModal("daily"); setShowFab(false); }}><div className="chamfer-outer"><div className="chamfer-gap"><div className="chamfer-inner"><div className="chamfer-core px-4"><ListTodo size={13} /><span className="text-[10px] font-bold ml-1.5">新建日常</span></div></div></div></div></div>
          <div className="chamfer-btn chamfer-btn-shaded h-9" onClick={() => { setCreateModal("side"); setShowFab(false); }}><div className="chamfer-outer"><div className="chamfer-gap"><div className="chamfer-inner"><div className="chamfer-core px-4"><CheckCircle2 size={13} /><span className="text-[10px] font-bold ml-1.5">新建支线</span></div></div></div></div></div>
        </div>)}
        <div className="chamfer-btn w-12 h-12" onClick={() => setShowFab(!showFab)}><div className="chamfer-outer"><div className="chamfer-gap"><div className="chamfer-inner"><div className="chamfer-core"><Plus size={20} strokeWidth={2.5} /></div></div></div></div></div>
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

function Panel({ icon, title, accent, accentBar, badge, onAdd, children }: { icon: React.ReactNode; title: string; accent: string; accentBar: string; badge: string; onAdd: () => void; children: React.ReactNode; }) {
  return (
    <div className={`wireframe ${accent}`}>
      <div className="wireframe-inner"><div className="h-7 border-b-[0.5px] border-ink/15 flex items-center justify-between px-3"><div className="flex items-center gap-2"><div className={`w-1 h-4 ${accentBar}`} />{icon}<h3 className="text-[10px] font-black text-ink uppercase tracking-widest">{title}</h3><span className="text-[9px] font-bold text-ink/25 bg-parchment-dark px-2 py-0.5 border border-ink/10">{badge}</span></div><button onClick={onAdd} className="text-[10px] font-bold text-ink/30 hover:text-ink transition-colors flex items-center gap-1"><Plus size={12} />添加</button></div><div className="p-3 space-y-2">{children}</div></div>
    </div>
  );
}
