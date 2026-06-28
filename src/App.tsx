import { useState, useCallback } from "react";
import { AppProvider } from "./AppContext";
import { useApp } from "./hooks/useApp";
import Layout from "./components/Layout";
import TodayPage from "./pages/TodayPage";
import TasksPage from "./pages/TasksPage";
import CalendarPage from "./pages/CalendarPage";
import JournalPage from "./pages/JournalPage";
import CharacterPage from "./pages/CharacterPage";
import { Sparkles, Trophy, ArrowRight, Target, BookOpen } from "lucide-react";

function AppContent() {
  const [page, setPage] = useState("today");
  const { newlyUnlocked, clearNewlyUnlocked } = useApp();

  const [showWelcome, setShowWelcome] = useState(() => {
    return !localStorage.getItem("lifequest-welcomed");
  });

  const handleStart = useCallback(() => {
    localStorage.setItem("lifequest-welcomed", "1");
    setShowWelcome(false);
  }, []);

  if (showWelcome) {
    return <WelcomeScreen onStart={handleStart} />;
  }

  return (
    <Layout currentPage={page} onNavigate={setPage}>
      {page === "today" && <TodayPage />}
      {page === "tasks" && <TasksPage />}
      {page === "calendar" && <CalendarPage />}
      {page === "journal" && <JournalPage />}
      {page === "character" && <CharacterPage />}

      {/* Achievement toast */}
      {newlyUnlocked.length > 0 && (
        <div className="fixed bottom-24 md:bottom-6 left-4 right-4 md:left-auto md:right-6 md:w-72 z-50 space-y-2">
          {newlyUnlocked.map((a) => (
            <div
              key={a.id}
              className="bg-bg-elevated border border-gold/20 rounded-xl shadow-xl shadow-gold/5 p-3 flex items-center gap-3 animate-slide-right backdrop-blur-xl"
            >
              <div className="w-9 h-9 rounded-lg bg-gold-surface/30 flex items-center justify-center flex-shrink-0">
                <Trophy size={15} className="text-gold" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] text-text-muted font-medium uppercase tracking-wider">成就解锁</p>
                <p className="text-[11px] text-gold font-semibold truncate">{a.title}</p>
              </div>
              <button onClick={clearNewlyUnlocked} className="text-text-muted hover:text-text-primary text-[10px]">
                ✕
              </button>
            </div>
          ))}
        </div>
      )}
    </Layout>
  );
}

function WelcomeScreen({ onStart }: { onStart: () => void }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-bg-deep p-6">
      <div className="text-center max-w-sm animate-scale">
        {/* Logo */}
        <div className="w-16 h-16 mx-auto rounded-2xl bg-accent-surface flex items-center justify-center ring-1 ring-accent/20 mb-6">
          <Sparkles size={28} className="text-accent" />
        </div>

        <h1 className="text-2xl font-bold text-text-primary tracking-tight mb-1">
          LifeQuest
        </h1>
        <p className="text-[11px] text-accent font-medium uppercase tracking-widest">
          人生支线
        </p>

        <p className="text-[13px] text-text-secondary leading-relaxed mt-6">
          把现实生活变成一场温和的 RPG。
        </p>

        <div className="mt-8 space-y-3 text-left">
          <Feature icon={<Sparkles size={14} />} color="text-accent" text="完成生活中的小事，获得经验与成长" />
          <Feature icon={<Target size={14} />} color="text-green" text="提升七种生活属性，解锁专属成就" />
          <Feature icon={<BookOpen size={14} />} color="text-purple" text="记录每一天的感受，留下生活痕迹" />
        </div>

        <button
          onClick={onStart}
          className="mt-10 w-full py-3 bg-accent hover:bg-accent-soft text-white rounded-xl text-[13px] font-semibold tracking-wide transition-all active:scale-[0.98] shadow-lg shadow-accent-glow flex items-center justify-center gap-2"
        >
          开始今天的生活冒险
          <ArrowRight size={16} />
        </button>

        <p className="text-[10px] text-text-muted mt-4">
          没有 KPI，没有压力，只是一个温柔的陪伴。
        </p>
      </div>
    </div>
  );
}

function Feature({ icon, color, text }: { icon: React.ReactNode; color: string; text: string }) {
  return (
    <div className="flex items-center gap-2.5">
      <div className={`w-7 h-7 rounded-lg bg-bg-glass flex items-center justify-center flex-shrink-0 ${color}`}>
        {icon}
      </div>
      <span className="text-[11px] text-text-secondary">{text}</span>
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
