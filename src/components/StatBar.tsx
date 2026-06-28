import type { LifeAttribute } from "../types";
import { ATTRIBUTE_LABELS, ATTRIBUTE_EMOJI } from "../types";
import { attributeExpToNextLevel } from "../utils/exp";

interface StatBarProps {
  attribute: LifeAttribute;
  level: number;
  exp: number;
}

export default function StatBar({ attribute, level, exp }: StatBarProps) {
  const progress = Math.round(((exp % 50) / 50) * 100);
  const toNext = attributeExpToNextLevel(exp);

  return (
    <div className="flex items-center gap-3 py-1.5">
      <div className="w-8 text-center text-lg" title={ATTRIBUTE_LABELS[attribute]}>
        {ATTRIBUTE_EMOJI[attribute]}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-0.5">
          <span className="text-sm font-medium text-text-primary">
            {ATTRIBUTE_LABELS[attribute]}
          </span>
          <span className="text-xs text-text-muted">
            Lv.{level} · {toNext} → {level + 1}
          </span>
        </div>
        <div className="h-2 bg-sage-light/40 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-sage-light to-sage rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
}
