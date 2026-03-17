import { type ReactNode } from 'react';

interface Win98DialogProps {
  title: string;
  children: ReactNode;
  onClose: () => void;
  buttons?: Array<{ label: string; onClick: () => void; primary?: boolean }>;
  width?: number;
}

export function Win98Dialog({ title, children, onClose, buttons, width = 400 }: Win98DialogProps) {
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.3)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 20000,
      }}
      onClick={onClose}
    >
      <div
        className="window"
        style={{ width: `${width}px` }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="title-bar">
          <div className="title-bar-text">{title}</div>
          <div className="title-bar-controls">
            <button aria-label="Close" onClick={onClose} />
          </div>
        </div>
        <div className="window-body" style={{ padding: '12px' }}>
          {children}
          {buttons && (
            <div style={{ marginTop: '12px', display: 'flex', justifyContent: 'flex-end', gap: '6px' }}>
              {buttons.map((btn, i) => (
                <button key={i} onClick={btn.onClick} style={{ minWidth: '75px' }}>
                  {btn.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
