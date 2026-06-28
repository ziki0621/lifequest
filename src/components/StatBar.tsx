import type { LifeAttribute } from "../types";
import {
  ATTRIBUTE_LABELS, ATTRIBUTE_ICONS, ATTRIBUTE_COLORS, ATTRIBUTE_BG_COLORS,
} from "../types";
import { attributeExpToNextLevel } from "../utils/exp";

interface StatBarProps {
  attribute: LifeAttribute;
  level: number;
  exp: number;
}

export default function StatBar({ attribute, level, exp }: StatBarProps) {
  const Icon = ATTRIBUTE_ICONS[attribute];
  const progress = Math.round(((exp % 50) / 50) * 100);
  const toNext = attributeExpToNextLevel(exp);
  const colorClass = ATTRIBUTE_COLORS[attribute];
  const bgClass = ATTRIBUTE_BG_COLORS[attribute];

  return (
    <div className="flex items-center gap-3 py-2">
      <div className={`w-8 h-8 rounded-lg ${bgClass} flex items-center justify-center flex-shrink-0`}>
        <Icon size={14} strokeWidth={1.5} className={colorClass} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <span className="text-[11px] font-medium text-text-primary">
            {ATTRIBUTE_LABELS[attribute]}
          </span>
          <span className="text-[10px] text-text-muted tabular-nums">
            Lv.{level} · {toNext} → {level + 1}
          </span>
        </div>
        <div className="h-1.5 bg-bg-glass rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-700 ease-out ${colorClass.replace("text-", "bg-")}`}
            style={{ width: `${progress}%`, opacity: 0.7 }}
          />
        </div>
      </div>
    </div>
  );
}
