import type { JournalEntry, Task } from "../types";
import { MOOD_LABELS, MOOD_COLORS, ENERGY_LABELS } from "../types";
import { readableDate } from "../utils/date";

interface JournalCardProps {
  entry: JournalEntry;
  task?: Task;
}

export default function JournalCard({ entry, task }: JournalCardProps) {
  const moodColor = MOOD_COLORS[entry.mood];

  return (
    <div className="bg-bg-elevated/60 border border-border-subtle rounded-xl p-4 transition-all duration-300 hover:border-border-default animate-in">
      <div className="flex items-center justify-between mb-2.5">
        <span className="text-[10px] text-text-muted font-mono tracking-wide">
          {readableDate(entry.date)}
        </span>
        <div className="flex items-center gap-2">
          <span className={`text-[10px] bg-bg-glass border border-border-subtle px-2 py-0.5 rounded-full font-medium ${moodColor}`}>
            {MOOD_LABELS[entry.mood]}
          </span>
          <span className="text-[10px] bg-bg-glass border border-border-subtle px-2 py-0.5 rounded-full text-text-secondary">
            {ENERGY_LABELS[entry.energy]}
          </span>
        </div>
      </div>

      <p className="text-[12px] text-text-primary leading-relaxed">{entry.content}</p>

      {task && (
        <div className="mt-2.5 flex items-center gap-2">
          <span className="text-[10px] text-text-secondary bg-bg-glass border border-border-subtle px-2 py-0.5 rounded-full">
            {task.title}
          </span>
        </div>
      )}
      {entry.tags.length > 0 && (
        <div className="flex gap-1.5 mt-2.5 flex-wrap">
          {entry.tags.map((tag) => (
            <span key={tag} className="text-[10px] text-text-muted bg-bg-glass border border-border-subtle px-1.5 py-0.5 rounded-full">
              #{tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
