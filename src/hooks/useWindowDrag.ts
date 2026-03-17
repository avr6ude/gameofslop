import { useCallback, useRef } from 'react';
import { useUIStore } from '../stores/ui-store';

export function useWindowDrag(windowId: string) {
  const dragRef = useRef<{ startX: number; startY: number; origX: number; origY: number } | null>(null);

  const onMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    const win = useUIStore.getState().windows[windowId];
    if (!win) return;

    dragRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      origX: win.position.x,
      origY: win.position.y,
    };

    useUIStore.getState().focusWindow(windowId);

    const onMouseMove = (e: MouseEvent) => {
      if (!dragRef.current) return;
      const dx = e.clientX - dragRef.current.startX;
      const dy = e.clientY - dragRef.current.startY;
      useUIStore.getState().setWindowPosition(
        windowId,
        dragRef.current.origX + dx,
        dragRef.current.origY + dy,
      );
    };

    const onMouseUp = () => {
      dragRef.current = null;
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  }, [windowId]);

  return { onTitleBarMouseDown: onMouseDown };
}
