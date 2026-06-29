import { useState, useMemo } from "react";
import { Plus, Edit3, BookOpen, Target, ListTodo, CheckCircle2 } from "lucide-react";
import { useApp } from "../hooks/useApp";
import JournalCard from "../components/JournalCard";
import CreateJournalModal from "../components/CreateJournalModal";
import type { Mood, EnergyLevel, LinkedTask, MainQuest, DailyTask } from "../types";
import { ATTRIBUTE_ICONS, ATTRIBUTE_LABELS, ATTR_COLOR } from "../types";
import { today } from "../utils/date";

export default function JournalPage() {
  const { state, addJournal } = useApp();
  const [tab, setTab] = useState<"diary" | "log">("diary");
  const [showCreate, setShowCreate] = useState(false);

  // ── Diary entries (no taskId) ──
  const diaryEntries = state.journalEntries
    .filter((j) => !j.taskId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  // ── Completed main stages (from mainQuests data, not journals) ──
  const completedStages = useMemo(() => {
    const items: { quest: MainQuest; stage: MainQuest["stages"][0]; stageIdx: number }[] = [];
    state.mainQuests.forEach((mq) => {
      mq.stages.forEach((s, idx) => {
        if (s.completed && s.completedAt) {
          items.push({ quest: mq, stage: s, stageIdx: idx });
        }
      });
    });
    items.sort((a, b) => new Date(b.stage.completedAt!).getTime() - new Date(a.stage.completedAt!).getTime());
    return items;
  }, [state.mainQuests]);

  // ── Daily task completions (grouped by date desc) ──
  const dailyCompletions = useMemo(() => {
    const items: { task: DailyTask; date: string }[] = [];
    state.dailyTasks.forEach((dt) => {
      dt.completions.forEach((d) => items.push({ task: dt, date: d }));
    });
    items.sort((a, b) => b.date.localeCompare(a.date));
    return items;
  }, [state.dailyTasks]);

  // ── Completed side quests ──
  const completedSides = useMemo(() => {
    return state.sideQuests
      .filter((sq) => sq.completed)
      .sort((a, b) => new Date(b.completedAt!).getTime() - new Date(a.completedAt!).getTime());
  }, [state.sideQuests]);

  const handleSave = (data: { date: string; mood: Mood; energy: EnergyLevel; content: string; tags: string[] }) => {
    addJournal({ date: data.date, mood: data.mood, energy: data.energy, content: data.content, tags: data.tags });
  };

  const findLinked = (taskId: string): LinkedTask | undefined => {
    for (const mq of state.mainQuests) {
      const stage = mq.stages.find((s) => s.id === taskId);
      if (stage) return { type: "mainStage", title: stage.title, attributeRewards: [] };
    }
    const dt = state.dailyTasks.find((t) => t.id === taskId);
    if (dt) return { type: "daily", title: dt.title, attributeRewards: dt.attributeRewards };
    const sq = state.sideQuests.find((s) => s.id === taskId);
    if (sq) return { type: "sideQuest", title: sq.title, attributeRewards: sq.attributeRewards };
    return undefined;
  };

  return (
    <div className="space-y-6 pb-24 animate-in">
      <div className="flex justify-between items-center">
        <div>
          <p className="text-coral font-bold text-xs tracking-widest uppercase mb-1">记录</p>
          <h2 className="text-2xl font-black text-navy tracking-tight serif">生活日志</h2>
        </div>
        <button onClick={() => setShowCreate(true)} className="btn btn-primary !py-2 !px-5 !text-[10px] !tracking-widest">
          <Edit3 size={14} /> 撰写日志
        </button>
      </div>

      {/* Tabs */}
      <div className="flex bg-white/30 rounded-full p-1">
        <button onClick={() => setTab("diary")}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 text-[11px] font-bold rounded-full transition-all tracking-widest ${
            tab === "diary" ? "bg-white text-navy shadow-sm" : "text-navy/30 hover:text-navy/50"}`}>
          <BookOpen size={13} /> 每日日记
        </button>
        <button onClick={() => setTab("log")}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 text-[11px] font-bold rounded-full transition-all tracking-widest ${
            tab === "log" ? "bg-white text-navy shadow-sm" : "text-navy/30 hover:text-navy/50"}`}>
          <Edit3 size={13} /> 任务日志
        </button>
      </div>

      {tab === "diary" ? (
        /* ── 每日日记 ── */
        diaryEntries.length > 0 ? (
          <div className="space-y-4 stagger-1 md:ml-10">
            {diaryEntries.map((entry) => (
              <JournalCard key={entry.id} entry={entry}
                linkedItem={entry.taskId ? findLinked(entry.taskId) : undefined} />
            ))}
          </div>
        ) : (
          <div className="glass rounded-3xl p-10 text-center">
            <p className="text-navy/30 font-bold text-xs tracking-widest uppercase">这里会慢慢记录你在地球上的生活痕迹。</p>
          </div>
        )
      ) : (
        /* ── 任务日志：3 面板 ── */
        <div className="space-y-6">
          {/* 已完成主线阶段 */}
          <Panel icon={<Target size={15} />} title="已完成主线阶段" accent="border-navy/10" accentBar="bg-navy" badge={`${completedStages.length}`}>
            {completedStages.length === 0 ? (
              <Empty>完成主线阶段后，这里会出现记录。</Empty>
            ) : (
              completedStages.map(({ quest, stage }) => (
                <SubFrame key={stage.id}>
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <span className="text-[9px] font-bold text-navy/25 uppercase tracking-widest">{quest.title}</span>
                      <h4 className="text-[12px] font-black text-navy mt-0.5">{stage.title}</h4>
                    </div>
                    <span className="text-[10px] font-mono text-navy/30 flex-shrink-0">
                      {stage.completedAt?.slice(0, 10)}
                    </span>
                  </div>
                </SubFrame>
              ))
            )}
          </Panel>

          {/* 日常打卡记录 */}
          <Panel icon={<ListTodo size={15} />} title="日常打卡记录" accent="border-coral/15" accentBar="bg-coral" badge={`${dailyCompletions.length}`}>
            {dailyCompletions.length === 0 ? (
              <Empty>打卡日常任务后，记录会出现在这里。</Empty>
            ) : (
              dailyCompletions.map(({ task, date }, i) => (
                <SubFrame key={`${task.id}-${date}-${i}`}>
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <h4 className="text-[12px] font-black text-navy">{task.title}</h4>
                      <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                        {task.attributeRewards.map((ar) => {
                          const AIcon = ATTRIBUTE_ICONS[ar.attribute];
                          return (
                            <span key={ar.attribute} className="inline-flex items-center gap-0.5 text-[9px] font-bold" style={{ color: ATTR_COLOR[ar.attribute] }}>
                              <AIcon size={9} /> {ATTRIBUTE_LABELS[ar.attribute]} +{ar.exp}
                            </span>
                          );
                        })}
                      </div>
                    </div>
                    <span className="text-[10px] font-mono text-navy/30 flex-shrink-0">{date}</span>
                  </div>
                </SubFrame>
              ))
            )}
          </Panel>

          {/* 已完成支线 */}
          <Panel icon={<CheckCircle2 size={15} />} title="已完成支线" accent="border-leaf/15" accentBar="bg-leaf" badge={`${completedSides.length}`}>
            {completedSides.length === 0 ? (
              <Empty>完成支线任务后，这里会出现记录。</Empty>
            ) : (
              completedSides.map((sq) => (
                <SubFrame key={sq.id}>
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <h4 className="text-[12px] font-black text-navy">{sq.title}</h4>
                      <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                        {sq.attributeRewards.map((ar) => {
                          const AIcon = ATTRIBUTE_ICONS[ar.attribute];
                          return (
                            <span key={ar.attribute} className="inline-flex items-center gap-0.5 text-[9px] font-bold" style={{ color: ATTR_COLOR[ar.attribute] }}>
                              <AIcon size={9} /> {ATTRIBUTE_LABELS[ar.attribute]} +{ar.exp}
                            </span>
                          );
                        })}
                      </div>
                    </div>
                    <span className="text-[10px] font-mono text-navy/30 flex-shrink-0">
                      {sq.completedAt?.slice(0, 10)}
                    </span>
                  </div>
                </SubFrame>
              ))
            )}
          </Panel>
        </div>
      )}

      <button onClick={() => setShowCreate(true)}
        className="fixed bottom-20 md:bottom-6 right-4 md:right-6 w-12 h-12 bg-navy text-white rounded-full shadow-xl shadow-navy/30 flex items-center justify-center transition-all hover:scale-105 active:scale-95 z-40">
        <Plus size={20} strokeWidth={2.5} />
      </button>

      {showCreate && <CreateJournalModal defaultDate={today()} onClose={() => setShowCreate(false)} onSave={handleSave} />}
    </div>
  );
}

// ── Shared panel primitives ──

function Panel({ icon, title, accent, accentBar, badge, children }: {
  icon: React.ReactNode; title: string; accent: string; accentBar: string;
  badge: string; children: React.ReactNode;
}) {
  return (
    <section className={`glass rounded-3xl border ${accent} overflow-hidden`}>
      <div className="flex items-center gap-2.5 px-5 py-3.5 border-b border-navy/5">
        <div className={`w-1 h-4 rounded-full ${accentBar}`} />
        {icon}
        <h3 className="text-[11px] font-black text-navy uppercase tracking-widest">{title}</h3>
        <span className="text-[9px] font-bold text-navy/25 bg-navy/5 px-2 py-0.5 rounded-full">{badge}</span>
      </div>
      <div className="p-3 space-y-2">
        {children}
      </div>
    </section>
  );
}

function SubFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-white/20 rounded-2xl border border-navy/5 p-3 transition-all duration-200 hover:border-navy/10 hover:bg-white/35">
      {children}
    </div>
  );
}

function Empty({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-center py-6">
      <p className="text-[10px] font-medium text-navy/25">{children}</p>
    </div>
  );
}
