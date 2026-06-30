import { useState } from "react";
import { Sparkles, ArrowRight } from "lucide-react";
type PlannerIntensity = "gentle" | "normal" | "challenge";

interface Props { onFinish: () => void; onSkip: () => void; onGenerate: (goal: string, intensity: PlannerIntensity) => void; }

type Step = "focus" | "energy" | "style";

export default function OnboardingFlow({ onFinish, onSkip, onGenerate }: Props) {
  const [step, setStep] = useState<Step>("focus");
  const [focus, setFocus] = useState("");
  const [energy, setEnergy] = useState("");
  const [style, setStyle] = useState("");

  const focusOptions = ["作息/身体", "情绪/内耗", "学习/研究", "关系/社交", "房间/秩序", "兴趣/创作", "工作/申请"];
  const energyOptions = [
    { label: "低能量：只能做很小的事", value: "gentle" },
    { label: "普通：可以稳定推进", value: "normal" },
    { label: "高能量：想挑战一点", value: "challenge" },
  ];
  const styleOptions = ["温柔陪伴", "生活计划器", "RPG 游戏"];

  const handleFinish = () => {
    if (focus && energy) {
      const goalMap: Record<string, string> = {
        "作息/身体": "我想改善作息和身体状态",
        "情绪/内耗": "我想减少内耗，照顾情绪",
        "学习/研究": "我想更专注地学习",
        "关系/社交": "我想更好地维系关系",
        "房间/秩序": "我想让生活环境更有序",
        "兴趣/创作": "我想培养一个兴趣或创作习惯",
        "工作/申请": "我想更高效地推进工作",
      };
      onGenerate(goalMap[focus] || focus, energy as PlannerIntensity);
    } else {
      onFinish();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative p-6">
      <div className="relative z-10 max-w-sm w-full animate-scale space-y-8">
        <div className="text-center">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-theme text-white flex items-center justify-center mb-4 shadow-xl shadow-navy/20">
            <Sparkles size={22} />
          </div>
          <h2 className="text-xl font-black text-navy tracking-tight serif">了解你的状态</h2>
          <p className="text-[11px] text-navy/40 mt-1">帮助你生成适合的任务线</p>
          <div className="flex justify-center gap-1.5 mt-3">
            {(["focus", "energy", "style"] as Step[]).map((s) => (
              <div key={s} className={`w-2 h-2 rounded-full transition-all ${step === s ? "bg-theme w-6" : "bg-navy/10"}`} />
            ))}
          </div>
        </div>

        {step === "focus" && (
          <div className="space-y-4">
            <h3 className="text-[13px] font-black text-navy text-center">最近你最想改善什么？</h3>
            <div className="space-y-2">
              {focusOptions.map((o) => (
                <button key={o} onClick={() => { setFocus(o); setStep("energy"); }}
                  className={`w-full text-left px-4 py-3 rounded-2xl text-[11px] font-bold transition-all ${focus === o ? "bg-theme text-white" : "bg-white/30 text-navy/60 hover:bg-white/50"}`}>{o}</button>
              ))}
            </div>
          </div>
        )}

        {step === "energy" && (
          <div className="space-y-4">
            <h3 className="text-[13px] font-black text-navy text-center">你现在的能量状态？</h3>
            <div className="space-y-2">
              {energyOptions.map((o) => (
                <button key={o.value} onClick={() => { setEnergy(o.value); setStep("style"); }}
                  className={`w-full text-left px-4 py-3 rounded-2xl text-[11px] font-bold transition-all ${energy === o.value ? "bg-theme text-white" : "bg-white/30 text-navy/60 hover:bg-white/50"}`}>{o.label}</button>
              ))}
            </div>
          </div>
        )}

        {step === "style" && (
          <div className="space-y-4">
            <h3 className="text-[13px] font-black text-navy text-center">你希望 LifeQuest 更像什么？</h3>
            <div className="space-y-2">
              {styleOptions.map((o) => (
                <button key={o} onClick={() => setStyle(o)}
                  className={`w-full text-left px-4 py-3 rounded-2xl text-[11px] font-bold transition-all ${style === o ? "bg-theme text-white" : "bg-white/30 text-navy/60 hover:bg-white/50"}`}>{o}</button>
              ))}
            </div>
            <div className="flex gap-2 pt-2">
              <button onClick={onSkip} className="wireframe-btn-ghost !text-[10px] flex-1">跳过，使用示例数据</button>
              <button onClick={handleFinish} className="wireframe-btn !text-[10px] flex-1">开始 <ArrowRight size={13} /></button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
