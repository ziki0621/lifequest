import { useState } from "react";
import { CalendarClock, ChevronLeft, ChevronRight } from "lucide-react";
import { useApp } from "../hooks/useApp";
import CompletionCard from "../components/CompletionCard";
import JournalCard from "../components/JournalCard";
import type { CompletionContext, JournalEntry, LinkedTask, SideQuest } from "../types";
import { DOMAIN_LABELS } from "../types";
import { daysInMonth, firstDayOfMonth, formatDate, today as todayStr } from "../utils/date";
import { defaultAttributeRewards, getStageReward } from "../utils/exp";

interface DayData { completions: { ctx: CompletionContext; date: string }[]; dueItems: SideQuest[]; journals: (JournalEntry & { linked?: LinkedTask })[]; }

export default function CalendarPage() {
  const { state } = useApp();
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth());
  const [selectedDate, setSelectedDate] = useState<string | null>(todayStr());

  const prevMonth = () => { if (month === 0) { setYear(year - 1); setMonth(11); } else setMonth(month - 1); };
  const nextMonth = () => { if (month === 11) { setYear(year + 1); setMonth(0); } else setMonth(month + 1); };

  const days = daysInMonth(year, month);
  const firstDay = firstDayOfMonth(year, month);
  const cells: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= days; d++) cells.push(d);

  const dateToData = new Map<string, DayData>();
  const ensure = (d: string) => { if (!dateToData.has(d)) dateToData.set(d, { completions: [], dueItems: [], journals: [] }); return dateToData.get(d)!; };

  state.questBooks.forEach((qb) => {
    qb.questLines.forEach((ql) => {
      ql.stages.forEach((s, stageIdx) => {
        if (s.completed && s.completedAt) {
          const d = s.completedAt.slice(0, 10);
          const { expReward, attributeRewards } = getStageReward(qb, ql.id, stageIdx);
          ensure(d).completions.push({ ctx: { itemType: "questStage", itemId: s.id, title: s.title, expReward, attributeRewards }, date: d });
        }
      });
    });
    qb.directTasks.forEach((t) => { if (t.completed && t.completedAt) { const d = t.completedAt.slice(0, 10); ensure(d).completions.push({ ctx: { itemType: "questBookTask", itemId: t.id, title: t.title, expReward: 10, attributeRewards: defaultAttributeRewards(qb.domain, 10) }, date: d }); } });
  });
  state.dailyTasks.forEach((dt) => dt.completions.forEach((d) => ensure(d).completions.push({ ctx: { itemType: "daily", itemId: dt.id, title: dt.title, expReward: dt.expReward, attributeRewards: dt.attributeRewards }, date: d })));
  state.sideQuests.forEach((sq) => {
    if (sq.completed && sq.completedAt) { const d = sq.completedAt.slice(0, 10); ensure(d).completions.push({ ctx: { itemType: "sideQuest", itemId: sq.id, title: sq.title, expReward: sq.expReward, attributeRewards: sq.attributeRewards }, date: d }); }
    if (sq.dueDate) ensure(sq.dueDate).dueItems.push(sq);
  });

  state.journalEntries.forEach((j) => {
    let linked: LinkedTask | undefined;
    if (j.taskId) {
      for (const qb of state.questBooks) {
        for (const ql of qb.questLines) {
          const s = ql.stages.find((st) => st.id === j.taskId); if (s) { linked = { type: "questStage", title: s.title, attributeRewards: [] }; break; }
        }
        if (!linked) { const t = qb.directTasks.find((dt) => dt.id === j.taskId); if (t) linked = { type: "questBookTask", title: t.title, attributeRewards: [] }; }
        if (linked) break;
      }
      if (!linked) { const dt = state.dailyTasks.find((t) => t.id === j.taskId); if (dt) linked = { type: "daily", title: dt.title, attributeRewards: dt.attributeRewards }; }
      if (!linked) { const sq = state.sideQuests.find((s) => s.id === j.taskId); if (sq) linked = { type: "sideQuest", title: sq.title, attributeRewards: sq.attributeRewards }; }
    }
    ensure(j.date).journals.push({ ...j, linked });
  });

  const emptyDay: DayData = { completions: [], dueItems: [], journals: [] };
  const sel = selectedDate ? (dateToData.get(selectedDate) || emptyDay) : emptyDay;

  return (
    <div className="space-y-8 animate-in pb-24">
      <div className="flex justify-between items-end"><div><p className="text-coral font-bold text-xs tracking-widest uppercase mb-1">地球时间轴</p><h2 className="text-2xl font-black text-navy tracking-tight serif">日历</h2></div><div className="text-xs font-black tracking-widest text-navy border-b-2 border-navy pb-0.5 uppercase">{year}.{String(month + 1).padStart(2, "0")}</div></div>
      <div className="wireframe wireframe-inner p-5">
        <div className="flex items-center justify-between mb-4"><button onClick={prevMonth} className="p-2 rounded-full hover:bg-navy/5 text-navy/50"><ChevronLeft size={16} /></button><span className="text-xs font-black text-navy/40 uppercase tracking-widest">{year}年 {month + 1}月</span><button onClick={nextMonth} className="p-2 rounded-full hover:bg-navy/5 text-navy/50"><ChevronRight size={16} /></button></div>
        <div className="grid grid-cols-7 gap-y-5 gap-x-1 text-center">{["日","一","二","三","四","五","六"].map((d) => <div key={d} className="text-[10px] font-bold text-navy/25 uppercase tracking-widest">{d}</div>)}
          {cells.map((day, i) => {
            if (day === null) return <div key={`e-${i}`} />;
            const date = formatDate(new Date(year, month, day));
            const data = dateToData.get(date);
            const hasComp = (data?.completions.length ?? 0) > 0;
            const hasDue = (data?.dueItems.length ?? 0) > 0;
            const hasJournal = (data?.journals.length ?? 0) > 0;
            const selected = date === selectedDate;
            const isToday = date === todayStr();
            return (<div key={day} className="flex justify-center"><button onClick={() => setSelectedDate(date)} className={`w-9 h-9 flex items-center justify-center rounded-full text-xs font-bold transition-all duration-300 relative ${selected ? "bg-theme text-white shadow-lg scale-110" : isToday ? "bg-coral/10 text-coral font-black" : hasComp || hasDue || hasJournal ? "text-navy/70" : "text-navy/30 hover:bg-white/60"}`}><div className="relative">{day}<div className="absolute -bottom-1 left-1/2 -translate-x-1/2 flex gap-0.5">{hasComp && <div className="w-1 h-1 rounded-full bg-coral" />}{hasDue && <div className="w-1 h-1 rounded-full bg-leaf" />}{hasJournal && <div className="w-1 h-1 rounded-full bg-theme" />}</div></div></button></div>);
          })}
        </div>
        <div className="flex items-center gap-4 mt-5 pt-3 border-t border-navy/5 text-[9px] font-bold text-navy/30 uppercase tracking-widest"><span className="flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-coral" /> 有记录</span><span className="flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-leaf" /> 有截止</span><span className="flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-theme" /> 有日记</span></div>
      </div>
      {selectedDate && (<div className="space-y-3"><h3 className="text-[11px] font-bold text-navy/40 uppercase tracking-widest">{selectedDate}</h3>{sel.completions.length === 0 && sel.dueItems.length === 0 && sel.journals.length === 0 ? <div className="wireframe wireframe-inner p-8 text-center"><p className="text-navy/30 font-bold text-[11px] tracking-widest">这一天还没有安排。</p></div> : <>{sel.completions.map((c, i) => <CompletionCard key={`comp-${i}`} ctx={c.ctx} date={c.date} />)}{sel.dueItems.map((item) => <DueItemCard key={`due-${item.id}`} item={item} />)}{sel.journals.map((j) => <JournalCard key={j.id} entry={j} linkedItem={j.linked} />)}</>}</div>)}
    </div>
  );
}

function DueItemCard({ item }: { item: SideQuest }) {
  return (
    <div className="p-3 flex items-center gap-3">
      <div className="w-8 h-8 rounded-full bg-leaf text-white flex items-center justify-center flex-shrink-0"><CalendarClock size={14} /></div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2"><span className="text-[10px] font-bold text-navy/30 uppercase tracking-widest">支线截止</span>{item.completed && <span className="text-[10px] font-bold text-leaf">已完成</span>}</div>
        <p className="text-[12px] font-black text-navy">{item.title}</p>
        <p className="text-[9px] font-bold text-navy/30 mt-1">{DOMAIN_LABELS[item.domain]} · {item.difficulty === "easy" ? "简单" : item.difficulty === "normal" ? "普通" : "困难"}</p>
      </div>
    </div>
  );
}
