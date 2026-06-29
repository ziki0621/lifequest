import { useState } from "react";
import { X } from "lucide-react";
import type { QuestStage } from "../types";

interface Props { onClose: () => void; onCreate: (stage: Omit<QuestStage, "id">) => void; }

export default function CreateStageModal({ onClose, onCreate }: Props) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [anchorDate, setAnchorDate] = useState("");

  const handleSubmit = () => {
    if (!title.trim()) return;
    onCreate({ title: title.trim(), description: description.trim() || undefined, anchorDate: anchorDate || undefined, completed: false, order: 0 });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy/30 backdrop-blur-sm animate-fade">
      <div className="glass rounded-3xl shadow-2xl max-w-sm w-full animate-scale p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-black text-navy serif">添加阶段</h3>
          <button onClick={onClose} className="p-1.5 rounded-full hover:bg-navy/5 text-navy/40"><X size={16} /></button>
        </div>
        <div>
          <label className="text-[9px] font-bold text-navy/30 uppercase tracking-widest block mb-1.5">阶段名称 <span className="text-coral">*</span></label>
          <input value={title} onChange={(e) => setTitle(e.target.value)}
            placeholder="例如：调整作息" className="input" />
        </div>
        <div>
          <label className="text-[9px] font-bold text-navy/30 uppercase tracking-widest block mb-1.5">描述</label>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)}
            placeholder="简短描述…" rows={2} className="input" />
        </div>
        <div>
          <label className="text-[9px] font-bold text-navy/30 uppercase tracking-widest block mb-1.5">时间锚点（可选）</label>
          <input type="date" value={anchorDate} onChange={(e) => setAnchorDate(e.target.value)} className="input" />
        </div>
        <button onClick={handleSubmit} disabled={!title.trim()}
          className="btn btn-primary w-full !rounded-full disabled:opacity-30">添加阶段</button>
      </div>
    </div>
  );
}
