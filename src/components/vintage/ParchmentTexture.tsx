export default function ParchmentTexture() {
  return (
    <div className="fixed inset-0 pointer-events-none z-[-1] bg-[#F3EAD5]">
      <svg width="100%" height="100%" className="opacity-[0.4] mix-blend-multiply">
        <filter id="globalParchment">
          <feTurbulence type="fractalNoise" baseFrequency="0.7" numOctaves="4" stitchTiles="stitch" />
          <feColorMatrix type="matrix" values="0 0 0 0 0.9  0 0 0 0 0.8  0 0 0 0 0.6  0 0 0 0 1" />
        </filter>
        <rect width="100%" height="100%" filter="url(#globalParchment)" />
      </svg>
      <div className="absolute inset-0 shadow-[inset_0_0_200px_rgba(74,59,44,0.08)]" />
    </div>
  );
}
