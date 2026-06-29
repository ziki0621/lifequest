import { useState } from "react";
import { X } from "lucide-react";
import type { QuestLine, LifeDomain } from "../types";
import { DOMAIN_LABELS } from "../types";

interface CreateQuestLineModalProps { onClose: () => void; onCreate: (ql: Omit<QuestLine, "id" | "createdAt">) => void; }
const domains: LifeDomain[] = ["body", "mind", "relationship", "home", "exploration", "interest", "learning", "career", "finance"];

export default function CreateQuestLineModal({ onClose, onCreate }: CreateQuestLineModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [domain, setDomain] = useState<LifeDomain>("mind");

  const handleSubmit = () => {
    if (!title.trim()) return;
    onCreate({ title: title.trim(), description: description.trim(), domain, status: "active" });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy/30 backdrop-blur-sm animate-fade">
      <div className="glass rounded-3xl shadow-2xl max-w-md w-full animate-scale p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-black text-navy serif">创建主线</h3>
          <button onClick={onClose} className="p-1.5 rounded-full hover:bg-navy/5 text-navy/40"><X size={16} /></button>
        </div>
        <div>
          <label className="text-[9px] font-bold text-navy/30 uppercase tracking-widest block mb-1.5">主线名称 <span className="text-coral">*</span></label>
          <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="例如：找回稳定生活节奏" className="input" />
        </div>
        <div>
          <label className="text-[9px] font-bold text-navy/30 uppercase tracking-widest block mb-1.5">描述</label>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="这条主线是关于什么的？" rows={2} className="input" />
        </div>
        <div>
          <label className="text-[9px] font-bold text-navy/30 uppercase tracking-widest block mb-1.5">生活领域</label>
          <select value={domain} onChange={(e) => setDomain(e.target.value as LifeDomain)} className="input">
            {domains.map((d) => <option key={d} value={d}>{DOMAIN_LABELS[d]}</option>)}
          </select>
        </div>
        <button onClick={handleSubmit} disabled={!title.trim()} className="btn btn-primary w-full !rounded-full disabled:opacity-30 disabled:cursor-not-allowed">
          创建主线
        </button>
      </div>
    </div>
  );
}
