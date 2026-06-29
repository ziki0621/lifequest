import { ChevronRight, Pencil } from "lucide-react";
import type { MainQuest } from "../types";
import { DOMAIN_ICONS, DOMAIN_LABELS } from "../types";

interface Props { quest: MainQuest; onSelect: (id: string) => void; onEdit: (quest: MainQuest) => void; }

export default function MainQuestCard({ quest, onSelect, onEdit }: Props) {
  const DomainIcon = DOMAIN_ICONS[quest.domain];
  const total = quest.stages.length;
  const completed = quest.stages.filter((s) => s.completed).length;
  const progress = total > 0 ? Math.round((completed / total) * 100) : 0;
  const statusLabel = quest.status === "active" ? "进行中" : quest.status === "paused" ? "已暂停" : "已完成";

  return (
    <div className="relative group">
      <button onClick={() => onSelect(quest.id)}
        className="w-full text-left glass rounded-3xl p-5 pr-14 transition-all duration-300 hover:-translate-y-1">
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3 flex-1 min-w-0">
          <div className="w-11 h-11 rounded-full bg-theme text-white flex items-center justify-center flex-shrink-0">
            <DomainIcon size={17} strokeWidth={1.5} />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-[14px] font-black text-navy tracking-wide">{quest.title}</h3>
            <p className="text-[11px] font-medium text-navy/50 mt-0.5 line-clamp-2">{quest.description}</p>
          </div>
        </div>
        <ChevronRight size={15} className="text-navy/30 mt-1 flex-shrink-0" />
      </div>
      <div className="flex items-center gap-3 mt-3 ml-14">
        <span className="text-[10px] font-bold text-navy/40 uppercase tracking-widest">{DOMAIN_LABELS[quest.domain]}</span>
        <span className="text-[10px] font-bold text-navy/30">{statusLabel}</span>
        <span className="text-[10px] font-bold text-coral">{completed}/{total}</span>
      </div>
      <div className="mt-2.5 ml-14 progress"><div className="progress-fill" style={{ width: `${progress}%` }} /></div>
      </button>
      <button
        onClick={(e) => { e.stopPropagation(); onEdit(quest); }}
        className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/50 hover:bg-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-navy/30 hover:text-navy"
      >
        <Pencil size={13} />
      </button>
    </div>
  );
}
