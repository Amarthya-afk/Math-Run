import { create } from 'zustand';

export const useGameStore = create((set, get) => ({
  score: 0,
  distance: 0,
  lives: 4,
  isPlaying: false,
  isGameOver: false,
  isPaused: false,
  speed: 10,
  displayQuestion: "Run!",
  feedbackMessage: null,
  isWaitingForInput: false,
  previousSpeed: 10,
  runId: 0,

  startGame: () => {
    set((state) => ({
      isPlaying: true,
      isGameOver: false,
      score: 0,
      distance: 0,
      speed: 10,
      lives: 4,
      isPaused: false,
      isWaitingForInput: false,
      feedbackMessage: null,
      displayQuestion: "Run!",
      runId: state.runId + 1
    }));
  },

  endGame: () => set({ isPlaying: false, isGameOver: true, speed: 0 }),

  pauseGame: () => set((state) => ({ isPaused: true, previousSpeed: state.speed, speed: 0 })),
  resumeGame: () => set((state) => ({ isPaused: false, speed: state.previousSpeed || 10 })),

  waitForInput: () => set((state) => ({
    isWaitingForInput: true,
    previousSpeed: state.speed > 0 ? state.speed : 10,
    speed: 0
  })),

  resumeRun: () => set((state) => ({
    isWaitingForInput: false,
    speed: state.previousSpeed
  })),

  incrementScore: (points) => set((state) => ({ score: state.score + points })),
  updateDistance: (delta) => set((state) => ({ distance: state.distance + delta })),

  setDisplayQuestion: (text) => set({ displayQuestion: text }),

  submitAnswer: (isCorrect) => {
    const state = get();
    if (state.isGameOver) return;

    if (isCorrect) {
      set((state) => ({ score: state.score + 100 }));
    } else {
      const newLives = state.lives - 1;
      set({
        lives: newLives,
        feedbackMessage: "Oops! Wrong Answer!",
      });

      // Clear feedback
      setTimeout(() => set({ feedbackMessage: null }), 1500);

      if (newLives <= 0) {
        state.endGame();
      }
    }
  }
}));
