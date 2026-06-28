import { useState } from "react";
import { X } from "lucide-react";
import type { Task, TaskType, LifeDomain, LifeAttribute, AttributeReward } from "../types";
import {
  TASK_TYPE_LABELS,
  DOMAIN_LABELS,
  DOMAIN_EMOJI,
} from "../types";
import { difficultyExp } from "../utils/exp";

interface CreateTaskModalProps {
  questLineId?: string;
  questLines: { id: string; title: string }[];
  onClose: () => void;
  onCreate: (task: Omit<Task, "id" | "createdAt" | "completed" | "completedAt">) => void;
}

export default function CreateTaskModal({ questLineId, questLines, onClose, onCreate }: CreateTaskModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [qlId, setQlId] = useState(questLineId || "");
  const [type, setType] = useState<TaskType>("side");
  const [domain, setDomain] = useState<LifeDomain>("mind");
  const [difficulty, setDifficulty] = useState<Task["difficulty"]>("easy");
  const [dueDate, setDueDate] = useState("");

  const taskTypes: TaskType[] = ["main", "side", "daily", "exploration", "relationship", "selfCare", "home", "interest"];
  const domains: LifeDomain[] = ["body", "mind", "relationship", "home", "exploration", "interest", "learning", "career", "finance"];

  const handleSubmit = () => {
    if (!title.trim()) return;
    const exp = difficultyExp(difficulty);
    // 自动推导属性奖励
    const attributeRewards = getDefaultRewards(domain, type, exp);
    onCreate({
      title: title.trim(),
      description: description.trim() || undefined,
      questLineId: qlId || undefined,
      type,
      domain,
      difficulty,
      expReward: exp,
      attributeRewards,
      dueDate: dueDate || undefined,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/20 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-5 border-b border-sage-light/30 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-text-primary">➕ 新建任务</h3>
          <button onClick={onClose} className="text-text-muted hover:text-text-primary">
            <X size={20} />
          </button>
        </div>
        <div className="p-5 space-y-4">
          <div>
            <label className="text-xs text-text-muted block mb-1">任务标题 *</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="例如：出门散步 15 分钟"
              className="w-full rounded-xl border border-sage-light/40 bg-cream/50 px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-sage focus:ring-1 focus:ring-sage-light"
            />
          </div>
          <div>
            <label className="text-xs text-text-muted block mb-1">描述</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="简短描述一下…"
              rows={2}
              className="w-full rounded-xl border border-sage-light/40 bg-cream/50 px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-sage focus:ring-1 focus:ring-sage-light resize-none"
            />
          </div>
          <div>
            <label className="text-xs text-text-muted block mb-1">所属主线</label>
            <select
              value={qlId}
              onChange={(e) => setQlId(e.target.value)}
              className="w-full rounded-xl border border-sage-light/40 bg-cream/50 px-3 py-2 text-sm text-text-primary focus:outline-none focus:border-sage"
            >
              <option value="">无（独立任务）</option>
              {questLines.map((ql) => (
                <option key={ql.id} value={ql.id}>{ql.title}</option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-text-muted block mb-1">任务类型</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as TaskType)}
                className="w-full rounded-xl border border-sage-light/40 bg-cream/50 px-3 py-2 text-sm text-text-primary focus:outline-none focus:border-sage"
              >
                {taskTypes.map((t) => (
                  <option key={t} value={t}>{TASK_TYPE_LABELS[t]}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs text-text-muted block mb-1">生活领域</label>
              <select
                value={domain}
                onChange={(e) => setDomain(e.target.value as LifeDomain)}
                className="w-full rounded-xl border border-sage-light/40 bg-cream/50 px-3 py-2 text-sm text-text-primary focus:outline-none focus:border-sage"
              >
                {domains.map((d) => (
                  <option key={d} value={d}>{DOMAIN_EMOJI[d]} {DOMAIN_LABELS[d]}</option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label className="text-xs text-text-muted block mb-1">难度</label>
            <div className="flex gap-2">
              {(["easy", "normal", "hard"] as const).map((d) => (
                <button
                  key={d}
                  onClick={() => setDifficulty(d)}
                  className={`text-xs px-3 py-1.5 rounded-full transition-all ${
                    difficulty === d
                      ? "bg-sage-light text-sage-dark font-medium"
                      : "bg-cream-dark/50 text-text-secondary hover:bg-cream-dark"
                  }`}
                >
                  {d === "easy" ? "简单 +10EXP" : d === "normal" ? "普通 +20EXP" : "困难 +35EXP"}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-xs text-text-muted block mb-1">截止日期（可选）</label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full rounded-xl border border-sage-light/40 bg-cream/50 px-3 py-2 text-sm text-text-primary focus:outline-none focus:border-sage"
            />
          </div>
          <button
            onClick={handleSubmit}
            disabled={!title.trim()}
            className="w-full py-2.5 rounded-xl text-sm font-medium bg-sage text-white hover:bg-sage-dark disabled:bg-sage-light/40 disabled:text-text-muted transition-all active:scale-[0.98]"
          >
            创建任务
          </button>
        </div>
      </div>
    </div>
  );
}

/** 根据领域和任务类型自动推导属性奖励 */
function getDefaultRewards(
  domain: LifeDomain,
  _type: TaskType,
  totalExp: number
): AttributeReward[] {
  const map: Partial<Record<LifeDomain, LifeAttribute[]>> = {
    body: ["stamina"],
    mind: ["mind"],
    relationship: ["connection"],
    home: ["order"],
    exploration: ["perception"],
    interest: ["creativity"],
    learning: ["knowledge"],
    career: ["order", "knowledge"],
    finance: ["order"],
  };
  const attrs = map[domain] || ["mind"];
  const perAttr = Math.floor(totalExp / attrs.length);
  return attrs.map((attr) => ({ attribute: attr, exp: perAttr }));
}
