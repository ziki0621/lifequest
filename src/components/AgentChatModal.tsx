import { useState } from "react";
import { X } from "lucide-react";
import type { NpcProfile } from "../types/agent";
import TypewriterText from "./TypewriterText";

interface Props {
  npc: NpcProfile; title: string; intro: string; placeholder: string;
  taskTypes: Array<{ id: string; label: string; icon: React.ComponentType<{ size?: number; strokeWidth?: number }> }>;
  loading?: boolean; onClose: () => void;
  onSubmit: (text: string, taskType: string) => void;
}

export default function AgentChatModal({ npc, title, intro, placeholder, taskTypes, loading, onClose, onSubmit }: Props) {
  const [step, setStep] = useState<"type" | "input">(taskTypes.length > 0 ? "type" : "input");
  const [selectedType, setSelectedType] = useState("");
  const [text, setText] = useState("");

  const handleTypeSelect = (typeId: string) => {
    setSelectedType(typeId);
    setStep("input");
  };

  const handleSubmit = () => {
    if (!text.trim()) return;
    onSubmit(text.trim(), selectedType);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 modal-backdrop animate-fade">
      <div className="wireframe max-w-lg w-full max-h-[90vh] overflow-y-auto animate-scale p-6 space-y-5">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-[9px] font-bold text-coral uppercase tracking-widest">{title}</p>
            <h3 className="text-sm font-black text-ink serif">{npc.name} • {npc.title}</h3>
          </div>
          <button onClick={onClose} className="p-1.5  hover:bg-ink/5 text-ink/40"><X size={16} /></button>
        </div>

        {/* NPC intro bubble */}
        <div className="flex gap-3 items-start">
          <div className="w-14 h-14  bg-white/50 border border-white/60 flex items-center justify-center text-2xl flex-shrink-0">{npc.avatar}</div>
          <div className="flex-1  bg-white/35 border border-[#4A3B2C]/5 p-4">
            <TypewriterText
              text={step === "type" || taskTypes.length === 0 ? intro : `好的。告诉我具体想${selectedType === "main" ? "推进哪条主线" : selectedType === "daily" ? "养成什么日常习惯" : selectedType === "side" ? "完成什么支线" : "改变什么"}。`}
              className="text-[12px] text-ink/60 leading-relaxed serif"
            />
          </div>
        </div>

        {/* Step 1: Choose task type */}
        {step === "type" && (
          <div className="grid grid-cols-2 gap-2">
            {taskTypes.map((t) => {
              const Icon = t.icon;
              return (
                <button key={t.id} onClick={() => handleTypeSelect(t.id)}
                  className={`flex items-center gap-2.5 p-3  text-[11px] font-bold transition-all ${
                    selectedType === t.id ? "bg-theme text-white" : "bg-white/30 text-ink/60 hover:bg-white/50"
                  }`}>
                  <Icon size={15} /> {t.label}
                </button>
              );
            })}
          </div>
        )}

        {/* Step 2: Text input */}
        {step === "input" && (
          <>
            <textarea className="wireframe-input" rows={4} placeholder={placeholder} value={text} onChange={(e) => setText(e.target.value)} />
            <div className="flex justify-end gap-2">
              {taskTypes.length > 0 && <button className="wireframe-btn-ghost !text-[10px]" onClick={() => setStep("type")}>返回</button>}
              <button className="wireframe-btn-ghost !text-[11px]" onClick={onClose}>取消</button>
              <button className="wireframe-btn !text-[11px]" disabled={!text.trim() || loading} onClick={handleSubmit}>
                {loading ? "生成中..." : "发送"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
