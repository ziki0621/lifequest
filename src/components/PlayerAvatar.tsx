import { Zap } from "lucide-react";
import { getAvatarStage } from "../utils/avatar";
interface Props { level: number; title: string; size?: "sm" | "md" | "lg"; }
export default function PlayerAvatar({ level, title, size = "md" }: Props) {
  const stage = getAvatarStage(level);
  const s = size === "lg" ? "w-28 h-28" : size === "md" ? "w-16 h-16" : "w-10 h-10";
  const isz = size === "lg" ? 32 : size === "md" ? 22 : 14;
  return <div className="flex flex-col items-center gap-2"><div className="relative"><div className={`${s} border-[1.5px] border-[#4A3B2C] bg-[#E3D4BB] shadow-[2px_2px_0px_rgba(74,59,44,0.15)] flex items-center justify-center`}><Zap size={isz} className="text-[#4A3B2C]" /></div>{size !== "sm" && <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-[#4A3B2C] text-[#F3EAD5] text-[9px] font-black px-2 py-0.5 tracking-widest whitespace-nowrap border border-[#4A3B2C]">Lv.{level}</div>}</div>{size !== "sm" && <div className="text-center"><p className="text-[10px] font-black text-[#4A3B2C] uppercase tracking-widest">{title}</p><p className="text-[9px] text-[#4A3B2C]/50">{stage.decoration}</p></div>}</div>;
}
