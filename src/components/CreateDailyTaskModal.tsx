import { useState } from "react";
import { X } from "lucide-react";
import type { DailyTask, LifeDomain, RecurrencePeriod, LifeAttribute, AttributeReward } from "../types";
import { DOMAIN_LABELS } from "../types";
import { difficultyExp } from "../utils/exp";

interface Props { onClose: () => void; onCreate: (dt: Omit<DailyTask, "id" | "createdAt" | "completions">) => void; }

const domains: LifeDomain[] = ["body", "mind", "relationship", "home", "exploration", "interest", "learning", "career", "finance"];
const periods: RecurrencePeriod[] = ["daily", "weekly", "monthly"];
const periodLabels: Record<RecurrencePeriod, string> = { daily: "每天", weekly: "每周", monthly: "每月" };

export default function CreateDailyTaskModal({ onClose, onCreate }: Props) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [domain, setDomain] = useState<LifeDomain>("body");
  const [difficulty, setDifficulty] = useState<"easy" | "normal" | "hard">("easy");
  const [period, setPeriod] = useState<RecurrencePeriod>("daily");
  const [targetCount, setTargetCount] = useState(1);

  const handleSubmit = () => {
    if (!title.trim()) return;
    const exp = difficultyExp(difficulty);
    const rewards = getDefaultRewards(domain, exp);
    onCreate({ title: title.trim(), description: description.trim() || undefined, domain, difficulty, expReward: exp, attributeRewards: rewards, period, targetCount, active: true });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy/30 backdrop-blur-sm animate-fade">
      <div className="glass rounded-3xl shadow-2xl max-w-md w-full animate-scale p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-black text-navy serif">新建日常任务</h3>
          <button onClick={onClose} className="p-1.5 rounded-full hover:bg-navy/5 text-navy/40"><X size={16} /></button>
        </div>

        <F label="任务标题" required><input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="例如：每周运动2次" className="input" /></F>
        <F label="描述"><textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="简短描述…" rows={2} className="input" /></F>

        <div className="grid grid-cols-2 gap-3">
          <F label="领域">
            <select value={domain} onChange={(e) => setDomain(e.target.value as LifeDomain)} className="input">
              {domains.map((d) => <option key={d} value={d}>{DOMAIN_LABELS[d]}</option>)}
            </select>
          </F>
          <F label="难度">
            <div className="flex gap-1.5">
              {(["easy", "normal", "hard"] as const).map((d) => (
                <button key={d} onClick={() => setDifficulty(d)}
                  className={`text-[10px] px-2.5 py-1.5 rounded-full font-bold transition-all ${difficulty === d ? "bg-navy text-white" : "bg-navy/5 text-navy/40"}`}>
                  {d === "easy" ? "+10" : d === "normal" ? "+20" : "+35"}
                </button>
              ))}
            </div>
          </F>
        </div>

        <F label="周期">
          <div className="flex gap-2">
            {periods.map((p) => (
              <button key={p} onClick={() => setPeriod(p)}
                className={`text-[10px] px-3 py-1.5 rounded-full font-bold transition-all ${period === p ? "bg-coral text-white" : "bg-navy/5 text-navy/40"}`}>
                {periodLabels[p]}
              </button>
            ))}
          </div>
        </F>

        <F label="目标次数">
          <div className="flex items-center gap-2">
            <button onClick={() => setTargetCount(Math.max(1, targetCount - 1))}
              className="w-8 h-8 rounded-full bg-navy/5 text-navy font-bold">−</button>
            <span className="text-sm font-black text-navy w-8 text-center">{targetCount}</span>
            <button onClick={() => setTargetCount(targetCount + 1)}
              className="w-8 h-8 rounded-full bg-navy text-white font-bold">+</button>
            <span className="text-[10px] text-navy/30 font-medium">
              {period === "daily" ? "次/天" : period === "weekly" ? "次/周" : "次/月"}
            </span>
          </div>
        </F>

        <button onClick={handleSubmit} disabled={!title.trim()}
          className="btn btn-primary w-full !rounded-full disabled:opacity-30">创建日常任务</button>
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
