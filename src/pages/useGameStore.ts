import { create } from 'zustand';

interface GameState {
  xp: number;
  level: number;
  streak: number;
  health: number;
  totalChallengesCompleted: number;
  addXp: (amount: number) => void;
  takeDamage: () => void;
  incrementStreak: () => void;
  resetGame: () => void;
}

export const useGameStore = create<GameState>((set) => ({
  xp: 0,
  level: 1,
  streak: 0,
  health: 3, // 3 ta jon beramiz
  totalChallengesCompleted: 0,

  addXp: (amount) => set((state) => {
    const newXp = state.xp + amount;
    const xpNeeded = state.level * 100; // Har level uchun ko'proq XP kerak
    
    // Level Up mantig'i
    if (newXp >= xpNeeded) {
      return { 
        xp: newXp - xpNeeded, 
        level: state.level + 1 
      };
    }
    return { xp: Math.max(0, newXp) }; // XP minusga kirib ketmasligi uchun
  }),

  takeDamage: () => set((state) => ({ 
    health: Math.max(0, state.health - 1), 
    streak: 0 // Xato qilsa streak (qatorasiga topish) kuyadi
  })),

  incrementStreak: () => set((state) => ({ 
    streak: state.streak + 1, 
    totalChallengesCompleted: state.totalChallengesCompleted + 1 
  })),

  resetGame: () => set({ 
    xp: 0, 
    level: 1, 
    streak: 0, 
    health: 3, 
    totalChallengesCompleted: 0 
  })
}));