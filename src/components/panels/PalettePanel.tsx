import { Win98Window } from '../win98/Win98Window';
import { CELL_TYPES } from '../../simulation/cell-types';
import { useUIStore } from '../../stores/ui-store';
import { useSimulationStore } from '../../stores/simulation-store';

import { PATTERNS } from '../../patterns/presets';

export function PalettePanel() {
  const selectedTool = useUIStore(s => s.selectedTool);
  const setSelectedTool = useUIStore(s => s.setSelectedTool);
  const running = useSimulationStore(s => s.running);
  const speed = useSimulationStore(s => s.speed);

  return (
    <Win98Window windowId="palette" title="Slop Palette" docked style={{ flexShrink: 0 }}>
      <fieldset>
        <legend>Cell Types</legend>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {/* Eraser */}
          <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', cursor: 'pointer', padding: '1px 0' }}>
            <input
              type="radio"
              name="cellType"
              checked={selectedTool === 0}
              onChange={() => setSelectedTool(0)}
            />
            <span style={{
              display: 'inline-block',
              width: '14px',
              height: '14px',
              background: '#c0c0c0',
              border: '1px solid #808080',
            }} />
            {'\u{1F9F9}'} Eraser
          </label>

          {CELL_TYPES.filter(t => t.id !== 0).map((type) => (
            <label
              key={type.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '13px',
                cursor: 'pointer',
                padding: '1px 0',
              }}
              title={type.description}
            >
              <input
                type="radio"
                name="cellType"
                checked={selectedTool === type.id}
                onChange={() => setSelectedTool(type.id)}
              />
              <span style={{
                display: 'inline-block',
                width: '14px',
                height: '14px',
                background: type.color,
                border: '1px solid #808080',
              }} />
              {type.emoji} {type.name}
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset style={{ marginTop: '8px' }}>
        <legend>Controls</legend>
        <div style={{ display: 'flex', gap: '4px', marginBottom: '8px' }}>
          <button
            style={{ fontSize: '13px', flex: 1, padding: '4px 8px' }}
            onClick={() => {
              const s = useSimulationStore.getState();
              running ? s.pause() : s.play();
            }}
          >
            {running ? '\u23F8 Pause' : '\u25B6 Play'}
          </button>
          <button
            style={{ fontSize: '13px', flex: 1, padding: '4px 8px' }}
            onClick={() => useSimulationStore.getState().step()}
          >
            {'\u23ED'} Step
          </button>
        </div>

        <div style={{ fontSize: '13px', marginBottom: '2px' }}>
          Speed: {speed}ms
        </div>
        <input
          type="range"
          min="10"
          max="1000"
          step="10"
          value={speed}
          onChange={(e) => useSimulationStore.getState().setSpeed(Number(e.target.value))}
          style={{ width: '100%' }}
        />
      </fieldset>

      <fieldset style={{ marginTop: '8px' }}>
        <legend>Patterns</legend>
        <select
          style={{ width: '100%', fontSize: '13px' }}
          onChange={(e) => {
            const pattern = PATTERNS.find(p => p.name === e.target.value);
            if (pattern) {
              const { engine } = useSimulationStore.getState();
              const cx = Math.floor(engine.grid.width / 2 - pattern.grid[0].length / 2);
              const cy = Math.floor(engine.grid.height / 2 - pattern.grid.length / 2);
              useSimulationStore.getState().placePattern(pattern.grid, cx, cy);
            }
            e.target.value = '';
          }}
          defaultValue=""
        >
          <option value="" disabled>Place pattern...</option>
          {PATTERNS.map((p) => (
            <option key={p.name} value={p.name}>
              {p.name} — {p.description}
            </option>
          ))}
        </select>
      </fieldset>

    </Win98Window>
  );
}
