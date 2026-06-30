import { Trophy, Lock } from "lucide-react";
import type { Achievement } from "../types";
interface Props { achievement: Achievement; }
export default function AchievementCard({ achievement }: Props) {
  return <div className={`wireframe ${!achievement.unlocked ? "opacity-50" : ""}`}><div className="wireframe-inner p-3 flex items-start gap-3"><div className={`w-8 h-8 border-[1.5px] border-[#4A3B2C] flex items-center justify-center flex-shrink-0 ${achievement.unlocked ? "bg-[#4A3B2C] text-[#F3EAD5]" : "bg-[#E3D4BB] text-[#4A3B2C]/30"}`}>{achievement.unlocked ? <Trophy size={14}/>:<Lock size={12}/>}</div><div className="flex-1 min-w-0"><h4 className="text-[11px] font-black text-[#4A3B2C] tracking-wide">{achievement.title}</h4><p className="text-[10px] text-[#4A3B2C]/50 mt-0.5">{achievement.description}</p><p className="text-[9px] font-bold text-[#4A3B2C]/30 uppercase tracking-widest mt-1">{achievement.conditionText}</p>{achievement.unlocked && achievement.unlockedAt && <p className="text-[10px] font-bold text-[#4A3B2C] mt-1 tracking-wider">{achievement.unlockedAt}</p>}</div></div></div>;
}
