import { useState } from "react";
import { X, Check } from "lucide-react";
import type { CompletionContext, Mood, EnergyLevel } from "../types";
import { ATTRIBUTE_ICONS, ATTRIBUTE_LABELS, ATTR_COLOR, MOOD_LABELS, ENERGY_LABELS } from "../types";
import { ChamferedButton } from "./vintage";

interface Props { ctx: CompletionContext; onClose: () => void; onSaveJournal: (c: string, m: Mood, e: EnergyLevel) => void; }
const mm: Mood[] = ["calm","happy","tired","anxious","sad","satisfied","blank","motivated"];
const ee: EnergyLevel[] = ["low","normal","high"];

export default function CompleteTaskModal({ ctx, onClose, onSaveJournal }: Props) {
  const [content, setContent] = useState(""); const [mood, setMood] = useState<Mood>("satisfied"); const [energy, setEnergy] = useState<EnergyLevel>("normal");
  return <div className="modal-backdrop animate-fade"><div className="wireframe max-w-md w-full max-h-[90vh] overflow-y-auto animate-scale"><div className="wireframe-inner p-5 space-y-5">
    <div className="flex items-center justify-between"><div className="flex items-center gap-2"><div className="w-7 h-7 border-[1.5px] border-[#4A3B2C] bg-[#4A3B2C] text-[#F3EAD5] flex items-center justify-center"><Check size={14}/></div><h3 className="text-sm font-black text-[#4A3B2C] serif">任务完成</h3></div><button onClick={onClose} className="p-1 border border-[#4A3B2C]/20 hover:border-[#4A3B2C]/50 text-[#4A3B2C]/40"><X size={14}/></button></div>
    <p className="text-[13px] text-[#4A3B2C]/60 font-medium serif">你完成了<strong className="text-[#4A3B2C]">「{ctx.title}」</strong></p>
    <div className="flex flex-wrap gap-2"><span className="inline-flex items-center gap-1 text-[10px] font-bold bg-[#4A3B2C] text-[#F3EAD5] px-3 py-1.5 border border-[#4A3B2C] tracking-wider">+{ctx.expReward} EXP</span>{ctx.attributeRewards.map(ar=>{const AI=ATTRIBUTE_ICONS[ar.attribute];return<span key={ar.attribute} className="inline-flex items-center gap-1 text-[10px] font-bold px-3 py-1.5 border-[1.5px] border-[#4A3B2C]/20 tracking-wider" style={{color:ATTR_COLOR[ar.attribute]}}><AI size={10}/> {ATTRIBUTE_LABELS[ar.attribute]} +{ar.exp}</span>})}</div>
    <div className="border-t-[0.5px] border-[#4A3B2C]/10 pt-4 space-y-4"><p className="text-[11px] font-bold text-[#4A3B2C]/40 uppercase tracking-widest">写一句记录</p>
      <div><label className="text-[9px] font-bold text-[#4A3B2C]/30 uppercase tracking-widest block mb-2">心情</label><div className="flex flex-wrap gap-1.5">{mm.map(m=><button key={m} onClick={()=>setMood(m)} className={`text-[10px] px-3 py-1.5 font-bold tracking-wider border-[1.5px] transition-colors ${mood===m?"bg-[#4A3B2C] text-[#F3EAD5] border-[#4A3B2C]":"bg-[#F3EAD5] text-[#4A3B2C]/40 border-[#4A3B2C]/20 hover:border-[#4A3B2C]/40"}`}>{MOOD_LABELS[m]}</button>)}</div></div>
      <div><label className="text-[9px] font-bold text-[#4A3B2C]/30 uppercase tracking-widest block mb-2">能量</label><div className="flex gap-2">{ee.map(e=><button key={e} onClick={()=>setEnergy(e)} className={`text-[10px] px-3 py-1.5 font-bold tracking-wider border-[1.5px] transition-colors ${energy===e?"bg-[#4A3B2C] text-[#F3EAD5] border-[#4A3B2C]":"bg-[#F3EAD5] text-[#4A3B2C]/40 border-[#4A3B2C]/20 hover:border-[#4A3B2C]/40"}`}>{ENERGY_LABELS[e]}</button>)}</div></div>
      <textarea value={content} onChange={e=>setContent(e.target.value)} placeholder="写下感受…（可跳过）" rows={3} className="wireframe-input"/>
      <div className="flex gap-2 justify-end"><button onClick={onClose} className="text-[11px] font-bold text-[#4A3B2C]/30 hover:text-[#4A3B2C] px-4 py-2 border border-[#4A3B2C]/15 hover:border-[#4A3B2C]/30">稍后再说</button><ChamferedButton onClick={()=>{onSaveJournal(content,mood,energy);onClose()}}><span className="text-[10px] font-bold">保存记录</span></ChamferedButton></div>
    </div></div></div></div>;
}
