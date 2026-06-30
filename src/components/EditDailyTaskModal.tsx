import { useState } from "react";
import { X } from "lucide-react";
import type { DailyTask, LifeDomain, RecurrencePeriod } from "../types";
import { DOMAIN_LABELS, WEEKDAY_LABELS } from "../types";

interface Props {
  task: DailyTask; onClose: () => void;
  onUpdate: (id: string, data: Partial<DailyTask>) => void;
  onArchive?: (id: string) => void;
  onDelete?: (id: string) => void;
}

const domains: LifeDomain[] = ["body", "mind", "relationship", "home", "exploration", "interest", "learning", "career", "finance"];
const periods: RecurrencePeriod[] = ["daily", "weekly", "monthly"];
const periodLabels: Record<RecurrencePeriod, string> = { daily: "每天", weekly: "每周", monthly: "每月" };

export default function EditDailyTaskModal({ task, onClose, onUpdate, onArchive, onDelete }: Props) {
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description || "");
  const [domain, setDomain] = useState<LifeDomain>(task.domain);
  const [period, setPeriod] = useState<RecurrencePeriod>(task.period);
  const [targetCount, setTargetCount] = useState(task.targetCount);
  const [daysOfWeek, setDaysOfWeek] = useState<number[]>(task.daysOfWeek || []);
  const [timesPerDay, setTimesPerDay] = useState(task.timesPerDay || 1);

  const toggleDay = (d: number) => {
    setDaysOfWeek((prev) => prev.includes(d) ? prev.filter((x) => x !== d) : [...prev, d].sort());
  };

  const handleSubmit = () => {
    if (!title.trim()) return;
    const updates: Partial<DailyTask> = {
      title: title.trim(), description: description.trim() || undefined,
      domain, period, targetCount,
    };
    if (period === "daily") {
      updates.daysOfWeek = daysOfWeek.length > 0 ? daysOfWeek : undefined;
      updates.timesPerDay = timesPerDay;
    }
    onUpdate(task.id, updates);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 modal-backdrop animate-fade">
      <div className="wireframe max-w-md w-full max-h-[90vh] overflow-y-auto animate-scale p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-black text-navy serif">编辑日常</h3>
          <button onClick={onClose} className="p-1.5 rounded-full hover:bg-navy/5 text-navy/40"><X size={16} /></button>
        </div>

        <F label="名称" required><input value={title} onChange={(e) => setTitle(e.target.value)} className="wireframe-input" /></F>
        <F label="描述"><textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={2} className="wireframe-input" /></F>

        <div className="grid grid-cols-2 gap-3">
          <F label="领域">
            <select value={domain} onChange={(e) => setDomain(e.target.value as LifeDomain)} className="wireframe-input">
              {domains.map((d) => <option key={d} value={d}>{DOMAIN_LABELS[d]}</option>)}
            </select>
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

        {period === "daily" && (
          <>
            <F label="选择周几">
              <div className="flex gap-1.5">
                {[0, 1, 2, 3, 4, 5, 6].map((d) => (
                  <button key={d} onClick={() => toggleDay(d)}
                    className={`w-9 h-9 rounded-full text-[10px] font-bold transition-all ${daysOfWeek.includes(d) ? "bg-theme text-white" : "bg-navy/5 text-navy/30 hover:bg-navy/10"}`}>
                    {WEEKDAY_LABELS[d]}
                  </button>
                ))}
              </div>
              <p className="text-[9px] text-navy/25 mt-1">{daysOfWeek.length === 0 ? "未选择 = 每天" : `已选 ${daysOfWeek.length} 天`}</p>
            </F>
            <F label="每天几次">
              <div className="flex items-center gap-2">
                <button onClick={() => setTimesPerDay(Math.max(1, timesPerDay - 1))} className="w-8 h-8 rounded-full bg-navy/5 text-navy font-bold">−</button>
                <span className="text-sm font-black text-navy w-8 text-center">{timesPerDay}</span>
                <button onClick={() => setTimesPerDay(timesPerDay + 1)} className="w-8 h-8 rounded-full bg-theme text-white font-bold">+</button>
                <span className="text-[10px] text-navy/30 font-medium">次/天</span>
              </div>
            </F>
          </>
        )}

        {period !== "daily" && (
          <F label="目标次数">
            <div className="flex items-center gap-2">
              <button onClick={() => setTargetCount(Math.max(1, targetCount - 1))} className="w-8 h-8 rounded-full bg-navy/5 text-navy font-bold">−</button>
              <span className="text-sm font-black text-navy w-8 text-center">{targetCount}</span>
              <button onClick={() => setTargetCount(targetCount + 1)} className="w-8 h-8 rounded-full bg-theme text-white font-bold">+</button>
              <span className="text-[10px] text-navy/30 font-medium">{period === "weekly" ? "次/周" : "次/月"}</span>
            </div>
          </F>
        )}

        <button onClick={handleSubmit} disabled={!title.trim()}
          className="wireframe-btn">保存</button>

        <div className="pt-3 border-t border-navy/5 space-y-2">
          <p className="text-[9px] font-bold text-navy/20 uppercase tracking-widest">危险操作</p>
          <div className="flex gap-2">
            {onArchive && (
              <button onClick={() => onArchive(task.id)} className="wireframe-btn-ghost !text-[10px] !py-1.5 flex-1 text-coral/60 hover:text-coral">
                归档任务
              </button>
            )}
            {onDelete && (
              <button onClick={() => { if (window.confirm("确定要删除吗？这个操作会移除该任务，但可以在几秒内撤销。")) onDelete(task.id); }}
                className="wireframe-btn-ghost !text-[10px] !py-1.5 flex-1 text-coral/60 hover:text-coral">
                删除任务
              </button>
            )}
          </div>
        </div>
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
