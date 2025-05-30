"use client";

import Link from "next/link";
import {
  Handshake, Users2, Lightbulb, Briefcase, GraduationCap, Megaphone, Mail,
  Target, Rocket, Building, BookOpenCheck, HelpingHand, Send, ArrowLeft, ShieldCheck, Home
} from "lucide-react";

const primaryColorTextClass = "text-[#143c80]";
const primaryColorBorderClass = "border-[#143c80]";
const primaryColorBgClass = "bg-[#143c80]";
const accentColorTextClass = "text-[#0d2d62]";
const accentColorBgClass = "bg-[#0d2d62]";
const secondaryTextColorClass = "text-[#143c80]/80";
const lightBorderColorClass = "border-[#143c80]/20";
const veryLightBgColorClass = "bg-[#143c80]/5";
const lightestBgColorClass = "bg-[#143c80]/10";

const AnimatedBackground = () => (
  <>
    <div className="bgSquaresUp" aria-hidden="true">
      {[...Array(10)].map((_, i) => <div key={`up-${i}`} className="squareUp"></div>)}
    </div>
    <div className="bgSquaresDown" aria-hidden="true">
      {[...Array(10)].map((_, i) => <div key={`down-${i}`} className="squareDown"></div>)}
    </div>
  </>
);

const benefits = [
  { icon: Users2, title: "Доступ к Аудитории", description: "Расширьте свой охват среди мотивированных студентов, выпускников и молодых специалистов в Казахстане, ищущих карьерные пути." },
  { icon: Target, title: "Вклад в Социальную Миссию", description: "Присоединяйтесь к важному делу – помощи казахстанцам в осознанном выборе профессии и построении успешной карьеры." },
  { icon: Megaphone, title: "Узнаваемость Бренда", description: "Повысьте видимость вашей организации или экспертного профиля на нашей платформе и в сопутствующих материалах." },
  { icon: Lightbulb, title: "Инновационные Решения", description: "Станьте частью проекта, использующего AI для персонализированного карьерного консультирования и анализа рынка труда." },
  { icon: BookOpenCheck, title: "Обмен Экспертизой и Ресурсами", description: "Делитесь своими знаниями и ресурсами, получая взамен ценные инсайты и возможности для совместных инициатив." },
  { icon: HelpingHand, title: "Совместный Рост и Развитие", description: "Развивайтесь вместе с нами, создавая новые продукты, услуги или образовательный контент для нашей аудитории." },
];

const partnerTypes = [
  { icon: GraduationCap, title: "Образовательные Учреждения", description: "Университеты, колледжи, онлайн-школы, тренинговые центры. Помогите вашим студентам с выбором карьеры, интегрируйте наши AI-инструменты или делитесь информацией о своих программах." },
  { icon: Building, title: "Компании и Работодатели", description: "Размещайте информацию о стажировках, вакансиях для молодых специалистов, участвуйте в карьерных мероприятиях и делитесь экспертизой о вашей отрасли и корпоративной культуре." },
  { icon: Briefcase, title: "Эксперты и Карьерные Консультанты", description: "Карьерные коучи, менторы, отраслевые специалисты. Создавайте совместный контент (статьи, видео), проводите вебинары или мастер-классы для нашей аудитории." },
  { icon: BookOpenCheck, title: "Создатели Контента и Медиа", description: "Блогеры, журналисты, образовательные платформы. Сотрудничайте в создании полезных и актуальных материалов о карьере, рынке труда и образовании в Казахстане." },
  { icon: Rocket, title: "Технологические Партнеры и Стартапы", description: "Компании, разрабатывающие HR-tech, EdTech или AI-решения. Давайте исследовать возможности интеграции, совместных пилотных проектов и инноваций." },
];


export default function PartnersPage() {
  const buttonPrimaryClasses = `inline-flex items-center justify-center px-8 py-3 text-base font-medium rounded-lg shadow-md ${primaryColorBgClass} text-white hover:${accentColorBgClass} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white focus:ring-[#0d2d62] transition-all duration-300 group hover:scale-105`;

  return (
    <div className="relative min-h-screen bg-white">
      <AnimatedBackground />
      <div className={`relative z-10 font-sans ${primaryColorTextClass} p-4 sm:p-6 md:p-8 pt-20 md:pt-24`}>
        <div className="max-w-5xl mx-auto">
          <header className="mb-12 pt-8 sm:pt-12">
            <div className="text-center">
                <h1 className={`text-5xl sm:text-6xl font-extrabold tracking-tight mb-4 ${primaryColorTextClass}`}>
                    <span className="block">Давайте Строить</span>
                    <span className={`block ${accentColorTextClass} py-1`}>
                        Будущее Вместе
                    </span>
                </h1>
                <p className={`mt-5 text-lg sm:text-xl leading-relaxed ${secondaryTextColorClass} max-w-3xl mx-auto`}>
                    Мы открыты для сотрудничества с организациями и экспертами, разделяющими нашу миссию по развитию карьерных возможностей в Казахстане. Узнайте, как мы можем достичь большего сообща.
                </p>
            </div>
          </header>

          <section id="why-partner" className="w-full scroll-mt-20 mb-16">
            <div className="flex justify-center mb-6">
              <div className={`flex items-center justify-center w-16 h-16 ${lightestBgColorClass} rounded-full border-2 ${lightBorderColorClass}`}>
                <Handshake size={32} className={`${accentColorTextClass}`} />
              </div>
            </div>
            <h2 className={`text-3xl sm:text-4xl font-bold ${accentColorTextClass} mb-10 text-center`}>
              Преимущества Партнерства с Нами
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {benefits.map((benefit) => (
                <div
                  key={benefit.title}
                  className={`bg-white p-6 text-left rounded-xl border ${lightBorderColorClass} shadow-lg hover:shadow-xl hover:border-[#143c80]/30 transition-all duration-300`}
                >
                  <div className={`flex items-center justify-center w-12 h-12 ${lightestBgColorClass} rounded-lg mb-4 border ${lightBorderColorClass}`}>
                    <benefit.icon size={24} className={`${primaryColorTextClass}`} />
                  </div>
                  <h3 className={`text-xl font-semibold ${primaryColorTextClass} mb-2`}>
                    {benefit.title}
                  </h3>
                  <p className={`${secondaryTextColorClass} text-sm leading-relaxed`}>
                    {benefit.description}
                  </p>
                </div>
              ))}
            </div>
          </section>

          <section id="who-we-partner-with" className="w-full scroll-mt-20 mb-16">
            <div className="flex justify-center mb-6">
              <div className={`flex items-center justify-center w-16 h-16 ${lightestBgColorClass} rounded-full border-2 ${lightBorderColorClass}`}>
                <ShieldCheck size={32} className={`${accentColorTextClass}`} />
              </div>
            </div>
            <h2 className={`text-3xl sm:text-4xl font-bold ${accentColorTextClass} mb-10 text-center`}>
              Кого Мы Приглашаем к Сотрудничеству
            </h2>
            <ul className="space-y-6">
              {partnerTypes.map((partnerType) => (
                <li
                  key={partnerType.title}
                  className={`bg-white p-6 rounded-xl shadow-lg border ${lightBorderColorClass} text-left hover:shadow-xl hover:border-[#143c80]/30 transition-all duration-300`}
                >
                  <div className="flex items-start sm:items-center">
                    <div className="flex-shrink-0 mr-4">
                      <div className={`flex items-center justify-center w-10 h-10 ${lightestBgColorClass} rounded-lg border ${lightBorderColorClass}`}>
                        <partnerType.icon size={20} className={`${primaryColorTextClass}`} />
                      </div>
                    </div>
                    <div>
                      <h3 className={`text-lg sm:text-xl font-semibold ${primaryColorTextClass} mb-1`}>
                        {partnerType.title}
                      </h3>
                      <p className={`text-sm ${secondaryTextColorClass} leading-relaxed`}>
                        {partnerType.description}
                      </p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </section>

          <section id="become-partner" className="w-full max-w-2xl mx-auto text-center pt-8 pb-4 mb-12">
            <div className="flex justify-center mb-6">
              <div className={`flex items-center justify-center w-16 h-16 ${lightestBgColorClass} rounded-full border-2 ${lightBorderColorClass}`}>
                <Mail size={32} className={`${accentColorTextClass}`} />
              </div>
            </div>
            <h2 className={`text-3xl sm:text-4xl font-bold ${accentColorTextClass} mb-4`}>
              Готовы к Сотрудничеству?
            </h2>
            <p className={`text-lg ${secondaryTextColorClass} mb-8`}>
              Если у вас есть идеи, предложения или вы хотите узнать больше о
              возможностях партнерства, пожалуйста, свяжитесь с нами. Мы будем рады
              обсудить, как мы можем работать вместе для достижения общих целей!
            </p>
            <a
              href="mailto:AtvAlience@gmail.com?subject=Предложение%20о%20партнерстве"
              className={`${buttonPrimaryClasses} w-full sm:w-auto`}
            >
              Написать нам
              <Send size={20} className="ml-2.5 group-hover:translate-x-1 transition-transform"/>
            </a>
            <p className={`text-sm ${secondaryTextColorClass} mt-6`}>
              Или свяжитесь с нами напрямую по адресу:{" "}
              <a href="mailto:AtvAlience@gmail.com" className={`${accentColorTextClass} hover:underline`}>
                AtvAlience@gmail.com
              </a>
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}