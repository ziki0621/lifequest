import { useState, useCallback } from "react";
import { Zap, Plus, Sparkles } from "lucide-react";
import { useApp } from "../hooks/useApp";
import TaskCard from "../components/TaskCard";
import CompleteTaskModal from "../components/CompleteTaskModal";
import CreateTaskModal from "../components/CreateTaskModal";
import type { Task, Mood, EnergyLevel, LifeAttribute } from "../types";
import { ATTRIBUTE_ICONS, ATTRIBUTE_LABELS } from "../types";
import { readableDate, today, daysSince } from "../utils/date";

export default function TodayPage() {
  const { state, completeTask, addJournal, addTask, todayTasks, todayCompletedTasks } = useApp();
  const [completedTask, setCompletedTask] = useState<Task | null>(null);
  const [showNewTask, setShowNewTask] = useState(false);

  const uncompleted = todayTasks.filter((t) => !t.completed);

  const handleComplete = useCallback((taskId: string) => {
    const task = state.tasks.find((t) => t.id === taskId);
    if (task) { completeTask(taskId); setCompletedTask(task); }
  }, [completeTask, state.tasks]);

  const handleSaveJournal = useCallback((content: string, mood: Mood, energy: EnergyLevel) => {
    if (completedTask && content.trim()) {
      addJournal({ date: today(), taskId: completedTask.id, mood, energy, content: content.trim(), tags: [] });
    }
    setCompletedTask(null);
  }, [completedTask, addJournal]);

  const todayExp = todayCompletedTasks.reduce((sum, t) => sum + t.expReward, 0);
  const attrExp: Partial<Record<LifeAttribute, number>> = {};
  todayCompletedTasks.forEach((t) => t.attributeRewards.forEach((ar) => {
    attrExp[ar.attribute] = (attrExp[ar.attribute] || 0) + ar.exp;
  }));

  const earthDays = daysSince(state.player.startDate);
  const status = todayCompletedTasks.length >= 3 ? "今天过得不错" : todayCompletedTasks.length >= 1 ? "已经开始行动了" : "适合轻量推进";

  // Group tasks
  const mainPush = uncompleted.filter((t) => t.type === "main" || t.type === "side").slice(0, 4);
  const adventures = uncompleted.filter((t) => t.type === "exploration").slice(0, 2);
  const selfCares = uncompleted.filter((t) => t.type === "selfCare" || t.type === "daily").slice(0, 2);
  const relationships = uncompleted.filter((t) => t.type === "relationship").slice(0, 2);

  const sections = [
    { label: "今日主线推进", tasks: mainPush },
    { label: "今日小冒险", tasks: adventures },
    { label: "今日自我照顾", tasks: selfCares },
    { label: "今日关系任务", tasks: relationships },
  ].filter((s) => s.tasks.length > 0);

  return (
    <div className="space-y-10 pb-24 animate-in">
      {/* Hero */}
      <div className="pt-2 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <p className="text-coral font-bold text-xs tracking-widest uppercase mb-2">今天是你来到地球的第 {earthDays} 天</p>
          <h2 className="text-3xl md:text-4xl font-black text-navy tracking-tight serif leading-tight">
            {todayCompletedTasks.length > 0 ? "用心经营你的日常生活" : "选择一个小任务开始"}
          </h2>
          <p className="text-[11px] font-bold text-navy/40 uppercase tracking-widest mt-2">{readableDate(today())} · {status}</p>
        </div>
        <div className="glass rounded-full px-5 py-2.5 flex items-center gap-2">
          <Zap size={16} className="text-coral" />
          <span className="font-black text-navy text-sm">{state.player.totalExp} XP</span>
        </div>
      </div>

      {/* Task sections */}
      {sections.map((sec) => (
        <section key={sec.label}>
          <div className="flex items-center gap-3 mb-3">
            <h3 className="text-[11px] font-bold text-navy/40 uppercase tracking-widest">{sec.label}</h3>
            <div className="flex-1 h-px bg-navy/5" />
          </div>
          <div className="space-y-3 stagger-1">
            {sec.tasks.map((t) => <TaskCard key={t.id} task={t} onComplete={handleComplete} />)}
          </div>
        </section>
      ))}

      {uncompleted.length === 0 && (
        <div className="glass rounded-3xl p-10 text-center">
          <p className="text-navy/40 font-bold text-xs tracking-widest uppercase">今天还没有任务</p>
          <p className="text-navy/30 text-[11px] font-medium mt-1">可以为自己安排一个很小的生活行动。</p>
        </div>
      )}

      {/* Today's growth */}
      {Object.keys(attrExp).length > 0 && (
        <section className="glass rounded-3xl p-5 space-y-3">
          <h3 className="text-[10px] font-bold text-navy/40 uppercase tracking-widest">今日成长属性</h3>
          {(Object.entries(attrExp) as [LifeAttribute, number][]).map(([attr, exp]) => {
            const AIcon = ATTRIBUTE_ICONS[attr];
            return (
              <div key={attr} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-coral" />
                  <AIcon size={12} className="text-navy/60" />
                  <span className="text-[11px] font-bold text-navy tracking-widest">{ATTRIBUTE_LABELS[attr]}</span>
                </div>
                <span className="font-black text-coral text-sm">+{exp}</span>
              </div>
            );
          })}
          <div className="flex items-center justify-between pt-2 border-t border-navy/5">
            <span className="text-[11px] font-bold text-navy tracking-widest flex items-center gap-1.5"><Sparkles size={12} /> 总经验</span>
            <span className="font-black text-navy text-sm">+{todayExp}</span>
          </div>
        </section>
      )}

      {/* FAB */}
      <button onClick={() => setShowNewTask(true)}
        className="fixed bottom-20 md:bottom-6 right-4 md:right-6 w-12 h-12 bg-navy text-white rounded-full shadow-xl shadow-navy/30 flex items-center justify-center transition-all hover:scale-105 active:scale-95 z-40">
        <Plus size={20} strokeWidth={2.5} />
      </button>

      {completedTask && <CompleteTaskModal task={completedTask} onClose={() => setCompletedTask(null)} onSaveJournal={handleSaveJournal} />}
      {showNewTask && <CreateTaskModal questLines={state.questLines} onClose={() => setShowNewTask(false)} onCreate={addTask} />}
    </div>
  );
}
