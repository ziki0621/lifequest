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
  const handleTestLLM = async () => { setTestStatus("正在测试连接..."); try { await callLLM({ ...llmConfig, enabled: true, mockMode: false }, { system: "你是连接测试助手。", user: "OK", temperature: 0 }); setTestStatus("连接成功。"); } catch (err) { setTestStatus(`连接失败：${err instanceof Error ? err.message : "未知错误"}`); } };
  const handleReset = () => { if (window.confirm("确定要重置所有数据吗？")) resetData(); };

  return (
    <div className="space-y-8 animate-in pb-24"><div><p className="text-coral font-bold text-xs tracking-widest uppercase mb-1">设置</p><h2 className="text-2xl font-black text-ink tracking-tight serif">偏好</h2></div>

      <div className="wireframe"><div className="wireframe-inner"><div className="h-7 border-b-[0.5px] border-ink/15 flex items-center gap-2 px-3"><div className="w-1 h-4 bg-ink" /><Sparkles size={15} /><h3 className="text-[10px] font-black text-ink uppercase tracking-widest">AI Agent 设置</h3></div>
        <div className="p-4 space-y-4"><p className="text-[11px] text-ink/40 leading-relaxed">API Key 会保存在本地浏览器 localStorage，仅适合本地测试和 Demo。</p>
          <label className="flex items-center gap-2 text-[11px] font-bold text-ink/50"><input type="checkbox" checked={llmConfig.enabled} onChange={(e) => setLLMConfig({ ...llmConfig, enabled: e.target.checked })} /> 启用 AI Agent</label>
          <label className="flex items-center gap-2 text-[11px] font-bold text-ink/50"><input type="checkbox" checked={llmConfig.mockMode} onChange={(e) => setLLMConfig({ ...llmConfig, mockMode: e.target.checked })} /> 使用 Mock 模式</label>
          <input className="wireframe-input" placeholder="Provider Name" value={llmConfig.providerName} onChange={(e) => setLLMConfig({ ...llmConfig, providerName: e.target.value })} />
          <input className="wireframe-input" placeholder="API Base URL" value={llmConfig.baseUrl} onChange={(e) => setLLMConfig({ ...llmConfig, baseUrl: e.target.value })} />
          <input className="wireframe-input" placeholder="Model" value={llmConfig.model} onChange={(e) => setLLMConfig({ ...llmConfig, model: e.target.value })} />
          <input className="wireframe-input" type="password" placeholder="API Key" value={llmConfig.apiKey} onChange={(e) => setLLMConfig({ ...llmConfig, apiKey: e.target.value })} />
          <div className="flex gap-2">
            <div className="chamfer-btn h-9" onClick={handleSaveLLMConfig}><div className="chamfer-outer"><div className="chamfer-gap"><div className="chamfer-inner"><div className="chamfer-core px-3"><span className="text-[10px] font-bold">保存配置</span></div></div></div></div></div>
            <button className="text-[10px] font-bold text-ink/30 hover:text-ink px-3 border border-ink/15 hover:border-ink/30 transition-colors" onClick={handleTestLLM}>测试连接</button>
            <button className="text-[10px] font-bold text-ink/30 hover:text-ink px-3 border border-ink/15 hover:border-ink/30 transition-colors" onClick={() => { setLLMConfig(DEFAULT_LLM_CONFIG); saveLLMConfig(DEFAULT_LLM_CONFIG); setTestStatus("已重置 AI 配置。"); }}>重置</button>
          </div>
          {testStatus && <p className="text-[10px] text-ink/40 leading-relaxed">{testStatus}</p>}
        </div></div></div>

      <div className="wireframe"><div className="wireframe-inner"><div className="h-7 border-b-[0.5px] border-ink/15 flex items-center gap-2 px-3"><div className="w-1 h-4 bg-coral" /><Palette size={15} /><h3 className="text-[10px] font-black text-ink uppercase tracking-widest">主题色</h3></div>
        <div className="p-4 grid grid-cols-2 md:grid-cols-3 gap-3">{THEMES.map((t) => (
          <button key={t.id} onClick={() => setTheme(t.id)}
            className={`wireframe wireframe-shaded p-4 text-center transition-all ${theme.id === t.id ? "shadow-[3px_3px_0px_rgba(74,59,44,0.3)]" : ""}`}>
            <div className="flex justify-center gap-1.5 mb-2">
              <div className="w-5 h-5 border border-ink/30" style={{ background: t.primary, opacity: 0.9 }} />
              <div className="w-5 h-5 border border-ink/30" style={{ background: t.primaryLight, opacity: 0.9 }} />
            </div>
            <span className={`text-[11px] font-black tracking-wider ${theme.id === t.id ? "text-ink" : "text-ink/50"}`}>{t.name}</span>
          </button>
        ))}</div></div></div>

      <div className="wireframe"><div className="wireframe-inner"><div className="h-7 border-b-[0.5px] border-ink/15 flex items-center gap-2 px-3"><div className="w-1 h-4 bg-ink" /><RotateCcw size={15} /><h3 className="text-[10px] font-black text-ink uppercase tracking-widest">数据</h3></div>
        <div className="p-4"><p className="text-[11px] text-ink/40 mb-3 leading-relaxed">清除所有本地数据，恢复到初始状态。</p>
          <div className="chamfer-btn h-9 inline-flex" onClick={handleReset}><div className="chamfer-outer"><div className="chamfer-gap"><div className="chamfer-inner"><div className="chamfer-core px-4"><RotateCcw size={12} /><span className="text-[10px] font-bold ml-1.5">重置 Demo 数据</span></div></div></div></div></div></div></div></div>
    </div>
  );
}
