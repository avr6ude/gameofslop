import { Win98Window } from '../win98/Win98Window';
import { CELL_TYPES } from '../../simulation/cell-types';
import { useSimulationStore } from '../../stores/simulation-store';

export function StatsPanel() {
  const populations = useSimulationStore(s => s.populations);
  const toxicity = useSimulationStore(s => s.toxicity);
  const generation = useSimulationStore(s => s.generation);

  const totalCells = Object.values(populations).reduce((a, b) => a + b, 0);

  const toxColor = toxicity.value < 25 ? '#00B894' :
                   toxicity.value < 50 ? '#FDCB6E' :
                   toxicity.value < 75 ? '#E17055' : '#D63031';

  return (
    <Win98Window
      windowId="stats"
      title="Statistics"
      docked
      style={{ flexShrink: 0 }}
      statusBar={
        <p className="status-bar-field" style={{ textAlign: 'center' }}>
          Gen {generation.toLocaleString()} &middot; {toxicity.value.toFixed(0)}% &mdash; {toxicity.label}
        </p>
      }
    >
      {/* Population table */}
      <div className="sunken-panel" style={{ padding: '4px' }}>
        <table style={{ width: '100%', fontSize: '13px', borderCollapse: 'collapse' }}>
          <tbody>
            {CELL_TYPES.filter(t => t.id !== 0).map((type) => (
              <tr key={type.id}>
                <td style={{ padding: '2px 4px' }}>
                  <span style={{
                    display: 'inline-block',
                    width: '12px',
                    height: '12px',
                    background: type.color,
                    marginRight: '6px',
                    verticalAlign: 'middle',
                  }} />
                  {type.emoji} {type.name}
                </td>
                <td style={{ padding: '2px 4px', textAlign: 'right', fontFamily: 'monospace' }}>
                  {(populations[type.id] || 0).toLocaleString()}
                </td>
              </tr>
            ))}
            <tr>
              <td colSpan={2}><hr style={{ margin: '3px 0' }} /></td>
            </tr>
            <tr style={{ fontWeight: 'bold' }}>
              <td style={{ padding: '2px 4px' }}>Total</td>
              <td style={{ padding: '2px 4px', textAlign: 'right', fontFamily: 'monospace' }}>
                {totalCells.toLocaleString()}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Toxicity bar */}
      <div style={{ marginTop: '6px' }}>
        <div style={{ fontSize: '11px', marginBottom: '2px', fontWeight: 'bold' }}>Toxicity</div>
        <div style={{ position: 'relative', height: '20px' }}>
          <div style={{
            width: '100%',
            height: '100%',
            background: '#fff',
            border: '1px inset #c0c0c0',
            overflow: 'hidden',
          }}>
            <div style={{
              width: `${Math.min(100, toxicity.value)}%`,
              height: '100%',
              background: toxColor,
              transition: 'width 0.3s, background 0.3s',
            }} />
          </div>
          <span style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '11px',
            fontWeight: 'bold',
            pointerEvents: 'none',
          }}>
            {toxicity.value.toFixed(1)}%
          </span>
        </div>
      </div>
    </Win98Window>
  );
}
