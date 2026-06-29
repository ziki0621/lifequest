import type { NpcProfile } from "../types/agent";

interface Props {
  npc: NpcProfile; message: string; actionLabel?: string; onAction?: () => void;
  secondaryLabel?: string; onSecondary?: () => void;
}

export default function NpcAgentPanel({ npc, message, actionLabel, onAction, secondaryLabel, onSecondary }: Props) {
  return (
    <section className="glass rounded-3xl border border-navy/10 overflow-hidden">
      <div className="p-4 flex gap-4 items-start">
        <div className="w-14 h-14 rounded-2xl bg-white/50 border border-white/60 flex items-center justify-center text-2xl shadow-sm flex-shrink-0">
          {npc.avatar}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="text-[13px] font-black text-navy">{npc.name}</h3>
            <span className="text-[9px] font-bold text-navy/30 uppercase tracking-widest">{npc.title}</span>
          </div>
          <p className="text-[12px] text-navy/55 leading-relaxed mt-2 serif">{message}</p>
          {(actionLabel || secondaryLabel) && (
            <div className="flex gap-2 mt-4 flex-wrap">
              {actionLabel && <button className="btn btn-primary !py-2 !px-4 !text-[10px]" onClick={onAction}>{actionLabel}</button>}
              {secondaryLabel && <button className="btn btn-ghost !py-2 !px-4 !text-[10px]" onClick={onSecondary}>{secondaryLabel}</button>}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
