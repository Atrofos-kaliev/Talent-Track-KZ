import Link from "next/link";
import { BrainCircuit, TrendingUp, Users, Zap } from "lucide-react";

const primaryColorText = "text-[#143c80]";
const primaryColorBorder = "border-[#143c80]";
const primaryColorBg = "bg-[#143c80]";
const accentColorText = "text-[#0d2d62]";
const accentColorBg = "bg-[#0d2d62]";
const secondaryTextColorClass = "text-[#143c80]/80";
const lightBorderColorClass = "border-[#143c80]/20";

const features = [
  {
    icon: BrainCircuit,
    title: "AI-Анализ",
    description:
      "Наш ИИ анализирует ваши навыки и интересы, сопоставляя их с трендами рынка труда.",
  },
  {
    icon: TrendingUp,
    title: "Карьерный Рост",
    description:
      "Получите персонализированный roadmap для достижения выбранной карьерной цели.",
  },
  {
    icon: Users,
    title: "Локальная Экспертиза",
    description:
      "Рекомендации адаптированы под рынок труда Казахстана и его специфику.",
  },
];

const AnimatedBackground = () => (
  <>
    <div className="bgSquaresUp" aria-hidden="true">
      <div className="squareUp"></div>
      <div className="squareUp"></div>
      <div className="squareUp"></div>
      <div className="squareUp"></div>
      <div className="squareUp"></div>
      <div className="squareUp"></div>
      <div className="squareUp"></div>
      <div className="squareUp"></div>
      <div className="squareUp"></div>
      <div className="squareUp"></div>
    </div>
    <div className="bgSquaresDown" aria-hidden="true">
      <div className="squareDown"></div>
      <div className="squareDown"></div>
      <div className="squareDown"></div>
      <div className="squareDown"></div>
      <div className="squareDown"></div>
      <div className="squareDown"></div>
      <div className="squareDown"></div>
      <div className="squareDown"></div>
      <div className="squareDown"></div>
      <div className="squareDown"></div>
    </div>
  </>
);

export default function HomePage() {
  const buttonPrimaryClasses =
    `inline-flex items-center justify-center px-8 py-3.5 text-lg font-medium rounded-md shadow-sm
     ${primaryColorBg} text-white hover:${accentColorBg} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0d2d62]
     transition-all duration-300 group hover:scale-105 hover:shadow-md`;

  const buttonGhostClasses =
    `inline-flex items-center justify-center px-8 py-3.5 text-lg font-medium rounded-md
     ${primaryColorText} border ${primaryColorBorder} hover:bg-[#143c80]/10
     focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#143c80]
     transition-all duration-300 group hover:scale-105`;

  return (
    <div className="relative min-h-screen bg-white">
      <AnimatedBackground />
      <div className="relative z-10 flex flex-col items-center text-center space-y-16 sm:space-y-24 bg-transparent pt-20 md:pt-24 pb-12 md:pb-16">
        <section className="w-full max-w-4xl px-4">
          <h1 className={`text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-tight mb-6 ${primaryColorText}`}>
            <span className="block">Откройте свой</span>
            <span className={`block ${accentColorText} py-2`}>
              карьерный потенциал с AI
            </span>
          </h1>
          <p className={`mt-6 text-lg sm:text-xl leading-relaxed ${secondaryTextColorClass} max-w-2xl mx-auto`}>
            Наш интеллектуальный сервис поможет вам найти идеальную профессию в
            Казахстане, проанализировав ваши уникальные таланты и предложив
            конкретный план развития.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-x-6">
            <Link
              href="/survey"
              className={`${buttonPrimaryClasses} w-full sm:w-auto`}
            >
              <Zap size={20} className="mr-2 group-hover:animate-pingOnce" />
              Начать подбор
            </Link>
            <Link
              href="#how-it-works"
              className={`${buttonGhostClasses} w-full sm:w-auto`}
            >
              Как это работает?
              <span
                aria-hidden="true"
                className="ml-1.5 transition-transform group-hover:translate-x-1"
              >
                →
              </span>
            </Link>
          </div>
        </section>

        <section id="how-it-works" className="w-full max-w-5xl px-4 scroll-mt-24">
          <h2 className={`text-3xl sm:text-4xl font-bold ${accentColorText} mb-4 text-center`}>
            Простой путь к вашей мечте
          </h2>
          <p className={`text-lg ${secondaryTextColorClass} mb-12 text-center max-w-2xl mx-auto`}>
            Всего несколько шагов отделяют вас от понимания, какая карьера вам
            подходит лучше всего.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {features.map((feature, index) => (
              <div
                key={feature.title}
                className={`bg-white p-6 sm:p-8 text-left rounded-xl border ${lightBorderColorClass} shadow-lg
                           hover:border-[#143c80]/40 hover:shadow-xl hover:-translate-y-1 transition-all duration-300`}
              >
                <div className={`flex items-center justify-center w-12 h-12 bg-[#143c80]/10 rounded-lg mb-5 border ${lightBorderColorClass}`}>
                  <feature.icon className={`w-6 h-6 ${primaryColorText}`} />
                </div>
                <h3 className={`text-xl font-semibold ${primaryColorText} mb-2`}>
                  {index + 1}. {feature.title}
                </h3>
                <p className={`${secondaryTextColorClass} text-sm leading-relaxed`}>
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section className="w-full max-w-3xl px-4">
          <h2 className={`text-3xl sm:text-4xl font-bold ${accentColorText} mb-10 text-center`}>
            Подробный процесс
          </h2>
          <ol className="space-y-8">
            {[
              {
                title: "Расскажите о себе",
                text: 'Укажите ваши ключевые навыки (например, "JavaScript, Python, коммуникабельность") и основные интересы (например, "разработка игр, анализ данных, помощь людям"). Чем больше деталей, тем точнее рекомендации.',
              },
              {
                title: "Получите AI-рекомендации",
                text: "Наш искусственный интеллект проанализирует ваши данные и предложит список профессий, которые могут вам подойти, с учетом актуальных тенденций рынка труда в Казахстане.",
              },
              {
                title: "Изучите Roadmap",
                text: "Для заинтересовавшей вас профессии AI сгенерирует примерный пошаговый план развития, включая необходимые навыки, курсы и ресурсы, который поможет вам начать движение в выбранном направлении.",
              },
            ].map((step, index) => (
              <li key={index} className="flex">
                <div className="flex-shrink-0">
                  <div className={`flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-full
                                   ${primaryColorBg} text-white font-bold text-lg border-2 border-[#0d2d62] shadow-md
                                   hover:scale-110 hover:shadow-lg transition-all duration-300`}
                  >
                    {index + 1}
                  </div>
                </div>
                <div className="ml-4 sm:ml-6 text-left">
                  <h4 className={`text-lg sm:text-xl font-semibold ${primaryColorText} mb-1`}>
                    {step.title}
                  </h4>
                  <p className={`${secondaryTextColorClass} leading-relaxed`}>{step.text}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <section className="w-full max-w-2xl px-4 pt-12 pb-8">
          <h2 className={`text-3xl font-bold ${primaryColorText} mb-4`}>
            Готовы начать?
          </h2>
          <p className={`text-lg ${secondaryTextColorClass} mb-8`}>
            Сделайте первый шаг к осознанной карьере уже сегодня. Это быстро,
            просто и совершенно бесплатно.
          </p>
          <Link
            href="/survey"
            className={`${buttonPrimaryClasses} w-full sm:w-auto text-lg px-10 py-4`}
          >
            Найти мою профессию
            <TrendingUp
              size={22}
              className="ml-2.5 transition-transform group-hover:translate-x-1"
            />
          </Link>
        </section>
      </div>
    </div>
  );
}