import { Grid } from '../simulation/grid';
import { CELL_TYPES, getCellType } from '../simulation/cell-types';

interface RendererOptions {
  cellSize: number;
  showGridLines: boolean;
}

// Parse hex color to [r, g, b]
function hexToRgb(hex: string): [number, number, number] {
  const n = parseInt(hex.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

export class CanvasRenderer {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private colorCache: Map<number, [number, number, number]> = new Map();
  private emojiCache: Map<number, HTMLCanvasElement> = new Map();
  options: RendererOptions;

  constructor(canvas: HTMLCanvasElement, options: RendererOptions) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d', { alpha: false })!;
    this.options = options;

    // Pre-cache colors
    for (const type of CELL_TYPES) {
      this.colorCache.set(type.id, hexToRgb(type.color));
    }

    // Pre-render emoji to offscreen canvases
    this.buildEmojiCache();
  }

  private buildEmojiCache(): void {
    const size = 32; // Render emoji at 32px for quality
    for (const type of CELL_TYPES) {
      if (type.id === 0 || !type.emoji) continue;
      const offscreen = document.createElement('canvas');
      offscreen.width = size;
      offscreen.height = size;
      const ctx = offscreen.getContext('2d')!;
      ctx.font = `${size - 4}px serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(type.emoji, size / 2, size / 2 + 2);
      this.emojiCache.set(type.id, offscreen);
    }
  }

  updateOptions(options: Partial<RendererOptions>): void {
    Object.assign(this.options, options);
  }

  resizeCanvas(grid: Grid): void {
    const { cellSize } = this.options;
    const w = grid.width * cellSize;
    const h = grid.height * cellSize;
    this.canvas.width = w;
    this.canvas.height = h;
    // Force the canvas to keep its size and not shrink to fit container
    this.canvas.style.width = `${w}px`;
    this.canvas.style.height = `${h}px`;
    this.canvas.style.minWidth = `${w}px`;
    this.canvas.style.minHeight = `${h}px`;
  }

  draw(grid: Grid, generation: number): void {
    const { cellSize, showGridLines } = this.options;
    const { width, height } = grid;
    const canvasWidth = width * cellSize;
    const canvasHeight = height * cellSize;

    // Ensure canvas size matches
    if (this.canvas.width !== canvasWidth || this.canvas.height !== canvasHeight) {
      this.canvas.width = canvasWidth;
      this.canvas.height = canvasHeight;
    }

    const ctx = this.ctx;

    // Fast path: use ImageData for small cell sizes
    if (cellSize <= 8) {
      this.drawImageData(grid);
    } else {
      this.drawFillRect(grid);
    }

    // Grid lines
    if (showGridLines && cellSize >= 4) {
      ctx.strokeStyle = '#a0a0a0';
      ctx.lineWidth = 0.5;
      ctx.beginPath();
      for (let x = 0; x <= width; x++) {
        ctx.moveTo(x * cellSize + 0.5, 0);
        ctx.lineTo(x * cellSize + 0.5, canvasHeight);
      }
      for (let y = 0; y <= height; y++) {
        ctx.moveTo(0, y * cellSize + 0.5);
        ctx.lineTo(canvasWidth, y * cellSize + 0.5);
      }
      ctx.stroke();
    }

    // Draw emoji overlay for large cells
    if (cellSize >= 14) {
      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          const type = grid.get(x, y);
          if (type === 0) continue;

          // Check deepfake disguise
          let displayType = type;
          if (type === 3 && grid.getMetadata(x, y) > 0) {
            // Show disguised as random type (deterministic based on position)
            displayType = ((x * 7 + y * 13) % 7) + 1;
            if (displayType === 3) displayType = 1; // Don't disguise as self
          }

          const emoji = this.emojiCache.get(displayType);
          if (emoji) {
            ctx.drawImage(
              emoji,
              x * cellSize + 1,
              y * cellSize + 1,
              cellSize - 2,
              cellSize - 2
            );
          }
        }
      }
    }

    // AI Music pulse effect: alternate brightness on even/odd generations
    if (generation % 2 === 0) {
      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          if (grid.get(x, y) === 4) {
            ctx.fillStyle = 'rgba(255,255,255,0.15)';
            ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
          }
        }
      }
    }
  }

  private drawImageData(grid: Grid): void {
    const { cellSize } = this.options;
    const { width, height } = grid;
    const canvasWidth = width * cellSize;
    const canvasHeight = height * cellSize;

    const imageData = this.ctx.createImageData(canvasWidth, canvasHeight);
    const data = imageData.data;

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        let type = grid.get(x, y);

        // Deepfake disguise: show different color
        if (type === 3 && grid.getMetadata(x, y) > 0) {
          type = ((x * 7 + y * 13) % 7) + 1;
          if (type === 3) type = 1;
        }

        const [r, g, b] = this.colorCache.get(type) || [192, 192, 192];

        // Fill cellSize x cellSize block
        for (let py = 0; py < cellSize; py++) {
          for (let px = 0; px < cellSize; px++) {
            const idx = ((y * cellSize + py) * canvasWidth + (x * cellSize + px)) * 4;
            data[idx] = r;
            data[idx + 1] = g;
            data[idx + 2] = b;
            data[idx + 3] = 255;
          }
        }
      }
    }

    this.ctx.putImageData(imageData, 0, 0);
  }

  private drawFillRect(grid: Grid): void {
    const { cellSize } = this.options;
    const { width, height } = grid;
    const ctx = this.ctx;

    // Clear with background color
    ctx.fillStyle = '#c0c0c0';
    ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        let type = grid.get(x, y);
        if (type === 0) continue;

        // Deepfake disguise
        if (type === 3 && grid.getMetadata(x, y) > 0) {
          type = ((x * 7 + y * 13) % 7) + 1;
          if (type === 3) type = 1;
        }

        const cellType = getCellType(type);
        ctx.fillStyle = cellType.color;
        ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
      }
    }
  }

  // Convert canvas pixel coords to grid coords
  canvasToGrid(canvasX: number, canvasY: number): { x: number; y: number } | null {
    const { cellSize } = this.options;
    const x = Math.floor(canvasX / cellSize);
    const y = Math.floor(canvasY / cellSize);
    return { x, y };
  }
}
