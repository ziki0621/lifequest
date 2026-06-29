import { Zap } from "lucide-react";
import type { JournalEntry, Task } from "../types";
import { MOOD_LABELS, ENERGY_LABELS, ATTRIBUTE_LABELS, ATTR_COLOR } from "../types";
import { readableDate } from "../utils/date";

interface JournalCardProps { entry: JournalEntry; task?: Task; }

export default function JournalCard({ entry, task }: JournalCardProps) {
  return (
    <div className="glass rounded-3xl p-6 transition-all duration-300 hover:-translate-y-0.5 animate-in relative group">
      {/* Date marker */}
      <div className="absolute -left-10 top-8 hidden md:flex flex-col items-center">
        <span className="text-[9px] font-bold text-navy/30 uppercase tracking-widest">
          {entry.date.slice(5, 7)}月
        </span>
        <span className="text-xl font-black text-navy">{entry.date.slice(8, 10)}</span>
      </div>

      <div className="space-y-3">
        <div className="flex items-center gap-3 flex-wrap">
          <span className="text-[9px] font-bold text-navy/40 uppercase tracking-widest">{readableDate(entry.date)}</span>
          <span className="text-[9px] font-bold text-coral uppercase tracking-widest">{MOOD_LABELS[entry.mood]}</span>
          <span className="text-[9px] font-bold text-navy/40 uppercase tracking-widest">{ENERGY_LABELS[entry.energy]}</span>
        </div>

        <p className="text-[14px] text-navy/80 font-medium leading-relaxed serif">{entry.content}</p>

        {task && (
          <div className="flex gap-3 pt-2 border-t border-navy/5">
            {task.attributeRewards.map((ar) => (
              <span key={ar.attribute} className="text-[10px] font-bold tracking-widest uppercase flex items-center gap-1" style={{ color: ATTR_COLOR[ar.attribute] }}>
                <Zap size={12} /> {ATTRIBUTE_LABELS[ar.attribute]} +{ar.exp}
              </span>
            ))}
          </div>
        )}

        {entry.tags.length > 0 && (
          <div className="flex gap-2 flex-wrap">
            {entry.tags.map((tag) => (
              <span key={tag} className="text-[9px] font-bold text-navy/30 bg-navy/5 px-2.5 py-1 rounded-full tracking-wider">#{tag}</span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
