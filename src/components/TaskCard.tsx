import { CheckCircle } from "lucide-react";
import type { Task } from "../types";
import { TASK_TYPE_LABELS, DOMAIN_EMOJI, ATTRIBUTE_EMOJI } from "../types";

interface TaskCardProps {
  task: Task;
  onComplete: (id: string) => void;
  compact?: boolean;
}

export default function TaskCard({ task, onComplete, compact }: TaskCardProps) {
  return (
    <div
      className={`group bg-white/70 rounded-2xl border border-sage-light/40 p-3 md:p-4 transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 ${
        task.completed ? "opacity-60" : ""
      }`}
    >
      <div className="flex items-start gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm md:text-base font-medium text-text-primary">
              {task.title}
            </span>
            {task.completed && (
              <span className="inline-flex items-center gap-1 text-xs text-sage-dark bg-sage-light px-2 py-0.5 rounded-full">
                <CheckCircle size={12} /> 已完成
              </span>
            )}
          </div>
          {task.description && !compact && (
            <p className="text-xs text-text-muted mt-1 line-clamp-2">
              {task.description}
            </p>
          )}
          <div className="flex items-center gap-2 mt-2 flex-wrap">
            <span className="text-xs bg-cream-dark text-text-secondary px-2 py-0.5 rounded-full">
              {DOMAIN_EMOJI[task.domain]}{" "}
              {TASK_TYPE_LABELS[task.type]}
            </span>
            <span
              className={`text-xs px-2 py-0.5 rounded-full ${
                task.difficulty === "easy"
                  ? "bg-green-50 text-green-600"
                  : task.difficulty === "normal"
                  ? "bg-blue-50 text-blue-600"
                  : "bg-purple-50 text-purple-600"
              }`}
            >
              {task.difficulty === "easy" ? "简单" : task.difficulty === "normal" ? "普通" : "困难"}
            </span>
            {task.attributeRewards.map((ar) => (
              <span
                key={ar.attribute}
                className="text-xs text-warm-gold bg-warm-gold-light/50 px-1.5 py-0.5 rounded-full"
              >
                {ATTRIBUTE_EMOJI[ar.attribute]} +{ar.exp}
              </span>
            ))}
          </div>
        </div>
        {!task.completed && (
          <button
            onClick={() => onComplete(task.id)}
            className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 bg-sage-light hover:bg-sage text-sage-dark hover:text-white rounded-xl text-sm font-medium transition-all duration-200 active:scale-95"
          >
            <CheckCircle size={16} />
            <span className="hidden sm:inline">完成</span>
            <span className="text-xs opacity-70">+{task.expReward}EXP</span>
          </button>
        )}
      </div>
    </div>
  );
}
