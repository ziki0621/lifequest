import type { ReactNode } from "react";

interface Props {
  children: ReactNode;
  shaded?: boolean;
  className?: string;
  disabled?: boolean;
  onClick?: () => void;
}

export default function ChamferedButton({ children, shaded = false, className = "", disabled = false, onClick }: Props) {
  return (
    <div
      onClick={disabled ? undefined : onClick}
      className={`relative cursor-pointer drop-shadow-[2px_2px_0px_rgba(74,59,44,0.15)] hover:drop-shadow-[1px_1px_0px_rgba(74,59,44,0.15)] hover:translate-y-[1px] hover:translate-x-[1px] transition-all ${disabled ? "opacity-30 pointer-events-none" : ""} ${className}`}
    >
      <div className="bg-[#4A3B2C] p-[1.5px]" style={{ clipPath: "polygon(6px 0, calc(100% - 6px) 0, 100% 6px, 100% calc(100% - 6px), calc(100% - 6px) 100%, 6px 100%, 0 calc(100% - 6px), 0 6px)" }}>
        <div className={`${shaded ? "bg-[#E3D4BB]" : "bg-[#F3EAD5]"} p-[2px]`} style={{ clipPath: "polygon(5px 0, calc(100% - 5px) 0, 100% 5px, 100% calc(100% - 5px), calc(100% - 5px) 100%, 5px 100%, 0 calc(100% - 5px), 0 5px)" }}>
          <div className="bg-[#4A3B2C] p-[0.5px]" style={{ clipPath: "polygon(4px 0, calc(100% - 4px) 0, 100% 4px, 100% calc(100% - 4px), calc(100% - 4px) 100%, 4px 100%, 0 calc(100% - 4px), 0 4px)" }}>
            <div className={`${shaded ? "bg-[#E3D4BB]" : "bg-[#F3EAD5]"} flex items-center justify-center`} style={{ clipPath: "polygon(3.5px 0, calc(100% - 3.5px) 0, 100% 3.5px, 100% calc(100% - 3.5px), calc(100% - 3.5px) 100%, 3.5px 100%, 0 calc(100% - 3.5px), 0 3.5px)" }}>
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
