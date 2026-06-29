import { CheckCircle2, Zap, Target } from "lucide-react";
import type { CompletionContext } from "../types";
import { ATTRIBUTE_ICONS, ATTRIBUTE_LABELS, ATTR_COLOR } from "../types";

interface Props { ctx: CompletionContext; date?: string; }

export default function CompletionCard({ ctx, date }: Props) {
  const iconMap = {
    mainStage: <Target size={14} />,
    daily: <Zap size={14} />,
    sideQuest: <CheckCircle2 size={14} />,
  };
  const labelMap = {
    mainStage: "主线阶段",
    daily: "日常打卡",
    sideQuest: "支线完成",
  };

  return (
    <div className="glass rounded-2xl p-3 flex items-center gap-3">
      <div className="w-8 h-8 rounded-full bg-navy text-white flex items-center justify-center flex-shrink-0">
        {iconMap[ctx.itemType]}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold text-navy/30 uppercase tracking-widest">{labelMap[ctx.itemType]}</span>
          {date && <span className="text-[10px] text-navy/40">{date}</span>}
        </div>
        <p className="text-[12px] font-black text-navy">{ctx.title}</p>
        <div className="flex gap-2 mt-1 flex-wrap">
          <span className="text-[9px] font-bold text-coral">+{ctx.expReward} EXP</span>
          {ctx.attributeRewards.map((ar) => {
            const AIcon = ATTRIBUTE_ICONS[ar.attribute];
            return (
              <span key={ar.attribute} className="inline-flex items-center gap-0.5 text-[9px] font-bold" style={{ color: ATTR_COLOR[ar.attribute] }}>
                <AIcon size={9} /> {ATTRIBUTE_LABELS[ar.attribute]} +{ar.exp}
              </span>
            );
          })}
        </div>
      </div>
    </div>
  );
}
