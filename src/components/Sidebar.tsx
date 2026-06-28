import {
  Home, ListTodo, Calendar, BookOpen, User, Sparkles,
} from "lucide-react";
import { useApp } from "../hooks/useApp";

interface SidebarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

const navItems = [
  { id: "today", label: "今日", icon: Home },
  { id: "tasks", label: "任务", icon: ListTodo },
  { id: "calendar", label: "日历", icon: Calendar },
  { id: "journal", label: "日志", icon: BookOpen },
  { id: "character", label: "角色", icon: User },
];

export default function Sidebar({ currentPage, onNavigate }: SidebarProps) {
  const { state } = useApp();
  const { player } = state;

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden md:flex flex-col w-56 min-h-screen bg-bg-elevated/80 backdrop-blur-xl border-r border-border-subtle p-4 gap-1">
        {/* Logo */}
        <div className="mb-8 px-3 pt-2">
          <div className="flex items-center gap-2.5 mb-2">
            <div className="w-8 h-8 rounded-lg bg-accent-surface flex items-center justify-center ring-1 ring-accent/20">
              <Sparkles size={16} className="text-accent" />
            </div>
            <div>
              <h1 className="text-sm font-semibold text-text-primary tracking-tight leading-none">
                LifeQuest
              </h1>
              <p className="text-[10px] text-text-muted mt-0.5 leading-none">人生支线</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex flex-col gap-0.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = currentPage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium transition-all duration-200 ${
                  active
                    ? "bg-accent-surface text-accent ring-1 ring-accent/20"
                    : "text-text-secondary hover:bg-bg-glass hover:text-text-primary"
                }`}
              >
                <Icon size={15} strokeWidth={active ? 2 : 1.5} />
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Player mini */}
        <div className="mt-auto pt-6">
          <div className="px-3 py-3 rounded-lg bg-bg-glass border border-border-subtle">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-full bg-accent-surface flex items-center justify-center">
                <User size={12} className="text-accent" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[11px] text-text-primary font-medium truncate leading-none">
                  {player.name}
                </p>
                <p className="text-[10px] text-text-muted mt-0.5 leading-none">
                  Lv.{player.level} · {player.title}
                </p>
              </div>
            </div>
          </div>
          <p className="text-[10px] text-text-muted mt-3 px-3 leading-relaxed">
            把现实生活变成一场温和的 RPG。
          </p>
        </div>
      </aside>

      {/* Mobile bottom tab bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-bg-elevated/90 backdrop-blur-xl border-t border-border-subtle z-50 flex justify-around py-2.5 px-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = currentPage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`flex flex-col items-center gap-1 px-3 py-1 rounded-md text-[10px] transition-all ${
                active ? "text-accent font-medium" : "text-text-muted"
              }`}
            >
              <Icon size={18} strokeWidth={active ? 2 : 1.5} />
              {item.label}
            </button>
          );
        })}
      </nav>
    </>
  );
}
