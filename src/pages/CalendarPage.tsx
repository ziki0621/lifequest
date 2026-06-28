import { useState } from "react";
import { ChevronLeft, ChevronRight, Circle } from "lucide-react";
import { useApp } from "../AppContext";
import TaskCard from "../components/TaskCard";
import JournalCard from "../components/JournalCard";
import { daysInMonth, firstDayOfMonth, formatDate, today as todayStr } from "../utils/date";

export default function CalendarPage() {
  const { state, completeTask } = useApp();
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth());
  const [selectedDate, setSelectedDate] = useState<string | null>(todayStr());

  const prevMonth = () => {
    if (month === 0) {
      setYear(year - 1);
      setMonth(11);
    } else {
      setMonth(month - 1);
    }
  };
  const nextMonth = () => {
    if (month === 11) {
      setYear(year + 1);
      setMonth(0);
    } else {
      setMonth(month + 1);
    }
  };

  const days = daysInMonth(year, month);
  const firstDay = firstDayOfMonth(year, month);
  const cells: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= days; d++) cells.push(d);

  // 获取某天的任务和日记
  const getDayData = (day: number) => {
    const date = formatDate(new Date(year, month, day));
    const dayTasks = state.tasks.filter(
      (t) => t.dueDate === date || (t.completedAt && t.completedAt.startsWith(date))
    );
    const dayJournals = state.journalEntries.filter((j) => j.date === date);
    return { tasks: dayTasks, journals: dayJournals };
  };

  const selectedData = selectedDate
    ? {
        tasks: state.tasks.filter(
          (t) =>
            t.dueDate === selectedDate ||
            (t.completedAt && t.completedAt.startsWith(selectedDate))
        ),
        journals: state.journalEntries.filter((j) => j.date === selectedDate),
      }
    : { tasks: [], journals: [] };

  const isToday = (day: number) => {
    const d = formatDate(new Date(year, month, day));
    return d === todayStr();
  };

  return (
    <div className="space-y-6">
      {/* 日历头部 */}
      <div className="flex items-center justify-between">
        <button onClick={prevMonth} className="p-2 rounded-xl hover:bg-white/60 transition-colors text-text-secondary">
          <ChevronLeft size={20} />
        </button>
        <h2 className="text-lg font-semibold text-text-primary">
          {year}年 {month + 1}月
        </h2>
        <button onClick={nextMonth} className="p-2 rounded-xl hover:bg-white/60 transition-colors text-text-secondary">
          <ChevronRight size={20} />
        </button>
      </div>

      {/* 月视图 */}
      <div className="bg-white/60 rounded-2xl border border-sage-light/30 p-3 md:p-4">
        {/* 星期头 */}
        <div className="grid grid-cols-7 mb-2">
          {["日", "一", "二", "三", "四", "五", "六"].map((w) => (
            <div key={w} className="text-center text-xs font-medium text-text-muted py-1">
              {w}
            </div>
          ))}
        </div>
        {/* 日期格子 */}
        <div className="grid grid-cols-7 gap-1">
          {cells.map((day, i) => {
            if (day === null) return <div key={`empty-${i}`} />;
            const date = formatDate(new Date(year, month, day));
            const { tasks, journals } = getDayData(day);
            const hasTask = tasks.some((t) => !t.completed);
            const hasCompleted = tasks.some((t) => t.completed);
            const hasJournal = journals.length > 0;
            const selected = date === selectedDate;

            return (
              <button
                key={day}
                onClick={() => setSelectedDate(date)}
                className={`aspect-square rounded-xl flex flex-col items-center justify-center text-sm transition-all relative ${
                  selected
                    ? "bg-sage-light text-sage-dark font-semibold"
                    : isToday(day)
                    ? "bg-warm-gold-light/50 text-text-primary font-medium"
                    : "hover:bg-cream-dark/30 text-text-primary"
                }`}
              >
                <span className={isToday(day) ? "text-warm-gold font-bold" : ""}>{day}</span>
                <div className="flex gap-0.5 mt-0.5">
                  {hasTask && <Circle size={5} className="fill-mist-blue text-mist-blue" />}
                  {hasCompleted && <Circle size={5} className="fill-sage text-sage" />}
                  {hasJournal && <Circle size={5} className="fill-lavender text-lavender" />}
                </div>
              </button>
            );
          })}
        </div>
        {/* 图例 */}
        <div className="flex items-center gap-4 mt-3 text-xs text-text-muted">
          <span className="flex items-center gap-1">
            <Circle size={5} className="fill-mist-blue text-mist-blue" /> 有任务
          </span>
          <span className="flex items-center gap-1">
            <Circle size={5} className="fill-sage text-sage" /> 有完成记录
          </span>
          <span className="flex items-center gap-1">
            <Circle size={5} className="fill-lavender text-lavender" /> 有日记
          </span>
        </div>
      </div>

      {/* 选中日期的详情 */}
      {selectedDate && (
        <div className="space-y-3">
          <h3 className="font-medium text-text-primary text-sm">{selectedDate}</h3>
          {selectedData.tasks.length === 0 && selectedData.journals.length === 0 ? (
            <p className="text-sm text-text-muted bg-white/40 rounded-xl p-4 border border-sage-light/20">
              这一天还没有安排。空白也是生活的一部分。
            </p>
          ) : (
            <>
              {selectedData.tasks.map((t) => (
                <TaskCard key={t.id} task={t} onComplete={completeTask} compact />
              ))}
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
