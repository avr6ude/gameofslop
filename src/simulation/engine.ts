import { Grid } from './grid';
import { evaluateTick } from './rules-engine';
import { CELL_TYPES } from './cell-types';

export type TickCallback = (grid: Grid, generation: number) => void;

export class SimulationEngine {
  grid: Grid;
  generation: number = 0;
  running: boolean = false;
  speed: number = 200; // ms per tick
  wrap: boolean = true;
  private tickTimeout: ReturnType<typeof setTimeout> | null = null;
  private onTick: TickCallback | null = null;

  constructor(width: number, height: number) {
    this.grid = new Grid(width, height);
  }

  setOnTick(callback: TickCallback): void {
    this.onTick = callback;
  }

  tick(): void {
    evaluateTick(this.grid, this.wrap);
    this.grid.swap();
    this.generation++;
    this.onTick?.(this.grid, this.generation);
  }

  play(): void {
    if (this.running) return;
    this.running = true;
    this.scheduleTick();
  }

  pause(): void {
    this.running = false;
    if (this.tickTimeout !== null) {
      clearTimeout(this.tickTimeout);
      this.tickTimeout = null;
    }
  }

  step(): void {
    this.pause();
    this.tick();
  }

  setSpeed(ms: number): void {
    this.speed = ms;
    if (this.running) {
      if (this.tickTimeout !== null) {
        clearTimeout(this.tickTimeout);
      }
      this.scheduleTick();
    }
  }

  private scheduleTick(): void {
    if (!this.running) return;
    this.tickTimeout = setTimeout(() => {
      this.tick();
      this.scheduleTick();
    }, this.speed);
  }

  clear(): void {
    this.pause();
    this.grid.clear();
    this.generation = 0;
    this.onTick?.(this.grid, this.generation);
  }

  randomize(density: number = 0.3): void {
    this.pause();
    this.grid.randomize(density, CELL_TYPES.length - 1);
    this.generation = 0;
    this.onTick?.(this.grid, this.generation);
  }

  resize(width: number, height: number): void {
    this.pause();
    this.grid = new Grid(width, height);
    this.generation = 0;
    this.onTick?.(this.grid, this.generation);
  }

  setCell(x: number, y: number, type: number): void {
    this.grid.set(x, y, type);
    this.onTick?.(this.grid, this.generation);
  }

  placePattern(pattern: number[][], x: number, y: number): void {
    this.grid.placePattern(pattern, x, y);
    this.onTick?.(this.grid, this.generation);
  }

  computeToxicity(): { value: number; label: string } {
    const populations = this.grid.countPopulations();
    const aliveCells = Object.values(populations).reduce((a, b) => a + b, 0);

    if (aliveCells === 0) return { value: 0, label: 'The Internet Is Healing' };

    // Average toxicity weight per alive cell (range roughly 0.3 to 2.5)
    let weighted = 0;
    for (const type of CELL_TYPES) {
      if (type.id === 0) continue;
      weighted += (populations[type.id] || 0) * type.toxicityWeight;
    }
    const avgWeight = weighted / aliveCells; // ~0.3 to ~2.5

    // Density factor: what fraction of the grid is alive (0 to 1)
    const totalCells = this.grid.width * this.grid.height;
    const density = aliveCells / totalCells;

    // Toxicity = average_weight * density, scaled so diverse ecosystem at 30% fill ≈ 40%
    // and toxic monoculture at 80% fill ≈ 90%
    const value = Math.min(100, avgWeight * density * 70);

    let label: string;
    if (value < 10) label = 'The Internet Is Healing';
    else if (value < 25) label = 'Mildly Polluted';
    else if (value < 50) label = 'Peak Content Farm';
    else if (value < 75) label = 'Dead Internet Theory Confirmed';
    else label = "We Didn't Listen";

    return { value, label };
  }

  destroy(): void {
    this.pause();
    this.onTick = null;
  }
}
