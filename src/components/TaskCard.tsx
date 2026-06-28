import { Check, Clock } from "lucide-react";
import type { Task } from "../types";
import { TASK_TYPE_LABELS, DOMAIN_ICONS, ATTRIBUTE_ICONS, ATTRIBUTE_COLORS } from "../types";

interface TaskCardProps {
  task: Task;
  onComplete: (id: string) => void;
  compact?: boolean;
}

export default function TaskCard({ task, onComplete, compact }: TaskCardProps) {
  const DomainIcon = DOMAIN_ICONS[task.domain];

  const diffLabel = task.difficulty === "easy" ? "简单" : task.difficulty === "normal" ? "普通" : "困难";
  const diffColors: Record<string, string> = {
    easy: "text-green border-green-surface bg-green-surface/30",
    normal: "text-blue border-blue-surface bg-blue-surface/30",
    hard: "text-purple border-purple-surface bg-purple-surface/30",
  };

  return (
    <div
      className={`group bg-bg-elevated/60 rounded-xl border transition-all duration-300 p-4 animate-in ${
        task.completed
          ? "border-border-subtle opacity-50"
          : "border-border-subtle hover:border-border-default hover:bg-bg-elevated"
      }`}
    >
      <div className="flex items-start gap-3">
        {/* Domain icon */}
        <div className={`flex-shrink-0 w-8 h-8 rounded-lg bg-bg-glass flex items-center justify-center mt-0.5 ${task.completed ? "text-text-muted" : "text-text-secondary"}`}>
          <DomainIcon size={14} strokeWidth={1.5} />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`text-sm font-medium ${task.completed ? "text-text-muted line-through" : "text-text-primary"}`}>
              {task.title}
            </span>
            {task.completed && (
              <span className="inline-flex items-center gap-1 text-[10px] text-green bg-green-surface/30 px-1.5 py-0.5 rounded font-medium">
                <Check size={10} /> 已完成
              </span>
            )}
          </div>

          {task.description && !compact && (
            <p className="text-[11px] text-text-muted mt-1 line-clamp-2 leading-relaxed">
              {task.description}
            </p>
          )}

          <div className="flex items-center gap-2 mt-2.5 flex-wrap">
            <span className="text-[10px] text-text-muted bg-bg-glass px-2 py-0.5 rounded-full border border-border-subtle">
              {TASK_TYPE_LABELS[task.type]}
            </span>
            <span className={`text-[10px] px-2 py-0.5 rounded-full border ${diffColors[task.difficulty]}`}>
              {diffLabel}
            </span>
            {task.attributeRewards.map((ar) => {
              const AttrIcon = ATTRIBUTE_ICONS[ar.attribute];
              return (
                <span
                  key={ar.attribute}
                  className={`inline-flex items-center gap-1 text-[10px] bg-bg-glass border border-border-subtle px-1.5 py-0.5 rounded-full ${ATTRIBUTE_COLORS[ar.attribute]}`}
                >
                  <AttrIcon size={10} strokeWidth={1.5} />
                  +{ar.exp}
                </span>
              );
            })}
            {task.dueDate && !task.completed && (
              <span className="inline-flex items-center gap-1 text-[10px] text-text-muted">
                <Clock size={10} />
                {task.dueDate}
              </span>
            )}
          </div>
        </div>

        {!task.completed && (
          <button
            onClick={() => onComplete(task.id)}
            className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 bg-accent-surface text-accent border border-accent/20 hover:bg-accent hover:text-white active:scale-95"
          >
            <Check size={14} />
            <span className="hidden sm:inline">完成</span>
            <span className="text-[10px] opacity-60">+{task.expReward}</span>
          </button>
        )}
      </div>
    </div>
  );
}
