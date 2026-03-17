import { Win98Window } from '../win98/Win98Window';
import { Win98Menu, type MenuGroup } from '../win98/Win98Menu';
import { GameCanvas } from '../GameCanvas';
import { useSimulationStore } from '../../stores/simulation-store';
import { useUIStore } from '../../stores/ui-store';
import { useSettingsStore } from '../../stores/settings-store';

export function GamePanel() {
  const generation = useSimulationStore(s => s.generation);
  const populations = useSimulationStore(s => s.populations);
  const toxicity = useSimulationStore(s => s.toxicity);
  const running = useSimulationStore(s => s.running);

  const totalCells = Object.values(populations).reduce((a, b) => a + b, 0);

  const menuItems: MenuGroup[] = [
    {
      label: 'File',
      items: [
        { label: 'New', action: () => useSimulationStore.getState().clear() },
        { label: 'Random Fill', action: () => useSimulationStore.getState().randomize() },
        { separator: true },
      ],
    },
    {
      label: 'Simulation',
      items: [
        {
          label: running ? 'Pause' : 'Play',
          action: () => {
            const s = useSimulationStore.getState();
            running ? s.pause() : s.play();
          },
        },
        { label: 'Step', action: () => useSimulationStore.getState().step() },
        { separator: true },
        { label: 'Clear', action: () => useSimulationStore.getState().clear() },
      ],
    },
    {
      label: 'View',
      items: [
        { label: 'Toggle Grid Lines', action: () => useUIStore.getState().toggleGridLines() },
        { label: 'Toggle CRT Effect', action: () => useSettingsStore.getState().setCrtEffect(!useSettingsStore.getState().crtEffect) },
      ],
    },
    {
      label: 'Help',
      items: [
        {
          label: 'About Game of Slop',
          action: () => alert(
            'Game of Slop v1.0\n\n' +
            "A Conway's Game of Life variant themed around AI slop.\n\n" +
            'Each cell type represents a different form of AI-generated content,\n' +
            'with satirical interaction rules.\n\n' +
            'Keyboard shortcuts:\n' +
            '  Space - Play/Pause\n' +
            '  Right Arrow - Step\n' +
            '  C - Clear\n' +
            '  R - Random Fill'
          ),
        },
      ],
    },
  ];

  return (
    <Win98Window
      windowId="game"
      title="Game of Slop"
      docked
      bodyOverflow="hidden"
      style={{ width: '100%', height: '100%' }}
      menuBar={<Win98Menu items={menuItems} />}
      statusBar={
        <>
          <p className="status-bar-field">Gen: {generation}</p>
          <p className="status-bar-field">Cells: {totalCells.toLocaleString()}</p>
          <p className="status-bar-field">
            Toxicity: {toxicity.value.toFixed(0)}% — {toxicity.label}
          </p>
        </>
      }
    >
      <GameCanvas />
    </Win98Window>
  );
}
