import { useState } from "react";
import { Plus, ArrowLeft, Target, ListTodo, CheckCircle2, BookOpen } from "lucide-react";
import { useApp } from "../hooks/useApp";
import DailyTaskCard from "../components/DailyTaskCard";
import SideQuestCard from "../components/SideQuestCard";
import CompleteTaskModal from "../components/CompleteTaskModal";
import CreateDailyTaskModal from "../components/CreateDailyTaskModal";
import CreateSideQuestModal from "../components/CreateSideQuestModal";
import CreateQuestBookModal from "../components/CreateQuestBookModal";
import CreateQuestLineModal from "../components/CreateQuestLineModal";
import CreateQuestStageModal from "../components/CreateQuestStageModal";
import CreateQuestBookTaskModal from "../components/CreateQuestBookTaskModal";
import EditQuestBookModal from "../components/EditQuestBookModal";
import EditDailyTaskModal from "../components/EditDailyTaskModal";
import EditSideQuestModal from "../components/EditSideQuestModal";
import NpcAgentPanel from "../components/NpcAgentPanel";
import MaroChatModal from "../components/MaroChatModal";
import { NPCS } from "../data/npcs";
import type { CompletionContext, Mood, EnergyLevel, QuestBook, DailyTask, SideQuest } from "../types";
import { today } from "../utils/date";

export default function TasksPage() {
  const { state, completeQuestStage, completeQuestBookTask, completeDailyTask, completeSideQuest,
    addJournal, addQuestBook, addQuestLine, addQuestStage, addQuestBookTask, addDailyTask, addSideQuest, toggleDailyActive,
    updateQuestBook, updateDailyTask, updateSideQuest,
    archiveQuestBook, archiveDailyTask, archiveSideQuest, deleteQuestBook, deleteDailyTask, deleteSideQuest } = useApp();

  const [selectedBook, setSelectedBook] = useState<string | null>(null);
  const [completionCtx, setCompletionCtx] = useState<CompletionContext | null>(null);
  const [createModal, setCreateModal] = useState<"book" | "daily" | "side" | null>(null);
  const [showAddLine, setShowAddLine] = useState(false);
  const [showAddTask, setShowAddTask] = useState(false);
  const [addStageLineId, setAddStageLineId] = useState<string | null>(null);
  const [editingBook, setEditingBook] = useState<QuestBook | null>(null);
  const [editingDaily, setEditingDaily] = useState<DailyTask | null>(null);
  const [editingSide, setEditingSide] = useState<SideQuest | null>(null);
  const [showMaroChat, setShowMaroChat] = useState(false);

  const handleStageComplete = (bookId: string, lineId: string, stageId: string) => { const ctx = completeQuestStage(bookId, lineId, stageId); if (ctx) setCompletionCtx(ctx); };
  const handleTaskComplete = (bookId: string, taskId: string) => { const ctx = completeQuestBookTask(bookId, taskId); if (ctx) setCompletionCtx(ctx); };
  const handleDailyComplete = (id: string) => { const ctx = completeDailyTask(id); if (ctx) setCompletionCtx(ctx); };
  const handleSideComplete = (id: string) => { const ctx = completeSideQuest(id); if (ctx) setCompletionCtx(ctx); };
  const handleSaveJournal = (content: string, mood: Mood, energy: EnergyLevel) => { if (completionCtx && content.trim()) addJournal({ date: today(), taskId: completionCtx.itemId, mood, energy, content: content.trim(), tags: [] }); setCompletionCtx(null); };

  if (selectedBook) {
    const qb = state.questBooks.find((q) => q.id === selectedBook);
    if (!qb) return null;
    const total = qb.questLines.reduce((s, l) => s + l.stages.length, 0) + qb.directTasks.length;
    const completed = qb.questLines.reduce((s, l) => s + l.stages.filter((st) => st.completed).length, 0) + qb.directTasks.filter((t) => t.completed).length;
    const pct = total > 0 ? Math.round((completed / total) * 100) : 0;

    return (
      <div className="space-y-6 animate-fade pb-24">
        <button onClick={() => setSelectedBook(null)} className="flex items-center gap-1.5 text-[11px] font-bold text-ink/40 uppercase tracking-widest hover:text-ink"><ArrowLeft size={14} /> 返回</button>
        <div className="text-center space-y-2">
          <p className="text-coral font-bold text-xs tracking-widest uppercase">{qb.status === "active" ? "进行中" : qb.status === "paused" ? "已暂停" : "已完成"}</p>
          <div className="flex items-center justify-center gap-2"><BookOpen size={18} /><h2 className="text-2xl font-black text-ink tracking-tight serif cursor-pointer" onClick={() => setEditingBook(qb)}>{qb.title}</h2></div>
          <p className="text-[12px] text-ink/50 font-medium leading-relaxed serif">{qb.description}</p>
        </div>
        <div className="wireframe"><div className="wireframe-inner p-3"><div className="flex justify-between text-[9px] font-bold text-ink/30 uppercase tracking-widest mb-1 px-1"><span>进度</span><span>{completed}/{total}</span></div><div className="progress-track"><div className="progress-fill" style={{ width: `${pct}%` }} /></div></div></div>

        {qb.questLines.map((ql) => (
          <div key={ql.id} className="wireframe">
            <div className="wireframe-inner"><div className="h-7 border-b-[0.5px] border-ink/15 flex items-center justify-between px-3"><div className="flex items-center gap-2"><div className="w-1 h-4 bg-ink" /><Target size={13} /><h3 className="text-[10px] font-black text-ink uppercase tracking-widest">{ql.title || "任务线"}</h3><span className="text-[9px] font-bold text-ink/25 bg-parchment-dark px-2 py-0.5 border border-ink/10">{ql.stages.filter((s) => s.completed).length}/{ql.stages.length}</span></div>
              <button onClick={() => setAddStageLineId(ql.id)} className="text-[10px] font-bold text-ink/30 hover:text-ink"><Plus size={12} /> 添加阶段</button></div>
              <div className="p-3 space-y-1.5">
                {ql.stages.map((s, i) => { const isCur = !s.completed && (i === 0 || ql.stages[i - 1].completed); const isFut = !s.completed && !isCur;
                  return (<div key={s.id} className={`wireframe wireframe-shaded ${isCur ? "shadow-[2px_2px_0px_rgba(74,59,44,0.3)]" : ""}`}>
                    <div className="wireframe-inner p-3 flex items-center justify-between gap-3"><div className="flex-1 min-w-0"><span className="text-[9px] font-bold text-ink/25 uppercase tracking-widest">阶段 {i+1}</span><h4 className={`text-[12px] font-bold ${s.completed ? "text-ink/30 line-through" : "text-ink"}`}>{s.title}</h4>{s.description && <p className="text-[9px] text-ink/35 mt-0.5">{s.description}</p>}</div>
                      {isCur && (<div className="chamfer-btn h-7 flex-shrink-0" onClick={() => handleStageComplete(qb.id, ql.id, s.id)}><div className="chamfer-outer"><div className="chamfer-gap"><div className="chamfer-inner"><div className="chamfer-core px-2"><CheckCircle2 size={11} /><span className="text-[9px] font-bold ml-1">完成</span></div></div></div></div></div>)}
                      {s.completed && <CheckCircle2 size={14} className="text-ink/40 flex-shrink-0" />}
                      {isFut && <div className="w-6 h-6 border border-ink/15 flex items-center justify-center flex-shrink-0"><div className="w-1.5 h-1.5 border border-ink/20" /></div>}
                    </div></div>);
                })}
              </div></div>
          </div>
        ))}
        <button onClick={() => setShowAddLine(true)} className="w-full py-2.5 border-[1.5px] border-dashed border-ink/20 text-[10px] font-bold text-ink/30 hover:text-ink hover:border-ink/40">+ 添加任务线</button>

        {qb.directTasks.length > 0 && (
          <div className="wireframe"><div className="wireframe-inner"><div className="h-7 border-b-[0.5px] border-ink/15 flex items-center justify-between px-3"><div className="flex items-center gap-2"><div className="w-1 h-4 bg-coral" /><CheckCircle2 size={13} /><h3 className="text-[10px] font-black text-ink uppercase tracking-widest">直接任务</h3><span className="text-[9px] font-bold text-ink/25 bg-parchment-dark px-2 py-0.5 border border-ink/10">{qb.directTasks.filter((t) => t.completed).length}/{qb.directTasks.length}</span></div><button onClick={() => setShowAddTask(true)} className="text-[10px] font-bold text-ink/30 hover:text-ink"><Plus size={12} /> 添加</button></div>
            <div className="p-3 space-y-1.5">{qb.directTasks.map((t) => (
              <div key={t.id} className="wireframe wireframe-shaded"><div className="wireframe-inner p-3 flex items-center justify-between gap-3"><div className="flex-1 min-w-0"><h4 className={`text-[12px] font-bold ${t.completed ? "text-ink/30 line-through" : "text-ink"}`}>{t.title}</h4></div>
                {!t.completed ? (<div className="chamfer-btn h-7 flex-shrink-0" onClick={() => handleTaskComplete(qb.id, t.id)}><div className="chamfer-outer"><div className="chamfer-gap"><div className="chamfer-inner"><div className="chamfer-core px-2"><CheckCircle2 size={11} /><span className="text-[9px] font-bold ml-1">完成</span></div></div></div></div></div>) : <CheckCircle2 size={14} className="text-ink/40 flex-shrink-0" />}
              </div></div>
            ))}</div></div>
          </div>
        )}

        {completionCtx && <CompleteTaskModal ctx={completionCtx} onClose={() => setCompletionCtx(null)} onSaveJournal={handleSaveJournal} />}
        {showAddLine && <CreateQuestLineModal bookId={qb.id} onClose={() => setShowAddLine(false)} onCreate={addQuestLine} />}
        {addStageLineId && <CreateQuestStageModal bookId={qb.id} lineId={addStageLineId} onClose={() => setAddStageLineId(null)} onCreate={addQuestStage} />}
        {showAddTask && <CreateQuestBookTaskModal bookId={qb.id} onClose={() => setShowAddTask(false)} onCreate={addQuestBookTask} />}
        {editingBook && <EditQuestBookModal questBook={editingBook} onClose={() => setEditingBook(null)} onUpdate={updateQuestBook} onArchive={archiveQuestBook} onDelete={deleteQuestBook} />}
        {editingDaily && <EditDailyTaskModal task={editingDaily} onClose={() => setEditingDaily(null)} onUpdate={updateDailyTask} onArchive={archiveDailyTask} onDelete={deleteDailyTask} />}
        {editingSide && <EditSideQuestModal quest={editingSide} onClose={() => setEditingSide(null)} onUpdate={updateSideQuest} onArchive={archiveSideQuest} onDelete={deleteSideQuest} />}
      </div>
    );
  }

  const activeDaily = state.dailyTasks.filter((dt) => dt.active && !dt.archived);
  const pendingSides = state.sideQuests.filter((sq) => !sq.completed && !sq.archived);

  return (
    <div className="space-y-6 pb-24 animate-in">
      <div className="pt-2"><p className="text-coral font-bold text-xs tracking-widest uppercase mb-1">任务书</p><h2 className="text-2xl font-black text-ink tracking-tight serif">全部任务</h2></div>
      <NpcAgentPanel npc={NPCS.maro} message="欢迎来到冒险公会。告诉我你想生成什么类型的任务，我来帮你规划。" actionLabel="让 Maro 生成任务" onAction={() => setShowMaroChat(true)} />

      <P icon={<BookOpen size={15} />} title="任务书" accentBar="bg-ink" badge={`${state.questBooks.filter((q) => !q.archived).length} 本`} onAdd={() => setCreateModal("book")}>
        {state.questBooks.filter((q) => !q.archived).length === 0 ? <E>还没有任务书。</E> : state.questBooks.filter((q) => !q.archived).map((qb) => {
          const t = qb.questLines.reduce((s, l) => s + l.stages.length, 0) + qb.directTasks.length;
          const c = qb.questLines.reduce((s, l) => s + l.stages.filter((st) => st.completed).length, 0) + qb.directTasks.filter((dt) => dt.completed).length;
          return (
            <div key={qb.id} className="wireframe wireframe-shaded cursor-pointer hover:shadow-[3px_3px_0px_rgba(74,59,44,0.15)] transition-all" onClick={() => setSelectedBook(qb.id)}>
              <div className="wireframe-inner p-3"><div className="flex items-center gap-3"><div className="flex-1 min-w-0"><h4 className="text-[13px] font-black text-ink">{qb.title}</h4><div className="flex items-center gap-2 mt-1"><span className={`text-[9px] font-bold uppercase tracking-widest ${qb.status === "active" ? "text-coral" : "text-ink/30"}`}>{qb.status === "active" ? "进行中" : qb.status === "paused" ? "暂停" : "完成"}</span><span className="text-[9px] text-ink/25">{qb.questLines.length} 线 · {c}/{t}</span></div></div><div className="text-right"><span className="text-[11px] font-black text-ink tabular-nums">{t > 0 ? Math.round((c / t) * 100) : 0}%</span></div></div>{t > 0 && <div className="mt-2 progress-track"><div className="progress-fill" style={{ width: `${Math.round((c / t) * 100)}%` }} /></div>}</div>
            </div>
          );
        })}
      </P>
      <P icon={<ListTodo size={15} />} title="日常" accentBar="bg-coral" badge={`${activeDaily.length} 活跃`} onAdd={() => setCreateModal("daily")}>
        {state.dailyTasks.filter((d) => !d.archived).length === 0 ? <E>还没有日常任务。</E> : state.dailyTasks.filter((d) => !d.archived).map((dt) => <DailyTaskCard key={dt.id} task={dt} onComplete={handleDailyComplete} onToggle={toggleDailyActive} onEdit={setEditingDaily} />)}
      </P>
      <P icon={<CheckCircle2 size={15} />} title="支线" accentBar="bg-leaf" badge={`${pendingSides.length} 待完成`} onAdd={() => setCreateModal("side")}>
        {state.sideQuests.filter((s) => !s.archived).length === 0 ? <E>还没有支线任务。</E> : state.sideQuests.filter((s) => !s.archived).map((sq) => <SideQuestCard key={sq.id} quest={sq} onComplete={handleSideComplete} onEdit={setEditingSide} />)}
      </P>

      <div className="chamfer-btn w-12 h-12 fixed bottom-20 md:bottom-6 right-4 md:right-6 z-40" onClick={() => setCreateModal("book")}><div className="chamfer-outer"><div className="chamfer-gap"><div className="chamfer-inner"><div className="chamfer-core"><Plus size={20} strokeWidth={2.5} /></div></div></div></div></div>

      {completionCtx && <CompleteTaskModal ctx={completionCtx} onClose={() => setCompletionCtx(null)} onSaveJournal={handleSaveJournal} />}
      {createModal === "book" && <CreateQuestBookModal onClose={() => setCreateModal(null)} onCreate={addQuestBook} />}
      {createModal === "daily" && <CreateDailyTaskModal onClose={() => setCreateModal(null)} onCreate={addDailyTask} />}
      {createModal === "side" && <CreateSideQuestModal onClose={() => setCreateModal(null)} onCreate={addSideQuest} />}
      {editingBook && <EditQuestBookModal questBook={editingBook} onClose={() => setEditingBook(null)} onUpdate={updateQuestBook} onArchive={archiveQuestBook} onDelete={deleteQuestBook} />}
      {editingDaily && <EditDailyTaskModal task={editingDaily} onClose={() => setEditingDaily(null)} onUpdate={updateDailyTask} onArchive={archiveDailyTask} onDelete={deleteDailyTask} />}
      {editingSide && <EditSideQuestModal quest={editingSide} onClose={() => setEditingSide(null)} onUpdate={updateSideQuest} onArchive={archiveSideQuest} onDelete={deleteSideQuest} />}
      {showMaroChat && <MaroChatModal onClose={() => setShowMaroChat(false)} />}
    </div>
  );
}

function P({ icon, title, accentBar, badge, onAdd, children }: { icon: React.ReactNode; title: string; accentBar: string; badge: string; onAdd: () => void; children: React.ReactNode }) {
  return <div className="wireframe"><div className="wireframe-inner"><div className="h-7 border-b-[0.5px] border-ink/15 flex items-center justify-between px-3"><div className="flex items-center gap-2"><div className={`w-1 h-4 ${accentBar}`} />{icon}<h3 className="text-[10px] font-black text-ink uppercase tracking-widest">{title}</h3><span className="text-[9px] font-bold text-ink/25 bg-parchment-dark px-2 py-0.5 border border-ink/10">{badge}</span></div><button onClick={onAdd} className="text-[10px] font-bold text-ink/30 hover:text-ink transition-colors flex items-center gap-1"><Plus size={12} />添加</button></div><div className="p-3 space-y-2">{children}</div></div></div>;
}
function E({ children }: { children: React.ReactNode }) { return <div className="text-center py-6"><p className="text-[10px] font-medium text-ink/25">{children}</p></div>; }
