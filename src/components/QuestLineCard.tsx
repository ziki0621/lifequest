import { ChevronRight } from "lucide-react";
import type { QuestLine, Task } from "../types";
import { DOMAIN_ICONS, DOMAIN_LABELS } from "../types";

interface QuestLineCardProps { questLine: QuestLine; tasks: Task[]; onSelect: (id: string) => void; }

export default function QuestLineCard({ questLine, tasks, onSelect }: QuestLineCardProps) {
  const DomainIcon = DOMAIN_ICONS[questLine.domain];
  const total = tasks.length;
  const completed = tasks.filter((t) => t.completed).length;
  const progress = total > 0 ? Math.round((completed / total) * 100) : 0;

  const statusLabel = questLine.status === "active" ? "进行中" : questLine.status === "paused" ? "已暂停" : "已完成";

  return (
    <button
      onClick={() => onSelect(questLine.id)}
      className="w-full text-left glass rounded-3xl p-6 transition-all duration-300 hover:-translate-y-1 group"
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-4 flex-1 min-w-0">
          <div className="w-12 h-12 rounded-full bg-navy text-white flex items-center justify-center flex-shrink-0 shadow-lg shadow-navy/20">
            <DomainIcon size={18} strokeWidth={1.5} />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-[15px] font-black text-navy tracking-wide">{questLine.title}</h3>
            <p className="text-[11px] font-medium text-navy/50 mt-0.5 leading-relaxed">{questLine.description}</p>
          </div>
        </div>
        <ChevronRight size={16} className="text-navy/30 mt-1 flex-shrink-0" />
      </div>

      <div className="flex items-center gap-3 mt-4 ml-16">
        <span className="text-[10px] font-bold text-navy/40 uppercase tracking-widest">{statusLabel}</span>
        <span className="text-[10px] font-bold text-navy/30">{DOMAIN_LABELS[questLine.domain]}</span>
        <span className="text-[10px] font-bold text-navy/30">{completed}/{total}</span>
      </div>

      <div className="mt-3 ml-16 progress">
        <div className="progress-fill" style={{ width: `${progress}%`, background: "#0B192C" }} />
      </div>
    </button>
  );
}
