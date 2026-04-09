import {
  BrainCircuit,
  Edit3,
  Lightbulb,
  Target,
  Zap,
} from 'lucide-react';
import { useCallback, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { aiService } from '../services/ai.service';
import { useCvStore } from '../store/useCvStore';

// TypeScript interfaces for strict typing
interface CvAnalysisResult {
  score: number;
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
}

interface AnalysisError {
  type: 'validation' | 'network' | 'api' | 'parsing' | 'unknown';
  message: string;
  canRetry: boolean;
}

/**
 * Custom hook for CV analysis logic
 */
const useCvAnalysis = () => {
  const cvData = useCvStore();
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [result, setResult] = useState<CvAnalysisResult | null>(null);
  const [error, setError] = useState<AnalysisError | null>(null);
  const [retryCount, setRetryCount] = useState<number>(0);

  /**
   * Validate CV data completely before analysis
   */
  const validateCvData = useCallback((): string | null => {
    if (!cvData.fullName?.trim()) return 'Ismingizni kiriting';
    if (!cvData.profession?.trim()) return 'Kasbingizni kiriting';
    if (!cvData.bio?.trim()) return 'Bio/Summary qismini to\'ldiring';
    if (!cvData.skills?.trim()) return 'Kamida bitta ko\'nikmani kiriting';
    if (
      !cvData.experience?.length ||
      cvData.experience.every((exp) => !exp.role?.trim() || !exp.company?.trim())
    ) {
      return 'Kamida bitta ish tajribasini kiriting';
    }
    return null;
  }, [cvData]);

  /**
   * Classify error type for better UX
   */
  const classifyError = useCallback(
    (err: unknown): AnalysisError => {
      if (!(err instanceof Error)) {
        return {
          type: 'unknown',
          message: 'Tahlil qilishda xatolik yuz berdi. Qayta urinib ko\'ring.',
          canRetry: true,
        };
      }

      const message = err.message;

      if (message.includes('API kalit') || message.includes('konfiguratsiya')) {
        return {
          type: 'api',
          message:
            'API konfiguratsiyasi xato. Iltimos admin bilan bog\'laning.',
          canRetry: false,
        };
      }

      if (message.includes('network') || message.includes('fetch')) {
        return {
          type: 'network',
          message: 'Internet ulanishida muammo. Iltimos qayta urinib ko\'ring.',
          canRetry: true,
        };
      }

      if (message.includes('JSON') || message.includes('format')) {
        return {
          type: 'parsing',
          message: 'AI javobi noto\'g\'ri formatda. Qayta urinish mumkin.',
          canRetry: true,
        };
      }

      if (
        message.includes('Ism') ||
        message.includes('Kasb') ||
        message.includes('Bio') ||
        message.includes('ko\'nikma') ||
        message.includes('tajriba')
      ) {
        return { type: 'validation', message, canRetry: false };
      }

      return {
        type: 'unknown',
        message: 'Tahlil qilishda xatolik yuz berdi. Qayta urinib ko\'ring.',
        canRetry: true,
      };
    },
    []
  );

  /**
   * Perform CV analysis
   */
  const analyzeCv = useCallback(async (): Promise<void> => {
    const validationError = validateCvData();
    if (validationError) {
      setError({
        type: 'validation',
        message: validationError,
        canRetry: false,
      });
      return;
    }

    setIsAnalyzing(true);
    setError(null);

    try {
      const analysisData = await aiService.analyzeCv({
        fullName: cvData.fullName,
        profession: cvData.profession,
        bio: cvData.bio,
        skills: cvData.skills
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean),
        experience: cvData.experience,
      });

      setResult(analysisData);
      setRetryCount(0);
    } catch (err: unknown) {
      const classifiedError = classifyError(err);
      setError(classifiedError);
      setRetryCount((prev) => prev + 1);
    } finally {
      setIsAnalyzing(false);
    }
  }, [cvData, validateCvData, classifyError]);

  /**
   * Retry analysis with exponential backoff
   */
  const retryAnalysis = useCallback((): void => {
    if (error?.canRetry) {
      analyzeCv();
    }
  }, [error, analyzeCv]);

  /**
   * Reset analysis state
   */
  const resetAnalysis = useCallback((): void => {
    setResult(null);
    setError(null);
    setRetryCount(0);
  }, []);

  // Computed values for UI state
  const isDataComplete = useMemo(() => !validateCvData(), [validateCvData]);
  const canRetry = error?.canRetry && retryCount < 3;

  return {
    cvData,
    isAnalyzing,
    result,
    error,
    retryCount,
    isDataComplete,
    canRetry,
    analyzeCv,
    retryAnalysis,
    resetAnalysis,
  };
};

/**
 * Get score-based styling configuration
 */
const getScoreConfig = (
  score: number
): {
  color: string;
  bgColor: string;
  borderColor: string;
  label: string;
} => {
  if (score >= 85)
    return {
      color: 'text-emerald-400',
      bgColor: 'bg-emerald-500/10',
      borderColor: 'border-emerald-500/20',
      label: 'Ajoyib natija!',
    };
  if (score >= 70)
    return {
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/10',
      borderColor: 'border-blue-500/20',
      label: 'Yaxshi natija',
    };
  if (score >= 50)
    return {
      color: 'text-yellow-400',
      bgColor: 'bg-yellow-500/10',
      borderColor: 'border-yellow-500/20',
      label: 'O\'rtacha, yaxshilash mumkin',
    };
  return {
    color: 'text-red-400',
    bgColor: 'bg-red-500/10',
    borderColor: 'border-red-500/20',
    label: 'Jiddiy yaxshilash kerak',
  };
};

/**
 * Circular progress SVG component
 */
interface CircularProgressProps {
  percentage: number;
  label: string;
}

const CircularProgress = ({ percentage, label }: CircularProgressProps) => {
  const circumference = 2 * Math.PI * 45;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative w-40 h-40">
      <svg className="w-full h-full transform -rotate-90" viewBox="0 0 120 120">
        <circle
          cx="60"
          cy="60"
          r="45"
          fill="none"
          stroke="currentColor"
          strokeWidth="8"
          className="text-gray-800"
        />
        <circle
          cx="60"
          cy="60"
          r="45"
          fill="none"
          stroke="currentColor"
          strokeWidth="8"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className={`${getScoreConfig(percentage).color} transition-all duration-500`}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className={`text-3xl font-black ${getScoreConfig(percentage).color}`}>
          {percentage}
        </div>
        <div className="text-xs text-gray-500">{label}</div>
      </div>
    </div>
  );
};

export default function CvAnalyzer() {
  const {
    isAnalyzing,
    result,
    error,
    isDataComplete,
    canRetry,
    analyzeCv,
    retryAnalysis,
    resetAnalysis,
  } = useCvAnalysis();

  return (
    <div className="max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col items-center text-center mb-10">
        <div className="w-16 h-16 bg-linear-to-br from-blue-500/20 to-purple-500/20 text-blue-400 rounded-2xl flex items-center justify-center mb-4 border border-blue-500/20">
          <BrainCircuit size={32} />
        </div>
        <h1 className="text-3xl font-bold mb-2 bg-linear-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
          Sun'iy Intellekt CV Tahlili
        </h1>
        <p className="text-gray-400 max-w-2xl leading-relaxed">
          Sizning rezyumengizni xalqaro ATS standartlari va HR talablari
          asosida chuqur tahlil qilamiz. Kuchli va zaif tomonlaringizni
          aniqlab, professional maslahatlar beramiz.
        </p>
      </div>

      {/* Initial State */}
      {!result && !isAnalyzing && (
        <div className="bg-gray-900/50 border border-gray-800/50 rounded-2xl p-10 backdrop-blur-sm">
          <div className="text-center">
            <div className="w-20 h-20 bg-linear-to-br from-blue-500/10 to-purple-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-blue-500/20">
              <Zap size={40} className="text-blue-400" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">
              Tahlilni boshlash uchun tayyormisiz?
            </h3>
            <p className="text-gray-400 mb-6 max-w-lg mx-auto">
              AI sizning CV ma'lumotlaringizni professional tarzda tahlil qilib,
              xalqaro standartlar bo'yicha baholaydi.
            </p>

            {/* Error Display */}
            {error && (
              <div
                className={`mb-6 p-4 rounded-xl border backdrop-blur-sm ${
                  error.type === 'validation'
                    ? 'bg-yellow-500/10 border-yellow-500/30 text-yellow-300'
                    : 'bg-red-500/10 border-red-500/30 text-red-300'
                }`}
              >
                <p className="font-medium mb-3">{error.message}</p>
                {canRetry && (
                  <button
                    onClick={retryAnalysis}
                    className="text-sm bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    Qayta urinish (Urinish {3 - (3 - 1)} / 3)
                  </button>
                )}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link
                to="/builder"
                className="flex items-center gap-2 px-6 py-3 rounded-xl border border-gray-700 text-gray-300 hover:bg-gray-800 hover:border-gray-600 transition-all"
              >
                <Edit3 size={18} />
                CV ni tahrirlash
              </Link>
              <button
                onClick={() => analyzeCv()}
                disabled={!isDataComplete}
                className={`flex items-center gap-2 px-8 py-3 rounded-xl font-medium transition-all ${
                  isDataComplete
                    ? 'bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg shadow-blue-500/20'
                    : 'bg-gray-800 text-gray-500 cursor-not-allowed'
                }`}
              >
                <Target size={18} />
                Tahlilni Boshlash
              </button>
            </div>

            {!isDataComplete && (
              <p className="text-sm text-gray-500 mt-4">
                Tahlil uchun barcha ma'lumotlarni to'ldiring
              </p>
            )}
          </div>
        </div>
      )}

      {/* Loading State */}
      {isAnalyzing && (
        <div className="bg-gray-900/50 border border-gray-800/50 rounded-2xl p-16 backdrop-blur-sm">
          <div className="flex flex-col items-center justify-center">
            <div className="relative mb-8">
              <div className="w-20 h-20 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <BrainCircuit size={24} className="text-blue-400" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">
              AI rezyumengizni tahlil qilmoqda...
            </h2>
            <div className="flex items-center gap-2 text-gray-400">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
              <span>ATS tizimi simulyatsiyasi</span>
            </div>
            <div className="flex items-center gap-2 text-gray-400 mt-2">
              <div
                className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"
                style={{ animationDelay: '0.2s' }}
              ></div>
              <span>HR standartlari bo'yicha baholash</span>
            </div>
            <div className="flex items-center gap-2 text-gray-400 mt-2">
              <div
                className="w-2 h-2 bg-green-500 rounded-full animate-pulse"
                style={{ animationDelay: '0.4s' }}
              ></div>
              <span>Maslahatlar tayyorlanmoqda</span>
            </div>
          </div>
        </div>
      )}

      {/* Results */}
      {result && !isAnalyzing && (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
          {/* Score Card */}
          <div className="bg-gray-900/50 border border-gray-800/50 rounded-2xl p-8 backdrop-blur-sm">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="shrink-0">
                <CircularProgress
                  percentage={result.score}
                  label={getScoreConfig(result.score).label}
                />
              </div>

              <div className="flex-1 text-center md:text-left">
                <h2 className="text-3xl font-bold text-white mb-2">
                  {getScoreConfig(result.score).label}
                </h2>
                <p className="text-gray-400 mb-6">
                  Sizning CV niz ATS tizimi va HR standartlari bo'yicha{' '}
                  <span className={`font-bold ${getScoreConfig(result.score).color}`}>
                    {result.score}/100
                  </span>{' '}
                  baho oldi. Bu natija Xalqaro darajadagi kompaniyalarda
                  imkoniyatingizni ko'rsatadi.
                </p>
                <button
                  onClick={resetAnalysis}
                  className="text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors"
                >
                  Qayta tahlil qilish
                </button>
              </div>
            </div>
          </div>

          {/* Analysis Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Strengths */}
            <div
              className={`${getScoreConfig(result.score).bgColor} border ${getScoreConfig(result.score).borderColor} rounded-2xl p-6`}
            >
              <h3 className="text-xl font-bold text-emerald-400 flex items-center gap-2 mb-4">
                <Zap size={20} />
                Kuchli Tomonlar
              </h3>
              <ul className="space-y-3">
                {result.strengths.map((strength, index) => (
                  <li
                    key={index}
                    className="flex gap-3 text-sm text-gray-300 items-start"
                  >
                    <span className="text-green-500 mt-1 shrink-0">✓</span>
                    <span>{strength}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Weaknesses */}
            <div className="bg-red-500/5 border border-red-500/20 rounded-2xl p-6">
              <h3 className="text-xl font-bold text-red-400 flex items-center gap-2 mb-4">
                <Lightbulb size={20} />
                Yaxshilash Kerak Bo'lgan Tomonlar
              </h3>
              <ul className="space-y-3">
                {result.weaknesses.map((weakness, index) => (
                  <li
                    key={index}
                    className="flex gap-3 text-sm text-gray-300 items-start"
                  >
                    <span className="text-red-500 mt-1 shrink-0">⚠</span>
                    <span>{weakness}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Recommendations */}
          <div className="bg-blue-500/5 border border-blue-500/20 rounded-2xl p-6">
            <h3 className="text-xl font-bold text-blue-400 flex items-center gap-2 mb-6">
              <Lightbulb size={20} />
              AI Maslahatlari (Keyingi qadamlar)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {result.recommendations.map((rec, index) => (
                <div
                  key={index}
                  className="bg-blue-500/5 border border-blue-500/10 rounded-lg p-4"
                >
                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-500/10 text-blue-400 flex items-center justify-center shrink-0 font-bold border border-blue-500/20">
                      {index + 1}
                    </div>
                    <p className="text-sm text-gray-300">{rec}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Action Button */}
          <div className="flex justify-center">
            <Link
              to="/game"
              className="bg-linear-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-4 rounded-xl font-bold shadow-lg shadow-purple-500/20 transition-all flex items-center gap-2"
            >
              <Target size={20} />
              Arena'da Zaif Qo'nikmalarni To'g'irlang
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
