import { useRef, useEffect, useCallback } from 'react';
import { CanvasRenderer } from '../rendering/canvas-renderer';
import { useSimulationStore } from '../stores/simulation-store';
import { useUIStore } from '../stores/ui-store';
import { useSettingsStore } from '../stores/settings-store';

export function GameCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rendererRef = useRef<CanvasRenderer | null>(null);
  const rafRef = useRef<number>(0);
  const isPaintingRef = useRef(false);

  const selectedTool = useUIStore(s => s.selectedTool);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const { cellSize } = useSettingsStore.getState();
    const { showGridLines } = useUIStore.getState();

    const renderer = new CanvasRenderer(canvas, { cellSize, showGridLines });
    rendererRef.current = renderer;

    const engine = useSimulationStore.getState().engine;
    renderer.resizeCanvas(engine.grid);
    renderer.draw(engine.grid, engine.generation);

    let lastRenderVersion = useSimulationStore.getState().renderVersion;
    let lastCellSize = cellSize;
    let lastShowGridLines = showGridLines;

    const loop = () => {
      const state = useSimulationStore.getState();
      const currentCellSize = useSettingsStore.getState().cellSize;
      const currentShowGridLines = useUIStore.getState().showGridLines;

      let needsResize = false;
      let needsDraw = false;

      if (currentCellSize !== lastCellSize || currentShowGridLines !== lastShowGridLines) {
        renderer.updateOptions({ cellSize: currentCellSize, showGridLines: currentShowGridLines });
        lastCellSize = currentCellSize;
        lastShowGridLines = currentShowGridLines;
        needsResize = true;
        needsDraw = true;
      }

      if (state.renderVersion !== lastRenderVersion) {
        lastRenderVersion = state.renderVersion;
        needsDraw = true;
      }

      if (needsResize) {
        renderer.resizeCanvas(state.engine.grid);
      }

      if (needsDraw) {
        renderer.draw(state.engine.grid, state.engine.generation);
      }

      rafRef.current = requestAnimationFrame(loop);
    };

    rafRef.current = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(rafRef.current);
      rendererRef.current = null;
    };
  }, []);

  const paintCell = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    const renderer = rendererRef.current;
    if (!canvas || !renderer) return;

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const canvasX = (e.clientX - rect.left) * scaleX;
    const canvasY = (e.clientY - rect.top) * scaleY;

    const coords = renderer.canvasToGrid(canvasX, canvasY);
    if (!coords) return;

    const { x, y } = coords;
    const engine = useSimulationStore.getState().engine;
    if (x >= 0 && x < engine.grid.width && y >= 0 && y < engine.grid.height) {
      useSimulationStore.getState().setCell(x, y, selectedTool);
    }
  }, [selectedTool]);

  const handleMouseDown = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    if (e.button !== 0) return;
    isPaintingRef.current = true;
    paintCell(e);
  }, [paintCell]);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isPaintingRef.current) return;
    paintCell(e);
  }, [paintCell]);

  const handleMouseUp = useCallback(() => {
    isPaintingRef.current = false;
  }, []);

  return (
    <div
      className="sunken-panel win98-scrollbar"
      style={{ overflow: 'scroll', width: '100%', height: '100%', background: '#c0c0c0' }}
    >
      <canvas
        ref={canvasRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        style={{ cursor: 'crosshair', display: 'block', imageRendering: 'pixelated' }}
      />
    </div>
  );
}
