import {
  Home,
  ListTodo,
  Calendar,
  BookOpen,
  User,
} from "lucide-react";

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
  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden md:flex flex-col w-56 bg-white/60 backdrop-blur-sm border-r border-sage-light/50 min-h-screen p-4 gap-1">
        <div className="mb-6 px-3 py-2">
          <h1 className="text-lg font-semibold text-text-primary tracking-tight">
            ⚔️ 人生支线
          </h1>
          <p className="text-xs text-text-muted mt-0.5">LifeQuest</p>
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = currentPage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
                active
                  ? "bg-sage-light text-sage-dark shadow-sm"
                  : "text-text-secondary hover:bg-cream-dark/50 hover:text-text-primary"
              }`}
            >
              <Icon size={18} />
              {item.label}
            </button>
          );
        })}
        <div className="mt-auto pt-4">
          <p className="text-xs text-text-muted px-3">
            把现实生活变成
            <br />
            一场温和的 RPG。
          </p>
        </div>
      </aside>

      {/* Mobile bottom tab bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md border-t border-sage-light/50 z-50 flex justify-around py-2 px-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = currentPage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`flex flex-col items-center gap-0.5 px-3 py-1 rounded-lg text-xs transition-all ${
                active
                  ? "text-sage-dark font-medium"
                  : "text-text-muted"
              }`}
            >
              <Icon size={20} />
              {item.label}
            </button>
          );
        })}
      </nav>
    </>
  );
}
