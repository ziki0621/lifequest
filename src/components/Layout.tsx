import type { ReactNode } from "react";
import { useApp } from "../hooks/useApp";
import Sidebar from "./Sidebar";

interface LayoutProps { children: ReactNode; currentPage: string; onNavigate: (page: string) => void; }

export default function Layout({ children, currentPage, onNavigate }: LayoutProps) {
  const { theme } = useApp();

  return (
    <div
      className="flex min-h-screen relative"
      style={{
        "--theme-primary": theme.primary,
        "--theme-primary-light": theme.primaryLight,
      } as React.CSSProperties}
    >
      {/* Fluid Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10" style={{ background: theme.bg }}>
        <div
          className="absolute -top-[10%] -right-[5%] w-[60vw] h-[60vw] rounded-full mix-blend-multiply blur-[80px] opacity-70 animate-pulse"
          style={{ background: theme.blob1, animationDuration: "8s" }}
        />
        <div
          className="absolute -bottom-[10%] -left-[10%] w-[50vw] h-[50vw] rounded-full mix-blend-multiply blur-[80px] opacity-60 animate-pulse"
          style={{ background: theme.blob2, animationDuration: "12s" }}
        />
        <div
          className="absolute top-[30%] left-[20%] w-[70vw] h-[40vw] rounded-[100%] mix-blend-multiply blur-[100px] opacity-50 rotate-12"
          style={{ background: theme.blob3 }}
        />
      </div>

      <Sidebar currentPage={currentPage} onNavigate={onNavigate} />
      <div className="flex-1 flex flex-col pb-28 md:pb-0 min-w-0">
        <main className="flex-1 px-5 md:px-12 pt-6 md:pt-10 max-w-5xl mx-auto w-full z-10">
          {children}
        </main>
      </div>
    </div>
  );
}
