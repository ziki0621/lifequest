import type { QuestStage } from "../types";
import MainStageCard from "./MainStageCard";

interface Props { stages: QuestStage[]; onComplete: (stageId: string) => void; }

export default function Timeline({ stages, onComplete }: Props) {
  const sorted = [...stages].sort((a, b) => a.order - b.order);
  const firstUncompleted = sorted.findIndex((s) => !s.completed);
  const currentIdx = firstUncompleted === -1 ? sorted.length : firstUncompleted;

  return (
    <div className="relative flex flex-col items-center gap-8 py-4">
      {/* Vertical line */}
      <div className="absolute top-4 bottom-4 w-px bg-navy/8 left-1/2 -translate-x-1/2 z-0" />

      {sorted.map((stage, i) => {
        const isCompleted = stage.completed;
        const isCurrent = i === currentIdx;
        const isFuture = i > currentIdx;

        return (
          <div key={stage.id} className="flex items-center gap-6 w-full">
            {/* Left side label (even stages) */}
            <div className={`flex-1 text-right ${i % 2 === 0 ? "" : "invisible"}`}>
              {i % 2 === 0 && (
                <div className="pr-4">
                  <span className={`text-[9px] font-bold uppercase tracking-widest ${isCurrent ? "text-coral" : isCompleted ? "text-navy/40" : "text-navy/20"}`}>
                    {isCompleted ? "已完成" : isCurrent ? "当前" : isFuture ? "待解锁" : ""}
                  </span>
                  {stage.anchorDate && (
                    <span className="block text-[9px] text-navy/30 mt-0.5">{stage.anchorDate}</span>
                  )}
                </div>
              )}
            </div>

            {/* Center node */}
            <MainStageCard stage={stage} index={i} isCurrent={isCurrent} isFuture={isFuture} onComplete={onComplete} />

            {/* Right side label (odd stages) */}
            <div className={`flex-1 ${i % 2 === 1 ? "" : "invisible"}`}>
              {i % 2 === 1 && (
                <div className="pl-4">
                  <p className={`text-[11px] font-bold tracking-wide ${isFuture ? "text-navy/25" : isCompleted ? "text-navy/50" : "text-navy"}`}>
                    {stage.title}
                  </p>
                  {stage.description && (
                    <p className="text-[9px] text-navy/40 mt-0.5">{stage.description}</p>
                  )}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
