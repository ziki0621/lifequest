import { useState } from "react";
import { Plus, ArrowLeft } from "lucide-react";
import { useApp } from "../AppContext";
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
    if (task) {
      completeTask(taskId);
      setCompletedTask(task);
    }
  };

  const handleSaveJournal = (content: string, mood: Mood, energy: EnergyLevel) => {
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
  };

  // 如果是查看主线详情
  if (selectedQL) {
    const ql = state.questLines.find((q) => q.id === selectedQL);
    if (!ql) return null;
    const qlTasks = state.tasks.filter((t) => t.questLineId === selectedQL);

    return (
      <div className="space-y-4">
        <button
          onClick={() => setSelectedQL(null)}
          className="flex items-center gap-1.5 text-sm text-text-muted hover:text-text-primary transition-colors"
        >
          <ArrowLeft size={16} /> 返回任务列表
        </button>

        <div className="bg-white/60 rounded-2xl border border-sage-light/30 p-5">
          <h2 className="text-lg font-semibold text-text-primary">{ql.title}</h2>
          <p className="text-sm text-text-secondary mt-1">{ql.description}</p>
          <div className="flex items-center gap-2 mt-2">
            <span className="text-xs bg-warm-gold-light text-warm-gold px-2 py-0.5 rounded-full">
              {ql.domain}
            </span>
            <span className="text-xs text-text-muted">
              {qlTasks.filter((t) => t.completed).length}/{qlTasks.length} 已完成
            </span>
          </div>
        </div>

        <div className="space-y-2">
          {qlTasks.map((t) => (
            <TaskCard key={t.id} task={t} onComplete={handleComplete} />
          ))}
        </div>

        <button
          onClick={() => setShowNewTask(true)}
          className="w-full py-3 border-2 border-dashed border-sage-light/40 rounded-2xl text-sm text-text-muted hover:text-sage-dark hover:border-sage transition-all flex items-center justify-center gap-1.5"
        >
          <Plus size={16} /> 添加支线任务
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
            questLineId={selectedQL}
            questLines={state.questLines}
            onClose={() => setShowNewTask(false)}
            onCreate={addTask}
          />
        )}
      </div>
    );
  }

  // 主线 + 独立任务总览
  const orphanTasks = state.tasks.filter((t) => !t.questLineId);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-text-primary">主线任务</h2>
        <button
          onClick={() => setShowNewQL(true)}
          className="flex items-center gap-1 text-sm text-sage-dark hover:text-sage transition-colors"
        >
          <Plus size={16} /> 新建主线
        </button>
      </div>

      {state.questLines.length > 0 ? (
        <div className="space-y-3">
          {state.questLines.map((ql) => {
            const qlTasks = state.tasks.filter((t) => t.questLineId === ql.id);
            return (
              <QuestLineCard
                key={ql.id}
                questLine={ql}
                tasks={qlTasks}
                onSelect={setSelectedQL}
              />
            );
          })}
        </div>
      ) : (
        <div className="bg-white/40 rounded-2xl border border-sage-light/20 p-6 text-center">
          <p className="text-text-muted text-sm">还没有主线任务。试着创建一条和生活有关的主线。</p>
          <button
            onClick={() => setShowNewQL(true)}
            className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-sage-dark bg-sage-light px-4 py-2 rounded-xl hover:bg-sage hover:text-white transition-all"
          >
            <Plus size={16} /> 创建第一条主线
          </button>
        </div>
      )}

      {/* 独立任务 */}
      {orphanTasks.length > 0 && (
        <>
          <h2 className="text-lg font-semibold text-text-primary mt-6">独立任务</h2>
          <div className="space-y-2">
            {orphanTasks.map((t) => (
              <TaskCard key={t.id} task={t} onComplete={handleComplete} />
            ))}
          </div>
        </>
      )}

      {/* FAB */}
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
      {showNewQL && (
        <CreateQuestLineModal
          onClose={() => setShowNewQL(false)}
          onCreate={addQuestLine}
        />
      )}
    </div>
  );
}
