import { useState } from "react";
import { X, Check, Sparkles } from "lucide-react";
import type { CompletionContext, Mood, EnergyLevel } from "../types";
import { ATTRIBUTE_ICONS, ATTRIBUTE_LABELS, ATTR_COLOR } from "../types";
import { MOOD_LABELS, ENERGY_LABELS } from "../types";

interface Props {
  ctx: CompletionContext; onClose: () => void;
  onSaveJournal: (content: string, mood: Mood, energy: EnergyLevel) => void;
}

const moods: Mood[] = ["calm", "happy", "tired", "anxious", "sad", "satisfied", "blank", "motivated"];
const energies: EnergyLevel[] = ["low", "normal", "high"];

const typeLabel: Record<string, string> = {
  mainStage: "主线阶段完成", daily: "日常打卡完成", sideQuest: "支线任务完成",
};

export default function CompleteTaskModal({ ctx, onClose, onSaveJournal }: Props) {
  const [content, setContent] = useState("");
  const [mood, setMood] = useState<Mood>("satisfied");
  const [energy, setEnergy] = useState<EnergyLevel>("normal");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy/30 backdrop-blur-sm animate-fade">
      <div className="glass rounded-3xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto animate-scale p-6 space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-theme text-white flex items-center justify-center">
              <Check size={15} />
            </div>
            <div>
              <h3 className="text-sm font-black text-navy serif">任务完成</h3>
              <p className="text-[9px] font-bold text-navy/30 uppercase tracking-widest">{typeLabel[ctx.itemType]}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-full hover:bg-navy/5 text-navy/40"><X size={16} /></button>
        </div>

        <p className="text-[13px] text-navy/60 font-medium serif leading-relaxed">你完成了「{ctx.title}」</p>

        <div className="flex flex-wrap gap-2">
          <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-theme text-white px-3 py-1.5 rounded-full tracking-wider">
            <Sparkles size={10} /> +{ctx.expReward} EXP
          </span>
          {ctx.attributeRewards.map((ar) => {
            const AIcon = ATTRIBUTE_ICONS[ar.attribute];
            return (
              <span key={ar.attribute} className="inline-flex items-center gap-1 text-[10px] font-bold px-3 py-1.5 rounded-full border tracking-wider" style={{ color: ATTR_COLOR[ar.attribute], borderColor: ATTR_COLOR[ar.attribute] }}>
                <AIcon size={10} /> {ATTRIBUTE_LABELS[ar.attribute]} +{ar.exp}
              </span>
            );
          })}
        </div>

        <div className="border-t border-navy/5 pt-4 space-y-4">
          <p className="text-[11px] font-bold text-navy/40 uppercase tracking-widest">写一句记录</p>
          <div>
            <label className="text-[9px] font-bold text-navy/30 uppercase tracking-widest block mb-2">心情</label>
            <div className="flex flex-wrap gap-1.5">
              {moods.map((m) => (
                <button key={m} onClick={() => setMood(m)}
                  className={`text-[10px] px-3 py-1.5 rounded-full font-bold tracking-wider transition-all ${mood === m ? "bg-theme text-white" : "bg-navy/5 text-navy/40 hover:bg-navy/10"}`}>
                  {MOOD_LABELS[m]}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-[9px] font-bold text-navy/30 uppercase tracking-widest block mb-2">能量</label>
            <div className="flex gap-2">
              {energies.map((e) => (
                <button key={e} onClick={() => setEnergy(e)}
                  className={`text-[10px] px-3 py-1.5 rounded-full font-bold tracking-wider transition-all ${energy === e ? "bg-coral text-white" : "bg-navy/5 text-navy/40 hover:bg-navy/10"}`}>
                  {ENERGY_LABELS[e]}
                </button>
              ))}
            </div>
          </div>
          <textarea value={content} onChange={(e) => setContent(e.target.value)}
            placeholder="写下感受…（可跳过）" rows={3} className="input" />
          <div className="flex gap-2 justify-end">
            <button onClick={onClose} className="btn btn-ghost !text-[11px]">稍后再说</button>
            <button onClick={() => { onSaveJournal(content, mood, energy); onClose(); }} className="btn btn-primary !text-[11px]">保存记录</button>
          </div>
        </div>
      </div>
    </div>
  );
}
