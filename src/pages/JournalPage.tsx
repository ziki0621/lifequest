import { useState } from "react";
import { Plus, Edit3, BookOpen } from "lucide-react";
import { useApp } from "../hooks/useApp";
import JournalCard from "../components/JournalCard";
import CreateJournalModal from "../components/CreateJournalModal";
import type { Mood, EnergyLevel } from "../types";
import { today } from "../utils/date";

export default function JournalPage() {
  const { state, addJournal } = useApp();
  const [tab, setTab] = useState<"diary" | "log">("diary");
  const [showCreate, setShowCreate] = useState(false);

  const diaryEntries = state.journalEntries.filter((j) => !j.taskId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  const taskLogs = state.journalEntries.filter((j) => j.taskId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const handleSave = (data: { date: string; mood: Mood; energy: EnergyLevel; content: string; tags: string[] }) => {
    addJournal({ date: data.date, mood: data.mood, energy: data.energy, content: data.content, tags: data.tags });
  };

  const entries = tab === "diary" ? diaryEntries : taskLogs;

  return (
    <div className="space-y-8 animate-in pb-24">
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

      {entries.length > 0 ? (
        <div className="space-y-4 stagger-1 md:ml-10">
          {entries.map((entry) => (
            <JournalCard key={entry.id} entry={entry}
              task={entry.taskId ? state.tasks.find((t) => t.id === entry.taskId) : undefined} />
          ))}
        </div>
      ) : (
        <div className="glass rounded-3xl p-10 text-center">
          <p className="text-navy/30 font-bold text-xs tracking-widest uppercase">这里会慢慢记录你在地球上的生活痕迹。</p>
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
