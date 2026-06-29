import { Check, ChevronRight } from "lucide-react";
import type { Task } from "../types";
import { TASK_TYPE_LABELS, ATTRIBUTE_ICONS, ATTRIBUTE_LABELS, ATTR_COLOR } from "../types";

interface TaskCardProps { task: Task; onComplete: (id: string) => void; }

export default function TaskCard({ task, onComplete }: TaskCardProps) {
  const diffLabel = task.difficulty === "easy" ? "EASY" : task.difficulty === "normal" ? "NORMAL" : "HARD";
  const diffColor = task.difficulty === "easy" ? "text-leaf" : task.difficulty === "normal" ? "text-navy" : "text-coral";

  return (
    <div
      className={`glass rounded-3xl transition-all duration-300 group ${
        task.completed ? "opacity-50" : "hover:-translate-y-1 cursor-pointer"
      }`}
    >
      <div className="p-5 flex items-center justify-between gap-4">
        <div className="flex items-center gap-4 flex-1 min-w-0">
          {/* Icon circle */}
          <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 text-white shadow-lg ${
            task.completed ? "bg-navy/30" : "bg-navy"
          }`}>
            {task.completed ? <Check size={20} strokeWidth={2} /> : <ChevronRight size={20} strokeWidth={2} />}
          </div>
          <div className="flex-1 min-w-0">
            <h4 className={`text-[15px] font-black tracking-wide ${task.completed ? "text-navy/40 line-through" : "text-navy"}`}>
              {task.title}
            </h4>
            <div className="flex items-center gap-3 mt-1.5 flex-wrap">
              <span className="text-[10px] font-bold text-navy/40 uppercase tracking-widest">
                {TASK_TYPE_LABELS[task.type]}
              </span>
              <span className={`text-[10px] font-black uppercase tracking-widest ${diffColor}`}>
                {diffLabel}
              </span>
              <span className="text-[10px] font-bold text-navy/30 tracking-wide">
                +{task.expReward} XP
              </span>
            </div>
            {task.attributeRewards.length > 0 && (
              <div className="flex gap-2 mt-2 flex-wrap">
                {task.attributeRewards.map((ar) => {
                  const AIcon = ATTRIBUTE_ICONS[ar.attribute];
                  return (
                    <span key={ar.attribute} className="inline-flex items-center gap-1 text-[10px] font-bold tracking-widest uppercase" style={{ color: ATTR_COLOR[ar.attribute] }}>
                      <AIcon size={10} strokeWidth={2} />
                      {ATTRIBUTE_LABELS[ar.attribute]} +{ar.exp}
                    </span>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {!task.completed && (
          <button
            onClick={(e) => { e.stopPropagation(); onComplete(task.id); }}
            className="btn btn-primary !py-2 !px-5 !text-[11px] flex-shrink-0"
          >
            <Check size={14} /> 完成
          </button>
        )}
      </div>
    </div>
  );
}
