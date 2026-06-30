import { useState } from "react";
import { X } from "lucide-react";

interface Props { bookId: string; onClose: () => void; onCreate: (bookId: string, task: { title: string; description?: string; completed: boolean }) => void; }

export default function CreateQuestBookTaskModal({ bookId, onClose, onCreate }: Props) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const handleSubmit = () => { if (!title.trim()) return; onCreate(bookId, { title: title.trim(), description: description.trim() || undefined, completed: false }); onClose(); };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy/30 backdrop-blur-sm animate-fade">
      <div className="glass rounded-3xl shadow-2xl max-w-sm w-full animate-scale p-6 space-y-4">
        <div className="flex items-center justify-between"><h3 className="text-sm font-black text-navy serif">添加直接任务</h3><button onClick={onClose} className="p-1.5 rounded-full hover:bg-navy/5 text-navy/40"><X size={16} /></button></div>
        <div><label className="text-[9px] font-bold text-navy/30 uppercase tracking-widest block mb-1.5">任务名称 <span className="text-coral">*</span></label><input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="例如：睡前写三句话日记" className="input" /></div>
        <div><label className="text-[9px] font-bold text-navy/30 uppercase tracking-widest block mb-1.5">描述</label><textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={2} className="input" /></div>
        <button onClick={handleSubmit} disabled={!title.trim()} className="btn btn-primary w-full !rounded-full disabled:opacity-30">添加任务</button>
      </div>
    </div>
  );
}
