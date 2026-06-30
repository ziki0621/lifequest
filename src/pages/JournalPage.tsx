import { useState, useMemo } from "react";
import { Plus, Edit3, BookOpen, Target, ListTodo, CheckCircle2 } from "lucide-react";
import { useApp } from "../hooks/useApp";
import JournalCard from "../components/JournalCard";
import CreateJournalModal from "../components/CreateJournalModal";
import NpcAgentPanel from "../components/NpcAgentPanel";
import AgentChatModal from "../components/AgentChatModal";
import { NPCS } from "../data/npcs";
import { getNiaReply } from "../services/journalAgent";
import type { Mood, EnergyLevel, LinkedTask, DailyTask } from "../types";
import { ATTRIBUTE_ICONS, ATTRIBUTE_LABELS, ATTR_COLOR } from "../types";
import { today } from "../utils/date";

export default function JournalPage() {
  const { state, addJournal } = useApp();
  const [tab, setTab] = useState<"diary" | "log">("diary");
  const [showCreate, setShowCreate] = useState(false);
  const [showNiaChat, setShowNiaChat] = useState(false);
  const [niaMessage, setNiaMessage] = useState("今天有没有一句话想留下？");

  const findLinked = (taskId: string): LinkedTask | undefined => {
    for (const qb of state.questBooks) { for (const ql of qb.questLines) { const s = ql.stages.find((st) => st.id === taskId); if (s) return { type: "questStage", title: s.title, attributeRewards: [] }; } const t = qb.directTasks.find((dt) => dt.id === taskId); if (t) return { type: "questBookTask", title: t.title, attributeRewards: [] }; }
    const dt = state.dailyTasks.find((d) => d.id === taskId); if (dt) return { type: "daily", title: dt.title, attributeRewards: dt.attributeRewards };
    const sq = state.sideQuests.find((s) => s.id === taskId); if (sq) return { type: "sideQuest", title: sq.title, attributeRewards: sq.attributeRewards };
    return undefined;
  };
  const diaryEntries = state.journalEntries.filter((j) => !j.taskId).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  const taskLogs = state.journalEntries.filter((j) => j.taskId).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const completedStages = useMemo(() => { const items: { id: string; title: string; bookTitle: string; completedAt: string }[] = []; state.questBooks.forEach((qb) => qb.questLines.forEach((ql) => ql.stages.filter((s) => s.completed && s.completedAt).forEach((s) => items.push({ id: s.id, title: s.title, bookTitle: qb.title, completedAt: s.completedAt! })))); return items.sort((a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime()); }, [state.questBooks]);
  const completedBookTasks = useMemo(() => { const items: { id: string; title: string; bookTitle: string; completedAt: string }[] = []; state.questBooks.forEach((qb) => qb.directTasks.filter((t) => t.completed && t.completedAt).forEach((t) => items.push({ id: t.id, title: t.title, bookTitle: qb.title, completedAt: t.completedAt! }))); return items.sort((a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime()); }, [state.questBooks]);
  const dailyCompletions = useMemo(() => { const items: { task: DailyTask; date: string }[] = []; state.dailyTasks.forEach((dt) => dt.completions.forEach((d) => items.push({ task: dt, date: d }))); return items.sort((a, b) => b.date.localeCompare(a.date)); }, [state.dailyTasks]);
  const completedSides = useMemo(() => state.sideQuests.filter((sq) => sq.completed).sort((a, b) => new Date(b.completedAt!).getTime() - new Date(a.completedAt!).getTime()), [state.sideQuests]);

  const handleSave = (data: { date: string; mood: Mood; energy: EnergyLevel; content: string; tags: string[] }) => { addJournal({ date: data.date, mood: data.mood, energy: data.energy, content: data.content, tags: data.tags }); };
  const handleNiaSubmit = (content: string) => { const r = getNiaReply(content); addJournal({ date: today(), mood: r.mood || "calm", energy: r.energy || "normal", content, tags: r.tags || [] }); setNiaMessage(r.npcReply); setShowNiaChat(false); };
  const entries = tab === "diary" ? diaryEntries : taskLogs;

  return (
    <div className="space-y-6 pb-24 animate-in">
      <NpcAgentPanel npc={NPCS.nia} message={niaMessage} actionLabel="写一句日志" onAction={() => setShowNiaChat(true)} />
      <div className="flex justify-between items-center"><div><p className="text-coral font-bold text-xs tracking-widest uppercase mb-1">记录</p><h2 className="text-2xl font-black text-ink tracking-tight serif">生活日志</h2></div>
        <div className="chamfer-btn h-9" onClick={() => setShowCreate(true)}><div className="chamfer-outer"><div className="chamfer-gap"><div className="chamfer-inner"><div className="chamfer-core px-4"><Edit3 size={13} /><span className="text-[10px] font-bold ml-1.5">撰写日志</span></div></div></div></div></div>
      </div>
      <div className="chamfer-tabs"><div className={`chamfer-tab ${tab === "diary" ? "is-active" : ""}`} onClick={() => setTab("diary")}><div className="chamfer-tab-gap"><div className="chamfer-tab-inner"><div className="chamfer-tab-core"><BookOpen size={13} /><span className="text-[9px] font-bold ml-1 tracking-widest">每日日记</span></div></div></div></div><div className={`chamfer-tab ${tab === "log" ? "is-active" : ""}`} onClick={() => setTab("log")}><div className="chamfer-tab-gap"><div className="chamfer-tab-inner"><div className="chamfer-tab-core"><Edit3 size={13} /><span className="text-[9px] font-bold ml-1 tracking-widest">任务日志</span></div></div></div></div></div>
      <div className="chamfer-tab-base" />

      {tab === "diary" ? (
        entries.length > 0 ? <div className="space-y-4 stagger-1 md:ml-10">{entries.map((e) => <JournalCard key={e.id} entry={e} linkedItem={e.taskId ? findLinked(e.taskId) : undefined} />)}</div>
          : <div className="wireframe"><div className="wireframe-inner p-10 text-center"><p className="text-ink/30 font-bold text-xs tracking-widest uppercase">这里会慢慢记录你在地球上的生活痕迹。</p></div></div>
      ) : (
        <div className="space-y-6">
          <P icon={<Target size={15} />} title="已完成任务书阶段" accentBar="bg-ink" badge={`${completedStages.length}`}>{completedStages.length === 0 ? <E>暂无。</E> : completedStages.map((s) => <div key={s.id} className="wireframe wireframe-shaded"><div className="wireframe-inner p-3 flex justify-between gap-3"><div><span className="text-[9px] text-ink/25">{s.bookTitle}</span><h4 className="text-[12px] font-bold text-ink">{s.title}</h4></div><span className="text-[10px] font-mono text-ink/30">{s.completedAt.slice(0, 10)}</span></div></div>)}</P>
          <P icon={<CheckCircle2 size={15} />} title="已完成直接任务" accentBar="bg-coral" badge={`${completedBookTasks.length}`}>{completedBookTasks.length === 0 ? <E>暂无。</E> : completedBookTasks.map((t) => <div key={t.id} className="wireframe wireframe-shaded"><div className="wireframe-inner p-3 flex justify-between gap-3"><div><span className="text-[9px] text-ink/25">{t.bookTitle}</span><h4 className="text-[12px] font-bold text-ink">{t.title}</h4></div><span className="text-[10px] font-mono text-ink/30">{t.completedAt.slice(0, 10)}</span></div></div>)}</P>
          <P icon={<ListTodo size={15} />} title="日常打卡记录" accentBar="bg-leaf" badge={`${dailyCompletions.length}`}>{dailyCompletions.length === 0 ? <E>暂无。</E> : dailyCompletions.map(({ task, date }, i) => <div key={`${task.id}-${i}`} className="wireframe wireframe-shaded"><div className="wireframe-inner p-3 flex justify-between gap-3"><div><h4 className="text-[12px] font-bold text-ink">{task.title}</h4><div className="flex gap-1.5">{task.attributeRewards.map((ar) => { const AI = ATTRIBUTE_ICONS[ar.attribute]; return <span key={ar.attribute} className="text-[9px]" style={{ color: ATTR_COLOR[ar.attribute] }}><AI size={9} /> {ATTRIBUTE_LABELS[ar.attribute]} +{ar.exp}</span>; })}</div></div><span className="text-[10px] font-mono text-ink/30">{date}</span></div></div>)}</P>
          <P icon={<CheckCircle2 size={15} />} title="已完成支线" accentBar="bg-leaf" badge={`${completedSides.length}`}>{completedSides.length === 0 ? <E>暂无。</E> : completedSides.map((sq) => <div key={sq.id} className="wireframe wireframe-shaded"><div className="wireframe-inner p-3 flex justify-between gap-3"><div><h4 className="text-[12px] font-bold text-ink">{sq.title}</h4><div className="flex gap-1.5">{sq.attributeRewards.map((ar) => { const AI = ATTRIBUTE_ICONS[ar.attribute]; return <span key={ar.attribute} className="text-[9px]" style={{ color: ATTR_COLOR[ar.attribute] }}><AI size={9} /> +{ar.exp}</span>; })}</div></div><span className="text-[10px] font-mono text-ink/30">{sq.completedAt?.slice(0, 10)}</span></div></div>)}</P>
        </div>
      )}

      <div className="chamfer-btn w-12 h-12 fixed bottom-20 md:bottom-6 right-4 md:right-6 z-40" onClick={() => setShowCreate(true)}><div className="chamfer-outer"><div className="chamfer-gap"><div className="chamfer-inner"><div className="chamfer-core"><Plus size={20} strokeWidth={2.5} /></div></div></div></div></div>
      {showCreate && <CreateJournalModal defaultDate={today()} onClose={() => setShowCreate(false)} onSave={handleSave} />}
      {showNiaChat && <AgentChatModal npc={NPCS.nia} title="写入旅人日志" intro="说一句今天的状态就好。" placeholder="例如：今天很累，但还是完成了一点。" taskTypes={[]} onClose={() => setShowNiaChat(false)} onSubmit={(text) => handleNiaSubmit(text)} />}
    </div>
  );
}
function P({ icon, title, accentBar, badge, children }: { icon: React.ReactNode; title: string; accentBar: string; badge: string; children: React.ReactNode }) {
  return <div className="wireframe"><div className="wireframe-inner"><div className="h-7 border-b-[0.5px] border-ink/15 flex items-center gap-2 px-3"><div className={`w-1 h-4 ${accentBar}`} />{icon}<h3 className="text-[10px] font-black text-ink uppercase tracking-widest">{title}</h3><span className="text-[9px] font-bold text-ink/25 bg-parchment-dark px-2 py-0.5 border border-ink/10">{badge}</span></div><div className="p-3 space-y-2">{children}</div></div></div>;
}
function E({ children }: { children: React.ReactNode }) { return <div className="text-center py-6"><p className="text-[10px] font-medium text-ink/25">{children}</p></div>; }
