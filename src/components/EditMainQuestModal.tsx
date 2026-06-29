import { useState } from "react";
import { X } from "lucide-react";
import type { MainQuest, LifeDomain } from "../types";
import { DOMAIN_LABELS } from "../types";

interface Props {
  quest: MainQuest; onClose: () => void;
  onUpdate: (id: string, data: Partial<MainQuest>) => void;
  onArchive?: (id: string) => void;
  onDelete?: (id: string) => void;
}

const domains: LifeDomain[] = ["body", "mind", "relationship", "home", "exploration", "interest", "learning", "career", "finance"];

export default function EditMainQuestModal({ quest, onClose, onUpdate, onArchive, onDelete }: Props) {
  const [title, setTitle] = useState(quest.title);
  const [description, setDescription] = useState(quest.description);
  const [domain, setDomain] = useState<LifeDomain>(quest.domain);

  const handleSubmit = () => {
    if (!title.trim()) return;
    onUpdate(quest.id, { title: title.trim(), description: description.trim(), domain });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy/30 backdrop-blur-sm animate-fade">
      <div className="glass rounded-3xl shadow-2xl max-w-md w-full animate-scale p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-black text-navy serif">编辑主线</h3>
          <button onClick={onClose} className="p-1.5 rounded-full hover:bg-navy/5 text-navy/40"><X size={16} /></button>
        </div>
        <div>
          <label className="text-[9px] font-bold text-navy/30 uppercase tracking-widest block mb-1.5">名称 <span className="text-coral">*</span></label>
          <input value={title} onChange={(e) => setTitle(e.target.value)} className="input" />
        </div>
        <div>
          <label className="text-[9px] font-bold text-navy/30 uppercase tracking-widest block mb-1.5">描述</label>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={2} className="input" />
        </div>
        <div>
          <label className="text-[9px] font-bold text-navy/30 uppercase tracking-widest block mb-1.5">领域</label>
          <select value={domain} onChange={(e) => setDomain(e.target.value as LifeDomain)} className="input">
            {domains.map((d) => <option key={d} value={d}>{DOMAIN_LABELS[d]}</option>)}
          </select>
        </div>
        <button onClick={handleSubmit} disabled={!title.trim()}
          className="btn btn-primary w-full !rounded-full disabled:opacity-30">保存</button>

        <div className="pt-3 border-t border-navy/5 space-y-2">
          <p className="text-[9px] font-bold text-navy/20 uppercase tracking-widest">危险操作</p>
          <div className="flex gap-2">
            {onArchive && (
              <button onClick={() => onArchive(quest.id)} className="btn btn-ghost !text-[10px] !py-1.5 flex-1 text-coral/60 hover:text-coral">
                归档任务
              </button>
            )}
            {onDelete && (
              <button onClick={() => { if (window.confirm("确定要删除吗？这个操作会移除该任务，但可以在几秒内撤销。")) onDelete(quest.id); }}
                className="btn btn-ghost !text-[10px] !py-1.5 flex-1 text-coral/60 hover:text-coral">
                删除任务
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
