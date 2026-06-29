import { CheckCircle2, Lock, Zap } from "lucide-react";
import type { QuestStage } from "../types";

interface Props { stage: QuestStage; index: number; isCurrent: boolean; isFuture: boolean; onComplete?: (id: string) => void; }

export default function MainStageCard({ stage, index, isCurrent, isFuture, onComplete }: Props) {
  const stateClass = isCurrent ? "bg-theme text-white scale-110 shadow-xl shadow-navy/30" :
    stage.completed ? "bg-navy/10 text-navy" :
    "bg-white/50 border border-navy/10 text-navy/20";

  const Icon = stage.completed ? CheckCircle2 : isCurrent ? Zap : Lock;

  return (
    <div className="relative z-10 flex items-center gap-6">
      {/* Node */}
      <button
        onClick={() => isCurrent && onComplete?.(stage.id)}
        disabled={!isCurrent}
        className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-500 flex-shrink-0 ${stateClass}`}
      >
        <Icon size={18} />
      </button>
      {/* Label */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-[9px] font-bold text-navy/25 uppercase tracking-widest">阶段 {index + 1}</span>
          {stage.anchorDate && (
            <span className="text-[9px] font-medium text-coral">{stage.anchorDate}</span>
          )}
        </div>
        <h4 className={`text-[13px] font-bold tracking-wide ${isFuture ? "text-navy/25" : stage.completed ? "text-navy/50" : "text-navy"}`}>
          {stage.title}
        </h4>
        {stage.description && (
          <p className="text-[10px] text-navy/40 mt-0.5">{stage.description}</p>
        )}
        {stage.completed && stage.completedAt && (
          <p className="text-[9px] font-medium text-coral mt-0.5">{stage.completedAt.slice(0, 10)}</p>
        )}
      </div>
    </div>
  );
}
