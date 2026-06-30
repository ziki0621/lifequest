import type { ReactNode } from "react";

interface Props {
  children: ReactNode;
  className?: string;
  innerClassName?: string;
  shaded?: boolean;
  onClick?: () => void;
}

export default function WireframeBox({ children, className = "", innerClassName = "", shaded = false, onClick }: Props) {
  return (
    <div
      onClick={onClick}
      className={`relative border-[1.5px] border-[#4A3B2C] p-[2.5px] shadow-[2px_2px_0px_rgba(74,59,44,0.15)] ${shaded ? "bg-[#E3D4BB]" : "bg-[#F3EAD5]"} ${onClick ? "cursor-pointer" : ""} ${className}`}
    >
      <div className={`border-[0.5px] border-[#4A3B2C] w-full h-full relative ${innerClassName}`}>
        {children}
      </div>
    </div>
  );
}
