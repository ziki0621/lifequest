import { Zap } from "lucide-react";
import { getAvatarStage } from "../utils/avatar";

interface Props { level: number; title: string; size?: "sm" | "md" | "lg"; }

export default function PlayerAvatar({ level, title, size = "md" }: Props) {
  const stage = getAvatarStage(level);
  const sizeClass = size === "lg" ? "w-28 h-28 rounded-[2rem] text-lg" : size === "md" ? "w-16 h-16 rounded-2xl text-sm" : "w-10 h-10 rounded-xl text-xs";

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative">
        <div className={`${sizeClass} bg-theme text-white flex items-center justify-center shadow-lg shadow-navy/20`}>
          {size === "sm" ? <Zap size={16} /> : <Zap size={size === "lg" ? 32 : 22} />}
        </div>
        {size !== "sm" && (
          <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-coral text-white text-[9px] font-black px-2.5 py-0.5 rounded-full tracking-widest whitespace-nowrap">
            Lv.{level}
          </div>
        )}
      </div>
      {size !== "sm" && (
        <div className="text-center">
          <p className="text-[10px] font-black text-navy uppercase tracking-widest">{title}</p>
          <p className="text-[9px] text-coral/70">{stage.decoration}</p>
        </div>
      )}
    </div>
  );
}
