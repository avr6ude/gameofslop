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
      {/* Desktop layout */}
      <div className="app-layout">
        {/* Left sidebar: palette + stats stacked, scrollable */}
        <div className="app-sidebar">
          <PalettePanel />
          <StatsPanel />
        </div>

        {/* Main area: game fills remaining space */}
        <div className="app-main">
          <GamePanel />
        </div>
      </div>
      <Win98Taskbar windowTitles={WINDOW_TITLES} ticker={<NewsTicker />} />
      <CRTEffect />
    </Win98Desktop>
  );
}
