import { X, Copy, Zap } from "lucide-react";
import { useApp } from "../hooks/useApp";
import { buildTodaySummary } from "../utils/summary";
import { today } from "../utils/date";
import { ATTRIBUTE_ICONS, ATTRIBUTE_LABELS, ATTR_COLOR } from "../types";

interface Props { onClose: () => void; }

export default function DailyShareCardModal({ onClose }: Props) {
  const { state } = useApp();
  const summary = buildTodaySummary(state, today());

  const handleCopy = () => {
    navigator.clipboard.writeText(summary.text).catch(() => {});
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 modal-backdrop animate-fade">
      <div className="wireframe max-w-sm w-full animate-scale p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-black text-navy serif flex items-center gap-2"><Zap size={15} className="text-coral" /> 今日冒险总结</h3>
          <button onClick={onClose} className="p-1.5 rounded-full hover:bg-navy/5 text-navy/40"><X size={16} /></button>
        </div>

        <div className="bg-white/30 rounded-2xl border border-navy/5 p-4 space-y-3">
          <div className="text-center">
            <p className="text-[9px] font-bold text-navy/30 uppercase tracking-widest">地球生活指南</p>
            <h4 className="text-[13px] font-black text-navy mt-0.5">{summary.date}</h4>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <Stat label="完成任务" value={summary.completedCount.toString()} />
            <Stat label="获得经验" value={`${summary.expGained} XP`} />
            <Stat label="今日等级" value={`Lv.${summary.level} · ${summary.title}`} />
            <Stat label="今日记录" value={`${summary.journalCount} 条`} />
          </div>

          {summary.attributeRewards.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {summary.attributeRewards.map((ar) => {
                const AIcon = ATTRIBUTE_ICONS[ar.attribute];
                return (
                  <span key={ar.attribute} className="inline-flex items-center gap-1 text-[9px] font-bold px-2 py-1 rounded-full bg-white/40" style={{ color: ATTR_COLOR[ar.attribute] }}>
                    <AIcon size={10} /> {ATTRIBUTE_LABELS[ar.attribute]} +{ar.exp}
                  </span>
                );
              })}
            </div>
          )}

          <p className="text-[11px] text-navy/60 leading-relaxed italic">"{summary.text}"</p>
        </div>

        <div className="flex gap-2">
          <button onClick={handleCopy} className="wireframe-btn !text-[10px] flex-1"><Copy size={13} /> 复制总结</button>
          <button onClick={onClose} className="wireframe-btn-ghost !text-[10px]">关闭</button>
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-white/30 rounded-xl p-2 text-center">
      <p className="text-[11px] font-black text-navy">{value}</p>
      <p className="text-[8px] font-bold text-navy/30 uppercase tracking-widest">{label}</p>
    </div>
  );
}
