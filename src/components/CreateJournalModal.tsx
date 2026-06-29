import { useState } from "react";
import { X } from "lucide-react";
import type { Mood, EnergyLevel } from "../types";
import { MOOD_LABELS, ENERGY_LABELS } from "../types";

interface CreateJournalModalProps {
  defaultDate: string; onClose: () => void;
  onSave: (data: { date: string; mood: Mood; energy: EnergyLevel; content: string; tags: string[] }) => void;
}
const moods: Mood[] = ["calm", "happy", "tired", "anxious", "sad", "satisfied", "blank", "motivated"];
const energies: EnergyLevel[] = ["low", "normal", "high"];

export default function CreateJournalModal({ defaultDate, onClose, onSave }: CreateJournalModalProps) {
  const [date, setDate] = useState(defaultDate);
  const [mood, setMood] = useState<Mood>("calm");
  const [energy, setEnergy] = useState<EnergyLevel>("normal");
  const [content, setContent] = useState("");
  const [tagsInput, setTagsInput] = useState("");

  const handleSave = () => {
    if (!content.trim()) return;
    const tags = tagsInput.split(/[,，、\s]+/).map((t) => t.trim()).filter(Boolean);
    onSave({ date, mood, energy, content: content.trim(), tags });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy/30 backdrop-blur-sm animate-fade">
      <div className="glass rounded-3xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto animate-scale p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-black text-navy serif">写日记</h3>
          <button onClick={onClose} className="p-1.5 rounded-full hover:bg-navy/5 text-navy/40"><X size={16} /></button>
        </div>

        <div>
          <label className="text-[9px] font-bold text-navy/30 uppercase tracking-widest block mb-1.5">日期</label>
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="input" />
        </div>

        <div>
          <label className="text-[9px] font-bold text-navy/30 uppercase tracking-widest block mb-2">心情</label>
          <div className="flex flex-wrap gap-1.5">
            {moods.map((m) => (
              <button key={m} onClick={() => setMood(m)}
                className={`text-[10px] px-3 py-1.5 rounded-full font-bold tracking-wider transition-all ${
                  mood === m ? "bg-theme text-white" : "bg-navy/5 text-navy/40 hover:bg-navy/10"
                }`}>{MOOD_LABELS[m]}</button>
            ))}
          </div>
        </div>

        <div>
          <label className="text-[9px] font-bold text-navy/30 uppercase tracking-widest block mb-2">能量</label>
          <div className="flex gap-2">
            {energies.map((e) => (
              <button key={e} onClick={() => setEnergy(e)}
                className={`text-[10px] px-3 py-1.5 rounded-full font-bold tracking-wider transition-all ${
                  energy === e ? "bg-coral text-white" : "bg-navy/5 text-navy/40 hover:bg-navy/10"
                }`}>{ENERGY_LABELS[e]}</button>
            ))}
          </div>
        </div>

        <div>
          <label className="text-[9px] font-bold text-navy/30 uppercase tracking-widest block mb-1.5">正文</label>
          <textarea value={content} onChange={(e) => setContent(e.target.value)}
            placeholder="发生了什么？感受到什么？" rows={4} className="input" />
        </div>

        <div>
          <label className="text-[9px] font-bold text-navy/30 uppercase tracking-widest block mb-1.5">标签</label>
          <input value={tagsInput} onChange={(e) => setTagsInput(e.target.value)}
            placeholder="散步, 放松, 日常" className="input" />
        </div>

        <button onClick={handleSave} disabled={!content.trim()}
          className="btn btn-primary w-full !rounded-full disabled:opacity-30 disabled:cursor-not-allowed">
          保存日记
        </button>
      </div>
    </div>
  );
}
