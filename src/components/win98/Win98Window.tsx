import { type ReactNode, type CSSProperties, useRef } from 'react';
import { useUIStore } from '../../stores/ui-store';
import { useWindowDrag } from '../../hooks/useWindowDrag';

interface Win98WindowProps {
  windowId: string;
  title: string;
  children: ReactNode;
  width?: number | string;
  height?: number | string;
  statusBar?: ReactNode;
  menuBar?: ReactNode;
  onClose?: () => void;
  className?: string;
  style?: CSSProperties;
  resizable?: boolean;
  /** If true, the window is laid out by the parent (no absolute positioning) */
  docked?: boolean;
  /** Override overflow on window body (default: 'auto') */
  bodyOverflow?: string;
}

export function Win98Window({
  windowId,
  title,
  children,
  width,
  height,
  statusBar,
  menuBar,
  onClose,
  className = '',
  style: extraStyle,
  resizable = false,
  docked = false,
  bodyOverflow = 'auto',
}: Win98WindowProps) {
  const windowState = useUIStore(s => s.windows[windowId]);
  const focusWindow = useUIStore(s => s.focusWindow);
  const minimizeWindow = useUIStore(s => s.minimizeWindow);
  const closeWindow = useUIStore(s => s.closeWindow);
  const { onTitleBarMouseDown } = useWindowDrag(windowId);
  const windowRef = useRef<HTMLDivElement>(null);

  if (!windowState || !windowState.visible || windowState.minimized) {
    return null;
  }

  const positionStyle: CSSProperties = docked
    ? { maxHeight: '100%', overflow: 'hidden' }
    : {
        position: 'absolute',
        left: windowState.position.x,
        top: windowState.position.y,
      };

  return (
    <div
      ref={windowRef}
      className={`window ${className}`}
      style={{
        ...positionStyle,
        zIndex: windowState.zIndex,
        width: typeof width === 'number' ? `${width}px` : width,
        height: typeof height === 'number' ? `${height}px` : height,
        display: 'flex',
        flexDirection: 'column',
        ...(resizable ? { resize: 'both', overflow: 'hidden', minWidth: '300px', minHeight: '200px' } : {}),
        ...extraStyle,
      }}
      onMouseDown={() => focusWindow(windowId)}
    >
      <div
        className="title-bar"
        onMouseDown={docked ? undefined : onTitleBarMouseDown}
        style={{ cursor: docked ? 'default' : 'grab', flexShrink: 0 }}
      >
        <div className="title-bar-text">{title}</div>
        <div className="title-bar-controls">
          <button
            aria-label="Minimize"
            onClick={(e) => {
              e.stopPropagation();
              minimizeWindow(windowId);
            }}
          />
          <button
            aria-label="Close"
            onClick={(e) => {
              e.stopPropagation();
              if (onClose) onClose();
              else closeWindow(windowId);
            }}
          />
        </div>
      </div>

      {menuBar && (
        <div className="window-menu-bar" style={{ flexShrink: 0 }}>
          {menuBar}
        </div>
      )}

      <div className="window-body" style={{ margin: 0, padding: '4px', flex: 1, overflow: bodyOverflow, minHeight: 0 }}>
        {children}
      </div>

      {statusBar && (
        <div className="status-bar" style={{ flexShrink: 0 }}>
          {statusBar}
        </div>
      )}
    </div>
  );
}
