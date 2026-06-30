import { useState } from "react";
import { X } from "lucide-react";
import type { QuestLine, QuestStage } from "../types";
import { genId } from "../utils/id";

interface Props { bookId: string; onClose: () => void; onCreate: (bookId: string, ql: Omit<QuestLine, "id">) => void; }

export default function CreateQuestLineModal({ bookId, onClose, onCreate }: Props) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [stageList, setStageList] = useState<{ id: string; title: string }[]>([{ id: genId(), title: "" }]);

  const addStage = () => setStageList([...stageList, { id: genId(), title: "" }]);
  const removeStage = (id: string) => { if (stageList.length <= 1) return; setStageList(stageList.filter((s) => s.id !== id)); };
  const updateStage = (id: string, value: string) => setStageList(stageList.map((s) => s.id === id ? { ...s, title: value } : s));

  const handleSubmit = () => {
    if (!title.trim()) return;
    const stages: QuestStage[] = stageList.filter((s) => s.title.trim()).map((s, i) => ({ id: genId(), title: s.title.trim(), completed: false, order: i }));
    if (stages.length === 0) return;
    onCreate(bookId, { title: title.trim(), description: description.trim(), stages });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 modal-backdrop animate-fade">
      <div className="wireframe max-w-md w-full max-h-[90vh] overflow-y-auto animate-scale p-6 space-y-4">
        <div className="flex items-center justify-between"><h3 className="text-sm font-black text-ink serif">添加任务线</h3><button onClick={onClose} className="p-1.5  hover:bg-ink/5 text-ink/40"><X size={16} /></button></div>
        <F label="任务线名称" required><input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="例如：作息调整" className="wireframe-input" /></F>
        <F label="描述"><textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={2} className="wireframe-input" /></F>
        <div>
          <label className="text-[9px] font-bold text-ink/30 uppercase tracking-widest block mb-2">阶段列表</label>
          <div className="space-y-2">{stageList.map((s, i) => (
            <div key={s.id} className="flex items-center gap-2"><span className="text-[10px] font-bold text-ink/20 w-5">{i + 1}.</span><input value={s.title} onChange={(e) => updateStage(s.id, e.target.value)} placeholder={`阶段 ${i + 1}`} className="input flex-1 !py-2 !text-[11px]" /><button onClick={() => removeStage(s.id)} className="text-ink/20 hover:text-coral text-xs">✕</button></div>
          ))}</div>
          <button onClick={addStage} className="text-[10px] font-bold text-coral mt-2">+ 添加阶段</button>
        </div>
        <button onClick={handleSubmit} disabled={!title.trim()} className="wireframe-btn">添加任务线</button>
      </div>
    </div>
  );
}
function F({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) { return <div><label className="text-[9px] font-bold text-ink/30 uppercase tracking-widest block mb-1.5">{label}{required && <span className="text-coral ml-0.5">*</span>}</label>{children}</div>; }
