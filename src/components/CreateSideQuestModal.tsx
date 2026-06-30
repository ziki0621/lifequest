import { useState } from "react";
import { X } from "lucide-react";
import type { SideQuest, LifeDomain, LifeAttribute, AttributeReward } from "../types";
import { DOMAIN_LABELS } from "../types";
import { difficultyExp } from "../utils/exp";

interface Props { onClose: () => void; onCreate: (sq: Omit<SideQuest, "id" | "createdAt" | "completed" | "completedAt">) => void; }

const domains: LifeDomain[] = ["body", "mind", "relationship", "home", "exploration", "interest", "learning", "career", "finance"];

export default function CreateSideQuestModal({ onClose, onCreate }: Props) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [domain, setDomain] = useState<LifeDomain>("exploration");
  const [difficulty, setDifficulty] = useState<"easy" | "normal" | "hard">("easy");
  const [dueDate, setDueDate] = useState("");

  const handleSubmit = () => {
    if (!title.trim()) return;
    const exp = difficultyExp(difficulty);
    const rewards = getDefaultRewards(domain, exp);
    onCreate({ title: title.trim(), description: description.trim() || undefined, domain, difficulty, expReward: exp, attributeRewards: rewards, dueDate: dueDate || undefined });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 modal-backdrop animate-fade">
      <div className="wireframe max-w-md w-full animate-scale p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-black text-navy serif">新建支线任务</h3>
          <button onClick={onClose} className="p-1.5 rounded-full hover:bg-navy/5 text-navy/40"><X size={16} /></button>
        </div>

        <F label="任务标题" required><input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="例如：读完一本书" className="wireframe-input" /></F>
        <F label="描述"><textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={2} className="wireframe-input" /></F>

        <div className="grid grid-cols-2 gap-3">
          <F label="领域">
            <select value={domain} onChange={(e) => setDomain(e.target.value as LifeDomain)} className="wireframe-input">
              {domains.map((d) => <option key={d} value={d}>{DOMAIN_LABELS[d]}</option>)}
            </select>
          </F>
          <F label="难度">
            <div className="flex gap-1.5">
              {(["easy", "normal", "hard"] as const).map((d) => (
                <button key={d} onClick={() => setDifficulty(d)} className={`text-[10px] px-2.5 py-1.5 rounded-full font-bold transition-all ${difficulty === d ? "bg-theme text-white" : "bg-navy/5 text-navy/40"}`}>
                  {d === "easy" ? "+10" : d === "normal" ? "+20" : "+35"}
                </button>
              ))}
            </div>
          </F>
        </div>

        <F label="截止日期（可选）">
          <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} className="wireframe-input" />
        </F>

        <button onClick={handleSubmit} disabled={!title.trim()} className="wireframe-btn">创建支线任务</button>
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

function getDefaultRewards(domain: LifeDomain, totalExp: number): AttributeReward[] {
  const map: Partial<Record<LifeDomain, LifeAttribute[]>> = {
    body: ["stamina"], mind: ["mind"], relationship: ["connection"], home: ["order"],
    exploration: ["perception"], interest: ["creativity"], learning: ["knowledge"],
    career: ["order", "knowledge"], finance: ["order"],
  };
  const attrs = map[domain] || ["mind"];
  const per = Math.floor(totalExp / attrs.length);
  return attrs.map((a) => ({ attribute: a, exp: per }));
}
