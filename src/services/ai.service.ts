// TypeScript interfeyslari
interface CvData {
  fullName: string;
  profession: string;
  bio: string;
  skills: string[];
  experience: Array<{
    role: string;
    company: string;
    description: string;
  }>;
}

interface CvAnalysis {
  score: number;
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
}

interface GroqApiResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
}

// API konfiguratsiyasi
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const MODEL = 'llama-3.1-8b-instant';
const API_KEY = import.meta.env.VITE_GROQ_API_KEY;

/**
 * Validate that the AI response contains a valid CvAnalysis object
 */
const validateCvAnalysis = (data: unknown): CvAnalysis => {
  if (typeof data !== 'object' || data === null) {
    throw new Error('Javob obyekt emas.');
  }
  const obj = data as Record<string, unknown>;
  if (typeof obj.score !== 'number' || obj.score < 0 || obj.score > 100) {
    throw new Error('Score 0-100 orasida son bo\'lishi kerak.');
  }
  if (
    !Array.isArray(obj.strengths) ||
    !Array.isArray(obj.weaknesses) ||
    !Array.isArray(obj.recommendations)
  ) {
    throw new Error(
      'Strengths, weaknesses va recommendations massiv bo\'lishi kerak.'
    );
  }
  return data as CvAnalysis;
};

/**
 * Validate that the API key is configured
 */
const validateApiKey = (): void => {
  if (!API_KEY) {
    throw new Error(
      'API kalit o\'rnatilmagan! Iltimos .env faylini tekshiring.'
    );
  }
};

/**
 * Make an API request to Groq with exponential backoff retry logic
 * CRITICAL: Handles both standard and nested response formats from Groq API
 */
const makeApiRequest = async (
  messages: Array<{ role: string; content: string }>,
  temperature: number = 0.7,
  retries: number = 3
): Promise<string> => {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const response = await fetch(GROQ_API_URL, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: MODEL,
          messages,
          temperature,
          max_tokens: 2000,
        }),
      });

      if (!response.ok) {
        if (response.status === 429 && attempt < retries) {
          // Rate limit - exponential backoff retry
          const delayMs = Math.pow(2, attempt) * 1000;
          await new Promise((resolve) => setTimeout(resolve, delayMs));
          continue;
        }
        throw new Error(
          `API xatosi: ${response.status} ${response.statusText}`
        );
      }

      const data = (await response.json()) as GroqApiResponse;

      // Extract content from choices array (handles both standard format)
      if (
        data?.choices &&
        Array.isArray(data.choices) &&
        data.choices[0]?.message?.content
      ) {
        return data.choices[0].message.content.trim();
      }

      throw new Error('API javobi noto\'g\'ri formatda. Konsolni tekshiring.');
    } catch (error) {
      if (attempt === retries) {
        throw error;
      }
      console.warn(
        `API urinish ${attempt} muvaffaqiyatsiz, qayta urinish...`,
        error
      );
      // Continue to next attempt
    }
  }
  throw new Error('Barcha urinishlar muvaffaqiyatsiz.');
};

/**
 * Parse JSON response from AI, removing markdown code blocks and extra text
 */
const parseAndValidateJson = (jsonString: string): CvAnalysis => {
  try {
    // Step 1: Remove markdown code blocks
    let cleaned = jsonString
      .replace(/```json\s*/g, '')
      .replace(/```\s*$/g, '')
      .trim();

    // Step 2: Extract JSON object from the response
    // Find the first '{' and last '}' to extract just the JSON part
    const jsonStart = cleaned.indexOf('{');
    const jsonEnd = cleaned.lastIndexOf('}');

    if (jsonStart === -1 || jsonEnd === -1 || jsonStart >= jsonEnd) {
      throw new Error('JSON object not found in response');
    }

    cleaned = cleaned.substring(jsonStart, jsonEnd + 1).trim();

    // Step 3: Parse and validate
    const parsed = JSON.parse(cleaned);
    return validateCvAnalysis(parsed);
  } catch (parseError) {
    console.error(
      'JSON parsing xatolik:',
      parseError,
      'Raw response:',
      jsonString
    );
    throw new Error(
      'AI javobi JSON formatida emas yoki noto\'g\'ri. Iltimos qayta urinib ko\'ring.'
    );
  }
};

/**
 * Validate CV data before sending to AI
 */
const validateCvData = (cvData: CvData): void => {
  if (!cvData.fullName?.trim()) {
    throw new Error('Ism kiritilmagan.');
  }
  if (!cvData.profession?.trim()) {
    throw new Error('Kasb kiritilmagan.');
  }
  if (!cvData.bio?.trim()) {
    throw new Error('Bio kiritilmagan.');
  }
  if (!cvData.skills?.length || cvData.skills.every((s) => !s.trim())) {
    throw new Error('Kamida bitta ko\'nikma kiritilishi kerak.');
  }
  if (
    !cvData.experience?.length ||
    cvData.experience.every((e) => !e.role?.trim() || !e.company?.trim())
  ) {
    throw new Error('Kamida bitta tajriba kiritilishi kerak.');
  }
};

/**
 * AI Service - Handles all AI-powered features for DevMatch
 */
export const aiService = {
  /**
   * Generate a professional bio using AI
   */
  async generateBio(profession: string, skills: string): Promise<string> {
    validateApiKey();

    const prompt = `
      Siz jahon darajasidagi HR va Karyera maslahatchisisiz.
      Kasb: ${profession || 'IT Mutaxassisi'}.
      Ko'nikmalar: ${skills || 'Turli xil texnologiyalar'}.

      Vazifa: Ushbu ma'lumotlar asosida rezyume (CV) uchun xalqaro ATS tizimlaridan o'tadigan,
      professional, qisqa (3-4 gapdan iborat) va ta'sirchan "Summary/Bio" matnini INGLIZ TILIDA yozib bering.
      Hech qanday qo'shimcha so'zlar, tushuntirishlar yoki salomlashishlarsiz, faqat matnni o'zini bering.
    `;

    try {
      const content = await makeApiRequest([
        { role: 'user', content: prompt },
      ]);
      return content.replace(/^["']|["']$/g, '').trim();
    } catch (error) {
      console.error('Bio yaratishda xatolik:', error);
      throw new Error(
        'Bio yaratishda xatolik yuz berdi. Iltimos qayta urinib ko\'ring.'
      );
    }
  },

  /**
   * Analyze CV and provide professional feedback
   */
  async analyzeCv(cvData: CvData): Promise<CvAnalysis> {
    validateApiKey();
    validateCvData(cvData);

    // Structure CV data for AI analysis
    const cvText = `
      Ismi: ${cvData.fullName}
      Kasbi: ${cvData.profession}
      Bio: ${cvData.bio}
      Ko'nikmalar: ${cvData.skills.join(', ')}
      Tajriba: ${cvData.experience
        .map((e) => `${e.role} at ${e.company} - ${e.description}`)
        .join('; ')}
    `;

    const prompt = `Siz qattiqqo'l Xalqaro IT Rekrutersiz. Quyidagi CV ma'lumotlarini o'qing va FAQAT JSON formatida baholang:

${cvText}

⚠️ MUHIM QOIDALAR:
1. Javobingizni FAQAT O'ZBEK TILIDA bering.
2. Hech qanday qo'shimcha so'zlar, tushuntirishlar, oldingi gaplar yozmang.
3. FAQAT VA FAQAT bu JSON qaytaring - BOSHQA HECH NARSA EMAS:

{"score": 0 dan 100 gacha butun son, "strengths": ["kuchli tomon 1", "kuchli tomon 2", "kuchli tomon 3"], "weaknesses": ["zaif tomon 1", "zaif tomon 2"], "recommendations": ["maslahat 1", "maslahat 2", "maslahat 3"]}

Eslatma: Score ATS tizimlari va HR standartlari asosida aniqlansin. JAVOB FAQAT JSON BO'LISHI KERAK!`;

    try {
      const content = await makeApiRequest(
        [{ role: 'user', content: prompt }],
        0.1
      );
      return parseAndValidateJson(content);
    } catch (error) {
      console.error('CV tahlilida xatolik:', error);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('CV ni tahlil qilishda noma\'lum xatolik yuz berdi.');
    }
  },

  /**
   * Generate a buggy code challenge based on a specific weakness
   */
  async generateBugChallenge(
    weakness: string,
    level: number
  ): Promise<{
    title: string;
    description: string;
    buggyCode: string;
    language: string;
    solutionConcept: string;
  }> {
    validateApiKey();

    const difficultyLevel =
      level <= 3 ? 'easy' : level <= 6 ? 'medium' : 'hard';

    const prompt = `Siz qattiqqo'l Senior Developer xisob sifatida ishlaysiz. 
Vazifa: "${weakness}" zaif tomonini o'rganishga mo'ljallangan buggy kod snippet yaratish.
Difficulty: ${difficultyLevel} (1-10 scale: ${level}/10).

FAQAT VA FAQAT bu JSON qaytaring - BOSHQA HECH NARSA EMAS:
{"title": "Challenge nomi", "description": "Nima qilish kerakligini aniq aytish", "buggyCode": "JavaScript/React kod snippet (10-20 qator)", "language": "javascript", "solutionConcept": "Muammoning asosiy kontseptsiyasi"}

Talablar:
1. Kod bo'lishi kerak realistik ama xatoli
2. Xatoning sababini 1-2 ta xatossa qilib qo'yish
3. Title va description o'zbek tilida yozing
4. JSON format FAQAT BO'LISHI KERAK`;

    try {
      const content = await makeApiRequest(
        [{ role: 'user', content: prompt }],
        0.7
      );

      const jsonStart = content.indexOf('{');
      const jsonEnd = content.lastIndexOf('}');

      if (jsonStart === -1 || jsonEnd === -1 || jsonStart >= jsonEnd) {
        throw new Error('JSON not found in response');
      }

      const cleaned = content.substring(jsonStart, jsonEnd + 1).trim();
      const parsed = JSON.parse(cleaned);

      // Validate structure
      if (
        !parsed.title ||
        !parsed.description ||
        !parsed.buggyCode ||
        !parsed.language ||
        !parsed.solutionConcept
      ) {
        throw new Error('Missing required fields in response');
      }

      return parsed;
    } catch (error) {
      console.error('Bug challenge yaratishda xatolik:', error);
      throw new Error('Kod challenge yaratishda xatolik yuz berdi.');
    }
  },

  /**
   * Validate user's code fix attempt
   */
  async validateCodeFix(
    originalCode: string,
    userCode: string
  ): Promise<{
    isCorrect: boolean;
    feedback: string;
    hint: string;
  }> {
    validateApiKey();

    const prompt = `Siz qattiqqo'l Code Reviewer xisob sifatida ishlaysiz.
ORIGINAL XATO KOD:
\`\`\`javascript
${originalCode}
\`\`\`

FOYDALANUVCHINING JAVOB:
\`\`\`javascript
${userCode}
\`\`\`

VAZIFA: Foydalanuvchi original xatoli kodni to'g'irlashni uringan. Uning javob to'g'rimi yoki yo'qmi tekshiring.

FAQAT VA FAQAT bu JSON qaytaring - BOSHQA HECH NARSA EMAS:
{"isCorrect": true yoki false, "feedback": "Javob haqida qisqa tushuntirish (o'zbek tilida)", "hint": "Agar noto'g'ri bo'lsa, yordamchi maslahat (o'zbek tilida)"}

Qoidalar:
1. Agar sintaksis to'g'ri bo'lsa isCorrect: true
2. Agar xatoli concept tuzatilsa isCorrect: true
3. Feedback va Hint o'zbek tilida bo'lishi kerak
4. JAVOB FAQAT JSON BO'LISHI KERAK`;

    try {
      const content = await makeApiRequest(
        [{ role: 'user', content: prompt }],
        0.3
      );

      const jsonStart = content.indexOf('{');
      const jsonEnd = content.lastIndexOf('}');

      if (jsonStart === -1 || jsonEnd === -1 || jsonStart >= jsonEnd) {
        throw new Error('JSON not found in response');
      }

      const cleaned = content.substring(jsonStart, jsonEnd + 1).trim();
      const parsed = JSON.parse(cleaned);

      // Validate structure
      if (
        typeof parsed.isCorrect !== 'boolean' ||
        !parsed.feedback ||
        !parsed.hint
      ) {
        throw new Error('Invalid response structure');
      }

      return parsed;
    } catch (error) {
      console.error('Kod tekshirishda xatolik:', error);
      throw new Error('Kod tekshirishdа xatolik yuz berdi.');
    }
  },

  async generateBugChallenge(weakness: string, level: number): Promise<any> {
    validateApiKey();

    const prompt = `
      Siz qattiqqo'l Senior Dasturchisiz. Quyidagi mavzuda bitta xatosi bor kod yozing: "${weakness}".
      Qiyinchilik darajasi: ${level} / 10.
      
      Javobingiz FAQAT VA FAQAT JSON formatida bo'lsin:
      {
        "title": "Muammo nomi (masalan: UseEffect infinity loop)",
        "description": "Foydalanuvchiga muammo haqida qisqacha vazifa (o'zbek tilida)",
        "buggyCode": "xatosi bor kodning o'zi (hech qanday markdownlarsiz)",
        "language": "javascript",
        "solutionConcept": "buni yechish uchun nimani bilish kerak (o'zbek tilida)"
      }
    `;

    try {
      const content = await makeApiRequest([{ role: 'user', content: prompt }]);
      // JSON ni xavfsiz tozalab olish
      const cleaned = content.replace(/```json\s*/g, '').replace(/```\s*$/g, '').trim();
      return JSON.parse(cleaned);
    } catch (error) {
      console.error("Bug generation xatosi:", error);
      // Agar AI xato qilsa, dastur qotib qolmasligi uchun "Backup" savol beramiz
      return {
        title: "Kutish vaqti xatosi (setTimeout)",
        description: "Quyidagi kodda console.log darhol ishlamayapti, uni 1 soniyadan keyin ishlashini ta'minlang.",
        buggyCode: "function sayHello() {\n  setTimeout(console.log('Salom!'), 1000);\n}",
        language: "javascript",
        solutionConcept: "setTimeout callback funksiya kutadi."
      };
    }
  },

  /**
   * 4. Foydalanuvchi yozgan kodni tekshirish (Code Reviewer)
   */
  async validateCodeFix(originalCode: string, userCode: string): Promise<any> {
    validateApiKey();

    const prompt = `
      Siz qattiqqo'l Code Reviewersiz.
      Asl xatosi bor kod:
      ${originalCode}

      Foydalanuvchi jo'natgan to'g'rilangan kod:
      ${userCode}

      Foydalanuvchi kodni to'g'ri qildimi? Mantiq to'g'rimi?
      FAQAT VA FAQAT JSON formatida javob bering:
      {
        "isCorrect": true yoki false,
        "feedback": "Agar xato bo'lsa qayerda xato, to'g'ri bo'lsa qisqa maqtov (o'zbek tilida)",
        "hint": "Agar xato bo'lsa qanday to'g'irlash bo'yicha kichik ishora (o'zbek tilida)"
      }
    `;

    try {
      const content = await makeApiRequest([{ role: 'user', content: prompt }]);
      const cleaned = content.replace(/```json\s*/g, '').replace(/```\s*$/g, '').trim();
      return JSON.parse(cleaned);
    } catch (error) {
      console.error("Validation xatosi:", error);
      throw new Error("Kodni tekshirishda xatolik yuz berdi. Internetni tekshiring.");
    }
  }
};
