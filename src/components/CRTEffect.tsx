import { useSettingsStore } from '../stores/settings-store';

export function CRTEffect() {
  const crtEffect = useSettingsStore(s => s.crtEffect);

  if (!crtEffect) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 99998,
      }}
    >
      {/* Scanlines */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'repeating-linear-gradient(0deg, rgba(0,0,0,0.08) 0px, rgba(0,0,0,0.08) 1px, transparent 1px, transparent 3px)',
        mixBlendMode: 'multiply',
      }} />
      {/* Slight vignette */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'radial-gradient(ellipse at center, transparent 60%, rgba(0,0,0,0.25) 100%)',
      }} />
      {/* Subtle flicker */}
      <div style={{
        position: 'absolute',
        inset: 0,
        animation: 'crt-flicker 0.1s infinite alternate',
        background: 'rgba(255,255,255,0.01)',
      }} />
      <style>{`
        @keyframes crt-flicker {
          0% { opacity: 0.97; }
          100% { opacity: 1; }
        }
      `}</style>
    </div>
  );
}
