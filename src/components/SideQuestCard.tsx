import { Check } from "lucide-react";
import type { SideQuest } from "../types";
import { DOMAIN_ICONS, DOMAIN_LABELS, ATTRIBUTE_ICONS, ATTRIBUTE_LABELS, ATTR_COLOR } from "../types";

interface Props { quest: SideQuest; onComplete: (id: string) => void; onEdit?: (quest: SideQuest) => void; }

export default function SideQuestCard({ quest, onComplete, onEdit }: Props) {
  const DomainIcon = DOMAIN_ICONS[quest.domain];
  return (
    <div className={`wireframe ${quest.completed ? "opacity-50" : ""}`}>
      <div className="wireframe-inner p-3 flex items-center justify-between gap-3">
        <div onClick={() => onEdit?.(quest)} className={`flex items-center gap-3 flex-1 min-w-0 ${onEdit ? "cursor-pointer" : ""}`}>
          <div className={`w-10 h-10 border-[1.5px] border-[#4A3B2C] flex items-center justify-center flex-shrink-0 ${quest.completed ? "bg-[#E3D4BB] text-[#4A3B2C]/30" : "bg-[#4A3B2C] text-[#F3EAD5] shadow-[1px_1px_0px_rgba(74,59,44,0.15)]"}`}>
            {quest.completed ? <Check size={15} /> : <DomainIcon size={15} strokeWidth={1.5} />}
          </div>
          <div className="flex-1 min-w-0">
            <h4 className={`text-[13px] font-black tracking-wide ${quest.completed ? "text-[#4A3B2C]/30 line-through" : "text-[#4A3B2C]"}`}>{quest.title}</h4>
            <div className="flex items-center gap-2 mt-1 flex-wrap"><span className="text-[9px] font-bold text-[#4A3B2C]/30 uppercase tracking-widest">{DOMAIN_LABELS[quest.domain]}</span><span className="text-[9px] font-bold text-[#4A3B2C]/25">+{quest.expReward} EXP</span></div>
            {quest.attributeRewards.map(ar => { const AI = ATTRIBUTE_ICONS[ar.attribute]; return <span key={ar.attribute} className="inline-flex items-center gap-0.5 text-[9px] font-bold mt-1" style={{color:ATTR_COLOR[ar.attribute]}}><AI size={9} /> {ATTRIBUTE_LABELS[ar.attribute]} +{ar.exp}</span>; })}
          </div>
        </div>
        {!quest.completed && (<div className="chamfer-btn h-7 flex-shrink-0" onClick={() => onComplete(quest.id)}><div className="chamfer-outer"><div className="chamfer-gap"><div className="chamfer-inner"><div className="chamfer-core px-3"><Check size={12} /><span className="text-[10px] font-bold ml-1">完成</span></div></div></div></div></div>)}
      </div>
    </div>
  );
}
