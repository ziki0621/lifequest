import { useState } from "react";
import { X } from "lucide-react";
import type { SideQuest, LifeDomain } from "../types";
import { DOMAIN_LABELS } from "../types";

interface Props {
  quest: SideQuest; mainQuests: { id: string; title: string }[];
  onClose: () => void; onUpdate: (id: string, data: Partial<SideQuest>) => void;
}

const domains: LifeDomain[] = ["body", "mind", "relationship", "home", "exploration", "interest", "learning", "career", "finance"];

export default function EditSideQuestModal({ quest, mainQuests, onClose, onUpdate }: Props) {
  const [title, setTitle] = useState(quest.title);
  const [description, setDescription] = useState(quest.description || "");
  const [domain, setDomain] = useState<LifeDomain>(quest.domain);
  const [mainQuestId, setMainQuestId] = useState(quest.mainQuestId || "");
  const [dueDate, setDueDate] = useState(quest.dueDate || "");

  const handleSubmit = () => {
    if (!title.trim()) return;
    onUpdate(quest.id, {
      title: title.trim(), description: description.trim() || undefined,
      domain, mainQuestId: mainQuestId || undefined, dueDate: dueDate || undefined,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy/30 backdrop-blur-sm animate-fade">
      <div className="glass rounded-3xl shadow-2xl max-w-md w-full animate-scale p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-black text-navy serif">编辑支线</h3>
          <button onClick={onClose} className="p-1.5 rounded-full hover:bg-navy/5 text-navy/40"><X size={16} /></button>
        </div>
        <F label="名称" required><input value={title} onChange={(e) => setTitle(e.target.value)} className="input" /></F>
        <F label="描述"><textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={2} className="input" /></F>
        <div className="grid grid-cols-2 gap-3">
          <F label="领域">
            <select value={domain} onChange={(e) => setDomain(e.target.value as LifeDomain)} className="input">
              {domains.map((d) => <option key={d} value={d}>{DOMAIN_LABELS[d]}</option>)}
            </select>
          </F>
          <F label="关联主线">
            <select value={mainQuestId} onChange={(e) => setMainQuestId(e.target.value)} className="input">
              <option value="">无</option>
              {mainQuests.map((q) => <option key={q.id} value={q.id}>{q.title}</option>)}
            </select>
          </F>
        </div>
        <F label="截止日期">
          <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} className="input" />
        </F>
        <button onClick={handleSubmit} disabled={!title.trim()}
          className="btn btn-primary w-full !rounded-full disabled:opacity-30">保存</button>
      </div>
    </div>
  );
}

function F({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div>
      <label className="text-[9px] font-bold text-navy/30 uppercase tracking-widest block mb-1.5">
        {label}{required && <span className="text-coral ml-0.5">*</span>}
      </label>
      {children}
    </div>
  );
}
