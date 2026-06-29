import type { CSSProperties } from "react";
import type { ThemeConfig } from "../utils/theme";

interface FluidBackgroundProps {
  theme: ThemeConfig;
}

export default function FluidBackground({ theme }: FluidBackgroundProps) {
  const style = {
    "--fluid-bg": theme.bg,
    "--fluid-blob-1": theme.blob1,
    "--fluid-blob-2": theme.blob2,
    "--fluid-blob-3": theme.blob3,
  } as CSSProperties;

  return (
    <div className="fluid-bg" style={style} aria-hidden="true">
      <div className="fluid-blob fluid-blob-tr" />
      <div className="fluid-blob fluid-blob-bl" />
      <div className="fluid-blob fluid-blob-center" />
      <div className="fluid-blob fluid-blob-wash" />
    </div>
  );
}
