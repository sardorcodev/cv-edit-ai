import { Link } from 'react-router-dom';
import { motion, type Variants } from 'framer-motion';
import {
  ArrowRight,
  BadgeCheck,
  BarChart3,
  BrainCircuit,
  BriefcaseBusiness,
  CheckCircle2,
  ChevronRight,
  Code2,
  FileCheck2,
  Gamepad2,
  type LucideIcon,
  PenTool,
  Rocket,
  ShieldCheck,
  Sparkles,
  Target,
  Users,
  Wand2,
  Zap,
} from 'lucide-react';

type FeatureItem = {
  title: string;
  description: string;
  icon: LucideIcon;
  accent: string;
  bullets: string[];
};

type StatItem = {
  value: string;
  label: string;
  helper: string;
};

type StepItem = {
  step: string;
  title: string;
  description: string;
  icon: LucideIcon;
};

type AudienceItem = {
  title: string;
  description: string;
  icon: LucideIcon;
};

type FaqItem = {
  question: string;
  answer: string;
};

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  visible: (index: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.55,
      delay: index * 0.08,
      ease: [0.22, 1, 0.36, 1],
    },
  }),
} satisfies Variants;

const stagger = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
    },
  },
} satisfies Variants;

const features: FeatureItem[] = [
  {
    title: 'AI CV Builder',
    description:
      'Tartibli, zamonaviy va recruiter-friendly CV yarating. Har bir tajriba, loyiha va summary bo‘limini AI bilan professional darajaga olib chiqing.',
    icon: PenTool,
    accent: 'from-blue-500/20 to-cyan-500/20 text-blue-400 border-blue-500/25',
    bullets: [
      'Har bir experience uchun AI Magic rewriting',
      'Jonli professional preview',
      'Action-oriented bullet point generatsiyasi',
    ],
  },
  {
    title: 'ATS Analyzer',
    description:
      'CV’ni faqat “chiroyli” emas, balki ATS va HR nuqtai nazaridan ham tahlil qiladi. Kuchli va zaif joylaringizni aniq ko‘rsatadi.',
    icon: BarChart3,
    accent: 'from-violet-500/20 to-fuchsia-500/20 text-violet-400 border-violet-500/25',
    bullets: [
      'ATS score va section breakdown',
      'Missing skills va keyword gap analysis',
      'Aniq, amaliy optimizatsiya tavsiyalari',
    ],
  },
  {
    title: 'Adaptive Debug Arena',
    description:
      'Zaifliklaringizga mos ravishda bug’li React/TypeScript challenge’lar yaratadi. O‘rganish, practice va gamification bitta oqimga birlashadi.',
    icon: Gamepad2,
    accent: 'from-pink-500/20 to-rose-500/20 text-pink-400 border-pink-500/25',
    bullets: [
      'AI-generated bug challenge',
      'Level, streak, timer va score tizimi',
      'Weakness-based adaptive difficulty',
    ],
  },
  {
    title: 'Roadmap & Interview Prep',
    description:
      'Qayerda ekansiz, nimani yetishtirishingiz kerak va keyingi bosqichga qanday chiqishingiz mumkin — buni aniq reja ko‘rinishida beradi.',
    icon: Rocket,
    accent: 'from-emerald-500/20 to-teal-500/20 text-emerald-400 border-emerald-500/25',
    bullets: [
      '5 ta individual interview savoli',
      'Short / mid / long term career roadmap',
      'Texnologiyalar va portfolio growth plan',
    ],
  },
];

const stats: StatItem[] = [
  {
    value: '4-in-1',
    label: 'yagona developer career platform',
    helper: 'CV, analysis, debugging arena va roadmap bitta oqimda',
  },
  {
    value: 'ATS + AI',
    label: 'ikki qatlamli tahlil mexanizmi',
    helper: 'Deterministic scoring va AI insight birgalikda ishlaydi',
  },
  {
    value: 'Real Practice',
    label: 'weakness-based challenge flow',
    helper: 'Tahlildan keyin to‘g‘ridan-to‘g‘ri amaliy mashq',
  },
];

const steps: StepItem[] = [
  {
    step: '01',
    title: 'CV ni yarating yoki yaxshilang',
    description:
      'Summary, skills, experiences va projects bo‘limlarini to‘ldiring, AI esa ularni professional formatga keltiradi.',
    icon: Wand2,
  },
  {
    step: '02',
    title: 'ATS va skill gap tahlilini oling',
    description:
      'Qaysi texnologiyalar yetishmayapti, qayerda ta’sirli gaplar yo‘q, qaysi joylarda keyword optimization kerakligi ko‘rsatiladi.',
    icon: BrainCircuit,
  },
  {
    step: '03',
    title: 'Adaptive arena’da practice qiling',
    description:
      'Zaif joylaringizga mos bug challenge’larni ishlab, real skill’ni mustahkamlaysiz.',
    icon: Code2,
  },
  {
    step: '04',
    title: 'Export va interview prep bilan tayyor bo‘ling',
    description:
      'Professional PDF eksport qiling, individual savollarni ko‘ring va keyingi o‘sish rejasini oling.',
    icon: FileCheck2,
  },
];

const audiences: AudienceItem[] = [
  {
    title: 'Junior Developerlar',
    description:
      'CV’ni professional ko‘rinishga keltirish, skill gapni topish va practice orqali o‘sish uchun.',
    icon: Users,
  },
  {
    title: 'Internship izlayotganlar',
    description:
      'ATS ga mos rezyume, kuchli positioning va interview tayyorgarligi uchun.',
    icon: BriefcaseBusiness,
  },
  {
    title: 'Middle bosqichga chiqmoqchilar',
    description:
      'Tajribani kuchliroq ko‘rsatish, texnik bo‘shliqlarni topish va roadmap tuzish uchun.',
    icon: Target,
  },
];

const faqs: FaqItem[] = [
  {
    question: 'DevMatch AI oddiy CV builderdan nimasi bilan farq qiladi?',
    answer:
      'Bu faqat CV yozdirib beradigan servis emas. U rezyumeni yozadi, ATS nuqtai nazaridan tekshiradi, zaifliklarni topadi, keyin o‘sha zaifliklarga mos debugging challenge va career roadmap beradi.',
  },
  {
    question: 'CV tahlili faqat AI ga tayanadimi?',
    answer:
      'Yo‘q. Kuchli arxitektura uchun tahlil ikki qatlamda ishlaydi: deterministic ATS logic va undan keyingi AI explanation. Bu natijani barqarorroq va amaliyroq qiladi.',
  },
  {
    question: 'Code Arena kimlar uchun foydali?',
    answer:
      'Junior, internship izlayotganlar, frontend boshlovchilar va React/TypeScript bo‘yicha zaif joylarini practice orqali to‘ldirmoqchi bo‘lganlar uchun ayniqsa foydali.',
  },
  {
    question: 'PDF eksport ishga topshirishga mos bo‘ladimi?',
    answer:
      'Ha. Web interfeys dark premium uslubda bo‘lishi mumkin, lekin eksport recruiter-friendly, toza, print-safe va professional formatda bo‘ladi.',
  },
];

function SectionBadge({ children }: { children: React.ReactNode }) {
  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/80 backdrop-blur-xl">
      <Sparkles className="h-4 w-4 text-blue-400" />
      <span>{children}</span>
    </div>
  );
}

function SectionHeading({
  eyebrow,
  title,
  description,
  centered = false,
}: {
  eyebrow: string;
  title: string;
  description: string;
  centered?: boolean;
}) {
  return (
    <div className={centered ? 'mx-auto max-w-3xl text-center' : 'max-w-3xl'}>
      <p className="mb-4 text-sm font-semibold uppercase tracking-[0.24em] text-blue-400">
        {eyebrow}
      </p>
      <h2 className="text-3xl font-black tracking-tight text-white sm:text-4xl md:text-5xl">
        {title}
      </h2>
      <p className="mt-5 text-base leading-8 text-slate-400 sm:text-lg">
        {description}
      </p>
    </div>
  );
}

function FeatureCard({ item, index }: { item: FeatureItem; index: number }) {
  const Icon = item.icon;

  return (
    <motion.article
      custom={index}
      variants={fadeUp}
      whileHover={{ y: -8, scale: 1.01 }}
      className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] p-7 shadow-[0_0_0_1px_rgba(255,255,255,0.02)] backdrop-blur-xl transition-all"
    >
      <div className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
        <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-blue-500/10 blur-3xl" />
        <div className="absolute -bottom-10 -left-10 h-28 w-28 rounded-full bg-purple-500/10 blur-3xl" />
      </div>

      <div
        className={`relative flex h-14 w-14 items-center justify-center rounded-2xl border bg-linear-to-br ${item.accent}`}
      >
        <Icon className="h-6 w-6" />
      </div>

      <h3 className="relative mt-6 text-2xl font-bold text-white">{item.title}</h3>
      <p className="relative mt-3 leading-7 text-slate-400">{item.description}</p>

      <ul className="relative mt-6 space-y-3">
        {item.bullets.map((bullet) => (
          <li key={bullet} className="flex items-start gap-3 text-sm text-slate-300">
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-blue-400" />
            <span>{bullet}</span>
          </li>
        ))}
      </ul>
    </motion.article>
  );
}

function StatCard({ item, index }: { item: StatItem; index: number }) {
  return (
    <motion.div
      custom={index}
      variants={fadeUp}
      className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-xl"
    >
      <div className="text-3xl font-black text-white sm:text-4xl">{item.value}</div>
      <p className="mt-2 text-base font-semibold text-slate-200">{item.label}</p>
      <p className="mt-2 text-sm leading-6 text-slate-400">{item.helper}</p>
    </motion.div>
  );
}

function StepCard({ item, index }: { item: StepItem; index: number }) {
  const Icon = item.icon;

  return (
    <motion.div
      custom={index}
      variants={fadeUp}
      className="relative rounded-3xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-xl"
    >
      <div className="mb-5 flex items-center justify-between">
        <span className="text-sm font-bold tracking-[0.2em] text-blue-400">{item.step}</span>
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-slate-900/80 text-white">
          <Icon className="h-5 w-5" />
        </div>
      </div>
      <h3 className="text-xl font-bold text-white">{item.title}</h3>
      <p className="mt-3 leading-7 text-slate-400">{item.description}</p>
    </motion.div>
  );
}

export default function Home() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#020617] text-white">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-0 h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-blue-500/10 blur-[140px]" />
        <div className="absolute right-0 top-[20%] h-[320px] w-[320px] rounded-full bg-fuchsia-500/10 blur-[130px]" />
        <div className="absolute bottom-[10%] left-[5%] h-[280px] w-[280px] rounded-full bg-cyan-500/10 blur-[120px]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(148,163,184,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(148,163,184,0.06)_1px,transparent_1px)] bg-[size:56px_56px] [mask-image:radial-gradient(circle_at_center,black,transparent_85%)]" />
      </div>

      <main className="relative z-10">
        {/* Hero */}
        <section className="mx-auto max-w-7xl px-4 pb-16 pt-10 sm:px-6 sm:pb-20 md:pt-16 lg:px-8 lg:pb-28">
          <div className="grid items-center gap-14 lg:grid-cols-[1.05fr_0.95fr]">
            <motion.div
              initial="hidden"
              animate="visible"
              variants={stagger}
              className="max-w-3xl"
            >
              <motion.div variants={fadeUp} custom={0}>
                <SectionBadge>AI-powered developer career acceleration platform</SectionBadge>
              </motion.div>

              <motion.h1
                variants={fadeUp}
                custom={1}
                className="mt-6 text-4xl font-black tracking-tight text-white sm:text-5xl md:text-6xl xl:text-7xl"
              >
                CV’dan{' '}
                <span className="bg-linear-to-r from-blue-400 via-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
                  ish taklifigacha
                </span>{' '}
                bo‘lgan yo‘lni tizimli kuchaytiring
              </motion.h1>

              <motion.p
                variants={fadeUp}
                custom={2}
                className="mt-6 max-w-2xl text-lg leading-8 text-slate-400 sm:text-xl"
              >
                DevMatch AI — dasturchilar uchun professional CV builder, ATS analyzer,
                adaptive debugging arena va personal career roadmap’ni bitta premium
                platformada birlashtiradi.
              </motion.p>

              <motion.div
                variants={fadeUp}
                custom={3}
                className="mt-8 flex flex-col gap-4 sm:flex-row"
              >
                <Link
                  to="/builder"
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-linear-to-r from-blue-600 to-violet-600 px-7 py-4 text-base font-bold text-white shadow-[0_10px_40px_rgba(59,130,246,0.25)] transition-transform duration-300 hover:scale-[1.02]"
                >
                  Bepul boshlash
                  <ArrowRight className="h-5 w-5" />
                </Link>

                <a
                  href="#features"
                  className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-7 py-4 text-base font-semibold text-slate-200 backdrop-blur-xl transition hover:bg-white/10"
                >
                  Platformani ko‘rish
                  <ChevronRight className="h-5 w-5" />
                </a>
              </motion.div>

              <motion.div
                variants={fadeUp}
                custom={4}
                className="mt-10 flex flex-wrap gap-3"
              >
                {[
                  'Professional CV writing',
                  'ATS simulation',
                  'Adaptive debugging',
                  'Interview prep',
                ].map((pill) => (
                  <div
                    key={pill}
                    className="rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm text-slate-300"
                  >
                    {pill}
                  </div>
                ))}
              </motion.div>
            </motion.div>

            <motion.div
              initial="hidden"
              animate="visible"
              variants={stagger}
              className="relative"
            >
              <motion.div
                custom={0}
                variants={fadeUp}
                className="rounded-[32px] border border-white/10 bg-white/[0.05] p-5 shadow-2xl backdrop-blur-2xl"
              >
                <div className="rounded-[28px] border border-white/10 bg-slate-950/80 p-5">
                  <div className="flex items-center justify-between border-b border-white/10 pb-4">
                    <div>
                      <p className="text-sm text-slate-400">DevMatch AI Dashboard</p>
                      <h3 className="mt-1 text-xl font-bold text-white">
                        Career Intelligence Panel
                      </h3>
                    </div>
                    <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-sm font-semibold text-emerald-300">
                      Live
                    </div>
                  </div>

                  <div className="mt-5 grid gap-4 sm:grid-cols-2">
                    <motion.div
                      whileHover={{ y: -4 }}
                      className="rounded-2xl border border-white/10 bg-white/[0.04] p-4"
                    >
                      <div className="flex items-center justify-between">
                        <div className="rounded-xl bg-blue-500/10 p-3 text-blue-400">
                          <BarChart3 className="h-5 w-5" />
                        </div>
                        <span className="text-xs text-slate-500">ATS SCORE</span>
                      </div>
                      <div className="mt-4 text-3xl font-black text-white">88/100</div>
                      <p className="mt-2 text-sm text-slate-400">
                        Keyword match va impact language yaxshilangan
                      </p>
                    </motion.div>

                    <motion.div
                      whileHover={{ y: -4 }}
                      className="rounded-2xl border border-white/10 bg-white/[0.04] p-4"
                    >
                      <div className="flex items-center justify-between">
                        <div className="rounded-xl bg-violet-500/10 p-3 text-violet-400">
                          <BrainCircuit className="h-5 w-5" />
                        </div>
                        <span className="text-xs text-slate-500">SKILL GAP</span>
                      </div>
                      <div className="mt-4 text-lg font-bold text-white">
                        Testing • System Design
                      </div>
                      <p className="mt-2 text-sm text-slate-400">
                        Keyingi growth uchun ustuvor texnologiyalar belgilangan
                      </p>
                    </motion.div>

                    <motion.div
                      whileHover={{ y: -4 }}
                      className="rounded-2xl border border-white/10 bg-white/[0.04] p-4"
                    >
                      <div className="flex items-center justify-between">
                        <div className="rounded-xl bg-pink-500/10 p-3 text-pink-400">
                          <Gamepad2 className="h-5 w-5" />
                        </div>
                        <span className="text-xs text-slate-500">ARENA</span>
                      </div>
                      <div className="mt-4 text-lg font-bold text-white">
                        React State Bug Challenge
                      </div>
                      <p className="mt-2 text-sm text-slate-400">
                        CV natijasiga mos adaptive practice tayyor
                      </p>
                    </motion.div>

                    <motion.div
                      whileHover={{ y: -4 }}
                      className="rounded-2xl border border-white/10 bg-white/[0.04] p-4"
                    >
                      <div className="flex items-center justify-between">
                        <div className="rounded-xl bg-emerald-500/10 p-3 text-emerald-400">
                          <FileCheck2 className="h-5 w-5" />
                        </div>
                        <span className="text-xs text-slate-500">EXPORT</span>
                      </div>
                      <div className="mt-4 text-lg font-bold text-white">
                        Recruiter-ready PDF
                      </div>
                      <p className="mt-2 text-sm text-slate-400">
                        Toza, print-safe va professional final format
                      </p>
                    </motion.div>
                  </div>

                  <div className="mt-5 rounded-2xl border border-blue-500/20 bg-linear-to-r from-blue-500/10 via-violet-500/10 to-fuchsia-500/10 p-4">
                    <div className="flex items-start gap-3">
                      <div className="rounded-xl bg-white/10 p-2 text-blue-300">
                        <Zap className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-semibold text-white">
                          AI recommendation summary
                        </p>
                        <p className="mt-1 text-sm leading-6 text-slate-300">
                          “CV’ingizdagi tajribalarni measurable impact bilan yozing,
                          testing stack qo‘shing va arena orqali async/state challenge’larni
                          practice qiling.”
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Stats */}
        <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.25 }}
            variants={stagger}
            className="grid gap-4 md:grid-cols-3"
          >
            {stats.map((item, index) => (
              <StatCard key={item.label} item={item} index={index} />
            ))}
          </motion.div>
        </section>

        {/* Features */}
        <section
          id="features"
          className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28"
        >
          <SectionHeading
            eyebrow="Platform capabilities"
            title="Dasturchining o‘sish yo‘lini bir joyga jamlagan kuchli ekotizim"
            description="DevMatch AI alohida-alohida vositalar to‘plami emas. U CV writing, ATS analysis, skill practice va career growth’ni ketma-ket, bog‘langan product flow’ga aylantiradi."
            centered
          />

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={stagger}
            className="mt-14 grid gap-6 lg:grid-cols-2"
          >
            {features.map((item, index) => (
              <FeatureCard key={item.title} item={item} index={index} />
            ))}
          </motion.div>
        </section>

        {/* Why it converts */}
        <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
          <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.25 }}
              variants={fadeUp}
              custom={0}
              className="rounded-[32px] border border-white/10 bg-white/[0.04] p-8 backdrop-blur-xl"
            >
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-blue-400">
                Nega bu landing kuchli?
              </p>
              <h3 className="mt-4 text-3xl font-black text-white">
                Faqat “nima qilamiz” emas, “nega foydali” degan savolga ham javob beradi
              </h3>
              <p className="mt-5 leading-8 text-slate-400">
                Kuchli home page foydalanuvchiga faqat feature ro‘yxatini ko‘rsatmaydi.
                U muammoni, qiymatni, jarayonni va natijani bir xil oqimda tushuntiradi.
                Shu sababli bu landing product positioning va conversion uchun ancha yaxshiroq.
              </p>

              <div className="mt-8 space-y-4">
                {[
                  'Aniq product narrative: CV → analysis → practice → roadmap',
                  'Premium first impression va modern visual hierarchy',
                  'Universal auditoriya: junior, internship, growth-minded developers',
                  'Kelajakda analytics, testimonials va API-driven stats qo‘shishga tayyor',
                ].map((point) => (
                  <div
                    key={point}
                    className="flex items-start gap-3 rounded-2xl border border-white/10 bg-slate-950/50 p-4"
                  >
                    <BadgeCheck className="mt-0.5 h-5 w-5 shrink-0 text-blue-400" />
                    <span className="text-slate-300">{point}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.25 }}
              variants={stagger}
              className="grid gap-6 sm:grid-cols-2"
            >
              {[
                {
                  title: 'Ishonch uyg‘otadi',
                  text: 'Visual design, copy va structure foydalanuvchiga mahsulotning jiddiy va professional ekanini his qildiradi.',
                  icon: ShieldCheck,
                },
                {
                  title: 'Tez tushuntiradi',
                  text: 'Yangi kirgan foydalanuvchi bir necha soniyada platforma nima qilishini anglaydi.',
                  icon: Zap,
                },
                {
                  title: 'Harakatga undaydi',
                  text: 'CTA lar faqat chiroyli emas, product flow bilan mantiqan bog‘langan.',
                  icon: Rocket,
                },
                {
                  title: 'O‘sishga tayyor',
                  text: 'Keyinroq testimonials, pricing, blog, leaderboard yoki demo video qo‘shish oson bo‘ladi.',
                  icon: Target,
                },
              ].map((item, index) => {
                const Icon = item.icon;

                return (
                  <motion.div
                    key={item.title}
                    custom={index}
                    variants={fadeUp}
                    whileHover={{ y: -6 }}
                    className="rounded-[28px] border border-white/10 bg-white/[0.04] p-6 backdrop-blur-xl"
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/5 text-blue-400">
                      <Icon className="h-5 w-5" />
                    </div>
                    <h4 className="mt-5 text-xl font-bold text-white">{item.title}</h4>
                    <p className="mt-3 leading-7 text-slate-400">{item.text}</p>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>
        </section>

        {/* Steps */}
        <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
          <SectionHeading
            eyebrow="How it works"
            title="Foydalanuvchini birinchi klikdan real progressgacha olib boradigan oqim"
            description="Mahsulotning kuchi modullarning ko‘pligida emas, ular orasidagi ulanishda. DevMatch AI har bir bosqichni keyingisiga tayyorlaydi."
            centered
          />

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={stagger}
            className="mt-14 grid gap-6 lg:grid-cols-4"
          >
            {steps.map((item, index) => (
              <StepCard key={item.step} item={item} index={index} />
            ))}
          </motion.div>
        </section>

        {/* Audience */}
        <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
          <div className="rounded-[36px] border border-white/10 bg-linear-to-br from-white/[0.05] to-white/[0.03] p-8 backdrop-blur-2xl sm:p-10">
            <SectionHeading
              eyebrow="Built for growth"
              title="Kimlar uchun ayniqsa foydali?"
              description="Universal mahsulot bo‘lishi kerak, lekin positioning aniq bo‘lsa conversion kuchliroq bo‘ladi. Shu sababli asosiy auditoriya qatlamlari quyidagilar."
            />

            <div className="mt-10 grid gap-6 lg:grid-cols-3">
              {audiences.map((item, index) => {
                const Icon = item.icon;

                return (
                  <motion.div
                    key={item.title}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.25 }}
                    variants={fadeUp}
                    custom={index}
                    className="rounded-3xl border border-white/10 bg-slate-950/60 p-6"
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-400">
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="mt-5 text-xl font-bold text-white">{item.title}</h3>
                    <p className="mt-3 leading-7 text-slate-400">{item.description}</p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="mx-auto max-w-5xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
          <SectionHeading
            eyebrow="FAQ"
            title="Foydalanuvchi berishi mumkin bo‘lgan asosiy savollarga oldindan javob"
            description="Kuchli landing foydalanuvchining shubhalarini kamaytiradi. Shu sababli aniq va sodda FAQ blok foydali."
            centered
          />

          <div className="mt-14 space-y-4">
            {faqs.map((faq, index) => (
              <motion.details
                key={faq.question}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.25 }}
                variants={fadeUp}
                custom={index}
                className="group rounded-3xl border border-white/10 bg-white/[0.04] p-0 backdrop-blur-xl"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-6 py-5">
                  <span className="text-left text-lg font-semibold text-white">
                    {faq.question}
                  </span>
                  <ChevronRight className="h-5 w-5 shrink-0 text-slate-400 transition-transform duration-300 group-open:rotate-90" />
                </summary>
                <div className="px-6 pb-6 pt-1 text-slate-400">{faq.answer}</div>
              </motion.details>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="mx-auto max-w-7xl px-4 pb-24 sm:px-6 lg:px-8 lg:pb-32">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.25 }}
            variants={fadeUp}
            custom={0}
            className="relative overflow-hidden rounded-[36px] border border-blue-500/20 bg-linear-to-r from-blue-600/15 via-violet-600/15 to-fuchsia-600/15 p-8 text-center shadow-[0_20px_80px_rgba(59,130,246,0.08)] backdrop-blur-2xl sm:p-12"
          >
            <div className="absolute inset-0">
              <div className="absolute left-1/4 top-0 h-32 w-32 rounded-full bg-blue-500/15 blur-3xl" />
              <div className="absolute bottom-0 right-1/4 h-32 w-32 rounded-full bg-fuchsia-500/15 blur-3xl" />
            </div>

            <div className="relative z-10 mx-auto max-w-3xl">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl border border-white/10 bg-white/10 text-blue-300">
                <Sparkles className="h-7 w-7" />
              </div>

              <h2 className="mt-6 text-3xl font-black tracking-tight text-white sm:text-4xl md:text-5xl">
                Rezyumeni shunchaki yozmang — uni strategik qurolga aylantiring
              </h2>

              <p className="mt-5 text-base leading-8 text-slate-300 sm:text-lg">
                DevMatch AI sizga faqat chiroyli CV emas, balki kuchli positioning,
                aniq skill gap analysis, real practice va o‘sish yo‘lini beradi.
              </p>

              <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
                <Link
                  to="/builder"
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-linear-to-r from-blue-600 to-violet-600 px-8 py-4 text-base font-bold text-white shadow-[0_12px_40px_rgba(59,130,246,0.25)] transition-transform duration-300 hover:scale-[1.02]"
                >
                  Hoziroq boshlash
                  <ArrowRight className="h-5 w-5" />
                </Link>

                <Link
                  to="/analyzer"
                  className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-8 py-4 text-base font-semibold text-slate-200 backdrop-blur-xl transition hover:bg-white/10"
                >
                  ATS tahlilni ko‘rish
                  <ChevronRight className="h-5 w-5" />
                </Link>
              </div>
            </div>
          </motion.div>
        </section>
      </main>
    </div>
  );
}