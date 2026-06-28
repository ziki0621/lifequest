import { RotateCcw, Trophy, Zap, Target } from "lucide-react";
import { useApp } from "../hooks/useApp";
import StatBar from "../components/StatBar";
import AchievementCard from "../components/AchievementCard";
import { ATTRIBUTE_LABELS, ATTRIBUTE_COLORS } from "../types";
import type { LifeAttribute } from "../types";
import { expToNextLevel } from "../utils/exp";
import { daysSince } from "../utils/date";

export default function CharacterPage() {
  const { state, resetData } = useApp();
  const { player, achievements } = state;
  const progress = Math.round(((player.totalExp % 100) / 100) * 100);
  const unlockedCount = achievements.filter((a) => a.unlocked).length;

  const handleReset = () => {
    if (window.confirm("确定要重置所有数据吗？这会清除所有任务、日志和成就。")) {
      resetData();
    }
  };

  const sortedAttrs = (Object.entries(player.attributes) as [LifeAttribute, { level: number; exp: number }][])
    .sort((a, b) => b[1].level - a[1].level || b[1].exp - a[1].exp);
  const topAttr = sortedAttrs[0];

  return (
    <div className="space-y-6">
      {/* Profile card */}
      <div className="relative overflow-hidden bg-bg-elevated border border-border-subtle rounded-2xl p-6 text-center">
        <div className="absolute top-0 right-0 w-48 h-48 bg-accent-glow rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 opacity-30" />
        <div className="relative">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-accent-surface flex items-center justify-center ring-1 ring-accent/20 mb-4">
            <Zap size={24} className="text-accent" />
          </div>
          <h2 className="text-base font-semibold text-text-primary tracking-tight">{player.name}</h2>
          <p className="text-[11px] text-accent font-medium mt-0.5">{player.title}</p>

          <div className="flex items-center justify-center gap-6 mt-4">
            <Stat label="等级" value={player.level.toString()} />
            <Divider />
            <Stat label="总经验" value={player.totalExp.toString()} />
            <Divider />
            <Stat label="地球天数" value={daysSince(player.startDate).toString()} />
          </div>

          {/* Exp bar */}
          <div className="mt-4 max-w-xs mx-auto">
            <div className="flex items-center justify-between text-[10px] text-text-muted mb-1.5">
              <span>距 Lv.{player.level + 1}</span>
              <span className="tabular-nums">{expToNextLevel(player.totalExp)} EXP</span>
            </div>
            <div className="h-2 bg-bg-glass rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-accent-soft to-accent rounded-full transition-all duration-700 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {topAttr && (
            <p className="text-[10px] text-text-muted mt-3">
              最强属性：
              <span className={ATTRIBUTE_COLORS[topAttr[0]]}>
                {ATTRIBUTE_LABELS[topAttr[0]]} Lv.{topAttr[1].level}
              </span>
            </p>
          )}
        </div>
      </div>

      {/* Attributes */}
      <div className="bg-bg-elevated/60 border border-border-subtle rounded-xl p-4">
        <div className="flex items-center gap-2 mb-3">
          <Target size={14} className="text-accent" />
          <h3 className="text-[11px] font-semibold text-text-primary uppercase tracking-wider">生活属性</h3>
        </div>
        <div className="space-y-0.5">
          {sortedAttrs.map(([key, val]) => (
            <StatBar key={key} attribute={key} level={val.level} exp={val.exp} />
          ))}
        </div>
      </div>

      {/* Achievements */}
      <div className="bg-bg-elevated/60 border border-border-subtle rounded-xl p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Trophy size={14} className="text-gold" />
            <h3 className="text-[11px] font-semibold text-text-primary uppercase tracking-wider">成就</h3>
          </div>
          <span className="text-[10px] text-text-muted tabular-nums">
            {unlockedCount}/{achievements.length} 已解锁
          </span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 stagger-1">
          {achievements.map((a) => (
            <AchievementCard key={a.id} achievement={a} />
          ))}
        </div>
      </div>

      {/* Reset */}
      <div className="text-center pb-4">
        <button
          onClick={handleReset}
          className="inline-flex items-center gap-1.5 text-[10px] text-text-muted hover:text-rose transition-colors px-3 py-1.5 rounded-lg hover:bg-rose-surface/10"
        >
          <RotateCcw size={12} />
          重置 Demo 数据
        </button>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="text-center">
      <p className="text-lg font-bold text-text-primary tabular-nums">{value}</p>
      <p className="text-[9px] text-text-muted uppercase tracking-widest mt-0.5">{label}</p>
    </div>
  );
}

function Divider() {
  return <div className="w-px h-8 bg-border-subtle" />;
}
