import { Trophy, Lock } from "lucide-react";
import type { Achievement } from "../types";

interface AchievementCardProps {
  achievement: Achievement;
}

export default function AchievementCard({ achievement }: AchievementCardProps) {
  return (
    <div
      className={`rounded-2xl border p-3 md:p-4 transition-all ${
        achievement.unlocked
          ? "bg-warm-gold-light/30 border-warm-gold/30"
          : "bg-white/50 border-sage-light/30 opacity-50"
      }`}
    >
      <div className="flex items-start gap-3">
        <div
          className={`flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center ${
            achievement.unlocked
              ? "bg-warm-gold/20 text-warm-gold"
              : "bg-sage-light/40 text-text-muted"
          }`}
        >
          {achievement.unlocked ? <Trophy size={20} /> : <Lock size={20} />}
        </div>
        <div>
          <h4 className="font-medium text-sm text-text-primary">
            {achievement.title}
          </h4>
          <p className="text-xs text-text-muted mt-0.5">
            {achievement.description}
          </p>
          <p className="text-xs text-text-muted/70 mt-1">
            {achievement.conditionText}
          </p>
          {achievement.unlocked && achievement.unlockedAt && (
            <p className="text-xs text-warm-gold mt-1">
              ✨ {achievement.unlockedAt} 解锁
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
