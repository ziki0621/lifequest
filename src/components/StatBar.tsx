import type { LifeAttribute } from "../types";
import { ATTRIBUTE_LABELS, ATTR_COLOR } from "../types";

interface StatBarProps { attribute: LifeAttribute; level: number; exp: number; }

export default function StatBar({ attribute, level, exp }: StatBarProps) {
  const progress = Math.round(((exp % 50) / 50) * 100);
  return (
    <div className="flex items-center gap-3 py-2">
      <div className="w-2 h-2 border border-ink flex-shrink-0" style={{ backgroundColor: ATTR_COLOR[attribute] }} />
      <span className="text-[11px] font-bold text-ink tracking-widest w-10 flex-shrink-0">{ATTRIBUTE_LABELS[attribute]}</span>
      <div className="flex-1 progress-track"><div className="progress-fill" style={{ width: `${progress}%` }} /></div>
      <span className="text-[11px] font-black tabular-nums text-ink">Lv.{level}</span>
    </div>
  );
}
