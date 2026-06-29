import { RotateCcw, Trophy, Zap, Target } from "lucide-react";
import { useApp } from "../hooks/useApp";
import StatBar from "../components/StatBar";
import AchievementCard from "../components/AchievementCard";
import { ATTRIBUTE_LABELS, ATTR_COLOR } from "../types";
import type { LifeAttribute } from "../types";
import { expToNextLevel } from "../utils/exp";
import { daysSince } from "../utils/date";

export default function CharacterPage() {
  const { state, resetData } = useApp();
  const { player, achievements, mainQuests, dailyTasks, sideQuests } = state;
  const progress = Math.round(((player.totalExp % 100) / 100) * 100);
  const unlocked = achievements.filter((a) => a.unlocked).length;

  const sortedAttrs = (Object.entries(player.attributes) as [LifeAttribute, { level: number; exp: number }][])
    .sort((a, b) => b[1].level - a[1].level || b[1].exp - a[1].exp);

  // Stats
  const completedStages = mainQuests.reduce((sum, mq) => sum + mq.stages.filter((s) => s.completed).length, 0);
  const completedSideQuests = sideQuests.filter((sq) => sq.completed).length;
  const totalDailyCompletions = dailyTasks.reduce((sum, dt) => sum + dt.completions.length, 0);

  // Longest streak
  let maxStreak = 0;
  const allDates = new Set<string>();
  dailyTasks.forEach((dt) => dt.completions.forEach((c) => allDates.add(c)));
  mainQuests.forEach((mq) => mq.stages.forEach((s) => {
    if (s.completed && s.completedAt) allDates.add(s.completedAt.slice(0, 10));
  }));
  sideQuests.forEach((sq) => {
    if (sq.completed && sq.completedAt) allDates.add(sq.completedAt.slice(0, 10));
  });
  const sortedDates = [...allDates].sort();
  let currentStreak = 0;
  for (let i = 0; i < sortedDates.length; i++) {
    if (i === 0) { currentStreak = 1; }
    else {
      const prev = new Date(sortedDates[i - 1]);
      const curr = new Date(sortedDates[i]);
      const diff = Math.round((curr.getTime() - prev.getTime()) / 86400000);
      if (diff === 1) currentStreak++;
      else { maxStreak = Math.max(maxStreak, currentStreak); currentStreak = 1; }
    }
  }
  maxStreak = Math.max(maxStreak, currentStreak);

  return (
    <div className="space-y-10 animate-in pb-24">
      {/* Avatar card */}
      <div className="flex flex-col items-center text-center">
        <div className="w-28 h-28 rounded-[2rem] rotate-3 bg-coral/20 p-1 mb-6 shadow-xl shadow-coral/10">
          <div className="w-full h-full bg-white rounded-[1.7rem] -rotate-3 flex items-center justify-center">
            <Zap size={32} className="text-navy" />
          </div>
        </div>
        <h2 className="text-2xl font-black text-navy tracking-tight serif">{player.name}</h2>
        <p className="text-coral font-bold text-xs tracking-widest uppercase mt-2">Lv.{player.level} · {player.title}</p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-4 gap-3">
        <StatCard label="等级" value={player.level.toString()} />
        <StatCard label="总经验" value={player.totalExp.toString()} />
        <StatCard label="地球天数" value={daysSince(player.startDate).toString()} />
      </div>

      {/* Sub stats */}
      <div className="grid grid-cols-4 gap-3">
        <StatCard label="完成阶段" value={completedStages.toString()} />
        <StatCard label="支线完成" value={completedSideQuests.toString()} />
        <StatCard label="打卡次数" value={totalDailyCompletions.toString()} />
        <StatCard label="最长连胜" value={maxStreak.toString()} />
      </div>

      {/* Exp bar */}
      <div className="glass rounded-3xl p-5 text-center">
        <div className="flex justify-between text-[9px] font-bold text-navy/30 uppercase tracking-widest mb-2">
          <span>距 Lv.{player.level + 1}</span>
          <span>{expToNextLevel(player.totalExp)} EXP</span>
        </div>
        <div className="progress"><div className="progress-fill" style={{ width: `${progress}%`, background: "#0B192C" }} /></div>
        {sortedAttrs[0] && (
          <p className="text-[10px] font-bold text-navy/30 uppercase tracking-widest mt-3">
            最强属性：<span style={{ color: ATTR_COLOR[sortedAttrs[0][0]] }}>{ATTRIBUTE_LABELS[sortedAttrs[0][0]]} Lv.{sortedAttrs[0][1].level}</span>
          </p>
        )}
      </div>

      {/* Attributes */}
      <div className="glass rounded-3xl p-5 space-y-1">
        <div className="flex items-center gap-2 mb-3">
          <Target size={14} className="text-navy" />
          <h3 className="text-[10px] font-bold text-navy/40 uppercase tracking-widest">生活属性</h3>
        </div>
        {sortedAttrs.map(([key, val]) => <StatBar key={key} attribute={key} level={val.level} exp={val.exp} />)}
      </div>

      {/* Achievements */}
      <div className="glass rounded-3xl p-5">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Trophy size={14} className="text-coral" />
            <h3 className="text-[10px] font-bold text-navy/40 uppercase tracking-widest">成就</h3>
          </div>
          <span className="text-[9px] font-bold text-navy/30 uppercase tracking-widest">{unlocked}/{achievements.length} 已解锁</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 stagger-1">
          {achievements.map((a) => <AchievementCard key={a.id} achievement={a} />)}
        </div>
      </div>

      <div className="text-center">
        <button onClick={() => { if (window.confirm("确定要重置所有数据吗？")) resetData(); }}
          className="inline-flex items-center gap-1.5 text-[10px] font-bold text-navy/30 uppercase tracking-widest hover:text-coral transition-colors">
          <RotateCcw size={11} /> 重置 Demo 数据
        </button>
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="glass rounded-2xl p-3 text-center">
      <div className="text-lg font-black text-navy tabular-nums">{value}</div>
      <div className="text-[8px] font-bold text-navy/30 uppercase tracking-widest mt-0.5">{label}</div>
    </div>
  );
}
