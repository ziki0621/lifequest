export default function SectionTitle({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-2 mb-6 text-[#4A3B2C] opacity-80">
      <span className="text-[6px]">◇</span>
      <div className="h-px bg-[#4A3B2C] flex-1" />
      <span className="text-[10px] font-bold tracking-[0.2em] uppercase px-1 font-serif-cn">{text}</span>
      <div className="h-px bg-[#4A3B2C] flex-1" />
      <span className="text-[6px]">◇</span>
    </div>
  );
}
