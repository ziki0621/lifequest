import { useState } from "react";
import { Plus } from "lucide-react";
import { useApp } from "../AppContext";
import JournalCard from "../components/JournalCard";
import CreateJournalModal from "../components/CreateJournalModal";
import type { Mood, EnergyLevel } from "../types";
import { today } from "../utils/date";

export default function JournalPage() {
  const { state, addJournal } = useApp();
  const [tab, setTab] = useState<"diary" | "log">("diary");
  const [showCreate, setShowCreate] = useState(false);

  // 每日日记：不关联任务的日记
  const diaryEntries = state.journalEntries
    .filter((j) => !j.taskId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  // 任务日志：关联了任务的日记
  const taskLogs = state.journalEntries
    .filter((j) => j.taskId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const handleSave = (data: {
    date: string;
    mood: Mood;
    energy: EnergyLevel;
    content: string;
    tags: string[];
  }) => {
    addJournal({
      date: data.date,
      mood: data.mood,
      energy: data.energy,
      content: data.content,
      tags: data.tags,
    });
  };

  const entries = tab === "diary" ? diaryEntries : taskLogs;

  return (
    <div className="space-y-4">
      {/* Tab 切换 */}
      <div className="flex bg-white/40 rounded-2xl p-1 border border-sage-light/20">
        <button
          onClick={() => setTab("diary")}
          className={`flex-1 py-2 text-sm font-medium rounded-xl transition-all ${
            tab === "diary"
              ? "bg-white shadow-sm text-text-primary"
              : "text-text-muted hover:text-text-secondary"
          }`}
        >
          📝 每日日记
        </button>
        <button
          onClick={() => setTab("log")}
          className={`flex-1 py-2 text-sm font-medium rounded-xl transition-all ${
            tab === "log"
              ? "bg-white shadow-sm text-text-primary"
              : "text-text-muted hover:text-text-secondary"
          }`}
        >
          📋 任务日志
        </button>
      </div>

      {/* 日记列表 */}
      {entries.length > 0 ? (
        <div className="space-y-3">
          {entries.map((entry) => (
            <JournalCard
              key={entry.id}
              entry={entry}
              task={
                entry.taskId
                  ? state.tasks.find((t) => t.id === entry.taskId)
                  : undefined
              }
            />
          ))}
        </div>
      ) : (
        <div className="bg-white/40 rounded-2xl border border-sage-light/20 p-6 text-center">
          <p className="text-text-muted text-sm">这里会慢慢记录你在地球上的生活痕迹。</p>
        </div>
      )}

      {/* FAB 写日记 */}
      <button
        onClick={() => setShowCreate(true)}
        className="fixed bottom-20 md:bottom-6 right-4 md:right-6 w-12 h-12 bg-sage hover:bg-sage-dark text-white rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-105 active:scale-95 z-40"
      >
        <Plus size={24} />
      </button>

      {showCreate && (
        <CreateJournalModal
          defaultDate={today()}
          onClose={() => setShowCreate(false)}
          onSave={handleSave}
        />
      )}
    </div>
  );
}
