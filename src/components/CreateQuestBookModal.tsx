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
    <div className="modal-backdrop animate-fade">
      <div className="wireframe max-w-md w-full animate-scale"><div className="wireframe-inner p-5 space-y-4">
        <div className="flex items-center justify-between"><h3 className="text-sm font-black text-ink serif">创建任务书</h3><button onClick={onClose} className="p-1.5 border border-ink/20 hover:border-ink/50 text-ink/40"><X size={16} /></button></div>
        <F label="名称" required><input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="例如：找回稳定生活节奏" className="wireframe-input" /></F>
        <F label="描述"><textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="这本任务书是关于什么的？" rows={2} className="wireframe-input" /></F>
        <F label="领域"><select value={domain} onChange={(e) => setDomain(e.target.value as LifeDomain)} className="wireframe-input">{domains.map((d) => <option key={d} value={d}>{DOMAIN_LABELS[d]}</option>)}</select></F>
        <p className="text-[9px] text-ink/25">创建后可以在任务书内添加多条任务线和直接任务。</p>
        <div className={`chamfer-btn h-10 w-full ${!title.trim() ? "opacity-30 pointer-events-none" : ""}`} onClick={handleSubmit}><div className="chamfer-outer"><div className="chamfer-gap"><div className="chamfer-inner"><div className="chamfer-core"><span className="text-[11px] font-bold tracking-widest">创建任务书</span></div></div></div></div></div>
      </div></div>
    </div>
  );
}
function F({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) { return <div><label className="text-[9px] font-bold text-ink/30 uppercase tracking-widest block mb-1.5">{label}{required && <span className="text-coral ml-0.5">*</span>}</label>{children}</div>; }
