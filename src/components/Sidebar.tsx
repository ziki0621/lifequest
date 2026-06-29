import { Home, Map, BookOpen, User, Sparkles } from "lucide-react";
import { useApp } from "../hooks/useApp";

interface SidebarProps { currentPage: string; onNavigate: (page: string) => void; }

const items = [
  { id: "today", label: "今日", icon: Home },
  { id: "tasks", label: "任务", icon: Map },
  { id: "calendar", label: "日历", icon: Sparkles },
  { id: "journal", label: "日志", icon: BookOpen },
  { id: "character", label: "角色", icon: User },
];

export default function Sidebar({ currentPage, onNavigate }: SidebarProps) {
  const { state } = useApp();
  const { player } = state;

  return (
    <>
      {/* Desktop */}
      <aside className="hidden md:flex w-64 flex-col sticky top-0 h-screen p-6 z-10 border-r border-white/30 bg-white/20 backdrop-blur-sm">
        <div className="mb-10">
          <h1 className="text-xl font-black text-navy tracking-widest serif">人生支线</h1>
          <p className="text-[10px] font-bold text-navy/40 tracking-widest uppercase mt-0.5">LifeQuest</p>
        </div>

        <nav className="flex-1 flex flex-col gap-1">
          {items.map((item) => {
            const Icon = item.icon;
            const active = currentPage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`flex items-center gap-3 px-5 py-3 rounded-full font-bold transition-all duration-300 tracking-widest text-xs ${
                  active
                    ? "bg-white text-navy shadow-sm"
                    : "text-navy/40 hover:text-navy hover:bg-white/40"
                }`}
              >
                <Icon size={17} strokeWidth={active ? 2.5 : 2} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="mt-auto pt-6 flex items-center gap-3 cursor-pointer group">
          <div className="w-10 h-10 rounded-full bg-coral/10 flex items-center justify-center">
            <User size={16} className="text-coral" />
          </div>
          <div>
            <div className="font-bold text-navy text-xs tracking-wide">{player.name}</div>
            <div className="text-[10px] font-bold text-coral tracking-wider">Lv.{player.level} · {player.title}</div>
          </div>
        </div>
      </aside>

      {/* Mobile bottom nav */}
      <nav className="md:hidden fixed bottom-4 left-4 right-4 bg-navy text-white rounded-full flex justify-around py-3 px-2 z-50 shadow-2xl shadow-navy/20">
        {items.slice(0, 5).map((item) => {
          const Icon = item.icon;
          const active = currentPage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`p-2.5 rounded-full transition-colors ${active ? "bg-white/20" : "text-white/50"}`}
            >
              <Icon size={18} strokeWidth={active ? 2.5 : 2} />
            </button>
          );
        })}
      </nav>
    </>
  );
}
