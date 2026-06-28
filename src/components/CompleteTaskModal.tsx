import { useState } from "react";
import { X, Check, Sparkles, ArrowRight } from "lucide-react";
import type { Task, Mood, EnergyLevel } from "../types";
import { ATTRIBUTE_ICONS, ATTRIBUTE_LABELS, ATTRIBUTE_COLORS } from "../types";
import { MOOD_LABELS, MOOD_COLORS, ENERGY_LABELS } from "../types";

interface CompleteTaskModalProps {
  task: Task;
  onClose: () => void;
  onSaveJournal: (content: string, mood: Mood, energy: EnergyLevel) => void;
}

const moods: Mood[] = ["calm", "happy", "tired", "anxious", "sad", "satisfied", "blank", "motivated"];
const energies: EnergyLevel[] = ["low", "normal", "high"];

export default function CompleteTaskModal({ task, onClose, onSaveJournal }: CompleteTaskModalProps) {
  const [content, setContent] = useState("");
  const [mood, setMood] = useState<Mood>("satisfied");
  const [energy, setEnergy] = useState<EnergyLevel>("normal");
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    onSaveJournal(content, mood, energy);
    setSaved(true);
    setTimeout(onClose, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade">
      <div className={`bg-bg-elevated border border-border-default rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto animate-scale ${saved ? "opacity-0 scale-95 transition-all duration-300" : ""}`}>
        {/* Header */}
        <div className="p-5 border-b border-border-subtle">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-green-surface/30 flex items-center justify-center">
                <Check size={14} className="text-green" />
              </div>
              <h3 className="text-sm font-semibold text-text-primary">任务完成</h3>
            </div>
            <button onClick={onClose} className="p-1.5 rounded-lg text-text-muted hover:text-text-primary hover:bg-bg-glass transition-colors">
              <X size={16} />
            </button>
          </div>
          <p className="text-[12px] text-text-secondary mt-2 ml-9">
            你完成了「{task.title}」
          </p>

          {/* Rewards */}
          <div className="flex flex-wrap gap-1.5 mt-3 ml-9">
            <span className="inline-flex items-center gap-1 text-[10px] font-medium bg-gold-surface/30 text-gold px-2.5 py-1 rounded-full border border-gold/20">
              <Sparkles size={10} /> +{task.expReward} 总经验
            </span>
            {task.attributeRewards.map((ar) => {
              const AttrIcon = ATTRIBUTE_ICONS[ar.attribute];
              return (
                <span key={ar.attribute} className={`inline-flex items-center gap-1 text-[10px] bg-bg-glass border border-border-subtle px-2 py-1 rounded-full ${ATTRIBUTE_COLORS[ar.attribute]}`}>
                  <AttrIcon size={10} strokeWidth={1.5} />
                  {ATTRIBUTE_LABELS[ar.attribute]} +{ar.exp}
                </span>
              );
            })}
          </div>
        </div>

        {/* Journal entry */}
        <div className="p-5 space-y-4">
          <p className="text-[11px] text-text-muted">这次任务带来了什么感受？一句话也可以。</p>

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
                      ? "text-accent bg-accent-surface/30 border-accent/20 font-medium"
                      : "text-text-muted border-border-subtle hover:border-border-default"
                  }`}
                >
                  {ENERGY_LABELS[e]}
                </button>
              ))}
            </div>
          </div>

          <div>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="写下一句记录…（可跳过）"
              rows={3}
              className="w-full rounded-xl border border-border-subtle bg-bg-glass px-3 py-2.5 text-[12px] text-text-primary placeholder:text-text-muted/50 focus:outline-none focus:border-accent/30 focus:ring-1 focus:ring-accent/20 resize-none"
            />
          </div>

          <div className="flex gap-2 justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-[11px] font-medium text-text-muted hover:text-text-primary hover:bg-bg-glass transition-all"
            >
              稍后再说
            </button>
            <button
              onClick={handleSave}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-[11px] font-medium bg-accent-surface text-accent border border-accent/20 hover:bg-accent hover:text-white transition-all active:scale-95"
            >
              <ArrowRight size={13} />
              保存记录
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
