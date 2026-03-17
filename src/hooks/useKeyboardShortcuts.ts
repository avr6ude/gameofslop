import { useEffect } from 'react';
import { useSimulationStore } from '../stores/simulation-store';

export function useKeyboardShortcuts() {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't capture if user is typing in an input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      const state = useSimulationStore.getState();

      switch (e.code) {
        case 'Space':
          e.preventDefault();
          if (state.running) {
            state.pause();
          } else {
            state.play();
          }
          break;
        case 'ArrowRight':
          e.preventDefault();
          state.step();
          break;
        case 'KeyC':
          if (!e.ctrlKey && !e.metaKey) {
            state.clear();
          }
          break;
        case 'KeyR':
          if (!e.ctrlKey && !e.metaKey) {
            state.randomize();
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);
}
