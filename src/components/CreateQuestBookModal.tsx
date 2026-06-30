import { useState } from "react";
import { X } from "lucide-react";
import type { QuestBook, LifeDomain } from "../types";
import { DOMAIN_LABELS } from "../types";

interface Props { onClose: () => void; onCreate: (qb: Omit<QuestBook, "id" | "createdAt">) => void; }

const domains: LifeDomain[] = ["body", "mind", "relationship", "home", "exploration", "interest", "learning", "career", "finance"];

export default function CreateQuestBookModal({ onClose, onCreate }: Props) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [domain, setDomain] = useState<LifeDomain>("mind");

  const handleSubmit = () => { if (!title.trim()) return; onCreate({ title: title.trim(), description: description.trim(), domain, status: "active", questLines: [], directTasks: [] }); onClose(); };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy/30 backdrop-blur-sm animate-fade">
      <div className="glass rounded-3xl shadow-2xl max-w-md w-full animate-scale p-6 space-y-4">
        <div className="flex items-center justify-between"><h3 className="text-sm font-black text-navy serif">创建任务书</h3><button onClick={onClose} className="p-1.5 rounded-full hover:bg-navy/5 text-navy/40"><X size={16} /></button></div>
        <F label="名称" required><input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="例如：找回稳定生活节奏" className="input" /></F>
        <F label="描述"><textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="这本任务书是关于什么的？" rows={2} className="input" /></F>
        <F label="领域"><select value={domain} onChange={(e) => setDomain(e.target.value as LifeDomain)} className="input">{domains.map((d) => <option key={d} value={d}>{DOMAIN_LABELS[d]}</option>)}</select></F>
        <p className="text-[9px] text-navy/25">创建后可以在任务书内添加多条任务线和直接任务。</p>
        <button onClick={handleSubmit} disabled={!title.trim()} className="btn btn-primary w-full !rounded-full disabled:opacity-30">创建任务书</button>
      </div>
    </div>
  );
}
function F({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) { return <div><label className="text-[9px] font-bold text-navy/30 uppercase tracking-widest block mb-1.5">{label}{required && <span className="text-coral ml-0.5">*</span>}</label>{children}</div>; }
