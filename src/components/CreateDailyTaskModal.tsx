import { useState } from "react";
import { X } from "lucide-react";
import type { DailyTask, LifeDomain, RecurrencePeriod, LifeAttribute, AttributeReward } from "../types";
import { DOMAIN_LABELS, WEEKDAY_LABELS } from "../types";
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
  const [daysOfWeek, setDaysOfWeek] = useState<number[]>([]);
  const [timesPerDay, setTimesPerDay] = useState(1);

  const toggleDay = (d: number) => {
    setDaysOfWeek((prev) => prev.includes(d) ? prev.filter((x) => x !== d) : [...prev, d].sort());
  };

  const handleSubmit = () => {
    if (!title.trim()) return;
    const exp = difficultyExp(difficulty);
    const rewards = getDefaultRewards(domain, exp);
    onCreate({
      title: title.trim(), description: description.trim() || undefined,
      domain, difficulty, expReward: exp, attributeRewards: rewards,
      period, targetCount,
      ...(period === "daily" ? { daysOfWeek: daysOfWeek.length > 0 ? daysOfWeek : undefined, timesPerDay } : {}),
      active: true,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 modal-backdrop animate-fade">
      <div className="wireframe max-w-md w-full max-h-[90vh] overflow-y-auto animate-scale p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-black text-navy serif">新建日常任务</h3>
          <button onClick={onClose} className="p-1.5 rounded-full hover:bg-navy/5 text-navy/40"><X size={16} /></button>
        </div>

        <F label="任务标题" required><input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="例如：每周运动2次" className="wireframe-input" /></F>
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
                <button key={d} onClick={() => setDifficulty(d)}
                  className={`text-[10px] px-2.5 py-1.5 rounded-full font-bold transition-all ${difficulty === d ? "bg-theme text-white" : "bg-navy/5 text-navy/40"}`}>
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

        {/* Day-of-week picker — only for daily */}
        {period === "daily" && (
          <>
            <F label="选择周几">
              <div className="flex gap-1.5">
                {[0, 1, 2, 3, 4, 5, 6].map((d) => (
                  <button key={d} onClick={() => toggleDay(d)}
                    className={`w-9 h-9 rounded-full text-[10px] font-bold transition-all ${
                      daysOfWeek.includes(d) ? "bg-theme text-white" : "bg-navy/5 text-navy/30 hover:bg-navy/10"
                    }`}>
                    {WEEKDAY_LABELS[d]}
                  </button>
                ))}
              </div>
              <p className="text-[9px] text-navy/25 mt-1">
                {daysOfWeek.length === 0 ? "未选择 = 每天" : `已选 ${daysOfWeek.length} 天`}
              </p>
            </F>

            <F label="每天几次">
              <div className="flex items-center gap-2">
                <button onClick={() => setTimesPerDay(Math.max(1, timesPerDay - 1))}
                  className="w-8 h-8 rounded-full bg-navy/5 text-navy font-bold">−</button>
                <span className="text-sm font-black text-navy w-8 text-center">{timesPerDay}</span>
                <button onClick={() => setTimesPerDay(timesPerDay + 1)}
                  className="w-8 h-8 rounded-full bg-theme text-white font-bold">+</button>
                <span className="text-[10px] text-navy/30 font-medium">次/天</span>
              </div>
            </F>
          </>
        )}

        {/* Target count — for weekly/monthly */}
        {period !== "daily" && (
          <F label="目标次数">
            <div className="flex items-center gap-2">
              <button onClick={() => setTargetCount(Math.max(1, targetCount - 1))}
                className="w-8 h-8 rounded-full bg-navy/5 text-navy font-bold">−</button>
              <span className="text-sm font-black text-navy w-8 text-center">{targetCount}</span>
              <button onClick={() => setTargetCount(targetCount + 1)}
                className="w-8 h-8 rounded-full bg-theme text-white font-bold">+</button>
              <span className="text-[10px] text-navy/30 font-medium">
                {period === "weekly" ? "次/周" : "次/月"}
              </span>
            </div>
          </F>
        )}

        <button onClick={handleSubmit} disabled={!title.trim()}
          className="wireframe-btn">创建日常任务</button>
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
