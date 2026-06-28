import { ChevronRight } from "lucide-react";
import type { QuestLine, Task } from "../types";
import { DOMAIN_EMOJI } from "../types";

interface QuestLineCardProps {
  questLine: QuestLine;
  tasks: Task[];
  onSelect: (id: string) => void;
}

export default function QuestLineCard({ questLine, tasks, onSelect }: QuestLineCardProps) {
  const total = tasks.length;
  const completed = tasks.filter((t) => t.completed).length;
  const progress = total > 0 ? Math.round((completed / total) * 100) : 0;

  const statusLabel =
    questLine.status === "active"
      ? "进行中"
      : questLine.status === "paused"
      ? "暂停"
      : "已完成";

  const statusColors = {
    active: "bg-green-50 text-green-600",
    paused: "bg-yellow-50 text-yellow-600",
    completed: "bg-sage-light text-sage-dark",
  };

  return (
    <button
      onClick={() => onSelect(questLine.id)}
      className="w-full text-left bg-white/70 rounded-2xl border border-sage-light/40 p-4 transition-all duration-200 hover:shadow-md hover:-translate-y-0.5"
    >
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-lg">{DOMAIN_EMOJI[questLine.domain]}</span>
            <h3 className="font-semibold text-text-primary">{questLine.title}</h3>
          </div>
          <p className="text-xs text-text-muted mt-1">{questLine.description}</p>
        </div>
        <ChevronRight size={18} className="text-text-muted mt-1 flex-shrink-0" />
      </div>
      <div className="flex items-center gap-3 mt-3">
        <span className={`text-xs px-2 py-0.5 rounded-full ${statusColors[questLine.status]}`}>
          {statusLabel}
        </span>
        <span className="text-xs text-text-muted">
          {completed}/{total} 个支线
        </span>
      </div>
      <div className="mt-2 h-1.5 bg-sage-light/50 rounded-full overflow-hidden">
        <div
          className="h-full bg-sage rounded-full transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>
    </button>
  );
}
