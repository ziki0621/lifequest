import { useState } from "react";
import { Plus, Edit3, FileText } from "lucide-react";
import { useApp } from "../hooks/useApp";
import JournalCard from "../components/JournalCard";
import CreateJournalModal from "../components/CreateJournalModal";
import type { Mood, EnergyLevel } from "../types";
import { today } from "../utils/date";

export default function JournalPage() {
  const { state, addJournal } = useApp();
  const [tab, setTab] = useState<"diary" | "log">("diary");
  const [showCreate, setShowCreate] = useState(false);

  const diaryEntries = state.journalEntries
    .filter((j) => !j.taskId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const taskLogs = state.journalEntries
    .filter((j) => j.taskId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const handleSave = (data: { date: string; mood: Mood; energy: EnergyLevel; content: string; tags: string[] }) => {
    addJournal({ date: data.date, mood: data.mood, energy: data.energy, content: data.content, tags: data.tags });
  };

  const entries = tab === "diary" ? diaryEntries : taskLogs;

  return (
    <div className="space-y-5 animate-fade">
      {/* Tab switcher */}
      <div className="flex bg-bg-elevated/60 rounded-lg p-0.5 border border-border-subtle">
        <button
          onClick={() => setTab("diary")}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2 text-[11px] font-medium rounded-md transition-all ${
            tab === "diary" ? "bg-bg-glass text-text-primary shadow-sm" : "text-text-muted hover:text-text-secondary"
          }`}
        >
          <Edit3 size={13} strokeWidth={1.5} /> 每日日记
        </button>
        <button
          onClick={() => setTab("log")}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2 text-[11px] font-medium rounded-md transition-all ${
            tab === "log" ? "bg-bg-glass text-text-primary shadow-sm" : "text-text-muted hover:text-text-secondary"
          }`}
        >
          <FileText size={13} strokeWidth={1.5} /> 任务日志
        </button>
      </div>

      {/* Entries */}
      {entries.length > 0 ? (
        <div className="space-y-3 stagger-1">
          {entries.map((entry) => (
            <JournalCard
              key={entry.id}
              entry={entry}
              task={entry.taskId ? state.tasks.find((t) => t.id === entry.taskId) : undefined}
            />
          ))}
        </div>
      ) : (
        <div className="bg-bg-elevated/40 rounded-xl border border-border-subtle border-dashed p-8 text-center">
          <p className="text-[11px] text-text-muted">这里会慢慢记录你在地球上的生活痕迹。</p>
        </div>
      )}

      {/* FAB */}
      <button
        onClick={() => setShowCreate(true)}
        className="fixed bottom-20 md:bottom-6 right-4 md:right-6 w-11 h-11 bg-accent hover:bg-accent-soft text-white rounded-xl shadow-lg shadow-accent-glow flex items-center justify-center transition-all hover:scale-105 active:scale-95 z-40"
      >
        <Plus size={20} strokeWidth={2} />
      </button>

      {showCreate && <CreateJournalModal defaultDate={today()} onClose={() => setShowCreate(false)} onSave={handleSave} />}
    </div>
  );
}
