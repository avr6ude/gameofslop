import { useState } from 'react';
import { Win98Desktop } from './components/win98/Win98Desktop';
import { Win98Taskbar } from './components/win98/Win98Taskbar';
import { GamePanel } from './components/panels/GamePanel';
import { PalettePanel } from './components/panels/PalettePanel';
import { StatsPanel } from './components/panels/StatsPanel';
import { BootSequence } from './components/BootSequence';
import { NewsTicker } from './components/NewsTicker';
import { CRTEffect } from './components/CRTEffect';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';

const WINDOW_TITLES: Record<string, string> = {
  game: 'Game of Slop',
  palette: 'Slop Palette',
  stats: 'Statistics',
};

export default function App() {
  useKeyboardShortcuts();

  const [booted, setBooted] = useState(false);

  const handleBootComplete = () => {
    setBooted(true);
  };

  if (!booted) {
    return <BootSequence onComplete={handleBootComplete} />;
  }

  return (
    <Win98Desktop>
      <div style={{
        display: 'grid',
        gridTemplateColumns: '270px 1fr',
        gridTemplateRows: '1fr',
        gap: '4px',
        padding: '4px',
        height: 'calc(100vh - 46px)',
        overflow: 'hidden',
      }}>
        {/* Left sidebar: palette + stats stacked, scrollable */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '4px',
          overflow: 'auto',
          minHeight: 0,
        }}>
          <PalettePanel />
          <StatsPanel />
        </div>

        {/* Main area: game fills remaining space */}
        <GamePanel />
      </div>
      <Win98Taskbar windowTitles={WINDOW_TITLES} ticker={<NewsTicker />} />
      <CRTEffect />
    </Win98Desktop>
  );
}
