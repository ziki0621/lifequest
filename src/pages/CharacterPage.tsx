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
  const { player, achievements } = state;
  const progress = Math.round(((player.totalExp % 100) / 100) * 100);
  const unlocked = achievements.filter((a) => a.unlocked).length;

  const sortedAttrs = (Object.entries(player.attributes) as [LifeAttribute, { level: number; exp: number }][])
    .sort((a, b) => b[1].level - a[1].level || b[1].exp - a[1].exp);

  return (
    <div className="space-y-10 animate-in pb-24">
      {/* Avatar + name card */}
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
      <div className="grid grid-cols-3 gap-4">
        <StatCard label="等级" value={player.level.toString()} />
        <StatCard label="总经验" value={player.totalExp.toString()} />
        <StatCard label="地球天数" value={daysSince(player.startDate).toString()} />
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

      {/* Reset */}
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
    <div className="glass rounded-3xl p-4 text-center">
      <div className="text-2xl font-black text-navy tabular-nums">{value}</div>
      <div className="text-[9px] font-bold text-navy/30 uppercase tracking-widest mt-1">{label}</div>
    </div>
  );
}
