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
    archiveQuestBook, archiveDailyTask, archiveSideQuest,
    deleteQuestBook, deleteDailyTask, deleteSideQuest } = useApp();

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

  // ── QuestBook Detail ──
  if (selectedBook) {
    const qb = state.questBooks.find((q) => q.id === selectedBook);
    if (!qb) return null;
    const totalStages = qb.questLines.reduce((s, l) => s + l.stages.length, 0) + qb.directTasks.length;
    const completedStages = qb.questLines.reduce((s, l) => s + l.stages.filter((st) => st.completed).length, 0) + qb.directTasks.filter((t) => t.completed).length;
    const progress = totalStages > 0 ? Math.round((completedStages / totalStages) * 100) : 0;

    return (
      <div className="space-y-6 animate-fade pb-24">
        <button onClick={() => setSelectedBook(null)} className="flex items-center gap-1.5 text-[11px] font-bold text-navy/40 uppercase tracking-widest hover:text-navy"><ArrowLeft size={14} /> 返回</button>
        <div className="text-center space-y-2">
          <p className="text-coral font-bold text-xs tracking-widest uppercase">{qb.status === "active" ? "进行中" : qb.status === "paused" ? "已暂停" : "已完成"}</p>
          <div className="flex items-center justify-center gap-2"><BookOpen size={18} className="text-navy" /><h2 className="text-2xl font-black text-navy tracking-tight serif cursor-pointer" onClick={() => setEditingBook(qb)}>{qb.title}</h2></div>
          <p className="text-[12px] text-navy/50 font-medium leading-relaxed serif">{qb.description}</p>
        </div>
        <div className="glass rounded-3xl p-4">
          <div className="flex justify-between text-[9px] font-bold text-navy/30 uppercase tracking-widest mb-1 px-2"><span>进度</span><span>{completedStages}/{totalStages}</span></div>
          <div className="progress"><div className="progress-fill" style={{ width: `${progress}%` }} /></div>
        </div>

        {/* QuestLines — parallel columns */}
        <div className="space-y-4">
          {qb.questLines.map((ql) => (
            <section key={ql.id} className="glass rounded-3xl border border-navy/10 overflow-hidden">
              <div className="px-5 py-3 border-b border-navy/5 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-1 h-4 rounded-full bg-theme" />
                  <Target size={13} className="text-navy" />
                  <h3 className="text-[11px] font-black text-navy uppercase tracking-widest">{ql.title || "任务线"}</h3>
                  <span className="text-[9px] font-bold text-navy/25 bg-navy/5 px-2 py-0.5 rounded-full">{ql.stages.filter((s) => s.completed).length}/{ql.stages.length}</span>
                </div>
                <button onClick={() => { setSelectedBook(ql.id); setAddStageLineId(ql.id); }} className="flex items-center gap-1 text-[10px] font-bold text-navy/30 hover:text-navy transition-colors"><Plus size={13} /> 添加阶段</button>
              </div>
              <div className="p-3 space-y-1.5">
                {ql.stages.map((s, i) => {
                  const isCurrent = !s.completed && (i === 0 || ql.stages[i - 1].completed);
                  const isFuture = !s.completed && !isCurrent;
                  return (
                    <div key={s.id} className={`bg-white/20 rounded-2xl border border-navy/5 p-3 flex items-center justify-between gap-3 ${isCurrent ? "ring-1 ring-theme/30" : ""} ${s.completed ? "opacity-50" : ""}`}>
                      <div className="flex-1 min-w-0">
                        <span className="text-[9px] font-bold text-navy/25 uppercase tracking-widest">阶段 {i + 1}</span>
                        <h4 className={`text-[12px] font-bold ${s.completed ? "text-navy/40 line-through" : "text-navy"}`}>{s.title}</h4>
                        {s.description && <p className="text-[9px] text-navy/35 mt-0.5">{s.description}</p>}
                      </div>
                      {isCurrent && (
                        <button onClick={() => handleStageComplete(qb.id, ql.id, s.id)}
                          className="btn btn-primary !py-1 !px-3 !text-[9px] !tracking-widest flex-shrink-0"><CheckCircle2 size={11} /> 完成</button>
                      )}
                      {s.completed && <CheckCircle2 size={14} className="text-sage flex-shrink-0" />}
                      {isFuture && <div className="w-6 h-6 rounded-full bg-navy/5 flex items-center justify-center flex-shrink-0"><div className="w-1.5 h-1.5 rounded-full bg-navy/15" /></div>}
                    </div>
                  );
                })}
              </div>
            </section>
          ))}
          <button onClick={() => setShowAddLine(true)} className="w-full py-2.5 border-2 border-dashed border-navy/15 rounded-3xl text-[10px] font-bold text-navy/40 hover:text-navy hover:border-navy/30 transition-all">+ 添加任务线</button>
        </div>

        {/* Direct Tasks */}
        {qb.directTasks.length > 0 && (
          <section className="glass rounded-3xl border border-navy/10 overflow-hidden">
            <div className="px-5 py-3 border-b border-navy/5 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-1 h-4 rounded-full bg-coral" />
                <CheckCircle2 size={13} className="text-coral" />
                <h3 className="text-[11px] font-black text-navy uppercase tracking-widest">直接任务</h3>
                <span className="text-[9px] font-bold text-navy/25 bg-navy/5 px-2 py-0.5 rounded-full">{qb.directTasks.filter((t) => t.completed).length}/{qb.directTasks.length}</span>
              </div>
              <button onClick={() => { setSelectedBook(qb.id); setShowAddTask(true); }} className="flex items-center gap-1 text-[10px] font-bold text-navy/30 hover:text-navy transition-colors"><Plus size={13} /> 添加</button>
            </div>
            <div className="p-3 space-y-1.5">
              {qb.directTasks.map((t) => (
                <div key={t.id} className="bg-white/20 rounded-2xl border border-navy/5 p-3 flex items-center justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <h4 className={`text-[12px] font-bold ${t.completed ? "text-navy/40 line-through" : "text-navy"}`}>{t.title}</h4>
                    {t.description && <p className="text-[9px] text-navy/35 mt-0.5">{t.description}</p>}
                  </div>
                  {!t.completed ? (
                    <button onClick={() => handleTaskComplete(qb.id, t.id)} className="btn btn-primary !py-1 !px-3 !text-[9px] !tracking-widest flex-shrink-0"><CheckCircle2 size={11} /> 完成</button>
                  ) : <CheckCircle2 size={14} className="text-sage flex-shrink-0" />}
                </div>
              ))}
            </div>
          </section>
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

  // ── Panel List View ──
  const activeDaily = state.dailyTasks.filter((dt) => dt.active && !dt.archived);
  const pendingSides = state.sideQuests.filter((sq) => !sq.completed && !sq.archived);

  return (
    <div className="space-y-6 pb-24 animate-in">
      <div className="pt-2 flex items-center justify-between">
        <div><p className="text-coral font-bold text-xs tracking-widest uppercase mb-1">任务书</p><h2 className="text-2xl font-black text-navy tracking-tight serif">全部任务</h2></div>
      </div>

      <NpcAgentPanel npc={NPCS.maro} message="欢迎来到冒险公会。告诉我你想生成什么类型的任务，我来帮你规划。" actionLabel="让 Maro 生成任务" onAction={() => setShowMaroChat(true)} />

      <Panel icon={<BookOpen size={15} />} title="任务书" accentBar="bg-theme" accent="border-navy/10" badge={`${state.questBooks.filter((q) => !q.archived).length} 本`} onAdd={() => setCreateModal("book")}>
        {state.questBooks.filter((q) => !q.archived).length === 0 ? <Empty>还没有任务书。</Empty> : state.questBooks.filter((q) => !q.archived).map((qb) => {
          const total = qb.questLines.reduce((s, l) => s + l.stages.length, 0) + qb.directTasks.length;
          const completed = qb.questLines.reduce((s, l) => s + l.stages.filter((st) => st.completed).length, 0) + qb.directTasks.filter((t) => t.completed).length;
          return (
            <SubFrame key={qb.id} onClick={() => setSelectedBook(qb.id)} clickable>
              <div className="flex items-center gap-3">
                <div className="flex-1 min-w-0">
                  <h4 className="text-[13px] font-black text-navy">{qb.title}</h4>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`text-[9px] font-bold uppercase tracking-widest ${qb.status === "active" ? "text-coral" : "text-navy/30"}`}>{qb.status === "active" ? "进行中" : qb.status === "paused" ? "暂停" : "完成"}</span>
                    <span className="text-[9px] text-navy/25">{qb.questLines.length} 线 · {completed}/{total}</span>
                  </div>
                </div>
                <div className="text-right"><span className="text-[11px] font-black text-navy tabular-nums">{total > 0 ? Math.round((completed / total) * 100) : 0}%</span></div>
              </div>
              {total > 0 && <div className="mt-2 progress"><div className="progress-fill" style={{ width: `${Math.round((completed / total) * 100)}%` }} /></div>}
            </SubFrame>
          );
        })}
      </Panel>

      <Panel icon={<ListTodo size={15} />} title="日常" accentBar="bg-coral" accent="border-coral/15" badge={`${activeDaily.length} 活跃`} onAdd={() => setCreateModal("daily")}>
        {state.dailyTasks.filter((d) => !d.archived).length === 0 ? <Empty>还没有日常任务。</Empty> : state.dailyTasks.filter((d) => !d.archived).map((dt) => <DailyTaskCard key={dt.id} task={dt} onComplete={handleDailyComplete} onToggle={toggleDailyActive} onEdit={setEditingDaily} />)}
      </Panel>

      <Panel icon={<CheckCircle2 size={15} />} title="支线" accentBar="bg-leaf" accent="border-leaf/15" badge={`${pendingSides.length} 待完成`} onAdd={() => setCreateModal("side")}>
        {state.sideQuests.filter((s) => !s.archived).length === 0 ? <Empty>还没有支线任务。</Empty> : state.sideQuests.filter((s) => !s.archived).map((sq) => <SideQuestCard key={sq.id} quest={sq} onComplete={handleSideComplete} onEdit={setEditingSide} />)}
      </Panel>

      <button onClick={() => setCreateModal("book")} className="fixed bottom-20 md:bottom-6 right-4 md:right-6 w-12 h-12 bg-theme text-white rounded-full shadow-xl shadow-navy/30 flex items-center justify-center transition-all hover:scale-105 active:scale-95 z-40"><Plus size={20} strokeWidth={2.5} /></button>

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

function Panel({ icon, title, accent, accentBar, badge, onAdd, children }: { icon: React.ReactNode; title: string; accent: string; accentBar: string; badge: string; onAdd: () => void; children: React.ReactNode }) {
  return (<section className={`glass rounded-3xl border ${accent} overflow-hidden`}><div className="flex items-center justify-between px-5 py-3.5 border-b border-navy/5"><div className="flex items-center gap-2.5"><div className={`w-1 h-4 rounded-full ${accentBar}`} />{icon}<h3 className="text-[11px] font-black text-navy uppercase tracking-widest">{title}</h3><span className="text-[9px] font-bold text-navy/25 bg-navy/5 px-2 py-0.5 rounded-full">{badge}</span></div><button onClick={onAdd} className="flex items-center gap-1 text-[10px] font-bold text-navy/30 hover:text-navy"><Plus size={13} /> 添加</button></div><div className="p-3 space-y-2">{children}</div></section>);
}

function SubFrame({ children, onClick, clickable }: { children: React.ReactNode; onClick?: () => void; clickable?: boolean }) {
  return <div onClick={onClick} className={`bg-white/20 rounded-2xl border border-navy/5 p-3 transition-all duration-200 ${clickable ? "cursor-pointer hover:border-navy/10 hover:bg-white/35" : ""}`}>{children}</div>;
}

function Empty({ children }: { children: React.ReactNode }) { return <div className="text-center py-6"><p className="text-[10px] font-medium text-navy/25">{children}</p></div>; }
