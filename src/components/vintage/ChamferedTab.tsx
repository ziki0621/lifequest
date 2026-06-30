import type { ReactNode } from "react";

interface Props {
  children: ReactNode;
  active?: boolean;
  zIndex?: number;
  onClick?: () => void;
}

export default function ChamferedTab({ children, active = false, zIndex = 0, onClick }: Props) {
  return (
    <div className="relative -mr-1 cursor-pointer" style={{ zIndex }} onClick={onClick}>
      <div className="bg-[#4A3B2C] p-[1.5px] pb-0" style={{ clipPath: "polygon(6px 0, calc(100% - 6px) 0, 100% 6px, 100% 100%, 0 100%, 0 6px)" }}>
        <div className={`${active ? "bg-[#F3EAD5]" : "bg-[#E3D4BB]"} p-[2px] pb-0`} style={{ clipPath: "polygon(5px 0, calc(100% - 5px) 0, 100% 5px, 100% 100%, 0 100%, 0 5px)" }}>
          <div className="bg-[#4A3B2C] p-[0.5px] pb-0" style={{ clipPath: "polygon(3.5px 0, calc(100% - 3.5px) 0, 100% 3.5px, 100% 100%, 0 100%, 0 3.5px)" }}>
            <div className={`${active ? "bg-[#F3EAD5]" : "bg-[#E3D4BB]"} min-w-[50px] h-[22px] flex items-center justify-center px-2`} style={{ clipPath: "polygon(3px 0, calc(100% - 3px) 0, 100% 3px, 100% 100%, 0 100%, 0 3px)" }}>
              {children}
            </div>
          </div>
        </div>
      </div>
      {active && <div className="absolute -bottom-[1px] left-[1.5px] right-[1.5px] h-[3px] bg-[#F3EAD5] z-10" />}
    </div>
  );
}

export function ChamferedTabBase() {
  return <div className="border-[1.5px] border-[#4A3B2C] w-full h-[4px] bg-[#F3EAD5] relative z-0" />;
}
