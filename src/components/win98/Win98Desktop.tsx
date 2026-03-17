import { type ReactNode, useMemo } from 'react';
import { useUIStore } from '../../stores/ui-store';

interface Win98DesktopProps {
  children: ReactNode;
}

function generateWallpaperSVG(): string {
  const emojis = ['🎨', '📝', '🎭', '🎵', '🔗', '🤖', '🪤', '💻'];
  const size = 80;
  const rows = 4;
  const cols = 4;
  let svgContent = '';

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const emoji = emojis[(r * cols + c) % emojis.length];
      const x = c * (size / cols) * cols / 2 + 10;
      const y = r * (size / rows) * rows / 2 + 16;
      svgContent += `<text x="${x}" y="${y}" font-size="10" opacity="0.06">${emoji}</text>`;
    }
  }

  return `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}">${svgContent}</svg>`)}`;
}

export function Win98Desktop({ children }: Win98DesktopProps) {
  const closeStartMenu = useUIStore(s => s.closeStartMenu);
  const wallpaper = useMemo(() => generateWallpaperSVG(), []);

  return (
    <div
      className="desktop"
      onClick={closeStartMenu}
      style={{
        position: 'fixed',
        inset: 0,
        background: `#008080 url("${wallpaper}") repeat`,
        overflow: 'hidden',
        fontFamily: '"Pixelated MS Sans Serif", "Microsoft Sans Serif", Tahoma, Arial, sans-serif',
      }}
    >
      {children}
    </div>
  );
}
