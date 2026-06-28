import { useState } from "react";
import { X } from "lucide-react";
import type { Task, TaskType, LifeDomain, LifeAttribute, AttributeReward } from "../types";
import { TASK_TYPE_LABELS, DOMAIN_LABELS } from "../types";
import { difficultyExp } from "../utils/exp";

interface CreateTaskModalProps {
  questLineId?: string;
  questLines: { id: string; title: string }[];
  onClose: () => void;
  onCreate: (task: Omit<Task, "id" | "createdAt" | "completed" | "completedAt">) => void;
}

const taskTypes: TaskType[] = ["main", "side", "daily", "exploration", "relationship", "selfCare", "home", "interest"];
const domains: LifeDomain[] = ["body", "mind", "relationship", "home", "exploration", "interest", "learning", "career", "finance"];

export default function CreateTaskModal({ questLineId, questLines, onClose, onCreate }: CreateTaskModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [qlId, setQlId] = useState(questLineId || "");
  const [type, setType] = useState<TaskType>("side");
  const [domain, setDomain] = useState<LifeDomain>("mind");
  const [difficulty, setDifficulty] = useState<Task["difficulty"]>("easy");
  const [dueDate, setDueDate] = useState("");

  const handleSubmit = () => {
    if (!title.trim()) return;
    const exp = difficultyExp(difficulty);
    const attributeRewards = getDefaultRewards(domain, type, exp);
    onCreate({
      title: title.trim(),
      description: description.trim() || undefined,
      questLineId: qlId || undefined,
      type, domain, difficulty, expReward: exp, attributeRewards,
      dueDate: dueDate || undefined,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade">
      <div className="bg-bg-elevated border border-border-default rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto animate-scale">
        <div className="p-5 border-b border-border-subtle flex items-center justify-between">
          <h3 className="text-sm font-semibold text-text-primary">新建任务</h3>
          <button onClick={onClose} className="p-1.5 rounded-lg text-text-muted hover:text-text-primary hover:bg-bg-glass transition-colors">
            <X size={16} />
          </button>
        </div>
        <div className="p-5 space-y-4">
          <Field label="任务标题" required>
            <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="例如：出门散步 15 分钟" className="input" />
          </Field>
          <Field label="描述">
            <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="简短描述一下…" rows={2} className="input resize-none" />
          </Field>
          <Field label="所属主线">
            <select value={qlId} onChange={(e) => setQlId(e.target.value)} className="input">
              <option value="">无（独立任务）</option>
              {questLines.map((ql) => <option key={ql.id} value={ql.id}>{ql.title}</option>)}
            </select>
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="类型">
              <select value={type} onChange={(e) => setType(e.target.value as TaskType)} className="input">
                {taskTypes.map((t) => <option key={t} value={t}>{TASK_TYPE_LABELS[t]}</option>)}
              </select>
            </Field>
            <Field label="领域">
              <select value={domain} onChange={(e) => setDomain(e.target.value as LifeDomain)} className="input">
                {domains.map((d) => <option key={d} value={d}>{DOMAIN_LABELS[d]}</option>)}
              </select>
            </Field>
          </div>
          <Field label="难度">
            <div className="flex gap-2">
              {(["easy", "normal", "hard"] as const).map((d) => (
                <button
                  key={d}
                  onClick={() => setDifficulty(d)}
                  className={`text-[10px] px-3 py-1.5 rounded-full border transition-all ${
                    difficulty === d
                      ? "text-accent bg-accent-surface border-accent/20 font-medium"
                      : "text-text-muted border-border-subtle hover:border-border-default"
                  }`}
                >
                  {d === "easy" ? "简单 +10" : d === "normal" ? "普通 +20" : "困难 +35"}
                </button>
              ))}
            </div>
          </Field>
          <Field label="截止日期">
            <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} className="input" />
          </Field>
          <button
            onClick={handleSubmit}
            disabled={!title.trim()}
            className="w-full py-2.5 rounded-xl text-[11px] font-semibold tracking-wide uppercase bg-accent text-white hover:bg-accent-soft disabled:opacity-30 disabled:cursor-not-allowed transition-all active:scale-[0.98]"
          >
            创建任务
          </button>
        </div>
      </div>
    </div>
  );
}

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div>
      <label className="text-[10px] text-text-muted block mb-1.5 font-medium uppercase tracking-wider">
        {label}{required && <span className="text-accent ml-0.5">*</span>}
      </label>
      {children}
    </div>
  );
}

function getDefaultRewards(domain: LifeDomain, _type: TaskType, totalExp: number): AttributeReward[] {
  const map: Partial<Record<LifeDomain, LifeAttribute[]>> = {
    body: ["stamina"], mind: ["mind"], relationship: ["connection"],
    home: ["order"], exploration: ["perception"], interest: ["creativity"],
    learning: ["knowledge"], career: ["order", "knowledge"], finance: ["order"],
  };
  const attrs = map[domain] || ["mind"];
  const perAttr = Math.floor(totalExp / attrs.length);
  return attrs.map((attr) => ({ attribute: attr, exp: perAttr }));
}
