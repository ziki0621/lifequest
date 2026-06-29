import type { ReactNode } from "react";
import { useApp } from "../hooks/useApp";
import Sidebar from "./Sidebar";
import FluidBackground from "./FluidBackground";

interface LayoutProps { children: ReactNode; currentPage: string; onNavigate: (page: string) => void; }

export default function Layout({ children, currentPage, onNavigate }: LayoutProps) {
  const { theme } = useApp();

  return (
    <div className="flex min-h-screen relative" style={{ background: theme.bg }}>
      <FluidBackground theme={theme} />
      <Sidebar currentPage={currentPage} onNavigate={onNavigate} />
      <div className="flex-1 flex flex-col pb-28 md:pb-0 min-w-0">
        <main className="flex-1 px-5 md:px-12 pt-6 md:pt-10 max-w-5xl mx-auto w-full z-10">
          {children}
        </main>
      </div>
    </div>
  );
}
