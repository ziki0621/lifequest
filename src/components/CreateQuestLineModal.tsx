import { useState } from "react";
import { X } from "lucide-react";
import type { QuestLine, LifeDomain } from "../types";
import { DOMAIN_LABELS } from "../types";

interface CreateQuestLineModalProps {
  onClose: () => void;
  onCreate: (ql: Omit<QuestLine, "id" | "createdAt">) => void;
}

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade">
      <div className="bg-bg-elevated border border-border-default rounded-2xl shadow-2xl max-w-md w-full animate-scale">
        <div className="p-5 border-b border-border-subtle flex items-center justify-between">
          <h3 className="text-sm font-semibold text-text-primary">创建主线</h3>
          <button onClick={onClose} className="p-1.5 rounded-lg text-text-muted hover:text-text-primary hover:bg-bg-glass transition-colors">
            <X size={16} />
          </button>
        </div>
        <div className="p-5 space-y-4">
          <div>
            <label className="text-[10px] text-text-muted block mb-1.5 font-medium uppercase tracking-wider">
              主线名称 <span className="text-accent">*</span>
            </label>
            <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="例如：找回稳定生活节奏" className="input w-full" />
          </div>
          <div>
            <label className="text-[10px] text-text-muted block mb-1.5 font-medium uppercase tracking-wider">描述</label>
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="这条主线是关于什么的？" rows={2} className="input w-full resize-none" />
          </div>
          <div>
            <label className="text-[10px] text-text-muted block mb-1.5 font-medium uppercase tracking-wider">生活领域</label>
            <select value={domain} onChange={(e) => setDomain(e.target.value as LifeDomain)} className="input w-full">
              {domains.map((d) => (
                <option key={d} value={d}>{DOMAIN_LABELS[d]}</option>
              ))}
            </select>
          </div>
          <button
            onClick={handleSubmit}
            disabled={!title.trim()}
            className="w-full py-2.5 rounded-xl text-[11px] font-semibold tracking-wide uppercase bg-accent text-white hover:bg-accent-soft disabled:opacity-30 disabled:cursor-not-allowed transition-all active:scale-[0.98]"
          >
            创建主线
          </button>
        </div>
      </div>
    </div>
  );
}
