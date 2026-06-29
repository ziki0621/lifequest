import { Check, Pause } from "lucide-react";
import type { DailyTask } from "../types";
import { DOMAIN_ICONS, PERIOD_LABELS, ATTRIBUTE_ICONS, ATTR_COLOR, WEEKDAY_FULL } from "../types";
import { today, countCompletionsInPeriod, countTodayCompletions } from "../utils/date";

interface Props { task: DailyTask; onComplete: (id: string) => void; onToggle: (id: string) => void; onEdit?: (task: DailyTask) => void; }

export default function DailyTaskCard({ task, onComplete, onToggle, onEdit }: Props) {
  const DomainIcon = DOMAIN_ICONS[task.domain];
  const t = today();

  // Different counting for daily (per-day) vs weekly/monthly (per-period)
  const isDaily = task.period === "daily";
  const todayCount = countTodayCompletions(task.completions, t);
  const periodCount = countCompletionsInPeriod(task.completions, task.period, t);

  const target = isDaily ? (task.timesPerDay || 1) : task.targetCount;
  const count = isDaily ? todayCount : periodCount;
  const remaining = Math.max(0, target - count);
  const progressPercent = Math.min(100, Math.round((count / target) * 100));

  const diffLabel = task.difficulty === "easy" ? "EASY" : task.difficulty === "normal" ? "NORMAL" : "HARD";
  const diffColor = task.difficulty === "easy" ? "text-leaf" : task.difficulty === "normal" ? "text-navy" : "text-coral";

  // Build schedule description
  let scheduleDesc = PERIOD_LABELS[task.period];
  if (isDaily) {
    if (task.daysOfWeek && task.daysOfWeek.length > 0) {
      scheduleDesc = task.daysOfWeek.map((d) => WEEKDAY_FULL[d]).join("·");
    }
    scheduleDesc += ` · ${task.timesPerDay || 1}次/天`;
  } else {
    scheduleDesc += ` ${task.targetCount} 次`;
  }

  return (
    <div className={`glass rounded-3xl p-4 transition-all duration-300 ${!task.active ? "opacity-40" : "hover:-translate-y-0.5"}`}>
      <div className="flex items-center justify-between">
        <div
          onClick={() => onEdit?.(task)}
          className={`flex items-center gap-3 flex-1 min-w-0 ${onEdit ? "cursor-pointer" : ""}`}
        >
          <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${task.active ? "bg-theme text-white" : "bg-navy/20 text-navy/40"}`}>
            <DomainIcon size={15} strokeWidth={1.5} />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-[13px] font-black text-navy tracking-wide">{task.title}</h4>
            <div className="flex items-center gap-2 mt-1 flex-wrap">
              <span className={`text-[9px] font-bold uppercase tracking-widest ${diffColor}`}>{diffLabel}</span>
              <span className="text-[9px] font-bold text-navy/30 uppercase tracking-widest">{scheduleDesc}</span>
              {task.attributeRewards.map((ar) => {
                const AIcon = ATTRIBUTE_ICONS[ar.attribute];
                return (
                  <span key={ar.attribute} className="inline-flex items-center gap-0.5 text-[9px] font-bold" style={{ color: ATTR_COLOR[ar.attribute] }}>
                    <AIcon size={9} /> +{ar.exp}
                  </span>
                );
              })}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          {task.active && remaining > 0 && (
            <button onClick={() => onComplete(task.id)}
              className="btn btn-primary !py-1.5 !px-4 !text-[10px]">
              <Check size={13} /> 打卡
            </button>
          )}
          {task.active && remaining === 0 && (
            <span className="text-[10px] font-bold text-leaf tracking-wider">✓ {count}/{target}</span>
          )}
          <button onClick={() => onToggle(task.id)}
            className={`p-1.5 rounded-full transition-colors ${task.active ? "text-navy/20 hover:text-navy/50" : "text-navy/30 hover:text-coral"}`}
            title={task.active ? "暂停" : "激活"}>
            <Pause size={14} />
          </button>
        </div>
      </div>
      {/* Progress bar */}
      <div className="mt-3 progress">
        <div className="progress-fill" style={{ width: `${progressPercent}%`, background: task.active ? "#0B192C" : "#ccc" }} />
      </div>
      <div className="flex justify-between mt-1.5 text-[9px] font-bold text-navy/30 uppercase tracking-widest">
        <span>{count}/{target}</span>
        <span>{remaining > 0 ? `剩 ${remaining} 次` : "完成"}</span>
      </div>
    </div>
  );
}
