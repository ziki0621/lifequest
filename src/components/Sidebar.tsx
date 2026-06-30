import { Home, Map, BookOpen, User, Sparkles, Settings } from "lucide-react";
import { useApp } from "../hooks/useApp";
import PlayerAvatar from "./PlayerAvatar";

interface SidebarProps { currentPage: string; onNavigate: (page: string) => void; }
const mainItems = [
  { id: "today", label: "今日", icon: Home }, { id: "tasks", label: "任务", icon: Map },
  { id: "calendar", label: "日历", icon: Sparkles }, { id: "journal", label: "日志", icon: BookOpen },
  { id: "character", label: "角色", icon: User },
];

export default function Sidebar({ currentPage, onNavigate }: SidebarProps) {
  const { state } = useApp(); const { player } = state;
  const renderItem = (item: { id: string; label: string; icon: any }) => { const Icon = item.icon; const a = currentPage === item.id;
    return <button key={item.id} onClick={() => onNavigate(item.id)}
      className={`w-full text-left px-4 py-2.5 text-[11px] font-bold tracking-widest uppercase flex items-center gap-3 border-[1.5px] shadow-[1px_1px_0px_rgba(74,59,44,0.1)] transition-all ${
        a ? "border-[#4A3B2C] bg-[#E3D4BB] text-[#4A3B2C]" : "border-[#4A3B2C]/20 bg-transparent text-[#4A3B2C]/40 hover:text-[#4A3B2C] hover:border-[#4A3B2C]/40"}`}>
      <Icon size={15} strokeWidth={a ? 2.5 : 2} />{item.label}</button>;
  };

  return (<>
    <aside className="hidden md:flex w-60 flex-col sticky top-0 h-screen p-5 z-10 border-r-[1.5px] border-[#4A3B2C]/20 bg-[#F3EAD5]/80 backdrop-blur-sm gap-1">
      <div className="mb-8 pt-2"><h1 className="text-lg font-black text-[#4A3B2C] tracking-widest serif">地球生活指南</h1>
        <div className="flex items-center gap-2 mt-2 text-[8px] font-bold tracking-[0.2em] uppercase text-[#4A3B2C]/40"><span className="text-[6px]">◇</span><div className="h-px bg-[#4A3B2C]/30 flex-1" /><span className="text-[6px]">◇</span></div>
      </div>
      <nav className="flex-1 flex flex-col gap-1">{mainItems.map(renderItem)}<div className="mt-4 pt-4 border-t-[0.5px] border-[#4A3B2C]/15">{renderItem({ id: "settings", label: "设置", icon: Settings })}</div></nav>
      <div className="mt-auto pt-6 flex items-center gap-3 border-t-[0.5px] border-[#4A3B2C]/15"><PlayerAvatar level={player.level} title={player.title} size="sm" /></div>
    </aside>
    <nav className="md:hidden fixed bottom-3 left-3 right-3 z-50 border-[1.5px] border-[#4A3B2C] bg-[#F3EAD5] shadow-[2px_2px_0px_rgba(74,59,44,0.15)] flex justify-around py-2.5 px-1">
      {mainItems.map((item) => { const Icon = item.icon; const a = currentPage === item.id; return <button key={item.id} onClick={() => onNavigate(item.id)} className={`p-2 transition-all ${a ? "text-[#4A3B2C]" : "text-[#4A3B2C]/30"}`}><Icon size={17} strokeWidth={a ? 2.5 : 2} /></button>; })}
      <button onClick={() => onNavigate("settings")} className={`p-2 transition-all ${currentPage === "settings" ? "text-[#4A3B2C]" : "text-[#4A3B2C]/30"}`}><Settings size={17} strokeWidth={currentPage === "settings" ? 2.5 : 2} /></button>
    </nav>
  </>);
}
