import { type ReactNode, useState, useEffect } from 'react';
import { useUIStore } from '../../stores/ui-store';

interface Win98TaskbarProps {
  windowTitles: Record<string, string>;
  ticker?: ReactNode;
}

export function Win98Taskbar({ windowTitles, ticker }: Win98TaskbarProps) {
  const windows = useUIStore(s => s.windows);
  const activeWindow = useUIStore(s => s.activeWindow);
  const startMenuOpen = useUIStore(s => s.startMenuOpen);
  const toggleStartMenu = useUIStore(s => s.toggleStartMenu);
  const toggleWindow = useUIStore(s => s.toggleWindow);
  const restoreWindow = useUIStore(s => s.restoreWindow);
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const timeStr = time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="taskbar" style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      height: '36px',
      background: '#c0c0c0',
      borderTop: '2px solid #fff',
      display: 'flex',
      alignItems: 'center',
      padding: '2px 4px',
      gap: '2px',
      zIndex: 9999,
    }}>
      {/* Start Button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          toggleStartMenu();
        }}
        style={{
          fontWeight: 'bold',
          padding: '3px 10px',
          fontSize: '13px',
          minWidth: '70px',
          display: 'flex',
          alignItems: 'center',
          gap: '2px',
        }}
      >
        <span style={{ fontSize: '14px' }}>{'\u{1FA9F}'}</span> Start
      </button>

      {/* Start Menu */}
      {startMenuOpen && (
        <div
          style={{
            position: 'absolute',
            bottom: '36px',
            left: '4px',
            zIndex: 10000,
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="window" style={{ width: '180px' }}>
            <div className="window-body" style={{ margin: 0, padding: '2px' }}>
              {Object.entries(windowTitles).map(([id, title]) => (
                <div
                  key={id}
                  className="start-menu-item"
                  style={{
                    padding: '4px 8px',
                    cursor: 'pointer',
                    fontSize: '13px',
                  }}
                  onMouseEnter={(e) => {
                    (e.target as HTMLElement).style.background = '#000080';
                    (e.target as HTMLElement).style.color = '#fff';
                  }}
                  onMouseLeave={(e) => {
                    (e.target as HTMLElement).style.background = '';
                    (e.target as HTMLElement).style.color = '';
                  }}
                  onClick={() => {
                    restoreWindow(id);
                    useUIStore.getState().closeStartMenu();
                  }}
                >
                  {title}
                </div>
              ))}
              <hr style={{ margin: '2px 0' }} />
              <div
                className="start-menu-item"
                style={{
                  padding: '4px 8px',
                  cursor: 'pointer',
                  fontSize: '13px',
                }}
                onMouseEnter={(e) => {
                  (e.target as HTMLElement).style.background = '#000080';
                  (e.target as HTMLElement).style.color = '#fff';
                }}
                onMouseLeave={(e) => {
                  (e.target as HTMLElement).style.background = '';
                  (e.target as HTMLElement).style.color = '';
                }}
                onClick={() => {
                  useUIStore.getState().closeStartMenu();
                  alert('It is now safe to close this tab.');
                }}
              >
                Shut Down...
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Window separator */}
      <div style={{ width: '1px', height: '20px', background: '#808080', margin: '0 2px' }} />

      {/* Window buttons */}
      {Object.entries(windows).map(([id, win]) => {
        if (!win.visible) return null;
        return (
          <button
            key={id}
            style={{
              padding: '2px 8px',
              fontSize: '13px',
              minWidth: '80px',
              textAlign: 'left',
              fontWeight: activeWindow === id && !win.minimized ? 'bold' : 'normal',
            }}
            onClick={() => toggleWindow(id)}
          >
            {windowTitles[id] || id}
          </button>
        );
      })}

      {/* Separator */}
      <div style={{ width: '1px', height: '20px', background: '#808080', margin: '0 2px' }} />

      {/* News ticker area */}
      {ticker}

      {/* Clock */}
      <div style={{
        padding: '2px 8px',
        fontSize: '13px',
        minWidth: '70px',
        textAlign: 'center',
        border: '1px inset #dfdfdf',
        background: '#c0c0c0',
        flexShrink: 0,
      }}>
        {timeStr}
      </div>
    </div>
  );
}
