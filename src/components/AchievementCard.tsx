import { Trophy, Lock } from "lucide-react";
import type { Achievement } from "../types";

interface AchievementCardProps { achievement: Achievement; }

export default function AchievementCard({ achievement }: AchievementCardProps) {
  return (
    <div className={`rounded-3xl p-4 transition-all animate-in ${
      achievement.unlocked
        ? "bg-coral/5 border border-coral/20"
        : "bg-white/30 border border-white/40 opacity-50"
    }`}>
      <div className="flex items-start gap-3">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
          achievement.unlocked ? "bg-coral text-white" : "bg-navy/5 text-navy/30"
        }`}>
          {achievement.unlocked ? <Trophy size={16} /> : <Lock size={14} />}
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="text-[11px] font-black text-navy tracking-wide">{achievement.title}</h4>
          <p className="text-[10px] font-medium text-navy/50 mt-0.5">{achievement.description}</p>
          <p className="text-[9px] font-bold text-navy/30 uppercase tracking-widest mt-1">{achievement.conditionText}</p>
          {achievement.unlocked && achievement.unlockedAt && (
            <p className="text-[10px] font-bold text-coral mt-1 tracking-wider">{achievement.unlockedAt}</p>
          )}
        </div>
      </div>
    </div>
  );
}
