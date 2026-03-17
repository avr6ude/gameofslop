import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { useSimulationStore } from './simulation-store';

interface SettingsState {
  soundEnabled: boolean;
  crtEffect: boolean;
  cellSize: number;

  setSoundEnabled: (v: boolean) => void;
  setCrtEffect: (v: boolean) => void;
  setCellSize: (v: number) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      soundEnabled: true,
      crtEffect: true,
      cellSize: 16,

      setSoundEnabled: (v: boolean) => set({ soundEnabled: v }),
      setCrtEffect: (v: boolean) => set({ crtEffect: v }),
      setCellSize: (v: number) => {
        set({ cellSize: v });
        // Bump renderVersion to force canvas redraw
        useSimulationStore.getState().notifyTick();
      },
    }),
    {
      name: 'gameofslop-settings',
      version: 5,
    }
  )
);
