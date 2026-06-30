import type { NpcProfile } from "../types/agent";

interface Props {
  npc: NpcProfile; message: string; actionLabel?: string; onAction?: () => void;
  secondaryLabel?: string; onSecondary?: () => void;
}

export default function NpcAgentPanel({ npc, message, actionLabel, onAction, secondaryLabel, onSecondary }: Props) {
  return (
    <div className="wireframe">
      <div className="wireframe-inner p-4 flex gap-4 items-start">
        <div className="w-12 h-12 border-[1.5px] border-ink bg-parchment-dark flex items-center justify-center text-xl shadow-[1px_1px_0px_rgba(74,59,44,0.1)] flex-shrink-0">{npc.avatar}</div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap"><h3 className="text-[13px] font-black text-ink">{npc.name}</h3><span className="text-[9px] font-bold text-ink/30 uppercase tracking-widest">{npc.title}</span></div>
          <p className="text-[12px] text-ink/55 leading-relaxed mt-2 serif">{message}</p>
          {(actionLabel || secondaryLabel) && (
            <div className="flex gap-2 mt-4 flex-wrap">
              {actionLabel && (
                <div className="chamfer-btn h-8" onClick={onAction}><div className="chamfer-outer"><div className="chamfer-gap"><div className="chamfer-inner"><div className="chamfer-core px-3"><span className="text-[10px] font-bold text-ink tracking-wider">{actionLabel}</span></div></div></div></div></div>
              )}
              {secondaryLabel && <button className="text-[10px] font-bold text-ink/30 hover:text-ink tracking-wider px-3 py-1.5 border border-ink/15 hover:border-ink/30 transition-colors" onClick={onSecondary}>{secondaryLabel}</button>}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
