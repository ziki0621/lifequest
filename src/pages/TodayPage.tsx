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
import { WireframeBox, ChamferedButton } from "../components/vintage";
import type { CompletionContext, Mood, EnergyLevel, DailyTask, SideQuest } from "../types";
import { today } from "../utils/date";

export default function TodayPage() {
  const { state, completeQuestStage, completeQuestBookTask, completeDailyTask, completeSideQuest,
    addJournal, addQuestBook, addDailyTask, addSideQuest, toggleDailyActive,
    updateDailyTask, updateSideQuest, todayDailyTasks, todaySideQuests } = useApp();
  const [cc, setCc] = useState<CompletionContext | null>(null);
  const [showFab, setShowFab] = useState(false);
  const [cm, setCm] = useState<"book" | "daily" | "side" | null>(null);
  const [ed, setEd] = useState<DailyTask | null>(null);
  const [es, setEs] = useState<SideQuest | null>(null);
  const [sc, setSc] = useState(false);
  const [lm, setLm] = useState("欢迎来到今日营地。"); const [ll, setLl] = useState(false);
  const fr = useRef<HTMLDivElement>(null);
  useEffect(() => { const h = (e: MouseEvent) => { if (fr.current && !fr.current.contains(e.target as Node)) setShowFab(false); }; document.addEventListener("mousedown", h); return () => document.removeEventListener("mousedown", h); }, []);

  const qbi: any[] = []; state.questBooks.filter((qb) => qb.status === "active" && !qb.archived).forEach((qb) => { qb.questLines.forEach((ql) => { const s = ql.stages.find((st) => !st.completed); if (s) qbi.push({ bookId: qb.id, bookTitle: qb.title, lineTitle: ql.title, stageId: s.id, title: s.title, description: s.description, type: "stage" }); }); qb.directTasks.filter((t) => !t.completed).forEach((t) => qbi.push({ bookId: qb.id, bookTitle: qb.title, taskId: t.id, title: t.title, description: t.description, type: "task" })); });
  const empty = qbi.length === 0 && todayDailyTasks.length === 0 && todaySideQuests.length === 0;
  const hs = useCallback((c: string, m: Mood, e: EnergyLevel) => { if (cc && c.trim()) addJournal({ date: today(), taskId: cc.itemId, mood: m, energy: e, content: c.trim(), tags: [] }); setCc(null); }, [cc, addJournal]);

  return (<div className="space-y-6 pb-24 animate-in">
    <NpcAgentPanel npc={NPCS.lumi} message={lm}
      actionLabel={ll ? "思考中…" : "推荐一个任务"}
      onAction={async () => { setLl(true); try { const c = loadLLMConfig(); const r = await getLLMTodayRecommendation(state, c); setLm(r.npcReply); } catch { setLm(getTodayRecommendation(state).npcReply); } setLl(false); }}
      secondaryLabel="我今天有点累" onSecondary={() => setLm("那今天不要挑战太多。")} />
    <WireframeBox className="cursor-pointer" innerClassName="p-3 flex items-center justify-center gap-2" onClick={() => setSc(true)}><Zap size={14} className="text-[#8B3A3A]" /><span className="text-[11px] font-black text-[#4A3B2C]">今日冒险总结</span></WireframeBox>
    {empty ? <WireframeBox innerClassName="p-8 text-center"><p className="text-[#4A3B2C]/40 font-bold text-xs tracking-widest uppercase">今天还没有任务</p></WireframeBox> : (<>
      {qbi.length > 0 && <P icon={<BookOpen size={15} />} title="任务书" bar="bg-[#4A3B2C]" badge={`${qbi.length}`} onAdd={() => setCm("book")}>{qbi.map((it) => (
        <WireframeBox key={it.stageId || it.taskId} shaded innerClassName="p-3 flex items-center justify-between gap-3">
          <div className="flex-1 min-w-0"><span className="text-[9px] font-bold text-[#4A3B2C]/30 uppercase tracking-widest">{it.bookTitle}{it.lineTitle ? ` → ${it.lineTitle}` : ""}</span><h4 className="text-[13px] font-black text-[#4A3B2C] mt-0.5">{it.title}</h4>{it.description && <p className="text-[10px] text-[#4A3B2C]/35 mt-0.5 line-clamp-1">{it.description}</p>}</div>
          <ChamferedButton onClick={() => { if (it.type === "stage" && it.stageId) { const qb = state.questBooks.find((q) => q.id === it.bookId); const ql = qb?.questLines.find((l) => l.stages.some((s) => s.id === it.stageId)); if (ql) { const r = completeQuestStage(it.bookId, ql.id, it.stageId); if (r) setCc(r); } } if (it.type === "task" && it.taskId) { const r = completeQuestBookTask(it.bookId, it.taskId); if (r) setCc(r); } }}><CheckCircle2 size={11} /><span className="text-[10px] font-bold ml-1">完成</span></ChamferedButton>
        </WireframeBox>
      ))}</P>}
      {todayDailyTasks.length > 0 && <P icon={<ListTodo size={15} />} title="今日日常" bar="bg-[#8B3A3A]" badge={`${todayDailyTasks.filter((d) => d.active).length} 项`} onAdd={() => setCm("daily")}>{todayDailyTasks.map((dt) => <DailyTaskCard key={dt.id} task={dt} onComplete={(id) => { const r = completeDailyTask(id); if (r) setCc(r); }} onToggle={toggleDailyActive} onEdit={setEd} />)}</P>}
      {todaySideQuests.length > 0 && <P icon={<CheckCircle2 size={15} />} title="支线任务" bar="bg-[#3A5A3A]" badge={`${todaySideQuests.length} 项`} onAdd={() => setCm("side")}>{todaySideQuests.slice(0,6).map((sq) => (
        <WireframeBox key={sq.id} shaded innerClassName="p-3 flex items-center justify-between gap-3">
          <div className="flex-1 min-w-0 cursor-pointer" onClick={() => setEs(sq)}><h4 className="text-[13px] font-black text-[#4A3B2C]">{sq.title}</h4>{sq.description && <p className="text-[10px] text-[#4A3B2C]/35 mt-0.5 line-clamp-1">{sq.description}</p>}</div>
          <ChamferedButton onClick={() => { const r = completeSideQuest(sq.id); if (r) setCc(r); }}><CheckCircle2 size={11} /><span className="text-[10px] font-bold ml-1">完成</span></ChamferedButton>
        </WireframeBox>
      ))}</P>}
    </>)}
    <div ref={fr} className="fixed bottom-20 md:bottom-6 right-4 md:right-6 z-40">
      {showFab && <div className="absolute bottom-14 right-0 flex flex-col gap-2 mb-2 animate-scale">
        <ChamferedButton onClick={() => { setCm("book"); setShowFab(false); }}><BookOpen size={13} /><span className="text-[10px] font-bold ml-1.5">新建任务书</span></ChamferedButton>
        <ChamferedButton shaded onClick={() => { setCm("daily"); setShowFab(false); }}><ListTodo size={13} /><span className="text-[10px] font-bold ml-1.5">新建日常</span></ChamferedButton>
        <ChamferedButton shaded onClick={() => { setCm("side"); setShowFab(false); }}><CheckCircle2 size={13} /><span className="text-[10px] font-bold ml-1.5">新建支线</span></ChamferedButton>
      </div>}
      <ChamferedButton className="!w-12 !h-12" onClick={() => setShowFab(!showFab)}><Plus size={20} strokeWidth={2.5} /></ChamferedButton>
    </div>
    {cc && <CompleteTaskModal ctx={cc} onClose={() => setCc(null)} onSaveJournal={hs} />}
    {cm === "book" && <CreateQuestBookModal onClose={() => setCm(null)} onCreate={addQuestBook} />}{cm === "daily" && <CreateDailyTaskModal onClose={() => setCm(null)} onCreate={addDailyTask} />}{cm === "side" && <CreateSideQuestModal onClose={() => setCm(null)} onCreate={addSideQuest} />}
    {ed && <EditDailyTaskModal task={ed} onClose={() => setEd(null)} onUpdate={updateDailyTask} />}{es && <EditSideQuestModal quest={es} onClose={() => setEs(null)} onUpdate={updateSideQuest} />}
    {sc && <DailyShareCardModal onClose={() => setSc(false)} />}
  </div>);
}

function P({ icon, title, bar, badge, onAdd, children }: { icon: React.ReactNode; title: string; bar: string; badge: string; onAdd: () => void; children: React.ReactNode }) {
  return <WireframeBox innerClassName=""><div className={`h-7 border-b-[0.5px] border-[#4A3B2C]/15 flex items-center justify-between px-3`}><div className="flex items-center gap-2"><div className={`w-1 h-4 ${bar}`} />{icon}<h3 className="text-[10px] font-black text-[#4A3B2C] uppercase tracking-widest">{title}</h3><span className="text-[9px] font-bold text-[#4A3B2C]/25 bg-[#E3D4BB] px-2 py-0.5 border border-[#4A3B2C]/10">{badge}</span></div><button onClick={onAdd} className="text-[10px] font-bold text-[#4A3B2C]/30 hover:text-[#4A3B2C] flex items-center gap-1"><Plus size={12} />添加</button></div><div className="p-3 space-y-2">{children}</div></WireframeBox>;
}
