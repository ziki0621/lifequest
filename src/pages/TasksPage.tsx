import { useState } from "react";
import { Plus, ArrowLeft, Target, ListTodo, CheckCircle2 } from "lucide-react";
import { useApp } from "../hooks/useApp";
import DailyTaskCard from "../components/DailyTaskCard";
import SideQuestCard from "../components/SideQuestCard";
import Timeline from "../components/Timeline";
import CompleteTaskModal from "../components/CompleteTaskModal";
import CreateMainQuestModal from "../components/CreateMainQuestModal";
import CreateDailyTaskModal from "../components/CreateDailyTaskModal";
import CreateSideQuestModal from "../components/CreateSideQuestModal";
import CreateStageModal from "../components/CreateStageModal";
import EditMainQuestModal from "../components/EditMainQuestModal";
import EditDailyTaskModal from "../components/EditDailyTaskModal";
import EditSideQuestModal from "../components/EditSideQuestModal";
import NpcAgentPanel from "../components/NpcAgentPanel";
import AgentChatModal from "../components/AgentChatModal";
import QuestPlanPreview from "../components/QuestPlanPreview";
import { NPCS } from "../data/npcs";
import { loadLLMConfig } from "../utils/llmConfig";
import { generateQuestPlan } from "../services/questPlanAgent";
import type { CompletionContext, Mood, EnergyLevel, MainQuest, DailyTask, SideQuest } from "../types";
import type { QuestPlanDraft as AgentQuestPlanDraft } from "../types/agent";
import { today } from "../utils/date";

export default function TasksPage() {
  const { state, completeMainStage, completeDailyTask, completeSideQuest,
    addJournal, addMainQuest, addDailyTask, addSideQuest, addMainStage, toggleDailyActive,
    updateMainQuest, updateDailyTask, updateSideQuest, applyQuestPlan,
    archiveMainQuest, archiveDailyTask, archiveSideQuest,
    deleteMainQuest, deleteDailyTask, deleteSideQuest } = useApp();

  const [selectedMQ, setSelectedMQ] = useState<string | null>(null);
  const [completionCtx, setCompletionCtx] = useState<CompletionContext | null>(null);
  const [createModal, setCreateModal] = useState<"main" | "daily" | "side" | null>(null);
  const [showAddStage, setShowAddStage] = useState(false);
  const [editingMain, setEditingMain] = useState<MainQuest | null>(null);
  const [editingDaily, setEditingDaily] = useState<DailyTask | null>(null);
  const [editingSide, setEditingSide] = useState<SideQuest | null>(null);

  // Maro agent state
  const [showMaroChat, setShowMaroChat] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [planDraft, setPlanDraft] = useState<AgentQuestPlanDraft | null>(null);

  const handleGeneratePlan = async (goal: string) => {
    setGenerating(true);
    try {
      const config = loadLLMConfig();
      const plan = await generateQuestPlan({ goal, timeRange: "1week", intensity: "gentle" }, config);
      setPlanDraft(plan);
      setShowMaroChat(false);
    } finally { setGenerating(false); }
  };

  const handleApplyPlan = () => {
    if (!planDraft) return;
    applyQuestPlan(planDraft);
    setPlanDraft(null);
  };

  // ── Completion handlers ──
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
    if (completionCtx && content.trim())
      addJournal({ date: today(), taskId: completionCtx.itemId, mood, energy, content: content.trim(), tags: [] });
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
        <button onClick={() => setSelectedMQ(null)} className="flex items-center gap-1.5 text-[11px] font-bold text-navy/40 uppercase tracking-widest hover:text-navy"><ArrowLeft size={14} /> 返回</button>
        <div className="text-center space-y-2">
          <p className="text-coral font-bold text-xs tracking-widest uppercase">{mq.status === "active" ? "进行中" : mq.status === "paused" ? "已暂停" : "已完成"}</p>
          <h2 className="text-2xl font-black text-navy tracking-tight serif cursor-pointer" onClick={() => setEditingMain(mq)}>{mq.title}</h2>
          <p className="text-[12px] text-navy/50 font-medium leading-relaxed serif">{mq.description}</p>
        </div>
        <div className="glass rounded-3xl p-4">
          <div className="flex justify-between text-[9px] font-bold text-navy/30 uppercase tracking-widest mb-1 px-2"><span>进度</span><span>{completed}/{mq.stages.length}</span></div>
          <div className="progress"><div className="progress-fill" style={{ width: `${progress}%` }} /></div>
        </div>
        <Timeline stages={mq.stages} onComplete={(stageId) => handleMainStageComplete(mq.id, stageId)} />
        <button onClick={() => setShowAddStage(true)} className="w-full py-2.5 border-2 border-dashed border-navy/15 rounded-3xl text-[10px] font-bold text-navy/40 hover:text-navy hover:border-navy/30 transition-all">+ 添加阶段</button>
        {state.sideQuests.filter((sq) => sq.mainQuestId === mq.id).length > 0 && (
          <section>
            <h3 className="text-[10px] font-bold text-navy/30 uppercase tracking-widest mb-2">关联支线</h3>
            <div className="space-y-2">{state.sideQuests.filter((sq) => sq.mainQuestId === mq.id).map((sq) => <SideQuestCard key={sq.id} quest={sq} onComplete={handleSideComplete} onEdit={setEditingSide} />)}</div>
          </section>
        )}
        {completionCtx && <CompleteTaskModal ctx={completionCtx} onClose={() => setCompletionCtx(null)} onSaveJournal={handleSaveJournal} />}
        {showAddStage && <CreateStageModal onClose={() => setShowAddStage(false)} onCreate={(stage) => addMainStage(mq.id, stage)} />}
        {editingMain && <EditMainQuestModal quest={editingMain} onClose={() => setEditingMain(null)} onUpdate={updateMainQuest} onArchive={archiveMainQuest} onDelete={deleteMainQuest} />}
        {editingDaily && <EditDailyTaskModal task={editingDaily} onClose={() => setEditingDaily(null)} onUpdate={updateDailyTask} onArchive={archiveDailyTask} onDelete={deleteDailyTask} />}
        {editingSide && <EditSideQuestModal quest={editingSide} mainQuests={state.mainQuests} onClose={() => setEditingSide(null)} onUpdate={updateSideQuest} onArchive={archiveSideQuest} onDelete={deleteSideQuest} />}
      </div>
    );
  }

  // ── Panel List View ──
  const activeDaily = state.dailyTasks.filter((dt) => dt.active && !dt.archived);
  const pendingSides = state.sideQuests.filter((sq) => !sq.completed && !sq.archived);

  return (
    <div className="space-y-6 pb-24 animate-in">
      <div className="pt-2 flex items-center justify-between">
        <div>
          <p className="text-coral font-bold text-xs tracking-widest uppercase mb-1">任务线</p>
          <h2 className="text-2xl font-black text-navy tracking-tight serif">全部任务</h2>
        </div>
      </div>

      {/* Maro NPC */}
      <NpcAgentPanel
        npc={NPCS.maro}
        message="欢迎来到冒险公会。告诉我一个模糊目标，我可以帮你整理成主线、日常和支线。"
        actionLabel="让 Maro 生成任务线"
        onAction={() => setShowMaroChat(true)}
      />

      {/* Panels */}
      <Panel icon={<Target size={15} />} title="主线" accentBar="bg-theme" accent="border-navy/10" badge={`${state.mainQuests.filter((q) => !q.archived).length} 条`} onAdd={() => setCreateModal("main")}>
        {state.mainQuests.filter((q) => !q.archived).length === 0 ? <Empty>还没有主线任务。</Empty> : state.mainQuests.filter((q) => !q.archived).map((mq) => {
          const completed = mq.stages.filter((s) => s.completed).length;
          const total = mq.stages.length;
          return (
            <SubFrame key={mq.id} onClick={() => setSelectedMQ(mq.id)} clickable>
              <div className="flex items-center gap-3">
                <div className="flex-1 min-w-0">
                  <h4 className="text-[13px] font-black text-navy">{mq.title}</h4>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`text-[9px] font-bold uppercase tracking-widest ${mq.status === "active" ? "text-coral" : "text-navy/30"}`}>{mq.status === "active" ? "进行中" : mq.status === "paused" ? "暂停" : "完成"}</span>
                    <span className="text-[9px] text-navy/25">{completed}/{total} 阶段</span>
                  </div>
                </div>
                <div className="text-right"><span className="text-[11px] font-black text-navy tabular-nums">{total > 0 ? Math.round((completed / total) * 100) : 0}%</span></div>
              </div>
              {total > 0 && <div className="mt-2 progress"><div className="progress-fill" style={{ width: `${total > 0 ? Math.round((completed / total) * 100) : 0}%` }} /></div>}
            </SubFrame>
          );
        })}
      </Panel>

      <Panel icon={<ListTodo size={15} />} title="日常" accentBar="bg-coral" accent="border-coral/15" badge={`${activeDaily.length} 活跃`} onAdd={() => setCreateModal("daily")}>
        {state.dailyTasks.filter((d) => !d.archived).length === 0 ? <Empty>还没有日常任务。</Empty> : state.dailyTasks.filter((d) => !d.archived).map((dt) => <DailyTaskCard key={dt.id} task={dt} onComplete={handleDailyComplete} onToggle={toggleDailyActive} onEdit={setEditingDaily} />)}
      </Panel>

      <Panel icon={<CheckCircle2 size={15} />} title="支线" accentBar="bg-leaf" accent="border-leaf/15" badge={`${pendingSides.length} 待完成`} onAdd={() => setCreateModal("side")}>
        {state.sideQuests.filter((s) => !s.archived).length === 0 ? <Empty>还没有支线任务。</Empty> : state.sideQuests.filter((s) => !s.archived).map((sq) => <SideQuestCard key={sq.id} quest={sq} onComplete={handleSideComplete} onEdit={setEditingSide} />)}
      </Panel>

      <button onClick={() => setCreateModal("main")} className="fixed bottom-20 md:bottom-6 right-4 md:right-6 w-12 h-12 bg-theme text-white rounded-full shadow-xl shadow-navy/30 flex items-center justify-center transition-all hover:scale-105 active:scale-95 z-40"><Plus size={20} strokeWidth={2.5} /></button>

      {completionCtx && <CompleteTaskModal ctx={completionCtx} onClose={() => setCompletionCtx(null)} onSaveJournal={handleSaveJournal} />}
      {createModal === "main" && <CreateMainQuestModal onClose={() => setCreateModal(null)} onCreate={addMainQuest} />}
      {createModal === "daily" && <CreateDailyTaskModal onClose={() => setCreateModal(null)} onCreate={addDailyTask} />}
      {createModal === "side" && <CreateSideQuestModal mainQuests={state.mainQuests} onClose={() => setCreateModal(null)} onCreate={addSideQuest} />}
      {editingMain && <EditMainQuestModal quest={editingMain} onClose={() => setEditingMain(null)} onUpdate={updateMainQuest} onArchive={archiveMainQuest} onDelete={deleteMainQuest} />}
      {editingDaily && <EditDailyTaskModal task={editingDaily} onClose={() => setEditingDaily(null)} onUpdate={updateDailyTask} onArchive={archiveDailyTask} onDelete={deleteDailyTask} />}
      {editingSide && <EditSideQuestModal quest={editingSide} mainQuests={state.mainQuests} onClose={() => setEditingSide(null)} onUpdate={updateSideQuest} onArchive={archiveSideQuest} onDelete={deleteSideQuest} />}

      {showMaroChat && <AgentChatModal npc={NPCS.maro} title="AI 任务线生成" intro="告诉我你最近想改变什么。不需要说得很完整，我会帮你整理成可以慢慢推进的生活任务线。" placeholder="例如：我最近作息很乱，想重新稳定下来。" loading={generating} onClose={() => setShowMaroChat(false)} onSubmit={handleGeneratePlan} />}
      {planDraft && <QuestPlanPreview plan={planDraft} onConfirm={handleApplyPlan} onClose={() => setPlanDraft(null)} onRegenerate={() => { setPlanDraft(null); setShowMaroChat(true); }} />}
    </div>
  );
}

function Panel({ icon, title, accent, accentBar, badge, onAdd, children }: { icon: React.ReactNode; title: string; accent: string; accentBar: string; badge: string; onAdd: () => void; children: React.ReactNode; }) {
  return (
    <section className={`glass rounded-3xl border ${accent} overflow-hidden`}>
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-navy/5">
        <div className="flex items-center gap-2.5"><div className={`w-1 h-4 rounded-full ${accentBar}`} />{icon}<h3 className="text-[11px] font-black text-navy uppercase tracking-widest">{title}</h3><span className="text-[9px] font-bold text-navy/25 bg-navy/5 px-2 py-0.5 rounded-full">{badge}</span></div>
        <button onClick={onAdd} className="flex items-center gap-1 text-[10px] font-bold text-navy/30 hover:text-navy transition-colors"><Plus size={13} /> 添加</button>
      </div>
      <div className="p-3 space-y-2">{children}</div>
    </section>
  );
}

function SubFrame({ children, onClick, clickable }: { children: React.ReactNode; onClick?: () => void; clickable?: boolean }) {
  return <div onClick={onClick} className={`bg-white/20 rounded-2xl border border-navy/5 p-3 transition-all duration-200 ${clickable ? "cursor-pointer hover:border-navy/10 hover:bg-white/35" : ""}`}>{children}</div>;
}

function Empty({ children }: { children: React.ReactNode }) {
  return <div className="text-center py-6"><p className="text-[10px] font-medium text-navy/25">{children}</p></div>;
}
