import { create } from 'zustand';

// TypeScript interfaces
interface GameStoreState {
  xp: number;
  level: number;
  streak: number;
  health: number;
  totalChallengesCompleted: number;
  addXp: (amount: number) => void;
  takeDamage: () => void;
  resetGame: () => void;
  incrementStreak: () => void;
  resetStreak: () => void;
  levelUp: () => void;
}

// Initial values
const INITIAL_XP = 0;
const INITIAL_LEVEL = 1;
const INITIAL_STREAK = 0;
const INITIAL_HEALTH = 3;
const XP_PER_LEVEL = 100;

/**
 * Zustand store for game progression and stats
 */
export const useGameStore = create<GameStoreState>((set) => ({
  xp: INITIAL_XP,
  level: INITIAL_LEVEL,
  streak: INITIAL_STREAK,
  health: INITIAL_HEALTH,
  totalChallengesCompleted: 0,

  /**
   * Add XP to player (auto-level up if threshold reached)
   */
  addXp: (amount: number) =>
    set((state) => {
      const newXp = state.xp + amount;
      const xpNeeded = state.level * XP_PER_LEVEL;

      if (newXp >= xpNeeded) {
        return {
          xp: newXp - xpNeeded,
          level: state.level + 1,
          totalChallengesCompleted: state.totalChallengesCompleted + 1,
        };
      }

      return {
        xp: newXp,
        totalChallengesCompleted: state.totalChallengesCompleted + 1,
      };
    }),

  /**
   * Take damage (health decreases)
   */
  takeDamage: () =>
    set((state) => ({
      health: Math.max(0, state.health - 1),
      streak: 0,
    })),

  /**
   * Reset entire game
   */
  resetGame: () =>
    set({
      xp: INITIAL_XP,
      level: INITIAL_LEVEL,
      streak: INITIAL_STREAK,
      health: INITIAL_HEALTH,
      totalChallengesCompleted: 0,
    }),

  /**
   * Increment streak (consecutive correct answers)
   */
  incrementStreak: () =>
    set((state) => ({
      streak: state.streak + 1,
    })),

  /**
   * Reset streak (on wrong answer)
   */
  resetStreak: () =>
    set({
      streak: 0,
    }),

  /**
   * Manual level up (for testing or bonus levels)
   */
  levelUp: () =>
    set((state) => ({
      level: state.level + 1,
      xp: 0,
    })),
}));
