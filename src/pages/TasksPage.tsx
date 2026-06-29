import { useState } from "react";
import { Plus, ArrowLeft, Target, ListTodo, CheckCircle2 } from "lucide-react";
import { useApp } from "../hooks/useApp";
import MainQuestCard from "../components/MainQuestCard";
import DailyTaskCard from "../components/DailyTaskCard";
import SideQuestCard from "../components/SideQuestCard";
import Timeline from "../components/Timeline";
import CompleteTaskModal from "../components/CompleteTaskModal";
import CreateMainQuestModal from "../components/CreateMainQuestModal";
import CreateDailyTaskModal from "../components/CreateDailyTaskModal";
import CreateSideQuestModal from "../components/CreateSideQuestModal";
import CreateStageModal from "../components/CreateStageModal";
import type { CompletionContext, Mood, EnergyLevel } from "../types";
import { today } from "../utils/date";

type Tab = "main" | "daily" | "side";

export default function TasksPage() {
  const { state, completeMainStage, completeDailyTask, completeSideQuest,
    addJournal, addMainQuest, addDailyTask, addSideQuest, addMainStage, toggleDailyActive } = useApp();

  const [tab, setTab] = useState<Tab>("main");
  const [selectedMQ, setSelectedMQ] = useState<string | null>(null);
  const [completionCtx, setCompletionCtx] = useState<CompletionContext | null>(null);
  const [createModal, setCreateModal] = useState<"main" | "daily" | "side" | null>(null);
  const [showAddStage, setShowAddStage] = useState(false);

  const handleMainStageComplete = (mqId: string, sId: string) => {
    const ctx = completeMainStage(mqId, sId);
    if (ctx) setCompletionCtx(ctx);
  };

  const handleDailyComplete = (id: string) => {
    const ctx = completeDailyTask(id);
    if (ctx) setCompletionCtx(ctx);
  };

  const handleSideComplete = (id: string) => {
    const ctx = completeSideQuest(id);
    if (ctx) setCompletionCtx(ctx);
  };

  const handleSaveJournal = (content: string, mood: Mood, energy: EnergyLevel) => {
    if (completionCtx && content.trim()) {
      addJournal({ date: today(), mood, energy, content: content.trim(), tags: [] });
    }
    setCompletionCtx(null);
  };

  // ── Main Quest Detail ──
  if (selectedMQ) {
    const mq = state.mainQuests.find((q) => q.id === selectedMQ);
    if (!mq) return null;
    const completed = mq.stages.filter((s) => s.completed).length;
    const progress = mq.stages.length > 0 ? Math.round((completed / mq.stages.length) * 100) : 0;

    return (
      <div className="space-y-6 animate-fade pb-24">
        <button onClick={() => setSelectedMQ(null)}
          className="flex items-center gap-1.5 text-[11px] font-bold text-navy/40 uppercase tracking-widest hover:text-navy">
          <ArrowLeft size={14} /> 返回
        </button>

        <div className="text-center space-y-2">
          <p className="text-coral font-bold text-xs tracking-widest uppercase">
            {mq.status === "active" ? "进行中" : mq.status === "paused" ? "已暂停" : "已完成"}
          </p>
          <h2 className="text-2xl font-black text-navy tracking-tight serif">{mq.title}</h2>
          <p className="text-[12px] text-navy/50 font-medium leading-relaxed serif">{mq.description}</p>
        </div>

        <div className="glass rounded-3xl p-4">
          <div className="flex justify-between text-[9px] font-bold text-navy/30 uppercase tracking-widest mb-1 px-2">
            <span>进度</span><span>{completed}/{mq.stages.length}</span>
          </div>
          <div className="progress"><div className="progress-fill" style={{ width: `${progress}%`, background: "#0B192C" }} /></div>
        </div>

        <Timeline stages={mq.stages} onComplete={(stageId) => handleMainStageComplete(mq.id, stageId)} />

        <div className="flex gap-2">
          <button onClick={() => setShowAddStage(true)}
            className="flex-1 py-2.5 border-2 border-dashed border-navy/15 rounded-3xl text-[10px] font-bold text-navy/40 hover:text-navy hover:border-navy/30 transition-all">
            + 添加阶段
          </button>
        </div>

        {/* Linked side quests */}
        {state.sideQuests.filter((sq) => sq.mainQuestId === mq.id).length > 0 && (
          <section>
            <h3 className="text-[10px] font-bold text-navy/30 uppercase tracking-widest mb-2">关联支线</h3>
            <div className="space-y-2">
              {state.sideQuests.filter((sq) => sq.mainQuestId === mq.id).map((sq) => (
                <SideQuestCard key={sq.id} quest={sq} onComplete={handleSideComplete} />
              ))}
            </div>
          </section>
        )}

        {completionCtx && <CompleteTaskModal ctx={completionCtx} onClose={() => setCompletionCtx(null)} onSaveJournal={handleSaveJournal} />}
        {showAddStage && <CreateStageModal onClose={() => setShowAddStage(false)}
          onCreate={(stage) => addMainStage(mq.id, stage)} />}
      </div>
    );
  }

  // ── Tab-based list view ──
  return (
    <div className="space-y-6 animate-in pb-24">
      {/* Tabs */}
      <div className="flex bg-white/30 rounded-full p-1">
        {([
          { id: "main" as Tab, label: "主线", icon: Target },
          { id: "daily" as Tab, label: "日常", icon: ListTodo },
          { id: "side" as Tab, label: "支线", icon: CheckCircle2 },
        ]).map(({ id, label, icon: Icon }) => (
          <button key={id} onClick={() => setTab(id)}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 text-[11px] font-bold rounded-full transition-all tracking-widest ${
              tab === id ? "bg-white text-navy shadow-sm" : "text-navy/30 hover:text-navy/50"}`}>
            <Icon size={13} /> {label}
          </button>
        ))}
      </div>

      {/* 主线 Tab */}
      {tab === "main" && (
        <>
          {state.mainQuests.length > 0 ? (
            <div className="space-y-3 stagger-1">
              {state.mainQuests.map((mq) => <MainQuestCard key={mq.id} quest={mq} onSelect={setSelectedMQ} />)}
            </div>
          ) : (
            <Empty text="还没有主线任务。创建一条和生活有关的主线。" />
          )}
        </>
      )}

      {/* 日常 Tab */}
      {tab === "daily" && (
        <>
          {state.dailyTasks.length > 0 ? (
            <div className="space-y-3 stagger-1">
              {state.dailyTasks.map((dt) => (
                <DailyTaskCard key={dt.id} task={dt} onComplete={handleDailyComplete} onToggle={toggleDailyActive} />
              ))}
            </div>
          ) : (
            <Empty text="还没有日常任务。创建一个循环打卡的习惯。" />
          )}
        </>
      )}

      {/* 支线 Tab */}
      {tab === "side" && (
        <>
          {state.sideQuests.length > 0 ? (
            <div className="space-y-3 stagger-1">
              {state.sideQuests.map((sq) => (
                <SideQuestCard key={sq.id} quest={sq} onComplete={handleSideComplete} />
              ))}
            </div>
          ) : (
            <Empty text="还没有支线任务。添加一些一次性的小目标。" />
          )}
        </>
      )}

      {/* FAB */}
      <button onClick={() => setCreateModal(tab)}
        className="fixed bottom-20 md:bottom-6 right-4 md:right-6 w-12 h-12 bg-navy text-white rounded-full shadow-xl shadow-navy/30 flex items-center justify-center transition-all hover:scale-105 active:scale-95 z-40">
        <Plus size={20} strokeWidth={2.5} />
      </button>

      {completionCtx && <CompleteTaskModal ctx={completionCtx} onClose={() => setCompletionCtx(null)} onSaveJournal={handleSaveJournal} />}
      {createModal === "main" && <CreateMainQuestModal onClose={() => setCreateModal(null)} onCreate={addMainQuest} />}
      {createModal === "daily" && <CreateDailyTaskModal onClose={() => setCreateModal(null)} onCreate={addDailyTask} />}
      {createModal === "side" && <CreateSideQuestModal mainQuests={state.mainQuests} onClose={() => setCreateModal(null)} onCreate={addSideQuest} />}
    </div>
  );
}

function Empty({ text }: { text: string }) {
  return (
    <div className="glass rounded-3xl p-10 text-center">
      <p className="text-navy/30 font-bold text-xs tracking-widest uppercase">{text}</p>
    </div>
  );
}
