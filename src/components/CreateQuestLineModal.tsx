import { useState } from "react";
import { X } from "lucide-react";
import type { QuestLine, LifeDomain } from "../types";
import { DOMAIN_LABELS, DOMAIN_EMOJI } from "../types";

interface CreateQuestLineModalProps {
  onClose: () => void;
  onCreate: (ql: Omit<QuestLine, "id" | "createdAt">) => void;
}

export default function CreateQuestLineModal({ onClose, onCreate }: CreateQuestLineModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [domain, setDomain] = useState<LifeDomain>("mind");

  const domains: LifeDomain[] = ["body", "mind", "relationship", "home", "exploration", "interest", "learning", "career", "finance"];

  const handleSubmit = () => {
    if (!title.trim()) return;
    onCreate({
      title: title.trim(),
      description: description.trim(),
      domain,
      status: "active",
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/20 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl max-w-md w-full">
        <div className="p-5 border-b border-sage-light/30 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-text-primary">🗺️ 创建主线</h3>
          <button onClick={onClose} className="text-text-muted hover:text-text-primary">
            <X size={20} />
          </button>
        </div>
        <div className="p-5 space-y-4">
          <div>
            <label className="text-xs text-text-muted block mb-1">主线名称 *</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="例如：找回稳定生活节奏"
              className="w-full rounded-xl border border-sage-light/40 bg-cream/50 px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-sage focus:ring-1 focus:ring-sage-light"
            />
          </div>
          <div>
            <label className="text-xs text-text-muted block mb-1">描述</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="这条主线是关于什么的？"
              rows={2}
              className="w-full rounded-xl border border-sage-light/40 bg-cream/50 px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-sage focus:ring-1 focus:ring-sage-light resize-none"
            />
          </div>
          <div>
            <label className="text-xs text-text-muted block mb-1">所属生活领域</label>
            <select
              value={domain}
              onChange={(e) => setDomain(e.target.value as LifeDomain)}
              className="w-full rounded-xl border border-sage-light/40 bg-cream/50 px-3 py-2 text-sm text-text-primary focus:outline-none focus:border-sage"
            >
              {domains.map((d) => (
                <option key={d} value={d}>{DOMAIN_EMOJI[d]} {DOMAIN_LABELS[d]}</option>
              ))}
            </select>
          </div>
          <button
            onClick={handleSubmit}
            disabled={!title.trim()}
            className="w-full py-2.5 rounded-xl text-sm font-medium bg-sage text-white hover:bg-sage-dark disabled:bg-sage-light/40 disabled:text-text-muted transition-all active:scale-[0.98]"
          >
            创建主线
          </button>
        </div>
      </div>
    </div>
  );
}
