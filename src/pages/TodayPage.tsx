import { useState, useCallback } from "react";
import { Sparkles, Compass, Heart, Home, Plus } from "lucide-react";
import { useApp } from "../AppContext";
import TaskCard from "../components/TaskCard";
import CompleteTaskModal from "../components/CompleteTaskModal";
import CreateTaskModal from "../components/CreateTaskModal";
import type { Task, Mood, EnergyLevel } from "../types";
import { ATTRIBUTE_EMOJI, ATTRIBUTE_LABELS } from "../types";
import { readableDate, today, daysSince } from "../utils/date";

export default function TodayPage() {
  const { state, completeTask, addJournal, addTask, todayTasks, todayCompletedTasks } = useApp();
  const [completedTask, setCompletedTask] = useState<Task | null>(null);
  const [showNewTask, setShowNewTask] = useState(false);

  const uncompleted = todayTasks.filter((t) => !t.completed);

  // 分类推荐
  const mainPush = uncompleted.filter((t) => t.type === "main" || t.type === "side").slice(0, 3);
  const adventures = uncompleted.filter((t) => t.type === "exploration").slice(0, 2);
  const selfCares = uncompleted.filter((t) => t.type === "selfCare" || t.type === "daily").slice(0, 2);
  const relationships = uncompleted.filter((t) => t.type === "relationship").slice(0, 2);

  const handleComplete = useCallback(
    (taskId: string) => {
      const task = state.tasks.find((t) => t.id === taskId);
      if (task) {
        completeTask(taskId);
        setCompletedTask(task);
      }
    },
    [completeTask, state.tasks]
  );

  const handleSaveJournal = useCallback(
    (content: string, mood: Mood, energy: EnergyLevel) => {
      if (completedTask && content.trim()) {
        addJournal({
          date: today(),
          taskId: completedTask.id,
          mood,
          energy,
          content: content.trim(),
          tags: [],
        });
      }
      setCompletedTask(null);
    },
    [completedTask, addJournal]
  );

  const todayExp = todayCompletedTasks.reduce((sum, t) => sum + t.expReward, 0);
  // 汇总今天获得的属性经验
  const attrExpToday: Record<string, number> = {};
  todayCompletedTasks.forEach((t) => {
    t.attributeRewards.forEach((ar) => {
      attrExpToday[ar.attribute] = (attrExpToday[ar.attribute] || 0) + ar.exp;
    });
  });

  const earthDays = daysSince(state.player.startDate);

  const getStatusText = () => {
    if (todayCompletedTasks.length >= 3) return "今天过得不错 🌿";
    if (todayCompletedTasks.length >= 1) return "已经开始行动了 ✨";
    return "适合轻量推进 🌱";
  };

  return (
    <div className="space-y-6">
      {/* 顶部问候 */}
      <div className="bg-gradient-to-br from-sage-light/40 to-cream rounded-2xl p-5 border border-sage-light/30">
        <p className="text-xs text-text-muted">{readableDate(today())}</p>
        <h2 className="text-xl font-semibold text-text-primary mt-1">
          今天是你来到地球的第 {earthDays} 天
        </h2>
        <p className="text-sm text-text-secondary mt-1">
          当前状态：{getStatusText()}
        </p>
      </div>

      {/* 今日推荐区域 */}
      <Section icon={<Compass size={18} />} title="今日主线推进" color="text-sage-dark">
        {mainPush.length > 0 ? (
          <div className="space-y-2">
            {mainPush.map((t) => (
              <TaskCard key={t.id} task={t} onComplete={handleComplete} />
            ))}
          </div>
        ) : (
          <EmptyHint text="今天没有主线任务。可以创建一条和生活有关的主线。" />
        )}
      </Section>

      <Section icon={<Sparkles size={18} />} title="今日小冒险" color="text-mist-blue">
        {adventures.length > 0 ? (
          <div className="space-y-2">
            {adventures.map((t) => (
              <TaskCard key={t.id} task={t} onComplete={handleComplete} />
            ))}
          </div>
        ) : (
          <EmptyHint text="今天没有探索任务。可以出门走走，发现一些新东西。" />
        )}
      </Section>

      <Section icon={<Heart size={18} />} title="今日自我照顾" color="text-soft-rose">
        {selfCares.length > 0 ? (
          <div className="space-y-2">
            {selfCares.map((t) => (
              <TaskCard key={t.id} task={t} onComplete={handleComplete} />
            ))}
          </div>
        ) : (
          <EmptyHint text="记得也要照顾一下自己。" />
        )}
      </Section>

      <Section icon={<Home size={18} />} title="今日关系任务" color="text-lavender">
        {relationships.length > 0 ? (
          <div className="space-y-2">
            {relationships.map((t) => (
              <TaskCard key={t.id} task={t} onComplete={handleComplete} />
            ))}
          </div>
        ) : (
          <EmptyHint text="今天没有关系任务。也许可以给朋友发一条消息。" />
        )}
      </Section>

      {/* 今日成长 */}
      <div className="bg-white/60 rounded-2xl border border-sage-light/30 p-4">
        <h3 className="font-medium text-text-primary text-sm mb-3">📊 今日成长</h3>
        {Object.keys(attrExpToday).length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {Object.entries(attrExpToday).map(([attr, exp]) => (
              <span
                key={attr}
                className="text-sm bg-cream-dark/70 text-text-primary px-3 py-1.5 rounded-full"
              >
                {ATTRIBUTE_EMOJI[attr as keyof typeof ATTRIBUTE_EMOJI]}{" "}
                {ATTRIBUTE_LABELS[attr as keyof typeof ATTRIBUTE_LABELS]} +{exp}
              </span>
            ))}
            <span className="text-sm bg-warm-gold-light text-warm-gold px-3 py-1.5 rounded-full font-medium">
              ⭐ 总经验 +{todayExp}
            </span>
          </div>
        ) : (
          <p className="text-sm text-text-muted">
            还没有记录今天的生活。可以先从一个很小的任务开始。
          </p>
        )}
      </div>

      {/* FAB 添加任务 */}
      <button
        onClick={() => setShowNewTask(true)}
        className="fixed bottom-20 md:bottom-6 right-4 md:right-6 w-12 h-12 bg-sage hover:bg-sage-dark text-white rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-105 active:scale-95 z-40"
      >
        <Plus size={24} />
      </button>

      {completedTask && (
        <CompleteTaskModal
          task={completedTask}
          onClose={() => setCompletedTask(null)}
          onSaveJournal={handleSaveJournal}
        />
      )}
      {showNewTask && (
        <CreateTaskModal
          questLines={state.questLines}
          onClose={() => setShowNewTask(false)}
          onCreate={addTask}
        />
      )}
    </div>
  );
}

function Section({
  icon,
  title,
  color,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  color: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <div className={`flex items-center gap-2 mb-2 ${color}`}>
        {icon}
        <h3 className="font-semibold text-sm text-text-primary">{title}</h3>
      </div>
      {children}
    </section>
  );
}

function EmptyHint({ text }: { text: string }) {
  return (
    <p className="text-xs text-text-muted bg-white/40 rounded-xl p-3 border border-sage-light/20">
      {text}
    </p>
  );
}
