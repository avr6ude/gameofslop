import { create } from 'zustand';
import { SimulationEngine } from '../simulation/engine';

interface SimulationState {
  engine: SimulationEngine;
  generation: number;
  running: boolean;
  speed: number;
  populations: Record<number, number>;
  toxicity: { value: number; label: string };
  gridSize: { width: number; height: number };
  wrap: boolean;
  renderVersion: number; // Increments on any grid change to trigger canvas redraw

  // Actions
  play: () => void;
  pause: () => void;
  step: () => void;
  setSpeed: (ms: number) => void;
  setCell: (x: number, y: number, type: number) => void;
  clear: () => void;
  randomize: () => void;
  resize: (width: number, height: number) => void;
  placePattern: (pattern: number[][], x: number, y: number) => void;
  setWrap: (wrap: boolean) => void;
  notifyTick: () => void;
}

const DEFAULT_WIDTH = 150;
const DEFAULT_HEIGHT = 150;

export const useSimulationStore = create<SimulationState>((set, get) => {
  const engine = new SimulationEngine(DEFAULT_WIDTH, DEFAULT_HEIGHT);

  engine.setOnTick(() => {
    get().notifyTick();
  });

  return {
    engine,
    generation: 0,
    running: false,
    speed: 200,
    populations: {},
    toxicity: { value: 0, label: 'The Internet Is Healing' },
    gridSize: { width: DEFAULT_WIDTH, height: DEFAULT_HEIGHT },
    wrap: true,
    renderVersion: 1,

    notifyTick: () => {
      const { engine } = get();
      set(state => ({
        generation: engine.generation,
        running: engine.running,
        populations: engine.grid.countPopulations(),
        toxicity: engine.computeToxicity(),
        renderVersion: state.renderVersion + 1,
      }));
    },

    play: () => {
      const { engine } = get();
      engine.play();
      set({ running: true });
    },

    pause: () => {
      const { engine } = get();
      engine.pause();
      set({ running: false });
    },

    step: () => {
      const { engine } = get();
      engine.step();
    },

    setSpeed: (ms: number) => {
      const { engine } = get();
      engine.setSpeed(ms);
      set({ speed: ms });
    },

    setCell: (x: number, y: number, type: number) => {
      const { engine } = get();
      engine.grid.set(x, y, type);
      get().notifyTick();
    },

    clear: () => {
      const { engine } = get();
      engine.clear();
      set(state => ({
        generation: 0,
        running: false,
        populations: {},
        toxicity: { value: 0, label: 'The Internet Is Healing' },
        renderVersion: state.renderVersion + 1,
      }));
    },

    randomize: () => {
      const { engine } = get();
      engine.randomize();
    },

    resize: (width: number, height: number) => {
      const { engine } = get();
      engine.resize(width, height);
      set(state => ({
        gridSize: { width, height },
        generation: 0,
        renderVersion: state.renderVersion + 1,
      }));
    },

    placePattern: (pattern: number[][], x: number, y: number) => {
      const { engine } = get();
      engine.placePattern(pattern, x, y);
      get().notifyTick();
    },

    setWrap: (wrap: boolean) => {
      const { engine } = get();
      engine.wrap = wrap;
      set({ wrap });
    },
  };
});
