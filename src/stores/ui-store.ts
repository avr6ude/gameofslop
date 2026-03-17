import { create } from 'zustand';

export interface WindowState {
  visible: boolean;
  minimized: boolean;
  position: { x: number; y: number };
  zIndex: number;
}

interface UIState {
  windows: Record<string, WindowState>;
  activeWindow: string;
  startMenuOpen: boolean;
  selectedTool: number; // Cell type ID, 0 = eraser
  showGridLines: boolean;
  nextZIndex: number;

  // Actions
  focusWindow: (id: string) => void;
  minimizeWindow: (id: string) => void;
  restoreWindow: (id: string) => void;
  toggleWindow: (id: string) => void;
  closeWindow: (id: string) => void;
  setSelectedTool: (typeId: number) => void;
  toggleStartMenu: () => void;
  closeStartMenu: () => void;
  setWindowPosition: (id: string, x: number, y: number) => void;
  toggleGridLines: () => void;
}

const DEFAULT_WINDOWS: Record<string, WindowState> = {
  game: { visible: true, minimized: false, position: { x: 280, y: 8 }, zIndex: 3 },
  palette: { visible: true, minimized: false, position: { x: 8, y: 8 }, zIndex: 2 },
  stats: { visible: true, minimized: false, position: { x: 8, y: 500 }, zIndex: 1 },
};

export const useUIStore = create<UIState>((set, get) => ({
  windows: { ...DEFAULT_WINDOWS },
  activeWindow: 'game',
  startMenuOpen: false,
  selectedTool: 1,
  showGridLines: true,
  nextZIndex: 4,

  focusWindow: (id: string) => {
    const { windows, nextZIndex } = get();
    const win = windows[id];
    if (!win) return;
    set({
      windows: {
        ...windows,
        [id]: { ...win, zIndex: nextZIndex, minimized: false },
      },
      activeWindow: id,
      nextZIndex: nextZIndex + 1,
      startMenuOpen: false,
    });
  },

  minimizeWindow: (id: string) => {
    const { windows } = get();
    const win = windows[id];
    if (!win) return;
    set({
      windows: {
        ...windows,
        [id]: { ...win, minimized: true },
      },
    });
  },

  restoreWindow: (id: string) => {
    const { windows, nextZIndex } = get();
    const win = windows[id];
    if (!win) return;
    set({
      windows: {
        ...windows,
        [id]: { ...win, minimized: false, visible: true, zIndex: nextZIndex },
      },
      activeWindow: id,
      nextZIndex: nextZIndex + 1,
    });
  },

  toggleWindow: (id: string) => {
    const { windows } = get();
    const win = windows[id];
    if (!win) return;
    if (win.minimized || !win.visible) {
      get().restoreWindow(id);
    } else {
      get().minimizeWindow(id);
    }
  },

  closeWindow: (id: string) => {
    const { windows } = get();
    const win = windows[id];
    if (!win) return;
    set({
      windows: {
        ...windows,
        [id]: { ...win, visible: false },
      },
    });
  },

  setSelectedTool: (typeId: number) => {
    set({ selectedTool: typeId });
  },

  toggleStartMenu: () => {
    set(state => ({ startMenuOpen: !state.startMenuOpen }));
  },

  closeStartMenu: () => {
    set({ startMenuOpen: false });
  },

  setWindowPosition: (id: string, x: number, y: number) => {
    const { windows } = get();
    const win = windows[id];
    if (!win) return;
    set({
      windows: {
        ...windows,
        [id]: { ...win, position: { x, y } },
      },
    });
  },

  toggleGridLines: () => {
    set(state => ({ showGridLines: !state.showGridLines }));
  },
}));
