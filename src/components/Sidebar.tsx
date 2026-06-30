import { Home, Map, BookOpen, User, Sparkles, Settings } from "lucide-react";
import { useApp } from "../hooks/useApp";
import PlayerAvatar from "./PlayerAvatar";

interface SidebarProps { currentPage: string; onNavigate: (page: string) => void; }

const mainItems = [
  { id: "today", label: "今日", icon: Home },
  { id: "tasks", label: "任务", icon: Map },
  { id: "calendar", label: "日历", icon: Sparkles },
  { id: "journal", label: "日志", icon: BookOpen },
  { id: "character", label: "角色", icon: User },
];

export default function Sidebar({ currentPage, onNavigate }: SidebarProps) {
  const { state } = useApp();
  const { player } = state;

  const renderItem = (item: { id: string; label: string; icon: React.ComponentType<{ size?: number; strokeWidth?: number }> }) => {
    const Icon = item.icon;
    const active = currentPage === item.id;
    return (
      <button key={item.id} onClick={() => onNavigate(item.id)}
        className={`w-full text-left px-4 py-2.5 text-[11px] font-bold tracking-widest uppercase transition-all flex items-center gap-3 border-[1.5px] shadow-[1px_1px_0px_rgba(74,59,44,0.1)] ${
          active
            ? "border-ink bg-parchment-dark text-ink"
            : "border-ink/20 bg-transparent text-ink/40 hover:text-ink hover:border-ink/40"
        }`}
      >
        <Icon size={15} strokeWidth={active ? 2.5 : 2} />
        {item.label}
      </button>
    );
  };

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden md:flex w-60 flex-col sticky top-0 h-screen p-5 z-10 border-r-[1.5px] border-ink/20 bg-parchment/80 backdrop-blur-sm gap-1">
        <div className="mb-8 pt-2">
          <h1 className="text-lg font-black text-ink tracking-widest serif">地球生活指南</h1>
          <div className="flex items-center gap-2 mt-2 text-[8px] font-bold tracking-[0.2em] uppercase text-ink/40">
            <span className="text-[6px]">◇</span><div className="h-px bg-ink/30 flex-1" /><span className="text-[6px]">◇</span>
          </div>
        </div>

        <nav className="flex-1 flex flex-col gap-1">
          {mainItems.map(renderItem)}
          <div className="mt-4 pt-4 border-t-[0.5px] border-ink/15">
            {renderItem({ id: "settings", label: "设置", icon: Settings })}
          </div>
        </nav>

        <div className="mt-auto pt-6 flex items-center gap-3 border-t-[0.5px] border-ink/15">
          <PlayerAvatar level={player.level} title={player.title} size="sm" />
        </div>
      </aside>

      {/* Mobile bottom nav */}
      <nav className="md:hidden fixed bottom-3 left-3 right-3 z-50 border-[1.5px] border-ink bg-parchment shadow-[2px_2px_0px_rgba(74,59,44,0.15)] flex justify-around py-2.5 px-1">
        {mainItems.map((item) => {
          const Icon = item.icon;
          const active = currentPage === item.id;
          return (
            <button key={item.id} onClick={() => onNavigate(item.id)}
              className={`p-2 transition-all ${active ? "text-ink" : "text-ink/30 hover:text-ink/60"}`}>
              <Icon size={17} strokeWidth={active ? 2.5 : 2} />
            </button>
          );
        })}
        <button onClick={() => onNavigate("settings")}
          className={`p-2 transition-all ${currentPage === "settings" ? "text-ink" : "text-ink/30 hover:text-ink/60"}`}>
          <Settings size={17} strokeWidth={currentPage === "settings" ? 2.5 : 2} />
        </button>
      </nav>
    </>
  );
}
