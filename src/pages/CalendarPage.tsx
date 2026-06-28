import { useState } from "react";
import { ChevronLeft, ChevronRight, Circle } from "lucide-react";
import { useApp } from "../hooks/useApp";
import TaskCard from "../components/TaskCard";
import JournalCard from "../components/JournalCard";
import type { Task, JournalEntry } from "../types";
import { daysInMonth, firstDayOfMonth, formatDate, today as todayStr } from "../utils/date";

interface DayData { tasks: Task[]; journals: JournalEntry[]; }

export default function CalendarPage() {
  const { state, completeTask } = useApp();
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth());
  const [selectedDate, setSelectedDate] = useState<string | null>(todayStr());

  const prevMonth = () => {
    if (month === 0) { setYear(year - 1); setMonth(11); }
    else setMonth(month - 1);
  };
  const nextMonth = () => {
    if (month === 11) { setYear(year + 1); setMonth(0); }
    else setMonth(month + 1);
  };

  const days = daysInMonth(year, month);
  const firstDay = firstDayOfMonth(year, month);
  const cells: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= days; d++) cells.push(d);

  const dateToData = new Map<string, DayData>();
  for (const t of state.tasks) {
    const dates = new Set<string>();
    if (t.dueDate) dates.add(t.dueDate);
    if (t.completedAt) dates.add(t.completedAt.split("T")[0]);
    dates.forEach((d) => {
      if (!dateToData.has(d)) dateToData.set(d, { tasks: [], journals: [] });
      dateToData.get(d)!.tasks.push(t);
    });
  }
  for (const j of state.journalEntries) {
    if (!dateToData.has(j.date)) dateToData.set(j.date, { tasks: [], journals: [] });
    dateToData.get(j.date)!.journals.push(j);
  }

  const selectedData = selectedDate ? (dateToData.get(selectedDate) || { tasks: [], journals: [] }) : { tasks: [], journals: [] };

  const checkToday = (day: number) => formatDate(new Date(year, month, day)) === todayStr();

  return (
    <div className="space-y-6 animate-fade">
      {/* Month nav */}
      <div className="flex items-center justify-between">
        <button onClick={prevMonth} className="p-2 rounded-lg hover:bg-bg-glass transition-colors text-text-secondary">
          <ChevronLeft size={18} />
        </button>
        <h2 className="text-sm font-semibold text-text-primary tabular-nums">
          {year}.{String(month + 1).padStart(2, "0")}
        </h2>
        <button onClick={nextMonth} className="p-2 rounded-lg hover:bg-bg-glass transition-colors text-text-secondary">
          <ChevronRight size={18} />
        </button>
      </div>

      {/* Calendar grid */}
      <div className="bg-bg-elevated border border-border-subtle rounded-xl p-4">
        <div className="grid grid-cols-7 mb-2">
          {["日", "一", "二", "三", "四", "五", "六"].map((w) => (
            <div key={w} className="text-center text-[10px] font-medium text-text-muted py-1 tracking-wider">{w}</div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {cells.map((day, i) => {
            if (day === null) return <div key={`e-${i}`} />;
            const date = formatDate(new Date(year, month, day));
            const data = dateToData.get(date);
            const hasTask = data?.tasks.some((t) => !t.completed) ?? false;
            const hasDone = data?.tasks.some((t) => t.completed) ?? false;
            const hasJournal = (data?.journals.length ?? 0) > 0;
            const selected = date === selectedDate;
            const isToday = checkToday(day);

            return (
              <button
                key={day}
                onClick={() => setSelectedDate(date)}
                className={`aspect-square rounded-lg flex flex-col items-center justify-center text-[11px] transition-all relative ${
                  selected
                    ? "bg-accent text-white font-semibold shadow-lg shadow-accent-glow"
                    : isToday
                    ? "bg-accent-surface/30 text-accent font-medium"
                    : "text-text-secondary hover:bg-bg-glass"
                }`}
              >
                <span className={isToday && !selected ? "font-semibold" : ""}>{day}</span>
                <div className="flex gap-0.5 mt-0.5">
                  {hasTask && <Circle size={4} className={`fill-cyan text-cyan ${selected ? "fill-white text-white" : ""}`} />}
                  {hasDone && <Circle size={4} className={`fill-green text-green ${selected ? "fill-white text-white" : ""}`} />}
                  {hasJournal && <Circle size={4} className={`fill-purple text-purple ${selected ? "fill-white text-white" : ""}`} />}
                </div>
              </button>
            );
          })}
        </div>
        {/* Legend */}
        <div className="flex items-center gap-4 mt-4 pt-3 border-t border-border-subtle text-[10px] text-text-muted">
          <span className="flex items-center gap-1"><Circle size={4} className="fill-cyan text-cyan" /> 有任务</span>
          <span className="flex items-center gap-1"><Circle size={4} className="fill-green text-green" /> 有完成</span>
          <span className="flex items-center gap-1"><Circle size={4} className="fill-purple text-purple" /> 有日记</span>
        </div>
      </div>

      {/* Selected date detail */}
      {selectedDate && (
        <div className="space-y-3 animate-in">
          <h3 className="text-[11px] font-semibold text-text-primary uppercase tracking-wider">{selectedDate}</h3>
          {selectedData.tasks.length === 0 && selectedData.journals.length === 0 ? (
            <p className="text-[11px] text-text-muted bg-bg-elevated/40 rounded-xl p-4 border border-border-subtle border-dashed">
              这一天还没有安排。空白也是生活的一部分。
            </p>
          ) : (
            <>
              {selectedData.tasks.map((t) => <TaskCard key={t.id} task={t} onComplete={completeTask} compact />)}
              {selectedData.journals.map((j) => (
                <JournalCard key={j.id} entry={j} task={state.tasks.find((t) => t.id === j.taskId)} />
              ))}
            </>
          )}
        </div>
      )}
    </div>
  );
}
