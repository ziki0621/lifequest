import type { LifeAttribute } from "../types";
import { ATTRIBUTE_LABELS, ATTR_COLOR } from "../types";

interface StatBarProps { attribute: LifeAttribute; level: number; exp: number; }

export default function StatBar({ attribute, level, exp }: StatBarProps) {
  const color = ATTR_COLOR[attribute];
  const progress = Math.round(((exp % 50) / 50) * 100);

  return (
    <div className="flex items-center gap-3 py-2.5">
      <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: color }} />
      <span className="text-[11px] font-bold text-navy tracking-widest w-10 flex-shrink-0">
        {ATTRIBUTE_LABELS[attribute]}
      </span>
      <div className="flex-1 h-1.5 rounded-full bg-navy/8 overflow-hidden">
        <div className="h-full rounded-full transition-all duration-700 ease-out" style={{ width: `${progress}%`, backgroundColor: color }} />
      </div>
      <span className="text-[11px] font-black tabular-nums" style={{ color }}>
        Lv.{level}
      </span>
    </div>
  );
}
