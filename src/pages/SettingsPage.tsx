import { useState } from "react";
import { useApp } from "../hooks/useApp";
import { THEMES } from "../utils/theme";
import { loadLLMConfig, saveLLMConfig, DEFAULT_LLM_CONFIG } from "../utils/llmConfig";
import { callLLM } from "../services/llmClient";
import type { LLMConfig } from "../types/agent";
import { RotateCcw, Palette, Sparkles } from "lucide-react";

export default function SettingsPage() {
  const { theme, setTheme, resetData } = useApp();
  const [llmConfig, setLLMConfig] = useState<LLMConfig>(() => loadLLMConfig());
  const [testStatus, setTestStatus] = useState<string | null>(null);

  const handleSaveLLMConfig = () => { saveLLMConfig(llmConfig); setTestStatus("AI 配置已保存到本地浏览器。"); };
  const handleTestLLM = async () => {
    setTestStatus("正在测试连接...");
    try {
      await callLLM({ ...llmConfig, enabled: true, mockMode: false }, { system: "你是连接测试助手。只回复 OK。", user: "请回复 OK。", temperature: 0 });
      setTestStatus("连接成功。");
    } catch (err) { setTestStatus(`连接失败：${err instanceof Error ? err.message : "未知错误"}`); }
  };
  const handleReset = () => { if (window.confirm("确定要重置所有数据吗？")) resetData(); };

  return (
    <div className="space-y-8 animate-in pb-24">
      <div>
        <p className="text-coral font-bold text-xs tracking-widest uppercase mb-1">设置</p>
        <h2 className="text-2xl font-black text-navy tracking-tight serif">偏好</h2>
      </div>

      {/* AI Agent config */}
      <section className="glass rounded-3xl border border-navy/10 overflow-hidden">
        <div className="flex items-center gap-2.5 px-5 py-3.5 border-b border-navy/5">
          <div className="w-1 h-4 rounded-full bg-theme" />
          <Sparkles size={15} className="text-coral" />
          <h3 className="text-[11px] font-black text-navy uppercase tracking-widest">AI Agent 设置</h3>
        </div>
        <div className="p-4 space-y-4">
          <p className="text-[11px] text-navy/40 leading-relaxed">
            API Key 会保存在本地浏览器 localStorage，仅适合本地测试和 Demo。正式上线请改为后端代理。
          </p>
          <label className="flex items-center gap-2 text-[11px] font-bold text-navy/50">
            <input type="checkbox" checked={llmConfig.enabled} onChange={(e) => setLLMConfig({ ...llmConfig, enabled: e.target.checked })} /> 启用 AI Agent
          </label>
          <label className="flex items-center gap-2 text-[11px] font-bold text-navy/50">
            <input type="checkbox" checked={llmConfig.mockMode} onChange={(e) => setLLMConfig({ ...llmConfig, mockMode: e.target.checked })} /> 使用 Mock 模式
          </label>
          <input className="input" placeholder="Provider Name" value={llmConfig.providerName} onChange={(e) => setLLMConfig({ ...llmConfig, providerName: e.target.value })} />
          <input className="input" placeholder="API Base URL" value={llmConfig.baseUrl} onChange={(e) => setLLMConfig({ ...llmConfig, baseUrl: e.target.value })} />
          <input className="input" placeholder="Model" value={llmConfig.model} onChange={(e) => setLLMConfig({ ...llmConfig, model: e.target.value })} />
          <input className="input" type="password" placeholder="API Key" value={llmConfig.apiKey} onChange={(e) => setLLMConfig({ ...llmConfig, apiKey: e.target.value })} />
          <div className="flex gap-2">
            <button className="btn btn-primary !py-2 !px-5 !text-[10px]" onClick={handleSaveLLMConfig}>保存配置</button>
            <button className="btn btn-ghost !py-2 !px-5 !text-[10px]" onClick={handleTestLLM}>测试连接</button>
            <button className="btn btn-ghost !py-2 !px-5 !text-[10px]" onClick={() => { setLLMConfig(DEFAULT_LLM_CONFIG); saveLLMConfig(DEFAULT_LLM_CONFIG); setTestStatus("已重置 AI 配置。"); }}>重置</button>
          </div>
          {testStatus && <p className="text-[10px] text-navy/40 leading-relaxed">{testStatus}</p>}
        </div>
      </section>

      {/* Theme */}
      <section className="glass rounded-3xl border border-navy/10 overflow-hidden">
        <div className="flex items-center gap-2.5 px-5 py-3.5 border-b border-navy/5">
          <div className="w-1 h-4 rounded-full bg-coral" />
          <Palette size={15} className="text-coral" />
          <h3 className="text-[11px] font-black text-navy uppercase tracking-widest">心情主题</h3>
        </div>
        <div className="p-4 grid grid-cols-2 md:grid-cols-3 gap-3">
          {THEMES.map((t) => (
            <button key={t.id} onClick={() => setTheme(t.id)}
              className={`rounded-2xl p-4 text-center transition-all duration-300 border-2 ${theme.id === t.id ? "border-navy shadow-md scale-[1.02]" : "border-transparent hover:border-navy/15"}`}
              style={{ background: t.bg }}>
              <div className="flex justify-center gap-1.5 mb-2">
                <div className="w-5 h-5 rounded-full" style={{ background: t.blob1, opacity: 0.9 }} />
                <div className="w-5 h-5 rounded-full" style={{ background: t.blob2, opacity: 0.9 }} />
                <div className="w-5 h-5 rounded-full" style={{ background: t.blob3, opacity: 0.9 }} />
              </div>
              <span className={`text-[11px] font-black tracking-wider ${theme.id === t.id ? "text-navy" : "text-navy/50"}`}>{t.name}</span>
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
          <p className="text-[11px] text-navy/40 mb-3 leading-relaxed">清除所有本地数据，恢复到初始状态。</p>
          <button onClick={handleReset} className="btn btn-primary !py-2 !px-5 !text-[10px] !tracking-widest"><RotateCcw size={12} /> 重置 Demo 数据</button>
        </div>
      </section>
    </div>
  );
}
