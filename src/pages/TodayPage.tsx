import { useState, useCallback } from "react";
import { Compass, Heart, Home, Plus, Sparkles, TrendingUp } from "lucide-react";
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

  const mainPush = uncompleted.filter((t) => t.type === "main" || t.type === "side").slice(0, 3);
  const adventures = uncompleted.filter((t) => t.type === "exploration").slice(0, 2);
  const selfCares = uncompleted.filter((t) => t.type === "selfCare" || t.type === "daily").slice(0, 2);
  const relationships = uncompleted.filter((t) => t.type === "relationship").slice(0, 2);

  const handleComplete = useCallback(
    (taskId: string) => {
      const task = state.tasks.find((t) => t.id === taskId);
      if (task) { completeTask(taskId); setCompletedTask(task); }
    },
    [completeTask, state.tasks]
  );

  const handleSaveJournal = useCallback(
    (content: string, mood: Mood, energy: EnergyLevel) => {
      if (completedTask && content.trim()) {
        addJournal({ date: today(), taskId: completedTask.id, mood, energy, content: content.trim(), tags: [] });
      }
      setCompletedTask(null);
    },
    [completedTask, addJournal]
  );

  const todayExp = todayCompletedTasks.reduce((sum, t) => sum + t.expReward, 0);
  const attrExpToday: Partial<Record<LifeAttribute, number>> = {};
  todayCompletedTasks.forEach((t) => {
    t.attributeRewards.forEach((ar) => {
      attrExpToday[ar.attribute] = (attrExpToday[ar.attribute] || 0) + ar.exp;
    });
  });

  const earthDays = daysSince(state.player.startDate);
  const getStatusText = () => {
    if (todayCompletedTasks.length >= 3) return "今天过得不错";
    if (todayCompletedTasks.length >= 1) return "已经开始行动了";
    return "适合轻量推进";
  };

  return (
    <div className="space-y-6">
      {/* Hero */}
      <div className="relative overflow-hidden rounded-2xl bg-bg-elevated border border-border-subtle p-6">
        <div className="absolute top-0 right-0 w-64 h-64 bg-accent-glow rounded-full blur-3xl -translate-y-1/2 translate-x-1/4 opacity-30" />
        <div className="relative">
          <p className="text-[10px] text-text-muted font-mono tracking-wider">{readableDate(today())}</p>
          <h2 className="text-lg font-semibold text-text-primary mt-1 tracking-tight">
            今天是你来到地球的第 {earthDays} 天
          </h2>
          <div className="flex items-center gap-2 mt-2">
            <div className="w-1.5 h-1.5 rounded-full bg-green" />
            <p className="text-[11px] text-text-secondary">{getStatusText()}</p>
          </div>
        </div>
      </div>

      {/* Sections */}
      <Section icon={<TrendingUp size={15} />} title="今日主线推进">
        {mainPush.length > 0 ? (
          <div className="space-y-2 stagger-1">
            {mainPush.map((t) => <TaskCard key={t.id} task={t} onComplete={handleComplete} />)}
          </div>
        ) : <EmptyHint text="今天没有主线任务。创建一条和生活有关的主线。" />}
      </Section>

      <Section icon={<Compass size={15} />} title="今日小冒险" accent="text-cyan">
        {adventures.length > 0 ? (
          <div className="space-y-2 stagger-1">
            {adventures.map((t) => <TaskCard key={t.id} task={t} onComplete={handleComplete} />)}
          </div>
        ) : <EmptyHint text="今天没有探索任务。出门走走，发现一些新东西。" />}
      </Section>

      <Section icon={<Heart size={15} />} title="今日自我照顾" accent="text-rose">
        {selfCares.length > 0 ? (
          <div className="space-y-2 stagger-1">
            {selfCares.map((t) => <TaskCard key={t.id} task={t} onComplete={handleComplete} />)}
          </div>
        ) : <EmptyHint text="记得也要照顾一下自己。" />}
      </Section>

      <Section icon={<Home size={15} />} title="今日关系任务" accent="text-purple">
        {relationships.length > 0 ? (
          <div className="space-y-2 stagger-1">
            {relationships.map((t) => <TaskCard key={t.id} task={t} onComplete={handleComplete} />)}
          </div>
        ) : <EmptyHint text="也许可以给朋友发一条消息。" />}
      </Section>

      {/* Today's growth */}
      <div className="bg-bg-elevated/60 border border-border-subtle rounded-xl p-4">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles size={14} className="text-gold" />
          <h3 className="text-[11px] font-semibold text-text-primary uppercase tracking-wider">今日成长</h3>
        </div>
        {Object.keys(attrExpToday).length > 0 ? (
          <div className="flex flex-wrap gap-1.5">
            {(Object.entries(attrExpToday) as [LifeAttribute, number][]).map(([attr, exp]) => {
              const AttrIcon = ATTRIBUTE_ICONS[attr];
              return (
                <span key={attr} className="inline-flex items-center gap-1 text-[10px] bg-bg-glass border border-border-subtle px-2.5 py-1 rounded-full text-text-secondary">
                  <AttrIcon size={10} strokeWidth={1.5} />
                  {ATTRIBUTE_LABELS[attr]} +{exp}
                </span>
              );
            })}
            <span className="inline-flex items-center gap-1 text-[10px] font-medium bg-gold-surface/30 text-gold px-2.5 py-1 rounded-full border border-gold/20">
              <Sparkles size={10} /> +{todayExp} EXP
            </span>
          </div>
        ) : (
          <p className="text-[11px] text-text-muted">还没有记录今天的生活。可以先从一个很小的任务开始。</p>
        )}
      </div>

      {/* FAB */}
      <button
        onClick={() => setShowNewTask(true)}
        className="fixed bottom-20 md:bottom-6 right-4 md:right-6 w-11 h-11 bg-accent hover:bg-accent-soft text-white rounded-xl shadow-lg shadow-accent-glow flex items-center justify-center transition-all hover:scale-105 active:scale-95 z-40"
      >
        <Plus size={20} strokeWidth={2} />
      </button>

      {completedTask && (
        <CompleteTaskModal task={completedTask} onClose={() => setCompletedTask(null)} onSaveJournal={handleSaveJournal} />
      )}
      {showNewTask && (
        <CreateTaskModal questLines={state.questLines} onClose={() => setShowNewTask(false)} onCreate={addTask} />
      )}
    </div>
  );
}

function Section({ icon, title, accent = "text-accent", children }: { icon: React.ReactNode; title: string; accent?: string; children: React.ReactNode }) {
  return (
    <section>
      <div className={`flex items-center gap-2 mb-2.5 ${accent}`}>
        {icon}
        <h3 className="text-[11px] font-semibold text-text-primary uppercase tracking-wider">{title}</h3>
      </div>
      {children}
    </section>
  );
}

function EmptyHint({ text }: { text: string }) {
  return (
    <p className="text-[11px] text-text-muted bg-bg-elevated/40 rounded-xl p-4 border border-border-subtle border-dashed leading-relaxed">
      {text}
    </p>
  );
}
