import { useApp } from "../hooks/useApp";
import { THEMES } from "../utils/theme";
import { RotateCcw, Palette } from "lucide-react";

export default function SettingsPage() {
  const { theme, setTheme, resetData } = useApp();

  const handleReset = () => {
    if (window.confirm("确定要重置所有数据吗？这会清除所有任务、日志和成就。")) {
      resetData();
    }
  };

  return (
    <div className="space-y-8 animate-in pb-24">
      <div>
        <p className="text-coral font-bold text-xs tracking-widest uppercase mb-1">设置</p>
        <h2 className="text-2xl font-black text-navy tracking-tight serif">偏好</h2>
      </div>

      {/* Theme picker */}
      <section className="glass rounded-3xl border border-navy/10 overflow-hidden">
        <div className="flex items-center gap-2.5 px-5 py-3.5 border-b border-navy/5">
          <div className="w-1 h-4 rounded-full bg-coral" />
          <Palette size={15} className="text-coral" />
          <h3 className="text-[11px] font-black text-navy uppercase tracking-widest">心情主题</h3>
        </div>
        <div className="p-4 grid grid-cols-2 md:grid-cols-3 gap-3">
          {THEMES.map((t) => (
            <button
              key={t.id}
              onClick={() => setTheme(t.id)}
              className={`rounded-2xl p-4 text-center transition-all duration-300 border-2 ${
                theme.id === t.id
                  ? "border-navy shadow-md scale-[1.02]"
                  : "border-transparent hover:border-navy/15"
              }`}
              style={{ background: t.bg }}
            >
              <div className="flex justify-center gap-1.5 mb-2">
                <div className="w-5 h-5 rounded-full" style={{ background: t.blob1, opacity: 0.9 }} />
                <div className="w-5 h-5 rounded-full" style={{ background: t.blob2, opacity: 0.9 }} />
                <div className="w-5 h-5 rounded-full" style={{ background: t.blob3, opacity: 0.9 }} />
              </div>
              <span className={`text-[11px] font-black tracking-wider ${
                theme.id === t.id ? "text-navy" : "text-navy/50"
              }`}>
                {t.name}
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* Data */}
      <section className="glass rounded-3xl border border-navy/10 overflow-hidden">
        <div className="flex items-center gap-2.5 px-5 py-3.5 border-b border-navy/5">
          <div className="w-1 h-4 rounded-full bg-theme" />
          <RotateCcw size={15} className="text-navy" />
          <h3 className="text-[11px] font-black text-navy uppercase tracking-widest">数据</h3>
        </div>
        <div className="p-4">
          <p className="text-[11px] text-navy/40 mb-3 leading-relaxed">
            清除所有本地数据，恢复到初始状态。
          </p>
          <button onClick={handleReset}
            className="btn btn-primary !py-2 !px-5 !text-[10px] !tracking-widest">
            <RotateCcw size={12} /> 重置 Demo 数据
          </button>
        </div>
      </section>
    </div>
  );
}
