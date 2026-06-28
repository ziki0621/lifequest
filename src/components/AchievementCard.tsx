import { Trophy, Lock } from "lucide-react";
import type { Achievement } from "../types";

interface AchievementCardProps {
  achievement: Achievement;
}

export default function AchievementCard({ achievement }: AchievementCardProps) {
  return (
    <div
      className={`rounded-xl border p-3 transition-all duration-300 animate-in ${
        achievement.unlocked
          ? "bg-gold-surface/30 border-gold/20"
          : "bg-bg-elevated/40 border-border-subtle opacity-60"
      }`}
    >
      <div className="flex items-start gap-3">
        <div
          className={`flex-shrink-0 w-9 h-9 rounded-lg flex items-center justify-center ${
            achievement.unlocked
              ? "bg-gold/15 text-gold"
              : "bg-bg-glass text-text-muted"
          }`}
        >
          {achievement.unlocked ? <Trophy size={16} /> : <Lock size={14} />}
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="text-[11px] font-medium text-text-primary">
            {achievement.title}
          </h4>
          <p className="text-[10px] text-text-muted mt-0.5 leading-relaxed">
            {achievement.description}
          </p>
          <p className="text-[10px] text-text-muted/60 mt-1">
            {achievement.conditionText}
          </p>
          {achievement.unlocked && achievement.unlockedAt && (
            <p className="text-[10px] text-gold mt-1 font-medium">
              {achievement.unlockedAt} 解锁
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
