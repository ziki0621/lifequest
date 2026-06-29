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

  const renderNavItem = (item: { id: string; label: string; icon: React.ComponentType<{ size?: number; strokeWidth?: number }> }) => {
    const Icon = item.icon;
    const active = currentPage === item.id;
    return (
      <button
        key={item.id}
        onClick={() => onNavigate(item.id)}
        className={`flex items-center gap-3 px-5 py-3 rounded-full font-bold transition-all duration-300 tracking-widest text-xs ${
          active
            ? "bg-white text-navy shadow-sm"
            : "text-navy/40 hover:text-navy hover:bg-white/20"
        }`}
      >
        <Icon size={17} strokeWidth={active ? 2.5 : 2} />
        <span>{item.label}</span>
      </button>
    );
  };

  return (
    <>
      {/* Desktop */}
      <aside className="hidden md:flex w-64 flex-col sticky top-0 h-screen p-6 z-10 border-r border-white/30 bg-white/20 backdrop-blur-sm">
        <div className="mb-10">
          <h1 className="text-xl font-black text-navy tracking-widest serif">地球生活指南</h1>
        </div>

        <nav className="flex-1 flex flex-col gap-1">
          {mainItems.map(renderNavItem)}

          {/* Settings — separated from main nav */}
          <div className="mt-4 pt-4 border-t border-navy/5">
            {renderNavItem({ id: "settings", label: "设置", icon: Settings })}
          </div>
        </nav>

        <div className="mt-auto pt-6 flex items-center gap-3">
          <PlayerAvatar level={player.level} title={player.title} size="sm" />
        </div>
      </aside>

      {/* Mobile bottom nav */}
      <nav className="md:hidden fixed bottom-4 left-4 right-4 bg-theme text-white rounded-full flex justify-around py-3 px-2 z-50 shadow-2xl shadow-navy/20">
        {mainItems.map((item) => {
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
        <button
          onClick={() => onNavigate("settings")}
          className={`p-2.5 rounded-full transition-colors ${currentPage === "settings" ? "bg-white/20" : "text-white/50"}`}
        >
          <Settings size={18} strokeWidth={currentPage === "settings" ? 2.5 : 2} />
        </button>
      </nav>
    </>
  );
}
