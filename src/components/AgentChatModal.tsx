import { useState } from "react";
import { X } from "lucide-react";
import type { NpcProfile } from "../types/agent";
import TypewriterText from "./TypewriterText";

interface Props {
  npc: NpcProfile; title: string; intro: string; placeholder: string;
  loading?: boolean; onClose: () => void; onSubmit: (text: string) => void;
}

export default function AgentChatModal({ npc, title, intro, placeholder, loading, onClose, onSubmit }: Props) {
  const [text, setText] = useState("");
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy/30 backdrop-blur-sm animate-fade">
      <div className="glass rounded-3xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto animate-scale p-6 space-y-5">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-[9px] font-bold text-coral uppercase tracking-widest">{title}</p>
            <h3 className="text-sm font-black text-navy serif">{npc.name} • {npc.title}</h3>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-full hover:bg-navy/5 text-navy/40"><X size={16} /></button>
        </div>
        <div className="flex gap-3 items-start">
          <div className="w-14 h-14 rounded-2xl bg-white/50 border border-white/60 flex items-center justify-center text-2xl flex-shrink-0">{npc.avatar}</div>
          <div className="flex-1 rounded-2xl bg-white/35 border border-navy/5 p-4">
            <TypewriterText text={intro} className="text-[12px] text-navy/60 leading-relaxed serif" />
          </div>
        </div>
        <textarea className="input" rows={4} placeholder={placeholder} value={text} onChange={(e) => setText(e.target.value)} />
        <div className="flex justify-end gap-2">
          <button className="btn btn-ghost !text-[11px]" onClick={onClose}>取消</button>
          <button className="btn btn-primary !text-[11px]" disabled={!text.trim() || loading} onClick={() => onSubmit(text.trim())}>
            {loading ? "生成中..." : "发送"}
          </button>
        </div>
      </div>
    </div>
  );
}
