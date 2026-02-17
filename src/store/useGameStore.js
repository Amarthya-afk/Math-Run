import { create } from 'zustand';

export const useGameStore = create((set) => ({
  score: 0,
  distance: 0,
  isPlaying: false,
  isGameOver: false,
  isPaused: false,
  speed: 10,
  currentQuestion: null,
  
  startGame: () => set({ 
    isPlaying: true, 
    isGameOver: false, 
    score: 0, 
    distance: 0, 
    speed: 10,
    isPaused: false 
  }),
  
  endGame: () => set({ isPlaying: false, isGameOver: true, speed: 0 }),
  
  pauseGame: () => set((state) => ({ 
    isPaused: true, 
    previousSpeed: state.speed, 
    speed: 0 
  })),
  
  resumeGame: () => set((state) => ({ 
    isPaused: false, 
    speed: state.previousSpeed || 10 
  })),
  
  incrementScore: (points) => set((state) => ({ score: state.score + points })),
  
  updateDistance: (delta) => set((state) => ({ distance: state.distance + delta })),
  
  setQuestion: (question) => set({ currentQuestion: question }),
}));
