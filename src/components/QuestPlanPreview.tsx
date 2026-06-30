import { X, Target, ListTodo, CheckCircle2 } from "lucide-react";
import type { QuestPlanDraft } from "../types/agent";

interface Props { plan: QuestPlanDraft; onConfirm: () => void; onRegenerate?: () => void; onClose: () => void; }

export default function QuestPlanPreview({ plan, onConfirm, onRegenerate, onClose }: Props) {
  const p = plan || ({} as QuestPlanDraft);
  const hasMain = p.mainQuest && p.mainQuest.stages?.length > 0;
  const hasDaily = p.dailyTasks?.length > 0;
  const hasSide = p.sideQuests?.length > 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 modal-backdrop animate-fade">
      <div className="wireframe max-w-lg w-full max-h-[90vh] overflow-y-auto animate-scale p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-black text-ink serif">Maro 的任务线</h3>
          <button onClick={onClose} className="p-1.5  hover:bg-ink/5 text-ink/40"><X size={16} /></button>
        </div>

        <div className="space-y-4">
          {plan?.npcReply && <p className="text-[12px] text-ink/55 leading-relaxed serif">{p.npcReply}</p>}

          {hasMain && p.mainQuest && (
            <div>
              <h4 className="text-[10px] font-bold text-ink/30 uppercase tracking-widest flex items-center gap-1.5 mb-2"><Target size={12} /> 主线任务</h4>
              <div className="bg-white/20  border border-[#4A3B2C]/5 p-3">
                <p className="text-[13px] font-black text-ink">{p.mainQuest.title}</p>
                <p className="text-[10px] text-ink/40 mt-0.5">{p.mainQuest.description}</p>
                <div className="mt-2 space-y-1">
                  {p.mainQuest.stages.map((s, i) => (
                    <p key={i} className="text-[10px] text-ink/50">{i + 1}. {s.title}{s.description ? ` — ${s.description}` : ""}</p>
                  ))}
                </div>
              </div>
            </div>
          )}

          {hasDaily && (
            <div>
              <h4 className="text-[10px] font-bold text-ink/30 uppercase tracking-widest flex items-center gap-1.5 mb-2"><ListTodo size={12} /> 日常任务</h4>
              {p.dailyTasks.map((dt, i) => (
                <div key={i} className="bg-white/20  border border-[#4A3B2C]/5 p-2.5 mb-1.5">
                  <p className="text-[11px] font-bold text-ink">{dt.title}</p>
                  <p className="text-[9px] text-ink/40">{dt.description} · {dt.period} {dt.targetCount}次</p>
                </div>
              ))}
            </div>
          )}

          {hasSide && (
            <div>
              <h4 className="text-[10px] font-bold text-ink/30 uppercase tracking-widest flex items-center gap-1.5 mb-2"><CheckCircle2 size={12} /> 支线任务</h4>
              {p.sideQuests.map((sq, i) => (
                <div key={i} className="bg-white/20  border border-[#4A3B2C]/5 p-2.5 mb-1.5">
                  <p className="text-[11px] font-bold text-ink">{sq.title}</p>
                  <p className="text-[9px] text-ink/40">{sq.description} · {sq.difficulty}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex gap-2 pt-2">
          <button className="wireframe-btn-ghost !text-[11px] flex-1" onClick={onClose}>取消</button>
          {onRegenerate && <button className="wireframe-btn-ghost !text-[11px] flex-1" onClick={onRegenerate}>重新生成</button>}
          <button className="wireframe-btn !text-[11px] flex-1" onClick={onConfirm}>加入我的任务</button>
        </div>
      </div>
    </div>
  );
}
