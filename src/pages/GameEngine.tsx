import {
  AlertCircle,
  CheckCircle,
  Code,
  Gamepad2,
  Heart,
  Lightbulb,
  RotateCcw,
  Trophy,
  Zap
} from 'lucide-react';
import { useCallback, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { aiService } from '../services/ai.service';
import { useGameStore } from '../store/useGameStore';

// TypeScript interfaces
interface BugChallenge {
  title: string;
  description: string;
  buggyCode: string;
  language: string;
  solutionConcept: string;
}

interface ValidationResult {
  isCorrect: boolean;
  feedback: string;
  hint: string;
}

interface CodeArenaState {
  challenge: BugChallenge | null;
  userCode: string;
  isLoading: boolean;
  isValidating: boolean;
  validationResult: ValidationResult | null;
  showSuccessModal: boolean;
  showFailModal: boolean;
  attemptCount: number;
  weakness: string;
}

/**
 * Custom hook for Code Arena game logic
 */
const useCodeArena = () => {
  const gameStore = useGameStore();
  const [state, setState] = useState<CodeArenaState>({
    challenge: null,
    userCode: '',
    isLoading: false,
    isValidating: false,
    validationResult: null,
    showSuccessModal: false,
    showFailModal: false,
    attemptCount: 0,
    weakness: 'React Hooks',
  });

  /**
   * Load new challenge based on current level
   */
  const loadChallenge = useCallback(async (): Promise<void> => {
    setState((prev) => ({ ...prev, isLoading: true }));

    try {
      const weaknesses = [
        'React Hooks',
        'Async/Await',
        'TypeScript Types',
        'Memory Leaks',
        'State Management',
      ];

      const selectedWeakness = weaknesses[gameStore.level % weaknesses.length];

      const challenge = await aiService.generateBugChallenge(
        selectedWeakness,
        gameStore.level
      );

      setState((prev) => ({
        ...prev,
        challenge,
        userCode: challenge.buggyCode,
        isLoading: false,
        validationResult: null,
        showSuccessModal: false,
        showFailModal: false,
        attemptCount: 0,
        weakness: selectedWeakness,
      }));
    } catch (error) {
      console.error('Challenge loading error:', error);
      setState((prev) => ({ ...prev, isLoading: false }));
    }
  }, [gameStore.level]);

  /**
   * Submit code fix for validation
   */
  const submitFix = useCallback(async (): Promise<void> => {
    if (!state.challenge || !state.userCode.trim()) return;

    setState((prev) => ({ ...prev, isValidating: true }));

    try {
      const result = await aiService.validateCodeFix(
        state.challenge.buggyCode,
        state.userCode
      );

      setState((prev) => ({
        ...prev,
        validationResult: result,
        isValidating: false,
      }));

      if (result.isCorrect) {
        // Success!
        gameStore.addXp(50 + gameStore.level * 10);
        gameStore.incrementStreak();
        setState((prev) => ({ ...prev, showSuccessModal: true }));
      } else {
        // Failure
        gameStore.takeDamage();
        setState((prev) => ({
          ...prev,
          showFailModal: true,
          attemptCount: prev.attemptCount + 1,
        }));
      }
    } catch (error) {
      console.error('Validation error:', error);
      setState((prev) => ({
        ...prev,
        isValidating: false,
        showFailModal: true,
      }));
    }
  }, [state.challenge, state.userCode, gameStore]);

  /**
   * Get hint (costs 20 XP)
   */
  const getHint = useCallback((): void => {
    if (gameStore.xp >= 20 && state.validationResult) {
      gameStore.addXp(-20);
    }
  }, [gameStore, state.validationResult]);

  /**
   * Next challenge
   */
  const nextChallenge = useCallback((): void => {
    setState((prev) => ({
      ...prev,
      showSuccessModal: false,
    }));
    loadChallenge();
  }, [loadChallenge]);

  const resetAttempt = useCallback((): void => {
    setState((prev) => ({
      ...prev,
      userCode: prev.challenge?.buggyCode || '',
      validationResult: null,
      showFailModal: false,
      attemptCount: 0,
    }));
  }, []);

  return {
    state,
    setState,
    loadChallenge,
    submitFix,
    getHint,
    nextChallenge,
    resetAttempt,
  };
};

export default function GameEngine() {
  const {
    state,
    setState: updateState,
    loadChallenge,
    submitFix,
    getHint,
    nextChallenge,
    resetAttempt,
  } = useCodeArena();

  const gameStore = useGameStore();

  // Load challenge on mount
  const mounted = useState(false)[0];
  if (!mounted && !state.challenge && !state.isLoading) {
    setTimeout(() => loadChallenge(), 0);
  }

  // Calculate XP progress to next level
  const xpProgress = useMemo(() => {
    const xpNeeded = gameStore.level * 100;
    return Math.round((gameStore.xp / xpNeeded) * 100);
  }, [gameStore.xp, gameStore.level]);

  return (
    <div className="min-h-screen bg-black text-white font-mono overflow-hidden">
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-linear-to-br from-purple-900/20 via-black to-emerald-900/20 pointer-events-none" />

      {/* HEADER - HUD Stats */}
      <header className="border-b border-purple-900/30 bg-black/80 backdrop-blur-xl sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between gap-8">
            {/* Left: Title & Level */}
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-linear-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center border border-purple-400/50">
                <Gamepad2 size={22} className="text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-transparent bg-linear-to-r from-purple-400 to-pink-400 bg-clip-text">
                  Code Arena
                </h1>
                <p className="text-xs text-gray-500">Level {gameStore.level}</p>
              </div>
            </div>

            {/* Center: Health & Streak */}
            <div className="flex items-center gap-6">
              {/* Health */}
              <div className="flex items-center gap-2">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Heart
                    key={i}
                    size={20}
                    className={
                      i < gameStore.health
                        ? 'fill-red-500 text-red-500'
                        : 'text-gray-700'
                    }
                  />
                ))}
              </div>

              {/* Streak */}
              {gameStore.streak > 0 && (
                <div className="px-3 py-1 bg-emerald-500/20 border border-emerald-500/50 rounded-full flex items-center gap-2 animate-pulse">
                  <Zap size={16} className="text-emerald-400" />
                  <span className="text-sm font-bold text-emerald-400">
                    {gameStore.streak} Streak
                  </span>
                </div>
              )}
            </div>

            {/* Right: XP Bar */}
            <div className="flex items-center gap-3 min-w-64">
              <div className="flex-1">
                <div className="h-2 bg-gray-900 rounded-full overflow-hidden border border-purple-500/30">
                  <div
                    className="h-full bg-linear-to-r from-purple-500 to-pink-500 transition-all duration-300"
                    style={{ width: `${xpProgress}%` }}
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {gameStore.xp}/{gameStore.level * 100} XP
                </p>
              </div>
              <Link
                to="/analyzer"
                className="text-gray-500 hover:text-gray-300 transition-colors text-sm"
              >
                ← Back
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 py-8">
        {state.isLoading ? (
          // Loading State
          <div className="flex items-center justify-center h-96">
            <div className="relative">
              <div className="absolute inset-0 blur-xl bg-linear-to-r from-purple-500 to-pink-500 opacity-30 rounded-full animate-pulse" />
              <div className="relative flex flex-col items-center gap-4">
                <Code size={48} className="text-purple-400 animate-spin" />
                <p className="text-purple-400 text-lg font-bold">
                  Challenge quymaqda...
                </p>
              </div>
            </div>
          </div>
        ) : !state.challenge ? (
          // Error/No Challenge
          <div className="flex items-center justify-center h-96">
            <button
              onClick={() => loadChallenge()}
              className="px-6 py-3 bg-linear-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-lg font-bold transition-all"
            >
              Boshlash
            </button>
          </div>
        ) : (
          // Game View
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* LEFT PANEL - Mission */}
            <div className="space-y-4">
              {/* Challenge Header Card */}
              <div className="border border-purple-900/50 bg-black/50 backdrop-blur rounded-xl p-6 space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Lightbulb size={18} className="text-yellow-400" />
                    <span className="text-xs font-bold text-yellow-400 uppercase">
                      {state.weakness}
                    </span>
                  </div>
                  <h2 className="text-2xl font-black text-transparent bg-linear-to-r from-purple-300 to-pink-300 bg-clip-text">
                    {state.challenge.title}
                  </h2>
                </div>

                <p className="text-gray-300 leading-relaxed text-sm">
                  {state.challenge.description}
                </p>

                <div className="bg-emerald-900/20 border border-emerald-500/30 rounded-lg p-3">
                  <p className="text-xs font-bold text-emerald-400 mb-1">
                    💡 CONCEPT
                  </p>
                  <p className="text-sm text-gray-300">
                    {state.challenge.solutionConcept}
                  </p>
                </div>

                {/* Validation Status */}
                {state.validationResult && (
                  <div
                    className={`border rounded-lg p-4 space-y-2 ${
                      state.validationResult.isCorrect
                        ? 'border-emerald-500/50 bg-emerald-900/20'
                        : 'border-red-500/50 bg-red-900/20'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      {state.validationResult.isCorrect ? (
                        <>
                          <CheckCircle
                            size={18}
                            className="text-emerald-400"
                          />
                          <span className="font-bold text-emerald-400">
                            To'g'ri!
                          </span>
                        </>
                      ) : (
                        <>
                          <AlertCircle size={18} className="text-red-400" />
                          <span className="font-bold text-red-400">
                            Xato ({state.attemptCount}/3)
                          </span>
                        </>
                      )}
                    </div>
                    <p className="text-sm text-gray-300">
                      {state.validationResult.feedback}
                    </p>

                    {!state.validationResult.isCorrect && (
                      <button
                        onClick={getHint}
                        disabled={gameStore.xp < 20}
                        className="text-xs bg-blue-600/30 hover:bg-blue-600/50 disabled:bg-gray-700 border border-blue-500/50 text-blue-300 disabled:text-gray-500 px-3 py-1 rounded transition-all"
                      >
                        💡 Maslahat ({gameStore.xp >= 20 ? '20 XP' : 'XP yetarli emas'})
                      </button>
                    )}
                  </div>
                )}
              </div>

              {/* Challenge Metadata */}
              <div className="grid grid-cols-2 gap-3">
                <div className="border border-purple-900/30 bg-black/30 rounded-lg p-3">
                  <p className="text-xs text-gray-500 mb-1">TILNI</p>
                  <p className="font-bold text-purple-300">
                    {state.challenge.language}
                  </p>
                </div>
                <div className="border border-purple-900/30 bg-black/30 rounded-lg p-3">
                  <p className="text-xs text-gray-500 mb-1">DARAJA</p>
                  <p className="font-bold text-purple-300">Level {gameStore.level}</p>
                </div>
              </div>
            </div>

            {/* RIGHT PANEL - Code Editor */}
            <div className="space-y-4 flex flex-col">
              {/* Editor Container */}
              <div className="flex-1 border border-purple-900/50 bg-black/50 backdrop-blur rounded-xl overflow-hidden flex flex-col">
                {/* Editor Header */}
                <div className="border-b border-purple-900/30 px-4 py-3 bg-black/80 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Code size={16} className="text-purple-400" />
                    <span className="text-sm font-bold text-purple-400">
                      CODE.JS
                    </span>
                  </div>
                  <span className="text-xs text-gray-600">
                    {state.userCode.split('\n').length} lines
                  </span>
                </div>

                {/* Code Editor */}
                <textarea
                  value={state.userCode}
                  onChange={(e) =>
                    updateState((prev) => ({
                      ...prev,
                      userCode: e.target.value,
                    }))
                  }
                  disabled={state.isValidating}
                  className="flex-1 bg-black text-green-400 font-mono text-sm p-4 focus:outline-none resize-none border-none placeholder-gray-700 disabled:opacity-50"
                  placeholder="// Kodingizni shu yerga yozing..."
                  spellCheck="false"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                {!state.validationResult ? (
                  <>
                    <button
                      onClick={submitFix}
                      disabled={state.isValidating || !state.userCode.trim()}
                      className="flex-1 group relative px-6 py-3 rounded-lg font-bold overflow-hidden transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <div className="absolute inset-0 bg-linear-to-r from-purple-600 to-pink-600 group-hover:from-purple-700 group-hover:to-pink-700 transition-all" />
                      <div className="absolute inset-0 bg-linear-to-r from-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 blur-lg transition-all" />
                      <div className="relative flex items-center justify-center gap-2">
                        {state.isValidating ? (
                          <>
                            <span className="animate-spin">⚙️</span>
                            Tekshirilmoqda...
                          </>
                        ) : (
                          <>
                            <Zap size={18} />
                            Tekshirish
                          </>
                        )}
                      </div>
                    </button>

                    <button
                      onClick={resetAttempt}
                      className="px-4 py-3 rounded-lg border border-gray-700 hover:border-gray-600 hover:bg-gray-900/50 transition-all"
                    >
                      <RotateCcw size={18} />
                    </button>
                  </>
                ) : state.validationResult.isCorrect ? (
                  <button
                    onClick={nextChallenge}
                    className="flex-1 group relative px-6 py-3 rounded-lg font-bold overflow-hidden transition-all"
                  >
                    <div className="absolute inset-0 bg-linear-to-r from-emerald-600 to-teal-600 group-hover:from-emerald-700 group-hover:to-teal-700 transition-all" />
                    <div className="absolute inset-0 bg-linear-to-r from-emerald-600 to-teal-600 opacity-0 group-hover:opacity-100 blur-lg transition-all" />
                    <div className="relative flex items-center justify-center gap-2 text-white">
                      <Trophy size={18} />
                      Keyingi Challenge
                    </div>
                  </button>
                ) : (
                  <>
                    <button
                      onClick={resetAttempt}
                      className="flex-1 px-6 py-3 rounded-lg border border-yellow-600 hover:bg-yellow-600/20 text-yellow-400 font-bold transition-all"
                    >
                      Qayta Urinish
                    </button>

                    {state.attemptCount >= 3 && gameStore.health > 0 && (
                      <button
                        onClick={nextChallenge}
                        className="flex-1 px-6 py-3 rounded-lg font-bold bg-gray-800 hover:bg-gray-700 transition-all"
                      >
                        O'tib ketish
                      </button>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* GAME OVER MODAL */}
      {gameStore.health === 0 && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/80 backdrop-blur">
          <div className="border border-red-600/50 bg-black/90 rounded-xl p-8 max-w-md space-y-6 text-center">
            <div className="text-5xl">💀</div>
            <h2 className="text-3xl font-black text-red-400">GAME OVER</h2>
            <div className="space-y-2 text-gray-300">
              <p>Sehatlaring tamom bo'ldi</p>
              <p className="text-2xl font-bold text-purple-400">
                Level {gameStore.level} o'tib oldingiz
              </p>
              <p className="text-sm">
                Umumiy XP: {gameStore.xp} | Challenges: {gameStore.totalChallengesCompleted}
              </p>
            </div>
            <button
              onClick={() => {
                gameStore.resetGame();
                window.location.reload();
              }}
              className="w-full px-6 py-3 bg-linear-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-lg font-bold transition-all"
            >
              Qayta Boshlash
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
