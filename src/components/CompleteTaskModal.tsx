import { useState } from "react";
import { X, Save } from "lucide-react";
import type { Task, Mood, EnergyLevel } from "../types";
import { ATTRIBUTE_EMOJI, ATTRIBUTE_LABELS, MOOD_EMOJI, MOOD_LABELS, ENERGY_LABELS } from "../types";

interface CompleteTaskModalProps {
  task: Task;
  onClose: () => void;
  onSaveJournal: (content: string, mood: Mood, energy: EnergyLevel) => void;
}

export default function CompleteTaskModal({ task, onClose, onSaveJournal }: CompleteTaskModalProps) {
  const [content, setContent] = useState("");
  const [mood, setMood] = useState<Mood>("calm");
  const [energy, setEnergy] = useState<EnergyLevel>("normal");

  const moods: Mood[] = ["calm", "happy", "tired", "anxious", "sad", "satisfied", "blank", "motivated"];
  const energies: EnergyLevel[] = ["low", "normal", "high"];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/20 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto animate-in">
        {/* Header */}
        <div className="p-5 border-b border-sage-light/30">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-text-primary">🎉 任务完成！</h3>
            <button onClick={onClose} className="text-text-muted hover:text-text-primary transition-colors">
              <X size={20} />
            </button>
          </div>
          <p className="text-sm text-text-secondary mt-1">
            你完成了「{task.title}」
          </p>
          {/* Rewards */}
          <div className="flex flex-wrap gap-2 mt-3">
            <span className="text-sm font-medium bg-warm-gold-light text-warm-gold px-3 py-1 rounded-full">
              ⭐ +{task.expReward} 总经验
            </span>
            {task.attributeRewards.map((ar) => (
              <span key={ar.attribute} className="text-sm bg-sage-light/50 text-sage-dark px-3 py-1 rounded-full">
                {ATTRIBUTE_EMOJI[ar.attribute]} {ATTRIBUTE_LABELS[ar.attribute]} +{ar.exp}
              </span>
            ))}
          </div>
        </div>

        {/* Journal entry */}
        <div className="p-5 space-y-4">
          <p className="text-sm text-text-secondary">
            这次任务带来了什么感受？一句话也可以。
          </p>

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
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="写下一句记录…（可跳过）"
              rows={3}
              className="w-full rounded-xl border border-sage-light/40 bg-cream/50 px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-sage focus:ring-1 focus:ring-sage-light resize-none"
            />
          </div>

          <div className="flex gap-2 justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-sm text-text-muted hover:text-text-primary hover:bg-cream-dark/30 transition-all"
            >
              稍后再说
            </button>
            <button
              onClick={() => onSaveJournal(content, mood, energy)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium bg-sage-light hover:bg-sage text-sage-dark hover:text-white transition-all active:scale-95"
            >
              <Save size={16} />
              保存记录
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
