import type { JournalEntry, Task } from "../types";
import { MOOD_EMOJI, MOOD_LABELS, ENERGY_LABELS } from "../types";
import { readableDate } from "../utils/date";

interface JournalCardProps {
  entry: JournalEntry;
  task?: Task;
}

export default function JournalCard({ entry, task }: JournalCardProps) {
  return (
    <div className="bg-white/70 rounded-2xl border border-sage-light/40 p-4 transition-all hover:shadow-sm">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs text-text-muted">{readableDate(entry.date)}</span>
        <div className="flex items-center gap-2">
          <span className="text-xs bg-cream-dark px-2 py-0.5 rounded-full text-text-secondary">
            {MOOD_EMOJI[entry.mood]} {MOOD_LABELS[entry.mood]}
          </span>
          <span className="text-xs bg-cream-dark px-2 py-0.5 rounded-full text-text-secondary">
            {ENERGY_LABELS[entry.energy]}
          </span>
        </div>
      </div>
      <p className="text-sm text-text-primary leading-relaxed">{entry.content}</p>
      {task && (
        <div className="mt-2 flex items-center gap-2">
          <span className="text-xs text-sage-dark bg-sage-light/50 px-2 py-0.5 rounded-full">
            📋 {task.title}
          </span>
        </div>
      )}
      {entry.tags.length > 0 && (
        <div className="flex gap-1 mt-2 flex-wrap">
          {entry.tags.map((tag) => (
            <span key={tag} className="text-xs text-mist-blue bg-mist-blue-light/50 px-1.5 py-0.5 rounded-full">
              #{tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
