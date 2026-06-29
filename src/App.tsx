import { useState, useCallback } from "react";
import { AppProvider } from "./AppContext";
import { useApp } from "./hooks/useApp";
import Layout from "./components/Layout";
import TodayPage from "./pages/TodayPage";
import TasksPage from "./pages/TasksPage";
import CalendarPage from "./pages/CalendarPage";
import JournalPage from "./pages/JournalPage";
import CharacterPage from "./pages/CharacterPage";
import SettingsPage from "./pages/SettingsPage";
import { Sparkles, Trophy, Zap, Target, BookOpen, ArrowRight } from "lucide-react";
import type { ThemeConfig } from "./utils/theme";

const WELCOMED_KEY = "earthguide-welcomed";

function AppContent() {
  const [page, setPage] = useState("today");
  const { newlyUnlocked, clearNewlyUnlocked, theme } = useApp();
  const [showWelcome, setShowWelcome] = useState(() => !localStorage.getItem(WELCOMED_KEY));

  const handleStart = useCallback(() => {
    localStorage.setItem(WELCOMED_KEY, "1");
    setShowWelcome(false);
  }, []);

  if (showWelcome) return <WelcomeScreen onStart={handleStart} theme={theme} />;

  return (
    <Layout currentPage={page} onNavigate={setPage}>
      {page === "today" && <TodayPage />}
      {page === "tasks" && <TasksPage />}
      {page === "calendar" && <CalendarPage />}
      {page === "journal" && <JournalPage />}
      {page === "character" && <CharacterPage />}
      {page === "settings" && <SettingsPage />}

      {newlyUnlocked.length > 0 && (
        <div className="fixed bottom-24 md:bottom-6 left-4 right-4 md:left-auto md:right-6 md:w-72 z-50 space-y-2">
          {newlyUnlocked.map((a) => (
            <div key={a.id} className="glass rounded-2xl shadow-xl p-3 flex items-center gap-3 animate-slide border border-coral/20">
              <div className="w-9 h-9 rounded-full bg-coral text-white flex items-center justify-center flex-shrink-0">
                <Trophy size={15} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[9px] font-bold text-navy/40 uppercase tracking-widest">成就解锁</p>
                <p className="text-[11px] font-black text-navy truncate">{a.title}</p>
              </div>
              <button onClick={clearNewlyUnlocked} className="text-navy/30 hover:text-navy text-xs">✕</button>
            </div>
          ))}
        </div>
      )}
    </Layout>
  );
}

function WelcomeScreen({ onStart, theme }: { onStart: () => void; theme: ThemeConfig }) {
  return (
    <div className="min-h-screen flex items-center justify-center relative p-6" style={{ background: theme.bg }}>
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10" style={{ background: theme.bg }}>
        <div className="absolute -top-[10%] -right-[5%] w-[60vw] h-[60vw] rounded-full mix-blend-multiply blur-[80px] opacity-70 animate-pulse" style={{ background: theme.blob1, animationDuration: "8s" }} />
        <div className="absolute -bottom-[10%] -left-[10%] w-[50vw] h-[50vw] rounded-full mix-blend-multiply blur-[80px] opacity-60 animate-pulse" style={{ background: theme.blob2, animationDuration: "12s" }} />
        <div className="absolute top-[30%] left-[20%] w-[70vw] h-[40vw] rounded-[100%] mix-blend-multiply blur-[100px] opacity-50 rotate-12" style={{ background: theme.blob3 }} />
      </div>
      <div className="relative z-10 text-center max-w-sm animate-scale">
        <div className="w-16 h-16 mx-auto rounded-2xl bg-navy text-white flex items-center justify-center mb-6 shadow-xl shadow-navy/20">
          <Sparkles size={26} />
        </div>
        <h1 className="text-3xl font-black text-navy tracking-tight serif mb-1">地球生活指南</h1>
        <p className="text-[10px] font-bold text-coral uppercase tracking-widest">Earth Life Guide</p>
        <p className="text-[14px] text-navy/60 font-medium leading-relaxed serif mt-6">把现实生活变成一场温和的 RPG。</p>
        <div className="mt-8 space-y-3 text-left">
          <Feature icon={<Target size={14} />} color="text-navy" text="主线任务：分阶段推进，做成时间线，完成每个阶段" />
          <Feature icon={<Zap size={14} />} color="text-coral" text="日常任务：循环打卡，追踪每周/每月的完成进度" />
          <Feature icon={<BookOpen size={14} />} color="text-leaf" text="支线任务：一次完成，记录生活中的小冒险" />
        </div>
        <button onClick={onStart}
          className="btn btn-primary w-full mt-10 !py-3.5 !text-[13px] !tracking-widest shadow-xl shadow-navy/20">
          开始今天的生活冒险 <ArrowRight size={16} />
        </button>
        <p className="text-[10px] font-bold text-navy/20 uppercase tracking-widest mt-4">没有 KPI，没有压力，只是一个温柔的陪伴。</p>
      </div>
    </div>
  );
}

function Feature({ icon, color, text }: { icon: React.ReactNode; color: string; text: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className={`w-8 h-8 rounded-full bg-white/60 flex items-center justify-center flex-shrink-0 ${color}`}>{icon}</div>
      <span className="text-[12px] text-navy/70 font-medium leading-snug">{text}</span>
    </div>
  );
}

export default function App() {
  return <AppProvider><AppContent /></AppProvider>;
}
