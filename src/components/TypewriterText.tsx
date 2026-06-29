import { useEffect, useState } from "react";

interface Props { text: string; speed?: number; className?: string; }

export default function TypewriterText({ text, speed = 18, className }: Props) {
  const [shown, setShown] = useState("");
  useEffect(() => {
    setShown(""); let i = 0;
    const timer = window.setInterval(() => { i += 1; setShown(text.slice(0, i)); if (i >= text.length) window.clearInterval(timer); }, speed);
    return () => window.clearInterval(timer);
  }, [text, speed]);
  return <p className={className}>{shown}</p>;
}
