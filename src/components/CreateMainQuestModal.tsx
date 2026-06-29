import { useState } from "react";
import { X, Plus, Trash2 } from "lucide-react";
import type { MainQuest, QuestStage, LifeDomain } from "../types";
import { DOMAIN_LABELS } from "../types";
import { genId } from "../utils/id";

interface Props { onClose: () => void; onCreate: (mq: Omit<MainQuest, "id" | "createdAt">) => void; }

const domains: LifeDomain[] = ["body", "mind", "relationship", "home", "exploration", "interest", "learning", "career", "finance"];

export default function CreateMainQuestModal({ onClose, onCreate }: Props) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [domain, setDomain] = useState<LifeDomain>("mind");
  const [stageList, setStageList] = useState<{ id: string; title: string; anchorDate?: string }[]>([
    { id: genId(), title: "" },
  ]);

  const addStage = () => setStageList([...stageList, { id: genId(), title: "" }]);
  const removeStage = (id: string) => {
    if (stageList.length <= 1) return;
    setStageList(stageList.filter((s) => s.id !== id));
  };
  const updateStage = (id: string, field: string, value: string) => {
    setStageList(stageList.map((s) => s.id === id ? { ...s, [field]: value } : s));
  };

  const handleSubmit = () => {
    if (!title.trim()) return;
    const stages: QuestStage[] = stageList
      .filter((s) => s.title.trim())
      .map((s, i) => ({
        id: genId(), title: s.title.trim(), anchorDate: s.anchorDate || undefined,
        completed: false, order: i,
      }));
    if (stages.length === 0) return;
    onCreate({ title: title.trim(), description: description.trim(), domain, status: "active", stages });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy/30 backdrop-blur-sm animate-fade">
      <div className="glass rounded-3xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto animate-scale p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-black text-navy serif">创建主线</h3>
          <button onClick={onClose} className="p-1.5 rounded-full hover:bg-navy/5 text-navy/40"><X size={16} /></button>
        </div>

        <F label="主线名称" required><input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="例如：找回稳定生活节奏" className="input" /></F>
        <F label="描述"><textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="这条主线是关于什么的？" rows={2} className="input" /></F>
        <F label="生活领域">
          <select value={domain} onChange={(e) => setDomain(e.target.value as LifeDomain)} className="input">
            {domains.map((d) => <option key={d} value={d}>{DOMAIN_LABELS[d]}</option>)}
          </select>
        </F>

        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-[9px] font-bold text-navy/30 uppercase tracking-widest">阶段列表</label>
            <button onClick={addStage} className="text-[10px] font-bold text-coral flex items-center gap-1"><Plus size={12} /> 添加</button>
          </div>
          <div className="space-y-2">
            {stageList.map((s, i) => (
              <div key={s.id} className="flex items-center gap-2">
                <span className="text-[10px] font-bold text-navy/20 w-5">{i + 1}.</span>
                <input value={s.title} onChange={(e) => updateStage(s.id, "title", e.target.value)}
                  placeholder={`阶段 ${i + 1} 标题`} className="input flex-1 !py-2 !text-[11px]" />
                <input type="date" value={s.anchorDate || ""} onChange={(e) => updateStage(s.id, "anchorDate", e.target.value)}
                  className="input !w-32 !py-2 !text-[10px]" />
                <button onClick={() => removeStage(s.id)} className="p-1 text-navy/20 hover:text-coral"><Trash2 size={13} /></button>
              </div>
            ))}
          </div>
        </div>

        <button onClick={handleSubmit} disabled={!title.trim()}
          className="btn btn-primary w-full !rounded-full disabled:opacity-30">创建主线</button>
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
