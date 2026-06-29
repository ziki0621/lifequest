import { X, Target, ListTodo, CheckCircle2 } from "lucide-react";
import type { QuestPlanDraft } from "../types/agent";

interface Props { plan: QuestPlanDraft; onConfirm: () => void; onRegenerate?: () => void; onClose: () => void; }

export default function QuestPlanPreview({ plan, onConfirm, onRegenerate, onClose }: Props) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy/30 backdrop-blur-sm animate-fade">
      <div className="glass rounded-3xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto animate-scale p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-black text-navy serif">Maro 的任务线</h3>
          <button onClick={onClose} className="p-1.5 rounded-full hover:bg-navy/5 text-navy/40"><X size={16} /></button>
        </div>

        <div className="space-y-4">
          <p className="text-[12px] text-navy/55 leading-relaxed serif">{plan.npcReply}</p>

          <div>
            <h4 className="text-[10px] font-bold text-navy/30 uppercase tracking-widest flex items-center gap-1.5 mb-2"><Target size={12} /> 主线任务</h4>
            <div className="bg-white/20 rounded-2xl border border-navy/5 p-3">
              <p className="text-[13px] font-black text-navy">{plan.mainQuest.title}</p>
              <p className="text-[10px] text-navy/40 mt-0.5">{plan.mainQuest.description}</p>
              <div className="mt-2 space-y-1">
                {plan.mainQuest.stages.map((s, i) => (
                  <p key={i} className="text-[10px] text-navy/50">{i + 1}. {s.title}{s.description ? ` — ${s.description}` : ""}</p>
                ))}
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-[10px] font-bold text-navy/30 uppercase tracking-widest flex items-center gap-1.5 mb-2"><ListTodo size={12} /> 日常任务</h4>
            {plan.dailyTasks.map((dt, i) => (
              <div key={i} className="bg-white/20 rounded-2xl border border-navy/5 p-2.5 mb-1.5">
                <p className="text-[11px] font-bold text-navy">{dt.title}</p>
                <p className="text-[9px] text-navy/40">{dt.description} · {dt.period} {dt.targetCount}次</p>
              </div>
            ))}
          </div>

          <div>
            <h4 className="text-[10px] font-bold text-navy/30 uppercase tracking-widest flex items-center gap-1.5 mb-2"><CheckCircle2 size={12} /> 支线任务</h4>
            {plan.sideQuests.map((sq, i) => (
              <div key={i} className="bg-white/20 rounded-2xl border border-navy/5 p-2.5 mb-1.5">
                <p className="text-[11px] font-bold text-navy">{sq.title}</p>
                <p className="text-[9px] text-navy/40">{sq.description} · {sq.difficulty}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="flex gap-2 pt-2">
          <button className="btn btn-ghost !text-[11px] flex-1" onClick={onClose}>取消</button>
          {onRegenerate && <button className="btn btn-ghost !text-[11px] flex-1" onClick={onRegenerate}>重新生成</button>}
          <button className="btn btn-primary !text-[11px] flex-1" onClick={onConfirm}>加入我的任务</button>
        </div>
      </div>
    </div>
  );
}
