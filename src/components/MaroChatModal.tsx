import { useState, useRef, useEffect } from "react";
import { X, Send, Loader2 } from "lucide-react";
import { useApp } from "../hooks/useApp";
import { NPCS } from "../data/npcs";
import { loadLLMConfig } from "../utils/llmConfig";
import { generateQuestPlan } from "../services/questPlanAgent";
import { assessCompleteness } from "../services/maroCompleteness";
import QuestPlanPreview from "./QuestPlanPreview";
import type { QuestPlanDraft } from "../types/agent";
import type { QuestGenType } from "../services/questPlanAgent";

interface Props { onClose: () => void; }

type ChatBubble = { role: "npc" | "user"; content: string };

const maro = NPCS.maro;

export default function MaroChatModal({ onClose }: Props) {
  const { applyQuestPlan } = useApp();

  const [taskType, setTaskType] = useState<QuestGenType>("all");
  const [typeChosen, setTypeChosen] = useState(false);
  const [messages, setMessages] = useState<ChatBubble[]>([
    { role: "npc", content: "你好，我是 Maro，冒险公会的管理员。你想创建什么类型的任务？" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [draft, setDraft] = useState<QuestPlanDraft | null>(null);
  const [userGoal, setUserGoal] = useState("");
  const [extraInfo, setExtraInfo] = useState("");
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, draft]);

  const addNpc = (content: string) => setMessages((prev) => [...prev, { role: "npc", content }]);
  const addUser = (content: string) => setMessages((prev) => [...prev, { role: "user", content }]);

  // Step 1: choose type
  const handleChooseType = (t: QuestGenType) => {
    setTaskType(t);
    setTypeChosen(true);
    const typeLabel = t === "main" ? "任务书" : t === "daily" ? "日常任务" : t === "side" ? "支线任务" : "全部类型";
    addUser(`我想创建${typeLabel}`);
    addNpc(`好的，${typeLabel}。请给我描述一下你想做什么。比如：
"我最近作息很乱，想重新稳定下来，大概需要两周时间，强度不用太高。"
你的描述越具体，我就能生成得越精准。`);
  };

  // Step 2: user describes → check completeness → follow-up or generate
  const handleSendGoal = async () => {
    const text = input.trim();
    if (!text) return;
    addUser(text);
    setInput("");
    setUserGoal(text);
    setLoading(true);

    const config = loadLLMConfig();
    const assessment = await assessCompleteness(text, config);

    if (!assessment.needsMore || assessment.sufficient) {
      // Enough info → generate immediately
      addNpc("信息很清晰，我现在就为你生成。");
      await doGenerate(text, extraInfo);
    } else {
      // Ask ONE follow-up question
      const followUp = assessment.question || `关于"${text.slice(0, 20)}…"，能再多说一点吗？比如你希望的时间范围或强度？`;
      addNpc(followUp);
      setLoading(false);
    }
  };

  // Step 3: user answers follow-up → generate
  const handleSendExtra = async () => {
    const text = input.trim();
    if (!text) return;
    addUser(text);
    setInput("");
    setExtraInfo(text);
    setLoading(true);
    addNpc("明白了，我这就为你整理。");
    await doGenerate(userGoal, text);
  };

  const doGenerate = async (goal: string, extra: string) => {
    const config = loadLLMConfig();
    try {
      const combined = extra ? `${goal}\n附加信息：${extra}` : goal;
      const plan = await generateQuestPlan({ goal: combined, timeRange: "1week", intensity: "gentle" }, config, taskType);
      setDraft(plan);
    } catch {
      addNpc("抱歉，生成过程中出了点问题。要不我们重新试一次？");
    }
    setLoading(false);
  };

  const handleApply = () => { if (draft) { applyQuestPlan(draft); onClose(); } };
  const handleRegenerate = () => { setDraft(null); setMessages((prev) => [...prev, { role: "npc", content: "好的，我重新来。请描述你的目标。" }]); setTypeChosen(false); setUserGoal(""); setExtraInfo(""); };

  // If draft ready, show preview
  if (draft) {
    return <QuestPlanPreview plan={draft} onConfirm={handleApply} onClose={onClose} onRegenerate={handleRegenerate} />;
  }

  // Conversation UI
  const canSend = input.trim().length > 0 && !loading;

  // Detect if we're at "waiting for extra info" stage
  const waitingForExtra = !!userGoal && !draft && messages.length >= 4 && messages[messages.length - 1].role === "npc";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy/30 backdrop-blur-sm animate-fade">
      <div className="glass rounded-3xl shadow-2xl max-w-lg w-full max-h-[90vh] flex flex-col animate-scale">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-navy/5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/50 border border-white/60 flex items-center justify-center text-xl">{maro.avatar}</div>
            <div>
              <h3 className="text-sm font-black text-navy">{maro.name}</h3>
              <p className="text-[9px] font-bold text-coral uppercase tracking-widest">{maro.title}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-full hover:bg-navy/5 text-navy/40"><X size={16} /></button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {messages.map((m, i) => (
            <div key={i} className={`flex gap-2 ${m.role === "user" ? "flex-row-reverse" : ""}`}>
              {m.role === "npc" && (
                <div className="w-8 h-8 rounded-xl bg-white/40 flex items-center justify-center text-sm flex-shrink-0 mt-1">{maro.avatar}</div>
              )}
              <div className={`max-w-[80%] rounded-2xl px-3.5 py-2.5 ${m.role === "npc" ? "bg-white/35 border border-navy/5" : "bg-theme text-white"}`}>
                <p className={`text-[12px] leading-relaxed ${m.role === "npc" ? "text-navy/60 serif" : "font-medium"}`}>{m.content}</p>
              </div>
            </div>
          ))}

          {/* Type selector (only if not chosen yet) */}
          {!typeChosen && (
            <div className="grid grid-cols-2 gap-2 pt-2">
              {[
                { id: "main" as QuestGenType, label: "任务书" },
                { id: "daily" as QuestGenType, label: "日常任务" },
                { id: "side" as QuestGenType, label: "支线任务" },
                { id: "all" as QuestGenType, label: "全套任务线" },
              ].map((t) => (
                <button key={t.id} onClick={() => handleChooseType(t.id)}
                  className="flex items-center justify-center gap-1.5 p-3 rounded-2xl text-[11px] font-bold bg-white/30 text-navy/60 hover:bg-white/50 transition-all">
                  {t.label}
                </button>
              ))}
            </div>
          )}

          {/* Loading indicator */}
          {loading && !draft && (
            <div className="flex gap-2">
              <div className="w-8 h-8 rounded-xl bg-white/40 flex items-center justify-center text-sm flex-shrink-0 mt-1">{maro.avatar}</div>
              <div className="bg-white/35 border border-navy/5 rounded-2xl px-4 py-3 flex items-center gap-2">
                <Loader2 size={14} className="animate-spin text-navy/30" />
                <span className="text-[11px] text-navy/30">Maro 正在思考…</span>
              </div>
            </div>
          )}

          <div ref={endRef} />
        </div>

        {/* Input bar */}
        {typeChosen && !draft && (
          <div className="px-5 pb-5 pt-2 border-t border-navy/5 flex gap-2">
            <input
              className="input flex-1 !py-2 !text-[12px]"
              placeholder={waitingForExtra ? "回答 Maro…" : "描述你的目标…"}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter" && canSend) { if (waitingForExtra) handleSendExtra(); else handleSendGoal(); } }}
              disabled={loading}
            />
            <button
              className="btn btn-primary !py-2 !px-4 !text-[10px] flex-shrink-0"
              disabled={!canSend}
              onClick={waitingForExtra ? handleSendExtra : handleSendGoal}
            >
              <Send size={13} /> 发送
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
