import { RotateCcw, Trophy, Star } from "lucide-react";
import { useApp } from "../AppContext";
import StatBar from "../components/StatBar";
import AchievementCard from "../components/AchievementCard";
import { ATTRIBUTE_LABELS, ATTRIBUTE_EMOJI, ATTRIBUTE_DESCRIPTIONS } from "../types";
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

  // 找出最高属性
  const topAttr = Object.entries(player.attributes).sort(
    (a, b) => b[1].level - a[1].level || b[1].exp - a[1].exp
  )[0];

  return (
    <div className="space-y-6">
      {/* 角色概览 */}
      <div className="bg-gradient-to-br from-sage-light/30 via-cream to-warm-gold-light/20 rounded-2xl border border-sage-light/30 p-5 text-center">
        <div className="text-4xl mb-2">🌍</div>
        <h2 className="text-xl font-semibold text-text-primary">{player.name}</h2>
        <p className="text-sm text-warm-gold font-medium mt-1">「{player.title}」</p>
        <div className="flex items-center justify-center gap-4 mt-3 text-sm">
          <div className="text-center">
            <p className="text-2xl font-bold text-text-primary">{player.level}</p>
            <p className="text-xs text-text-muted">等级</p>
          </div>
          <div className="w-px h-8 bg-sage-light/50" />
          <div className="text-center">
            <p className="text-2xl font-bold text-text-primary">{player.totalExp}</p>
            <p className="text-xs text-text-muted">总经验</p>
          </div>
          <div className="w-px h-8 bg-sage-light/50" />
          <div className="text-center">
            <p className="text-2xl font-bold text-text-primary">{daysSince(player.startDate)}</p>
            <p className="text-xs text-text-muted">地球天数</p>
          </div>
        </div>
        <div className="mt-3 max-w-xs mx-auto">
          <div className="flex items-center justify-between text-xs text-text-muted mb-1">
            <span>距下一级</span>
            <span>{expToNextLevel(player.totalExp)} EXP → Lv.{player.level + 1}</span>
          </div>
          <div className="h-2.5 bg-white/50 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-sage to-sage-dark rounded-full transition-all duration-700 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
        {/* 最高属性提示 */}
        {topAttr && (
          <p className="text-xs text-text-muted mt-3">
            最强属性：{ATTRIBUTE_EMOJI[topAttr[0] as keyof typeof ATTRIBUTE_EMOJI]}{" "}
            {ATTRIBUTE_LABELS[topAttr[0] as keyof typeof ATTRIBUTE_LABELS]} Lv.{topAttr[1].level}
          </p>
        )}
      </div>

      {/* 属性面板 */}
      <div className="bg-white/60 rounded-2xl border border-sage-light/30 p-4">
        <h3 className="font-medium text-text-primary text-sm mb-3 flex items-center gap-2">
          <Star size={16} className="text-warm-gold" /> 生活属性
        </h3>
        <div className="space-y-0.5">
          {(Object.entries(player.attributes) as [keyof typeof ATTRIBUTE_LABELS, { level: number; exp: number }][]).map(
            ([key, val]) => (
              <div key={key} className="group" title={ATTRIBUTE_DESCRIPTIONS[key]}>
                <StatBar attribute={key} level={val.level} exp={val.exp} />
              </div>
            )
          )}
        </div>
      </div>

      {/* 成就面板 */}
      <div className="bg-white/60 rounded-2xl border border-sage-light/30 p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-medium text-text-primary text-sm flex items-center gap-2">
            <Trophy size={16} className="text-warm-gold" /> 成就
          </h3>
          <span className="text-xs text-text-muted">
            {unlockedCount}/{achievements.length} 已解锁
          </span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {achievements.map((a) => (
            <AchievementCard key={a.id} achievement={a} />
          ))}
        </div>
      </div>

      {/* 重置按钮 */}
      <div className="text-center pt-2 pb-4">
        <button
          onClick={handleReset}
          className="inline-flex items-center gap-1.5 text-xs text-text-muted hover:text-soft-rose transition-colors px-3 py-1.5 rounded-lg hover:bg-soft-rose-light/30"
        >
          <RotateCcw size={14} />
          重置 Demo 数据
        </button>
      </div>
    </div>
  );
}
