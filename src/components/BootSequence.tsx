import { useState, useEffect, useCallback, type CSSProperties } from 'react';

/* ------------------------------------------------------------------ */
/*  BIOS POST lines                                                    */
/* ------------------------------------------------------------------ */
const BIOS_LINES = [
  '',
  'SLOP BIOS v6.9 (c) 2024 Artificial Slop Inc.',
  'All Rights Hallucinated.',
  '',
  'CPU: SlopRISC-V @ 4.20 GHz  ...  OK',
  'Checking VRAM for Hallucinations ... NONE FOUND (suspicious)',
  '',
  'Detecting AI Content...',
  '  - GPT-4o Turbo detected',
  '  - Midjourney v7 detected',
  '  - Suno AI detected',
  '  - Eleven Labs voice clone detected',
  '  - 847 SEO spam farms detected',
  '  - 1 human-made JPEG from 2003 detected (archived)',
  '',
  'Memory Test: 640K of human creativity remaining',
  '  (should be enough for anybody)',
  '',
  'Initializing Dead Internet Protocol v2.0 ... OK',
  'Mounting /dev/slop ... OK',
  'Loading Content Authenticity Module ... FAILED',
  'Loading Vibe Check Driver ... SKIPPED',
  '',
  'Starting SLOP/OS ...',
  '',
];

/** How fast each BIOS line appears (ms). */
const BIOS_LINE_DELAY = 65;

/** Duration of the splash screen phase (ms). */
const SPLASH_DURATION = 1800;

/** Duration of the fade-out at the end (ms). */
const FADE_DURATION = 400;

const SESSION_KEY = 'gameofslop_hasBooted';

/* ------------------------------------------------------------------ */
/*  Styles                                                             */
/* ------------------------------------------------------------------ */

const fullscreen: CSSProperties = {
  position: 'fixed',
  inset: 0,
  zIndex: 99999,
};

const biosStyle: CSSProperties = {
  ...fullscreen,
  background: '#000',
  color: '#aaa',
  fontFamily: '"Perfect DOS VGA 437", "Courier New", "Lucida Console", monospace',
  fontSize: 14,
  lineHeight: 1.45,
  padding: '24px 32px',
  whiteSpace: 'pre-wrap',
  overflow: 'hidden',
};

const splashOuter: CSSProperties = {
  ...fullscreen,
  background: '#000',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 0,
};

const splashTitle: CSSProperties = {
  fontFamily: '"Pixelated MS Sans Serif", "MS Sans Serif", Tahoma, Arial, sans-serif',
  fontSize: 38,
  fontWeight: 'bold',
  color: '#fff',
  letterSpacing: 1,
  textAlign: 'center',
  marginBottom: 6,
  textShadow: '2px 2px 0 #000080',
};

const splashSubtitle: CSSProperties = {
  fontFamily: '"Pixelated MS Sans Serif", "MS Sans Serif", Tahoma, Arial, sans-serif',
  fontSize: 14,
  color: '#c0c0c0',
  textAlign: 'center',
  marginBottom: 28,
};

const logoArea: CSSProperties = {
  fontSize: 48,
  textAlign: 'center',
  marginBottom: 18,
  lineHeight: 1.3,
  /* Slight Win98 flag vibe with a slop twist */
  filter: 'drop-shadow(2px 2px 0 rgba(0,0,0,0.5))',
};

const barTrack: CSSProperties = {
  width: 260,
  height: 18,
  background: '#000',
  border: '2px inset #808080',
  padding: 2,
  boxSizing: 'border-box',
};

const copyrightStyle: CSSProperties = {
  fontFamily: '"Pixelated MS Sans Serif", "MS Sans Serif", Tahoma, Arial, sans-serif',
  fontSize: 11,
  color: '#808080',
  marginTop: 24,
  textAlign: 'center',
};

/* ------------------------------------------------------------------ */
/*  Keyframes injected once                                            */
/* ------------------------------------------------------------------ */

let stylesInjected = false;
function injectKeyframes() {
  if (stylesInjected) return;
  stylesInjected = true;
  const sheet = document.createElement('style');
  sheet.textContent = `
    @keyframes _bootCursorBlink {
      0%, 49% { opacity: 1; }
      50%, 100% { opacity: 0; }
    }
    @keyframes _bootBarSlide {
      0%   { background-position: 0 0; }
      100% { background-position: 30px 0; }
    }
  `;
  document.head.appendChild(sheet);
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

interface BootSequenceProps {
  onComplete: () => void;
}

type Phase = 'bios' | 'splash' | 'fadeout' | 'done';

export function BootSequence({ onComplete }: BootSequenceProps) {
  const [phase, setPhase] = useState<Phase>(() => {
    if (sessionStorage.getItem(SESSION_KEY) === '1') return 'done';
    return 'bios';
  });
  const [biosIndex, setBiosIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  /* Inject CSS keyframes once */
  useEffect(() => {
    injectKeyframes();
  }, []);

  /* ---- BIOS phase: reveal lines one by one ---- */
  useEffect(() => {
    if (phase !== 'bios') return;
    if (biosIndex >= BIOS_LINES.length) {
      /* Small pause then move to splash */
      const t = setTimeout(() => setPhase('splash'), 300);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setBiosIndex(i => i + 1), BIOS_LINE_DELAY);
    return () => clearTimeout(t);
  }, [phase, biosIndex]);

  /* ---- Splash phase: animate progress bar ---- */
  useEffect(() => {
    if (phase !== 'splash') return;

    const steps = 30;
    const interval = SPLASH_DURATION / steps;
    let step = 0;

    const id = setInterval(() => {
      step++;
      setProgress(Math.min(100, Math.round((step / steps) * 100)));
      if (step >= steps) {
        clearInterval(id);
        setPhase('fadeout');
      }
    }, interval);

    return () => clearInterval(id);
  }, [phase]);

  /* ---- Fade-out phase ---- */
  useEffect(() => {
    if (phase !== 'fadeout') return;
    const t = setTimeout(() => {
      setPhase('done');
      sessionStorage.setItem(SESSION_KEY, '1');
      onComplete();
    }, FADE_DURATION);
    return () => clearTimeout(t);
  }, [phase, onComplete]);

  /* ---- Fire onComplete immediately when already booted ---- */
  const onCompleteStable = useCallback(onComplete, [onComplete]);
  useEffect(() => {
    if (phase === 'done' && sessionStorage.getItem(SESSION_KEY) === '1') {
      onCompleteStable();
    }
  }, [phase, onCompleteStable]);

  /* Nothing to render if already booted */
  if (phase === 'done') return null;

  /* ---- BIOS screen ---- */
  if (phase === 'bios') {
    return (
      <div style={biosStyle} aria-live="polite">
        {BIOS_LINES.slice(0, biosIndex).map((line, i) => (
          <div key={i}>{line || '\u00A0'}</div>
        ))}
        {/* Blinking cursor */}
        <span
          style={{
            display: 'inline-block',
            width: 8,
            height: 14,
            background: '#aaa',
            animation: '_bootCursorBlink 0.8s step-end infinite',
            verticalAlign: 'text-bottom',
          }}
        />
      </div>
    );
  }

  /* ---- Splash / fade-out ---- */
  const isFading = phase === 'fadeout';

  return (
    <div
      style={{
        ...splashOuter,
        opacity: isFading ? 0 : 1,
        transition: isFading ? `opacity ${FADE_DURATION}ms ease-in` : 'none',
      }}
    >
      {/* Slop "logo" in place of the Win98 flag */}
      <div style={logoArea} aria-hidden>
        <span role="img" aria-label="slop logo">
          {"🤖🎨🎵🖼️"}
        </span>
      </div>

      <div style={splashTitle}>Game of Slop</div>
      <div style={splashSubtitle}>Where every cell is AI generated</div>

      {/* Win98-style progress bar */}
      <div style={barTrack}>
        <div
          style={{
            width: `${progress}%`,
            height: '100%',
            /* Win98 used segmented navy blocks */
            background:
              'repeating-linear-gradient(90deg, #000080 0px, #000080 8px, #000 8px, #000 10px)',
            transition: 'width 60ms linear',
          }}
        />
      </div>

      <div style={copyrightStyle}>
        &copy; 2024 Artificial Slop Inc. All rights hallucinated.
      </div>
    </div>
  );
}
