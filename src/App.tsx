import { useState, useCallback } from "react";
import { AppProvider, useApp } from "./AppContext";
import Layout from "./components/Layout";
import TodayPage from "./pages/TodayPage";
import TasksPage from "./pages/TasksPage";
import CalendarPage from "./pages/CalendarPage";
import JournalPage from "./pages/JournalPage";
import CharacterPage from "./pages/CharacterPage";
import { Trophy } from "lucide-react";

function AppContent() {
  const [page, setPage] = useState("today");
  const { newlyUnlocked, clearNewlyUnlocked } = useApp();

  // 首次进入欢迎
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

      {/* 成就解锁 Toast */}
      {newlyUnlocked.length > 0 && (
        <div className="fixed bottom-24 md:bottom-6 left-4 right-4 md:left-auto md:right-6 md:w-80 z-50 space-y-2">
          {newlyUnlocked.map((a) => (
            <div
              key={a.id}
              className="bg-white rounded-xl shadow-lg border border-warm-gold/30 p-3 flex items-center gap-3 animate-bounce-in"
            >
              <div className="w-10 h-10 bg-warm-gold-light rounded-xl flex items-center justify-center flex-shrink-0">
                <Trophy size={20} className="text-warm-gold" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-text-primary">成就解锁</p>
                <p className="text-xs text-warm-gold font-medium truncate">{a.title}</p>
              </div>
              <button
                onClick={clearNewlyUnlocked}
                className="text-text-muted hover:text-text-primary text-xs"
              >
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
    <div className="min-h-screen flex items-center justify-center bg-cream p-4">
      <div className="text-center max-w-sm">
        <div className="text-6xl mb-4">⚔️</div>
        <h1 className="text-2xl font-bold text-text-primary mb-2">人生支线</h1>
        <p className="text-sm text-warm-gold font-medium mb-1">LifeQuest</p>
        <p className="text-text-secondary text-sm leading-relaxed mt-4">
          把现实生活变成一场温和的 RPG。
        </p>
        <p className="text-text-muted text-xs mt-2 leading-relaxed">
          完成生活中的小事，获得经验，提升属性，
          <br />
          一点点经营自己的现实生活。
        </p>
        <button
          onClick={onStart}
          className="mt-8 px-8 py-3 bg-sage text-white rounded-2xl text-base font-medium hover:bg-sage-dark transition-all active:scale-95 shadow-md hover:shadow-lg"
        >
          开始今天的生活冒险
        </button>
      </div>
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
