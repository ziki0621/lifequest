import { useState } from "react";
import { X, Sparkles, Target, ListTodo, CheckCircle2, Loader2 } from "lucide-react";
import type { QuestPlanDraft } from "../types/agent";
import { generateQuestPlan } from "../services/questPlanAgent";
import { loadLLMConfig } from "../utils/llmConfig";
import { useApp } from "../hooks/useApp";

interface Props { onClose: () => void; }

export default function AIQuestPlannerModal({ onClose }: Props) {
  const { applyQuestPlan } = useApp();
  const [goal, setGoal] = useState("");
  const [loading, setLoading] = useState(false);
  const [draft, setDraft] = useState<QuestPlanDraft | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!goal.trim()) return;
    setLoading(true); setError(null);
    try {
      const config = loadLLMConfig();
      const result = await generateQuestPlan({ goal: goal.trim(), timeRange: "1week", intensity: "gentle" }, config);
      setDraft(result);
    } catch { setError("生成失败，请重试。"); }
    setLoading(false);
  };

  const handleApply = () => {
    if (!draft) return;
    applyQuestPlan(draft);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 modal-backdrop animate-fade">
      <div className="wireframe max-w-lg w-full max-h-[90vh] overflow-y-auto animate-scale p-6 space-y-5">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-black text-navy serif flex items-center gap-2"><Sparkles size={16} className="text-coral" /> AI 任务线生成器</h3>
          <button onClick={onClose} className="p-1.5 rounded-full hover:bg-navy/5 text-navy/40"><X size={16} /></button>
        </div>

        <div>
          <label className="text-[9px] font-bold text-navy/30 uppercase tracking-widest block mb-1.5">输入你的生活目标 <span className="text-coral">*</span></label>
          <input value={goal} onChange={(e) => setGoal(e.target.value)} placeholder="例如：我最近作息很乱，想重新稳定生活。" className="wireframe-input" disabled={loading} />
        </div>

        <button onClick={handleGenerate} disabled={!goal.trim() || loading}
          className="wireframe-btn">
          {loading ? <><Loader2 size={14} className="animate-spin" /> 生成中…</> : <><Sparkles size={14} /> 生成任务线</>}
        </button>

        {error && <p className="text-[11px] text-coral text-center">{error}</p>}

        {draft && (
          <div className="space-y-3 border-t border-navy/5 pt-4">
            {draft.rationale && <p className="text-[11px] text-navy/50 leading-relaxed">{draft.rationale}</p>}

            {draft.mainQuest && (
            <div className="space-y-2">
              <h4 className="text-[10px] font-bold text-navy/30 uppercase tracking-widest flex items-center gap-1.5"><Target size={12} /> 主线任务</h4>
              <div className="bg-white/20 rounded-2xl border border-navy/5 p-3">
                <p className="text-[13px] font-black text-navy">{draft.mainQuest.title}</p>
                <p className="text-[10px] text-navy/40 mt-0.5">{draft.mainQuest.description}</p>
                <div className="mt-2 space-y-1">
                  {draft.mainQuest.stages.map((s, i) => (
                    <p key={i} className="text-[10px] text-navy/50">{i + 1}. {s.title}</p>
                  ))}
                </div>
              </div>
            </div>
            )}

            <div className="space-y-2">
              <h4 className="text-[10px] font-bold text-navy/30 uppercase tracking-widest flex items-center gap-1.5"><ListTodo size={12} /> 日常任务</h4>
              {draft.dailyTasks.map((dt, i) => (
                <div key={i} className="bg-white/20 rounded-2xl border border-navy/5 p-2.5">
                  <p className="text-[11px] font-bold text-navy">{dt.title}</p>
                  <p className="text-[9px] text-navy/40">{dt.description}</p>
                </div>
              ))}
            </div>

            <div className="space-y-2">
              <h4 className="text-[10px] font-bold text-navy/30 uppercase tracking-widest flex items-center gap-1.5"><CheckCircle2 size={12} /> 支线任务</h4>
              {draft.sideQuests.map((sq, i) => (
                <div key={i} className="bg-white/20 rounded-2xl border border-navy/5 p-2.5">
                  <p className="text-[11px] font-bold text-navy">{sq.title}</p>
                  <p className="text-[9px] text-navy/40">{sq.description}</p>
                </div>
              ))}
            </div>

            <div className="flex gap-2 pt-2">
              <button onClick={onClose} className="wireframe-btn-ghost !text-[11px] flex-1">取消</button>
              <button onClick={handleApply} className="wireframe-btn !text-[11px] flex-1">加入我的任务</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
