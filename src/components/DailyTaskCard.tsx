import { Check, Pause } from "lucide-react";
import type { DailyTask } from "../types";
import { DOMAIN_ICONS, PERIOD_LABELS, ATTRIBUTE_ICONS, ATTR_COLOR, WEEKDAY_FULL } from "../types";
import { today, countCompletionsInPeriod, countTodayCompletions } from "../utils/date";

interface Props { task: DailyTask; onComplete: (id: string) => void; onToggle: (id: string) => void; onEdit?: (task: DailyTask) => void; }

export default function DailyTaskCard({ task, onComplete, onToggle, onEdit }: Props) {
  const DomainIcon = DOMAIN_ICONS[task.domain];
  const t = today(); const isDaily = task.period === "daily";
  const todayCount = countTodayCompletions(task.completions, t);
  const periodCount = countCompletionsInPeriod(task.completions, task.period, t);
  const target = isDaily ? (task.timesPerDay || 1) : task.targetCount;
  const count = isDaily ? todayCount : periodCount;
  const remaining = Math.max(0, target - count);
  const pct = Math.min(100, Math.round((count / target) * 100));

  let sd = PERIOD_LABELS[task.period];
  if (isDaily) { if (task.daysOfWeek && task.daysOfWeek.length > 0) sd = task.daysOfWeek.map(d => WEEKDAY_FULL[d]).join("·"); sd += ` · ${task.timesPerDay || 1}次/天`; }
  else sd += ` ${task.targetCount} 次`;

  return (
    <div className={`wireframe ${!task.active ? "opacity-40" : ""}`}>
      <div className="wireframe-inner p-3">
        <div className="flex items-center justify-between">
          <div onClick={() => onEdit?.(task)} className={`flex items-center gap-3 flex-1 min-w-0 ${onEdit ? "cursor-pointer" : ""}`}>
            <div className={`w-10 h-10 border-[1.5px] border-[#4A3B2C] flex items-center justify-center flex-shrink-0 ${task.active ? "bg-[#4A3B2C] text-[#F3EAD5] shadow-[1px_1px_0px_rgba(74,59,44,0.15)]" : "bg-[#E3D4BB] text-[#4A3B2C]/30"}`}>
              <DomainIcon size={15} strokeWidth={1.5} />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-[13px] font-black text-[#4A3B2C] tracking-wide">{task.title}</h4>
              <div className="flex items-center gap-2 mt-1 flex-wrap">
                <span className="text-[9px] font-bold text-[#4A3B2C]/40 uppercase tracking-widest">{sd}</span>
                {task.attributeRewards.map(ar => { const AI = ATTRIBUTE_ICONS[ar.attribute]; return <span key={ar.attribute} className="inline-flex items-center gap-0.5 text-[9px] font-bold" style={{color:ATTR_COLOR[ar.attribute]}}><AI size={9} /> +{ar.exp}</span>; })}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            {task.active && remaining > 0 && (<div className="chamfer-btn h-8" onClick={() => onComplete(task.id)}><div className="chamfer-outer"><div className="chamfer-gap"><div className="chamfer-inner"><div className="chamfer-core px-3"><Check size={13} /><span className="text-[10px] font-bold ml-1">打卡</span></div></div></div></div></div>)}
            {task.active && remaining === 0 && <span className="text-[10px] font-bold text-[#4A3B2C]/50">✓ {count}/{target}</span>}
            <button onClick={() => onToggle(task.id)} className={`p-1.5 border border-[#4A3B2C]/20 hover:border-[#4A3B2C]/50 transition-colors ${task.active ? "text-[#4A3B2C]/30" : "text-[#4A3B2C]/30"}`} title={task.active ? "暂停" : "激活"}><Pause size={12} /></button>
          </div>
        </div>
        <div className="mt-3 progress-track"><div className="progress-fill" style={{width: pct + "%"}} /></div>
        <div className="flex justify-between mt-1 text-[9px] font-bold text-[#4A3B2C]/30 uppercase tracking-widest"><span>{count}/{target}</span><span>{remaining > 0 ? `剩 ${remaining} 次` : "完成"}</span></div>
      </div>
    </div>
  );
}
