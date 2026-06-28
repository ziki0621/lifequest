import { useState } from "react";
import { X } from "lucide-react";
import type { Mood, EnergyLevel } from "../types";
import { MOOD_LABELS, MOOD_COLORS, ENERGY_LABELS } from "../types";

interface CreateJournalModalProps {
  defaultDate: string;
  onClose: () => void;
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade">
      <div className="bg-bg-elevated border border-border-default rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto animate-scale">
        <div className="p-5 border-b border-border-subtle flex items-center justify-between">
          <h3 className="text-sm font-semibold text-text-primary">写日记</h3>
          <button onClick={onClose} className="p-1.5 rounded-lg text-text-muted hover:text-text-primary hover:bg-bg-glass transition-colors">
            <X size={16} />
          </button>
        </div>
        <div className="p-5 space-y-4">
          <div>
            <label className="text-[10px] text-text-muted block mb-1.5 font-medium uppercase tracking-wider">日期</label>
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="input w-full" />
          </div>
          <div>
            <label className="text-[10px] text-text-muted block mb-1.5 font-medium uppercase tracking-wider">心情</label>
            <div className="flex flex-wrap gap-1.5">
              {moods.map((m) => (
                <button
                  key={m}
                  onClick={() => setMood(m)}
                  className={`text-[10px] px-2.5 py-1.5 rounded-full border transition-all ${
                    mood === m
                      ? `${MOOD_COLORS[m]} bg-bg-glass border-current/30 font-medium`
                      : "text-text-muted border-border-subtle hover:border-border-default"
                  }`}
                >
                  {MOOD_LABELS[m]}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-[10px] text-text-muted block mb-1.5 font-medium uppercase tracking-wider">能量</label>
            <div className="flex gap-2">
              {energies.map((e) => (
                <button
                  key={e}
                  onClick={() => setEnergy(e)}
                  className={`text-[10px] px-3 py-1.5 rounded-full border transition-all ${
                    energy === e
                      ? "text-accent bg-accent-surface border-accent/20 font-medium"
                      : "text-text-muted border-border-subtle hover:border-border-default"
                  }`}
                >
                  {ENERGY_LABELS[e]}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-[10px] text-text-muted block mb-1.5 font-medium uppercase tracking-wider">正文</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="这次任务带来了什么感受？一句话也可以。"
              rows={4}
              className="input w-full resize-none"
            />
          </div>
          <div>
            <label className="text-[10px] text-text-muted block mb-1.5 font-medium uppercase tracking-wider">标签（逗号分隔）</label>
            <input
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              placeholder="例如：散步, 放松, 日常"
              className="input w-full"
            />
          </div>
          <button
            onClick={handleSave}
            disabled={!content.trim()}
            className="w-full py-2.5 rounded-xl text-[11px] font-semibold tracking-wide uppercase bg-accent text-white hover:bg-accent-soft disabled:opacity-30 disabled:cursor-not-allowed transition-all active:scale-[0.98]"
          >
            保存日记
          </button>
        </div>
      </div>
    </div>
  );
}
