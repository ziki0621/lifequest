import { Trophy, Target } from "lucide-react";
import { useApp } from "../hooks/useApp";
import StatBar from "../components/StatBar";
import AchievementCard from "../components/AchievementCard";
import PlayerAvatar from "../components/PlayerAvatar";
import { ATTRIBUTE_LABELS, ATTR_COLOR } from "../types";
import type { LifeAttribute } from "../types";
import { expToNextLevel } from "../utils/exp";
import { daysSince } from "../utils/date";

export default function CharacterPage() {
  const { state } = useApp();
  const { player, achievements, questBooks, dailyTasks, sideQuests } = state;
  const progress = Math.round(((player.totalExp % 100) / 100) * 100);
  const unlocked = achievements.filter((a) => a.unlocked).length;

  const sortedAttrs = (Object.entries(player.attributes) as [LifeAttribute, { level: number; exp: number }][]).sort((a, b) => b[1].level - a[1].level || b[1].exp - a[1].exp);

  const completedStages = questBooks.reduce((s, qb) => s + qb.questLines.reduce((sl, ql) => sl + ql.stages.filter((st) => st.completed).length, 0) + qb.directTasks.filter((t) => t.completed).length, 0);
  const completedSideQuests = sideQuests.filter((sq) => sq.completed).length;
  const totalDailyCompletions = dailyTasks.reduce((s, dt) => s + dt.completions.length, 0);

  let maxStreak = 0; const allDates = new Set<string>();
  dailyTasks.forEach((dt) => dt.completions.forEach((c) => allDates.add(c)));
  questBooks.forEach((qb) => { qb.questLines.forEach((ql) => ql.stages.forEach((st) => { if (st.completed && st.completedAt) allDates.add(st.completedAt.slice(0, 10)); })); qb.directTasks.forEach((t) => { if (t.completed && t.completedAt) allDates.add(t.completedAt.slice(0, 10)); }); });
  sideQuests.forEach((sq) => { if (sq.completed && sq.completedAt) allDates.add(sq.completedAt.slice(0, 10)); });
  const sortedDates = [...allDates].sort(); let cStreak = 0;
  for (let i = 0; i < sortedDates.length; i++) {
    if (i === 0) cStreak = 1; else { const diff = Math.round((new Date(sortedDates[i]).getTime() - new Date(sortedDates[i - 1]).getTime()) / 86400000); if (diff === 1) cStreak++; else { maxStreak = Math.max(maxStreak, cStreak); cStreak = 1; } }
  }
  maxStreak = Math.max(maxStreak, cStreak);

  const SC = ({ label, value }: { label: string; value: string }) => <div className="wireframe wireframe-shaded"><div className="wireframe-inner p-3 text-center"><div className="text-lg font-black text-ink tabular-nums">{value}</div><div className="text-[8px] font-bold text-ink/30 uppercase tracking-widest mt-0.5">{label}</div></div></div>;

  return (
    <div className="space-y-8 animate-in pb-24">
      <div className="flex flex-col items-center text-center"><PlayerAvatar level={player.level} title={player.title} size="lg" /><h2 className="text-2xl font-black text-ink tracking-tight serif mt-3">{player.name}</h2><p className="text-coral font-bold text-xs tracking-widest uppercase mt-2">Lv.{player.level} · {player.title}</p></div>

      <div className="grid grid-cols-4 gap-3"><SC label="等级" value={player.level.toString()} /><SC label="总经验" value={player.totalExp.toString()} /><SC label="地球天数" value={daysSince(player.startDate).toString()} /><SC label="成就" value={`${unlocked}/${achievements.length}`} /></div>
      <div className="grid grid-cols-4 gap-3"><SC label="完成" value={completedStages.toString()} /><SC label="支线" value={completedSideQuests.toString()} /><SC label="打卡" value={totalDailyCompletions.toString()} /><SC label="连胜" value={maxStreak.toString()} /></div>

      <div className="wireframe"><div className="wireframe-inner p-5 text-center"><div className="flex justify-between text-[9px] font-bold text-ink/30 uppercase tracking-widest mb-2"><span>距 Lv.{player.level + 1}</span><span>{expToNextLevel(player.totalExp)} EXP</span></div><div className="progress-track"><div className="progress-fill" style={{ width: `${progress}%` }} /></div>{sortedAttrs[0] && <p className="text-[10px] font-bold text-ink/30 uppercase tracking-widest mt-3">最强属性：<span style={{ color: ATTR_COLOR[sortedAttrs[0][0]] }}>{ATTRIBUTE_LABELS[sortedAttrs[0][0]]} Lv.{sortedAttrs[0][1].level}</span></p>}</div></div>

      <div className="wireframe"><div className="wireframe-inner p-4"><div className="flex items-center gap-2 mb-3"><Target size={14} className="text-ink" /><h3 className="text-[10px] font-bold text-ink/40 uppercase tracking-widest">生活属性</h3></div><div className="space-y-0.5">{sortedAttrs.map(([key, val]) => <StatBar key={key} attribute={key} level={val.level} exp={val.exp} />)}</div></div></div>

      <div className="wireframe"><div className="wireframe-inner p-4"><div className="flex items-center justify-between mb-3"><div className="flex items-center gap-2"><Trophy size={14} className="text-ink" /><h3 className="text-[10px] font-bold text-ink/40 uppercase tracking-widest">成就</h3></div><span className="text-[9px] font-bold text-ink/30 uppercase tracking-widest">{unlocked}/{achievements.length} 已解锁</span></div><div className="grid grid-cols-1 md:grid-cols-2 gap-2 stagger-1">{achievements.map((a) => <AchievementCard key={a.id} achievement={a} />)}</div></div></div>
    </div>
  );
}
