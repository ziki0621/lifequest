import { useState } from "react";
import { X, Save } from "lucide-react";
import type { Mood, EnergyLevel } from "../types";
import { MOOD_EMOJI, MOOD_LABELS, ENERGY_LABELS } from "../types";

interface CreateJournalModalProps {
  defaultDate: string;
  onClose: () => void;
  onSave: (data: { date: string; mood: Mood; energy: EnergyLevel; content: string; tags: string[] }) => void;
}

export default function CreateJournalModal({ defaultDate, onClose, onSave }: CreateJournalModalProps) {
  const [date, setDate] = useState(defaultDate);
  const [mood, setMood] = useState<Mood>("calm");
  const [energy, setEnergy] = useState<EnergyLevel>("normal");
  const [content, setContent] = useState("");
  const [tagsInput, setTagsInput] = useState("");

  const moods: Mood[] = ["calm", "happy", "tired", "anxious", "sad", "satisfied", "blank", "motivated"];
  const energies: EnergyLevel[] = ["low", "normal", "high"];

  const handleSave = () => {
    if (!content.trim()) return;
    const tags = tagsInput
      .split(/[,，、\s]+/)
      .map((t) => t.trim())
      .filter(Boolean);
    onSave({ date, mood, energy, content: content.trim(), tags });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/20 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-5 border-b border-sage-light/30 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-text-primary">📝 写日记</h3>
          <button onClick={onClose} className="text-text-muted hover:text-text-primary">
            <X size={20} />
          </button>
        </div>
        <div className="p-5 space-y-4">
          <div>
            <label className="text-xs text-text-muted block mb-1">日期</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full rounded-xl border border-sage-light/40 bg-cream/50 px-3 py-2 text-sm text-text-primary focus:outline-none focus:border-sage"
            />
          </div>
          <div>
            <label className="text-xs text-text-muted block mb-1">心情</label>
            <div className="flex flex-wrap gap-1.5">
              {moods.map((m) => (
                <button
                  key={m}
                  onClick={() => setMood(m)}
                  className={`text-xs px-2.5 py-1.5 rounded-full transition-all ${
                    mood === m
                      ? "bg-sage-light text-sage-dark font-medium"
                      : "bg-cream-dark/50 text-text-secondary hover:bg-cream-dark"
                  }`}
                >
                  {MOOD_EMOJI[m]} {MOOD_LABELS[m]}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-xs text-text-muted block mb-1">能量状态</label>
            <div className="flex gap-2">
              {energies.map((e) => (
                <button
                  key={e}
                  onClick={() => setEnergy(e)}
                  className={`text-xs px-3 py-1.5 rounded-full transition-all ${
                    energy === e
                      ? "bg-sage-light text-sage-dark font-medium"
                      : "bg-cream-dark/50 text-text-secondary hover:bg-cream-dark"
                  }`}
                >
                  {ENERGY_LABELS[e]}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-xs text-text-muted block mb-1">正文</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="这次任务带来了什么感受？一句话也可以。"
              rows={4}
              className="w-full rounded-xl border border-sage-light/40 bg-cream/50 px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-sage focus:ring-1 focus:ring-sage-light resize-none"
            />
          </div>
          <div>
            <label className="text-xs text-text-muted block mb-1">标签（逗号分隔）</label>
            <input
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              placeholder="例如：散步, 放松, 日常"
              className="w-full rounded-xl border border-sage-light/40 bg-cream/50 px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-sage focus:ring-1 focus:ring-sage-light"
            />
          </div>
          <button
            onClick={handleSave}
            disabled={!content.trim()}
            className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-sm font-medium bg-sage text-white hover:bg-sage-dark disabled:bg-sage-light/40 disabled:text-text-muted transition-all active:scale-[0.98]"
          >
            <Save size={16} />
            保存日记
          </button>
        </div>
      </div>
    </div>
  );
}
