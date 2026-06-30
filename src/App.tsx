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
import OnboardingFlow from "./components/OnboardingFlow";
import { Sparkles, Trophy, Zap, Target, BookOpen, ArrowRight, Undo2 } from "lucide-react";

const WELCOMED_KEY = "earthguide-welcomed";
const ONBOARDING_KEY = "earthguide-onboarded";

function AppContent() {
  const [page, setPage] = useState("today");
  const { newlyUnlocked, clearNewlyUnlocked, lastUndoLabel, undoLastMutation } = useApp();
  const [showWelcome, setShowWelcome] = useState(() => !localStorage.getItem(WELCOMED_KEY));
  const [showOnboarding, setShowOnboarding] = useState(() => !!localStorage.getItem(WELCOMED_KEY) && !localStorage.getItem(ONBOARDING_KEY));

  const handleStart = useCallback(() => { localStorage.setItem(WELCOMED_KEY, "1"); setShowWelcome(false); setShowOnboarding(true); }, []);
  const handleOnboardingFinish = useCallback(() => { localStorage.setItem(ONBOARDING_KEY, "1"); setShowOnboarding(false); }, []);
  const handleOnboardingSkip = useCallback(() => { localStorage.setItem(ONBOARDING_KEY, "1"); setShowOnboarding(false); }, []);
  const handleOnboardingGenerate = useCallback(() => { localStorage.setItem(ONBOARDING_KEY, "1"); setShowOnboarding(false); setPage("tasks"); }, []);

  if (showWelcome) return <WelcomeScreen onStart={handleStart} />;
  if (showOnboarding) return <OnboardingFlow onFinish={handleOnboardingFinish} onSkip={handleOnboardingSkip} onGenerate={handleOnboardingGenerate} />;

  return (
    <Layout currentPage={page} onNavigate={setPage}>
      {page === "today" && <TodayPage />}{page === "tasks" && <TasksPage />}{page === "calendar" && <CalendarPage />}{page === "journal" && <JournalPage />}{page === "character" && <CharacterPage />}{page === "settings" && <SettingsPage />}

      {newlyUnlocked.length > 0 && (<div className="fixed bottom-24 md:bottom-6 left-4 right-4 md:left-auto md:right-6 md:w-72 z-50 space-y-2">{newlyUnlocked.map((a) => (
        <div key={a.id} className="wireframe animate-slide"><div className="wireframe-inner p-3 flex items-center gap-3"><div className="w-8 h-8 border-[1.5px] border-ink bg-ink text-parchment flex items-center justify-center flex-shrink-0"><Trophy size={14} /></div><div className="flex-1 min-w-0"><p className="text-[9px] font-bold text-ink/40 uppercase tracking-widest">成就解锁</p><p className="text-[11px] font-black text-ink truncate">{a.title}</p></div><button onClick={clearNewlyUnlocked} className="text-ink/30 hover:text-ink text-xs">✕</button></div></div>
      ))}</div>)}

      {lastUndoLabel && (<div className="fixed bottom-24 md:bottom-6 left-1/2 -translate-x-1/2 z-50 animate-slide"><div className="wireframe"><div className="wireframe-inner px-4 py-2.5 flex items-center gap-3"><span className="text-[11px] font-bold text-ink">{lastUndoLabel}</span>
        <div className="chamfer-btn h-7" onClick={undoLastMutation}><div className="chamfer-outer"><div className="chamfer-gap"><div className="chamfer-inner"><div className="chamfer-core px-2"><Undo2 size={11} /><span className="text-[9px] font-bold ml-1">撤销</span></div></div></div></div></div></div></div></div>)}
    </Layout>
  );
}

function WelcomeScreen({ onStart }: { onStart: () => void }) {
  return (
    <div className="min-h-screen flex items-center justify-center relative bg-parchment p-6">
      <div className="parchment-bg" />
      <div className="relative z-10 text-center max-w-sm animate-scale">
        <div className="w-16 h-16 mx-auto border-[1.5px] border-ink bg-ink text-parchment flex items-center justify-center mb-6 shadow-[2px_2px_0px_rgba(74,59,44,0.15)]"><Sparkles size={26} /></div>
        <h1 className="text-3xl font-black text-ink tracking-tight serif mb-1">地球生活指南</h1>
        <p className="text-[10px] font-bold text-coral uppercase tracking-widest">Earth Life Guide</p>
        <p className="text-[14px] text-ink/60 font-medium leading-relaxed serif mt-6">把现实生活变成一场温和的 RPG。</p>
        <div className="mt-8 space-y-3 text-left">{[
          { icon: <Target size={14} />, text: "主线任务：分阶段推进，做成时间线" },
          { icon: <Zap size={14} />, text: "日常任务：循环打卡，追踪完成进度" },
          { icon: <BookOpen size={14} />, text: "支线任务：一次完成的小冒险" },
        ].map((f) => <div key={f.text} className="flex items-center gap-3"><div className="w-8 h-8 border-[1.5px] border-ink bg-parchment-dark flex items-center justify-center flex-shrink-0 text-ink">{f.icon}</div><span className="text-[12px] text-ink/70 font-medium leading-snug">{f.text}</span></div>)}</div>
        <div className="chamfer-btn h-12 w-full mt-10" onClick={onStart}><div className="chamfer-outer"><div className="chamfer-gap"><div className="chamfer-inner"><div className="chamfer-core"><span className="text-[13px] font-bold tracking-widest">开始今天的生活冒险</span><ArrowRight size={16} className="ml-2" /></div></div></div></div></div>
        <p className="text-[10px] font-bold text-ink/20 uppercase tracking-widest mt-4">没有 KPI，没有压力，只是一个温柔的陪伴。</p>
      </div>
    </div>
  );
}

export default function App() { return <AppProvider><AppContent /></AppProvider>; }
