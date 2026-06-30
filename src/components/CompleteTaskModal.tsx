import { useState } from "react";
import { X, Check } from "lucide-react";
import type { CompletionContext, Mood, EnergyLevel } from "../types";
import { ATTRIBUTE_ICONS, ATTRIBUTE_LABELS, ATTR_COLOR, MOOD_LABELS, ENERGY_LABELS } from "../types";

interface Props { ctx: CompletionContext; onClose: () => void; onSaveJournal: (content: string, mood: Mood, energy: EnergyLevel) => void; }

const moods: Mood[] = ["calm", "happy", "tired", "anxious", "sad", "satisfied", "blank", "motivated"];
const energies: EnergyLevel[] = ["low", "normal", "high"];

export default function CompleteTaskModal({ ctx, onClose, onSaveJournal }: Props) {
  const [content, setContent] = useState("");
  const [mood, setMood] = useState<Mood>("satisfied");
  const [energy, setEnergy] = useState<EnergyLevel>("normal");

  return (
    <div className="modal-backdrop animate-fade">
      <div className="wireframe max-w-md w-full max-h-[90vh] overflow-y-auto animate-scale">
        <div className="wireframe-inner p-5 space-y-5"><div className="flex items-center justify-between"><div className="flex items-center gap-2"><div className="w-7 h-7 border-[1.5px] border-ink bg-ink text-parchment flex items-center justify-center"><Check size={14} /></div><h3 className="text-sm font-black text-ink serif">任务完成</h3></div><button onClick={onClose} className="p-1 border border-ink/20 hover:border-ink/50 text-ink/40"><X size={14} /></button></div>
          <p className="text-[13px] text-ink/60 font-medium serif">你完成了「{ctx.title}」</p>
          <div className="flex flex-wrap gap-2">
            <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-ink text-parchment px-3 py-1.5 border border-ink tracking-wider">+{ctx.expReward} EXP</span>
            {ctx.attributeRewards.map((ar) => { const AIcon = ATTRIBUTE_ICONS[ar.attribute]; return <span key={ar.attribute} className="inline-flex items-center gap-1 text-[10px] font-bold px-3 py-1.5 border-[1.5px] border-ink/20 tracking-wider" style={{ color: ATTR_COLOR[ar.attribute] }}><AIcon size={10} /> {ATTRIBUTE_LABELS[ar.attribute]} +{ar.exp}</span>; })}
          </div>
          <div className="border-t-[0.5px] border-ink/10 pt-4 space-y-4"><p className="text-[11px] font-bold text-ink/40 uppercase tracking-widest">写一句记录</p>
            <div><label className="text-[9px] font-bold text-ink/30 uppercase tracking-widest block mb-2">心情</label><div className="flex flex-wrap gap-1.5">{moods.map((m) => <button key={m} onClick={() => setMood(m)} className={`text-[10px] px-3 py-1.5 font-bold tracking-wider border-[1.5px] transition-colors ${mood === m ? "bg-ink text-parchment border-ink" : "bg-parchment text-ink/40 border-ink/20 hover:border-ink/40"}`}>{MOOD_LABELS[m]}</button>)}</div></div>
            <div><label className="text-[9px] font-bold text-ink/30 uppercase tracking-widest block mb-2">能量</label><div className="flex gap-2">{energies.map((e) => <button key={e} onClick={() => setEnergy(e)} className={`text-[10px] px-3 py-1.5 font-bold tracking-wider border-[1.5px] transition-colors ${energy === e ? "bg-ink text-parchment border-ink" : "bg-parchment text-ink/40 border-ink/20 hover:border-ink/40"}`}>{ENERGY_LABELS[e]}</button>)}</div></div>
            <textarea value={content} onChange={(e) => setContent(e.target.value)} placeholder="写下感受…（可跳过）" rows={3} className="wireframe-input" />
            <div className="flex gap-2 justify-end"><button onClick={onClose} className="text-[11px] font-bold text-ink/30 hover:text-ink px-4 py-2 border border-ink/15 hover:border-ink/30">稍后再说</button>
              <div className="chamfer-btn h-9" onClick={() => { onSaveJournal(content, mood, energy); onClose(); }}><div className="chamfer-outer"><div className="chamfer-gap"><div className="chamfer-inner"><div className="chamfer-core px-4"><span className="text-[10px] font-bold">保存记录</span></div></div></div></div></div>
            </div></div></div>
      </div>
    </div>
  );
}
