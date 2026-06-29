import { Check } from "lucide-react";
import type { SideQuest } from "../types";
import { DOMAIN_ICONS, DOMAIN_LABELS, ATTRIBUTE_ICONS, ATTRIBUTE_LABELS, ATTR_COLOR } from "../types";

interface Props { quest: SideQuest; onComplete: (id: string) => void; onEdit?: (quest: SideQuest) => void; }

export default function SideQuestCard({ quest, onComplete, onEdit }: Props) {
  const DomainIcon = DOMAIN_ICONS[quest.domain];
  const diffLabel = quest.difficulty === "easy" ? "EASY" : quest.difficulty === "normal" ? "NORMAL" : "HARD";
  const diffColor = quest.difficulty === "easy" ? "text-leaf" : quest.difficulty === "normal" ? "text-navy" : "text-coral";

  return (
    <div className={`glass rounded-3xl transition-all duration-300 group ${quest.completed ? "opacity-50" : "hover:-translate-y-1"}`}>
      <div className="p-4 flex items-center justify-between gap-4">
        <div
          onClick={() => onEdit?.(quest)}
          className={`flex items-center gap-3 flex-1 min-w-0 ${onEdit ? "cursor-pointer" : ""}`}
        >
          <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 text-white ${quest.completed ? "bg-navy/30" : "bg-theme"}`}>
            {quest.completed ? <Check size={16} /> : <DomainIcon size={15} strokeWidth={1.5} />}
          </div>
          <div className="flex-1 min-w-0">
            <h4 className={`text-[13px] font-black tracking-wide ${quest.completed ? "text-navy/40 line-through" : "text-navy"}`}>{quest.title}</h4>
            <div className="flex items-center gap-2 mt-1 flex-wrap">
              <span className="text-[9px] font-bold text-navy/30 uppercase tracking-widest">{DOMAIN_LABELS[quest.domain]}</span>
              <span className={`text-[9px] font-black uppercase tracking-widest ${diffColor}`}>{diffLabel}</span>
              <span className="text-[9px] font-bold text-navy/25">+{quest.expReward} XP</span>
            </div>
            {quest.attributeRewards.map((ar) => {
              const AIcon = ATTRIBUTE_ICONS[ar.attribute];
              return (
                <span key={ar.attribute} className="inline-flex items-center gap-0.5 text-[9px] font-bold mt-1" style={{ color: ATTR_COLOR[ar.attribute] }}>
                  <AIcon size={9} /> {ATTRIBUTE_LABELS[ar.attribute]} +{ar.exp}
                </span>
              );
            })}
          </div>
        </div>
        {!quest.completed && (
          <button onClick={() => onComplete(quest.id)}
            className="btn btn-primary !py-1.5 !px-4 !text-[10px] flex-shrink-0">
            <Check size={13} /> 完成
          </button>
        )}
      </div>
    </div>
  );
}
