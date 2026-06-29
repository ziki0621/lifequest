import { useState } from "react";
import { Plus, ArrowLeft, CheckCircle2, Lock, Zap } from "lucide-react";
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
    if (completedTask && content.trim()) addJournal({ date: today(), taskId: completedTask.id, mood, energy, content: content.trim(), tags: [] });
    setCompletedTask(null);
  };

  // QuestLine detail view — editorial vertical journey
  if (selectedQL) {
    const ql = state.questLines.find((q) => q.id === selectedQL);
    if (!ql) return null;
    const qlTasks = state.tasks.filter((t) => t.questLineId === selectedQL);
    const completed = qlTasks.filter((t) => t.completed).length;

    return (
      <div className="space-y-8 animate-fade max-w-lg mx-auto">
        <button onClick={() => setSelectedQL(null)}
          className="flex items-center gap-1.5 text-[11px] font-bold text-navy/40 uppercase tracking-widest hover:text-navy transition-colors">
          <ArrowLeft size={14} /> 返回
        </button>

        <div className="text-center space-y-3">
          <p className="text-coral font-bold text-xs tracking-widest uppercase">{ql.status === "active" ? "进行中" : ql.status}</p>
          <h2 className="text-2xl font-black text-navy tracking-tight serif">{ql.title}</h2>
          <p className="text-[12px] text-navy/50 font-medium leading-relaxed serif">{ql.description}</p>
          <div className="text-[10px] font-bold text-navy/30 uppercase tracking-widest">{completed}/{qlTasks.length} 已完成</div>
        </div>

        {/* Vertical journey line */}
        <div className="relative flex flex-col items-center gap-10 py-6">
          <div className="absolute top-0 bottom-0 w-px bg-navy/8 left-1/2 -translate-x-1/2 z-0" />
          {qlTasks.map((t, i) => {
            const isCurrent = !t.completed && (i === 0 || qlTasks[i - 1].completed);
            return (
              <div key={t.id} className="relative z-10 flex items-center gap-8 w-full">
                <div className={`flex-1 text-right ${i % 2 === 0 ? "" : "invisible"}`}>
                  {i % 2 === 0 && (
                    <span className="text-[10px] font-bold tracking-widest uppercase" style={{ color: t.completed ? "#0B192C" : "#FF4D6D" }}>
                      {t.completed ? "已完成" : isCurrent ? "当前" : ""}
                    </span>
                  )}
                </div>
                <button
                  onClick={() => !t.completed && handleComplete(t.id)}
                  className={`w-14 h-14 rounded-full flex items-center justify-center transition-all duration-500 flex-shrink-0 ${
                    t.completed ? "bg-navy/10 text-navy" :
                    isCurrent ? "bg-navy text-white scale-110 shadow-xl shadow-navy/30" :
                    "bg-white/50 border border-navy/10 text-navy/20"
                  }`}
                >
                  {t.completed ? <CheckCircle2 size={22} /> : isCurrent ? <Zap size={20} /> : <Lock size={18} />}
                </button>
                <div className={`flex-1 ${i % 2 === 1 ? "" : "invisible"}`}>
                  {i % 2 === 1 && (
                    <div>
                      <span className={`text-[11px] font-black tracking-wide ${isCurrent ? "text-navy" : t.completed ? "text-navy/60" : "text-navy/30"}`}>
                        {t.title}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <button onClick={() => setShowNewTask(true)}
          className="w-full py-3 border-2 border-dashed border-navy/15 rounded-3xl text-[11px] font-bold text-navy/40 uppercase tracking-widest hover:text-navy hover:border-navy/30 transition-all flex items-center justify-center gap-1.5">
          <Plus size={14} /> 添加支线
        </button>

        {completedTask && <CompleteTaskModal task={completedTask} onClose={() => setCompletedTask(null)} onSaveJournal={handleSaveJournal} />}
        {showNewTask && <CreateTaskModal questLineId={selectedQL} questLines={state.questLines} onClose={() => setShowNewTask(false)} onCreate={addTask} />}
      </div>
    );
  }

  // Main view
  const orphanTasks = state.tasks.filter((t) => !t.questLineId);

  return (
    <div className="space-y-8 animate-in pb-24">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-coral font-bold text-xs tracking-widest uppercase mb-1">任务线</p>
          <h2 className="text-2xl font-black text-navy tracking-tight serif">主线任务</h2>
        </div>
        <button onClick={() => setShowNewQL(true)}
          className="btn btn-primary !py-2 !px-5 !text-[10px] !tracking-widest">
          <Plus size={14} /> 新建主线
        </button>
      </div>

      {state.questLines.length > 0 ? (
        <div className="space-y-4 stagger-1">
          {state.questLines.map((ql) => {
            const tasks = state.tasks.filter((t) => t.questLineId === ql.id);
            return <QuestLineCard key={ql.id} questLine={ql} tasks={tasks} onSelect={setSelectedQL} />;
          })}
        </div>
      ) : (
        <div className="glass rounded-3xl p-10 text-center">
          <p className="text-navy/40 font-bold text-xs tracking-widest uppercase">还没有主线任务</p>
          <p className="text-navy/30 text-[11px] font-medium mt-1">试着创建一条和生活有关的主线。</p>
          <button onClick={() => setShowNewQL(true)} className="btn btn-primary mt-4 !text-[10px]">创建第一条主线</button>
        </div>
      )}

      {orphanTasks.length > 0 && (
        <>
          <h3 className="text-[11px] font-bold text-navy/40 uppercase tracking-widest mt-8">独立任务</h3>
          <div className="space-y-3 stagger-1">{orphanTasks.map((t) => <TaskCard key={t.id} task={t} onComplete={handleComplete} />)}</div>
        </>
      )}

      <button onClick={() => setShowNewTask(true)}
        className="fixed bottom-20 md:bottom-6 right-4 md:right-6 w-12 h-12 bg-navy text-white rounded-full shadow-xl shadow-navy/30 flex items-center justify-center transition-all hover:scale-105 active:scale-95 z-40">
        <Plus size={20} strokeWidth={2.5} />
      </button>

      {completedTask && <CompleteTaskModal task={completedTask} onClose={() => setCompletedTask(null)} onSaveJournal={handleSaveJournal} />}
      {showNewTask && <CreateTaskModal questLines={state.questLines} onClose={() => setShowNewTask(false)} onCreate={addTask} />}
      {showNewQL && <CreateQuestLineModal onClose={() => setShowNewQL(false)} onCreate={addQuestLine} />}
    </div>
  );
}
