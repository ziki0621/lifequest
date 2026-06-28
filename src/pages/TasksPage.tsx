import { useState } from "react";
import { Plus, ArrowLeft } from "lucide-react";
import { useApp } from "../hooks/useApp";
import QuestLineCard from "../components/QuestLineCard";
import TaskCard from "../components/TaskCard";
import CompleteTaskModal from "../components/CompleteTaskModal";
import CreateTaskModal from "../components/CreateTaskModal";
import CreateQuestLineModal from "../components/CreateQuestLineModal";
import type { Task, Mood, EnergyLevel } from "../types";
import { today } from "../utils/date";

export default function TasksPage() {
  const { state, completeTask, addJournal, addTask, addQuestLine } = useApp();
  const [selectedQL, setSelectedQL] = useState<string | null>(null);
  const [completedTask, setCompletedTask] = useState<Task | null>(null);
  const [showNewTask, setShowNewTask] = useState(false);
  const [showNewQL, setShowNewQL] = useState(false);

  const handleComplete = (taskId: string) => {
    const task = state.tasks.find((t) => t.id === taskId);
    if (task) { completeTask(taskId); setCompletedTask(task); }
  };

  const handleSaveJournal = (content: string, mood: Mood, energy: EnergyLevel) => {
    if (completedTask && content.trim()) {
      addJournal({ date: today(), taskId: completedTask.id, mood, energy, content: content.trim(), tags: [] });
    }
    setCompletedTask(null);
  };

  // QuestLine detail view
  if (selectedQL) {
    const ql = state.questLines.find((q) => q.id === selectedQL);
    if (!ql) return null;
    const qlTasks = state.tasks.filter((t) => t.questLineId === selectedQL);
    const completed = qlTasks.filter((t) => t.completed).length;

    return (
      <div className="space-y-5 animate-fade">
        <button
          onClick={() => setSelectedQL(null)}
          className="flex items-center gap-1.5 text-[11px] text-text-muted hover:text-text-primary transition-colors"
        >
          <ArrowLeft size={14} /> 返回任务列表
        </button>

        <div className="bg-bg-elevated border border-border-subtle rounded-xl p-5">
          <h2 className="text-sm font-semibold text-text-primary">{ql.title}</h2>
          <p className="text-[11px] text-text-secondary mt-1 leading-relaxed">{ql.description}</p>
          <div className="flex items-center gap-2 mt-3">
            <span className="text-[10px] bg-bg-glass border border-border-subtle px-2 py-0.5 rounded-full text-text-secondary">
              {ql.domain}
            </span>
            <span className="text-[10px] text-text-muted">
              {completed}/{qlTasks.length} 已完成
            </span>
          </div>
        </div>

        <div className="space-y-2 stagger-1">
          {qlTasks.map((t) => <TaskCard key={t.id} task={t} onComplete={handleComplete} />)}
        </div>

        <button
          onClick={() => setShowNewTask(true)}
          className="w-full py-3 border border-dashed border-border-default rounded-xl text-[11px] text-text-muted hover:text-accent hover:border-accent/30 hover:bg-accent-surface/10 transition-all flex items-center justify-center gap-1.5"
        >
          <Plus size={14} /> 添加支线任务
        </button>

        {completedTask && <CompleteTaskModal task={completedTask} onClose={() => setCompletedTask(null)} onSaveJournal={handleSaveJournal} />}
        {showNewTask && <CreateTaskModal questLineId={selectedQL} questLines={state.questLines} onClose={() => setShowNewTask(false)} onCreate={addTask} />}
      </div>
    );
  }

  // Main list view
  const orphanTasks = state.tasks.filter((t) => !t.questLineId);

  return (
    <div className="space-y-6 animate-fade">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-text-primary">主线任务</h2>
        <button
          onClick={() => setShowNewQL(true)}
          className="flex items-center gap-1 text-[11px] text-accent hover:text-accent-soft transition-colors font-medium"
        >
          <Plus size={14} /> 新建主线
        </button>
      </div>

      {state.questLines.length > 0 ? (
        <div className="space-y-3 stagger-1">
          {state.questLines.map((ql) => {
            const qlTasks = state.tasks.filter((t) => t.questLineId === ql.id);
            return <QuestLineCard key={ql.id} questLine={ql} tasks={qlTasks} onSelect={setSelectedQL} />;
          })}
        </div>
      ) : (
        <div className="bg-bg-elevated/40 rounded-xl border border-border-subtle border-dashed p-8 text-center">
          <p className="text-[11px] text-text-muted">还没有主线任务。试着创建一条和生活有关的主线。</p>
          <button
            onClick={() => setShowNewQL(true)}
            className="mt-3 inline-flex items-center gap-1.5 text-[11px] font-medium text-accent bg-accent-surface border border-accent/20 px-4 py-2 rounded-lg hover:bg-accent hover:text-white transition-all"
          >
            <Plus size={14} /> 创建第一条主线
          </button>
        </div>
      )}

      {orphanTasks.length > 0 && (
        <>
          <h2 className="text-sm font-semibold text-text-primary mt-8">独立任务</h2>
          <div className="space-y-2 stagger-1">
            {orphanTasks.map((t) => <TaskCard key={t.id} task={t} onComplete={handleComplete} />)}
          </div>
        </>
      )}

      <button
        onClick={() => setShowNewTask(true)}
        className="fixed bottom-20 md:bottom-6 right-4 md:right-6 w-11 h-11 bg-accent hover:bg-accent-soft text-white rounded-xl shadow-lg shadow-accent-glow flex items-center justify-center transition-all hover:scale-105 active:scale-95 z-40"
      >
        <Plus size={20} strokeWidth={2} />
      </button>

      {completedTask && <CompleteTaskModal task={completedTask} onClose={() => setCompletedTask(null)} onSaveJournal={handleSaveJournal} />}
      {showNewTask && <CreateTaskModal questLines={state.questLines} onClose={() => setShowNewTask(false)} onCreate={addTask} />}
      {showNewQL && <CreateQuestLineModal onClose={() => setShowNewQL(false)} onCreate={addQuestLine} />}
    </div>
  );
}
