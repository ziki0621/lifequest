import { ChevronRight } from "lucide-react";
import type { QuestLine, Task } from "../types";
import { DOMAIN_ICONS, DOMAIN_LABELS } from "../types";

interface QuestLineCardProps {
  questLine: QuestLine;
  tasks: Task[];
  onSelect: (id: string) => void;
}

export default function QuestLineCard({ questLine, tasks, onSelect }: QuestLineCardProps) {
  const DomainIcon = DOMAIN_ICONS[questLine.domain];
  const total = tasks.length;
  const completed = tasks.filter((t) => t.completed).length;
  const progress = total > 0 ? Math.round((completed / total) * 100) : 0;

  const statusLabel =
    questLine.status === "active" ? "进行中" : questLine.status === "paused" ? "暂停" : "已完成";

  const statusStyles: Record<string, string> = {
    active: "text-green bg-green-surface/30 border-green-surface",
    paused: "text-warning bg-warning-surface/30 border-warning-surface",
    completed: "text-accent bg-accent-surface/30 border-accent/20",
  };

  return (
    <button
      onClick={() => onSelect(questLine.id)}
      className="w-full text-left bg-bg-elevated/60 border border-border-subtle rounded-xl p-4 transition-all duration-300 hover:border-border-default hover:bg-bg-elevated animate-in"
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3 flex-1 min-w-0">
          <div className="w-9 h-9 rounded-lg bg-bg-glass flex items-center justify-center flex-shrink-0 mt-0.5">
            <DomainIcon size={16} strokeWidth={1.5} className="text-text-secondary" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-semibold text-text-primary">{questLine.title}</h3>
            <p className="text-[11px] text-text-muted mt-0.5 leading-relaxed">
              {questLine.description}
            </p>
          </div>
        </div>
        <ChevronRight size={15} className="text-text-muted mt-1 flex-shrink-0" />
      </div>

      <div className="flex items-center gap-3 mt-3 ml-12">
        <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full border ${statusStyles[questLine.status]}`}>
          {statusLabel}
        </span>
        <span className="text-[10px] text-text-muted">
          {DOMAIN_LABELS[questLine.domain]}
        </span>
        <span className="text-[10px] text-text-muted">
          {completed}/{total}
        </span>
      </div>

      <div className="mt-2.5 ml-12 h-1 bg-bg-glass rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-accent-soft to-accent rounded-full transition-all duration-700 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
    </button>
  );
}
